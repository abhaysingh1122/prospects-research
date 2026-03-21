import { NextRequest, NextResponse } from "next/server";

// Same webhook â€” n8n Switch routes by action field
const N8N_WEBHOOK = process.env.N8N_RESEARCH_WEBHOOK_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, to, subject, body: emailBody } = body;

    if (!id || !to || !subject) {
      return NextResponse.json({ error: "Missing required fields: id, to, subject" }, { status: 400 });
    }

    const payload = {
      action: "send email",
      id,
      to,
      subject,
      body: emailBody,
      timestamp: new Date().toISOString(),
    };

    if (!N8N_WEBHOOK) {
      // Dev mode mock
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json({
        id,
        sent_at: new Date().toISOString(),
        message_id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      });
    }

    const n8nRes = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!n8nRes.ok) {
      const errText = await n8nRes.text().catch(() => n8nRes.status.toString());
      throw new Error(`n8n returned ${n8nRes.status}: ${errText}`);
    }

    const rawJson = await n8nRes.json();
    const item = Array.isArray(rawJson) ? rawJson[0] : rawJson;
    const raw = (item && typeof item === 'object' && 'json' in item && typeof item.json === 'object') ? item.json : item;

    // n8n returns: { "Message id": "rec...", "Status": "SENT" }
    return NextResponse.json({
      id,
      sent_at: new Date().toISOString(),
      message_id: raw["Message id"] || raw["Message ID"] || raw["message_id"] || raw["messageId"] || "",
      status: raw["Status"] || raw["status"] || "SENT",
    });
  } catch (err) {
    console.error("[send-email]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Send failed" },
      { status: 500 }
    );
  }
}
