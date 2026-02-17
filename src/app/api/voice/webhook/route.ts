import { NextRequest } from "next/server";
import { twiml } from "twilio";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");

  const response = new twiml.VoiceResponse();
  response.dial({ timeLimit: 60, }).conference({
    maxParticipants: 2,
    waitUrl: "http://twimlets.com/holdmusic?Bucket=com.twilio.music.guitars",
    waitMethod: "GET",
  }, room || "default-room");

  return new Response(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}