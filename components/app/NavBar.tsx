'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { Zap, Search, Database, Home } from 'lucide-react';

const links = [
  { href: '/', label: 'Home', icon: <Home size={13} /> },
  { href: '/scrape', label: 'Research', icon: <Search size={13} /> },
  { href: '/database', label: 'Database', icon: <Database size={13} /> },
];

export function NavBar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <header className="topbar">
      {/* Brand */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '.88rem', fontWeight: 800, letterSpacing: '-.01em', display: 'flex', alignItems: 'center', gap: '9px', color: 'var(--ink)' }}>
          <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 9px var(--accent)', display: 'inline-block' }} />
          Prospect AI
        </div>
      </Link>

      {/* Nav links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${active ? ' active' : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '.62rem', color: 'var(--ink-3)', letterSpacing: '.1em' }}>
          v1.0
        </span>

        {/* Brand toggle — exact from brand-theme.html */}
        <div className="toggle" onClick={toggle}>
          <div className="toggle-track">
            <div className="toggle-thumb" />
          </div>
          <span className="toggle-lbl">
            {theme === 'dark' ? 'Dark' : 'Light'}
          </span>
        </div>
      </div>
    </header>
  );
}
