export type ActionStatus = 'idle' | 'loading' | 'done' | 'error';

export type CompanyRecord = {
  id: string;           // UUID — stable, frontend-generated (Interface ID)
  company_name: string;
  linkedin_url: string;
  website_url?: string;
  created_at: string;

  // Research
  research_status: ActionStatus;
  research_data?: {
    // Airtable fields
    universal_name?: string;       // Company universal name
    tagline?: string;
    description?: string;
    employee_count?: number | string;
    location?: string;
    specialities?: string;
    industries?: string;
    phone_number?: string;

    // AI-generated (future use)
    summary?: string;
    key_products?: string[];
    competitors?: string[];
    recent_news?: string[];
    key_contacts?: Array<{ name: string; title: string; linkedin?: string }>;
  };
  research_error?: string;

  // Competitor Research
  competitor_status: ActionStatus;
  competitor_error?: string;

  // Email
  email_status: ActionStatus;
  email_draft?: {
    subject: string;
    body: string;
    to?: string;
  };
  email_error?: string;

  // Send
  send_status: ActionStatus;
  sent_at?: string;
  send_error?: string;
};
