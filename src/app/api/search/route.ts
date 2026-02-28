import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserByVehicle } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const carNumber = searchParams.get("crnm")?.toUpperCase();

    if (!carNumber) {
      return NextResponse.json(
        { error: "Car number is required" },
        { status: 400 }
      );
    }

    const userResult = await getUserByVehicle(carNumber);
    if (!userResult.success) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!userResult.user) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const cookie = await cookies();
    cookie.set("receiver_id", userResult.user.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });

    const clientData = {
      name: userResult.user.name,
      vehi1: userResult.user.vehi1,
      vehi1_name: userResult.user.vehi1_name,
      vehi2: userResult.user.vehi2,
      vehi2_name: userResult.user.vehi2_name,
    };

    return NextResponse.json(clientData);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
