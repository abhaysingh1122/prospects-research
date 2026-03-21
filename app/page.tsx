'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Search, Mail, Send, Database, ChevronRight } from 'lucide-react';

const steps = [
  {
    icon: <Search size={20} />,
    label: 'Input',
    desc: 'Enter company name + LinkedIn URL',
    color: 'var(--teal)',
  },
  {
    icon: <Zap size={20} />,
    label: 'Research',
    desc: 'AI scrapes, analyzes, builds intelligence report',
    color: 'var(--accent)',
  },
  {
    icon: <Mail size={20} />,
    label: 'Draft',
    desc: 'Personalized outreach email generated automatically',
    color: 'var(--purple)',
  },
  {
    icon: <Send size={20} />,
    label: 'Send',
    desc: 'One click — email delivered, record logged',
    color: 'var(--green)',
  },
];

const features = [
  {
    title: 'Competitive Intelligence',
    desc: 'Full company profile — size, industry, products, key contacts, recent news, competitors.',
    color: 'var(--teal)',
  },
  {
    title: 'Personalized Outreach',
    desc: 'AI-written emails that reference real company data. Not templates. Actual research.',
    color: 'var(--accent)',
  },
  {
    title: 'Zero Manual Research',
    desc: 'Drop in a LinkedIn URL. Get a full intelligence report. No Googling. No guessing.',
    color: 'var(--purple)',
  },
  {
    title: 'Prospect Database',
    desc: 'Every company tracked with stable IDs. Research history, email drafts, send status — all stored.',
    color: 'var(--green)',
  },
];

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center fade-up">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-8"
          style={{
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            fontFamily: 'DM Mono, monospace',
          }}
        >
          <span className="pulse-dot" style={{ background: 'var(--accent)', width: '6px', height: '6px' }} />
          AI-Powered Outreach Intelligence
        </div>

        <h1
          className="mb-6"
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            color: 'var(--ink)',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
          }}
        >
          End-to-end outreach.
          <br />
          <span style={{ color: 'var(--accent)' }}>Zero manual research.</span>
        </h1>

        <p
          className="mx-auto mb-10"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '18px',
            color: 'var(--ink-2)',
            lineHeight: 1.7,
            maxWidth: '600px',
            fontWeight: 300,
          }}
        >
          An end-to-end AI-powered outreach intelligence agent that takes a company name
          and LinkedIn URL as input and returns a full competitive intelligence report
          plus a ready-to-send personalized outreach email — fully automated,
          no human research required.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/scrape">
            <button className="btn-ghost" style={{ fontSize: '.8rem', padding: '12px 26px' }}>
              <Search size={15} />
              Start Researching
            </button>
          </Link>
          <Link href="/database">
            <button className="btn-ghost" style={{ fontSize: '.8rem', padding: '12px 26px' }}>
              <Database size={15} />
              View Database
            </button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'var(--panel)',
            boxShadow: '6px 6px 20px var(--neu-dark), -4px -4px 14px var(--neu-light)',
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-8 text-center"
            style={{ fontFamily: 'DM Mono, monospace', color: 'var(--ink-3)' }}
          >
            How it works
          </p>

          <div className="flex items-start gap-4 flex-wrap justify-center">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-3 text-center" style={{ minWidth: '110px' }}>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--ink)', fontFamily: 'Syne, sans-serif' }}>{step.label}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--ink-3)', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>{step.desc}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight size={18} style={{ color: 'var(--ink-4)', flexShrink: 0, marginBottom: '24px' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl p-6"
              style={{
                background: 'var(--panel)',
                border: `1px solid ${f.color}20`,
                boxShadow: '4px 4px 14px var(--neu-dark), -3px -3px 10px var(--neu-light)',
              }}
            >
              <div
                className="w-2 h-2 rounded-full mb-4"
                style={{ background: f.color, boxShadow: `0 0 8px ${f.color}` }}
              />
              <h3
                className="text-base mb-2"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--ink)' }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm"
                style={{ color: 'var(--ink-3)', lineHeight: 1.65, fontFamily: 'DM Sans, sans-serif' }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
