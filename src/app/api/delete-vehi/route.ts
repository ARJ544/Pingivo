import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { deleteAllCookie, getAllCookie, setAllCookie } from "@/app/actions";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST(request: Request) {
  try {
    const { loggedin, id, phone_num, secure_validator } = await getAllCookie();

    if (!loggedin || !id) {
      return NextResponse.json({ error: "Login first" }, { status: 401 });
    }

    const { selectedVehicle } = await request.json();

    if (!selectedVehicle) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("vehi1, vehi2, phone_num, created_at")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign up." },
        { status: 404 },
      );
    }

    if ((user.phone_num as string).slice(-4) != phone_num?.slice(-4) || (user.created_at as string) != secure_validator) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 404 },
      );
    }

    let validVehiNumberColumn = "vehi1";
    let validVehiNameColumn = "vehi1_name";
    if (user?.vehi2 === selectedVehicle) {
      validVehiNumberColumn = "vehi2";
      validVehiNameColumn = "vehi2_name";
    }

    if (!user?.vehi1 && !user?.vehi2) {
      return NextResponse.json(
        { error: "No vehicle registered." },
        { status: 500 },
      );
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ [validVehiNumberColumn]: null, [validVehiNameColumn]: null })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    const { data: latestDetails, error } = await supabase
      .from("users")
      .select(
        "id, name, phone_num, vehi1, vehi2, vehi1_name, vehi2_name, verified",
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!latestDetails) {
      return NextResponse.json(
        { error: "No user found. Please sign up." },
        { status: 404 },
      );
    }

    await deleteAllCookie();
    await setAllCookie({
      loggedin: true,
      id: latestDetails.id,
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
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
