import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import ThreePillars from '@/components/sections/ThreePillars';
import Stats from '@/components/sections/Stats';
import FlagshipProgram from '@/components/sections/FlagshipProgram';
import SuccessStories from '@/components/sections/SuccessStories';
import Insights from '@/components/sections/Insights';
import Clients from '@/components/sections/Clients';
import CTA from '@/components/sections/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <ThreePillars />
      <Stats />
      <FlagshipProgram />
      <SuccessStories />
      <Insights />
      <Clients />
      <CTA />
    </>
  );
}
