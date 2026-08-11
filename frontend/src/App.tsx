import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PublicOnlyRoute } from "@/components/auth/PublicOnlyRoute";
import Index from "./pages/Index";
import Sobre from "./pages/Sobre";
import Servicos from "./pages/Servicos";
import Contactos from "./pages/Contactos";
import Noticias from "./pages/Noticias";
import Reclamacoes from "./pages/Reclamacoes";
import FAQ from "./pages/FAQ";
import Pelouros from "./pages/Pelouros";
import Distritos from "./pages/Distritos";
import PlanoDesenvolvimento from "./pages/PlanoDesenvolvimento";
import Projetos from "./pages/Projetos";
import Tributos from "./pages/Tributos";
import NoticiaDetalhe from "./pages/NoticiaDetalhe";
import Galeria from "./pages/Galeria";
import Concursos from "./pages/Concursos";
import Doacoes from "./pages/Doacoes";
import Documentos from "./pages/Documentos";
import Avisos from "./pages/Avisos";
import ConsultarPedido from "./pages/ConsultarPedido";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import AdminNoticias from "./pages/admin/AdminNoticias";
import AdminServicos from "./pages/admin/AdminServicos";
import AdminProjectos from "./pages/admin/AdminProjectos";
import AdminUtilizadores from "./pages/admin/AdminUtilizadores";
import AdminPedidos from "./pages/admin/AdminPedidos";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import CitizenPerfil from "./pages/citizen/CitizenPerfil";
import CitizenPedidos from "./pages/citizen/CitizenPedidos";
import CitizenDocumentos from "./pages/citizen/CitizenDocumentos";
import CitizenLicencas from "./pages/citizen/CitizenLicencas";
import CitizenPagamentos from "./pages/citizen/CitizenPagamentos";
import CitizenAgendamentos from "./pages/citizen/CitizenAgendamentos";
import CitizenNotificacoes from "./pages/citizen/CitizenNotificacoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/servicos" element={<Servicos />} />
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
              <RoleGuard allowedRoles={['super_admin', 'admin', 'funcionario']}>
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
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
