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
          full_analysis: "# Intelligence Report: Acme Corp\n\n## Executive Summary\nAcme Corp is a mid-market B2B SaaS company specializing in workflow automation for enterprise teams.\n\n## Company Overview\n**Industry:** SaaS / Automation\n**Business Model:** B2B subscription\n**Size:** Medium (200-500 employees)\n\n## Key Products\n- **Acme Flow** â€” Visual workflow builder for non-technical teams\n- **Acme Connect** â€” API integration platform\n\n## Real-World Impact\n- 40% reduction in manual processes\n- $2M average annual savings per enterprise client\n- 98% customer retention rate\n\n---\n\n## Competitive Landscape\n### Zapier\nStrong in SMB segment but lacks enterprise governance features that Acme provides.\n\n### Make (Integromat)\nCompetitive pricing but limited compliance tooling.\n\n## Outreach Strategy\nFocus on enterprise governance and compliance as key differentiators.",
          pain_points: "# Strategic Pain Points\n\n## Pain Point 1: Limited Enterprise Governance\n**The Situation:** Acme's governance features lag behind enterprise expectations.\n**Competitive Context:** Competitors like ServiceNow offer robust governance frameworks.\n**Hidden Costs:** Potential $500K in lost enterprise deals annually.\n\n## Pain Point 2: Integration Complexity\n**The Situation:** Complex API setups deter mid-market customers.\n**Competitive Context:** Zapier's no-code approach captures this segment.\n**Hidden Costs:** 30% longer onboarding times increase churn risk.",
          solutions: "# Strategic Solutions\n\n## Solution 1: Enterprise Governance Suite\n**Addresses:** Limited Enterprise Governance\n**The Solution:** Build role-based access controls and audit logging.\n**Implementation:**\n- Phase 1 (0-30 days): Audit current gaps\n- Phase 2 (30-90 days): Build and ship MVP\n**Expected Outcomes:** 25% increase in enterprise pipeline.\n\n## Solution 2: No-Code Integration Builder\n**Addresses:** Integration Complexity\n**The Solution:** Visual drag-and-drop connector builder.\n**Expected Outcomes:** 40% faster onboarding.",
          strategy_hooks: "# Strategic Engagement Framework\n\n## Hook 1: Competitive Displacement Risk\n**Opening Line:** \"I noticed Zapier just launched enterprise features that overlap with Acme's core market.\"\n\n## Hook 2: Hidden Opportunity Cost\n**Opening Line:** \"Enterprise clients are spending 30% more time on onboarding than industry benchmarks.\"\n\n## Email 1: Initial Outreach\n**Subject:** Acme's enterprise play vs Zapier's new moves\n\nHi [Name],\n\nI've been following Acme's growth in workflow automation. With Zapier pushing into enterprise, I wanted to share some insights on positioning.\n\nWould a 15-minute call be useful?\n\nBest,\n[Name]",
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

    const enrich_data = {
      full_analysis: raw["Full Data Analysis"],
      pain_points: raw["Pain Points"],
      solutions: raw["Solutions"],
      strategy_hooks: raw["Strategy Hooks"],
    };

    return NextResponse.json({ id, enrich_data });
  } catch (err) {
    console.error("[generate-strategy]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Strategy generation failed" },
      { status: 500 }
    );
  }
}
