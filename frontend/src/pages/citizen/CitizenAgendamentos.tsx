import { useEffect, useState } from 'react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { citizenService } from '@/services/citizen.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Clock, XCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import type { Appointment } from '@/types';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  scheduled: { label: 'Agendado', variant: 'secondary' },
  confirmed: { label: 'Confirmado', variant: 'default' },
  completed: { label: 'Concluído', variant: 'default' },
  cancelled: { label: 'Cancelado', variant: 'outline' },
  rescheduled: { label: 'Reagendado', variant: 'secondary' },
};

export default function CitizenAgendamentos() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await citizenService.getAppointments();
      if (data) setAppointments(data);
      setLoading(false);
    }
    fetch();
  }, []);

  const upcoming = appointments.filter(a => new Date(a.date) >= new Date() && a.status !== 'cancelled');
  const past = appointments.filter(a => new Date(a.date) < new Date() || a.status === 'cancelled');

  return (
    <CitizenLayout title="Agendamentos" subtitle="Os seus agendamentos no município">
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Sem agendamentos.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Próximos Agendamentos</h3>
              <div className="space-y-3">
                {upcoming.map(appt => {
                  const config = statusConfig[appt.status] || statusConfig.scheduled;
                  return (
                    <Card key={appt.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-foreground">{appt.service_name}</p>
                              <Badge variant={config.variant} className="text-[10px]">{config.label}</Badge>
                            </div>
                            <div className="space-y-1 mt-2">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(appt.date).toLocaleDateString('pt-PT')} às {appt.time}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {appt.location}
                                {appt.counter && ` — Balcão ${appt.counter}`}
                              </p>
                            </div>
                            {appt.instructions && (
                              <p className="text-xs text-muted-foreground mt-2 bg-muted p-2 rounded">{appt.instructions}</p>
                            )}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            {(appt.status === 'scheduled' || appt.status === 'confirmed') && (
                              <>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Reagendar">
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Cancelar">
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Histórico</h3>
              <div className="space-y-3">
                {past.map(appt => {
                  const config = statusConfig[appt.status] || statusConfig.completed;
                  return (
                    <Card key={appt.id} className="opacity-75">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">{appt.service_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(appt.date).toLocaleDateString('pt-PT')} — {appt.location}
                            </p>
                          </div>
                          <Badge variant={config.variant} className="text-[10px]">{config.label}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </CitizenLayout>
  );
}