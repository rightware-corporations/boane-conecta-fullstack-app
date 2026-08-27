import { Container } from '@/design-system/primitives/layout';
import { HomeSearch } from '@/features/public-home/components/HomeSearch';

export function HomeHero() {
  return (
    <section id="pesquisa" aria-labelledby="home-title" className="scroll-mt-24 bg-surface-inverse text-background">
      <Container className="py-14 tb:py-16 lg:py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-primary-subtle">Boane Conecta</p>
        <h1 id="home-title" className="max-w-4xl text-[2.35rem] font-bold leading-[1.08] tracking-tight text-background tb:text-5xl lg:text-[3.5rem]">
          Serviços municipais mais simples e próximos de si.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-background/75 tb:text-lg">
          Encontre serviços, acompanhe pedidos e aceda à informação pública a partir de um único lugar.
        </p>
        <div className="mt-8 lg:mt-10">
          <HomeSearch />
        </div>
      </Container>
    </section>
  );
}
