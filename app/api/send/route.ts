import { NextRequest, NextResponse } from "next/server";

const N8N_SEND_WEBHOOK = process.env.N8N_SEND_WEBHOOK_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, company_name, email_draft } = body;

    if (!id || !email_draft) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!N8N_SEND_WEBHOOK) {
      // Dev mode: simulate send
      await new Promise((r) => setTimeout(r, 1000));
      return NextResponse.json({
        id,
        sent_at: new Date().toISOString(),
        message: "Email sent successfully (dev mode)",
      });
    }

    const n8nRes = await fetch(N8N_SEND_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, company_name, email_draft }),
    });

    if (!n8nRes.ok) {
      throw new Error(`n8n webhook failed: ${n8nRes.status}`);
    }

    const data = await n8nRes.json();
    return NextResponse.json({ id, sent_at: new Date().toISOString(), ...data });
  } catch (err) {
    console.error("Send error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Send failed" },
      { status: 500 }
    );
  }
}
