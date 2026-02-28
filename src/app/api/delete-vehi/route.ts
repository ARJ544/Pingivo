import { NextResponse } from "next/server";
import { deleteAllCookie, setAllCookie } from "@/app/actions";
import { authenticateUser, supabase } from "@/lib/api-helpers";

export async function POST(request: Request) {
  try {
    const authResult = await authenticateUser(true);
    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.user.id;
    const { selectedVehicle } = await request.json();

    if (!selectedVehicle) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    let validVehiNumberColumn = "vehi1";
    let validVehiNameColumn = "vehi1_name";
    if (authResult.user.vehi2 === selectedVehicle) {
      validVehiNumberColumn = "vehi2";
      validVehiNameColumn = "vehi2_name";
    }

    if (!authResult.user.vehi1 && !authResult.user.vehi2) {
      return NextResponse.json(
        { error: "No vehicle registered." },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        [validVehiNumberColumn]: null,
        [validVehiNameColumn]: null,
      })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    const { data: latestDetails, error } = await supabase
      .from("users")
      .select(
        "id, name, phone_num, vehi1, vehi2, vehi1_name, vehi2_name, created_at, verified"
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!latestDetails) {
      return NextResponse.json(
        { error: "No user found. Please sign up." },
        { status: 404 }
      );
    }

    // Update session cookies
    await deleteAllCookie();
    await setAllCookie({
      loggedin: true,
      id: latestDetails.id,
      secure_validator: latestDetails.created_at,
      name: latestDetails.name,
      phone_num: latestDetails.phone_num,
      vehi1: latestDetails.vehi1,
      vehi1_name: latestDetails.vehi1_name,
      vehi2: latestDetails.vehi2,
      vehi2_name: latestDetails.vehi2_name,
      verified: latestDetails.verified,
    });

    return NextResponse.json(
      {
        message: "Vehicle removed successfully",
      },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
