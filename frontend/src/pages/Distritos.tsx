import { Layout } from '@/components/layout/Layout';
import { MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const distritos = [
  { id: 1, nome: 'Posto Administrativo de Boane Sede', populacao: '55,000', area: '180 km²', bairros: ['Bairro Central', 'Bairro 7 de Abril', 'Bairro Mahulane', 'Bairro Gueguere'], descricao: 'Centro administrativo do município, com maior concentração de serviços públicos e actividade comercial.', imagem: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=600&h=400&fit=crop' },
  { id: 2, nome: 'Posto Administrativo de Matola Rio', populacao: '42,000', area: '210 km²', bairros: ['Matola Rio', 'Machubo', 'Beluluane'], descricao: 'Zona industrial e agrícola, com importante zona económica especial de Beluluane.', imagem: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&h=400&fit=crop' },
  { id: 3, nome: 'Posto Administrativo de Campoane', populacao: '28,000', area: '220 km²', bairros: ['Campoane', 'Ndlavela', 'Pessene'], descricao: 'Zona predominantemente agrícola, com destaque para produção de hortícolas.', imagem: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop' },
  { id: 4, nome: 'Posto Administrativo de Mulotana', populacao: '25,000', area: '212 km²', bairros: ['Mulotana', 'Nyeleti', 'Mahubo'], descricao: 'Rica em recursos naturais, com potencial turístico e actividade agrícola.', imagem: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=400&fit=crop' },
];

export default function Distritos() {
  return (
    <Layout>
      <section className="bg-primary py-10 sm:py-16 lg:py-20">
        <div className="container px-5 text-center">
          <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Postos Administrativos</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Conheça os diferentes postos administrativos que compõem o Município de Boane
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-12 bg-muted">
        <div className="container px-5">
          <div className="grid grid-cols-4 gap-3 sm:gap-6">
            {[
              { value: '4', label: 'Postos' },
              { value: '822 km²', label: 'Área Total' },
              { value: '150,000+', label: 'Habitantes' },
              { value: '15+', label: 'Bairros' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-lg sm:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-[11px] sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-16 lg:py-24">
        <div className="container px-5">
          <div className="space-y-8 sm:space-y-12">
            {distritos.map((distrito, index) => (
              <motion.div
                key={distrito.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5 }}
                className={cn("flex flex-col lg:flex-row gap-5 sm:gap-8 items-center", index % 2 === 1 && 'lg:flex-row-reverse')}
              >
                <div className="lg:w-1/2 w-full">
                  <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-elevated">
                    <img src={distrito.imagem} alt={distrito.nome} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="lg:w-1/2 space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-2xl font-bold text-foreground lg:text-3xl">{distrito.nome}</h2>
                  <p className="text-xs sm:text-base text-muted-foreground">{distrito.descricao}</p>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <span className="text-xs sm:text-sm text-muted-foreground">{distrito.populacao} habitantes</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <span className="text-xs sm:text-sm text-muted-foreground">{distrito.area}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-foreground mb-1.5 sm:mb-2">Principais Bairros:</h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {distrito.bairros.map((bairro) => (
                        <span key={bairro} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] sm:text-sm">{bairro}</span>
                      ))}
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
