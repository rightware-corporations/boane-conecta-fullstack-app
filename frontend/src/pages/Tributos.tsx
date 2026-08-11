import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { FileText, Download, Calculator, CreditCard, Building, Car, Store, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const taxCategories = [
  { id: 'ipra', name: 'IPRA - Imposto Predial Autárquico', icon: Building, description: 'Imposto sobre propriedades urbanas e rurais no município', rates: [{ description: 'Prédios urbanos para habitação', rate: '0,4% do valor patrimonial' }, { description: 'Prédios urbanos para comércio/indústria', rate: '0,7% do valor patrimonial' }, { description: 'Terrenos para construção', rate: '0,5% do valor patrimonial' }], deadline: 'Até 30 de Junho de cada ano', documents: ['Título de propriedade', 'BI/NUIT do proprietário', 'Planta do imóvel'] },
  { id: 'iva', name: 'Imposto sobre Veículos', icon: Car, description: 'Taxa municipal sobre veículos automóveis', rates: [{ description: 'Motociclos até 50cc', rate: '150 MT/ano' }, { description: 'Motociclos acima de 50cc', rate: '300 MT/ano' }, { description: 'Veículos ligeiros', rate: '500 MT/ano' }, { description: 'Veículos pesados', rate: '1.000 MT/ano' }], deadline: 'Até 31 de Março de cada ano', documents: ['Livrete do veículo', 'BI/NUIT do proprietário', 'Comprovativo de residência'] },
  { id: 'taa', name: 'Taxa de Actividade Económica', icon: Store, description: 'Licenciamento de actividades comerciais e industriais', rates: [{ description: 'Micro empresas', rate: '500 - 1.500 MT/ano' }, { description: 'Pequenas empresas', rate: '1.500 - 5.000 MT/ano' }, { description: 'Médias empresas', rate: '5.000 - 15.000 MT/ano' }, { description: 'Grandes empresas', rate: '15.000 - 50.000 MT/ano' }], deadline: 'Até 31 de Janeiro de cada ano', documents: ['Alvará comercial', 'NUIT da empresa', 'Contrato de arrendamento'] },
  { id: 'tlc', name: 'Taxa de Licença de Construção', icon: Home, description: 'Licenciamento para obras de construção civil', rates: [{ description: 'Construção nova (por m²)', rate: '50 MT/m²' }, { description: 'Ampliação (por m²)', rate: '30 MT/m²' }, { description: 'Vedação de terreno', rate: '2.000 MT' }, { description: 'Demolição', rate: '1.500 MT' }], deadline: 'Antes do início da obra', documents: ['Projecto de arquitectura', 'DUAT', 'BI/NUIT do requerente', 'Termo de responsabilidade'] },
];

const paymentMethods = [
  { name: 'Balcão Municipal', description: 'Pagamento presencial na Tesouraria', icon: Building },
  { name: 'M-Pesa / E-Mola', description: 'Pagamento via carteira móvel', icon: CreditCard },
  { name: 'Transferência Bancária', description: 'NIB: 0001 0000 1234 5678 901', icon: FileText },
];

export default function Tributos() {
  return (
    <Layout>
      <section className="bg-primary py-10 sm:py-16 lg:py-20">
        <div className="container px-5 text-center max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Tributos Municipais</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-primary-foreground/80">
            Consulte as taxas, impostos e procedimentos de pagamento
          </p>
        </div>
      </section>

      <section className="py-4 sm:py-8 bg-accent/10 border-b border-border">
        <div className="container px-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground">Simulador de Tributos</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Calcule o valor dos seus impostos</p>
              </div>
            </div>
            <Button size="default">
              <Calculator className="h-4 w-4" />
              Abrir Simulador
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container px-5">
          <div className="space-y-6 sm:space-y-8">
            {taxCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-xl sm:rounded-2xl bg-card shadow-soft overflow-hidden"
              >
                <div className="bg-primary/5 p-4 sm:p-6 border-b border-border">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-primary/10">
                      <category.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm sm:text-xl font-bold text-foreground">{category.name}</h2>
                      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2 sm:mb-3">Tabela de Taxas</h3>
                      <div className="rounded-lg border border-border overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-sm font-medium text-muted-foreground">Descrição</th>
                              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-[11px] sm:text-sm font-medium text-muted-foreground">Valor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {category.rates.map((rate, i) => (
                              <tr key={i} className="hover:bg-muted/30 transition-colors">
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground">{rate.description}</td>
                                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right font-medium text-primary">{rate.rate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="p-3 sm:p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <h4 className="font-medium text-foreground text-xs sm:text-sm">Prazo de Pagamento</h4>
                        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-accent font-semibold">{category.deadline}</p>
                      </div>
                      <div className="p-3 sm:p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium text-foreground text-xs sm:text-sm mb-1.5 sm:mb-2">Documentos</h4>
                        <ul className="space-y-1">
                          {category.documents.map((doc, i) => (
                            <li key={i} className="text-[11px] sm:text-sm text-muted-foreground flex items-start gap-1.5 sm:gap-2">
                              <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 mt-0.5 text-primary flex-shrink-0" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button variant="outline" className="w-full" size="sm">
                        <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Baixar Formulário
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16 bg-muted/30">
        <div className="container px-5">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground lg:text-3xl">Formas de Pagamento</h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Escolha a forma mais conveniente</p>
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
            {paymentMethods.map((method) => (
              <div key={method.name} className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card shadow-soft text-center">
                <div className="mx-auto w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                  <method.icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{method.name}</h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container px-5">
          <div className="rounded-xl sm:rounded-2xl bg-secondary/10 border border-secondary/20 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6">
              <div className="flex-1">
                <h3 className="text-base sm:text-xl font-bold text-foreground">Informação Importante</h3>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  O não pagamento dos tributos dentro dos prazos está sujeito a multas e juros de mora.
                </p>
                <p className="mt-2 sm:mt-3 text-[11px] sm:text-sm text-muted-foreground">
                  <strong>Horário:</strong> Segunda a Sexta, 07:30 – 15:30
                </p>
              </div>
              <Button size="default" asChild>
                <Link to="/contactos">Contactar Finanças</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
