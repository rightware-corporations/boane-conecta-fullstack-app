import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { publicService } from '@/services/public.service';

export default function Contactos() {
  const [formData, setFormData] = useState({
    nome: '', email: '', telefone: '', assunto: '', mensagem: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const { error } = await publicService.sendContactMessage(formData);
    
    if (error) {
      toast.error(error || 'Erro ao enviar mensagem. Tente novamente.');
    } else {
      toast.success('Mensagem enviada com sucesso! Entraremos em contacto em breve.');
      setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' });
    }
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactItems = [
    { icon: MapPin, title: 'Morada', content: 'Av. Principal, Edifício Municipal\nBoane, Província de Maputo\nMoçambique' },
    { icon: Phone, title: 'Telefone', content: '+258 21 123 4567\n+258 84 123 4567' },
    { icon: Mail, title: 'Email', content: 'info@cmboane.gov.mz\natendimento@cmboane.gov.mz' },
    { icon: Clock, title: 'Horário', content: 'Segunda a Sexta: 07:30 - 15:30\nSábado e Domingo: Encerrado' },
  ];

  return (
    <Layout>
      <section className="bg-primary py-10 sm:py-16 lg:py-20">
        <div className="container px-5 text-center">
          <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Contactos</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Entre em contacto connosco. Estamos aqui para ajudar.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-16 lg:py-24">
        <div className="container px-5">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
                Informações de Contacto
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {contactItems.map((item) => (
                  <div key={item.title} className="flex gap-3 sm:gap-4">
                    <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <item.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-foreground">{item.title}</h3>
                      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground whitespace-pre-line">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 rounded-lg sm:rounded-xl bg-muted aspect-video flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-xs sm:text-sm">Mapa de Localização</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="rounded-xl sm:rounded-2xl bg-card p-5 sm:p-8 shadow-soft">
                <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">
                  Envie-nos uma Mensagem
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                  Preencha o formulário e responderemos o mais breve possível.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="nome" className="block text-xs sm:text-sm font-medium text-foreground mb-1">Nome *</label>
                      <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Seu nome" />
                    </div>
                    <div>
                      <label htmlFor="telefone" className="block text-xs sm:text-sm font-medium text-foreground mb-1">Telefone</label>
                      <Input id="telefone" name="telefone" type="tel" value={formData.telefone} onChange={handleChange} placeholder="+258 84 XXX XXXX" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-foreground mb-1">Email *</label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="seu.email@exemplo.com" />
                  </div>
                  <div>
                    <label htmlFor="assunto" className="block text-xs sm:text-sm font-medium text-foreground mb-1">Assunto *</label>
                    <Input id="assunto" name="assunto" value={formData.assunto} onChange={handleChange} required placeholder="Assunto da mensagem" />
                  </div>
                  <div>
                    <label htmlFor="mensagem" className="block text-xs sm:text-sm font-medium text-foreground mb-1">Mensagem *</label>
                    <Textarea id="mensagem" name="mensagem" value={formData.mensagem} onChange={handleChange} required placeholder="Escreva a sua mensagem..." rows={4} />
                  </div>
                  <Button type="submit" size="default" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'A enviar...' : (<>Enviar Mensagem <Send className="h-4 w-4" /></>)}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
