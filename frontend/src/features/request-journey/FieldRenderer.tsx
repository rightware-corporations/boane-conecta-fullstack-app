import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Field } from './schema';

export function FieldRenderer({ field, value, error, disabled, onChange }: {
  field: Field; value: unknown; error?: string; disabled: boolean; onChange: (value: unknown) => void;
}) {
  const id = `field-${field.key}`;
  const described = [field.helpText && `${id}-help`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  const base = { id, disabled, 'aria-invalid': !!error, 'aria-describedby': described };
  let control: React.ReactNode;
  switch (field.type) {
    case 'LONG_TEXT': control = <Textarea {...base} value={typeof value === 'string' ? value : ''} onChange={event => onChange(event.target.value)} />; break;
    case 'SHORT_TEXT': case 'EMAIL': case 'PHONE': case 'DATE':
      control = <Input {...base} type={{SHORT_TEXT:'text',EMAIL:'email',PHONE:'tel',DATE:'date'}[field.type]}
        value={typeof value === 'string' ? value : ''} onChange={event => onChange(event.target.value)} />; break;
    case 'INTEGER': case 'DECIMAL':
      control = <Input {...base} type="number" step={field.type === 'INTEGER' ? '1' : 'any'}
        value={typeof value === 'number' ? value : ''} onChange={event => {
          const raw = event.target.value;
          onChange(raw === '' ? null : field.type === 'INTEGER' && !/^-?\d+$/.test(raw) ? raw : Number(raw));
        }} />; break;
    case 'SINGLE_SELECT': control = <select {...base} className="min-h-11 w-full rounded-md border border-input bg-surface px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={typeof value === 'string' ? value : ''} onChange={event => onChange(event.target.value || null)}>
      <option value="">Seleccione uma opção</option>{field.options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>; break;
    case 'MULTI_SELECT': control = <fieldset disabled={disabled} aria-describedby={described} aria-invalid={!!error} className="space-y-2">
      <legend className="sr-only">{field.label}</legend>{field.options?.map(option => <label key={option.value} className="flex min-h-11 items-center gap-3">
        <input type="checkbox" className="h-5 w-5 accent-primary" checked={Array.isArray(value) && value.includes(option.value)} onChange={event => {
          const current = Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
          onChange(event.target.checked ? [...current, option.value] : current.filter(item => item !== option.value));
        }} />{option.label}</label>)}
    </fieldset>; break;
    case 'BOOLEAN': control = <select {...base} className="min-h-11 w-full rounded-md border border-input bg-surface px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={typeof value === 'boolean' ? String(value) : ''} onChange={event => onChange(event.target.value ? event.target.value === 'true' : null)}>
      <option value="">Seleccione uma resposta</option><option value="true">Sim</option><option value="false">Não</option>
    </select>; break;
    case 'ADDRESS': control = <fieldset disabled={disabled} aria-describedby={described} aria-invalid={!!error} className="space-y-3 rounded-md border border-border p-4">
      <legend className="sr-only">{field.label}</legend>{field.addressFields?.map(part => <div key={part.key} className="space-y-1">
        <label htmlFor={`${id}-${part.key}`} className="block text-sm font-medium">{part.label}{part.required ? ' *' : ''}</label>
        <Input id={`${id}-${part.key}`} value={value && typeof value === 'object' && !Array.isArray(value) && typeof (value as Record<string, unknown>)[part.key] === 'string' ? (value as Record<string, string>)[part.key] : ''}
          onChange={event => onChange({ ...(value && typeof value === 'object' && !Array.isArray(value) ? value : {}), [part.key]: event.target.value })} />
      </div>)}
    </fieldset>; break;
    default: { const exhaustive: never = field.type; return exhaustive; }
  }
  return <div className="space-y-2" data-field={field.key}>
    <label className="block font-medium" htmlFor={field.type === 'MULTI_SELECT' || field.type === 'ADDRESS' ? undefined : id}>{field.label}{field.required ? ' *' : ''}</label>
    {field.helpText && <p id={`${id}-help`} className="text-sm text-muted-foreground">{field.helpText}</p>}
    {control}
    {error && <p id={`${id}-error`} role="alert" className="text-sm text-destructive">{error}</p>}
  </div>;
}
