import { Container, Section } from '@/design-system/primitives/layout';
import { ActiveAlerts } from '@/features/public-home/components/ActiveAlerts';
import { EssentialContacts } from '@/features/public-home/components/EssentialContacts';
import { FeaturedServices } from '@/features/public-home/components/FeaturedServices';
import { HomeHero } from '@/features/public-home/components/HomeHero';
import { LocalUpdates } from '@/features/public-home/components/LocalUpdates';
import { MobilityOverview } from '@/features/public-home/components/MobilityOverview';
import { OpportunitiesOverview } from '@/features/public-home/components/OpportunitiesOverview';
import { ProjectsOverview } from '@/features/public-home/components/ProjectsOverview';
import { QuickTasks } from '@/features/public-home/components/QuickTasks';
import { TransparencyLinks } from '@/features/public-home/components/TransparencyLinks';

export function PublicHome() {
  return (
    <>
      <HomeHero />
      <QuickTasks />
      <ActiveAlerts />
      <FeaturedServices />
      <Section aria-label="Informação local e oportunidades">
        <Container className="grid gap-6 lg:grid-cols-2">
          <MobilityOverview />
          <OpportunitiesOverview />
        </Container>
      </Section>
      <LocalUpdates />
      <ProjectsOverview />
      <TransparencyLinks />
      <EssentialContacts />
    </>
  );
}
