import { ArrowRight, Clock3, Monitor, UserRound, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';

import { StatusBadge } from '@/design-system/components/status';
import { cn } from '@/lib/utils';

import { channelLabels, formatFee } from '../lib/service-catalog';
import type { MunicipalService } from '../types';

type ServiceRowProps = {
  service: MunicipalService;
};

const availabilityTone = {
  available: 'success',
  suspended: 'warning',
  unavailable: 'danger',
} as const;

const channelIcons = {
  online: Monitor,
  in_person: UserRound,
  informational: UsersRound,
};

export function ServiceRow({ service }: ServiceRowProps) {
  return (
    <article className="group border-b border-border py-5 first:border-t sm:py-6">
      <Link
        to={`/servicos/${service.slug}`}
        className="grid min-h-11 gap-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 lg:grid-cols-[minmax(0,1fr)_auto]"
        aria-label={`Ver detalhes de ${service.title}`}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {service.category}
            </p>
            {service.availability !== 'available' && (
              <StatusBadge tone={availabilityTone[service.availability]}>{service.availabilityLabel}</StatusBadge>
            )}
          </div>
          <h2 className="mt-2 text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
            {service.title}
          </h2>
          {service.description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              {service.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {service.channels.map((channel) => {
              const Icon = channelIcons[channel];
              return (
                <span key={channel} className="inline-flex items-center gap-1.5">
                  <Icon className="size-4" aria-hidden="true" />
                  {channelLabels[channel]}
                </span>
              );
            })}
            {service.processingTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-4" aria-hidden="true" />
                {service.processingTime}
              </span>
            )}
            <span className={cn('font-medium', service.fees.length > 0 && 'text-foreground')}>
              {formatFee(service)}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 self-center text-sm font-semibold text-primary">
          Ver detalhes
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </article>
  );
}
