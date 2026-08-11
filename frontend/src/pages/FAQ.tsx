import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const faqCategories = [
  { id: 'geral', name: 'Geral' },
  { id: 'servicos', name: 'Serviços' },
  { id: 'tributos', name: 'Tributos' },
  { id: 'licenciamento', name: 'Licenciamento' },
];

const faqs = [
  { id: 1, category: 'geral', question: 'Qual é o horário de atendimento do Conselho Municipal?', answer: 'O Conselho Municipal de Boane funciona de Segunda a Sexta-feira, das 07h30 às 15h30. Aos fins de semana e feriados estamos encerrados.' },
  { id: 2, category: 'geral', question: 'Como posso contactar o Conselho Municipal?', answer: 'Pode contactar-nos através do telefone +258 21 123 4567, email info@cmboane.gov.mz, ou presencialmente na nossa sede localizada na Av. Principal, Edifício Municipal.' },
  { id: 3, category: 'servicos', question: 'Como solicitar uma certidão de residência?', answer: 'Para solicitar uma certidão de residência deve dirigir-se ao balcão de atendimento com o seu Bilhete de Identidade e um comprovativo de morada. O prazo de emissão é de 1 a 3 dias úteis e o custo é de 100 MZN.' },
  { id: 4, category: 'servicos', question: 'Quanto tempo demora a obter uma licença de construção?', answer: 'O prazo para emissão de licença de construção varia entre 15 a 30 dias úteis, dependendo da complexidade do projecto e da documentação apresentada.' },
  { id: 5, category: 'tributos', question: 'Como posso pagar os meus impostos municipais?', answer: 'Os impostos municipais podem ser pagos presencialmente na tesouraria do Conselho Municipal, através de transferência bancária, ou em breve através do novo portal online.' },
  { id: 6, category: 'tributos', question: 'Qual é o prazo para pagamento do IPRA?', answer: 'O Imposto Predial Autárquico (IPRA) deve ser pago até ao dia 30 de Junho de cada ano. Após esta data, são aplicadas multas e juros de mora.' },
  { id: 7, category: 'licenciamento', question: 'Que documentos são necessários para obter um alvará comercial?', answer: 'Para obter um alvará comercial são necessários: Bilhete de Identidade, comprovativo de residência, planta do estabelecimento, e declaração de início de actividade. O prazo de emissão é de 5 a 10 dias úteis.' },
  { id: 8, category: 'licenciamento', question: 'É possível renovar o alvará comercial online?', answer: 'Actualmente, a renovação do alvará comercial deve ser feita presencialmente. Estamos a trabalhar para disponibilizar este serviço online brevemente.' },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('geral');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && (searchQuery === '' || matchesSearch);
  });

  return (
    <Layout>
      <section className="bg-primary py-10 sm:py-16 lg:py-20">
        <div className="container px-5 text-center">
          <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Perguntas Frequentes</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Encontre respostas para as questões mais comuns sobre os serviços municipais
          </p>
          <div className="mt-4 sm:mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Pesquisar perguntas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-0 bg-background py-2.5 sm:py-4 pl-9 sm:pl-12 pr-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground shadow-elevated focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container px-5 max-w-4xl">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8 justify-center">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="space-y-3 sm:space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-lg sm:rounded-xl bg-card shadow-soft overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-2.5 sm:gap-4">
                    <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base font-semibold text-foreground">{faq.question}</span>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-3", openFaq === faq.id && "rotate-180")} />
                </button>
                {openFaq === faq.id && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                    <div className="pl-6.5 sm:pl-9 text-xs sm:text-sm text-muted-foreground leading-relaxed">{faq.answer}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-sm text-muted-foreground">Nenhuma pergunta encontrada.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
