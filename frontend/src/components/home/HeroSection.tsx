import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-boane.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image with parallax feel */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          src={heroImage} 
          alt="Vista panorâmica do Município de Boane" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/65 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-10 sm:py-16 lg:py-24">
        <div className="max-w-2xl space-y-3 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-md px-3.5 py-1.5 text-[11px] sm:text-sm text-primary-foreground border border-primary-foreground/10"
          >
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-accent animate-pulse" />
            Portal Oficial do Município
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl tracking-tight text-primary-foreground sm:text-4xl lg:text-6xl"
          >
            Conselho Municipal
            <span className="block text-accent drop-shadow-sm">de Boane</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-lg text-primary-foreground/80 max-w-xl leading-relaxed font-body"
          >
            Servindo a comunidade com transparência e dedicação. Aceda aos serviços municipais, 
            informações sobre projectos e notícias do nosso município.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 pt-2 sm:pt-4"
          >
            <Button variant="hero" size="default" className="font-body shadow-glow" asChild>
              <Link to="/servicos">
                Serviços ao Munícipe
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="default" className="font-body" asChild>
              <Link to="/sobre">
                Conhecer o Município
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-background via-background/50 to-transparent" />
    </section>
  );
}
