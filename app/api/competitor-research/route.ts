import { NextRequest, NextResponse } from "next/server";

const N8N_COMPETITOR_WEBHOOK = process.env.N8N_COMPETITOR_WEBHOOK_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }

    const payload = {
      action: "competitor_research",
      id,
      timestamp: new Date().toISOString(),
    };

    if (!N8N_COMPETITOR_WEBHOOK) {
      // Dev mode mock
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json({ id, accepted: true, message: "Dev mode: competitor research triggered" });
    }

    const n8nRes = await fetch(N8N_COMPETITOR_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!n8nRes.ok) {
      const errText = await n8nRes.text().catch(() => n8nRes.status.toString());
      throw new Error(`n8n returned ${n8nRes.status}: ${errText}`);
    }

    return NextResponse.json({ id, accepted: true, message: "Competitor research triggered" });
  } catch (err) {
    console.error("[competitor-research]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Competitor research failed" },
      { status: 500 }
    );
  }
}
