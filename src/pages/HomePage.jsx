import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Statistics from '../components/Statistics';
import Partners from '../components/Partners';
import MenuCards from '../components/MenuCards';
import SystemSetup from '../components/SystemSetup';
import Interior from '../components/Interior';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import FloatingActionMenu from '../components/FloatingActionMenu';
import FranchiseSimulator from '../components/FranchiseSimulator';
import AIInvestmentCalculator from '../components/AIInvestmentCalculator';
import UserJourneyTracker from '../components/UserJourneyTracker';
import AIChatbot from '../components/AIChatbot';
import InvestmentMap from '../components/InvestmentMap';
import FranchiseOwnerChat from '../components/FranchiseOwnerChat';
import { trackPageView } from '../services/analytics';

const HomePage = () => {
  const [openComponent, setOpenComponent] = useState(null);

  // Track page view on mount
  useEffect(() => {
    trackPageView('/');
  }, []);

  return (
    <div className="min-h-screen bg-light-1">
      <SEO 
        title="منصة الامتياز التجاري الأولى في السعودية والخليج"
        description="اكتشف أفضل فرص الاستثمار في الامتيازات التجارية. نربطك بأفضل العلامات التجارية العالمية والمحلية. استشارات متكاملة لتأسيس وتطوير الفرنشايز في السعودية والخليج."
        keywords="امتياز تجاري, فرنشايز, استثمار, فرص استثمارية, نظام الامتياز, شراء فرنشايز, تأسيس فرنشايز, استثمار في السعودية"
        canonical="/"
      />
      <Navigation />
      <main>
        <Hero />
        <Statistics />
        <Partners />
        <section id="menu">
          <MenuCards />
        </section>
        <SystemSetup />
        <section id="about">
          <Interior />
        </section>
        <FAQ />
      </main>
      <Footer />
      
      {/* Unified Floating Action Menu */}
      <FloatingActionMenu 
        page="home"
        onOpenSimulator={() => setOpenComponent('simulator')}
        onOpenAICalculator={() => setOpenComponent('ai-calculator')}
        onOpenJourney={() => setOpenComponent('journey')}
        onOpenChatbot={() => setOpenComponent('chatbot')}
        onOpenMap={() => setOpenComponent('map')}
        onOpenOwnerChat={() => setOpenComponent('owner-chat')}
      />

      {/* Components - controlled by menu */}
      <FranchiseSimulator 
        externalOpen={openComponent === 'simulator'} 
        onClose={() => setOpenComponent(null)} 
      />
      <AIInvestmentCalculator 
        externalOpen={openComponent === 'ai-calculator'} 
        onClose={() => setOpenComponent(null)} 
      />
      <UserJourneyTracker 
        externalOpen={openComponent === 'journey'} 
        onClose={() => setOpenComponent(null)} 
      />
      <AIChatbot 
        externalOpen={openComponent === 'chatbot'} 
        onClose={() => setOpenComponent(null)} 
      />
      <InvestmentMap 
        externalOpen={openComponent === 'map'} 
        onClose={() => setOpenComponent(null)} 
      />
      <FranchiseOwnerChat 
        externalOpen={openComponent === 'owner-chat'} 
        onClose={() => setOpenComponent(null)} 
      />
    </div>
  );
};

export default HomePage;
