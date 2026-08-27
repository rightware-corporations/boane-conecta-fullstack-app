import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import type { ReactNode } from 'react';

import { municipalConfig, telephoneHref } from '@/app/config/municipal';
import { Container, Section } from '@/design-system/primitives/layout';
import { HomeSectionHeading } from './HomeSectionHeading';

export function EssentialContacts() {
  const { phone, email, address, openingHours } = municipalConfig.contact;
  const contacts = [
    address ? { label: 'Localização', value: address, icon: MapPin } : null,
    phone ? { label: 'Telefone', value: phone, href: telephoneHref(phone), icon: Phone } : null,
    email ? { label: 'Email', value: email, href: `mailto:${email}`, icon: Mail } : null,
    openingHours ? { label: 'Horário', value: openingHours, icon: Clock } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  if (!contacts.length) return null;

  return (
    <Section aria-labelledby="essential-contacts-title" className="bg-surface">
      <Container>
        <HomeSectionHeading eyebrow="Apoio" title="Contactos essenciais" />
        <ul className="grid gap-6 tb:grid-cols-2 lg:grid-cols-4">
          {contacts.map(({ label, value, href, icon: Icon }) => (
            <li key={label} className="border-l-2 border-primary pl-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </p>
              <ContactValue href={href}>{value}</ContactValue>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function ContactValue({ href, children }: { href?: string; children: ReactNode }) {
  if (href) {
    return <a href={href} className="mt-2 block break-words font-bold underline-offset-4 hover:text-primary hover:underline">{children}</a>;
  }

  return <p className="mt-2 whitespace-pre-line font-bold">{children}</p>;
}
