import type { ReactNode } from 'react';
import { AlertCircle, Ban, CircleAlert, Inbox, RefreshCw, TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type StateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

function StateFrame({ icon, title, description, action, className }: StateProps & { icon: ReactNode }) {
  return (
    <div className={cn('rounded-lg border border-dashed bg-surface p-6 text-center tb:p-8', className)}>
      <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">{icon}</div>
      <h2 className="mt-4 text-base font-semibold">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function OperationalLoading({ label = 'A carregar informação operacional…' }: { label?: string }) {
  return (
    <div role="status" aria-label={label} className="space-y-3">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function OperationalEmpty(props: StateProps) {
  return <StateFrame {...props} icon={<Inbox className="size-5" aria-hidden="true" />} />;
}

export function OperationalError({ retry, ...props }: StateProps & { retry?: () => void }) {
  const action = props.action || (retry ? <Button variant="outline" onClick={retry}><RefreshCw className="mr-2 size-4" />Tentar novamente</Button> : undefined);
  return <StateFrame {...props} action={action} className={cn('border-danger/30', props.className)} icon={<AlertCircle className="size-5 text-danger" aria-hidden="true" />} />;
}

export function OperationalPartialError(props: StateProps) {
  return <StateFrame {...props} className={cn('border-warning/40 p-5 text-left', props.className)} icon={<TriangleAlert className="size-5" aria-hidden="true" />} />;
}

export function OperationalForbidden(props: StateProps) {
  return <StateFrame {...props} icon={<Ban className="size-5" aria-hidden="true" />} />;
}

export function OperationalConflict(props: StateProps) {
  return <StateFrame {...props} className={cn('border-warning/50', props.className)} icon={<CircleAlert className="size-5" aria-hidden="true" />} />;
}

export function ActionRequired(props: StateProps) {
  return <StateFrame {...props} className={cn('border-primary/40 text-left', props.className)} icon={<CircleAlert className="size-5 text-primary" aria-hidden="true" />} />;
}
