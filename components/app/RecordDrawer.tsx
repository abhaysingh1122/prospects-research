'use client';

import { useState } from 'react';
import { CompanyRecord, ActionStatus } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { X, Search, Trash2, ExternalLink, Building2, Users, Globe, Briefcase, Copy, Check, Maximize2, Minimize2, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

interface RecordDrawerProps {
  record: CompanyRecord | null;
  onClose: () => void;
  onUpdate: (record: CompanyRecord) => void;
  onDelete: (id: string) => void;
}

export function RecordDrawer({ record, onClose, onUpdate, onDelete }: RecordDrawerProps) {
  const [tab, setTab] = useState<'research' | 'competitor' | 'enrich' | 'email' | 'sent'>('research');
  const [expanded, setExpanded] = useState(false);

  if (!record) return null;

  async function handleResearch() {
    if (!record) return;
    onUpdate({ ...record, research_status: 'loading' });
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id, company_name: record.company_name, linkedin_url: record.linkedin_url, website_url: record.website_url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Research failed');
      onUpdate({
        ...record,
        research_status: 'done',
        website_url: data.website_url || record.website_url,
        research_data: {
          universal_name: data.universal_name,
          tagline: data.tagline,
          description: data.description,
          employee_count: data.employee_count,
          location: data.location,
          specialities: data.specialities,
          industries: data.industries,
          phone_number: data.phone_number,
          summary: data.summary,
          key_products: data.key_products,
          competitors: data.competitors,
          recent_news: data.recent_news,
          key_contacts: data.key_contacts,
        },
      });
      toast.success('Research complete');
    } catch (err) {
      onUpdate({ ...record, research_status: 'error', research_error: err instanceof Error ? err.message : 'Unknown error' });
      toast.error('Research failed');
    }
  }

  async function handleCompetitor() {
    if (!record) return;
    onUpdate({ ...record, competitor_status: 'loading' });
    setTab('competitor');
    try {
      const res = await fetch('/api/competitor-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Competitor research failed');
      onUpdate({ ...record, competitor_status: 'done', competitor_data: data.competitor_data });
      toast.success('Competitor research complete');
    } catch (err) {
      onUpdate({ ...record, competitor_status: 'error', competitor_error: err instanceof Error ? err.message : 'Unknown error' });
      toast.error('Competitor research failed');
    }
  }

  async function handleEnrich() {
    if (!record) return;
    onUpdate({ ...record, enrich_status: 'loading' });
    setTab('enrich');
    try {
      const res = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Enrichment failed');
      onUpdate({ ...record, enrich_status: 'done', enrich_data: data.enrich_data });
      toast.success('Lead enrichment complete');
    } catch (err) {
      onUpdate({ ...record, enrich_status: 'error', enrich_error: err instanceof Error ? err.message : 'Unknown error' });
      toast.error('Enrichment failed');
    }
  }

  async function handleEmail() {
    if (!record) return;
    onUpdate({ ...record, email_status: 'loading' });
    setTab('email');
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Email draft failed');
      onUpdate({ ...record, email_status: 'done', email_draft: data.email_draft });
      toast.success('Email draft ready');
    } catch (err) {
      onUpdate({ ...record, email_status: 'error', email_error: err instanceof Error ? err.message : 'Unknown error' });
      toast.error('Email draft failed');
    }
  }

  async function handleSend() {
    if (!record) return;
    if (!record.email_draft?.to) {
      toast.error('Add a recipient email first');
      setTab('email');
      return;
    }
    if (!record.email_draft?.subject && !record.email_draft?.body) {
      toast.error('Draft an email first');
      setTab('email');
      return;
    }
    onUpdate({ ...record, send_status: 'loading' });
    setTab('sent');
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: record.id,
          to: record.email_draft.to,
          subject: record.email_draft.subject,
          body: record.email_draft.body,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Send failed');
      onUpdate({ ...record, send_status: 'done', sent_at: data.sent_at || new Date().toISOString(), send_message_id: data.message_id });
      toast.success('Email sent');
    } catch (err) {
      onUpdate({ ...record, send_status: 'error', send_error: err instanceof Error ? err.message : 'Unknown error' });
      toast.error('Email send failed');
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: expanded ? '100vw' : '680px', maxWidth: '100vw', height: '100vh',
        background: 'var(--panel)',
        borderLeft: expanded ? 'none' : '1px solid var(--glass-border)',
        boxShadow: expanded ? 'none' : '-8px 0 40px rgba(0,0,0,.5)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'width .3s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Building2 size={13} />
              </div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--ink)', margin: 0 }}>{record.company_name}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '36px', flexWrap: 'wrap' }}>
              <a
                href={record.linkedin_url.startsWith('http') ? record.linkedin_url : `https://${record.linkedin_url}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'DM Mono, monospace', fontSize: '.62rem', color: 'var(--blue)', textDecoration: 'none' }}
              >
                <ExternalLink size={10} /> LinkedIn
              </a>
              <CopyBadge value={record.id} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
            <button onClick={() => setExpanded(!expanded)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', borderRadius: '8px' }} title={expanded ? 'Collapse' : 'Full screen'}>
              {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button onClick={() => { onDelete(record.id); onClose(); }} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', borderRadius: '8px' }} title="Delete">
              <Trash2 size={14} />
            </button>
            <button onClick={onClose} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', borderRadius: '8px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', padding: '14px 20px', borderBottom: '1px solid var(--glass-border)', flexShrink: 0 }}>
          <ActionBtn icon={<Search size={13} />} label="Company Research" status={record.research_status} onClick={handleResearch} color="var(--teal)" />
          <ActionBtn icon={<Building2 size={13} />} label="Competitor Research" status={record.competitor_status} onClick={handleCompetitor} color="var(--purple)" />
          <ActionBtn icon={<Users size={13} />} label="Generate Strategy" status={record.enrich_status} onClick={handleEnrich} color="var(--blue)" />
          <ActionBtn icon={<Mail size={13} />} label="Draft Email" status={record.email_status} onClick={handleEmail} color="var(--green)" />
          <ActionBtn icon={<Send size={13} />} label="Send Email" status={record.send_status} onClick={handleSend} color="var(--accent)" />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', flexShrink: 0 }}>
          {([
            { id: 'research' as const, label: 'Research', status: record.research_status },
            { id: 'competitor' as const, label: 'Competitor', status: record.competitor_status },
            { id: 'enrich' as const, label: 'Strategy', status: record.enrich_status },
            { id: 'email' as const, label: 'Email Drafts', status: record.email_status },
            { id: 'sent' as const, label: 'Email Sent', status: record.send_status },
          ]).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                padding: '11px 0',
                fontFamily: 'DM Mono, monospace', fontSize: '.62rem', fontWeight: 500,
                color: tab === t.id ? 'var(--accent)' : 'var(--ink-3)',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'color .15s',
              }}
            >
              {t.label}
              <StatusBadge status={t.status} />
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {tab === 'research' && <ResearchContent record={record} />}
          {tab === 'competitor' && <CompetitorContent record={record} />}
          {tab === 'enrich' && <EnrichContent record={record} />}
          {tab === 'email' && <EmailContent record={record} onUpdate={onUpdate} />}
          {tab === 'sent' && <SentContent record={record} />}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, status, onClick, color, disabled = false }: {
  icon: React.ReactNode; label: string; status: ActionStatus;
  onClick: () => void; color: string; disabled?: boolean;
}) {
  const loading = status === 'loading';
  const off = disabled || loading;
  return (
    <button
      onClick={onClick} disabled={off}
      className="btn-action"
      style={{
        flex: 1,
        color: off ? 'var(--ink-4)' : color,
        border: 'none',
      }}
    >
      {icon}
      {loading ? 'Running...' : label}
    </button>
  );
}

function ResearchContent({ record }: { record: CompanyRecord }) {
  if (record.research_status === 'idle') return (
    <Empty icon={<Search size={28} />} text="Click Company Research to fetch data" />
  );
  if (record.research_status === 'loading') return (
    <Loading color="var(--teal)" text="Researching company..." />
  );
  if (record.research_status === 'error') return (
    <ErrorBox text={record.research_error || 'Research failed'} />
  );

  const d = record.research_data;
  if (!d) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Interface ID â€” full width with copy */}
      <DataBox label="Interface ID">
        <CopyLine value={record.id} />
      </DataBox>

      {/* Company Name + Universal Name */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <DataBox label="Company Name">
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '.9rem', color: 'var(--ink)' }}>{record.company_name}</span>
        </DataBox>
        {d.universal_name && (
          <DataBox label="Universal Name">
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '.75rem', color: 'var(--ink-2)' }}>{d.universal_name}</span>
          </DataBox>
        )}
      </div>

      {/* Employee Count + Phone */}
      {(d.employee_count != null || d.phone_number) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {d.employee_count != null && (
            <DataBox label="Employee Count">
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: 'var(--ink)', lineHeight: 1 }}>{d.employee_count}</span>
            </DataBox>
          )}
          {d.phone_number && (
            <DataBox label="Phone Number">
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '.75rem', color: 'var(--ink-2)' }}>{d.phone_number}</span>
            </DataBox>
          )}
        </div>
      )}

      {/* LinkedIn + Website */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <DataBox label="LinkedIn URL">
          <a href={record.linkedin_url.startsWith('http') ? record.linkedin_url : `https://${record.linkedin_url}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'DM Mono, monospace', fontSize: '.65rem', color: 'var(--blue)', textDecoration: 'none', wordBreak: 'break-all' }}>
            <ExternalLink size={10} style={{ flexShrink: 0 }} />{record.linkedin_url}
          </a>
        </DataBox>
        {record.website_url && (
          <DataBox label="Website URL">
            <a href={record.website_url.startsWith('http') ? record.website_url : `https://${record.website_url}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'DM Mono, monospace', fontSize: '.65rem', color: 'var(--blue)', textDecoration: 'none', wordBreak: 'break-all' }}>
              <ExternalLink size={10} style={{ flexShrink: 0 }} />{record.website_url}
            </a>
          </DataBox>
        )}
      </div>

      {/* Tagline */}
      {d.tagline && (
        <DataBox label="Tagline">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.84rem', color: 'var(--accent)', lineHeight: 1.55, fontStyle: 'italic' }}>{d.tagline}</p>
        </DataBox>
      )}

      {/* Description */}
      {d.description && (
        <DataBox label="Description">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: 'var(--ink-2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{d.description}</p>
        </DataBox>
      )}

      {/* Industries */}
      {d.industries && (
        <DataBox label="Industries">
          <TagsFromBullets text={d.industries} color="var(--blue)" />
        </DataBox>
      )}

      {/* Specialities */}
      {d.specialities && (
        <DataBox label="Specialities">
          <BulletList text={d.specialities} />
        </DataBox>
      )}

      {/* Location */}
      {d.location && (
        <DataBox label="Locations">
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '.68rem', color: 'var(--ink-2)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{d.location}</p>
        </DataBox>
      )}

      {/* Key contacts (future AI) */}
      {(d.key_contacts?.length ?? 0) > 0 && (
        <DataBox label="Key Contacts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {d.key_contacts!.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '.84rem', color: 'var(--ink)' }}>{c.name}</p>
                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '.6rem', color: 'var(--ink-3)' }}>{c.title}</p>
                </div>
                {c.linkedin && (
                  <a href={c.linkedin} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: 'DM Mono, monospace', fontSize: '.6rem', color: 'var(--blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ExternalLink size={9} />LinkedIn
                  </a>
                )}
              </div>
            ))}
          </div>
        </DataBox>
      )}
    </div>
  );
}


function CompetitorContent({ record }: { record: CompanyRecord }) {
  const [view, setView] = useState<'all' | 'company' | 'competitor'>('all');

  if (record.competitor_status === 'idle') return (
    <Empty icon={<Building2 size={28} />} text="Click Competitor Research to trigger analysis" />
  );
  if (record.competitor_status === 'loading') return (
    <Loading color="var(--purple)" text="Running competitor analysis..." />
  );
  if (record.competitor_status === 'error') return (
    <ErrorBox text={record.competitor_error || 'Competitor research failed'} />
  );

  const d = record.competitor_data;
  if (!d) return (
    <Empty icon={<Building2 size={28} />} text="No competitor data available" />
  );

  const showCompany = view === 'all' || view === 'company';
  const showCompetitor = view === 'all' || view === 'competitor';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* â”€â”€ Sub-filter pills â”€â”€ */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
        {(['all', 'company', 'competitor'] as const).map((v) => {
          const labels = { all: 'All', company: 'Company Analysis', competitor: 'Competitor Analysis' };
          const active = view === v;
          return (
            <button key={v} onClick={() => setView(v)}
              style={{
                fontFamily: 'DM Mono, monospace', fontSize: '.6rem', fontWeight: 500,
                padding: '5px 12px', borderRadius: '20px', cursor: 'pointer',
                border: active ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? 'var(--panel)' : 'var(--ink-3)',
                transition: 'all .15s',
              }}
            >{labels[v]}</button>
          );
        })}
      </div>

      {/* â”€â”€ Section 1: Company Analysis â”€â”€ */}
      {showCompany && (d.company_size || d.business_model) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {d.company_size && (
            <DataBox label="Company Size">
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '.9rem', color: 'var(--ink)' }}>{d.company_size}</span>
            </DataBox>
          )}
          {d.business_model && (
            <DataBox label="Business Model">
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '.9rem', color: 'var(--ink)' }}>{d.business_model}</span>
            </DataBox>
          )}
        </div>
      )}

      {showCompany && d.target_market && (
        <DataBox label="Target Market">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>{d.target_market}</p>
        </DataBox>
      )}

      {showCompany && d.company_values && (
        <DataBox label="Company Values">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>{d.company_values}</p>
        </DataBox>
      )}

      {showCompany && d.products && (
        <DataBox label="Products">
          <BulletList text={d.products} />
        </DataBox>
      )}

      {showCompany && d.industries_served && (
        <DataBox label="Industries Served">
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '.72rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>{d.industries_served}</p>
        </DataBox>
      )}

      {showCompany && d.pain_points && (
        <DataBox label="Pain Points">
          <BulletList text={d.pain_points} />
        </DataBox>
      )}

      {showCompany && d.outreach_angle && (
        <DataBox label="Outreach Angle">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: 'var(--purple)', lineHeight: 1.7, fontStyle: 'italic' }}>{d.outreach_angle}</p>
        </DataBox>
      )}

      {showCompany && d.recent_news && (
        <DataBox label="Recent News">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>{d.recent_news}</p>
        </DataBox>
      )}

      {showCompany && d.real_matrix && (
        <DataBox label="Real Matrix">
          <BulletList text={d.real_matrix} />
        </DataBox>
      )}

      {/* â”€â”€ Section Divider â€” only when both visible â”€â”€ */}
      {view === 'all' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '.52rem', color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.12em', flexShrink: 0 }}>
            Competitor Analysis
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
        </div>
      )}

      {/* â”€â”€ Section 2: Competitor Analysis â”€â”€ */}
      {showCompetitor && (d.competitor_name || d.competitor_website) && (
        <DataBox label="Competitor">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {d.competitor_name && (
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '.9rem', color: 'var(--ink)' }}>{d.competitor_name}</span>
            )}
            {d.competitor_website && (
              <a href={d.competitor_website.startsWith('http') ? d.competitor_website : `https://${d.competitor_website}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'DM Mono, monospace', fontSize: '.65rem', color: 'var(--blue)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                <ExternalLink size={10} />{d.competitor_website}
              </a>
            )}
          </div>
        </DataBox>
      )}

      {showCompetitor && d.competitor_description && (
        <DataBox label="Competitor Description">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>{d.competitor_description}</p>
        </DataBox>
      )}

      {showCompetitor && d.competitor_market_position && (
        <DataBox label="Market Position">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>{d.competitor_market_position}</p>
        </DataBox>
      )}

      {showCompetitor && d.competitor_difference && (
        <DataBox label="Key Differences">
          <BulletList text={d.competitor_difference} />
        </DataBox>
      )}

      {showCompetitor && d.competitor_strength && (
        <DataBox label="Competitor Strengths">
          <BulletList text={d.competitor_strength} />
        </DataBox>
      )}

      {showCompetitor && d.gap_opportunities && (
        <DataBox label="Gap Opportunities">
          <BulletList text={d.gap_opportunities} />
        </DataBox>
      )}

      {showCompetitor && d.recommendation_summary && (
        <DataBox label="Recommendation">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: 'var(--orange, var(--red))', lineHeight: 1.7, fontStyle: 'italic' }}>{d.recommendation_summary}</p>
        </DataBox>
      )}

      {showCompetitor && d.competitive_summary && (
        <DataBox label="Competitive Summary">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>{d.competitive_summary}</p>
        </DataBox>
      )}

    </div>
  );
}

