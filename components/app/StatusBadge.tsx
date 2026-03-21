'use client';

import { ActionStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: ActionStatus | undefined;
  label?: string;
}

const configs: Record<ActionStatus, { color: string; dot: string; text: string }> = {
  idle:    { color: 'var(--ink-3)',  dot: 'var(--ink-4)',  text: 'idle' },
  loading: { color: 'var(--teal)',   dot: 'var(--teal)',   text: 'running' },
  done:    { color: 'var(--green)',  dot: 'var(--green)',  text: 'done' },
  error:   { color: 'var(--red)',    dot: 'var(--red)',    text: 'error' },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const c = configs[status] ?? configs['idle'];
  return (
    <span
      className="status-badge"
      style={{
        color: c.color,
        background: `${c.color}12`,
        borderColor: `${c.color}28`,
      }}
    >
      <span
        className={status === 'loading' ? 'pulse-dot' : ''}
        style={{
          display: 'inline-block',
          width: '5px', height: '5px',
          borderRadius: '50%',
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {label || c.text}
    </span>
  );
}
