import { Layout } from '@/components/layout/Layout';
import { Target, TrendingUp, CheckCircle, ArrowRight, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const eixos = [
  { titulo: 'Governação e Administração', objectivos: ['Modernização dos serviços públicos', 'Aumento da transparência e participação cidadã', 'Capacitação de recursos humanos'], metas: ['95% de processos digitalizados até 2028', '100% de atendimento em tempo útil'] },
  { titulo: 'Infraestruturas e Urbanismo', objectivos: ['Reabilitação da rede viária municipal', 'Expansão do saneamento básico', 'Planeamento urbano sustentável'], metas: ['80 km de estradas reabilitadas', '60% de cobertura de saneamento'] },
  { titulo: 'Desenvolvimento Económico', objectivos: ['Promoção do empreendedorismo local', 'Atracção de investimento', 'Apoio à agricultura familiar'], metas: ['500 novos negócios licenciados', '2000 empregos criados'] },
  { titulo: 'Desenvolvimento Social', objectivos: ['Melhoria da qualidade da educação', 'Acesso à saúde de qualidade', 'Promoção da cultura e desporto'], metas: ['5 novas escolas construídas', '3 centros de saúde reabilitados'] },
  { titulo: 'Ambiente e Sustentabilidade', objectivos: ['Gestão sustentável de resíduos', 'Protecção de recursos naturais', 'Adaptação às mudanças climáticas'], metas: ['80% de recolha de resíduos', '10,000 árvores plantadas'] },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function PlanoDesenvolvimento() {
  return (
    <Layout>
      <section className="bg-primary py-10 sm:py-16 lg:py-28">
        <div className="container px-5 text-center">
          <span className="inline-block rounded-full bg-accent px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold text-accent-foreground mb-3 sm:mb-4">2025-2030</span>
          <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Plano de Desenvolvimento Municipal</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Estratégia integrada para o desenvolvimento sustentável do Município de Boane
          </p>
          <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center">
            <Button variant="hero" size="default">
              <Download className="h-4 w-4" />
              Descarregar PDF
            </Button>
            <Button variant="heroOutline" size="default" asChild>
              <Link to="/projetos">Ver Projectos</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 lg:py-24">
        <div className="container px-5">
          <div className="max-w-3xl mx-auto text-center">
            <Target className="h-8 w-8 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-3xl font-bold text-foreground lg:text-4xl">Nossa Visão para 2030</h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-muted-foreground leading-relaxed">
              Transformar Boane num município modelo, reconhecido pela qualidade de vida dos seus habitantes, pela gestão eficiente dos recursos públicos e pelo desenvolvimento económico sustentável.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 lg:py-24 bg-muted">
        <div className="container px-5">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-bold text-foreground lg:text-4xl">Eixos Estratégicos</h2>
            <p className="mt-2 sm:mt-4 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
              Cinco áreas prioritárias que orientam as nossas acções de desenvolvimento
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {eixos.map((eixo, index) => (
              <motion.div key={eixo.titulo} variants={fadeUp} className="rounded-xl sm:rounded-2xl bg-card p-4 sm:p-6 shadow-soft">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">{index + 1}</div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">{eixo.titulo}</h3>
                </div>
                <div className="mb-3 sm:mb-4">
                  <h4 className="text-[11px] sm:text-sm font-semibold text-muted-foreground mb-1.5 sm:mb-2">Objectivos:</h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {eixo.objectivos.map((obj) => (
                      <li key={obj} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success mt-0.5 flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-border">
                  <h4 className="text-[11px] sm:text-sm font-semibold text-muted-foreground mb-1.5 sm:mb-2">Metas:</h4>
                  <ul className="space-y-1">
                    {eixo.metas.map((meta) => (
                      <li key={meta} className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm">
                        <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
                        <span className="text-foreground font-medium">{meta}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-10 sm:py-16 lg:py-24">
        <div className="container px-5 max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-bold text-foreground lg:text-4xl">Cronograma</h2>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {[
              { ano: '2025', fase: 'Fase de Arranque', descricao: 'Diagnóstico, planeamento detalhado e início dos projectos prioritários' },
              { ano: '2026-2027', fase: 'Implementação', descricao: 'Execução dos principais projectos de infraestruturas e serviços' },
              { ano: '2028-2029', fase: 'Consolidação', descricao: 'Expansão das iniciativas bem-sucedidas e ajustes estratégicos' },
              { ano: '2030', fase: 'Avaliação', descricao: 'Avaliação de resultados e planeamento do próximo ciclo' },
            ].map((item, index) => (
              <motion.div
                key={item.ano}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex gap-3 sm:gap-6"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  {index < 3 && <div className="w-0.5 h-full bg-border mt-2" />}
                </div>
                <div className="flex-1 pb-6 sm:pb-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <span className="text-sm sm:text-lg font-bold text-primary">{item.ano}</span>
                    <span className="text-sm sm:text-lg font-semibold text-foreground">— {item.fase}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.descricao}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
