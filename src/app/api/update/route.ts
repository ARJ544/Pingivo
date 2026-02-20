import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getAllCookie, deleteAllCookie, setAllCookie } from "@/app/actions";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

function escapeHtml(str: string) {
  return str.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m]!,
  );
}

export async function POST(request: Request) {
  try {
    const { loggedin, id, phone_num, secure_validator } = await getAllCookie();

    if (!loggedin || !id) {
      return NextResponse.json({ error: "Login first" }, { status: 401 });
    }

    const { name, email, password } = await request.json();
    let newName = name;
    let newEmail = email;
    let newPassword = password;

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("name, email, password, phone_num, created_at")
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

    if (!newName) {
      newName = user.name;
    }
    if (!newEmail) {
      newEmail = user.email;
    }
    if (!newPassword) {
      newPassword = user.password;
    } else {
      newPassword = await bcrypt.hash(password, 10);
    }

    const { data: updateData, error: updateError } = await supabase
      .from("users")
      .update({ name: newName, email: newEmail, password: newPassword })
      .eq("id", id)
      .select(
        "id, name, email, phone_num, vehi1, vehi2, vehi1_name, vehi2_name, secret_code, created_at, verified",
      )
      .maybeSingle();

    if (updateError) {
      if (updateError.code === "23505") {
        return NextResponse.json(
          { error: "Email or phone already exists" },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    if (!updateData) {
      return NextResponse.json(
        { error: "No user found. Please sign up." },
        { status: 404 },
      );
    }

    const safeReceiver = escapeHtml(updateData.email);
    const secretcode = updateData.secret_code;
    
    const emailData = {
      sender: {
        name: `ParkPing Safety Alerts`,
        email: process.env.DEVELOPER_EMAIL!,
      },
      to: [{ email: safeReceiver, name: escapeHtml(updateData.name) }],
      subject: "Account Updated on ParkPing",
      templateId: 5,
      params: {
        WHAT_DID: "Updated",
        NAME: escapeHtml(updateData.name),
        EMAIL: safeReceiver || "Your Email",
        SECRET_CODE: secretcode || "Failed to fetch",
        WEBSITE_LINK: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password`,
      },
    };

    const BREVO_API_KEY = process.env.BREVO_API_KEY!;
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify(emailData),
      });

    } catch (error) {
      return NextResponse.json(
        { error: "Your Account details was updated but we failed to send you an email!", details: error },
        { status: 500 },
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
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
