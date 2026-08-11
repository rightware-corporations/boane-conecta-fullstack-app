import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X, Newspaper } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  image_url: string | null;
  category: string;
  featured: boolean;
  published_at: string;
}

const categories = ['Educação', 'Saúde', 'Infraestrutura', 'Ambiente', 'Eventos', 'Serviços', 'Geral'];

export default function AdminNoticias() {
  const { user, profile } = useAuth();
  const { canEdit, canDelete } = useUserRole();
  const [news, setNews] = useState<News[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: 'Geral',
    featured: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar notícias');
    } else {
      setNews(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update({
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            image_url: formData.image_url || null,
            category: formData.category,
            featured: formData.featured,
          })
          .eq('id', editingNews.id);

        if (error) throw error;
        toast.success('Notícia actualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('news')
          .insert({
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            image_url: formData.image_url || null,
            category: formData.category,
            featured: formData.featured,
            author_id: user?.id,
            author_name: profile?.full_name || user?.email || 'Administrador',
          });

        if (error) throw error;
        toast.success('Notícia criada com sucesso!');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchNews();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao guardar notícia');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: News) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content || '',
      image_url: item.image_url || '',
      category: item.category,
      featured: item.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta notícia?')) return;

    const { error } = await supabase.from('news').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao eliminar notícia');
    } else {
      toast.success('Notícia eliminada com sucesso!');
      fetchNews();
    }
  };

  const resetForm = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image_url: '',
      category: 'Geral',
      featured: false,
    });
  };

  return (
    <AdminLayout title="Gestão de Notícias" subtitle={`${news.length} notícias publicadas`}>
      <div className="flex justify-between items-center mb-6">
        <div />
        {canEdit && (
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4" />
            Nova Notícia
          </Button>
        )}
      </div>

      {news.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl">
          <Newspaper className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Nenhuma notícia publicada ainda.</p>
          {canEdit && (
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              Criar primeira notícia
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl shadow-soft"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full sm:w-32 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                  {item.featured && (
                    <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
                      Destaque
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.excerpt}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 bg-muted rounded">{item.category}</span>
                  <span>{new Date(item.published_at).toLocaleDateString('pt-PT')}</span>
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
              {editingNews ? 'Editar Notícia' : 'Nova Notícia'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Título *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Título da notícia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Resumo *</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
                placeholder="Breve resumo da notícia..."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Conteúdo</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Conteúdo completo da notícia..."
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">URL da Imagem</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
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

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-foreground">Notícia em destaque</span>
                </label>
              </div>
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
