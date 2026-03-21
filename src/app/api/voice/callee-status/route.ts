import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";

const twilio = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const status = formData.get("CallStatus") as string | null;

    const { searchParams } = new URL(req.url);
    const room = searchParams.get("room");
    const caller = searchParams.get("caller");
    const callerCallSid = searchParams.get("callerCallSid");
    console.log("Callee Status Update:", { room, caller, status, callerCallSid });

    if (!room || !status || !caller) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (status === "completed") {
      await addCredit(caller);
      return NextResponse.json({ success: true });
    }

    if (["no-answer", "busy", "failed"].includes(status)) {

      const [r1, r2, recordResult] = await Promise.allSettled([
        callerCallSid ? playBusyMessage(callerCallSid) : Promise.resolve(),
        endConferenceRoom(room),
        getCallerRecord(caller),
      ]);

      [r1, r2].forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`Async task ${i} failed:`, r.reason);
        }
      });

      if (recordResult.status === "rejected") {
        console.error("getCallerRecord failed:", recordResult.reason);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }

      const record = recordResult.value;

      if (!record) {
        await upsertRecord(caller, 0, 1);
        return NextResponse.json({ success: true });
      }

      const attempts = (record.unsuccessful_attempts ?? 0) + 1;
      const credits = record.credits_used ?? 0;

      if (attempts >= 2) {
        await upsertRecord(caller, credits + 1, 0);
      } else {
        await upsertRecord(caller, credits, attempts);
      }
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


async function getCallerRecord(caller: string) {
  const { data, error } = await supabase
    .from("calling_credits")
    .select("credits_used, unsuccessful_attempts")
    .eq("phone_num", caller)
    .maybeSingle();

  if (error) {
    console.error("DB read error:", error);
    throw new Error("Database read failed");
  }

  return data;
}

async function addCredit(caller: string) {
  const record = await getCallerRecord(caller);

  const newCredits = (record?.credits_used ?? 0) + 1;

  await upsertRecord(caller, newCredits, record?.unsuccessful_attempts ?? 0);
}

async function upsertRecord(
  caller: string,
  credits_used?: number,
  unsuccessful_attempts?: number,
  is_calling: boolean = false,
) {
  const { error } = await supabase
    .from("calling_credits")
    .upsert(
      {
        phone_num: caller,
        credits_used: credits_used,
        unsuccessful_attempts: unsuccessful_attempts,
        is_calling: is_calling,
      },
      { onConflict: "phone_num" }
    );

  if (error) {
    console.error("DB write error:", error);
    throw new Error("Database write failed");
  }
}

async function playBusyMessage(callSid: string) {
  await twilio.calls(callSid).update({
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/busy-message`,
    method: "POST",
  });
}

async function endConferenceRoom(room: string) {
  const conferences = await twilio.conferences.list({
    friendlyName: room,
    status: "in-progress",
  });

  await Promise.allSettled(
    conferences.map((c) =>
      twilio.conferences(c.sid).update({ status: "completed" })
    )
  );
}