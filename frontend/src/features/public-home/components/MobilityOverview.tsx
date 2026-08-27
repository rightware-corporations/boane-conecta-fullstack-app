import { ArrowRight, Bell, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const localLinks = [
  { label: 'Conhecer os distritos', description: 'Consulte a organização territorial apresentada no portal.', href: '/distritos', icon: Map },
  { label: 'Avisos e informação local', description: 'Acompanhe atualizações públicas disponibilizadas pelo município.', href: '/avisos', icon: Bell },
];

export function MobilityOverview() {
  return (
    <section aria-labelledby="local-info-title" className="border border-border bg-surface px-5 py-6 tb:px-6 lg:px-8 lg:py-8 only:lg:col-span-2">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Viver em Boane</p>
      <h2 id="local-info-title" className="mt-2 text-2xl font-bold">Informação local</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        Aceda às referências territoriais e aos avisos públicos atualmente disponíveis.
      </p>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {localLinks.map(({ label, description, href, icon: Icon }) => (
          <li key={href}>
            <Link to={href} className="group flex min-h-20 items-center gap-3 py-4">
              <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block font-bold group-hover:text-primary">{label}</span>
                <span className="mt-1 block text-sm leading-5 text-muted-foreground">{description}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
