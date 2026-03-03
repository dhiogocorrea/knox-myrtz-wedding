import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Missing password" }, { status: 400 });
    }

    // Get guest group from guest_passwords
    const { data: pwData, error: pwError } = await supabase
      .from("guest_passwords")
      .select("guest_group")
      .eq("password", password)
      .limit(1)
      .maybeSingle();

    if (pwError) throw pwError;

    // Check if RSVP already submitted
    const { data: submission, error: subError } = await supabase
      .from("rsvp_submissions")
      .select("submitted_at")
      .eq("password", password)
      .limit(1)
      .maybeSingle();

    if (subError) throw subError;

    return NextResponse.json({
      submitted: !!submission,
      submittedAt: submission?.submitted_at ?? null,
      guestGroup: pwData?.guest_group ?? null,
    });
  } catch (err) {
    console.error("RSVP status check failed:", err);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
