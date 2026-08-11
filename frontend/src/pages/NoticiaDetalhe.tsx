import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Calendar, ArrowLeft, Tag, Share2, Facebook, Twitter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function NoticiaDetalhe() {
  const { id } = useParams();

  const { data: noticia, isLoading } = useQuery({
    queryKey: ['news-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: relatedNews = [] } = useQuery({
    queryKey: ['related-news', noticia?.category, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('category', noticia!.category)
        .neq('id', id!)
        .limit(2);
      if (error) throw error;
      return data;
    },
    enabled: !!noticia,
  });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!noticia) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <h1 className="text-2xl font-bold text-foreground">Notícia não encontrada</h1>
            <p className="mt-2 text-muted-foreground">A notícia que procura não existe ou foi removida.</p>
            <Button asChild className="mt-6">
              <Link to="/noticias">Voltar às Notícias</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-muted/30 py-3 sm:py-4 border-b border-border">
        <div className="container px-4 sm:px-6">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Início</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/noticias" className="text-muted-foreground hover:text-primary transition-colors">Notícias</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-[200px]">{noticia.title}</span>
          </div>
        </div>
      </section>

      <article className="py-6 sm:py-8 lg:py-12">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Link to="/noticias" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors mb-4 sm:mb-6">
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Voltar às notícias
            </Link>

            <header className="mb-5 sm:mb-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium text-primary">
                  <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {noticia.category}
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {formatDate(noticia.published_at)}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">{noticia.title}</h1>
              <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-muted-foreground leading-relaxed">{noticia.excerpt}</p>
              {noticia.author_name && (
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
                  Por <span className="font-medium text-foreground">{noticia.author_name}</span>
                </div>
              )}
            </header>

            {noticia.image_url && (
              <div className="rounded-xl sm:rounded-2xl overflow-hidden mb-5 sm:mb-8">
                <img src={noticia.image_url} alt={noticia.title} className="w-full h-auto object-cover aspect-video" />
              </div>
            )}

            {noticia.content && (
              <div className="prose prose-sm sm:prose-lg max-w-none">
                {noticia.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-foreground/90 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <span className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                  <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Partilhar esta notícia:
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9">
                    <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9">
                    <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Twitter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {relatedNews.length > 0 && (
        <section className="py-8 sm:py-12 bg-muted/30">
          <div className="container px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Notícias Relacionadas</h2>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {relatedNews.map((item) => (
                  <Link
                    key={item.id}
                    to={`/noticias/${item.id}`}
                    className="group rounded-xl overflow-hidden bg-card shadow-soft transition-all duration-300 hover:shadow-elevated"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img src={item.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop'} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="p-3.5 sm:p-5">
                      <span className="text-[11px] sm:text-xs font-medium text-primary">{item.category}</span>
                      <h3 className="mt-1.5 sm:mt-2 text-sm sm:text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                      <span className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {formatDate(item.published_at)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
