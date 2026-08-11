import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Search, Calendar, ExternalLink, AlertTriangle, Bell, Megaphone, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { publicService } from '@/services/public.service';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Announcement } from '@/types';

const categoryLabels: Record<string, string> = {
  edital: 'Edital',
  aviso: 'Aviso',
  comunicado: 'Comunicado',
  concurso: 'Concurso',
};

const priorityConfig: Record<string, { color: string; label: string }> = {
  alta: { color: 'bg-destructive/10 text-destructive', label: 'Alta' },
  normal: { color: 'bg-warning/10 text-warning', label: 'Normal' },
  baixa: { color: 'bg-muted text-muted-foreground', label: 'Baixa' },
};

const categoryIcons: Record<string, typeof Bell> = {
  edital: Megaphone,
  aviso: AlertTriangle,
  comunicado: Bell,
  concurso: ExternalLink,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// Fallback static data
const fallbackAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Edital de Concurso Público',
    description: 'Contratação de serviços de manutenção de vias públicas no Município de Boane.',
    content: null,
    category: 'edital',
    priority: 'alta',
    deadline: '2026-02-15T00:00:00Z',
    published_at: '2026-01-20T00:00:00Z',
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z',
    attachment_url: null,
    author_name: null,
    active: true,
  },
  {
    id: '2',
    title: 'Aviso de Interrupção de Serviços',
    description: 'Obras de saneamento no Bairro Central previstas para 10 a 12 de Fevereiro.',
    content: 'Obras de saneamento no Bairro Central previstas para 10 a 12 de Fevereiro. Os serviços poderão estar interrompidos durante este período.',
    author_name: 'Departamento de Infraestruturas',
    category: 'aviso',
    priority: 'alta',
    deadline: '2026-02-10T00:00:00Z',
    published_at: '2026-01-25T00:00:00Z',
    created_at: '2026-01-25T00:00:00Z',
    updated_at: '2026-01-25T00:00:00Z',
    attachment_url: null,
    active: true,
  },
  {
    id: '3',
    title: 'Comunicado sobre Pagamento de Tributos',
    description: 'Informamos que o prazo para pagamento do IPRA foi estendido até 31 de Março de 2026.',
    content: 'Informamos que o prazo para pagamento do IPRA foi estendido até 31 de Março de 2026. Esta extensão visa facilitar o cumprimento das obrigações tributárias.',
    author_name: 'Departamento Fiscal',
    category: 'comunicado',
    priority: 'normal',
    deadline: '2026-03-31T00:00:00Z',
    published_at: '2026-01-18T00:00:00Z',
    created_at: '2026-01-18T00:00:00Z',
    updated_at: '2026-01-18T00:00:00Z',
    attachment_url: null,
    active: true,
  },
  {
    id: '4',
    title: 'Concurso para Fornecimento de Material Escolar',
    description: 'Abertura de concurso para fornecimento de material escolar às escolas primárias do distrito.',
    content: 'Abertura de concurso para fornecimento de material escolar às escolas primárias do distrito. Consulte o edital completo para requisitos.',
    author_name: 'Departamento de Educação',
    category: 'concurso',
    priority: 'normal',
    deadline: '2026-02-28T00:00:00Z',
    published_at: '2026-01-15T00:00:00Z',
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
    attachment_url: null,
    active: true,
  },
  {
    id: '5',
    title: 'Aviso de Reunião Comunitária',
    description: 'Reunião aberta com a comunidade do Posto Administrativo de Matola-Rio sobre o plano de desenvolvimento local.',
    content: 'Reunião aberta com a comunidade do Posto Administrativo de Matola-Rio sobre o plano de desenvolvimento local. Todos os munícipes estão convidados a participar.',
    author_name: 'Gabinete do Presidente do Conselho',
    category: 'aviso',
    priority: 'baixa',
    deadline: '2026-02-05T00:00:00Z',
    published_at: '2026-01-10T00:00:00Z',
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-01-10T00:00:00Z',
    attachment_url: null,
    active: true,
  },
];

const allCategories = ['Todos', 'edital', 'aviso', 'comunicado', 'concurso'];

export default function Avisos() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      const { data, error } = await publicService.getAnnouncements({ active: true });

      if (error || !data?.length) {
        setAnnouncements([]);
      } else {
        setAnnouncements(data);
      }
      setLoading(false);
    }
    fetchAnnouncements();
  }, []);

  const filtered = announcements.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesCategory = category === 'Todos' || a.category === category;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-MZ', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isExpired = (deadline: string | null) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <Layout>
      <section className="py-10 lg:py-16">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 lg:mb-10 text-center"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Avisos e Editais</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Acompanhe os avisos, editais, comunicados e concursos do Município de Boane.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar avisos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-48 h-9 text-sm">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'Todos' ? 'Todas as categorias' : categoryLabels[cat] || cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>


          {/* Announcements */}
          {loading ? (
            <div className="grid grid-cols-1 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-3">
              {filtered.slice(0, 4).map((announcement) => {
                const Icon = categoryIcons[announcement.category] || Bell;
                const priority = priorityConfig[announcement.priority] || priorityConfig.normal;
                const expired = isExpired(announcement.deadline);

                return (
                  <motion.div
                    key={announcement.id}
                    variants={item}
                    className={`rounded-xl bg-card p-4 sm:p-5 shadow-soft hover:shadow-elevated transition-all duration-200 border-l-4 group ${
                      expired ? 'border-muted-foreground/30 opacity-70' : 'border-warning'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 sm:gap-4 min-w-0">
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning/10 text-warning flex-shrink-0 mt-0.5">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                            {announcement.title}
                          </h3>
                          {announcement.description && (
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                              {announcement.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {categoryLabels[announcement.category] || announcement.category}
                            </Badge>
                            <Badge className={`text-[10px] px-1.5 py-0 ${priority.color} border-0`}>
                              {priority.label}
                            </Badge>
                            {announcement.deadline && (
                              <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${expired ? 'text-muted-foreground line-through' : 'text-warning'}`}>
                                <Calendar className="h-3 w-3" />
                                Prazo: {formatDate(announcement.deadline)}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1.5">
                            Publicado em {formatDate(announcement.published_at)}
                          </p>
                        </div>
                      </div>
                      {announcement.attachment_url && (
                        <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8" asChild>
                          <a href={announcement.attachment_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {!loading && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nenhum aviso encontrado.</p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
