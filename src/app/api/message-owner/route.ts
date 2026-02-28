import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { escapeHtml, sendBrevoEmail, getUserById } from "@/lib/api-helpers";

export async function POST(req: Request) {
  try {
    const cookie = await cookies();
    const receiver_id = cookie.get("receiver_id")?.value;

    if (!receiver_id) {
      return NextResponse.json(
        { error: "Something went Wrong. Refresh Page and Try again" },
        { status: 401 }
      );
    }

    const receiverResult = await getUserById(receiver_id);
    if (!receiverResult.success || !receiverResult.user) {
      return NextResponse.json(
        { error: "User not found. Please sign up." },
        { status: 404 }
      );
    }

    const receiver_name = receiverResult.user.name;
    const receiver_email = receiverResult.user.email;
    let sender_name = cookie.get("name")?.value || "ParkPing";

    let { subject, issueMessage, vehi_num } = await req.json();

    if (!receiver_email || !receiver_name) {
      return NextResponse.json(
        { error: "Something went Wrong. Refresh Page and Try again" },
        { status: 401 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!vehi_num) {
      return NextResponse.json({ error: "Refresh Page" }, { status: 400 });
    }

    const emailData = {
      sender: {
        name: `By ${escapeHtml(sender_name)} | ParkPing Safety Alerts`,
        email: process.env.DEVELOPER_EMAIL!,
      },
      to: [{ email: receiver_email, name: escapeHtml(receiver_name) }],
      subject: `[ParkPing Safety Alerts]: ${escapeHtml(subject)}`,
      templateId: 3,
      params: {
        VEHICLE_NUMBER: escapeHtml(vehi_num),
        EMERGENCY_MESSAGE:
          escapeHtml(issueMessage) || "!! No Message Provided !!",
      },
    };

    const emailResult = await sendBrevoEmail(emailData);
    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Error sending email", details: emailResult.error },
        { status: 500 }
      );
    }

    cookie.delete("receiver_id");

    return NextResponse.json(
      { message: "Email Sent Successfully", data: emailResult.data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error sending email", details: error },
      { status: 500 }
    );
  }
}
