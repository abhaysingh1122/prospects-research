'use client';

import { CompanyRecord } from './types';

const DB_KEY = 'prospect_research_db';

export function getRecords(): CompanyRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecord(record: CompanyRecord): void {
  const records = getRecords();
  const idx = records.findIndex((r) => r.id === record.id);
  if (idx >= 0) {
    records[idx] = record;
  } else {
    records.unshift(record);
  }
  localStorage.setItem(DB_KEY, JSON.stringify(records));
}

export function deleteRecord(id: string): void {
  const records = getRecords().filter((r) => r.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(records));
}

export function updateRecord(id: string, patch: Partial<CompanyRecord>): CompanyRecord | null {
  const records = getRecords();
  const idx = records.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  records[idx] = { ...records[idx], ...patch };
  localStorage.setItem(DB_KEY, JSON.stringify(records));
  return records[idx];
}
