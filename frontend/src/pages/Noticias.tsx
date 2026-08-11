import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Search, Calendar, ArrowRight, Tag, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const categories = ['Todas', 'Educação', 'Saúde', 'Infraestrutura', 'Ambiente', 'Eventos', 'Serviços'];

export default function Noticias() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: newsItems = [], isLoading } = useQuery({
    queryKey: ['public-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredNews = newsItems.filter((item) => {
    const matchesCategory = activeCategory === 'Todas' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = filteredNews.find(n => n.featured);
  const regularNews = filteredNews.filter(n => !n.featured);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Layout>
      <section className="bg-primary py-10 sm:py-16 lg:py-20">
        <div className="container px-5">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Notícias e Eventos</h1>
            <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-primary-foreground/80">
              Acompanhe as últimas notícias e acontecimentos do Município de Boane
            </p>
            <div className="mt-4 sm:mt-8 relative max-w-xl mx-auto">
              <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Pesquisar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-0 bg-background py-2.5 sm:py-4 pl-9 sm:pl-12 pr-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground shadow-elevated focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container px-5">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {featuredNews && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                  <Link
                    to={`/noticias/${featuredNews.id}`}
                    className="group block rounded-xl sm:rounded-2xl overflow-hidden bg-card shadow-soft mb-8 sm:mb-12 lg:flex hover:shadow-elevated transition-all duration-300"
                  >
                    <div className="lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden">
                      <img src={featuredNews.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop'} alt={featuredNews.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="lg:w-1/2 p-4 sm:p-6 lg:p-10 flex flex-col justify-center">
                      <span className="inline-block self-start rounded-full bg-accent px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-accent-foreground">
                        {featuredNews.category}
                      </span>
                      <h2 className="mt-2 sm:mt-4 text-lg sm:text-2xl font-bold text-foreground lg:text-3xl group-hover:text-primary transition-colors">
                        {featuredNews.title}
                      </h2>
                      <p className="mt-2 sm:mt-4 text-xs sm:text-sm text-muted-foreground line-clamp-3">{featuredNews.excerpt}</p>
                      <div className="mt-3 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {formatDate(featuredNews.published_at)}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {regularNews.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.4, delay: index * 0.08 }}>
                    <Link
                      to={`/noticias/${item.id}`}
                      className="group rounded-lg sm:rounded-xl overflow-hidden bg-card shadow-soft transition-all duration-300 hover:shadow-elevated block"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img src={item.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop'} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div className="p-3.5 sm:p-5">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                          <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                          <span className="text-primary font-medium">{item.category}</span>
                        </div>
                        <h3 className="mt-1.5 sm:mt-2 text-sm sm:text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                        <div className="mt-2.5 sm:mt-4 flex items-center justify-between">
                          <span className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            {formatDate(item.published_at)}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            Ler mais <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {filteredNews.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-sm text-muted-foreground">Nenhuma notícia encontrada.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
