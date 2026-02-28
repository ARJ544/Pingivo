import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { deleteAllCookie, setAllCookie } from "@/app/actions";
import {
  authenticateUser,
  escapeHtml,
  sendBrevoEmail,
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
    const { name, email, password } = await request.json();

    let newName = name || authResult.user.name;
    let newEmail = email || authResult.user.email;
    let newPassword = password
      ? await bcrypt.hash(password, 10)
      : authResult.user.password;

    const { data: updateData, error: updateError } = await supabase
      .from("users")
      .update({ name: newName, email: newEmail, password: newPassword })
      .eq("id", userId)
      .select(
        "id, name, email, phone_num, vehi1, vehi2, vehi1_name, vehi2_name, secret_code, created_at, verified"
      )
      .maybeSingle();

    if (updateError) {
      if (updateError.code === "23505") {
        return NextResponse.json(
          { error: "Email or phone already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    if (!updateData) {
      return NextResponse.json(
        { error: "No user found. Please sign up." },
        { status: 404 }
      );
    }

    const emailResult = await sendBrevoEmail({
      sender: {
        name: "ParkPing Safety Alerts",
        email: process.env.DEVELOPER_EMAIL!,
      },
      to: [
        { email: updateData.email, name: escapeHtml(updateData.name) },
      ],
      subject: "Account Updated on ParkPing",
      templateId: 5,
      params: {
        WHAT_DID: "Updated",
        NAME: escapeHtml(updateData.name),
        EMAIL: updateData.email || "Your Email",
        SECRET_CODE: updateData.secret_code || "Failed to fetch",
        WEBSITE_LINK: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password`,
      },
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          error:
            "Your Account details was updated but we failed to send you an email!",
          details: emailResult.error,
        },
        { status: 500 }
      );
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
        message: "Updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
