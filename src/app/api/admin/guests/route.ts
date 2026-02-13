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

/** GET /api/admin/guests – list all guest passwords */
export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("guest_passwords")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin list guests failed:", error);
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 });
  }

  return NextResponse.json(data);
}

/** POST /api/admin/guests – create a new guest password */
export async function POST(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { password, guest_name, guest_group } = await req.json();

  if (!password || !guest_group) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!["friends", "family", "admin"].includes(guest_group)) {
    return NextResponse.json({ error: "Invalid guest_group" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("guest_passwords")
    .insert({ password, guest_name: guest_name || null, guest_group })
    .select()
    .single();

  if (error) {
    console.error("Admin create guest failed:", error);
    if (error.code === "23505") {
      return NextResponse.json({ error: "Password already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

/** PUT /api/admin/guests – update an existing guest password */
export async function PUT(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, password, guest_name, guest_group } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (guest_group && !["friends", "family", "admin"].includes(guest_group)) {
    return NextResponse.json({ error: "Invalid guest_group" }, { status: 400 });
  }

  const updates: Record<string, string | null> = {};
  if (password !== undefined) updates.password = password;
  if (guest_name !== undefined) updates.guest_name = guest_name || null;
  if (guest_group !== undefined) updates.guest_group = guest_group;

  const { data, error } = await supabase
    .from("guest_passwords")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Admin update guest failed:", error);
    if (error.code === "23505") {
      return NextResponse.json({ error: "Password already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 });
  }

  return NextResponse.json(data);
}

/** DELETE /api/admin/guests – delete a guest password */
export async function DELETE(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("guest_passwords")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Admin delete guest failed:", error);
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
