
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { login } from '../services/authService';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Inloggen mislukt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-20 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Member Portal</h2>
            <p className="text-slate-500 text-sm">Log in voor toegang tot de gemeente tools.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm border border-red-100">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Emailadres</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full bg-slate-50 border border-slate-200 pl-10 pr-3 py-3 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors"
                  placeholder="admin@admin.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Wachtwoord</label>
                <a
                  href={`mailto:${import.meta.env.VITE_ADMIN_CONTACT_EMAIL || 'info@suritargets.com'}?subject=Wachtwoord vergeten - Member Portal&body=Beste administrator,%0A%0AIk ben mijn wachtwoord vergeten voor het Member Portal.%0A%0AMet vriendelijke groet`}
                  className="text-xs text-brand-blue hover:underline font-medium"
                >
                  Wachtwoord vergeten?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full bg-slate-50 border border-slate-200 pl-10 pr-3 py-3 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold text-white bg-brand-blue hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Inloggen'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-400">
            <p>Heeft u toegangsproblemen? Neem contact op met de administrator.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
