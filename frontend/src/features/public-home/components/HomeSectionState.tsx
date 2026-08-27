import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function HomeSectionLoading({ label }: { label: string }) {
  return (
    <div role="status" className="space-y-3" aria-label={label}>
      <div className="h-16 animate-pulse rounded-md bg-surface-subtle" />
      <div className="h-16 animate-pulse rounded-md bg-surface-subtle" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function HomeSectionError({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="flex flex-col gap-4 border-l-4 border-warning bg-surface px-4 py-4 tb:flex-row tb:items-center tb:justify-between" role="status">
      <p className="flex items-start gap-3 text-sm text-foreground">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
        {message}
      </p>
      <Button type="button" variant="outline" size="sm" onClick={retry} className="self-start tb:self-auto">
        <RefreshCw aria-hidden="true" />
        Tentar novamente
      </Button>
    </div>
  );
}
