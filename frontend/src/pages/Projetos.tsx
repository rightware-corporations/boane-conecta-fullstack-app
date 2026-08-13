import { Layout } from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

type Project = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  status?: string | null;
  progress?: number | null;
};

async function loadProjects(): Promise<Project[]> {
  try {
    const response = await api.get<{ data?: Project[] } | Project[]>('/public/projects');
    return Array.isArray(response) ? response : response.data || [];
  } catch {
    return [];
  }
}

export default function Projetos() {
  const { data: projetos = [], isLoading } = useQuery({
    queryKey: ['public-projects'],
    queryFn: loadProjects,
  });

  return (
    <Layout>
      <section className="bg-primary py-10 sm:py-16 lg:py-20">
        <div className="container px-5 text-center">
          <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Projectos Municipais</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Acompanhe o progresso dos projectos de desenvolvimento do Município de Boane
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container px-5">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projetos.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl shadow-soft">
              <p className="text-muted-foreground">Nenhum projecto encontrado.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {projetos.map((project) => (
                <article key={project.id} className="rounded-xl bg-card p-5 shadow-soft">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">{project.category || 'Projecto'}</span>
                  <h2 className="mt-2 text-lg font-bold text-foreground">{project.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{project.description || 'Sem descrição disponível.'}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estado: {project.status || 'Não definido'}</span>
                    <span className="font-medium text-foreground">{project.progress || 0}%</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
