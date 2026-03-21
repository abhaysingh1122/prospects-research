import { NextRequest, NextResponse } from "next/server";

const N8N_RESEARCH_WEBHOOK = process.env.N8N_RESEARCH_WEBHOOK_URL || "";

/** Normalize n8n response — handles Airtable array format or flat object */
function parseAirtableResponse(raw: unknown, interfaceId: string) {
  // Handle array from Airtable (take first record)
  const record = Array.isArray(raw) ? raw[0] : raw;
  if (!record || typeof record !== "object") return null;

  // If it has a `fields` key it's an Airtable record wrapper
  const r = record as Record<string, unknown>;
  const fields = (r.fields && typeof r.fields === "object"
    ? r.fields
    : r) as Record<string, unknown>;

  return {
    id: interfaceId,
    company_name: (fields["Company Name"] as string) || undefined,
    universal_name: (fields["Company universal name"] as string) || undefined,
    tagline: (fields["Tagline"] as string) || undefined,
    description: (fields["Description"] as string) || undefined,
    employee_count: fields["Employee Count"] ?? undefined,
    linkedin_url: (fields["LinkedIn URL"] as string) || undefined,
    website_url: (fields["Website URL"] as string) || undefined,
    location: (fields["Location"] as string) || undefined,
    specialities: (fields["Specialities"] as string) || undefined,
    industries: (fields["Industries"] as string) || undefined,
    phone_number: (fields["Phone number"] as string) || undefined,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, company_name, linkedin_url, website_url } = body;

    if (!id || !company_name || !linkedin_url) {
      return NextResponse.json(
        { error: "Missing required fields: id, company_name, linkedin_url" },
        { status: 400 }
      );
    }

    const payload = {
      action: "research",
      id,
      company_name,
      linkedin_url,
      website_url: website_url || null,
      timestamp: new Date().toISOString(),
    };

    if (!N8N_RESEARCH_WEBHOOK) {
      // Dev mode mock — Airtable-style response
      await new Promise((r) => setTimeout(r, 1800));
      const mock = parseAirtableResponse(
        [{
          id: "recMOCK123456789",
          createdTime: new Date().toISOString(),
          fields: {
            "Company Name": company_name,
            "Company universal name": company_name.toLowerCase().replace(/\s+/g, ""),
            "Tagline": `${company_name} — AI-powered solutions for modern teams.`,
            "Description": `${company_name} is a company operating in the professional services space, delivering innovative solutions to enterprise clients globally.`,
            "Employee Count": 120,
            "LinkedIn URL": linkedin_url,
            "Website URL": website_url || `https://www.${company_name.toLowerCase().replace(/\s+/g, "")}.com`,
            "Location": "• San Francisco, CA, United States\n• New York, NY, United States",
            "Specialities": "• SaaS Platform\n• API Services\n• Analytics\n• Enterprise Software",
            "Industries": "• Software Development\n  Technology, Information and Media",
            "Interface ID": id,
            "Record ID": "recMOCK123456789",
          },
        }],
        id
      );
      return NextResponse.json(mock);
    }

    const n8nRes = await fetch(N8N_RESEARCH_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!n8nRes.ok) {
      const errText = await n8nRes.text().catch(() => n8nRes.status.toString());
      throw new Error(`n8n returned ${n8nRes.status}: ${errText}`);
    }

    const contentType = n8nRes.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const raw = await n8nRes.json();
      const normalized = parseAirtableResponse(raw, id);
      if (normalized) return NextResponse.json(normalized);
      return NextResponse.json({ id, ...raw });
    }

    return NextResponse.json({
      id,
      accepted: true,
      message: "Sent to n8n. Waiting for response.",
    });
  } catch (err) {
    console.error("[research]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Research failed" },
      { status: 500 }
    );
  }
}
