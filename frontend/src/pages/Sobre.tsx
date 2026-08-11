import { Layout } from '@/components/layout/Layout';
import { MapPin, Users, Building2, History, Target, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import boaneMap from '@/assets/boane-map-3d.jpg';
import locality1 from '@/assets/locality-1.jpg';
import locality2 from '@/assets/locality-2.jpg';
import locality3 from '@/assets/locality-3.jpg';

const stats = [
  { icon: Users, value: '150,000+', label: 'Habitantes' },
  { icon: MapPin, value: '822 km²', label: 'Área Total' },
  { icon: Building2, value: '4', label: 'Postos Administrativos' },
];

const localities = [
  {
    name: 'Boane Sede',
    description: 'Centro administrativo e comercial do município, com infraestruturas modernas e serviços públicos centralizados.',
    image: locality1,
    population: '60,000+',
  },
  {
    name: 'Matola Rio',
    description: 'Zona ribeirinha com rica biodiversidade, comunidades agrícolas e paisagens naturais deslumbrantes.',
    image: locality2,
    population: '45,000+',
  },
  {
    name: 'Campoane',
    description: 'Região com forte actividade comercial, mercados tradicionais e crescimento urbano acelerado.',
    image: locality3,
    population: '35,000+',
  },
];

export default function Sobre() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-12 sm:py-20 lg:py-28">
        <div className="container text-center px-5">
          <h1 className="text-2xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
            Sobre o Município de Boane
          </h1>
          <p className="mt-3 text-sm text-primary-foreground/80 max-w-2xl mx-auto sm:mt-4 sm:text-lg">
            Conheça a história, visão e missão do Conselho Municipal de Boane
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="container px-5">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <History className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider">
                  Nossa História
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                Uma História de Desenvolvimento
              </h2>
              <p className="mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
                O Município de Boane está localizado na Província de Maputo, Moçambique, sendo um dos distritos mais importantes da região sul do país. Com uma rica herança cultural e natural, Boane tem-se destacado pelo seu crescimento sustentável e desenvolvimento comunitário.
              </p>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Fundado oficialmente como município em 1998, o Conselho Municipal de Boane tem trabalhado incansavelmente para melhorar a qualidade de vida dos seus cidadãos, investindo em infraestruturas, educação, saúde e desenvolvimento económico local.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-xl sm:rounded-2xl bg-muted overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=600&fit=crop"
                  alt="Vista de Boane"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 rounded-lg sm:rounded-xl bg-accent p-4 sm:p-6 shadow-elevated">
                <div className="text-2xl sm:text-3xl font-bold text-accent-foreground">25+</div>
                <div className="text-xs sm:text-sm text-accent-foreground/80">Anos de História</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Map Section */}
      <section className="py-10 sm:py-16 lg:py-24 bg-gradient-to-br from-secondary/5 via-muted to-primary/5">
        <div className="container px-5">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Área de Cobertura
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Descubra a extensão territorial do Município de Boane e as suas principais localidades
            </p>
          </div>

          <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-elevated bg-card mb-8 sm:mb-12">
            <img 
              src={boaneMap} 
              alt="Mapa 3D da área de cobertura do Município de Boane" 
              className="w-full h-auto max-h-[300px] sm:max-h-[500px] object-contain mx-auto"
            />
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {localities.map((loc) => (
              <div key={loc.name} className="rounded-xl sm:rounded-2xl bg-card overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 group">
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={loc.image} 
                    alt={loc.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">{loc.name}</h3>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{loc.description}</p>
                  <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm font-medium text-primary">
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {loc.population} habitantes
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-12 bg-muted">
        <div className="container px-5">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10 mb-2 sm:mb-4">
                  <stat.icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                </div>
                <div className="text-xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="mt-0.5 sm:mt-1 text-xs sm:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="container px-5">
          <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
            <div className="rounded-xl sm:rounded-2xl bg-primary p-5 sm:p-8 text-primary-foreground">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                <h3 className="text-lg sm:text-xl font-bold">Missão</h3>
              </div>
              <p className="text-sm sm:text-base leading-relaxed opacity-90">
                Promover o desenvolvimento integral e sustentável do Município de Boane, através da prestação de serviços públicos de qualidade, da gestão eficiente dos recursos municipais e da participação activa dos cidadãos na governação local.
              </p>
            </div>
            <div className="rounded-xl sm:rounded-2xl bg-secondary p-5 sm:p-8 text-secondary-foreground">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                <h3 className="text-lg sm:text-xl font-bold">Visão</h3>
              </div>
              <p className="text-sm sm:text-base leading-relaxed opacity-90">
                Ser um município modelo em Moçambique, reconhecido pela excelência na gestão pública, pela qualidade de vida dos seus habitantes e pelo desenvolvimento económico, social e ambiental sustentável.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 sm:py-16 lg:py-24 bg-muted">
        <div className="container px-5">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Nossos Valores
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Os princípios que guiam a nossa actuação diária
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {['Transparência', 'Responsabilidade', 'Eficiência', 'Inclusão'].map((value) => (
              <div key={value} className="rounded-lg sm:rounded-xl bg-card p-4 sm:p-6 text-center shadow-soft">
                <h3 className="font-semibold text-sm sm:text-lg text-foreground">{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
