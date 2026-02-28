import { NextResponse } from "next/server";
import { getCaller, getCallCredits } from "@/lib/api-helpers";

export async function GET() {
  try {

    const callerResult = await getCaller();
    if (!callerResult.success) {
      return callerResult.response;
    }

    const creditsResult = await getCallCredits(callerResult.caller);
    if (!creditsResult.success) {
      return creditsResult.response;
    }

    return NextResponse.json({
      success: true,
      ...creditsResult.credits,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
