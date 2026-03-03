
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionId, AppSettings } from '../types';
import { Users, Zap, Globe2 } from 'lucide-react';
import { getAppSettings } from '../services/authService';

const features = [
  {
    icon: <Users className="w-6 h-6 text-brand-blue" />,
    title: "Onze Familie",
    description: "Een diverse gemeenschap waar iedereen welkom is."
  },
  {
    icon: <Zap className="w-6 h-6 text-brand-red" />,
    title: "Kracht van God",
    description: "Wij geloven in wonderen, genezing en verandering."
  },
  {
    icon: <Globe2 className="w-6 h-6 text-slate-700" />,
    title: "Wereldwijde Visie",
    description: "Verbonden met 3000+ kerken wereldwijd (CFM)."
  }
];

const About: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());

  useEffect(() => {
    const update = () => setSettings(getAppSettings());
    window.addEventListener('settings-updated', update);
    return () => window.removeEventListener('settings-updated', update);
  }, []);

  return (
    <section id={SectionId.ABOUT} className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* Text Content */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-red font-bold tracking-widest uppercase text-sm mb-2 block">Wie wij zijn</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8">
              {settings.about.title} <br />
              <span className="text-brand-blue">{settings.about.subtitle}</span>
            </h2>
            
            <p className="text-slate-600 leading-relaxed mb-6 text-lg whitespace-pre-wrap">
              {settings.about.content}
            </p>
            
            <button className="px-6 py-3 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors rounded-lg font-bold">
              Lees onze geschiedenis
            </button>
          </motion.div>

          {/* Cards */}
          <div className="lg:w-1/2 grid gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
              >
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