function EnrichContent({ record }: { record: CompanyRecord }) {
  const [view, setView] = useState<'analysis' | 'painpoints' | 'hooks'>('analysis');

  if (record.enrich_status === 'idle') return (
    <Empty icon={<Users size={28} />} text="Click Generate Strategy to run full analysis" />
  );
  if (record.enrich_status === 'loading') return (
    <Loading color="var(--blue)" text="Generating strategy..." />
  );
  if (record.enrich_status === 'error') return (
    <ErrorBox text={record.enrich_error || 'Strategy generation failed'} />
  );

  const d = record.enrich_data;
  if (!d) return (
    <Empty icon={<Users size={28} />} text="No strategy data available" />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Sub-filter pills */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
        {([
          { id: 'analysis' as const, label: 'Full Analysis' },
          { id: 'painpoints' as const, label: 'Pain Points & Solutions' },
          { id: 'hooks' as const, label: 'Strategy Hooks' },
        ]).map((v) => {
          const active = view === v.id;
          return (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{
                fontFamily: 'DM Mono, monospace', fontSize: '.6rem', fontWeight: 500,
                padding: '5px 12px', borderRadius: '20px', cursor: 'pointer',
                border: active ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? 'var(--panel)' : 'var(--ink-3)',
                transition: 'all .15s',
              }}
            >{v.label}</button>
          );
        })}
      </div>

      {/* Full Analysis */}
      {view === 'analysis' && d.full_analysis && (
        <DataBox label="Intelligence Report">
          <MarkdownBlock text={d.full_analysis} />
        </DataBox>
      )}

      {/* Pain Points & Solutions â€” interleaved */}
      {view === 'painpoints' && (
        <>
          {d.pain_points && (
            <DataBox label="Pain Points">
              <MarkdownBlock text={d.pain_points} />
            </DataBox>
          )}
          {d.solutions && (
            <DataBox label="Solutions">
              <MarkdownBlock text={d.solutions} />
            </DataBox>
          )}
        </>
      )}

      {/* Strategy Hooks */}
      {view === 'hooks' && d.strategy_hooks && (
        <DataBox label="Engagement Framework">
          <MarkdownBlock text={d.strategy_hooks} />
        </DataBox>
      )}

    </div>
  );
}

