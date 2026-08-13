import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { publicService } from '@/services/public.service';

export default function NoticiaDetalhe() {
  const { id } = useParams();

  const { data: noticia, isLoading } = useQuery({
    queryKey: ['news-detail', id],
    queryFn: async () => {
      if (!id) return null;
      const result = await publicService.getNewsDetail(id);
      if (result.error) throw new Error(result.error);
      return result.data ?? null;
    },
    enabled: !!id,
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

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
      <section className="bg-muted/30 py-4 border-b border-border">
        <div className="container px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Início</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/noticias" className="text-muted-foreground hover:text-primary transition-colors">Notícias</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium truncate max-w-[220px]">{noticia.title}</span>
          </div>
        </div>
      </section>

      <article className="py-8 lg:py-12">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Link to="/noticias" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Voltar às notícias
            </Link>

            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {noticia.category && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {noticia.category}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(noticia.published_at || noticia.created_at)}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">{noticia.title}</h1>
              {noticia.excerpt && <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{noticia.excerpt}</p>}
            </header>

            {noticia.image_url && (
              <div className="rounded-2xl overflow-hidden mb-8">
                <img src={noticia.image_url} alt={noticia.title} className="w-full h-auto object-cover aspect-video" />
              </div>
            )}

            {noticia.content ? (
              <div className="prose prose-lg max-w-none">
                {noticia.content.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Conteúdo indisponível.</p>
            )}
          </div>
        </div>
      </article>
    </Layout>
  );
}
