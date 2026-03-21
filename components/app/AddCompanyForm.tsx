'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CompanyRecord } from '@/lib/types';
import { Building2, Link2, Globe, ArrowRight } from 'lucide-react';

interface AddCompanyFormProps {
  onAdd: (record: CompanyRecord) => void;
  autoOpenOnAdd?: boolean;
}

export function AddCompanyForm({ onAdd }: AddCompanyFormProps) {
  const [name, setName] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [showWebsite, setShowWebsite] = useState(false);

  const canSubmit = name.trim().length > 0 && linkedin.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const record: CompanyRecord = {
      id: uuidv4(),
      company_name: name.trim(),
      linkedin_url: linkedin.trim(),
      website_url: website.trim() || undefined,
      created_at: new Date().toISOString(),
      research_status: 'idle',
      competitor_status: 'idle',
      email_status: 'idle',
      send_status: 'idle',
    };
    onAdd(record);
    setName('');
    setLinkedin('');
    setWebsite('');
    setShowWebsite(false);
  }

  return (
    <div
      className="neu-card-lg"
      style={{ padding: '28px 32px' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '.6rem', color: 'var(--accent)', letterSpacing: '.18em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ width: '18px', height: '1.5px', background: 'var(--accent)', display: 'inline-block' }} />
          New Target
        </div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.1 }}>
          Research a Company
        </h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.84rem', color: 'var(--ink-3)', marginTop: '5px', fontWeight: 300 }}>
          Drop in the details — AI handles the rest.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Fields grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: showWebsite ? '14px' : '22px' }}>
          {/* Company Name */}
          <div className="field">
            <label className="field-lbl">Company Name *</label>
            <div className="field-input-icon">
              <Building2 size={13} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Corp"
                required
                className="field-input"
              />
            </div>
          </div>

          {/* LinkedIn URL */}
          <div className="field">
            <label className="field-lbl">LinkedIn URL *</label>
            <div className="field-input-icon">
              <Link2 size={13} />
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="linkedin.com/company/acme"
                required
                className="field-input"
              />
            </div>
          </div>
        </div>

        {/* Optional website */}
        {showWebsite && (
          <div className="field" style={{ marginBottom: '22px' }}>
            <label className="field-lbl">Website URL (optional)</label>
            <div className="field-input-icon">
              <Globe size={13} />
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://acmecorp.com"
                className="field-input"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="submit"
            disabled={!canSubmit}
            className="btn btn-accent"
            style={{ fontSize: '.8rem', padding: '12px 26px' }}
          >
            <ArrowRight size={14} />
            Add & Research
          </button>
          <button
            type="button"
            onClick={() => setShowWebsite(!showWebsite)}
            className="btn btn-ghost"
            style={{ fontSize: '.72rem' }}
          >
            {showWebsite ? 'Hide website' : '+ Website URL'}
          </button>
        </div>
      </form>
    </div>
  );
}