function EmailContent({ record, onUpdate }: { record: CompanyRecord; onUpdate: (r: CompanyRecord) => void }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [to, setTo] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Sync local state when draft loads
  const d = record.email_draft;
  if (d && !initialized) {
    setSubject(d.subject || '');
    setBody(d.body || '');
    setTo(d.to || '');
    setInitialized(true);
  }

  function saveEdits() {
    onUpdate({ ...record, email_draft: { subject, body, to: to || undefined } });
    toast.success('Email draft saved');
  }

  if (record.email_status === 'idle') return (
    <Empty icon={<Mail size={28} />} text="Click Draft Email to generate an outreach email" />
  );
  if (record.email_status === 'loading') return (
    <Loading color="var(--green)" text="Drafting email..." />
  );
  if (record.email_status === 'error') return (
    <ErrorBox text={record.email_error || 'Email draft failed'} />
  );

  if (!d) return (
    <Empty icon={<Mail size={28} />} text="No email draft available" />
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: 'none', borderRadius: 'var(--radius-sm)',
    background: 'var(--panel)', boxShadow: 'var(--neu-in)',
    fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: 'var(--ink)',
    outline: 'none', resize: 'none' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      <DataBox label="To">
        <input
          type="text" value={to} onChange={(e) => setTo(e.target.value)} onBlur={saveEdits}
          placeholder="recipient@company.com"
          style={{ ...inputStyle, fontSize: '.75rem', fontFamily: 'DM Mono, monospace' }}
        />
      </DataBox>

      <DataBox label="Subject">
        <input
          type="text" value={subject} onChange={(e) => setSubject(e.target.value)} onBlur={saveEdits}
          style={{ ...inputStyle, fontWeight: 700, fontSize: '.88rem' }}
        />
      </DataBox>

      <DataBox label="Body">
        <textarea
          value={body} onChange={(e) => setBody(e.target.value)} onBlur={saveEdits}
          rows={12}
          style={{ ...inputStyle, lineHeight: 1.8 }}
        />
      </DataBox>

      <button
        onClick={() => {
          navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
          toast.success('Email copied to clipboard');
        }}
        className="btn-action"
        style={{ color: 'var(--green)', border: 'none', justifyContent: 'center' }}
      >
        <Copy size={13} />
        Copy Email
      </button>
    </div>
  );
}

