import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { icon: Users, value: 150000, suffix: '+', label: 'Habitantes' },
  { icon: MapPin, value: 822, suffix: ' km²', label: 'Área Total' },
  { icon: Building, value: 4, suffix: '', label: 'Postos Administrativos' },
  { icon: TrendingUp, value: 45, suffix: '+', label: 'Projectos em Curso' },
];

const highlights = [
  {
    title: 'Plano de Desenvolvimento Municipal 2025-2030',
    description: 'Conheça a nossa visão estratégica para o desenvolvimento sustentável de Boane.',
    href: '/plano-desenvolvimento',
    cta: 'Consultar Plano',
  },
  {
    title: 'Projectos em Execução',
    description: 'Acompanhe o progresso das obras e iniciativas em curso no município.',
    href: '/projetos',
    cta: 'Ver Projectos',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1.5;
          const startTime = performance.now();
          
          const tick = (now: number) => {
            const elapsed = (now - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * value);
            setDisplay(current.toLocaleString('pt-MZ'));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="text-xl sm:text-3xl lg:text-4xl font-bold font-display">
      {display}{suffix}
    </div>
  );
}

export function HighlightsSection() {
  return (
    <section className="py-10 sm:py-16 lg:py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container relative z-10 px-5">
        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 mb-10 sm:mb-16"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="text-center">
              <div className="inline-flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-2 sm:mb-4">
                <stat.icon className="h-5 w-5 sm:h-7 sm:w-7 text-accent" />
              </div>
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              <div className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-primary-foreground/70 font-body">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Highlights Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-4 sm:gap-6 md:grid-cols-2"
        >
          {highlights.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="group rounded-2xl bg-primary-foreground/[0.08] backdrop-blur-sm p-5 sm:p-8 border border-primary-foreground/10 hover:bg-primary-foreground/[0.12] transition-all duration-300"
            >
              <h3 className="text-lg sm:text-xl lg:text-2xl font-display">{item.title}</h3>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-primary-foreground/80 font-body">{item.description}</p>
              <Button variant="hero" size="default" className="mt-4 sm:mt-6 font-body" asChild>
                <Link to={item.href}>
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-16 text-center"
        >
          <p className="text-sm sm:text-lg text-primary-foreground/80 mb-4 sm:mb-6 font-body">
            Quer saber mais sobre o nosso município?
          </p>
          <Button variant="heroOutline" size="lg" className="font-body" asChild>
            <Link to="/sobre">
              Descubra Boane
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
