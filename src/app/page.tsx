import { HeroSection } from '@/components/home/HeroSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { MapSection } from '@/components/home/MapSection';
import { EducationSection } from '@/components/home/EducationSection';
import { CtaSection } from '@/components/home/CtaSection';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Seção Principal */}
      <HeroSection />

      {/* Próximas seções entram aqui */}
      <HowItWorksSection />
      <MapSection />
      <EducationSection />
      <CtaSection />
    </main>
  );
}
