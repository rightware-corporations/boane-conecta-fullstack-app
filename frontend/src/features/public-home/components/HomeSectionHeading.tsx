import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type HomeSectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
};

export function HomeSectionHeading({ eyebrow, title, description, link }: HomeSectionHeadingProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 tb:flex-row tb:items-end tb:justify-between lg:mb-8">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>}
        <h2 className="text-2xl font-bold tracking-tight text-foreground tb:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-xl text-base leading-6 text-muted-foreground">{description}</p>}
      </div>
      {link && (
        <Link to={link.href} className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-primary underline-offset-4 hover:underline tb:self-auto">
          {link.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
