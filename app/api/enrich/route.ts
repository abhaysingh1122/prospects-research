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
      action: "generate strategy",
      id,
      timestamp: new Date().toISOString(),
    };

    if (!N8N_WEBHOOK) {
      // Dev mode mock
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json({
        id,
        enrich_data: {
          leads: [
            { name: "Sarah Chen", title: "VP of Sales", email: "sarah.chen@example.com", linkedin: "https://linkedin.com/in/sarachen", phone: "+1-555-0101" },
            { name: "James Miller", title: "Head of Partnerships", email: "j.miller@example.com", linkedin: "https://linkedin.com/in/jamesmiller" },
            { name: "Priya Patel", title: "Director of Operations", email: "priya.p@example.com", linkedin: "https://linkedin.com/in/priyapatel", phone: "+1-555-0203" },
          ],
          enrichment_summary: "Found 3 key decision makers. Primary contact: VP of Sales with direct email and phone available.",
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
    const raw = Array.isArray(rawJson) ? rawJson[0] : rawJson;

    return NextResponse.json({ id, enrich_data: raw });
  } catch (err) {
    console.error("[enrich]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Enrichment failed" },
      { status: 500 }
    );
  }
}
