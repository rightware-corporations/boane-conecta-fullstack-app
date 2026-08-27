import { useEffect, useState } from 'react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { useAuth } from '@/hooks/use-auth';
import { citizenService } from '@/services/citizen.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Shield, Edit2, Save, X } from 'lucide-react';
import type { CitizenProfile } from '@/types';

export default function CitizenPerfil() {
  const { profile: authProfile } = useAuth();
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    district: '',
    neighborhood: '',
  });

  useEffect(() => {
    async function fetch() {
      const { data, error } = await citizenService.getProfile();
      if (data) {
        setProfile(data);
        setForm({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          district: data.district || '',
          neighborhood: data.neighborhood || '',
        });
      }
      setLoading(false);
    }
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await citizenService.updateProfile(form);
    if (error) {
      toast.error(error);
    } else if (data) {
      setProfile(data);
      setEditing(false);
      toast.success('Perfil actualizado com sucesso!');
    }
    setSaving(false);
  };

  return (
    <CitizenLayout title="Meu Perfil" subtitle="Gerir dados pessoais">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <div className="max-w-2xl space-y-4">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl">
                {profile?.full_name?.charAt(0) || 'M'}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{profile?.full_name || 'Munícipe'}</h2>
                <p className="text-sm text-muted-foreground">{authProfile?.role === 'municipe' ? 'Munícipe' : authProfile?.role}</p>
                <Badge variant={profile?.verified ? 'default' : 'secondary'} className="mt-1 text-xs">
                  {profile?.verified ? 'Verificado' : 'Pendente de verificação'}
                </Badge>
              </div>
              {!editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-1" /> Editar
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    <User className="h-3.5 w-3.5 inline mr-1" /> Nome Completo
                  </label>
                  {editing ? (
                    <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile?.full_name || '—'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    <Mail className="h-3.5 w-3.5 inline mr-1" /> Email
                  </label>
                  <p className="text-sm text-muted-foreground">{authProfile?.user_id || '—'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    <Phone className="h-3.5 w-3.5 inline mr-1" /> Telefone
                  </label>
                  {editing ? (
                    <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile?.phone || '—'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    <Shield className="h-3.5 w-3.5 inline mr-1" /> NUIT
                  </label>
                  <p className="text-sm text-muted-foreground">{profile?.nuit || '—'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">BI</label>
                  <p className="text-sm text-muted-foreground">{profile?.bi || '—'}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5 inline mr-1" /> Endereço
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Morada</label>
                    {editing ? (
                      <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profile?.address || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Distrito</label>
                    {editing ? (
                      <Input value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profile?.district || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Bairro</label>
                    {editing ? (
                      <Input value={form.neighborhood} onChange={e => setForm(f => ({ ...f, neighborhood: e.target.value }))} />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profile?.neighborhood || '—'}</p>
                    )}
                  </div>
                </div>
              </div>

              {editing && (
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-1" /> {saving ? 'A guardar...' : 'Guardar'}
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    <X className="h-4 w-4 mr-1" /> Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </CitizenLayout>
  );
}