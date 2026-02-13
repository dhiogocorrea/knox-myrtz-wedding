import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

/** Verify the request comes from an admin user */
async function verifyAdmin(req: NextRequest) {
  const authPassword = req.headers.get("x-auth-password");
  if (!authPassword) return false;

  const { data, error } = await supabase
    .from("guest_passwords")
    .select("guest_group")
    .eq("password", authPassword)
    .limit(1)
    .maybeSingle();

  if (error || !data) return false;
  return data.guest_group === "admin";
}

/** GET /api/admin/rsvps – list all RSVP submissions */
export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("rsvp_submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Admin list RSVPs failed:", error);
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 });
  }

  return NextResponse.json(data);
}
