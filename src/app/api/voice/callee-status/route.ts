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

    if (!room || !status || !caller) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (status === "completed" || status === "in-progress") {
      await addCredit(caller);
      return NextResponse.json({ success: true });
    }

    if (["no-answer", "busy", "failed"].includes(status)) {

      const results = await Promise.allSettled([
        callerCallSid
          ? playBusyMessage(callerCallSid)
          : Promise.resolve(),
        endConferenceRoom(room),
      ]);

      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`Async task ${i} failed:`, r.reason);
        }
      });

      const record = await getCallerRecord(caller);

      if (!record) {
        await upsertRecord(caller, {
          unsuccessful_attempts: 1,
          credits_used: 0,
        });
        return NextResponse.json({ success: true });
      }

      const attempts = (record?.unsuccessful_attempts ?? 0) + 1;
      const credits = record?.credits_used ?? 0;

      if (attempts >= 2) {
        await upsertRecord(caller, {
          unsuccessful_attempts: 0,
          credits_used: credits + 1,
        });
      } else {
        await upsertRecord(caller, {
          unsuccessful_attempts: attempts,
        });
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

  await upsertRecord(caller, {
    credits_used: newCredits,
    unsuccessful_attempts: record?.unsuccessful_attempts ?? 0,
  });
}

async function upsertRecord(
  caller: string,
  fields: {
    credits_used?: number;
    unsuccessful_attempts?: number;
  }
) {
  const { error } = await supabase
    .from("calling_credits")
    .upsert(
      {
        phone_num: caller,
        ...fields,
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

  await Promise.all(
    conferences.map((c) =>
      twilio.conferences(c.sid).update({ status: "completed" })
    )
  );
}