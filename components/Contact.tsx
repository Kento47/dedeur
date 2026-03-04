
import React, { useState, useEffect } from 'react';
import { SectionId, AppSettings } from '../types';
import { MapPin, Phone, Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { getAppSettingsSync, addContactMessage } from '../services/authService';

const Contact: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettingsSync());
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const update = () => setSettings(getAppSettingsSync());
    window.addEventListener('settings-updated', update);
    return () => window.removeEventListener('settings-updated', update);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Vul uw naam in.'); return; }
    if (!form.phone.trim() && !form.email.trim()) { setError('Vul een telefoonnummer of e-mailadres in.'); return; }
    if (!form.message.trim()) { setError('Vul uw bericht in.'); return; }
    setSending(true);
    setTimeout(() => {
      addContactMessage({ name: form.name, phone: form.phone, email: form.email, message: form.message });
      setForm({ name: '', phone: '', email: '', message: '' });
      setSubmitted(true);
      setSending(false);
      setTimeout(() => setSubmitted(false), 5000);
    }, 600);
  };

  return (
    <section id={SectionId.CONTACT} className="py-24 bg-brand-light">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Info */}
          <div>
            <h2 className="text-5xl font-serif font-bold text-slate-900 mb-8">
              Bezoek <br />
              <span className="text-brand-blue">{settings.branding.churchName}.</span>
            </h2>
            <p className="text-slate-600 mb-10 text-xl font-light whitespace-pre-wrap">
              {settings.contact.introText}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-6 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue">
                    <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-lg">Locatie</h4>
                  <p className="text-slate-500">{settings.contact.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-brand-red">
                    <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-lg">Bel / WhatsApp</h4>
                  <p className="text-slate-500">{settings.contact.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-lg">E-mail</h4>
                  <p className="text-slate-500">{settings.contact.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
             <h3 className="text-2xl font-bold text-slate-900 mb-6">Stuur een bericht</h3>

             {submitted ? (
               <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                 <CheckCircle2 className="w-16 h-16 text-green-500" />
                 <h4 className="text-xl font-bold text-slate-900">Bericht verzonden!</h4>
                 <p className="text-slate-500">Wij nemen zo spoedig mogelijk contact met u op.</p>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-5">
                 {error && (
                   <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">{error}</div>
                 )}
                 <div className="grid md:grid-cols-2 gap-5">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Naam *</label>
                     <input
                       type="text"
                       value={form.name}
                       onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                       className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-brand-blue transition-colors"
                       placeholder="Uw naam"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefoon</label>
                     <input
                       type="text"
                       value={form.phone}
                       onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                       className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-brand-blue transition-colors"
                       placeholder="+597 8xx xxxx"
                     />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                   <input
                     type="email"
                     value={form.email}
                     onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                     className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-brand-blue transition-colors"
                     placeholder="naam@email.com"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bericht *</label>
                   <textarea
                     rows={4}
                     value={form.message}
                     onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                     className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-brand-blue transition-colors"
                     placeholder="Waar kunnen we u mee helpen?"
                   />
                 </div>
                 <button
                   type="submit"
                   disabled={sending}
                   className="w-full py-4 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/30 disabled:opacity-60"
                 >
                   {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                     <>Verstuur Bericht <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                   )}
                 </button>
               </form>
             )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
