import { useLocation, Link } from 'react-router-dom';
import { Newspaper, Briefcase, FolderKanban, Users, LayoutDashboard, LogOut, ClipboardList, Tickets, CalendarClock, Settings2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useUserRole } from '@/hooks/useUserRole';
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

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Notícias', url: '/admin/noticias', icon: Newspaper },
  { title: 'Serviços', url: '/admin/servicos', icon: Briefcase },
  { title: 'Projectos', url: '/admin/projectos', icon: FolderKanban },
  { title: 'Pedidos', url: '/admin/pedidos', icon: ClipboardList },
  { title: 'Filas', url: '/admin/filas', icon: Tickets },
  { title: 'Agenda', url: '/admin/agenda', icon: CalendarClock },
];

const adminItems = [
  { title: 'Utilizadores', url: '/admin/utilizadores', icon: Users },
  { title: 'Configurar filas', url: '/admin/filas/configuracao', icon: Settings2 },
];

export function AdminSidebar() {
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const { isAdmin } = useUserRole();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <LogoImage className="h-10 w-10" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Portal Admin</p>
            <p className="text-xs text-muted-foreground truncate">Conselho de Boane</p>
          </div>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão de Conteúdos</SidebarGroupLabel>
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

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
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
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium text-sm">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.full_name || 'Utilizador'}
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
