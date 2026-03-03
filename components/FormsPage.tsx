
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, UserPlus, Phone, MapPin, CheckSquare, Save, ChevronRight, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { addAppointment } from '../services/authService';

const FormsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prayer' | 'conversion' | 'appointment'>('prayer');
  const [successMsg, setSuccessMsg] = useState('');

  // Form States
  const [prayerForm, setPrayerForm] = useState({
    type: 'Bekering',
    name: '',
    phone: '',
    note: ''
  });

  const [conversionForm, setConversionForm] = useState({
    date: new Date().toISOString().split('T')[0],
    workerName: '',
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    whatsapp: '',
    neighborhood: '',
    pickup: false,
    contact: false
  });

  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    phone: '',
    preferredDate: '',
    reason: ''
  });

  const handleFormSubmit = (e: React.FormEvent, formName: 'prayer' | 'conversion' | 'appointment') => {
    e.preventDefault();
    
    const timestamp = new Date().toISOString();
    
    if (formName === 'prayer') {
        const newSubmission = { ...prayerForm, id: Date.now(), timestamp };
        const existing = JSON.parse(localStorage.getItem('prayer_submissions') || '[]');
        localStorage.setItem('prayer_submissions', JSON.stringify([newSubmission, ...existing]));
    } else if (formName === 'conversion') {
        const newSubmission = { ...conversionForm, id: Date.now(), timestamp };
        const existing = JSON.parse(localStorage.getItem('conversion_submissions') || '[]');
        localStorage.setItem('conversion_submissions', JSON.stringify([newSubmission, ...existing]));
    } else {
        addAppointment(appointmentForm);
    }

    const msgMap = {
      prayer: "Bedankt voor het versturen van uw gebedsverlangen. Wij zullen voor u bidden!",
      conversion: "Bedankt! Het bekeringsformulier is succesvol opgeslagen in de database.",
      appointment: "Uw afspraakverzoek is verzonden. De pastor of het secretariaat neemt spoedig contact met u op."
    };
    
    setSuccessMsg(msgMap[formName]);
    setTimeout(() => setSuccessMsg(''), 5000);
    
    // Reset forms
    if(formName === 'prayer') {
        setPrayerForm({ type: 'Bekering', name: '', phone: '', note: '' });
    } else if(formName === 'conversion') {
        setConversionForm({ ...conversionForm, firstName: '', lastName: '', address: '', phone: '' });
    } else {
        setAppointmentForm({ name: '', phone: '', preferredDate: '', reason: '' });
    }
    
    const formElement = document.getElementById('form-content-area');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
       <div className="bg-white pt-32 pb-12 px-6 border-b border-slate-200">
          <div className="container mx-auto max-w-6xl text-center md:text-left">
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue mb-4">Formulieren</h1>
                <p className="text-slate-500 text-lg max-w-2xl">
                    Kies hieronder het gewenste formulier.
                </p>
             </motion.div>
          </div>
       </div>

       <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
         <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            <div className="w-full md:w-72 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-28">
                   <div className="p-4 bg-slate-100 border-b border-slate-200 font-bold text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Categorieën
                   </div>
                   <div className="p-2 space-y-1">
                      <button
                        onClick={() => { setActiveTab('prayer'); setSuccessMsg(''); }}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-200 ${activeTab === 'prayer' ? 'bg-brand-blue text-white shadow-md font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-blue'}`}
                      >
                         <span className="flex items-center gap-3"><Heart className="w-5 h-5" /> Gebedsverlangen</span>
                         {activeTab === 'prayer' && <ChevronRight className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => { setActiveTab('conversion'); setSuccessMsg(''); }}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-200 ${activeTab === 'conversion' ? 'bg-brand-red text-white shadow-md font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-red'}`}
                      >
                         <span className="flex items-center gap-3"><UserPlus className="w-5 h-5" /> Bekeerlingen</span>
                         {activeTab === 'conversion' && <ChevronRight className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => { setActiveTab('appointment'); setSuccessMsg(''); }}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-200 ${activeTab === 'appointment' ? 'bg-slate-900 text-white shadow-md font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                         <span className="flex items-center gap-3"><CalendarIcon className="w-5 h-5" /> Pastor Afspraak</span>
                         {activeTab === 'appointment' && <ChevronRight className="w-4 h-4" />}
                      </button>
                   </div>
                </div>
            </div>

            <div className="flex-1" id="form-content-area">
                <AnimatePresence mode="wait">
                    {successMsg && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                            <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-3 shadow-sm font-bold">
                                <CheckSquare className="w-6 h-6 flex-shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {activeTab === 'prayer' && (
                        <motion.div key="prayer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-8 bg-gradient-to-r from-blue-50 to-white border-b border-slate-100">
                                <h2 className="text-2xl font-serif font-bold text-brand-blue mb-2 flex items-center gap-2"><Heart className="w-6 h-6 fill-current" /> Gebedsverlangen</h2>
                                <p className="text-slate-600 leading-relaxed">Heeft u nood of wilt u dat wij ergens specifiek voor bidden? Vul onderstaand formulier in.</p>
                            </div>
                            <form onSubmit={(e) => handleFormSubmit(e, 'prayer')} className="p-8 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
                                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3" value={prayerForm.type} onChange={e => setPrayerForm({...prayerForm, type: e.target.value})}>
                                            <option value="Bekering">Bekering</option>
                                            <option value="Genezing">Genezing</option>
                                            <option value="Bevrijding">Bevrijding</option>
                                            <option value="Anders">Anders</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Naam</label>
                                        <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="Uw naam" value={prayerForm.name} onChange={e => setPrayerForm({...prayerForm, name: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefoon</label>
                                    <input type="tel" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="+597 ..." value={prayerForm.phone} onChange={e => setPrayerForm({...prayerForm, phone: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Verzoek</label>
                                    <textarea required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 h-32" placeholder="Uw verzoek..." value={prayerForm.note} onChange={e => setPrayerForm({...prayerForm, note: e.target.value})} />
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-8 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">Verstuur Gebedsverzoek</button></div>
                            </form>
                        </motion.div>
                    )}

                    {activeTab === 'conversion' && (
                        <motion.div key="conversion" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                             <div className="p-8 bg-gradient-to-r from-orange-50 to-white border-b border-slate-100">
                                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2 flex items-center gap-2"><UserPlus className="w-6 h-6 text-orange-500" /> Bekeringsformulier</h2>
                                <p className="text-slate-600">Registratie van nieuwe bekeerlingen voor follow-up.</p>
                            </div>
                            <form onSubmit={(e) => handleFormSubmit(e, 'conversion')} className="p-8 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="Voornaam" value={conversionForm.firstName} onChange={e => setConversionForm({...conversionForm, firstName: e.target.value})} />
                                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="Familienaam" value={conversionForm.lastName} onChange={e => setConversionForm({...conversionForm, lastName: e.target.value})} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <input type="tel" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="Telefoon" value={conversionForm.phone} onChange={e => setConversionForm({...conversionForm, phone: e.target.value})} />
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="Adres" value={conversionForm.address} onChange={e => setConversionForm({...conversionForm, address: e.target.value})} />
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-lg shadow-lg">Opslaan</button></div>
                            </form>
                        </motion.div>
                    )}

                    {activeTab === 'appointment' && (
                        <motion.div key="appointment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-8 bg-gradient-to-r from-slate-100 to-white border-b border-slate-100">
                                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2 flex items-center gap-2"><CalendarIcon className="w-6 h-6 text-brand-blue" /> Pastor Afspraak</h2>
                                <p className="text-slate-600 leading-relaxed">Wilt u een gesprek met de pastor? Vul onderstaand formulier in voor een afspraakverzoek.</p>
                            </div>
                            <form onSubmit={(e) => handleFormSubmit(e, 'appointment')} className="p-8 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Uw Naam</label>
                                        <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3" value={appointmentForm.name} onChange={e => setAppointmentForm({...appointmentForm, name: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefoon</label>
                                        <input type="tel" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3" value={appointmentForm.phone} onChange={e => setAppointmentForm({...appointmentForm, phone: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Voorkeursdatum</label>
                                    <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3" value={appointmentForm.preferredDate} onChange={e => setAppointmentForm({...appointmentForm, preferredDate: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reden voor gesprek</label>
                                    <textarea required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 h-24" placeholder="Bijv. Huwelijksinzegening, Doopsel, Gesprek over..." value={appointmentForm.reason} onChange={e => setAppointmentForm({...appointmentForm, reason: e.target.value})} />
                                </div>
                                <div className="flex justify-end pt-4"><button type="submit" className="px-8 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">Verstuur Afspraakverzoek</button></div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
         </div>
       </div>
    </div>
  );
};

export default FormsPage;
