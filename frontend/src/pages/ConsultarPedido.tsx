import { Link } from 'react-router-dom';
import { FileSearch, LockKeyhole } from 'lucide-react';

import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

/**
 * No public request lookup is available until an approved, privacy-safe
 * lookup contract exists. Never fabricate municipal request results.
 */
export default function ConsultarPedido() {
  const { isAuthenticated, role } = useAuth();
  const isCitizen = isAuthenticated && role === 'municipe';

  return (
    <Layout>
      <section className="container max-w-3xl px-4 py-12 sm:py-20" aria-labelledby="request-lookup-title">
        <div className="border-b border-border pb-8">
          <p className="text-sm font-semibold text-primary">Serviços municipais</p>
          <h1 id="request-lookup-title" className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Consultar o estado de um pedido
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Para proteger os seus dados pessoais, consulte os seus pedidos na área autenticada do munícipe.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-start">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary" aria-hidden="true">
            {isCitizen ? <FileSearch className="size-5" /> : <LockKeyhole className="size-5" />}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-foreground">
              {isCitizen ? 'Ver os meus pedidos' : 'Acesso protegido'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isCitizen
                ? 'Acompanhe o estado dos seus pedidos e consulte as informações disponíveis.'
                : 'Inicie sessão com a sua conta de munícipe para consultar os pedidos associados a si. A pesquisa pública por referência ainda não está disponível.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link to={isCitizen ? '/municipe/pedidos' : isAuthenticated ? '/admin' : '/auth'}>
                  {isCitizen ? 'Ver os meus pedidos' : isAuthenticated ? 'Ir para a área interna' : 'Iniciar sessão'}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/servicos">Explorar serviços</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
