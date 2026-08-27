import { Clock, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { municipalConfig, telephoneHref } from '@/app/config/municipal';
import { BrandMark } from '@/design-system/components/brand-mark';
import { Container } from '@/design-system/primitives/layout';

const serviceLinks = [
  { label: 'Encontrar serviços', href: '/servicos' },
  { label: 'Consultar pedido', href: '/servicos/pedidos' },
  { label: 'Reportar um problema', href: '/reclamacoes' },
  { label: 'Área do Munícipe', href: '/auth' },
];

const civicLinks = [
  { label: 'Município', href: '/sobre' },
  { label: 'Viver em Boane', href: '/distritos' },
  { label: 'Desenvolvimento', href: '/plano-desenvolvimento' },
  { label: 'Transparência', href: '/documentos' },
  { label: 'Notícias', href: '/noticias' },
];

export function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const { phone, email, address, openingHours, facebookUrl } = municipalConfig.contact;
  const hasContactDetails = Boolean(phone || email || address || openingHours || facebookUrl);

  return (
    <footer className="border-t border-border bg-surface-inverse text-background">
      <Container className="grid gap-10 py-12 tb:grid-cols-2 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <BrandMark className="size-12 shrink-0" />
            <div>
              <p className="font-bold">Boane Conecta</p>
              <p className="text-sm opacity-70">Portal de serviços municipais</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 opacity-75">
            Um ponto de acesso à informação pública e aos serviços disponibilizados pelo município.
          </p>
        </div>

        <FooterLinkGroup title="Serviços" links={serviceLinks} className="lg:col-span-2" />
        <FooterLinkGroup title="Informação municipal" links={civicLinks} className="lg:col-span-3" />

        {hasContactDetails && (
          <div className="lg:col-span-3">
            <h2 className="text-base font-semibold tracking-normal text-background">Contactos oficiais</h2>
            <ul className="mt-4 space-y-3 text-sm opacity-80">
              {address && <ContactItem icon={MapPin}>{address}</ContactItem>}
              {phone && (
                <ContactItem icon={Phone}>
                  <a href={telephoneHref(phone)} className="underline-offset-4 hover:underline">{phone}</a>
                </ContactItem>
              )}
              {email && (
                <ContactItem icon={Mail}>
                  <a href={`mailto:${email}`} className="break-all underline-offset-4 hover:underline">{email}</a>
                </ContactItem>
              )}
              {openingHours && <ContactItem icon={Clock}>{openingHours}</ContactItem>}
              {facebookUrl && (
                <ContactItem icon={Facebook}>
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                    Facebook
                  </a>
                </ContactItem>
              )}
            </ul>
          </div>
        )}
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-5 text-xs opacity-65">
          © {currentYear} Conselho Municipal de Boane
        </Container>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
  className,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="text-base font-semibold tracking-normal text-background">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm opacity-80">
        {links.map((link) => (
          <li key={link.href}>
            <Link to={link.href} className="underline-offset-4 hover:underline">{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactItem({ icon: Icon, children }: { icon: typeof MapPin; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span className="whitespace-pre-line">{children}</span>
    </li>
  );
}
