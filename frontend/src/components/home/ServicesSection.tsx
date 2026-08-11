import { Link } from 'react-router-dom';
import { 
  FileText, Home, CreditCard, ClipboardList, Building2, Users,
  ArrowRight, HelpCircle, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const services = [
  { icon: FileText, title: 'Licenciamento', description: 'Alvarás, licenças de construção e actividades comerciais', href: '/servicos#licenciamento', iconColor: 'text-primary', bgColor: 'bg-primary/10' },
  { icon: Home, title: 'Habitação', description: 'Regularização de terrenos e registos de propriedade', href: '/servicos#habitacao', iconColor: 'text-secondary', bgColor: 'bg-secondary/10' },
  { icon: CreditCard, title: 'Pagamentos', description: 'Tributos, taxas e impostos municipais', href: '/tributos', iconColor: 'text-primary', bgColor: 'bg-primary/10' },
  { icon: ClipboardList, title: 'Certidões', description: 'Emissão de certidões e declarações oficiais', href: '/servicos#certidoes', iconColor: 'text-secondary', bgColor: 'bg-secondary/10' },
  { icon: Building2, title: 'Urbanismo', description: 'Planos de ordenamento e licenças urbanísticas', href: '/servicos#urbanismo', iconColor: 'text-primary', bgColor: 'bg-primary/10' },
  { icon: Users, title: 'Registo Civil', description: 'Nascimentos, casamentos e óbitos', href: '/servicos#registo-civil', iconColor: 'text-secondary', bgColor: 'bg-secondary/10' },
];

const quickActions = [
  { icon: HelpCircle, title: 'Perguntas Frequentes', href: '/faq' },
  { icon: MessageSquare, title: 'Submeter Reclamação', href: '/reclamacoes' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export function ServicesSection() {
  return (
    <section className="py-10 sm:py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-muted/80 to-secondary/[0.03]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/[0.04] rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="container relative z-10 px-5">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-12"
        >
          <span className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider font-body">
            Serviços ao Munícipe
          </span>
          <h2 className="mt-2 text-2xl text-foreground sm:text-3xl lg:text-4xl">
            Como podemos ajudar?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground font-body">
            Aceda aos principais serviços municipais de forma rápida e conveniente.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={item}>
              <Link
                to={service.href}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card p-4 sm:p-6 shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 block h-full border border-transparent hover:border-primary/10"
              >
                <div className={cn("inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl transition-all duration-300", service.bgColor)}>
                  <service.icon className={cn("h-5 w-5 sm:h-6 sm:w-6", service.iconColor)} />
                </div>
                <h3 className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors font-display">
                  {service.title}
                </h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 font-body">
                  {service.description}
                </p>
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 font-body">
                  Saber mais
                  <ArrowRight className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 sm:gap-3 rounded-xl border border-border bg-card px-4 py-3 sm:px-6 sm:py-3.5 shadow-soft transition-all duration-200 hover:shadow-elevated hover:border-primary/20 hover:-translate-y-0.5 group"
            >
              <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors font-body">
                {action.title}
              </span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </motion.div>

        {/* All Services Link */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            to="/servicos"
            className="inline-flex items-center justify-center gap-2 text-sm sm:text-base text-primary font-semibold hover:underline underline-offset-4 font-body"
          >
            Ver todos os serviços
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
