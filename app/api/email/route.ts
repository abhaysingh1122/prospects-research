import { NextRequest, NextResponse } from "next/server";

// Same webhook â€” n8n Switch routes by action field
const N8N_WEBHOOK = process.env.N8N_RESEARCH_WEBHOOK_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }

    const payload = {
      action: "draft email",
      id,
      timestamp: new Date().toISOString(),
    };

    if (!N8N_WEBHOOK) {
      // Dev mode mock
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json({
        id,
        email_draft: {
          subject: "Partnership opportunity â€” let's connect",
          body: "Hi [Contact Name],\n\nI came across your company and was impressed by your work in the data security space.\n\nI'd love to explore how we could collaborate. Your recent Gartner recognition caught my attention, and I think there's a strong fit between our capabilities.\n\nWould you be open to a 20-minute call this week?\n\nBest,\nAbhay",
          to: "contact@example.com",
        },
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
    // n8n Respond to Webhook may return:
    // [{ subject, body }] or [{ json: { subject, body } }] or { subject, body }
    const item = Array.isArray(rawJson) ? rawJson[0] : rawJson;
    const raw = (item && typeof item === 'object' && 'json' in item && typeof item.json === 'object') ? item.json : item;

    const email_draft = {
      subject: raw["subject"] || raw["Subject"] || "",
      body: raw["body"] || raw["Body"] || "",
      to: raw["to"] || raw["To"] || "",
    };

    return NextResponse.json({ id, email_draft });
  } catch (err) {
    console.error("[draft-email]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Email draft failed" },
      { status: 500 }
    );
  }
}