function SentContent({ record }: { record: CompanyRecord }) {
  if (record.send_status === 'idle') return (
    <Empty icon={<Send size={28} />} text="Draft an email first, then click Send Email" />
  );
  if (record.send_status === 'loading') return (
    <Loading color="var(--accent)" text="Sending email..." />
  );
  if (record.send_status === 'error') return (
    <ErrorBox text={record.send_error || 'Email send failed'} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px 0' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--green)', opacity: .15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={22} style={{ color: 'var(--green)', opacity: 1 }} />
        </div>
        <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.95rem', color: 'var(--green)' }}>Email Sent</p>
      </div>

      {record.sent_at && (
        <DataBox label="Sent At">
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '.72rem', color: 'var(--ink-2)' }}>
            {new Date(record.sent_at).toLocaleString()}
          </span>
        </DataBox>
      )}

      {record.send_message_id && (
        <DataBox label="Message ID">
          <CopyLine value={record.send_message_id} />
        </DataBox>
      )}

      {record.email_draft && (
        <>
          <DataBox label="Subject">
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '.85rem', color: 'var(--ink)' }}>{record.email_draft.subject}</span>
          </DataBox>
          <DataBox label="Sent To">
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '.72rem', color: 'var(--ink-2)' }}>{record.email_draft.to}</span>
          </DataBox>
        </>
      )}
    </div>
  );
}

