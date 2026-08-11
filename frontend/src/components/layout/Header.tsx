import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, Facebook, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import boaneLogo from '@/assets/boane logo.jpg';

const navigation = [
  { 
    name: 'O Município', 
    href: '/sobre',
    children: [
      { name: 'Sobre Boane', href: '/sobre' },
      { name: 'Pelouros', href: '/pelouros' },
      { name: 'Distritos', href: '/distritos' },
      { name: 'Plano de Desenvolvimento', href: '/plano-desenvolvimento' },
    ]
  },
  { 
    name: 'Serviços', 
    href: '/servicos',
    children: [ 
      { name: 'Pedidos', href: '/servicos/pedidos' },
      { name: 'Tributos', href: '/tributos' },
    ]
  },
  { 
    name: 'Noticias', 
    href: '/noticias',
    children: [{ name: 'Galeria', href: '/galeria' }]
  },
  { 
    name: 'Projetos', 
    href: '/projetos',
    children: [ 
      { name: 'Concursos Públicos', href: '/concursos' },
      { name: 'Contribuição Comunitária', href: '/doacoes' },
    ]
  },
  { 
    name: 'Contactos', 
    href: '/contactos',
    children: [ 
      { name: 'Reclamações', href: '/reclamacoes' },
      { name: 'Perguntas Frequentes', href: '/faq' },
    ]
  },
];

/** Fallback logo component */
function LogoImage({ className }: { className?: string }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className={cn("flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg", className)}>
        CB
      </div>
    );
  }

  return (
    <img 
      src={boaneLogo}
      alt="Logo do Conselho Municipal de Boane" 
      className={cn("rounded-full object-cover", className)}
      onError={() => setImgError(true)}
    />
  );
}

export { LogoImage };

export function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin, isSuperAdmin } = useUserRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  }, [location.pathname]);

  // Track scroll for glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-8 sm:h-9 items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-5">
            <a href="tel:+258211234567" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone className="h-3 w-3" />
              <span className="hidden sm:inline">+258 21 123 4567</span>
            </a>
            <a href="mailto:info@cmboane.gov.mz" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Mail className="h-3 w-3" />
              <span className="hidden sm:inline">info@cmboane.gov.mz</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              <Facebook className="h-3.5 w-3.5" />
            </a>
            <Link to="/faq" className="hover:text-accent transition-colors hidden sm:inline">FAQ</Link>
            <Link to="/reclamacoes" className="hover:text-accent transition-colors hidden sm:inline">Reclamações</Link>
            <Link to="/auth" className="hover:text-accent transition-colors hidden sm:inline">Área Administrativa</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={cn(
        "border-b border-border transition-all duration-300",
        scrolled ? "glass-subtle shadow-soft" : "bg-background"
      )}>
        <div className="container flex h-14 items-center justify-between sm:h-16 lg:h-[4.5rem]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <LogoImage className="h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary sm:text-sm lg:text-base font-display tracking-normal">Conselho Municipal</span>
              <span className="text-[10px] text-muted-foreground sm:text-xs font-body">de Boane</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1 px-3 xl:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap font-body",
                    isActive(item.href) 
                      ? "text-primary bg-primary/8" 
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {item.name}
                  {item.children && (
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 opacity-50 transition-transform duration-200",
                      openDropdown === item.name && "rotate-180"
                    )} />
                  )}
                </Link>
                
                {/* Dropdown */}
                <AnimatePresence>
                  {item.children && openDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 top-full pt-1.5 w-56 z-50"
                    >
                      <div className="rounded-xl border border-border bg-card py-1.5 shadow-elevated overflow-hidden">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={cn(
                              "block px-4 py-2.5 text-sm font-body transition-all duration-150",
                              isActive(child.href)
                                ? "text-primary bg-primary/8 font-medium"
                                : "text-foreground/80 hover:text-primary hover:bg-primary/5 hover:pl-5"
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden border-t border-border glass-subtle overflow-hidden"
            >
              <div className="px-4 py-3 space-y-0.5" style={{ maxHeight: 'calc(100dvh - 7rem)', overflowY: 'auto' }}>
                <Link
                  to="/"
                  className={cn(
                    "block px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all font-body",
                    isActive('/') ? "text-primary bg-primary/8" : "text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Início
                </Link>
                {navigation.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                  >
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setMobileExpanded(mobileExpanded === item.name ? null : item.name)}
                          className={cn(
                            "flex w-full items-center justify-between px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all font-body",
                            isActive(item.href) ? "text-primary bg-primary/8" : "text-foreground"
                          )}
                        >
                          {item.name}
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", mobileExpanded === item.name && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === item.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="ml-3 border-l-2 border-primary/20 pl-3 space-y-0.5 py-1">
                                <Link
                                  to={item.href}
                                  className={cn(
                                    "block px-3 py-2 text-xs rounded-lg transition-all font-body",
                                    isActive(item.href) ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"
                                  )}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  Ver Tudo
                                </Link>
                                {item.children.map((child) => (
                                  <Link
                                    key={child.name}
                                    to={child.href}
                                    className={cn(
                                      "block px-3 py-2 text-xs rounded-lg transition-all font-body",
                                      isActive(child.href) ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "block px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all font-body",
                          isActive(item.href) ? "text-primary bg-primary/8" : "text-foreground"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
                <div className="pt-3 mt-3 border-t border-border space-y-0.5">
                  <a href="tel:+258211234567" className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-primary rounded-lg font-body">
                    <Phone className="h-3.5 w-3.5" /> +258 21 123 4567
                  </a>
                  <a href="mailto:info@cmboane.gov.mz" className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-primary rounded-lg font-body">
                    <Mail className="h-3.5 w-3.5" /> info@cmboane.gov.mz
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-primary rounded-lg font-body">
                    <Facebook className="h-3.5 w-3.5" /> Facebook
                  </a>
                </div>
                <div className="pt-3 mt-3 border-t border-border space-y-0.5">
                  <Link to="/faq" className="block px-3 py-2 text-xs text-muted-foreground hover:text-primary rounded-lg font-body" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
                  <Link to="/reclamacoes" className="block px-3 py-2 text-xs text-muted-foreground hover:text-primary rounded-lg font-body" onClick={() => setMobileMenuOpen(false)}>Reclamações</Link>
                  {user && (isAdmin || isSuperAdmin) && (
                    <Link to="/admin" className="block px-3 py-2 text-xs text-muted-foreground hover:text-primary rounded-lg font-body" onClick={() => setMobileMenuOpen(false)}>Área Administrativa</Link>
                  )}
                  {user && (
                    <Link to="/municipe" className="block px-3 py-2 text-xs text-muted-foreground hover:text-primary rounded-lg font-body" onClick={() => setMobileMenuOpen(false)}>Área do Munícipe</Link>
                  )}
                  {!user && (
                    <Link to="/auth" className="block px-3 py-2 text-xs text-muted-foreground hover:text-primary rounded-lg font-body" onClick={() => setMobileMenuOpen(false)}>Entrar</Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
