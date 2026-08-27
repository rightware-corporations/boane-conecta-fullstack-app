export type PublicNavigationItem = {
  label: string;
  href: string;
};

export const publicNavigation: PublicNavigationItem[] = [
  { label: 'Serviços', href: '/servicos' },
  { label: 'Município', href: '/sobre' },
  { label: 'Viver em Boane', href: '/distritos' },
  { label: 'Desenvolvimento', href: '/plano-desenvolvimento' },
  { label: 'Transparência', href: '/documentos' },
  { label: 'Notícias', href: '/noticias' },
];
