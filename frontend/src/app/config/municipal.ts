function optionalValue(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export const municipalConfig = {
  name: 'Conselho Municipal de Boane',
  contact: {
    phone: optionalValue(import.meta.env.VITE_MUNICIPAL_PHONE),
    email: optionalValue(import.meta.env.VITE_MUNICIPAL_EMAIL),
    address: optionalValue(import.meta.env.VITE_MUNICIPAL_ADDRESS),
    openingHours: optionalValue(import.meta.env.VITE_MUNICIPAL_OPENING_HOURS),
    facebookUrl: optionalValue(import.meta.env.VITE_MUNICIPAL_FACEBOOK_URL),
  },
} as const;

export function telephoneHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}