/* â”€â”€â”€ Helpers â”€â”€â”€ */

/** Render markdown-formatted text with headers, bold, bullets, and dividers */
function MarkdownBlock({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line â€” skip
    if (!trimmed) { i++; continue; }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      elements.push(<div key={i} style={{ height: '1px', background: 'var(--glass-border)', margin: '12px 0' }} />);
      i++; continue;
    }

    // H1
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h3 key={i} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '.95rem', color: 'var(--ink)', margin: '14px 0 6px' }}>
          {formatInline(trimmed.slice(2))}
        </h3>
      );
      i++; continue;
    }

    // H2
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h4 key={i} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.82rem', color: 'var(--accent)', margin: '12px 0 4px' }}>
          {formatInline(trimmed.slice(3))}
        </h4>
      );
      i++; continue;
    }

    // H3
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h5 key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '.78rem', color: 'var(--ink-2)', margin: '10px 0 3px' }}>
          {formatInline(trimmed.slice(4))}
        </h5>
      );
      i++; continue;
    }

    // Bullet list item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '3px' }}>
          <span style={{ color: 'var(--teal)', flexShrink: 0, marginTop: '2px', fontSize: '.7rem' }}>â€¢</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.78rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
            {formatInline(trimmed.slice(2))}
          </span>
        </div>
      );
      i++; continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      const num = trimmed.match(/^(\d+)\.\s/)![1];
      const content = trimmed.replace(/^\d+\.\s/, '');
      elements.push(
        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '3px' }}>
          <span style={{ color: 'var(--blue)', flexShrink: 0, fontFamily: 'DM Mono, monospace', fontSize: '.65rem', marginTop: '2px' }}>{num}.</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.78rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
            {formatInline(content)}
          </span>
        </div>
      );
      i++; continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.78rem', color: 'var(--ink-2)', lineHeight: 1.7, margin: '3px 0' }}>
        {formatInline(trimmed)}
      </p>
    );
    i++;
  }

  return <div>{elements}</div>;
}

