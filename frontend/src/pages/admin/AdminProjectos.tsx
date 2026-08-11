import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X, FolderKanban } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Project {
  id: string;
  name: string;
  description: string | null;
  category: string;
  status: string;
  progress: number;
  budget: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  image_url: string | null;
}

const categories = ['Infraestrutura', 'Educação', 'Saúde', 'Saneamento', 'Agricultura', 'Social'];
const statuses = [
  { value: 'planeado', label: 'Planeado' },
  { value: 'em-curso', label: 'Em Curso' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'suspenso', label: 'Suspenso' },
];

export default function AdminProjectos() {
  const { user } = useAuth();
  const { canEdit, canDelete } = useUserRole();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Infraestrutura',
    status: 'planeado',
    progress: 0,
    budget: '',
    start_date: '',
    end_date: '',
    location: '',
    image_url: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar projectos');
    } else {
      setProjects(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const projectData = {
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        status: formData.status,
        progress: formData.progress,
        budget: formData.budget || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        location: formData.location || null,
        image_url: formData.image_url || null,
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
        toast.success('Projecto actualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({
            ...projectData,
            created_by: user?.id,
          });

        if (error) throw error;
        toast.success('Projecto criado com sucesso!');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao guardar projecto');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Project) => {
    setEditingProject(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category,
      status: item.status,
      progress: item.progress,
      budget: item.budget || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      location: item.location || '',
      image_url: item.image_url || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este projecto?')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao eliminar projecto');
    } else {
      toast.success('Projecto eliminado com sucesso!');
      fetchProjects();
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      category: 'Infraestrutura',
      status: 'planeado',
      progress: 0,
      budget: '',
      start_date: '',
      end_date: '',
      location: '',
      image_url: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em-curso': return 'bg-blue-100 text-blue-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'suspenso': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="Gestão de Projectos" subtitle={`${projects.length} projectos registados`}>
      <div className="flex justify-between items-center mb-6">
        <div />
        {canEdit && (
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4" />
            Novo Projecto
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl">
          <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Nenhum projecto registado ainda.</p>
          {canEdit && (
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              Criar primeiro projecto
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl shadow-soft"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full sm:w-32 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(item.status)}`}>
                    {statuses.find(s => s.value === item.status)?.label || item.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.description || 'Sem descrição'}
                </p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 bg-muted rounded">{item.category}</span>
                  {item.budget && <span>{item.budget}</span>}
                  {item.location && <span>📍 {item.location}</span>}
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
              {editingProject ? 'Editar Projecto' : 'Novo Projecto'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nome do Projecto *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ex: Reabilitação da EN1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do projecto..."
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
                <label className="block text-sm font-medium text-foreground mb-1">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Progresso: {formData.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Orçamento</label>
                <Input
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="Ex: 5.000.000 MT"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Localização</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Bairro Central"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Data de Início</label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Data de Conclusão</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">URL da Imagem</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
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
