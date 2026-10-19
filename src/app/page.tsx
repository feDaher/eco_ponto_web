import { HeroSection } from '@/components/home/HeroSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { MapSection } from '@/components/home/MapSection';
import { EducationSection } from '@/components/home/EducationSection';
import { CtaSection } from '@/components/home/CtaSection';

export default function Home() {
  return (
    <div className="flex flex-col bg-white">
      <HeroSection />
      <HowItWorksSection />
      <MapSection />
      <EducationSection />
      <CtaSection />
    </div>
  );
}