/** Parse **bold** and `code` inline formatting */
function formatInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Code
    const codeMatch = remaining.match(/`(.+?)`/);

    // Find the earliest match
    const boldIdx = boldMatch?.index ?? Infinity;
    const codeIdx = codeMatch?.index ?? Infinity;

    if (boldIdx === Infinity && codeIdx === Infinity) {
      parts.push(remaining);
      break;
    }

    if (boldIdx <= codeIdx && boldMatch) {
      if (boldIdx > 0) parts.push(remaining.slice(0, boldIdx));
      parts.push(<strong key={key++} style={{ fontWeight: 700, color: 'var(--ink)' }}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldIdx + boldMatch[0].length);
    } else if (codeMatch) {
      if (codeIdx > 0) parts.push(remaining.slice(0, codeIdx));
      parts.push(
        <code key={key++} style={{ fontFamily: 'DM Mono, monospace', fontSize: '.7rem', background: 'var(--surface)', padding: '1px 5px', borderRadius: '3px', color: 'var(--accent)' }}>
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeIdx + codeMatch[0].length);
    }
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
}

/** Uniform box: label on top, content below â€” used for ALL data fields */
function DataBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 14px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--neu-in)', minWidth: 0 }}>
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '.55rem', color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: '8px' }}>{label}</p>
      {children}
    </div>
  );
}

