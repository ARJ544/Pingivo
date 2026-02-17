import { NextRequest } from "next/server";
import { twiml } from "twilio";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room") || "default-room";
  const role = searchParams.get("role");

  const response = new twiml.VoiceResponse();

  const isCallerA = role === "A";

  response.dial({ timeLimit: 60, }).conference({
    startConferenceOnEnter: isCallerA ? false : true,
    waitUrl: isCallerA ? "https://twimlets.com/holdmusic?Bucket=com.twilio.music.guitars" : "",
    waitMethod: "GET",
    endConferenceOnExit: true,
    maxParticipants: 2,
  }, room);

  return new Response(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}