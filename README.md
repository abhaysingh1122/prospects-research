# Prospects Research

An AI-powered company research interface built with Next.js 16.

## What's Built

### Interface
- Multi-page app — Home, Research (`/scrape`), Database (`/database`)
- Dark / Light theme toggle with brand-consistent neumorphic design system
- Responsive drawer panel for viewing company records

### Company Research
- Add company by name + LinkedIn URL
- Research triggers automatically on add — no manual step
- Data pulled from Airtable via n8n webhook and stored locally
- Fields captured: Company Name, Universal Name, Tagline, Description, Employee Count, LinkedIn URL, Website URL, Industries, Specialities, Locations, Phone Number

### Competitor Research
- One-click competitor research trigger per company
- Sends `action: competitor_research` + Interface ID to n8n webhook
- Separate tab in the record drawer

### Database
- All records stored in `localStorage` with stable UUID Interface IDs
- Company table with search and status filters (Researched / Drafted / Sent)
- Two-click delete confirmation per row
- Stats bar showing totals per status

### Record Drawer
- Full company profile display
- All fields rendered in uniform labeled data boxes
- Specialities as bullet list, Industries as tag pills
- Interface ID with one-click copy button
- Airtable Record ID intentionally excluded (changes on every sync)

### Backend
- `/api/research` — forwards to n8n research webhook, parses Airtable array response
- `/api/competitor-research` — forwards to n8n competitor webhook with Interface ID
- Dev mode mocks for both routes when webhooks are not configured

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- localStorage (client-side database)
- n8n (automation layer)
- Airtable (data source)

## Setup

```bash
npm install
```

Create `.env.local`:
```
N8N_RESEARCH_WEBHOOK_URL=your_webhook_url
N8N_COMPETITOR_WEBHOOK_URL=your_webhook_url
```

```bash
npm run dev
```

---

Development is still in progress.
