import { NextRequest, NextResponse } from "next/server";

const N8N_EMAIL_WEBHOOK = process.env.N8N_EMAIL_WEBHOOK_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, company_name, linkedin_url, research_data } = body;

    if (!id || !company_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!N8N_EMAIL_WEBHOOK) {
      // Dev mode: return mock email draft
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json({
        id,
        subject: `Partnership opportunity with ${company_name}`,
        body: `Hi [Contact Name],

I came across ${company_name} and was impressed by your work in ${research_data?.industry || "your industry"}.

I'd love to explore how we could collaborate on [specific opportunity]. Your recent [recent achievement] caught my attention.

Would you be open to a 20-minute call this week?

Best,
Abhay`,
        to: "",
      });
    }

    const n8nRes = await fetch(N8N_EMAIL_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, company_name, linkedin_url, research_data }),
    });

    if (!n8nRes.ok) {
      throw new Error(`n8n webhook failed: ${n8nRes.status}`);
    }

    const data = await n8nRes.json();
    return NextResponse.json({ id, ...data });
  } catch (err) {
    console.error("Email draft error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Email draft failed" },
      { status: 500 }
    );
  }
}
