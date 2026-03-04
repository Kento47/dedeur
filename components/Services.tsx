
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionId, ServiceTime, AppSettings } from '../types';
import { Clock, Mic2, Baby } from 'lucide-react';
import { getAppSettingsSync } from '../services/authService';

const Services: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettingsSync());

  useEffect(() => {
    const update = () => setSettings(getAppSettingsSync());
    window.addEventListener('settings-updated', update);
    return () => window.removeEventListener('settings-updated', update);
  }, []);

  const serviceList = settings.serviceTimes || [];

  return (
    <section id={SectionId.SERVICES} className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6"
          >
            Diensttijden
          </motion.h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            De deuren staan altijd open. Kom zoals u bent.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
          {serviceList.map((service, index) => (
            <motion.div
              key={service.id || index}
              className="group relative bg-white rounded-3xl p-8 border border-slate-200 hover:border-brand-blue transition-all duration-300 shadow-sm hover:shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-8">
                <span className="text-2xl font-bold text-slate-800">{service.day}</span>
                <div className="p-3 bg-blue-50 rounded-full text-brand-blue">
                    <Clock className="w-6 h-6" />
                </div>
              </div>

              <div>
                <p className="text-5xl font-serif font-bold text-slate-900 mb-4">{service.time}</p>
                <p className="text-slate-500 font-medium text-lg pt-4 border-t border-slate-100">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="p-8 rounded-3xl flex items-center gap-6 border border-slate-100 bg-slate-50"
          >
            <div className="p-4 bg-white shadow-sm rounded-2xl text-brand-red">
               <Mic2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-1">Live Muziek</h4>
              <p className="text-slate-500">Eigentijdse worship en aanbidding</p>
            </div>
          </motion.div>
          
          <motion.div 
             initial={{ x: 50, opacity: 0 }}
             whileInView={{ x: 0, opacity: 1 }}
             className="p-8 rounded-3xl flex items-center gap-6 border border-slate-100 bg-slate-50"
          >
            <div className="p-4 bg-white shadow-sm rounded-2xl text-brand-blue">
               <Baby className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-1">Kinderkerk</h4>
              <p className="text-slate-500">Opvang en lessen voor kinderen tijdens de dienst</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;
