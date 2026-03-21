'use client';

import { useState, useEffect } from 'react';
import { CompanyRecord } from '@/lib/types';
import { getRecords, saveRecord, deleteRecord } from '@/lib/db';
import { CompanyTable } from '@/components/app/CompanyTable';
import { RecordDrawer } from '@/components/app/RecordDrawer';
import { Database, Search as SearchIcon, Filter } from 'lucide-react';

type FilterStatus = 'all' | 'researched' | 'emailed' | 'sent';

const filterOptions: { value: FilterStatus; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: 'var(--ink-2)' },
  { value: 'researched', label: 'Researched', color: 'var(--teal)' },
  { value: 'emailed', label: 'Drafted', color: 'var(--purple)' },
  { value: 'sent', label: 'Sent', color: 'var(--green)' },
];

export default function DatabasePage() {
  const [records, setRecords] = useState<CompanyRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<CompanyRecord | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  function handleUpdate(updated: CompanyRecord) {
    saveRecord(updated);
    const fresh = getRecords();
    setRecords(fresh);
    setSelectedRecord(fresh.find((r) => r.id === updated.id) || null);
  }

  function handleDelete(id: string) {
    deleteRecord(id);
    setRecords(getRecords());
    setSelectedRecord(null);
  }

  const filtered = records.filter((r) => {
    const matchesSearch = r.company_name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'researched' && r.research_status === 'done') ||
      (filter === 'emailed' && r.email_status === 'done') ||
      (filter === 'sent' && r.send_status === 'done');
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: records.length,
    researched: records.filter((r) => r.research_status === 'done').length,
    emailed: records.filter((r) => r.email_status === 'done').length,
    sent: records.filter((r) => r.send_status === 'done').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div className="fade-up">
        <div className="flex items-center gap-2 mb-1">
          <Database size={16} style={{ color: 'var(--accent)' }} />
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, color: 'var(--ink)' }}>
            Company Database
          </h1>
        </div>
        <p style={{ color: 'var(--ink-3)', fontSize: '14px', fontFamily: 'DM Sans, sans-serif' }}>
          All prospects tracked with research history, email drafts, and send status.
        </p>
      </div>

      {/* Stats bar */}
      <div
        className="grid grid-cols-4 gap-4 fade-up"
        style={{ animationDelay: '0.05s' }}
      >
        {[
          { label: 'Total', value: stats.total, color: 'var(--ink-2)' },
          { label: 'Researched', value: stats.researched, color: 'var(--teal)' },
          { label: 'Drafted', value: stats.emailed, color: 'var(--purple)' },
          { label: 'Sent', value: stats.sent, color: 'var(--green)' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4 text-center"
            style={{
              background: 'var(--panel)',
              boxShadow: '4px 4px 12px var(--neu-dark), -3px -3px 8px var(--neu-light)',
              border: `1px solid ${s.color}20`,
            }}
          >
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--ink-3)', fontFamily: 'DM Mono, monospace' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex items-center gap-3 flex-wrap fade-up" style={{ animationDelay: '0.1s' }}>
        {/* Filter pills */}
        <div className="flex items-center gap-1">
          <Filter size={12} style={{ color: 'var(--ink-3)' }} />
          {filterOptions.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="px-3 py-1.5 text-xs rounded-full font-medium transition-all"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
                border: `1px solid ${filter === f.value ? f.color : 'var(--ink-4)'}`,
                background: filter === f.value ? `${f.color}18` : 'transparent',
                color: filter === f.value ? f.color : 'var(--ink-3)',
              }}
            >
              {f.label}
              {f.value !== 'all' && (
                <span className="ml-1.5 opacity-60">
                  {f.value === 'researched' ? stats.researched :
                   f.value === 'emailed' ? stats.emailed : stats.sent}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <SearchIcon
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--ink-3)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies..."
            className="neu-input"
            style={{ padding: '8px 12px 8px 30px', width: '220px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="fade-up" style={{ animationDelay: '0.15s' }}>
        <CompanyTable records={filtered} onSelectRecord={setSelectedRecord} onDelete={handleDelete} />
      </div>

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
