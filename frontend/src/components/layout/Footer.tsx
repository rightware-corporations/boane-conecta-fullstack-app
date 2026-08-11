import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Clock } from 'lucide-react';
import { LogoImage } from './Header';
import { motion } from 'framer-motion';

const quickLinks = [
  { name: 'Serviços ao Munícipe', href: '/servicos' },
  { name: 'Tributos e Taxas', href: '/tributos' },
  { name: 'Projetos em Curso', href: '/projetos' },
  { name: 'Notícias', href: '/noticias' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Reclamações', href: '/reclamacoes' },
];

const municipioLinks = [
  { name: 'Sobre Boane', href: '/sobre' },
  { name: 'Pelouros', href: '/pelouros' },
  { name: 'Distritos', href: '/distritos' },
  { name: 'Plano de Desenvolvimento', href: '/plano-desenvolvimento' },
  { name: 'Galeria', href: '/galeria' },
  { name: 'Contactos', href: '/contactos' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container py-8 sm:py-12 lg:py-16">
        {/* Top: Logo + Description */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-8 sm:mb-12 lg:mb-14"
        >
          <LogoImage className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 flex-shrink-0 ring-2 ring-background/10" />
          <h3 className="mt-3 sm:mt-4 text-lg sm:text-2xl lg:text-3xl leading-tight font-display">Conselho Municipal</h3>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg opacity-70 leading-relaxed max-w-md lg:max-w-lg font-body">
            Servindo a comunidade de Boane com transparência, eficiência e dedicação ao desenvolvimento local.
          </p>
          <div className="flex items-center gap-2.5 mt-4 sm:mt-5">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-background/10 hover:bg-primary hover:scale-105 transition-all duration-200"
            >
              <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs sm:text-sm lg:text-base opacity-70 hover:opacity-100 hover:text-primary transition-all font-body"
            >
              Siga-nos no Facebook
            </a>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-background/10 mb-8 sm:mb-10" />

        {/* Bottom: Links Grid */}
        <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-3">
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2.5 sm:space-y-4"
          >
            <h4 className="font-semibold text-xs sm:text-base lg:text-lg uppercase tracking-wider sm:tracking-tight sm:normal-case opacity-90 font-display">Links Rápidos</h4>
            <ul className="space-y-1.5 sm:space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-[11px] sm:text-sm lg:text-base opacity-70 hover:opacity-100 hover:text-primary hover:translate-x-1 transition-all inline-flex items-center gap-1 font-body"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* O Município */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2.5 sm:space-y-4"
          >
            <h4 className="font-semibold text-xs sm:text-base lg:text-lg uppercase tracking-wider sm:tracking-tight sm:normal-case opacity-90 font-display">O Município</h4>
            <ul className="space-y-1.5 sm:space-y-2.5">
              {municipioLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-[11px] sm:text-sm lg:text-base opacity-70 hover:opacity-100 hover:text-primary hover:translate-x-1 transition-all inline-flex items-center gap-1 font-body"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-1 space-y-2.5 sm:space-y-4 pt-2 sm:pt-0 border-t border-background/10 sm:border-0"
          >
            <h4 className="font-semibold text-xs sm:text-base lg:text-lg uppercase tracking-wider sm:tracking-tight sm:normal-case opacity-90 pt-2 sm:pt-0 font-display">Contactos</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 text-primary" />
                <span className="text-[11px] sm:text-sm lg:text-base opacity-70 font-body">
                  Av. Principal, Edifício Municipal<br />
                  Boane, Maputo
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-primary" />
                <a href="tel:+258211234567" className="text-[11px] sm:text-sm lg:text-base opacity-70 hover:opacity-100 transition-opacity font-body">
                  +258 21 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-primary" />
                <a href="mailto:info@cmboane.gov.mz" className="text-[11px] sm:text-sm lg:text-base opacity-70 hover:opacity-100 transition-opacity break-all font-body">
                  info@cmboane.gov.mz
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 text-primary" />
                <span className="text-[11px] sm:text-sm lg:text-base opacity-70 font-body">
                  Seg–Sex<br />
                  07:30 – 15:30
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container py-4 sm:py-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <p className="text-[10px] sm:text-sm opacity-50 text-center font-body">
            © {currentYear} Conselho Municipal de Boane
          </p>
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-sm opacity-50 font-body">
            <Link to="/auth" className="hover:opacity-100 transition-opacity">
              Administração
            </Link>
            <Link to="/politica-privacidade" className="hover:opacity-100 transition-opacity">
              Privacidade
            </Link>
            <Link to="/termos-uso" className="hover:opacity-100 transition-opacity">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
