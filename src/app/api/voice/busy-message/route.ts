import { NextRequest } from "next/server";
import twilio from "twilio";

export async function POST(req: NextRequest) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  twiml.say(
    {
      voice: "Google.en-US-Chirp3-HD-Aoede",
      language: "en-US",
    },
    "The person you are calling is currently busy. Please try again later.",
  );

  twiml.hangup();

  return new Response(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}