export type ActionStatus = 'idle' | 'loading' | 'done' | 'error';

export type CompanyRecord = {
  id: string;           // UUID â€” stable, frontend-generated (Interface ID)
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
  competitor_data?: {
    // Company Analysis
    company_size?: string;
    business_model?: string;
    target_market?: string;
    company_values?: string;
    products?: string;
    industries_served?: string;
    pain_points?: string;
    outreach_angle?: string;
    recent_news?: string;
    real_matrix?: string;
    // Competitor Analysis
    competitor_name?: string;
    competitor_website?: string;
    competitor_description?: string;
    competitor_market_position?: string;
    competitor_difference?: string;
    competitor_strength?: string;
    gap_opportunities?: string;
    recommendation_summary?: string;
    competitive_summary?: string;
  };

  // Generate Strategy
  enrich_status: ActionStatus;
  enrich_data?: {
    full_analysis?: string;
    pain_points?: string;
    solutions?: string;
    strategy_hooks?: string;
  };
  enrich_error?: string;

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
  send_message_id?: string;
  send_error?: string;
};
