import { Layout } from '@/components/layout/Layout';
import { Calendar, MapPin, Clock, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ConcursoDrawer } from '@/components/concursos/ConcursoDrawer';

const concursos = [
  { id: 1, titulo: 'Concurso Público para Manutenção de Vias', descricao: 'Contratação de empresa para manutenção e reabilitação de vias urbanas no Município de Boane.', categoria: 'Obras Públicas', dataPublicacao: '01 Fev 2026', dataLimite: '28 Fev 2026', estado: 'aberto', valor: '15,000,000 MT', local: 'Boane Sede', editalUrl: '#' },
  { id: 2, titulo: 'Fornecimento de Material Escolar', descricao: 'Aquisição de material escolar para distribuição nas escolas primárias do município.', categoria: 'Educação', dataPublicacao: '25 Jan 2026', dataLimite: '20 Fev 2026', estado: 'aberto', valor: '3,500,000 MT', local: 'Todo o Município', editalUrl: '#' },
  { id: 3, titulo: 'Construção de Poços de Água', descricao: 'Construção de 10 poços de água potável em zonas rurais do município.', categoria: 'Saneamento', dataPublicacao: '15 Jan 2026', dataLimite: '10 Fev 2026', estado: 'encerrado', valor: '8,000,000 MT', local: 'Campoane', editalUrl: '#' },
  { id: 4, titulo: 'Recrutamento de Técnicos de Saúde', descricao: 'Concurso para preenchimento de vagas para técnicos de saúde nos centros de saúde municipais.', categoria: 'Saúde', dataPublicacao: '10 Jan 2026', dataLimite: '05 Fev 2026', estado: 'encerrado', valor: '-', local: 'Boane Sede', editalUrl: '#' },
];

const categorias = ['Todos', 'Obras Públicas', 'Educação', 'Saneamento', 'Saúde'];

export default function Concursos() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [pesquisa, setPesquisa] = useState('');
  const [selectedConcurso, setSelectedConcurso] = useState<typeof concursos[0] | null>(null);

  const filtrados = concursos.filter((c) => {
    const matchCategoria = categoriaActiva === 'Todos' || c.categoria === categoriaActiva;
    const matchPesquisa = c.titulo.toLowerCase().includes(pesquisa.toLowerCase()) || c.descricao.toLowerCase().includes(pesquisa.toLowerCase());
    return matchCategoria && matchPesquisa;
  });

  return (
    <Layout>
      <section className="bg-primary py-10 sm:py-16 lg:py-28">
        <div className="container px-5 text-center">
          <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Concursos Públicos</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Oportunidades de concursos e licitações do Município de Boane
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-16 lg:py-24">
        <div className="container px-5">
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Pesquisar concursos..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={cn(
                  "rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors",
                  categoriaActiva === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Concursos List */}
          <div className="space-y-4 sm:space-y-6">
            {filtrados.map((concurso, index) => (
              <motion.div
                key={concurso.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={cn(
                  "rounded-xl sm:rounded-2xl bg-card p-4 sm:p-6 shadow-soft transition-all duration-200 hover:shadow-elevated border-l-4",
                  concurso.estado === 'aberto' ? 'border-primary' : 'border-muted-foreground/30'
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold",
                        concurso.estado === 'aberto' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      )}>
                        {concurso.estado === 'aberto' ? 'Aberto' : 'Encerrado'}
                      </span>
                      <span className="text-[11px] sm:text-xs text-muted-foreground">{concurso.categoria}</span>
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-foreground">{concurso.titulo}</h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">{concurso.descricao}</p>
                    <div className="mt-2.5 sm:mt-4 flex flex-wrap items-center gap-2.5 sm:gap-4 text-[11px] sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {concurso.dataPublicacao}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {concurso.dataLimite}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {concurso.local}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between lg:flex-col lg:items-end lg:text-right flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border">
                    <div className="text-sm sm:text-lg font-bold text-foreground">{concurso.valor}</div>
                    <Button
                      variant={concurso.estado === 'aberto' ? 'default' : 'outline'}
                      size="sm"
                      className="lg:mt-3"
                      onClick={() => setSelectedConcurso(concurso)}
                    >
                      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Ver Edital
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtrados.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-sm text-muted-foreground">
              Nenhum concurso encontrado com os critérios selecionados.
            </div>
          )}
        </div>
      </section>

      <ConcursoDrawer
        open={!!selectedConcurso}
        onOpenChange={(open) => !open && setSelectedConcurso(null)}
        concurso={selectedConcurso}
      />
    </Layout>
  );
}
