import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  requirements: string | null;
  documents: string | null;
  price: string | null;
  duration: string | null;
  active: boolean;
}

const categories = ['Licenciamento', 'Urbanismo', 'Ambiente', 'Social', 'Fiscal', 'Geral'];

export default function AdminServicos() {
  const { user } = useAuth();
  const { canEdit, canDelete } = useUserRole();
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Geral',
    requirements: '',
    documents: '',
    price: '',
    duration: '',
    active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar serviços');
    } else {
      setServices(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update({
            name: formData.name,
            description: formData.description || null,
            category: formData.category,
            requirements: formData.requirements || null,
            documents: formData.documents || null,
            price: formData.price || null,
            duration: formData.duration || null,
            active: formData.active,
          })
          .eq('id', editingService.id);

        if (error) throw error;
        toast.success('Serviço actualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('services')
          .insert({
            name: formData.name,
            description: formData.description || null,
            category: formData.category,
            requirements: formData.requirements || null,
            documents: formData.documents || null,
            price: formData.price || null,
            duration: formData.duration || null,
            active: formData.active,
            created_by: user?.id,
          });

        if (error) throw error;
        toast.success('Serviço criado com sucesso!');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao guardar serviço');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Service) => {
    setEditingService(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category,
      requirements: item.requirements || '',
      documents: item.documents || '',
      price: item.price || '',
      duration: item.duration || '',
      active: item.active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este serviço?')) return;

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao eliminar serviço');
    } else {
      toast.success('Serviço eliminado com sucesso!');
      fetchServices();
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      category: 'Geral',
      requirements: '',
      documents: '',
      price: '',
      duration: '',
      active: true,
    });
  };

  return (
    <AdminLayout title="Gestão de Serviços" subtitle={`${services.length} serviços registados`}>
      <div className="flex justify-between items-center mb-6">
        <div />
        {canEdit && (
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4" />
            Novo Serviço
          </Button>
        )}
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Nenhum serviço registado ainda.</p>
          {canEdit && (
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              Criar primeiro serviço
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl shadow-soft"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  {item.active ? (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.description || 'Sem descrição'}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  <span className="px-2 py-0.5 bg-muted rounded">{item.category}</span>
                  {item.price && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">{item.price}</span>
                  )}
                  {item.duration && (
                    <span className="text-muted-foreground">{item.duration}</span>
                  )}
                </div>
              </div>
              <div className="flex sm:flex-col gap-2">
                {canEdit && (
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {canDelete && (
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nome do Serviço *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ex: Licença de Construção"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do serviço..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Preço</label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ex: 500 MT"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Prazo de Execução</label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Ex: 5 dias úteis"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Requisitos</label>
              <Textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Lista de requisitos necessários..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Documentos Necessários</label>
              <Textarea
                value={formData.documents}
                onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
                placeholder="Lista de documentos necessários..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="active" className="text-sm font-medium text-foreground">
                Serviço activo (visível no portal público)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? 'A guardar...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
