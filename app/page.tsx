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
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import ScrollProgress from '@/components/ui/ScrollProgress';
import BackToTop from '@/components/ui/BackToTop';

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
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
      </main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}
