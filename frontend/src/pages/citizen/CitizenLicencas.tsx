import { useEffect, useState } from 'react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { citizenService } from '@/services/citizen.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Download, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { License } from '@/types';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Shield }> = {
  active: { label: 'Activa', variant: 'default', icon: CheckCircle2 },
  expired: { label: 'Expirada', variant: 'destructive', icon: AlertTriangle },
  suspended: { label: 'Suspensa', variant: 'outline', icon: AlertTriangle },
  pending_renewal: { label: 'Renovação Pendente', variant: 'secondary', icon: RefreshCw },
};

export default function CitizenLicencas() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetch() {
      const { data } = await citizenService.getLicenses({ status: filter || undefined });
      if (data) setLicenses(data);
      setLoading(false);
    }
    fetch();
  }, [filter]);

  const filters = ['', 'active', 'expired', 'pending_renewal'];
  const filterLabels: Record<string, string> = { '': 'Todas', active: 'Activas', expired: 'Expiradas', pending_renewal: 'Renovação' };

  return (
    <CitizenLayout title="Licenças" subtitle="As suas licenças municipais">
      <div className="flex gap-2 mb-4 flex-wrap">
        {filters.map(f => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm"
            onClick={() => { setFilter(f); setLoading(true); }}>
            {filterLabels[f]}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : licenses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhuma licença encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {licenses.map(license => {
            const config = statusConfig[license.status] || statusConfig.active;
            const StatusIcon = config.icon;
            const expiresIn = Math.ceil((new Date(license.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return (
              <Card key={license.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground">{license.title}</p>
                        <Badge variant={config.variant} className="text-[10px]">
                          <StatusIcon className="h-3 w-3 mr-1" />{config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{license.type}</p>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Emissão: {new Date(license.issue_date).toLocaleDateString('pt-PT')}</span>
                        <span>Validade: {new Date(license.expiry_date).toLocaleDateString('pt-PT')}</span>
                      </div>
                      {expiresIn > 0 && expiresIn <= 30 && license.status === 'active' && (
                        <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Expira em {expiresIn} dias
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {license.document_url && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {(license.status === 'expired' || license.status === 'pending_renewal') && (
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-3 w-3 mr-1" /> Renovar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </CitizenLayout>
  );
}