import { Link } from 'react-router-dom';
import { Heart, Award, Briefcase, ClipboardList, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const cards = [
  {
    title: 'Doações',
    description: 'Contribua para projectos comunitários',
    href: '/doacoes',
    icon: Heart,
    color: 'text-primary',
    bg: 'bg-primary/10',
    hoverBg: 'group-hover:bg-primary',
    hoverColor: 'group-hover:text-primary-foreground',
  },
  {
    title: 'Concursos',
    description: 'Oportunidades de licitação pública',
    href: '/concursos',
    icon: Award,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    hoverBg: 'group-hover:bg-secondary',
    hoverColor: 'group-hover:text-secondary-foreground',
  },
  {
    title: 'Serviços',
    description: 'Todos os serviços municipais',
    href: '/servicos',
    icon: Briefcase,
    color: 'text-primary',
    bg: 'bg-primary/10',
    hoverBg: 'group-hover:bg-primary',
    hoverColor: 'group-hover:text-primary-foreground',
  },
  {
    title: 'Pedidos',
    description: 'Consulte o estado do seu pedido',
    href: '/servicos/pedidos',
    icon: ClipboardList,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    hoverBg: 'group-hover:bg-secondary',
    hoverColor: 'group-hover:text-secondary-foreground',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

export function QuickAccessCards() {
  return (
    <section className="py-10 lg:py-14 -mt-6 sm:-mt-8 relative z-10">
      <div className="container">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-30px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {cards.map((card) => (
            <motion.div key={card.title} variants={item}>
              <Link
                to={card.href}
                className="group relative rounded-2xl bg-card p-4 sm:p-5 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col items-center text-center h-full overflow-hidden hover:-translate-y-1"
              >
                <div className={cn(
                  "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300",
                  card.bg, card.hoverBg
                )}>
                  <card.icon className={cn("h-6 w-6 sm:h-7 sm:w-7 transition-colors duration-300", card.color, card.hoverColor)} />
                </div>
                <h3 className="font-semibold text-foreground text-sm font-display">{card.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-body">{card.description}</p>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-2.5 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
