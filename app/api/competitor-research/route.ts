import { NextRequest, NextResponse } from "next/server";

// Same webhook as research â€” n8n Switch routes by action field
const N8N_COMPETITOR_WEBHOOK = process.env.N8N_RESEARCH_WEBHOOK_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }

    const payload = {
      action: "competitor research",
      id,
      timestamp: new Date().toISOString(),
    };

    if (!N8N_COMPETITOR_WEBHOOK) {
      // Dev mode mock
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json({
        id,
        competitor_data: {
          company_size: "Enterprise",
          business_model: "B2B SaaS",
          target_market: "Enterprise businesses looking to automate document workflows and contract management at scale.",
          company_values: "Innovation, customer success, integrity, and operational excellence.",
          products: "â€¢ Document Automation\n  Streamline document creation and approval workflows.\n\nâ€¢ Contract Lifecycle Management\n  End-to-end contract management from creation to renewal.",
          industries_served: "Technology, Financial Services, Healthcare, Manufacturing",
          pain_points: "â€¢ Complex contract management processes slow down deals\nâ€¢ Inefficient pricing workflows reduce revenue potential\nâ€¢ Manual document generation is error-prone and time-consuming",
          outreach_angle: "Position as the all-in-one revenue lifecycle management solution that eliminates bottlenecks from quote to cash.",
          recent_news: "Recently launched AI-powered contract intelligence features and expanded integrations with Salesforce and Microsoft 365.",
          real_matrix: "â€¢ 50% reduction in quote creation time\nâ€¢ 8% increase in revenue\nâ€¢ 70% faster contract turnaround",
          competitor_name: "Ironclad",
          competitor_website: "https://ironcladapp.com/",
          competitor_description: "Ironclad is a digital contracting platform focused on legal teams, offering AI-powered contract management and collaboration tools.",
          competitor_market_position: "Strong in mid-market to enterprise legal departments, positioned as a modern alternative to legacy CLM tools.",
          competitor_difference: "â€¢ Heavy use of AI for contract analysis and risk detection\nâ€¢ Offers a highly integrated platform for legal-sales collaboration\nâ€¢ Strong workflow automation capabilities",
          competitor_strength: "â€¢ Industry recognition and strong brand among legal professionals\nâ€¢ Strong focus on user friendliness and modern UX\nâ€¢ Deep Salesforce and other CRM integrations",
          gap_opportunities: "â€¢ Limited explicit mention of pricing optimization or CPQ capabilities\nâ€¢ Less focus on document generation beyond contracts\nâ€¢ Weaker presence in manufacturing and supply chain verticals",
          recommendation_summary: "[Product] Enhance and highlight CPQ and document automation capabilities | [Positioning] Position Conga as the broader revenue lifecycle solution vs Ironclad's legal-centric focus",
          competitive_summary: "Ironclad is a strong competitor in the CLM space with solid AI features and legal-team focus, but lacks the breadth of Conga's revenue lifecycle management portfolio.",
        },
      });
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

    const rawJson = await n8nRes.json();
    // n8n may return: [{...}], [{json:{...}}], or plain {...}
    const item = Array.isArray(rawJson) ? rawJson[0] : rawJson;
    const raw = (item && typeof item === 'object' && 'json' in item && typeof item.json === 'object') ? item.json : item;

    const competitor_data = {
      company_size: raw["Company Size"],
      business_model: raw["Business Model"],
      target_market: raw["Target Market"],
      company_values: raw["Company Values"],
      products: raw["Products"],
      industries_served: raw["Industries Served"],
      pain_points: raw["Company Pain Points"],
      outreach_angle: raw["Outreach Angle"],
      recent_news: raw["Company's Recent News"],
      real_matrix: raw["Real Matrix"],
      competitor_name: raw["Competitor Name"],
      competitor_website: raw["Competitor Website"],
      competitor_description: raw["Competitor Description"],
      competitor_market_position: raw["Competitor Market Position"],
      competitor_difference: raw["Competitor Difference"],
      competitor_strength: raw["Competitor Strength"],
      gap_opportunities: raw["Gap Opportunities"],
      recommendation_summary: raw["Recommendation Summary"],
      competitive_summary: raw["Competitive Summary"],
    };

    return NextResponse.json({ id, competitor_data });
  } catch (err) {
    console.error("[competitor-research]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Competitor research failed" },
      { status: 500 }
    );
  }
}
