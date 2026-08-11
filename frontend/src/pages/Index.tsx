import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { NewsSection } from '@/components/home/NewsSection';
import { HighlightsSection } from '@/components/home/HighlightsSection';
import { QuickAccessSection } from '@/components/home/QuickAccessSection';
import { QuickAccessCards } from '@/components/home/QuickAccessCards';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <QuickAccessCards />
      <ServicesSection />
      <NewsSection />
      <HighlightsSection />
      <QuickAccessSection />
    </Layout>
  );
};

export default Index;
