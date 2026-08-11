import { Layout } from '@/components/layout/Layout';
import { Heart, Users, Target, TrendingUp, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ContribuirModal } from '@/components/doacoes/ContribuirModal';

const initialProjectos = [
  { id: 1, titulo: 'Pavimentação da Rua Principal - Boane Sede', descricao: 'Contribua para a pavimentação da rua principal que vai beneficiar milhares de moradores.', meta: 5000000, arrecadado: 3250000, contribuintes: 342, categoria: 'Pavimentação' },
  { id: 2, titulo: 'Construção de Fontanários - Campoane', descricao: 'Ajude a financiar a construção de fontanários públicos para acesso a água potável.', meta: 2000000, arrecadado: 1100000, contribuintes: 198, categoria: 'Saneamento' },
  { id: 3, titulo: 'Iluminação Pública - Matola Rio', descricao: 'Contribua para a instalação de iluminação pública solar nas principais artérias.', meta: 3000000, arrecadado: 750000, contribuintes: 127, categoria: 'Infraestrutura' },
];

function formatMT(value: number) { return new Intl.NumberFormat('pt-MZ').format(value) + ' MT'; }

export default function Doacoes() {
  const [projectos, setProjectos] = useState(initialProjectos);
  const [selectedProject, setSelectedProject] = useState<typeof initialProjectos[0] | null>(null);

  const handleContribuicaoSuccess = (projectId: number) => {
    setProjectos((prev) => prev.map((p) => p.id === projectId ? { ...p, contribuintes: p.contribuintes + 1 } : p));
  };

  return (
    <Layout>
      <section className="bg-gradient-to-br from-primary via-primary to-secondary py-10 sm:py-16 lg:py-28">
        <div className="container px-5 text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-primary-foreground/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-primary-foreground backdrop-blur-sm mb-4 sm:mb-6">
            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Depósito no Pote
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Doações dos Moradores</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Participe no desenvolvimento da sua comunidade. Cada contribuição conta.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-16 lg:py-20 bg-muted">
        <div className="container px-5">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground text-center mb-6 sm:mb-12">Como funciona o Depósito no Pote?</h2>
          <div className="grid gap-4 sm:gap-8 grid-cols-3">
            {[
              { icon: Coins, color: 'bg-primary/10', iconColor: 'text-primary', title: '1. Escolha', desc: 'Selecione o projecto comunitário' },
              { icon: Target, color: 'bg-secondary/10', iconColor: 'text-secondary', title: '2. Contribua', desc: 'Via M-Pesa, e-Mola ou cartão' },
              { icon: TrendingUp, color: 'bg-accent/20', iconColor: 'text-accent', title: '3. Acompanhe', desc: 'Veja o progresso em tempo real' },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className={`inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full ${step.color} mb-2 sm:mb-4`}>
                  <step.icon className={`h-5 w-5 sm:h-8 sm:w-8 ${step.iconColor}`} />
                </div>
                <h3 className="font-bold text-foreground text-xs sm:text-lg">{step.title}</h3>
                <p className="mt-1 text-[11px] sm:text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-16 lg:py-24">
        <div className="container px-5">
          <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-5 sm:mb-8">Projectos Activos</h2>
          <div className="space-y-4 sm:space-y-8">
            {projectos.map((proj, index) => {
              const percentagem = Math.round((proj.arrecadado / proj.meta) * 100);
              return (
                <motion.div
                  key={proj.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-xl sm:rounded-2xl bg-card p-4 sm:p-6 lg:p-8 shadow-soft hover:shadow-elevated transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6">
                    <div className="flex-1">
                      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-primary mb-2 sm:mb-3">{proj.categoria}</span>
                      <h3 className="text-base sm:text-xl font-bold text-foreground">{proj.titulo}</h3>
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">{proj.descricao}</p>

                      <div className="mt-4 sm:mt-6">
                        <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
                          <span className="font-medium text-foreground">{formatMT(proj.arrecadado)}</span>
                          <span className="text-muted-foreground">Meta: {formatMT(proj.meta)}</span>
                        </div>
                        <div className="h-2 sm:h-3 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${percentagem}%` }} />
                        </div>
                        <div className="flex items-center justify-between mt-1.5 sm:mt-2">
                          <span className="text-xs sm:text-sm font-bold text-primary">{percentagem}%</span>
                          <span className="text-[11px] sm:text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            {proj.contribuintes} contribuintes
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button className="w-full lg:w-auto" size="default" onClick={() => setSelectedProject(proj)}>
                        <Heart className="h-4 w-4" />
                        Contribuir
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {selectedProject && (
        <ContribuirModal open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)} projeto={selectedProject} onSuccess={handleContribuicaoSuccess} />
      )}
    </Layout>
  );
}
