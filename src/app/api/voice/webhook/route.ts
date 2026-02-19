import { NextRequest } from "next/server";
import twilio from "twilio";
import { twiml } from "twilio";

export async function POST(req: NextRequest) {
  const url =
    process.env.NEXT_PUBLIC_FRONTEND_URL +
    req.nextUrl.pathname +
    "?" +
    req.nextUrl.searchParams.toString();

  const isValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    req.headers.get("x-twilio-signature")!,
    url,
    Object.fromEntries(await req.formData()),
  );

  if (!isValid) {
    return new Response("Invalid Twilio signature", { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");
  const role = searchParams.get("role");

  const response = new twiml.VoiceResponse();

  if (!room || !role || !["A", "B"].includes(role)) {
    response.say(
      {
        voice: "Google.en-US-Chirp3-HD-Aoede",
        language: "en-US",
      },
      "Invalid call details. The call will now end. Thank you."
    );

    response.hangup();
    return new Response(response.toString(), {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }

  const isCallerA = role === "A";

  response.dial({ timeLimit: 57 }).conference(
    {
      startConferenceOnEnter: isCallerA ? false : true,
      waitUrl: "https://twimlets.com/holdmusic?Bucket=com.twilio.music.guitars",
      waitMethod: "GET",
      endConferenceOnExit: true,
      maxParticipants: 2,
    },
    room,
  );

  return new Response(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
