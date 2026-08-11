import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, FileX, Clock, CheckCircle, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { requestsService } from '@/services/requests.service';
import type { ServiceRequest } from '@/types';

/* ── Types ── */
interface HistoricoItem {
  data: string;
  descricao: string;
}

interface Pedido {
  id: string;
  nuit: string;
  servico: string;
  estado: 'Recebido' | 'Em Processamento' | 'Aprovado' | 'Rejeitado' | 'Concluído';
  dataSubmissao: string;
  ultimaAtualizacao: string;
  historico: HistoricoItem[];
}

/* ── Mock data ── */
const mockPedidos: Pedido[] = [
  {
    id: 'PED-2026-0042',
    nuit: '123456789',
    servico: 'Licença de Construção',
    estado: 'Em Processamento',
    dataSubmissao: '15 Jan 2026',
    ultimaAtualizacao: '28 Fev 2026',
    historico: [
      { data: '15 Jan 2026', descricao: 'Pedido recebido pelo balcão municipal.' },
      { data: '20 Jan 2026', descricao: 'Documentação validada pelo técnico responsável.' },
      { data: '05 Fev 2026', descricao: 'Vistoria ao local agendada.' },
      { data: '28 Fev 2026', descricao: 'Vistoria realizada. Aguarda parecer final.' },
    ],
  },
  {
    id: 'PED-2026-0015',
    nuit: '987654321',
    servico: 'Alvará Comercial',
    estado: 'Concluído',
    dataSubmissao: '02 Jan 2026',
    ultimaAtualizacao: '10 Fev 2026',
    historico: [
      { data: '02 Jan 2026', descricao: 'Pedido registado com sucesso.' },
      { data: '08 Jan 2026', descricao: 'Pagamento confirmado via M-Pesa.' },
      { data: '15 Jan 2026', descricao: 'Documentação aprovada.' },
      { data: '10 Fev 2026', descricao: 'Alvará emitido. Disponível para levantamento.' },
    ],
  },
];

const estadoConfig: Record<Pedido['estado'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }> = {
  'Recebido': { variant: 'outline', icon: Clock },
  'Em Processamento': { variant: 'secondary', icon: Loader2 },
  'Aprovado': { variant: 'default', icon: CheckCircle },
  'Rejeitado': { variant: 'destructive', icon: XCircle },
  'Concluído': { variant: 'default', icon: CheckCircle },
};

/* ── Timeline component ── */
function PedidoStatusTimeline({ historico }: { historico: HistoricoItem[] }) {
  return (
    <div className="relative pl-6 space-y-6">
      <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-border" />
      {historico.map((item, i) => (
        <div key={i} className="relative">
          <div className={cn(
            "absolute -left-6 top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center",
            i === historico.length - 1
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background"
          )}>
            {i === historico.length - 1 && <ArrowRight className="h-3 w-3" />}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{item.data}</p>
            <p className="text-sm text-foreground mt-0.5">{item.descricao}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main page ── */
export default function ConsultarPedido() {
  const [pedidoId, setPedidoId] = useState('');
  const [nuit, setNuit] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<Pedido | null>(null);
  const [consultado, setConsultado] = useState(false);
  const [errors, setErrors] = useState<{ pedidoId?: string; nuit?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!pedidoId.trim()) e.pedidoId = 'O ID do pedido é obrigatório.';
    if (!nuit.trim()) e.nuit = 'O NUIT é obrigatório.';
    else if (!/^\d{9}$/.test(nuit.trim())) e.nuit = 'O NUIT deve conter exactamente 9 dígitos.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConsultar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setConsultado(false);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));

    const found = mockPedidos.find(
      (p) => p.id.toLowerCase() === pedidoId.trim().toLowerCase() && p.nuit === nuit.trim()
    );

    setResultado(found || null);
    setConsultado(true);
    setLoading(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-8 sm:py-16 lg:py-20">
        <div className="container px-4 text-center">
          <h1 className="text-xl sm:text-3xl font-bold text-primary-foreground lg:text-4xl">
            Consultar Pedido Municipal
          </h1>
          <p className="mt-1.5 sm:mt-3 text-xs sm:text-base text-primary-foreground/80 max-w-xl mx-auto">
            Acompanhe o estado do seu pedido utilizando o ID e o seu NUIT.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-5 sm:py-12 lg:py-20">
        <div className="container px-4 max-w-2xl">
          {/* Form */}
          <form onSubmit={handleConsultar} className="rounded-xl sm:rounded-2xl bg-card p-4 sm:p-6 lg:p-8 shadow-soft space-y-3 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="pedidoId" className="text-xs sm:text-sm">ID do Pedido</Label>
              <Input
                id="pedidoId"
                placeholder="Ex: PED-2026-0042"
                value={pedidoId}
                onChange={(e) => setPedidoId(e.target.value)}
                className={cn("h-9 sm:h-10 text-sm", errors.pedidoId && "border-destructive focus-visible:ring-destructive")}
              />
              {errors.pedidoId && (
                <p className="text-[11px] sm:text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.pedidoId}
                </p>
              )}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="nuit" className="text-xs sm:text-sm">NUIT (9 dígitos)</Label>
              <Input
                id="nuit"
                placeholder="Ex: 123456789"
                value={nuit}
                onChange={(e) => setNuit(e.target.value.replace(/\D/g, '').slice(0, 9))}
                inputMode="numeric"
                maxLength={9}
                className={cn("h-9 sm:h-10 text-sm", errors.nuit && "border-destructive focus-visible:ring-destructive")}
              />
              {errors.nuit && (
                <p className="text-[11px] sm:text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.nuit}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" size="default" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span className="text-sm">A consultar...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm">Consultar Pedido</span>
                </>
              )}
            </Button>
          </form>

          {/* Result */}
          {consultado && (
            <div className="mt-5 sm:mt-8 animate-fade-in">
              {resultado ? (
                <div className="rounded-xl sm:rounded-2xl bg-card p-4 sm:p-6 lg:p-8 shadow-soft space-y-4 sm:space-y-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                    <div>
                      <p className="text-[11px] sm:text-xs text-muted-foreground font-mono">{resultado.id}</p>
                      <h2 className="text-base sm:text-xl font-bold text-foreground mt-0.5 sm:mt-1">{resultado.servico}</h2>
                    </div>
                    <Badge variant={estadoConfig[resultado.estado].variant} className="self-start sm:self-auto text-xs sm:text-sm px-2.5 py-0.5 sm:px-3 sm:py-1">
                      {resultado.estado}
                    </Badge>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-muted-foreground">Submissão</p>
                      <p className="font-medium text-foreground">{resultado.dataSubmissao}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Última Atualização</p>
                      <p className="font-medium text-foreground">{resultado.ultimaAtualizacao}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="border-t border-border pt-4 sm:pt-6">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Histórico do Pedido</h3>
                    <PedidoStatusTimeline historico={resultado.historico} />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl sm:rounded-2xl bg-card p-5 sm:p-8 shadow-soft text-center">
                  <FileX className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Nenhum pedido encontrado</h3>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                    Verifique o ID do pedido e o NUIT e tente novamente.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
