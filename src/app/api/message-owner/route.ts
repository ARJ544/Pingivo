import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function escapeHtml(str: string) {
  return str.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m]!,
  );
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST(req: Request) {
  const cookie = await cookies();
  const receiver_id = cookie.get("receiver_id")?.value;

  const { data: receiverData, error: fetchError } = await supabase
    .from("users")
    .select("name, email")
    .eq("id", receiver_id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!receiverData) {
    return NextResponse.json(
      { error: "User not found. Please sign up." },
      { status: 404 },
    );
  }

  const receiver_name = receiverData.name;
  let receiver_email = receiverData.email;
  let sender_name = cookie.get("name")?.value;

  let { subject, issueMessage, vehi_num } = await req.json();

  if (!receiver_email || !receiver_name || !receiver_id) {
    return NextResponse.json(
      { error: "Something went Wrong. Refresh Page and Try again" },
      { status: 401 },
    );
  }

  if (!sender_name) sender_name = "ParkPing";
  if (!subject)
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  if (!vehi_num)
    return NextResponse.json({ error: "Refresh Page" }, { status: 400 });

  const safeMessage = escapeHtml(issueMessage || "!! No Message Provided !!");
  const safeSubject = escapeHtml(subject);
  const safeVehicle = escapeHtml(vehi_num);
  const safeSender = escapeHtml(sender_name);
  const safeReceiver = escapeHtml(receiver_name);

  const emailData = {
    sender: {
      name: `By ${safeSender} | ParkPing Safety Alerts`,
      email: process.env.DEVELOPER_EMAIL!,
    },
    to: [{ email: receiver_email, name: safeReceiver }],
    subject: `[ParkPing Safety Alerts]: ${safeSubject}`,
    templateId: 3,
    params: {
      VEHICLE_NUMBER: safeVehicle,
      EMERGENCY_MESSAGE: safeMessage,
    },
  };

  cookie.delete("receiver_id");

  const BREVO_API_KEY = process.env.BREVO_API_KEY!;
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(emailData),
    });

    const data = await res.json();

    cookie.delete("receiver_id");

    return NextResponse.json(
      { message: "Email Sent Successfully", data },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error sending email", details: error },
      { status: 500 },
    );
  }
}
