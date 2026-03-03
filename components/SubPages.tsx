
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar, Video, ArrowRight, User, Clock, MapPin, Phone, Send, CalendarCheck, Play, Plus, Minus, Globe, ExternalLink, Youtube } from 'lucide-react';
import { getAppSettings, addAppointment, getEmbedCode } from '../services/authService';
import { AppSettings, MediaItem, ChurchItem } from '../types';

const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="bg-slate-50 pt-32 pb-16 px-6 text-center border-b border-slate-200">
    <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue mb-4">{title}</h1>
    <p className="text-slate-500 text-lg max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

const ChurchCard: React.FC<{ church: ChurchItem }> = ({ church }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-xl transition-all">
    <div className="aspect-video relative overflow-hidden">
      <img src={church.imageUrl} alt={church.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-white"><h3 className="font-bold text-xl">{church.name}</h3></div>
    </div>
    <div className="p-6">
      <div className="flex items-start gap-3 text-slate-600 mb-6"><MapPin className="w-5 h-5 text-brand-red shrink-0" /><span className="text-sm">{church.location}</span></div>
      {church.websiteUrl && <a href={church.websiteUrl} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-bold">Website <ExternalLink className="w-4 h-4" /></a>}
    </div>
  </div>
);

export const ChurchesSurinamePage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader title="Kerken in Suriname" subtitle="Onze lokale gemeenschappen" />
      <div className="container mx-auto px-6 pt-16"><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{settings.churchesSuriname.map(c => <ChurchCard key={c.id} church={c} />)}</div></div>
    </div>
  );
};

export const ChurchesInternationalPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader title="Wereldwijd Netwerk" subtitle="Onderdeel van CFM" />
      <div className="container mx-auto px-6 pt-16"><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{settings.churchesInternational.map(c => <ChurchCard key={c.id} church={c} />)}</div></div>
    </div>
  );
};

export const BeliefsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Wat Geloven Wij" subtitle="Fundament van ons geloof" />
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <div className="space-y-4">
          {settings.beliefs.map((item, idx) => (
            <div key={item.id} className="bg-slate-50 rounded-xl border">
              <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex items-center justify-between p-5 text-left font-bold">{item.title} {openIndex === idx ? <Minus /> : <Plus />}</button>
              {openIndex === idx && <div className="p-5 pt-0 text-slate-600">{item.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PastorPage: React.FC = () => {
  const settings = getAppSettings();
  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader title="Onze Pastor" subtitle={settings.pastor.name} />
      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3"><img src={settings.pastor.imageUrl} className="rounded-2xl shadow-xl" /></div>
        <div className="md:w-2/3"><h2 className="text-3xl font-bold mb-6">{settings.pastor.title}</h2><p className="whitespace-pre-wrap text-slate-600">{settings.pastor.bio}</p></div>
      </div>
    </div>
  );
};

export const CalendarPage: React.FC = () => {
  const [embedHtml, setEmbedHtml] = useState(getEmbedCode());
  
  useEffect(() => {
    setEmbedHtml(getEmbedCode());
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader title="Agenda" subtitle="Samenkomsten & Activiteiten" />
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div 
          className="w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white min-h-[600px]" 
          dangerouslySetInnerHTML={{ __html: embedHtml }} 
        />
        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <p className="text-slate-500 italic">Wijzigingen in het rooster worden hier direct bijgewerkt.</p>
        </div>
      </div>
    </div>
  );
};

export const MediaPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());

  useEffect(() => {
    const update = () => setSettings(getAppSettings());
    window.addEventListener('settings-updated', update);
    return () => window.removeEventListener('settings-updated', update);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader title="Media" subtitle="Livestreams & Video's" />
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        
        {/* Livestream Main */}
        <div className="mb-20">
           <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
              Live Uitzending
           </h2>
           <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
              <iframe 
                width="100%" 
                height="100%" 
                src={settings.youtubeLink} 
                title="Livestream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
           </div>
        </div>

        {/* Recent Sermons / Videos Gallery */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {settings.recentSermons.length > 0 ? (
              settings.recentSermons.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group"
                >
                   <div className="aspect-video relative">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={item.videoUrl} 
                        title={item.title}
                        className="w-full h-full"
                      />
                   </div>
                   <div className="p-6">
                      <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                      <div className="flex justify-between items-center mt-4">
                         <span className="text-xs font-bold text-brand-blue uppercase">{item.preacher}</span>
                         <span className="text-xs text-slate-400">{item.date}</span>
                      </div>
                   </div>
                </motion.div>
              ))
           ) : (
             <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                <Video className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400">Nog geen eerdere video's geüpload.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader title="Privacy Policy" subtitle="Hoe wij omgaan met uw gegevens" />
      <div className="container mx-auto px-6 py-16 max-w-3xl text-slate-600 leading-relaxed space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Inleiding</h2>
          <p>Evangelie Gemeente De Deur Lelydorp respecteert uw privacy en verwerkt persoonsgegevens alleen voor het doel waarvoor ze zijn verstrekt en in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG).</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Welke gegevens verzamelen wij?</h2>
          <p>Wanneer u gebruik maakt van onze formulieren (gebedsverzoek, bekeringsformulier of afspraakverzoek), verzamelen wij de gegevens die u invult, zoals uw naam, telefoonnummer en adres. Deze gegevens worden uitsluitend gebruikt voor pastorale doeleinden en follow-up.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Bewaartermijn</h2>
          <p>Wij bewaren uw gegevens niet langer dan noodzakelijk is voor het doel waarvoor ze zijn verzameld. U heeft te allen tijde het recht om uw gegevens in te zien, te laten corrigeren of te laten verwijderen.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Beveiliging</h2>
          <p>Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beveiligen tegen verlies of enige vorm van onrechtmatige verwerking.</p>
        </section>
      </div>
    </div>
  );
};

export const CookiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader title="Cookiebeleid" subtitle="Informatie over het gebruik van cookies" />
      <div className="container mx-auto px-6 py-16 max-w-3xl text-slate-600 leading-relaxed space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Wat zijn cookies?</h2>
          <p>Cookies zijn kleine tekstbestanden die door een website op uw computer, tablet of mobiele telefoon worden geplaatst op het moment dat u de website bezoekt.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Functionele cookies</h2>
          <p>Onze website gebruikt voornamelijk functionele cookies die noodzakelijk zijn voor het technisch functioneren van de website en uw gebruiksgemak. Deze cookies onthouden bijvoorbeeld uw voorkeuren.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Analytische cookies</h2>
          <p>Wij kunnen gebruik maken van analytische cookies om het gebruik van onze website te analyseren en te verbeteren. Deze gegevens zijn anoniem en niet herleidbaar tot individuele personen.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies uitschakelen</h2>
          <p>U kunt uw browser zo instellen dat u geen cookies meer ontvangt. In dat geval kan het zijn dat niet alle onderdelen van de website correct functioneren.</p>
        </section>
      </div>
    </div>
  );
};
