import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { publicService } from '@/services/public.service';

export default function Reclamacoes() {
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', categoria: '', local: '', descricao: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const { data, error } = await publicService.sendComplaint({
      name: formData.nome,
      email: formData.email,
      phone: formData.telefone,
      category: formData.categoria,
      location: formData.local,
      description: formData.descricao,
    });
    
    if (error) {
      toast.error(error || 'Erro ao submeter reclamação. Tente novamente.');
    } else {
      setReference(data?.reference || null);
      toast.success('Reclamação submetida com sucesso!');
      setFormData({ nome: '', email: '', telefone: '', categoria: '', local: '', descricao: '' });
    }
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Layout>
      <section className="bg-primary py-10 sm:py-16 lg:py-20">
        <div className="container px-5 text-center">
          <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Reclamações e Sugestões</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            A sua opinião é importante para melhorarmos os nossos serviços
          </p>
          </div>

          {/* Success message with reference */}
          {reference && (
            <div className="mb-6 sm:mb-8 rounded-lg sm:rounded-xl bg-green-50 p-4 sm:p-6 border border-green-200">
              <div className="flex gap-3 sm:gap-4">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-green-800">Reclamação Submetida</h3>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-green-700">
                    Referência: <strong>{reference}</strong>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Guarde esta referência para acompanhar o estado da sua reclamação.
                  </p>
                </div>
              </div>
            </div>
          )}
      </section>

      <section className="py-8 sm:py-16 lg:py-24">
        <div className="container px-5 max-w-3xl">
          <div className="mb-6 sm:mb-8 rounded-lg sm:rounded-xl bg-info/10 p-4 sm:p-6 border-l-4 border-info">
            <div className="flex gap-3 sm:gap-4">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-info flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground">Importante</h3>
                <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                  Após submeter a sua reclamação, receberá um número de processo por email.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-card p-5 sm:p-8 shadow-soft">
            <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Formulário de Reclamação</h2>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="nome" className="block text-xs sm:text-sm font-medium text-foreground mb-1">Nome *</label>
                  <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Seu nome" />
                </div>
                <div>
                  <label htmlFor="telefone" className="block text-xs sm:text-sm font-medium text-foreground mb-1">Telefone *</label>
                  <Input id="telefone" name="telefone" type="tel" value={formData.telefone} onChange={handleChange} required placeholder="+258 84 XXX XXXX" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-foreground mb-1">Email *</label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="seu.email@exemplo.com" />
              </div>

              <div>
                <label htmlFor="categoria" className="block text-xs sm:text-sm font-medium text-foreground mb-1">Categoria *</label>
                <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Seleccione uma categoria</option>
                  <option value="saneamento">Saneamento e Limpeza</option>
                  <option value="estradas">Estradas e Vias</option>
                  <option value="iluminacao">Iluminação Pública</option>
                  <option value="agua">Água e Esgotos</option>
                  <option value="atendimento">Atendimento ao Público</option>
                  <option value="licenciamento">Licenciamento</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="local" className="block text-xs sm:text-sm font-medium text-foreground mb-1">Localização *</label>
                <Input id="local" name="local" value={formData.local} onChange={handleChange} required placeholder="Ex: Bairro Central, Rua 25 de Setembro" />
              </div>

              <div>
                <label htmlFor="descricao" className="block text-xs sm:text-sm font-medium text-foreground mb-1">Descrição *</label>
                <Textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} required placeholder="Descreva a situação..." rows={4} />
              </div>

              <Button type="submit" size="default" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'A submeter...' : (<>Submeter Reclamação <Send className="h-4 w-4" /></>)}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
