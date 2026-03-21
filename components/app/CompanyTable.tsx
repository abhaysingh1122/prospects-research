'use client';

import { useState } from 'react';
import { CompanyRecord } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { Building2, ExternalLink, ChevronRight, Trash2 } from 'lucide-react';

interface CompanyTableProps {
  records: CompanyRecord[];
  onSelectRecord: (record: CompanyRecord) => void;
  onDelete?: (id: string) => void;
}

export function CompanyTable({ records, onSelectRecord, onDelete }: CompanyTableProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (records.length === 0) {
    return (
      <div style={{
        border: '2px dashed var(--ink-4)', borderRadius: 'var(--radius-lg)',
        padding: '64px 24px', textAlign: 'center',
        background: 'var(--surface)', boxShadow: 'var(--neu-in)',
      }}>
        <Building2 size={36} style={{ color: 'var(--ink-4)', margin: '0 auto 16px' }} />
        <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--ink-2)', fontSize: '.95rem', marginBottom: '6px' }}>
          No companies yet
        </p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '.65rem', color: 'var(--ink-3)' }}>
          Add a company to start researching
        </p>
      </div>
    );
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (confirmId === id) {
      onDelete?.(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
      // Auto-cancel confirm after 3s
      setTimeout(() => setConfirmId((c) => (c === id ? null : c)), 3000);
    }
  }

  return (
    <div style={{ background: 'var(--panel)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--neu-out)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 140px 88px 88px 88px 32px',
        padding: '10px 18px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--glass-border)',
        fontFamily: 'DM Mono, monospace', fontSize: '.58rem',
        color: 'var(--ink-3)', letterSpacing: '.12em', textTransform: 'uppercase',
        alignItems: 'center',
      }}>
        <span>Company</span>
        <span>Added</span>
        <span>Research</span>
        <span>Email</span>
        <span>Send</span>
        <span />
      </div>

      {/* Rows */}
      {records.map((record, idx) => {
        const isConfirming = confirmId === record.id;
        return (
          <div
            key={record.id}
            className="record-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 140px 88px 88px 88px 32px',
              background: 'var(--panel)',
              borderBottom: idx < records.length - 1 ? '1px solid var(--glass-border)' : 'none',
              alignItems: 'center',
            }}
          >
            {/* Clickable row area */}
            <button
              onClick={() => onSelectRecord(record)}
              style={{ display: 'contents', cursor: 'pointer', border: 'none', background: 'none' }}
            >
              {/* Company */}
              <div style={{ padding: '13px 0 13px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={11} />
                  </div>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '.88rem', color: 'var(--ink)' }}>
                    {record.company_name}
                  </span>
                  {record.research_data?.universal_name && (
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '.6rem', color: 'var(--ink-4)' }}>
                      {record.research_data.universal_name}
                    </span>
                  )}
                  <a href={record.linkedin_url.startsWith('http') ? record.linkedin_url : `https://${record.linkedin_url}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: 'var(--blue)', flexShrink: 0 }}>
                    <ExternalLink size={10} />
                  </a>
                </div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '.58rem', color: 'var(--ink-4)', marginLeft: '32px', letterSpacing: '.03em' }}>
                  {record.id}
                </span>
              </div>

              {/* Date */}
              <div style={{ padding: '13px 8px', fontFamily: 'DM Mono, monospace', fontSize: '.62rem', color: 'var(--ink-3)' }}>
                {new Date(record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>

              {/* Statuses */}
              <div style={{ padding: '13px 8px' }}><StatusBadge status={record.research_status} /></div>
              <div style={{ padding: '13px 8px' }}><StatusBadge status={record.email_status} /></div>
              <div style={{ padding: '13px 8px' }}><StatusBadge status={record.send_status} /></div>
            </button>

            {/* Delete button — separate from row click */}
            <div style={{ padding: '13px 12px 13px 4px', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={(e) => handleDelete(e, record.id)}
                title={isConfirming ? 'Click again to confirm delete' : 'Delete record'}
                style={{
                  background: isConfirming ? 'var(--red)' : 'transparent',
                  border: `1px solid ${isConfirming ? 'var(--red)' : 'transparent'}`,
                  borderRadius: '6px',
                  padding: '5px',
                  cursor: 'pointer',
                  color: isConfirming ? '#fff' : 'var(--ink-4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s',
                }}
                onMouseEnter={(e) => {
                  if (!isConfirming) (e.currentTarget as HTMLButtonElement).style.color = 'var(--red)';
                }}
                onMouseLeave={(e) => {
                  if (!isConfirming) (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-4)';
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
