import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Loader2, Search, Tag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { publicService } from '@/services/public.service';
import { cn } from '@/lib/utils';

const categories = ['Todas', 'Educação', 'Saúde', 'Infraestrutura', 'Ambiente', 'Eventos', 'Serviços'];

export default function Noticias() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: newsItems = [], isLoading } = useQuery({
    queryKey: ['public-news'],
    queryFn: async () => {
      const result = await publicService.getNews();
      if (result.error) throw new Error(result.error);
      return result.data || [];
    },
  });

  const filteredNews = newsItems.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesCategory = activeCategory === 'Todas' || item.category === activeCategory;
    const matchesSearch = !query || item.title.toLowerCase().includes(query) || item.excerpt.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Layout>
      <section className="bg-primary py-10 sm:py-16 lg:py-20">
        <div className="container px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Notícias e Eventos</h1>
            <p className="mt-2 text-sm text-primary-foreground/80 sm:mt-4 sm:text-lg">
              Acompanhe as últimas notícias e acontecimentos do Município de Boane
            </p>
            <div className="relative mx-auto mt-4 max-w-xl sm:mt-8">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:left-4 sm:h-5 sm:w-5" />
              <input
                type="search"
                placeholder="Pesquisar notícias..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-lg border-0 bg-background py-2.5 pl-9 pr-4 text-sm text-foreground shadow-elevated placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent sm:py-4 sm:pl-12 sm:text-base"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container px-5">
          <div className="mb-6 flex flex-wrap justify-center gap-1.5 sm:mb-8 sm:gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm',
                  activeCategory === category ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
          ) : filteredNews.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma notícia disponível.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {filteredNews.map((item) => (
                <Link
                  key={item.id}
                  to={`/noticias/${item.id}`}
                  className="group block overflow-hidden rounded-lg bg-card shadow-soft transition-all duration-300 hover:shadow-elevated sm:rounded-xl"
                >
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={item.image_url || '/placeholder.svg'}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3.5 sm:p-5">
                    <div className="flex items-center gap-1.5 text-[11px] sm:gap-2 sm:text-xs">
                      <Tag className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5" />
                      <span className="font-medium text-primary">{item.category}</span>
                    </div>
                    <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:mt-2 sm:text-base">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{item.excerpt}</p>
                    <span className="mt-2.5 flex items-center gap-1 text-[11px] text-muted-foreground sm:mt-4 sm:text-xs">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {formatDate(item.published_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
