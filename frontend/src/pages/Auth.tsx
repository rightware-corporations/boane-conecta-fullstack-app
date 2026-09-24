import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { destinationAfterLogin } from '@/lib/auth-navigation';
import { toast } from 'sonner';
import { Mail, Lock, User, LogIn } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error, role } = await login({ email, password });
        if (error) {
          toast.error(error);
        } else {
          toast.success('Login efectuado com sucesso!');
          const from = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
          const requested = from?.pathname ? `${from.pathname}${from.search || ''}${from.hash || ''}` : null;
          navigate(destinationAfterLogin(role || null, requested), { replace: true, state: null });
        }
      } else {
        const { error } = await register({ email, password, full_name: fullName });
        if (error) {
          toast.error(error);
        } else {
          toast.success('Conta criada com sucesso! Pode iniciar sessão.');
          setIsLogin(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-primary py-8 sm:py-12 lg:py-20">
        <div className="container text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground lg:text-5xl">
            Acesso ao Portal
          </h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-primary-foreground/80">
            Aceda à sua área pessoal ou administrativa
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-12 lg:py-24">
        <div className="container max-w-md px-4">
          <div className="rounded-2xl bg-card p-5 sm:p-8 shadow-soft">
            <div className="text-center mb-4 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {isLogin ? 'Iniciar Sessão' : 'Criar Conta'}
              </h2>
              <p className="mt-1 sm:mt-2 text-sm text-muted-foreground">
                {isLogin ? 'Entre com as suas credenciais' : 'Registe-se para aceder ao portal'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="pl-9 sm:pl-10 h-9 sm:h-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.mz"
                    className="pl-9 sm:pl-10 h-9 sm:h-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                  Palavra-passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 sm:pl-10 h-9 sm:h-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-9 sm:h-10" disabled={loading}>
                {loading ? 'A processar...' : (
                  <>
                    {isLogin ? 'Entrar' : 'Criar Conta'}
                    <LogIn className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? 'Não tem conta? Registe-se' : 'Já tem conta? Inicie sessão'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
