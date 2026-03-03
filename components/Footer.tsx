
import React, { useState, useEffect } from 'react';
import { getAppSettings } from '../services/authService';
import { AppSettings } from '../types';

interface FooterProps {
  onNavigate: (page: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());

  useEffect(() => {
    const update = () => setSettings(getAppSettings());
    window.addEventListener('settings-updated', update);
    return () => window.removeEventListener('settings-updated', update);
  }, []);

  return (
    <footer className="bg-slate-900 py-12 text-white relative overflow-hidden">
      <div className="container mx-auto px-6 text-center text-slate-400 text-sm relative z-10">
        <div className="mb-4">
            <h4 className="text-xl font-serif font-bold text-white tracking-widest uppercase">{settings.branding.churchName}</h4>
        </div>
        <div className="flex justify-center gap-6 mb-8 text-xs font-bold uppercase tracking-wider">
            <button onClick={() => onNavigate('privacy')} className="hover:text-brand-blue transition-colors">Privacy</button>
            <button onClick={() => onNavigate('cookies')} className="hover:text-brand-blue transition-colors">Cookies</button>
        </div>
        <p>&copy; {new Date().getFullYear()} {settings.footer.copyrightText}</p>
        <p className="mt-2 text-slate-600">{settings.footer.subText}</p>
      </div>
    </footer>
  );
};

export default Footer;
