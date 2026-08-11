import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, Shield, Edit2, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UserWithRole {
  id: string;
  user_id: string;
  role: 'admin' | 'editor';
  profile: {
    full_name: string | null;
  } | null;
  email?: string;
}

export default function AdminUtilizadores() {
  const { isAdmin } = useUserRole();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'editor'>('editor');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        id,
        user_id,
        role,
        profile:profiles!user_roles_user_id_fkey(full_name)
      `)
      .order('role', { ascending: true });

    if (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar utilizadores');
    } else {
      setUsers((data as unknown as UserWithRole[]) || []);
    }
    setLoading(false);
  };

  const handleEditRole = (user: UserWithRole) => {
    setEditingUser(user);
    setNewRole(user.role);
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;
    setSaving(true);

    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('id', editingUser.id);

    if (error) {
      toast.error('Erro ao actualizar permissão');
    } else {
      toast.success('Permissão actualizada com sucesso!');
      fetchUsers();
    }
    
    setEditingUser(null);
    setSaving(false);
  };

  if (!isAdmin) {
    return (
      <AdminLayout title="Acesso Negado">
        <div className="text-center py-16 bg-card rounded-xl">
          <Shield className="h-12 w-12 mx-auto text-destructive" />
          <p className="mt-4 text-muted-foreground">
            Apenas administradores podem aceder a esta página.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestão de Utilizadores" subtitle={`${users.length} utilizadores registados`}>
      {loading ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">A carregar...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl">
          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Nenhum utilizador encontrado.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Permissão</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">
                        {user.profile?.full_name || 'Sem nome'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-secondary/10 text-secondary'
                      }`}>
                        <Shield className="h-3 w-3" />
                        {user.role === 'admin' ? 'Administrador' : 'Editor'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRole(user)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Permissão</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Alterar permissão de: <strong>{editingUser?.profile?.full_name || 'Utilizador'}</strong>
            </p>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Permissão</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'admin' | 'editor')}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="editor">Editor - Pode criar e editar conteúdos</option>
                <option value="admin">Administrador - Acesso total</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={handleSaveRole} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? 'A guardar...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
