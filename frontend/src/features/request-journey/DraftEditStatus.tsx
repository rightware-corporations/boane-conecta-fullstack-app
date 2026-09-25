import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
export function DraftEditStatus({ loading, error, retry }: { loading: boolean; error: string | null; retry: () => void }) {
  if (loading) return <p role="status" aria-busy="true">A consultar o rascunho...</p>;
  if (!error) return null;
  return <div role="alert" className="space-y-3 border-l-4 border-warning bg-surface p-4"><p>{error}</p>
    <Button variant="outline" onClick={retry}>Tentar novamente</Button>
    <Link to="/municipe/pedidos/rascunhos" className="block text-primary underline">Voltar aos rascunhos</Link></div>;
}
