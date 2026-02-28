import { NextResponse } from "next/server";
import { deleteAllCookie, setAllCookie } from "@/app/actions";
import {
  authenticateUser,
  verifyPassword,
  supabase,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const authResult = await authenticateUser(true);
    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.user.id;
    let { password, vehiNum, vehiName } = await request.json();

    if (!password || !vehiNum || !vehiName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    vehiNum = vehiNum.toUpperCase().trim();
    vehiName = vehiName.toUpperCase().trim();

    const passwordMatch = await verifyPassword(
      password,
      authResult.user.password
    );
    if (!passwordMatch) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    let validVehiNumberColumn = "vehi1";
    if (authResult.user.vehi1) {
      validVehiNumberColumn = "vehi2";
    }
    let validVehiNameColumn = "vehi1_name";
    if (authResult.user.vehi1_name) {
      validVehiNameColumn = "vehi2_name";
    }

    if (authResult.user.vehi1 && authResult.user.vehi2) {
      return NextResponse.json(
        { error: "Your slot is full 2/2" },
        { status: 500 }
      );
    }
    if (authResult.user.vehi1_name && authResult.user.vehi2_name) {
      return NextResponse.json(
        {
          error:
            "Your Name field is showing 2/2 (completely filled), but perhaps one slot is still available for adding a Vehicle Number.",
        },
        { status: 500 }
      );
    }

    const { data: existingVehicle } = await supabase
      .from("users")
      .select("id")
      .or(`vehi1.eq.${vehiNum},vehi2.eq.${vehiNum}`)
      .maybeSingle();

    if (existingVehicle) {
      return NextResponse.json(
        { error: "Vehicle number already registered" },
        { status: 409 }
      );
    }

    const { data: updateData, error: updateError } = await supabase
      .from("users")
      .update({
        [validVehiNumberColumn]: vehiNum,
        [validVehiNameColumn]: vehiName,
      })
      .eq("id", userId)
      .select(
        "id, name, phone_num, vehi1, vehi2, vehi1_name, vehi2_name, created_at, verified"
      )
      .single();

    if (updateError) {
      if (updateError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "This car number already exists. If it was not added by you, Please contact me.",
          },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    await deleteAllCookie();
    await setAllCookie({
      loggedin: true,
      id: updateData.id,
      secure_validator: updateData.created_at,
      name: updateData.name,
      phone_num: updateData.phone_num,
      vehi1: updateData.vehi1,
      vehi1_name: updateData.vehi1_name,
      vehi2: updateData.vehi2,
      vehi2_name: updateData.vehi2_name,
      verified: updateData.verified,
    });

    return NextResponse.json(
      {
        message: "Vehicle Registered successfully",
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
