import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, FileText, Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Concurso {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  dataPublicacao: string;
  dataLimite: string;
  estado: string;
  valor: string;
  local: string;
  editalUrl: string;
}

interface ConcursoDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  concurso: Concurso | null;
}

export function ConcursoDrawer({ open, onOpenChange, concurso }: ConcursoDrawerProps) {
  if (!concurso) return null;

  const handlePartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: concurso.titulo,
          text: concurso.descricao,
          url: window.location.href,
        });
      } catch { /* user cancelled */ }
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={concurso.estado === 'aberto' ? 'default' : 'secondary'}>
              {concurso.estado === 'aberto' ? 'Aberto' : 'Encerrado'}
            </Badge>
            <Badge variant="outline">{concurso.categoria}</Badge>
          </div>
          <SheetTitle className="text-xl">{concurso.titulo}</SheetTitle>
          <SheetDescription>{concurso.descricao}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <Calendar className="h-3.5 w-3.5" /> Publicado em
              </p>
              <p className="font-medium text-sm text-foreground">{concurso.dataPublicacao}</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <Clock className="h-3.5 w-3.5" /> Prazo limite
              </p>
              <p className="font-medium text-sm text-foreground">{concurso.dataLimite}</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <MapPin className="h-3.5 w-3.5" /> Local
              </p>
              <p className="font-medium text-sm text-foreground">{concurso.local}</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground mb-1">Valor estimado</p>
              <p className="font-bold text-sm text-foreground">{concurso.valor}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {concurso.estado === 'aberto' && (
              <Button className="w-full" size="lg" asChild>
                <a href={concurso.editalUrl} target="_blank" rel="noreferrer">
                  <FileText className="h-5 w-5" />
                  Abrir Edital
                </a>
              </Button>
            )}
            <Button variant="outline" className="w-full" size="lg" asChild>
              <a href={concurso.editalUrl} target="_blank" rel="noreferrer" download>
                <Download className="h-5 w-5" />
                Download do Edital
              </a>
            </Button>
            <Button variant="ghost" className="w-full" size="lg" onClick={handlePartilhar}>
              <Share2 className="h-5 w-5" />
              Partilhar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
