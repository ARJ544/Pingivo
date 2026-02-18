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

export async function POST(req: Request) {
  const cookie = await cookies();
  const owner_email = cookie.get("owner_email")?.value;
  const receiver_name = cookie.get("owner_name")?.value;
  let sender_name = cookie.get("name")?.value;
  let { subject, issueMessage, vehi_num } = await req.json();

  if (!owner_email || !receiver_name) {
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

  const emailData = {
    sender: {
      name: `By ${sender_name} | ParkPing Safety Alerts`,
      email: process.env.DEVELOPER_EMAIL!,
    },
    to: [{ email: owner_email, name: receiver_name }],
    subject: `[ParkPing Safety Alerts]: ${subject}`,
    templateId: 3,
    params: {
      VEHICLE_NUMBER: vehi_num,
      EMERGENCY_MESSAGE: safeMessage,
    },
  };

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

    cookie.delete("owner_phone_num");
    cookie.delete("owner_email");
    cookie.delete("owner_name");

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
