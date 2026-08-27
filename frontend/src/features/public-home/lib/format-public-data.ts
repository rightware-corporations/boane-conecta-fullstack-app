export function formatPublicDate(value: string | null | undefined): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('pt-MZ', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Maputo',
  }).format(date);
}