/** ID value with inline copy button */
function CopyLine({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '.68rem', color: 'var(--ink-2)', letterSpacing: '.03em', wordBreak: 'break-all' }}>{value}</span>
      <button onClick={copy} title="Copy ID"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? 'var(--green)' : 'var(--ink-3)', padding: '2px', flexShrink: 0, display: 'flex', alignItems: 'center', transition: 'color .2s' }}>
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </div>
  );
}

/** Badge in the header showing ID + copy */
function CopyBadge({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function copy(e: React.MouseEvent) {
    e.preventDefault();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'DM Mono, monospace', fontSize: '.58rem', color: 'var(--ink-4)', letterSpacing: '.04em' }}>
      ID: {value}
      <button onClick={copy} title="Copy Interface ID"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? 'var(--green)' : 'var(--ink-4)', padding: '1px', display: 'flex', alignItems: 'center', transition: 'color .2s' }}>
        {copied ? <Check size={11} /> : <Copy size={11} />}
      </button>
    </span>
  );
}

/** Render bullet text as a clean vertical bullet list */
function BulletList({ text }: { text: string }) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {lines.map((line, i) => (
        <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontFamily: 'DM Mono, monospace', fontSize: '.72rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
          <span style={{ color: 'var(--teal)', flexShrink: 0, marginTop: '1px' }}>â€¢</span>
          <span>{line.startsWith('â€¢') ? line.slice(1).trim() : line}</span>
        </li>
      ))}
    </ul>
  );
}

/** Parse "â€¢ Tag\nâ€¢ Tag" strings into tag pill chips */
function TagsFromBullets({ text, color }: { text: string; color: string }) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const tags = lines.filter(l => l.startsWith('â€¢')).map(l => l.slice(1).trim());
  const rest = lines.filter(l => !l.startsWith('â€¢'));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {tags.map((t, i) => (
            <span key={i} style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '.75rem', fontWeight: 500,
              color, background: `${color}18`, border: `1px solid ${color}30`,
              borderRadius: '6px', padding: '4px 10px', lineHeight: 1.3,
            }}>{t}</span>
          ))}
        </div>
      )}
      {rest.map((line, i) => (
        <p key={i} style={{ fontFamily: 'DM Mono, monospace', fontSize: '.65rem', color: 'var(--ink-3)', lineHeight: 1.5 }}>{line}</p>
      ))}
    </div>
  );
}
function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px', textAlign: 'center', gap: '12px' }}>
      <span style={{ color: 'var(--ink-4)', opacity: .5 }}>{icon}</span>
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '.7rem', color: 'var(--ink-3)' }}>{text}</p>
    </div>
  );
}
function Loading({ color, text }: { color: string; text: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px', gap: '12px' }}>
      <span className="pulse-dot" style={{ background: color, width: '10px', height: '10px' }} />
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '.7rem', color }}>{text}</p>
    </div>
  );
}
function ErrorBox({ text }: { text: string }) {
  return (
    <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: 'rgba(204,120,120,0.1)', border: '1px solid rgba(204,120,120,0.3)' }}>
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '.72rem', color: 'var(--red)' }}>{text}</p>
    </div>
  );
}
