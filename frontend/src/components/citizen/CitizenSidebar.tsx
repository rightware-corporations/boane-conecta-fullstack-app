import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  ClipboardList,
  FileText,
  Shield,
  CreditCard,
  Calendar,
  Bell,
  LogOut,
  Home,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { LogoImage } from '@/components/layout/Header';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  { title: 'Painel', url: '/municipe', icon: LayoutDashboard },
  { title: 'Meu Perfil', url: '/municipe/perfil', icon: User },
  { title: 'Meus Pedidos', url: '/municipe/pedidos', icon: ClipboardList },
  { title: 'Documentos', url: '/municipe/documentos', icon: FileText },
  { title: 'Licenças', url: '/municipe/licencas', icon: Shield },
  { title: 'Pagamentos', url: '/municipe/pagamentos', icon: CreditCard },
  { title: 'Agendamentos', url: '/municipe/agendamentos', icon: Calendar },
  { title: 'Notificações', url: '/municipe/notificacoes', icon: Bell },
];

export function CitizenSidebar() {
  const location = useLocation();
  const { user, profile, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <LogoImage className="h-10 w-10" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Área do Munícipe</p>
            <p className="text-xs text-muted-foreground truncate">Conselho de Boane</p>
          </div>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground"
                  >
                    <Home className="h-5 w-5" />
                    <span>Voltar ao Portal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'M'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.full_name || 'Munícipe'}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Terminar Sessão
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}