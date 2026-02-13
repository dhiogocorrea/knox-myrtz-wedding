import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Missing password" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("guest_passwords")
      .select("guest_name, guest_group")
      .eq("password", password)
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      guestName: data.guest_name,
      guestGroup: data.guest_group,
    });
  } catch (err) {
    console.error("Auth login failed:", {
      message: err instanceof Error ? err.message : typeof err === 'object' ? JSON.stringify(err) : String(err),
      details: err instanceof Error ? err.stack : '',
      hint: '',
      code: '',
      raw: err,
    });
    return NextResponse.json(
      { error: "Authentication failed. Please check your network connection and try again." },
      { status: 500 }
    );
  }
}
