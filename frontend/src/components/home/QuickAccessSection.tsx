import { Link } from 'react-router-dom';
import { ArrowRight, FileDown, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const documents = [
  {
    title: 'Orçamento Municipal 2026',
    type: 'PDF',
    size: '2.4 MB',
    date: '15 Jan 2026',
  },
  {
    title: 'Plano Director Municipal',
    type: 'PDF',
    size: '8.1 MB',
    date: '10 Jan 2026',
  },
  {
    title: 'Relatório de Actividades 2025',
    type: 'PDF',
    size: '5.2 MB',
    date: '05 Jan 2026',
  },
];

const announcements = [
  {
    title: 'Edital de Concurso Público',
    description: 'Contratação de serviços de manutenção de vias públicas',
    deadline: '15 Fev 2026',
  },
  {
    title: 'Aviso de Interrupção',
    description: 'Obras de saneamento no Bairro Central - 10 a 12 Fev',
    deadline: '10 Fev 2026',
  },
];

export function QuickAccessSection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background for documents section */}
      <div className="absolute inset-0 bg-gradient-to-tl from-secondary/5 via-muted to-primary/5" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/4" />

      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Documents */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Documentos</h2>
              <Link 
                to="/documentos"
                className="text-sm font-medium text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
              >
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.title}
                  className="flex items-center justify-between gap-3 sm:gap-4 rounded-lg sm:rounded-xl bg-card p-3 sm:p-4 shadow-soft transition-all duration-200 hover:shadow-elevated group"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                      <FileDown className="h-4 w-4 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-[11px] sm:text-sm text-muted-foreground">
                        {doc.type} • {doc.size} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <FileDown className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Avisos e Editais</h2>
              <Link 
                to="/avisos"
                className="text-xs sm:text-sm font-medium text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
              >
                Ver todos
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {announcements.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg sm:rounded-xl bg-card p-4 sm:p-6 shadow-soft transition-all duration-200 hover:shadow-elevated border-l-4 border-warning group"
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-warning font-medium">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Prazo: {item.deadline}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Card */}
            <div className="mt-6 sm:mt-8 rounded-lg sm:rounded-xl bg-secondary p-4 sm:p-6 text-secondary-foreground">
              <h3 className="font-semibold text-base sm:text-lg">Precisa de ajuda?</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm opacity-90">
                A nossa equipa está disponível para esclarecer as suas dúvidas.
              </p>
              <Button variant="heroOutline" size="default" className="mt-3 sm:mt-4 border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground/10" asChild>
                <Link to="/contactos">
                  Fale Connosco
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
