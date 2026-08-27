import { Menu, Search, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { BrandMark } from '@/design-system/components/brand-mark';
import { Container } from '@/design-system/primitives/layout';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { publicNavigation } from '@/shells/public/public-navigation';

function isCurrentPath(currentPath: string, href: string) {
  return currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`));
}

export function PublicHeader() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const citizenHref = user ? '/municipe' : '/auth';

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/98">
      <Container className="flex min-h-16 items-center gap-2 py-2 lg:min-h-[4.5rem]">
        <Link
          to="/"
          className="mr-auto inline-flex min-h-11 items-center gap-3 rounded-md pr-2"
          aria-label="Boane Conecta — página inicial"
        >
          <BrandMark className="size-10 shrink-0 lg:size-11" />
          <span className="leading-tight">
            <span className="block text-sm font-bold text-foreground lg:text-base">Boane Conecta</span>
            <span className="block text-xs text-muted-foreground">Serviços municipais</span>
          </span>
        </Link>

        <nav aria-label="Navegação pública principal" className="hidden items-center lg:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={isCurrentPath(pathname, item.href) ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-11 items-center border-b-2 px-2 text-[13px] font-semibold transition-colors xl:px-3 xl:text-sm',
                isCurrentPath(pathname, item.href)
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/75 hover:border-border hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button asChild variant="ghost" size="icon" className="hidden tb:inline-flex" aria-label="Pesquisar">
          <Link to="/#pesquisa">
            <Search aria-hidden="true" />
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link to={citizenHref}>
            <UserRound aria-hidden="true" />
            <span className="xsm:hidden">Entrar</span>
            <span className="hidden xsm:inline">Área do Munícipe</span>
          </Link>
        </Button>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu principal">
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 xsm:max-w-md">
            <SheetHeader className="border-b border-border px-5 py-5 text-left">
              <SheetTitle className="flex items-center gap-3">
                <BrandMark className="size-10 shrink-0" />
                <span>Boane Conecta</span>
              </SheetTitle>
              <SheetDescription>Informação e serviços municipais.</SheetDescription>
            </SheetHeader>

            <nav aria-label="Menu público" className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="divide-y divide-border">
                {publicNavigation.map((item) => (
                  <li key={item.href}>
                    <SheetClose asChild>
                      <Link
                        to={item.href}
                        aria-current={isCurrentPath(pathname, item.href) ? 'page' : undefined}
                        className={cn(
                          'flex min-h-12 items-center px-3 py-3 text-base font-semibold',
                          isCurrentPath(pathname, item.href)
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary',
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-border pt-4">
                <SheetClose asChild>
                  <Link to="/#pesquisa" className="flex min-h-12 items-center gap-3 px-3 py-3 font-semibold text-foreground">
                    <Search className="size-5" aria-hidden="true" />
                    Pesquisar no portal
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to={citizenHref} className="flex min-h-12 items-center gap-3 px-3 py-3 font-semibold text-primary">
                    <UserRound className="size-5" aria-hidden="true" />
                    Área do Munícipe
                  </Link>
                </SheetClose>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
