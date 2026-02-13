import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const googleFormUrl = body.get("_googleFormUrl") as string;

    if (!googleFormUrl) {
      return NextResponse.json({ error: "Missing form URL" }, { status: 400 });
    }

    // Remove our internal field before forwarding
    body.delete("_googleFormUrl");

    const response = await fetch(googleFormUrl, {
      method: "POST",
      body,
    });

    if (response.ok || response.status === 200) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Google Forms rejected the submission" },
      { status: response.status }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit" },
      { status: 500 }
    );
  }
}
