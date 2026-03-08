import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { decryptPhone } from "./crypto";
import { NextResponse } from "next/server";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export function escapeHtml(str: string): string {
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

export interface AuthenticatedUser {
  id: string;
  phone_num: string;
  created_at: string;
  [key: string]: any;
}

/**
 * Authenticates user from cookies and validates against database
 * Checks cookies and verifies phone_num and created_at match database
 */
export async function authenticateUser(
  requireLogin: boolean = true,
): Promise<{ success: false; response: NextResponse } | { success: true; user: AuthenticatedUser }> {
  try {
    const { id, phone_num, secure_validator } = await (
      await import("@/app/actions")
    ).getAllCookie();

    if (requireLogin && (!id || !secure_validator)) {
      return {
        success: false,
        response: NextResponse.json({ error: "Login first" }, { status: 401 }),
      };
    }

    if (!id || !phone_num || !secure_validator) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 },
        ),
      };
    }

    // Fetch user from database
    const { data: user, error } = await supabase
      .from("simplified_users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("User fetch failed:", error);
      return {
        success: false,
        response: NextResponse.json(
          { error: "Internal server error" },
          { status: 500 },
        ),
      };
    }

    if (!user) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "User not found" },
          { status: 404 },
        ),
      };
    }

    if (
      (user.phone_num as string).slice(-4) !== phone_num.slice(-4) ||
      (user.created_at as string) !== secure_validator
    ) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Unauthorized access" },
          { status: 401 },
        ),
      };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      response: NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      ),
    };
  }
}

/**
 * Gets the caller phone number from temp_phone cookie or authenticated user
 */
export async function getCaller(
  userId?: string,
): Promise<{ success: false; response: NextResponse } | { success: true; caller: string }> {
  try {
    const cookieStore = await cookies();
    const tempPhoneValue = cookieStore.get("temp_phone")?.value;

    if (tempPhoneValue) {
      const caller = await decryptPhone(tempPhoneValue);
      if (caller) {
        return { success: true, caller };
      }
    }

    let userIdToUse = userId;
    if (!userIdToUse) {
      const { id } = await (await import("@/app/actions")).getAllCookie();
      userIdToUse = id;
    }

    if (!userIdToUse) {
      return {
        success: false,
        response: NextResponse.json({ error: "Login first" }, { status: 401 }),
      };
    }

    const { data: userData, error } = await supabase
      .from("simplified_users")
      .select("phone_num")
      .eq("id", userIdToUse)
      .single();

    if (error || !userData) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "User not found" },
          { status: 404 },
        ),
      };
    }

    return { success: true, caller: userData.phone_num };
  } catch (error) {
    console.error("Get caller error:", error);
    return {
      success: false,
      response: NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      ),
    };
  }
}

export interface CallCreditsData {
  callCredits: number;
  creditsUsed: number;
  totalCredits: number;
}

/**
 * Gets remaining call credits for a phone number
 */
export async function getCallCredits(
  phoneNum: string,
): Promise<{ success: false; response: NextResponse } | { success: true; credits: CallCreditsData }> {
  try {
    const { data, error } = await supabase
      .from("calling_credits")
      .select("credits_used")
      .eq("phone_num", phoneNum)
      .maybeSingle();

    if (error) {
      console.error("Credits fetch failed:", error);
      return {
        success: false,
        response: NextResponse.json(
          { error: "Internal server error" },
          { status: 500 },
        ),
      };
    }

    const TOTAL_CREDITS = 3;
    const creditsUsed = data?.credits_used ?? 0;
    const callCredits = Math.max(0, TOTAL_CREDITS - creditsUsed);

    return {
      success: true,
      credits: {
        callCredits,
        creditsUsed,
        totalCredits: TOTAL_CREDITS,
      },
    };
  } catch (error) {
    console.error("Get call credits error:", error);
    return {
      success: false,
      response: NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      ),
    };
  }
}

export interface BrevoEmailData {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{ email: string; name: string }>;
  subject: string;
  templateId: number;
  params: Record<string, string>;
}

/**
 * Sends email via Brevo API
 */
export async function sendBrevoEmail(
  emailData: BrevoEmailData,
): Promise<{ success: false; error: string; details?: any } | { success: true; data: any }> {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    if (!BREVO_API_KEY) {
      return {
        success: false,
        error: "Email service not configured",
      };
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to send email",
        details: data,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Brevo email error:", error);
    return {
      success: false,
      error: "Error sending email",
      details: error,
    };
  }
}


/**
 * Fetches user by ID with all fields
 */
export async function getUserByFinderId(userFinderId: string) {
  try {
    const { data: user, error } = await supabase
      .from("simplified_users")
      .select("*")
      .eq("finder_id", userFinderId)
      .single();

    if (error) {
      return { success: false, error };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Fetches user by phone number
 */
export async function getFinderIdById(id: string) {
  try {
    const { data, error } = await supabase
      .from("simplified_users")
      .select("finder_id")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return { success: false, error };
    }

    return { success: true, user: data?.finder_id };
  } catch (error) {
    return { success: false, error };
  }
}
/**
 * Fetches user by phone number
 */
export async function getUserByPhone(phoneNum: string) {
  try {
    const { data, error } = await supabase
      .from("simplified_users")
      .select("*")
      .eq("phone_num", phoneNum)
      .maybeSingle();

    if (error) {
      return { success: false, error };
    }

    return { success: true, user: data };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Verifies password against hashed password
 */
export async function verifyPassword(
  inputPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    const bcrypt = (await import("bcrypt")).default;
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch {
    return false;
  }
}

/**
 * Hashes a password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const bcrypt = (await import("bcrypt")).default;
    return await bcrypt.hash(password, 10);
  } catch {
    throw new Error("Failed to hash password");
  }
}
