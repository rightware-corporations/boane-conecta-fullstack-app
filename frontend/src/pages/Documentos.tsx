import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { FileDown, Search, Filter, FileText, FileSpreadsheet, File } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = ['Todos', 'Orçamentos', 'Relatórios', 'Actas', 'Regulamentos', 'Planos'];

const documents = [
  {
    id: 1,
    title: 'Orçamento Municipal 2026',
    category: 'Orçamentos',
    type: 'PDF',
    size: '2.4 MB',
    date: '15 Jan 2026',
    description: 'Orçamento aprovado para o exercício fiscal de 2026.',
  },
  {
    id: 2,
    title: 'Plano Director Municipal',
    category: 'Planos',
    type: 'PDF',
    size: '8.1 MB',
    date: '10 Jan 2026',
    description: 'Plano estratégico de desenvolvimento urbano e territorial.',
  },
  {
    id: 3,
    title: 'Relatório de Actividades 2025',
    category: 'Relatórios',
    type: 'PDF',
    size: '5.2 MB',
    date: '05 Jan 2026',
    description: 'Resumo das actividades e realizações do ano de 2025.',
  },
  {
    id: 4,
    title: 'Acta da Sessão Ordinária - Dezembro 2025',
    category: 'Actas',
    type: 'PDF',
    size: '1.1 MB',
    date: '20 Dez 2025',
    description: 'Acta da última sessão ordinária da Assembleia Municipal.',
  },
  {
    id: 5,
    title: 'Regulamento de Taxas e Licenças',
    category: 'Regulamentos',
    type: 'PDF',
    size: '3.5 MB',
    date: '01 Dez 2025',
    description: 'Tabela de taxas e procedimentos para licenciamento.',
  },
  {
    id: 6,
    title: 'Orçamento Municipal 2025',
    category: 'Orçamentos',
    type: 'PDF',
    size: '2.1 MB',
    date: '15 Jan 2025',
    description: 'Orçamento aprovado para o exercício fiscal de 2025.',
  },
  {
    id: 7,
    title: 'Relatório de Contas 2024',
    category: 'Relatórios',
    type: 'PDF',
    size: '4.8 MB',
    date: '30 Mar 2025',
    description: 'Relatório financeiro e prestação de contas do ano 2024.',
  },
  {
    id: 8,
    title: 'Plano de Urbanização - Zona Central',
    category: 'Planos',
    type: 'PDF',
    size: '12.3 MB',
    date: '15 Nov 2025',
    description: 'Plano detalhado de urbanização para a zona central do município.',
  },
  {
    id: 9,
    title: 'Acta da Sessão Extraordinária - Nov 2025',
    category: 'Actas',
    type: 'PDF',
    size: '0.8 MB',
    date: '10 Nov 2025',
    description: 'Acta da sessão extraordinária sobre o orçamento suplementar.',
  },
  {
    id: 10,
    title: 'Regulamento de Obras Particulares',
    category: 'Regulamentos',
    type: 'PDF',
    size: '2.9 MB',
    date: '01 Out 2025',
    description: 'Normas e procedimentos para construção e obras particulares.',
  },
];

const iconMap: Record<string, typeof FileText> = {
  Orçamentos: FileSpreadsheet,
  Relatórios: FileText,
  Actas: File,
  Regulamentos: FileText,
  Planos: FileText,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Documentos() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const filtered = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Todos' || doc.category === category;
    return matchesSearch && matchesCategory;
  });

  const counts = categories.reduce((acc, cat) => {
    acc[cat] = cat === 'Todos' ? documents.length : documents.filter((d) => d.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      <section className="py-10 lg:py-16">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 lg:mb-10"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Documentos</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
              Consulte e descarregue os documentos oficiais do Município de Boane.
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
                placeholder="Pesquisar documentos..."
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
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat} ({counts[cat]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Category pills (mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 overflow-x-auto pb-3 mb-4 sm:hidden scrollbar-none"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat} ({counts[cat]})
              </button>
            ))}
          </motion.div>

          {/* Documents list */}
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {filtered.map((doc) => {
              const Icon = iconMap[doc.category] || FileText;
              return (
                <motion.div
                  key={doc.id}
                  variants={item}
                  className="flex items-center justify-between gap-3 rounded-xl bg-card p-3 sm:p-4 shadow-soft hover:shadow-elevated transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive flex-shrink-0">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{doc.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {doc.category}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {doc.type} • {doc.size} • {doc.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0 h-9 w-9">
                    <FileDown className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nenhum documento encontrado.</p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
