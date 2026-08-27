import { Check, SlidersHorizontal, Tags, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import {
  ALL_FILTER,
  audienceLabels,
  availabilityLabels,
  channelLabels,
} from '../lib/service-catalog';
import type { MunicipalService, ServiceCatalogFilters } from '../types';

type FilterKey = Exclude<keyof ServiceCatalogFilters, 'search'>;

type ServiceFiltersProps = {
  services: MunicipalService[];
  filters: ServiceCatalogFilters;
  onChange: (key: FilterKey, value: string) => void;
  onClear: () => void;
  activeCount: number;
};

type FilterOption = { value: string; label: string };

type FilterGroupProps = {
  label: string;
  value: string;
  options: FilterOption[];
  emptyLabel?: string;
  onChange: (value: string) => void;
};

function FilterGroup({ label, value, options, emptyLabel, onChange }: FilterGroupProps) {
  return (
    <fieldset className="border-b border-border pb-5 last:border-0">
      <legend className="mb-3 text-sm font-semibold text-foreground">{label}</legend>
      {options.length === 0 ? (
        <p className="text-sm leading-5 text-muted-foreground">{emptyLabel || 'Sem opções publicadas.'}</p>
      ) : (
        <div className="space-y-1">
          <FilterOptionButton label="Todos" selected={value === ALL_FILTER} onClick={() => onChange(ALL_FILTER)} />
          {options.map((option) => (
            <FilterOptionButton
              key={option.value}
              label={option.label}
              selected={value === option.value}
              onClick={() => onChange(option.value)}
            />
          ))}
        </div>
      )}
    </fieldset>
  );
}

function FilterOptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-11 w-full items-center justify-between rounded-sm px-2 text-left text-sm transition-colors',
        selected ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground hover:bg-muted',
      )}
      aria-pressed={selected}
    >
      {label}
      {selected && <Check className="size-4" aria-hidden="true" />}
    </button>
  );
}

function getOptions(services: MunicipalService[]) {
  const categories = [...new Set(services.map((service) => service.category))]
    .sort((a, b) => a.localeCompare(b, 'pt-MZ'))
    .map((value) => ({ value, label: value }));
  const channels = [...new Set(services.flatMap((service) => service.channels))]
    .map((value) => ({ value, label: channelLabels[value] }));
  const audiences = [...new Set(services.flatMap((service) => service.audiences))]
    .map((value) => ({ value, label: audienceLabels[value] }));
  const availability = [...new Set(services.map((service) => service.availability))]
    .map((value) => ({ value, label: availabilityLabels[value] }));

  return { categories, channels, audiences, availability };
}

function FilterBody({ services, filters, onChange, onClear, activeCount }: ServiceFiltersProps) {
  const options = getOptions(services);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Filtrar serviços</p>
        {activeCount > 0 && (
          <button type="button" onClick={onClear} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary">
            <X className="size-4" aria-hidden="true" /> Limpar
          </button>
        )}
      </div>
      <FilterGroup label="Categoria" value={filters.category} options={options.categories} onChange={(value) => onChange('category', value)} />
      <FilterGroup label="Canal" value={filters.channel} options={options.channels} emptyLabel="Canal ainda não publicado pelos serviços disponíveis." onChange={(value) => onChange('channel', value)} />
      <FilterGroup label="Público" value={filters.audience} options={options.audiences} emptyLabel="Público-alvo ainda não publicado pelos serviços disponíveis." onChange={(value) => onChange('audience', value)} />
      <FilterGroup label="Disponibilidade" value={filters.availability} options={options.availability} onChange={(value) => onChange('availability', value)} />
    </div>
  );
}

export function DesktopServiceFilters(props: ServiceFiltersProps) {
  return (
    <aside className="hidden lg:block" aria-label="Filtros do catálogo">
      <div className="sticky top-24 border-t-2 border-primary pt-5">
        <FilterBody {...props} />
      </div>
    </aside>
  );
}

export function MobileServiceFilters(props: ServiceFiltersProps) {
  const options = getOptions(props.services);

  return (
    <div className="flex gap-2 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="min-h-11 flex-1 justify-between">
            <span className="inline-flex items-center gap-2"><Tags className="size-4" /> Categorias</span>
            {props.filters.category !== ALL_FILTER && <span className="size-2 rounded-full bg-primary" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[82dvh] overflow-y-auto rounded-t-lg">
          <SheetHeader className="text-left">
            <SheetTitle>Categorias</SheetTitle>
            <SheetDescription>Escolha a área municipal que melhor corresponde ao que procura.</SheetDescription>
          </SheetHeader>
          <div className="mt-5">
            <FilterGroup label="Categoria" value={props.filters.category} options={options.categories} onChange={(value) => props.onChange('category', value)} />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="min-h-11 flex-1 justify-between">
            <span className="inline-flex items-center gap-2"><SlidersHorizontal className="size-4" /> Filtros</span>
            {props.activeCount > 0 && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                {props.activeCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[88dvh] overflow-y-auto rounded-t-lg">
          <SheetHeader className="text-left">
            <SheetTitle>Filtrar serviços</SheetTitle>
            <SheetDescription>Refine por canal, público e disponibilidade.</SheetDescription>
          </SheetHeader>
          <div className="mt-5">
            <FilterBody {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
