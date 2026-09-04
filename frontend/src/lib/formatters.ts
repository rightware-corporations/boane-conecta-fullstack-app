const mozambiqueTimeZone = 'Africa/Maputo';
const dateFormatter = new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'medium', timeZone: mozambiqueTimeZone });
const timeFormatter = new Intl.DateTimeFormat('pt-MZ', { hour: '2-digit', minute: '2-digit', timeZone: mozambiqueTimeZone });
const dateTimeFormatter = new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'medium', timeStyle: 'short', timeZone: mozambiqueTimeZone });
const currencyFormatter = new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' });

function validDate(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | number | Date | null | undefined, fallback = 'Data por confirmar') {
  const date = validDate(value);
  return date ? dateFormatter.format(date) : fallback;
}

export function formatTime(value: string | number | Date | null | undefined, fallback = 'Hora por confirmar') {
  const date = validDate(value);
  return date ? timeFormatter.format(date) : fallback;
}

export function formatDateTime(value: string | number | Date | null | undefined, fallback = 'Horário por confirmar') {
  const date = validDate(value);
  return date ? dateTimeFormatter.format(date) : fallback;
}

export function formatCurrency(value: number | null | undefined, fallback = 'Valor por confirmar') {
  return typeof value === 'number' && Number.isFinite(value) ? currencyFormatter.format(value) : fallback;
}

export function formatOperationalAge(value: string | number | Date | null | undefined, now = new Date()) {
  const date = validDate(value);
  if (!date) return 'Tempo indisponível';
  const minutes = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 60_000));
  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `Há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Há ${days} d`;
}
