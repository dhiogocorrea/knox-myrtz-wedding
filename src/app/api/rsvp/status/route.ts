import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Missing password" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("rsvp_submissions")
      .select("submitted_at")
      .eq("password", password)
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      submitted: !!data,
      submittedAt: data?.submitted_at ?? null,
    });
  } catch (err) {
    console.error("RSVP status check failed:", err);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
