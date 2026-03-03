
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventCarousel from './components/EventCarousel';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AiChatWidget from './components/AiChatWidget';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FormsPage from './components/FormsPage';
import { BeliefsPage, PastorPage, CalendarPage, MediaPage, ChurchesSurinamePage, ChurchesInternationalPage, PrivacyPage, CookiesPage } from './components/SubPages';
import { PageId, User, AppSettings } from './types';
import { getCurrentUser, getAppSettings } from './services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-[100]"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-xl">
              <Cookie className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-1">Cookies & Privacy</h3>
              <p className="text-sm text-slate-500 mb-4">Wij gebruiken cookies om uw ervaring te verbeteren en onze website te analyseren.</p>
              <div className="flex gap-3">
                <button onClick={accept} className="flex-1 py-2 bg-brand-blue text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Accepteren</button>
                <button onClick={() => setIsVisible(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">Sluiten</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());

  useEffect(() => {
    setUser(getCurrentUser());
    
    // Apply branding colors
    const applyBranding = () => {
      const currentSettings = getAppSettings();
      setSettings(currentSettings);
      document.documentElement.style.setProperty('--brand-blue', currentSettings.branding.primaryColor);
      document.documentElement.style.setProperty('--brand-red', currentSettings.branding.secondaryColor);
    };

    applyBranding();
    window.addEventListener('settings-updated', applyBranding);
    return () => window.removeEventListener('settings-updated', applyBranding);
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero />
            <EventCarousel />
            <About />
            <Services />
            <Contact />
          </>
        );
      case 'about':
        return (
            <div className="pt-20">
                <About />
                <Contact />
            </div>
        );
      case 'beliefs':
        return <BeliefsPage />;
      case 'pastor':
        return <PastorPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'media':
        return <MediaPage />;
      case 'churches-suriname':
        return <ChurchesSurinamePage />;
      case 'churches-intl':
        return <ChurchesInternationalPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'cookies':
        return <CookiesPage />;
      case 'forms':
        return <FormsPage />;
      case 'contact':
        return (
            <div className="pt-20">
                <Contact />
            </div>
        );
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case 'dashboard':
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} />;
        return <Dashboard user={user} onLogout={handleLogout} />;
      default:
        return (
          <>
            <Hero />
            <EventCarousel />
            <About />
            <Services />
            <Contact />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-blue selection:text-white flex flex-col">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} user={user} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer onNavigate={setCurrentPage} />
      <AiChatWidget />
      <CookieConsent />
    </div>
  );
};

export default App;
