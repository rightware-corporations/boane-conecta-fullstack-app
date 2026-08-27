import * as React from 'react';

import { cn } from '@/lib/utils';

type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const toneStyles: Record<StatusTone, { dot: string; text: string; badge: string }> = {
  neutral: { dot: 'bg-muted-foreground', text: 'text-muted-foreground', badge: 'border-border bg-muted text-foreground' },
  success: { dot: 'bg-success', text: 'text-success', badge: 'border-success/30 bg-success/10 text-success' },
  warning: { dot: 'bg-warning', text: 'text-warning-foreground', badge: 'border-warning/40 bg-warning/15 text-foreground' },
  danger: { dot: 'bg-danger', text: 'text-danger', badge: 'border-danger/30 bg-danger/10 text-danger' },
  info: { dot: 'bg-info', text: 'text-info', badge: 'border-info/30 bg-info/10 text-info' },
};

type StatusDotProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusTone;
};

export function StatusDot({ className, tone = 'neutral', ...props }: StatusDotProps) {
  return <span aria-hidden="true" className={cn('inline-block size-2 shrink-0 rounded-full', toneStyles[tone].dot, className)} {...props} />;
}

type StatusTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusTone;
  showDot?: boolean;
};

export function StatusText({ className, tone = 'neutral', showDot = true, children, ...props }: StatusTextProps) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm font-medium', toneStyles[tone].text, className)} {...props}>
      {showDot && <StatusDot tone={tone} />}
      {children}
    </span>
  );
}

type StatusBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusTone;
};

export function StatusBadge({ className, tone = 'neutral', children, ...props }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex min-h-6 items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-semibold', toneStyles[tone].badge, className)} {...props}>
      <StatusDot tone={tone} />
      {children}
    </span>
  );
}
