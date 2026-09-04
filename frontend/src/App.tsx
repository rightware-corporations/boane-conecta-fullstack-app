import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PublicOnlyRoute } from "@/components/auth/PublicOnlyRoute";
import { ADMIN_SERVICES_READ_ROLES } from "@/features/admin-services/admin-services.authorization";

const Index = lazy(() => import("./pages/Index"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Servicos = lazy(() => import("./pages/Servicos"));
const ServicoDetalhe = lazy(() => import("./pages/ServicoDetalhe"));
const Contactos = lazy(() => import("./pages/Contactos"));
const Noticias = lazy(() => import("./pages/Noticias"));
const Reclamacoes = lazy(() => import("./pages/Reclamacoes"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Pelouros = lazy(() => import("./pages/Pelouros"));
const Distritos = lazy(() => import("./pages/Distritos"));
const PlanoDesenvolvimento = lazy(() => import("./pages/PlanoDesenvolvimento"));
const Projetos = lazy(() => import("./pages/Projetos"));
const Tributos = lazy(() => import("./pages/Tributos"));
const NoticiaDetalhe = lazy(() => import("./pages/NoticiaDetalhe"));
const Galeria = lazy(() => import("./pages/Galeria"));
const Concursos = lazy(() => import("./pages/Concursos"));
const Doacoes = lazy(() => import("./pages/Doacoes"));
const Documentos = lazy(() => import("./pages/Documentos"));
const Avisos = lazy(() => import("./pages/Avisos"));
const ConsultarPedido = lazy(() => import("./pages/ConsultarPedido"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminNoticias = lazy(() => import("./pages/admin/AdminNoticias"));
const AdminServicos = lazy(() => import("./pages/admin/AdminServicos"));
const AdminProjectos = lazy(() => import("./pages/admin/AdminProjectos"));
const AdminUtilizadores = lazy(() => import("./pages/admin/AdminUtilizadores"));
const AdminPedidos = lazy(() => import("./pages/admin/AdminPedidos"));
const AdminFilas = lazy(() => import("./pages/admin/AdminFilas"));
const AdminAgenda = lazy(() => import("./pages/admin/AdminAgenda"));
const AdminConfiguracaoFilas = lazy(() => import("./pages/admin/AdminConfiguracaoFilas"));
const CitizenDashboard = lazy(() => import("./pages/citizen/CitizenDashboard"));
const CitizenPerfil = lazy(() => import("./pages/citizen/CitizenPerfil"));
const CitizenPedidos = lazy(() => import("./pages/citizen/CitizenPedidos"));
const CitizenPedidoDetalhe = lazy(() => import("./pages/citizen/CitizenPedidoDetalhe"));
const CitizenDocumentos = lazy(() => import("./pages/citizen/CitizenDocumentos"));
const CitizenLicencas = lazy(() => import("./pages/citizen/CitizenLicencas"));
const CitizenPagamentos = lazy(() => import("./pages/citizen/CitizenPagamentos"));
const CitizenAgendamentos = lazy(() => import("./pages/citizen/CitizenAgendamentos"));
const CitizenNotificacoes = lazy(() => import("./pages/citizen/CitizenNotificacoes"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PublicQueueDisplay = lazy(() => import("./features/queue-display/PublicQueueDisplay"));

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/servicos/:slug" element={<ServicoDetalhe />} />
        <Route path="/contactos" element={<Contactos />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/reclamacoes" element={<Reclamacoes />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/pelouros" element={<Pelouros />} />
        <Route path="/distritos" element={<Distritos />} />
        <Route path="/plano-desenvolvimento" element={<PlanoDesenvolvimento />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/tributos" element={<Tributos />} />
        <Route path="/noticias/:id" element={<NoticiaDetalhe />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/concursos" element={<Concursos />} />
        <Route path="/doacoes" element={<Doacoes />} />
        <Route path="/servicos/pedidos" element={<ConsultarPedido />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/avisos" element={<Avisos />} />
        <Route path="/filas/:queueId/display" element={<PublicQueueDisplay />} />

        {/* Auth route - only accessible when not logged in */}
        <Route
          path="/auth"
          element={
            <PublicOnlyRoute>
              <Auth />
            </PublicOnlyRoute>
          }
        />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['super_admin', 'admin', 'editor', 'funcionario', 'gestor']}>
                <Dashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/noticias"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['super_admin', 'admin', 'editor']}>
                <AdminNoticias />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/servicos"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={ADMIN_SERVICES_READ_ROLES}>
                <AdminServicos />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projectos"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['super_admin', 'admin', 'gestor']}>
                <AdminProjectos />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/utilizadores"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['super_admin', 'admin']}>
                <AdminUtilizadores />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['super_admin', 'admin', 'funcionario']}>
                <AdminPedidos />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Citizen area routes */}
        <Route
          path="/municipe"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['municipe', 'super_admin', 'admin']}>
                <CitizenDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/municipe/perfil"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['municipe', 'super_admin', 'admin']}>
                <CitizenPerfil />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/municipe/pedidos"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['municipe', 'super_admin', 'admin']}>
                <CitizenPedidos />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/filas" element={<ProtectedRoute><RoleGuard allowedRoles={['super_admin', 'admin', 'funcionario', 'gestor']}><AdminFilas /></RoleGuard></ProtectedRoute>} />
        <Route path="/admin/agenda" element={<ProtectedRoute><RoleGuard allowedRoles={['super_admin', 'admin', 'funcionario', 'gestor']}><AdminAgenda /></RoleGuard></ProtectedRoute>} />
        <Route path="/admin/filas/configuracao" element={<ProtectedRoute><RoleGuard allowedRoles={['super_admin', 'admin']}><AdminConfiguracaoFilas /></RoleGuard></ProtectedRoute>} />
        <Route path="/municipe/pedidos/:id" element={<ProtectedRoute><RoleGuard allowedRoles={['municipe', 'super_admin', 'admin']}><CitizenPedidoDetalhe /></RoleGuard></ProtectedRoute>} />
        <Route
          path="/municipe/documentos"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['municipe', 'super_admin', 'admin']}>
                <CitizenDocumentos />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/municipe/licencas"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['municipe', 'super_admin', 'admin']}>
                <CitizenLicencas />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/municipe/pagamentos"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['municipe', 'super_admin', 'admin']}>
                <CitizenPagamentos />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/municipe/agendamentos"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['municipe', 'super_admin', 'admin']}>
                <CitizenAgendamentos />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/municipe/notificacoes"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['municipe', 'super_admin', 'admin']}>
                <CitizenNotificacoes />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        {/* Catch all - 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function RouteLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4" role="status">
      <p className="text-sm font-medium text-muted-foreground">A carregar página…</p>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
