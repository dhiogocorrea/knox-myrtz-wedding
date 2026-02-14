import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { password, name, email, phone, attendance, guests, kids, message } =
      await req.json();

    if (!password || !name || !email || !phone || !attendance) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify password exists
    const { data: pwData, error: pwError } = await supabase
      .from("guest_passwords")
      .select("id")
      .eq("password", password)
      .limit(1)
      .maybeSingle();

    if (pwError) throw pwError;
    if (!pwData) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Check if already submitted
    const { data: existing, error: existError } = await supabase
      .from("rsvp_submissions")
      .select("id")
      .eq("password", password)
      .limit(1)
      .maybeSingle();

    if (existError) throw existError;
    if (existing) {
      return NextResponse.json(
        { error: "RSVP already submitted for this account" },
        { status: 409 }
      );
    }

    // Insert RSVP
    const { error: insertError } = await supabase
      .from("rsvp_submissions")
      .insert({
        password,
        guest_name: name,
        email,
        phone,
        attendance,
        guests: parseInt(guests) || 1,
        kids: parseInt(kids as any) || 0,
        message: message || null,
      });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("RSVP submission failed:", err);
    return NextResponse.json(
      { error: "Failed to submit" },
      { status: 500 }
    );
  }
}
