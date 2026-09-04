import { AdminLayout } from '@/components/admin/AdminLayout';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OperationalEmpty } from '@/design-system/components/operational-state';
import { useAuth } from '@/hooks/use-auth';
import { landingActionsForRole } from '@/shells/internal/internal-navigation';

const roleLabels = {
  super_admin: 'Super administrador',
  admin: 'Administrador',
  editor: 'Editor',
  funcionario: 'Funcionário',
  gestor: 'Gestor',
  municipe: 'Munícipe',
} as const;

export default function Dashboard() {
  const { role } = useAuth();
  const actions = landingActionsForRole(role);
  const roleLabel = role ? roleLabels[role] : 'Utilizador interno';

  return (
    <AdminLayout title="Área interna" subtitle="Operações municipais" shell="operations">
      <div className="space-y-8">
        <section aria-labelledby="internal-context-title" className="border-b pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Contexto de acesso</p>
          <h2 id="internal-context-title" className="mt-2 text-xl font-semibold text-foreground tb:text-2xl">Trabalho interno do Município de Boane</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Sessão activa como <span className="font-medium text-foreground">{roleLabel}</span>. Escolha uma tarefa disponível para o seu perfil.
          </p>
        </section>

        <section aria-labelledby="available-tasks-title">
          <div className="mb-4">
            <h2 id="available-tasks-title" className="text-lg font-semibold text-foreground">O que pode fazer agora</h2>
            <p className="mt-1 text-sm text-muted-foreground">Apenas operações já disponíveis e associadas ao seu acesso actual.</p>
          </div>

          {actions.length > 0 ? (
            <ul className="divide-y rounded-lg border bg-surface" aria-label="Tarefas internas disponíveis">
              {actions.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="group flex min-h-20 items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring xsm:px-5"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-foreground">{label}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {href === '/admin/filas' ? 'Acompanhar e operar o atendimento presencial.' : 'Consultar marcações e realizar check-in autorizado.'}
                      </span>
                    </span>
                    <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <OperationalEmpty
              title="Sem operações disponíveis"
              description="O seu perfil pode entrar na área interna, mas não possui destinos operacionais aprovados nesta versão. Nenhuma permissão adicional foi assumida."
            />
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
