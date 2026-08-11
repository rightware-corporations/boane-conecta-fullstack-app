import { Layout } from '@/components/layout/Layout';
import { MapPin, Calendar, TrendingUp, Banknote, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const statusColors: Record<string, string> = {
  'em_curso': 'bg-info text-info-foreground',
  'em-curso': 'bg-info text-info-foreground',
  'concluido': 'bg-success text-success-foreground',
  'planeado': 'bg-warning text-warning-foreground',
  'suspenso': 'bg-destructive text-destructive-foreground',
};

const statusLabels: Record<string, string> = {
  'em_curso': 'Em Curso',
  'em-curso': 'Em Curso',
  'concluido': 'Concluído',
  'planeado': 'Planeado',
  'suspenso': 'Suspenso',
};

const filters = ['Todos', 'Em Curso', 'Concluído', 'Planeado'];

export default function Projetos() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedProjeto, setSelectedProjeto] = useState<any | null>(null);

  const { data: projetos = [], isLoading } = useQuery({
    queryKey: ['public-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredProjetos = projetos.filter((projeto) => {
    if (activeFilter === 'Todos') return true;
    const label = statusLabels[projeto.status] || projeto.status;
    return label === activeFilter;
  });

  const stats = [
    { value: projetos.length, label: 'Total', color: 'text-primary' },
    { value: projetos.filter(p => p.status === 'em_curso' || p.status === 'em-curso').length, label: 'Em Curso', color: 'text-info' },
    { value: projetos.filter(p => p.status === 'concluido').length, label: 'Concluídos', color: 'text-success' },
    { value: projetos.filter(p => p.status === 'planeado').length, label: 'Planeados', color: 'text-warning' },
  ];

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

      <section className="py-6 sm:py-12 bg-muted">
        <div className="container px-5">
          <div className="grid grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={cn("text-xl sm:text-3xl font-bold", stat.color)}>{stat.value}</div>
                <div className="text-[11px] sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container px-5">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8 justify-center">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProjetos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum projecto encontrado.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {filteredProjetos.map((projeto, index) => (
                <motion.div
                  key={projeto.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-xl sm:rounded-2xl bg-card shadow-soft overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedProjeto(projeto)}
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img src={projeto.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop'} alt={projeto.name} className="h-full w-full object-cover" />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold", statusColors[projeto.status] || 'bg-muted text-muted-foreground')}>
                        {statusLabels[projeto.status] || projeto.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <span className="text-[11px] sm:text-xs font-medium text-primary uppercase tracking-wider">{projeto.category}</span>
                    <h3 className="mt-1.5 sm:mt-2 text-base sm:text-xl font-bold text-foreground">{projeto.name}</h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">{projeto.description}</p>

                    {projeto.status !== 'planeado' && (
                      <div className="mt-3 sm:mt-4">
                        <div className="flex justify-between text-xs sm:text-sm mb-1">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-medium text-foreground">{projeto.progress}%</span>
                        </div>
                        <div className="h-1.5 sm:h-2 rounded-full bg-muted">
                          <div className={cn("h-full rounded-full transition-all duration-500", projeto.status === 'concluido' ? 'bg-success' : 'bg-primary')} style={{ width: `${projeto.progress}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-4 text-[11px] sm:text-sm">
                      {projeto.location && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                          <span className="truncate">{projeto.location}</span>
                        </div>
                      )}
                      {(projeto.start_date || projeto.end_date) && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                          {projeto.start_date && new Date(projeto.start_date).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' })}
                          {projeto.end_date && ` - ${new Date(projeto.end_date).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' })}`}
                        </div>
                      )}
                    </div>

                    {projeto.budget && (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold text-foreground">{projeto.budget}</span>
                        <span className="text-[11px] sm:text-sm text-muted-foreground">Orçamento</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedProjeto} onOpenChange={(open) => !open && setSelectedProjeto(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
          {selectedProjeto && (
            <>
              <div className="relative aspect-video w-full overflow-hidden">
                <img src={selectedProjeto.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop'} alt={selectedProjeto.name} className="h-full w-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className={cn("px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold", statusColors[selectedProjeto.status] || 'bg-muted')}>
                    {statusLabels[selectedProjeto.status] || selectedProjeto.status}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/90 to-transparent" />
              </div>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6 -mt-6 relative z-10">
                <DialogHeader className="mb-4">
                  <span className="text-[11px] sm:text-xs font-medium text-primary uppercase tracking-wider">{selectedProjeto.category}</span>
                  <DialogTitle className="text-lg sm:text-xl font-bold text-foreground leading-tight mt-1">{selectedProjeto.name}</DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1.5">{selectedProjeto.description}</DialogDescription>
                </DialogHeader>

                {selectedProjeto.status !== 'planeado' && (
                  <div className="mb-4 p-3 sm:p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-xs sm:text-sm font-medium text-foreground">Progresso do Projecto</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                      <span className="text-muted-foreground">Execução</span>
                      <span className="font-semibold text-foreground">{selectedProjeto.progress}%</span>
                    </div>
                    <Progress value={selectedProjeto.progress} className="h-2.5" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                  {selectedProjeto.location && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Localização</p>
                        <p className="text-xs sm:text-sm font-medium text-foreground">{selectedProjeto.location}</p>
                      </div>
                    </div>
                  )}
                  {selectedProjeto.budget && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                      <Banknote className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Orçamento</p>
                        <p className="text-xs sm:text-sm font-medium text-foreground">{selectedProjeto.budget}</p>
                      </div>
                    </div>
                  )}
                  {selectedProjeto.start_date && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                      <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Início</p>
                        <p className="text-xs sm:text-sm font-medium text-foreground">{new Date(selectedProjeto.start_date).toLocaleDateString('pt-PT')}</p>
                      </div>
                    </div>
                  )}
                  {selectedProjeto.end_date && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                      <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Fim Previsto</p>
                        <p className="text-xs sm:text-sm font-medium text-foreground">{new Date(selectedProjeto.end_date).toLocaleDateString('pt-PT')}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Button variant="outline" className="w-full" onClick={() => setSelectedProjeto(null)}>
                  Fechar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
