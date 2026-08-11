import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const news = [
  {
    id: 1,
    title: 'Inauguração da Nova Escola Primária no Bairro Central',
    excerpt: 'O Conselho Municipal de Boane inaugurou hoje a nova escola primária que vai beneficiar mais de 500 crianças da comunidade local.',
    date: '28 Jan 2026',
    category: 'Educação',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'Campanha de Limpeza nas Principais Artérias',
    excerpt: 'Junta-se à nossa campanha mensal de limpeza urbana. Próxima acção no dia 5 de Fevereiro.',
    date: '25 Jan 2026',
    category: 'Ambiente',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Novo Sistema de Pagamento de Tributos Online',
    excerpt: 'Facilite o pagamento dos seus impostos municipais através do novo portal online.',
    date: '20 Jan 2026',
    category: 'Serviços',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    title: 'Feira Agrícola de Boane 2026',
    excerpt: 'A maior feira agrícola da região regressa em Março. Inscrições abertas para expositores.',
    date: '15 Jan 2026',
    category: 'Eventos',
    image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&h=400&fit=crop',
  },
];

export function NewsSection() {
  const featuredNews = news.find(n => n.featured);
  const otherNews = news.filter(n => !n.featured);

  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="container px-5">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider font-body">
            Notícias e Eventos
          </span>
          <h2 className="mt-2 text-3xl text-foreground sm:text-4xl lg:text-5xl">
            Últimas Notícias
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto font-body">
            Fique a par das novidades e eventos do município de Boane.
          </p>
          <div className="mt-5 sm:mt-6 flex justify-center">
            <Button variant="outline" size="default" className="font-body" asChild>
              <Link to="/noticias">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* News Grid */}
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
          {/* Featured News */}
          <div className="space-y-4 sm:space-y-5">
            {featuredNews && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link 
                  to={`/noticias/${featuredNews.id}`}
                  className="group relative overflow-hidden rounded-2xl bg-card shadow-soft transition-all duration-300 hover:shadow-elevated block"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img 
                      src={featuredNews.image} 
                      alt={featuredNews.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                    <span className="inline-block rounded-full bg-accent px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-accent-foreground font-body">
                      {featuredNews.category}
                    </span>
                    <h3 className="mt-2 sm:mt-3 text-base sm:text-xl lg:text-2xl text-primary-foreground group-hover:text-accent transition-colors duration-300">
                      {featuredNews.title}
                    </h3>
                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-primary-foreground/80 line-clamp-2 font-body">
                      {featuredNews.excerpt}
                    </p>
                    <div className="mt-2.5 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-primary-foreground/60 font-body">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {featuredNews.date}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Extra news below featured - visible only on lg+ */}
            {otherNews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:block"
              >
                <Link
                  to={`/noticias/${otherNews[otherNews.length - 1].id}`}
                  className="group flex gap-4 rounded-xl bg-card p-3.5 shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 border border-transparent hover:border-primary/10"
                >
                  <div className="h-22 w-22 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <img 
                      src={otherNews[otherNews.length - 1].image} 
                      alt={otherNews[otherNews.length - 1].title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-xs font-medium text-primary font-body">
                      {otherNews[otherNews.length - 1].category}
                    </span>
                    <h3 className="mt-1 text-sm sm:text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {otherNews[otherNews.length - 1].title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground font-body">
                      <Calendar className="h-3.5 w-3.5" />
                      {otherNews[otherNews.length - 1].date}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Other News */}
          <div className="space-y-3 sm:space-y-4">
            {otherNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/noticias/${item.id}`}
                  className="group flex gap-3 sm:gap-4 rounded-xl bg-card p-3 sm:p-3.5 shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 border border-transparent hover:border-primary/10"
                >
                  <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[11px] sm:text-xs font-medium text-primary font-body">
                      {item.category}
                    </span>
                    <h3 className="mt-0.5 sm:mt-1 text-sm sm:text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted-foreground font-body">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {item.date}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
