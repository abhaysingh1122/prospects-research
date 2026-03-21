'use client';

import { useState, useEffect, useCallback } from 'react';
import { AddCompanyForm } from '@/components/app/AddCompanyForm';
import { RecordDrawer } from '@/components/app/RecordDrawer';
import { CompanyRecord } from '@/lib/types';
import { getRecords, saveRecord, deleteRecord } from '@/lib/db';
import { Search, Clock, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/app/StatusBadge';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ScrapePage() {
  const [records, setRecords] = useState<CompanyRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<CompanyRecord | null>(null);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  function refresh(updatedRecord?: CompanyRecord) {
    const fresh = getRecords();
    setRecords(fresh);
    if (updatedRecord) {
      setSelectedRecord(fresh.find((r) => r.id === updatedRecord.id) || null);
    }
  }

  // Trigger research immediately after adding a company
  async function handleAdd(record: CompanyRecord) {
    // 1. Save record + set status to loading
    const withLoading: CompanyRecord = { ...record, research_status: 'loading' };
    saveRecord(withLoading);
    refresh(withLoading);

    // 2. Open drawer immediately (shows loading state)
    setSelectedRecord(withLoading);

    // 3. Hit research API
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: record.id,
          company_name: record.company_name,
          linkedin_url: record.linkedin_url,
          website_url: record.website_url,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Research failed');

      const done: CompanyRecord = {
        ...withLoading,
        research_status: 'done',
        website_url: data.website_url || withLoading.website_url,
        research_data: {
          universal_name: data.universal_name,
          tagline: data.tagline,
          description: data.description,
          employee_count: data.employee_count,
          location: data.location,
          specialities: data.specialities,
          industries: data.industries,
          phone_number: data.phone_number,
          // AI fields (future)
          summary: data.summary,
          key_products: data.key_products,
          competitors: data.competitors,
          recent_news: data.recent_news,
          key_contacts: data.key_contacts,
        },
      };
      saveRecord(done);
      refresh(done);
      toast.success(`Research complete — ${record.company_name}`);
    } catch (err) {
      const failed: CompanyRecord = {
        ...withLoading,
        research_status: 'error',
        research_error: err instanceof Error ? err.message : 'Research failed',
      };
      saveRecord(failed);
      refresh(failed);
      toast.error('Research failed');
    }
  }

  function handleUpdate(updated: CompanyRecord) {
    saveRecord(updated);
    refresh(updated);
  }

  function handleDelete(id: string) {
    deleteRecord(id);
    setRecords(getRecords());
    setSelectedRecord(null);
  }

  const recent = records.slice(0, 5);

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page title */}
      <div className="rise">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Search size={15} style={{ color: 'var(--accent)' }} />
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)' }}>
            Research a Company
          </h1>
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.88rem', color: 'var(--ink-3)', fontWeight: 300 }}>
          Add a company — research fires automatically.
        </p>
      </div>

      {/* Form */}
      <div className="rise-1">
        <AddCompanyForm onAdd={handleAdd} />
      </div>

      {/* Recent */}
      {recent.length > 0 && (
        <div className="rise-2">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={12} style={{ color: 'var(--ink-3)' }} />
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '.58rem', color: 'var(--ink-3)', letterSpacing: '.14em', textTransform: 'uppercase' }}>
                Recent
              </span>
            </div>
            <Link href="/database" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'DM Mono, monospace', fontSize: '.62rem', color: 'var(--accent)', textDecoration: 'none' }}>
              View all <ChevronRight size={11} />
            </Link>
          </div>

          <div style={{ background: 'var(--panel)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--neu-out)', overflow: 'hidden' }}>
            {recent.map((record, idx) => (
              <button
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="record-row"
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: 'var(--panel)', cursor: 'pointer', border: 'none',
                  borderBottom: idx < recent.length - 1 ? '1px solid var(--glass-border)' : 'none',
                  textAlign: 'left',
                }}
              >
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '.88rem', color: 'var(--ink)' }}>
                    {record.company_name}
                  </p>
                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '.58rem', color: 'var(--ink-4)', marginTop: '2px' }}>
                    {record.id.slice(0, 8)} · {new Date(record.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusBadge status={record.research_status} />
                  <ChevronRight size={13} style={{ color: 'var(--ink-4)' }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Drawer */}
      {selectedRecord && (
        <RecordDrawer
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
