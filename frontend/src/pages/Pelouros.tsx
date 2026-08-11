import { Layout } from '@/components/layout/Layout';
import { User, Mail, Phone, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const pelouros = [
  { id: 1, nome: 'Administração e Finanças', responsavel: 'Dr. António Machava', email: 'financas@cmboane.gov.mz', telefone: '+258 21 123 4501', descricao: 'Responsável pela gestão financeira, recursos humanos, património e contabilidade municipal.', competencias: ['Elaboração e execução do orçamento municipal', 'Gestão de recursos humanos', 'Contabilidade e tesouraria', 'Gestão do património municipal'] },
  { id: 2, nome: 'Urbanismo e Ordenamento do Território', responsavel: 'Arq. Maria da Luz', email: 'urbanismo@cmboane.gov.mz', telefone: '+258 21 123 4502', descricao: 'Planificação urbana, licenciamento de construções e ordenamento do território.', competencias: ['Elaboração do Plano Director Municipal', 'Licenciamento de construções', 'Fiscalização de obras', 'Gestão do uso do solo'] },
  { id: 3, nome: 'Infraestruturas e Ambiente', responsavel: 'Eng. João Tembe', email: 'infraestruturas@cmboane.gov.mz', telefone: '+258 21 123 4503', descricao: 'Gestão de infraestruturas públicas, saneamento e protecção ambiental.', competencias: ['Manutenção de estradas e vias públicas', 'Gestão de resíduos sólidos', 'Iluminação pública', 'Espaços verdes e ambiente'] },
  { id: 4, nome: 'Actividades Económicas', responsavel: 'Dra. Fátima Nguenha', email: 'economia@cmboane.gov.mz', telefone: '+258 21 123 4504', descricao: 'Promoção do desenvolvimento económico local e licenciamento de actividades.', competencias: ['Licenciamento comercial e industrial', 'Promoção do empreendedorismo', 'Gestão de mercados municipais', 'Turismo local'] },
  { id: 5, nome: 'Educação, Cultura e Desporto', responsavel: 'Prof. Carlos Matsimbe', email: 'educacao@cmboane.gov.mz', telefone: '+258 21 123 4505', descricao: 'Apoio à educação, promoção cultural e actividades desportivas.', competencias: ['Apoio às escolas primárias', 'Eventos culturais e festivais', 'Infraestruturas desportivas', 'Bibliotecas e centros culturais'] },
];

export default function Pelouros() {
  return (
    <Layout>
      <section className="bg-primary py-10 sm:py-16 lg:py-20">
        <div className="container px-5 text-center">
          <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Pelouros Municipais</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Conheça os diferentes pelouros do Conselho Municipal e as suas competências
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-16 lg:py-24">
        <div className="container px-5">
          <div className="space-y-4 sm:space-y-8">
            {pelouros.map((pelouro, index) => (
              <motion.div
                key={pelouro.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-xl sm:rounded-2xl bg-card shadow-soft overflow-hidden"
              >
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                        <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                          <Building className="h-4 w-4 sm:h-6 sm:w-6" />
                        </div>
                        <h2 className="text-base sm:text-xl font-bold text-foreground lg:text-2xl">{pelouro.nome}</h2>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{pelouro.descricao}</p>
                      
                      <div>
                        <h3 className="font-semibold text-xs sm:text-sm text-foreground mb-2 sm:mb-3">Competências:</h3>
                        <ul className="grid gap-1.5 sm:gap-2 sm:grid-cols-2">
                          {pelouro.competencias.map((comp) => (
                            <li key={comp} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                              {comp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="lg:w-64 flex-shrink-0 rounded-lg sm:rounded-xl bg-muted p-3.5 sm:p-5">
                      <h3 className="font-semibold text-xs sm:text-sm text-foreground mb-2.5 sm:mb-4">Contactos</h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                          <span className="text-[11px] sm:text-sm text-muted-foreground">{pelouro.responsavel}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                          <a href={`mailto:${pelouro.email}`} className="text-[11px] sm:text-sm text-primary hover:underline break-all">{pelouro.email}</a>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                          <a href={`tel:${pelouro.telefone}`} className="text-[11px] sm:text-sm text-muted-foreground hover:text-primary">{pelouro.telefone}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
