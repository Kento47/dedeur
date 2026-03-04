
import React, { useState, useEffect } from 'react';
import DocumentationPage from './DocumentationPage';
import { User, VisitorLog, AppSettings, Appointment, BeliefItem, ChurchItem, EventFlyer, MediaItem, ServiceTime } from '../types';
import {
  saveEmbedCode, getEmbedCode, logout,
  getUsers, addUser, deleteUser, updateUser,
  getVisitorLogs, addVisitorLog, deleteVisitorLog,
  getAppSettings, saveAppSettings,
  getAppointments, updateAppointmentStatus, deleteAppointment,
  getPrayerSubmissions, deletePrayerSubmission,
  getConversionSubmissions, deleteConversionSubmission,
  getContactMessages, markContactMessageRead, deleteContactMessage, ContactMessage,
} from '../services/authService';
import { 
  getAiSettings, saveAiSettings, AiSettings, OPENROUTER_MODELS, checkRateLimit, clearChatHistory, sendMessageToOpenRouter
} from '../services/openRouterService';
import { 
  Save, LogOut, LayoutDashboard, Calendar, CheckSquare, 
  FileSpreadsheet, Download, RefreshCw, Trash2, Users, BarChart3, Plus, X, UserPlus, TrendingUp,
  Image as ImageIcon, Youtube, CalendarCheck, Upload, Video, User as UserIcon,
  Palette, Globe, AlignLeft, BookOpen, Phone, LayoutTemplate, MapPin, CheckCircle2, Clock, Code, Film, GripVertical, Pencil, ChevronDown, Check, Settings2, Home, Info, Book, Heart, Map, Globe2, Mail, Layout, ExternalLink,
  FileText, Search, UserCheck, MessageCircle, Bot, Inbox, Eye, EyeOff, Loader2, Zap, Key, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// UsersView — Gebruikers beheren (toevoegen, bewerken, verwijderen)
// ============================================================
interface UsersViewProps {
  usersList: User[];
  setUsersList: (users: User[]) => void;
  showSuccess: (msg: string) => void;
  inputStyle: string;
  labelStyle: string;
  sectionHeaderStyle: string;
}

const UsersView: React.FC<UsersViewProps> = ({ usersList, setUsersList, showSuccess, inputStyle, labelStyle, sectionHeaderStyle }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; email: string; role: 'admin' | 'user'; password: string }>({ name: '', email: '', role: 'user', password: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' as 'admin' | 'user', password: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const startEdit = (u: User) => {
    setEditingId(u.id);
    setEditForm({ name: u.name, email: u.email, role: u.role as 'admin' | 'user', password: '' });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const updates: Partial<User> = { name: editForm.name, email: editForm.email, role: editForm.role };
    if (editForm.password.trim()) updates.password = editForm.password;
    setUsersList(await updateUser(editingId, updates));
    setEditingId(null);
    showSuccess('Gebruiker bijgewerkt');
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.name) return;
    const updated = await addUser({ ...newUser, id: Date.now().toString() });
    setUsersList(updated);
    setNewUser({ name: '', email: '', role: 'user', password: '' });
    setShowAddForm(false);
    showSuccess('Gebruiker toegevoegd');
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-blue-100 text-blue-700',
    user: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="space-y-6">
      {/* Gebruikers lijst */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-blue" /> Gebruikers
            <span className="text-sm text-slate-400 font-normal">({usersList.length})</span>
          </h3>
          <button
            onClick={() => setShowAddForm(v => !v)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-700 transition-colors"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? 'Annuleren' : 'Toevoegen'}
          </button>
        </div>

        {/* Add User Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-6 bg-brand-blue/5 border border-brand-blue/20 rounded-2xl space-y-4 overflow-hidden"
            >
              <h4 className="font-bold text-brand-blue flex items-center gap-2"><UserPlus className="w-4 h-4" /> Nieuwe Gebruiker</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Naam</label>
                  <input className={inputStyle} placeholder="Volledige naam" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                </div>
                <div>
                  <label className={labelStyle}>E-mail</label>
                  <input type="email" className={inputStyle} placeholder="email@example.com" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                </div>
                <div>
                  <label className={labelStyle}>Wachtwoord</label>
                  <input type="password" className={inputStyle} placeholder="••••••••" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                </div>
                <div>
                  <label className={labelStyle}>Rol</label>
                  <select className={inputStyle} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as 'admin' | 'user'})}>
                    <option value="user">Gebruiker</option>
                    <option value="admin">Beheerder (Admin)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.email || !newUser.password}
                className="w-full py-3 bg-brand-blue text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" /> Gebruiker Aanmaken
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users List */}
        <div className="space-y-3">
          {usersList.map(u => (
            <div key={u.id} className={`rounded-2xl border transition-all ${editingId === u.id ? 'border-brand-blue bg-blue-50/30' : 'border-slate-100 bg-slate-50'}`}>
              {editingId === u.id ? (
                // Edit mode
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Bewerken</span>
                    <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Naam</label>
                      <input className={inputStyle} value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelStyle}>E-mail</label>
                      <input type="email" className={inputStyle} value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelStyle}>Nieuw wachtwoord (leeg = ongewijzigd)</label>
                      <input type="password" className={inputStyle} placeholder="••••••••" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelStyle}>Rol</label>
                      <select className={inputStyle} value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value as 'admin' | 'user'})}>
                        <option value="user">Gebruiker</option>
                        <option value="admin">Beheerder (Admin)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={saveEdit} className="flex-1 py-2.5 bg-brand-blue text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                      <Check className="w-4 h-4" /> Opslaan
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-5 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors">
                      Annuleren
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{u.name}</h4>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${roleColors[u.role] || roleColors.user}`}>
                      {u.role === 'admin' ? 'Beheerder' : 'Gebruiker'}
                    </span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(u)}
                      className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue rounded-lg transition-all"
                      title="Bewerken"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => { if(confirm(`'${u.name}' verwijderen?`)) setUsersList(await deleteUser(u.id)); }}
                      className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-lg transition-all"
                      title="Verwijderen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type DashboardView = 'calendar' | 'responses' | 'users' | 'visitors' | 'media' | 'pastor' | 'cms' | 'documentation' | 'messages' | 'ai-settings';
type CmsSection = 'branding' | 'home' | 'about' | 'beliefs' | 'services' | 'suriname' | 'intl' | 'agenda' | 'contact' | 'footer';

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('calendar');
  const [cmsSection, setCmsSection] = useState<CmsSection>('branding');
  const [isCmsDropdownOpen, setIsCmsDropdownOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [embedHtml, setEmbedHtml] = useState(getEmbedCode());
  const [usersList, setUsersList] = useState<User[]>([]);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prayerSubmissions, setPrayerSubmissions] = useState<any[]>([]);
  const [conversionSubmissions, setConversionSubmissions] = useState<any[]>([]);
  const [responsesTab, setResponsesTab] = useState<'prayer' | 'conversion' | 'appointment'>('prayer');

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // AI Settings state
  const [aiSettings, setAiSettings] = useState<AiSettings>(() => getAiSettings());
  const [aiTestMsg, setAiTestMsg] = useState('');
  const [aiTestResponse, setAiTestResponse] = useState('');
  const [aiTestLoading, setAiTestLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Form states
  const [newService, setNewService] = useState({ day: '', time: '', description: '' });
  const [newBelief, setNewBelief] = useState({ title: '', description: '' });
  const [newChurch, setNewChurch] = useState({ name: '', location: '', imageUrl: '', websiteUrl: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' as 'admin' | 'user', password: '' });
  const [newVisitorLog, setNewVisitorLog] = useState({ date: new Date().toISOString().split('T')[0], serviceType: 'Zondag Ochtend' as any, men: 0, women: 0, children: 0, newVisitors: 0, notes: '' });
  const [newFlyer, setNewFlyer] = useState({ title: '', imageUrl: '' });
  const [newMedia, setNewMedia] = useState({ title: '', preacher: '', date: new Date().toLocaleDateString(), videoUrl: '' });
  
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [draggedServiceIndex, setDraggedServiceIndex] = useState<number | null>(null);

  useEffect(() => { refreshData(); }, []);

  const refreshData = async () => {
    const [settings, users, visitors, appts, prayers, conversions, messages] = await Promise.all([
      getAppSettings(),
      getUsers(),
      getVisitorLogs(),
      getAppointments(),
      getPrayerSubmissions(),
      getConversionSubmissions(),
      getContactMessages(),
    ]);
    setAppSettings(settings);
    setUsersList(users);
    setVisitorLogs(visitors);
    setAppointments(appts);
    setPrayerSubmissions(prayers);
    setConversionSubmissions(conversions);
    setContactMessages(messages);
    setEmbedHtml(getEmbedCode());
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveSettings = async () => {
    if (!appSettings) return;
    await saveAppSettings(appSettings);
    if (cmsSection === 'agenda') saveEmbedCode(embedHtml);
    showSuccess('Wijzigingen succesvol opgeslagen!');
  };

  // Utility to handle image conversion to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const cmsSections = [
    { id: 'branding', label: 'Branding & Logo', icon: <Palette className="w-4 h-4" /> },
    { id: 'home', label: 'Homepagina Teksten', icon: <Home className="w-4 h-4" /> },
    { id: 'about', label: 'Over Ons Sectie', icon: <Info className="w-4 h-4" /> },
    { id: 'beliefs', label: 'Geloofspunten', icon: <Book className="w-4 h-4" /> },
    { id: 'services', label: 'Diensttijden Beheer', icon: <Clock className="w-4 h-4" /> },
    { id: 'suriname', label: 'Kerken Suriname', icon: <Map className="w-4 h-4" /> },
    { id: 'intl', label: 'Internationaal Netwerk', icon: <Globe2 className="w-4 h-4" /> },
    { id: 'agenda', label: 'Agenda Embed', icon: <Calendar className="w-4 h-4" /> },
    { id: 'contact', label: 'Contactgegevens', icon: <Mail className="w-4 h-4" /> },
    { id: 'footer', label: 'Footer Instellingen', icon: <Layout className="w-4 h-4" /> }
  ];

  const activeCmsSection = cmsSections.find(s => s.id === cmsSection);

  // Lists Handlers
  const handleAddService = () => {
    if (!newService.day || !newService.time) return;
    const updated = { ...appSettings, serviceTimes: [...(appSettings.serviceTimes || []), { ...newService, id: Date.now().toString() }] };
    setAppSettings(updated);
    setNewService({ day: '', time: '', description: '' });
  };

  const handleAddBelief = () => {
    if (!newBelief.title) return;
    const updated = { ...appSettings, beliefs: [...(appSettings.beliefs || []), { ...newBelief, id: Date.now().toString() }] };
    setAppSettings(updated);
    setNewBelief({ title: '', description: '' });
  };

  const handleAddChurch = (type: 'suriname' | 'intl') => {
    const key = type === 'suriname' ? 'churchesSuriname' : 'churchesInternational';
    const updated = { ...appSettings, [key]: [...(appSettings[key] || []), { ...newChurch, id: Date.now().toString() }] };
    setAppSettings(updated);
    setNewChurch({ name: '', location: '', imageUrl: '', websiteUrl: '' });
  };

  const handleDeleteItem = async (id: string, key: 'serviceTimes' | 'beliefs' | 'churchesSuriname' | 'churchesInternational' | 'flyers' | 'recentSermons') => {
    if (!appSettings) return;
    const updated = { ...appSettings, [key]: (appSettings[key] as any[]).filter((item: any) => item.id !== id) };
    setAppSettings(updated);
    await saveAppSettings(updated);
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password) return;
    const updated = await addUser({ ...newUser, id: Date.now().toString() });
    setUsersList(updated);
    setNewUser({ name: '', email: '', role: 'user', password: '' });
    showSuccess('Gebruiker toegevoegd');
  };

  const handleAddVisitorLog = async () => {
    const updated = await addVisitorLog(newVisitorLog);
    setVisitorLogs(updated);
    setNewVisitorLog({ date: new Date().toISOString().split('T')[0], serviceType: 'Zondag Ochtend', men: 0, women: 0, children: 0, newVisitors: 0, notes: '' });
    showSuccess('Statistiek toegevoegd');
  };

  const handleAddFlyer = async () => {
    if (!newFlyer.imageUrl || !appSettings) return;
    const updated = { ...appSettings, flyers: [...(appSettings.flyers || []), { ...newFlyer, id: Date.now().toString() }] };
    setAppSettings(updated);
    await saveAppSettings(updated);
    setNewFlyer({ title: '', imageUrl: '' });
    showSuccess('Flyer toegevoegd');
  };

  const handleAddMedia = async () => {
    if (!newMedia.videoUrl || !appSettings) return;
    const updated = { ...appSettings, recentSermons: [...(appSettings.recentSermons || []), { ...newMedia, id: Date.now().toString() }] };
    setAppSettings(updated);
    await saveAppSettings(updated);
    setNewMedia({ title: '', preacher: '', date: new Date().toLocaleDateString(), videoUrl: '' });
    showSuccess('Media item toegevoegd');
  };

  const exportToCSV = () => {
    let data: any[] = [];
    let filename = '';
    let headers: string[] = [];

    if (responsesTab === 'prayer') {
      data = prayerSubmissions;
      filename = `gebedsverzoeken_${new Date().toLocaleDateString()}.csv`;
      headers = ['Datum', 'Type', 'Naam', 'Telefoon', 'Verzoek'];
    } else if (responsesTab === 'conversion') {
      data = conversionSubmissions;
      filename = `bekeerlingen_${new Date().toLocaleDateString()}.csv`;
      headers = ['Datum', 'Voornaam', 'Familienaam', 'Telefoon', 'Adres', 'Werker', 'Ophalen', 'Contact'];
    } else {
      data = appointments;
      filename = `afspraken_${new Date().toLocaleDateString()}.csv`;
      headers = ['Datum', 'Naam', 'Telefoon', 'Voorkeursdatum', 'Reden', 'Status'];
    }

    if (data.length === 0) {
      alert('Geen gegevens om te exporteren.');
      return;
    }

    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      let values: string[] = [];
      if (responsesTab === 'prayer') {
        values = [
          new Date(row.timestamp).toLocaleString(),
          row.type,
          row.name,
          row.phone,
          `"${row.note.replace(/"/g, '""')}"`
        ];
      } else if (responsesTab === 'conversion') {
        values = [
          new Date(row.timestamp).toLocaleString(),
          row.firstName,
          row.lastName,
          row.phone,
          row.address || '',
          row.workerName || '',
          row.pickup ? 'Ja' : 'Nee',
          row.contact ? 'Ja' : 'Nee'
        ];
      } else {
        values = [
          new Date(row.date).toLocaleString(),
          row.name,
          row.phone,
          row.preferredDate,
          `"${row.reason.replace(/"/g, '""')}"`,
          row.status
        ];
      }
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDragStart = (index: number) => setDraggedServiceIndex(index);
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedServiceIndex === null || draggedServiceIndex === index) return;
    const items = [...appSettings.serviceTimes];
    const item = items[draggedServiceIndex];
    items.splice(draggedServiceIndex, 1);
    items.splice(index, 0, item);
    setDraggedServiceIndex(index);
    setAppSettings({ ...appSettings, serviceTimes: items });
  };

  const inputStyle = "w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all text-sm";
  const labelStyle = "block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 mt-4";
  const sectionHeaderStyle = "text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100";

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-serif font-bold">Welkom, {user.name}</h1>
            <p className="text-slate-500 text-sm">Dashboard <span className="text-brand-red font-bold uppercase">{user.role}</span></p>
          </div>
          <button onClick={() => { logout(); onLogout(); }} className="px-5 py-2.5 border border-red-200 text-red-600 bg-red-50 rounded-xl flex items-center gap-2 hover:bg-red-100 transition-colors font-bold text-sm">
            <LogOut className="w-4 h-4" /> Uitloggen
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-28">
              <div className="p-4 bg-slate-900 text-white font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                <LayoutDashboard className="w-5 h-5" /> Beheerpaneel
              </div>
              <nav className="p-2 space-y-1">
                {[
                  { id: 'calendar', label: 'Agenda Overzicht', icon: <Calendar className="w-5 h-5" /> },
                  { id: 'cms', label: 'Website Editor', icon: <Palette className="w-5 h-5" /> },
                  { id: 'media', label: 'Media & Events', icon: <ImageIcon className="w-5 h-5" /> },
                  { id: 'messages', label: 'Berichten', icon: <Inbox className="w-5 h-5" />, badge: contactMessages.filter(m => !m.read).length },
                  { id: 'responses', label: 'Inzendingen', icon: <MessageCircle className="w-5 h-5" /> },
                  { id: 'visitors', label: 'Statistieken', icon: <BarChart3 className="w-5 h-5" /> },
                  { id: 'users', label: 'Gebruikers', icon: <Users className="w-5 h-5" /> },
                  { id: 'pastor', label: 'Pastor Info', icon: <UserIcon className="w-5 h-5" /> },
                  { id: 'ai-settings', label: 'AI Assistent', icon: <Bot className="w-5 h-5" /> },
                  { id: 'documentation', label: 'Handleiding', icon: <BookOpen className="w-5 h-5" /> }
                ].map((item: any) => (
                  <button key={item.id} onClick={() => setCurrentView(item.id as any)} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${currentView === item.id ? 'bg-brand-blue/10 text-brand-blue' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}>
                    {item.icon} <span className="flex-1">{item.label}</span>
                    {item.badge > 0 && <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence>
              {successMsg && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-3 shadow-sm font-bold"><CheckCircle2 className="w-5 h-5" /> {successMsg}</motion.div>}
            </AnimatePresence>

            <motion.div key={currentView} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              
              {currentView === 'cms' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
                  <div className="p-5 bg-slate-50 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Sectie Kiezen</label>
                       <button onClick={() => setIsCmsDropdownOpen(!isCmsDropdownOpen)} className="flex items-center justify-between gap-4 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm min-w-[260px] hover:border-brand-blue transition-all group">
                          <div className="flex items-center gap-3"><div className="p-1.5 bg-brand-blue/10 text-brand-blue rounded-lg">{activeCmsSection?.icon}</div><span className="font-bold text-slate-700">{activeCmsSection?.label}</span></div>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCmsDropdownOpen ? 'rotate-180' : ''}`} />
                       </button>
                       <AnimatePresence>
                         {isCmsDropdownOpen && (
                           <><div className="fixed inset-0 z-10" onClick={() => setIsCmsDropdownOpen(false)}></div><motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 py-2 overflow-hidden">{cmsSections.map((section) => (<button key={section.id} onClick={() => { setCmsSection(section.id as any); setIsCmsDropdownOpen(false); }} className={`w-full text-left px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors ${cmsSection === section.id ? 'bg-brand-blue/5 text-brand-blue' : 'text-slate-600'}`}><div className="flex items-center gap-3"><div className={cmsSection === section.id ? 'text-brand-blue' : 'text-slate-400'}>{section.icon}</div><span className="text-[13px] font-bold">{section.label}</span></div>{cmsSection === section.id && <Check className="w-4 h-4" />}</button>))}</motion.div></>
                         )}
                       </AnimatePresence>
                    </div>
                    <button onClick={handleSaveSettings} className="px-8 py-3 bg-brand-blue text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all"><Save className="w-5 h-5" /> Alles Opslaan</button>
                  </div>

                  <div className="p-8 min-h-[500px]">
                    {cmsSection === 'branding' && (
                      <div className="space-y-6 max-w-2xl">
                        <h3 className={sectionHeaderStyle}><Palette className="w-6 h-6" /> Branding & Kleuren</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="col-span-full"><label className={labelStyle}>Naam Kerk</label><input className={inputStyle} value={appSettings.branding.churchName} onChange={e => setAppSettings({...appSettings, branding: {...appSettings.branding, churchName: e.target.value}})} /></div>
                           <div><label className={labelStyle}>Primaire Kleur</label><div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border"><input type="color" className="w-10 h-10 rounded-lg cursor-pointer bg-transparent" value={appSettings.branding.primaryColor} onChange={e => setAppSettings({...appSettings, branding: {...appSettings.branding, primaryColor: e.target.value}})} /><input className="bg-transparent border-none text-sm font-mono focus:ring-0 w-24" value={appSettings.branding.primaryColor} onChange={e => setAppSettings({...appSettings, branding: {...appSettings.branding, primaryColor: e.target.value}})} /></div></div>
                           <div><label className={labelStyle}>Accent Kleur</label><div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border"><input type="color" className="w-10 h-10 rounded-lg cursor-pointer bg-transparent" value={appSettings.branding.secondaryColor} onChange={e => setAppSettings({...appSettings, branding: {...appSettings.branding, secondaryColor: e.target.value}})} /><input className="bg-transparent border-none text-sm font-mono focus:ring-0 w-24" value={appSettings.branding.secondaryColor} onChange={e => setAppSettings({...appSettings, branding: {...appSettings.branding, secondaryColor: e.target.value}})} /></div></div>
                           <div className="col-span-full">
                              <label className={labelStyle}>Logo URL</label>
                              <div className="flex gap-2">
                                <input className={inputStyle} value={appSettings.branding.logoUrl} onChange={e => setAppSettings({...appSettings, branding: {...appSettings.branding, logoUrl: e.target.value}})} placeholder="https://..." />
                                <label className="shrink-0 px-4 py-3 bg-slate-900 text-white rounded-xl cursor-pointer hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-bold">
                                  <Upload className="w-4 h-4" /> Upload
                                  <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, base64 => setAppSettings({...appSettings, branding: {...appSettings.branding, logoUrl: base64}}))} />
                                </label>
                              </div>
                              {appSettings.branding.logoUrl && <div className="mt-4 p-4 bg-slate-100 rounded-xl flex justify-center border border-slate-200"><img src={appSettings.branding.logoUrl} className="h-12 object-contain" /></div>}
                           </div>
                        </div>
                      </div>
                    )}

                    {cmsSection === 'home' && (
                       <div className="space-y-6 max-w-2xl">
                          <h3 className={sectionHeaderStyle}><Home className="w-6 h-6" /> Homepagina Teksten</h3>
                          <div><label className={labelStyle}>Welkom Label</label><input className={inputStyle} value={appSettings.home.welcomeTitle} onChange={e => setAppSettings({...appSettings, home: {...appSettings.home, welcomeTitle: e.target.value}})} /></div>
                          <div><label className={labelStyle}>Hoofdtitel</label><input className={inputStyle} value={appSettings.home.mainTitle} onChange={e => setAppSettings({...appSettings, home: {...appSettings.home, mainTitle: e.target.value}})} /></div>
                          <div><label className={labelStyle}>Ondertitel</label><textarea className={inputStyle + " h-32"} value={appSettings.home.subtitle} onChange={e => setAppSettings({...appSettings, home: {...appSettings.home, subtitle: e.target.value}})} /></div>
                       </div>
                    )}

                    {cmsSection === 'about' && (
                       <div className="space-y-6 max-w-2xl">
                          <h3 className={sectionHeaderStyle}><Info className="w-6 h-6" /> Over Ons Sectie</h3>
                          <div><label className={labelStyle}>Titel</label><input className={inputStyle} value={appSettings.about.title} onChange={e => setAppSettings({...appSettings, about: {...appSettings.about, title: e.target.value}})} /></div>
                          <div><label className={labelStyle}>Ondertitel</label><input className={inputStyle} value={appSettings.about.subtitle} onChange={e => setAppSettings({...appSettings, about: {...appSettings.about, subtitle: e.target.value}})} /></div>
                          <div><label className={labelStyle}>Inhoud</label><textarea className={inputStyle + " h-64"} value={appSettings.about.content} onChange={e => setAppSettings({...appSettings, about: {...appSettings.about, content: e.target.value}})} /></div>
                       </div>
                    )}

                    {cmsSection === 'beliefs' && (
                      <div className="space-y-6">
                        <h3 className={sectionHeaderStyle}><Book className="w-6 h-6" /> Geloofspunten</h3>
                        <div className="grid gap-4">
                           {appSettings.beliefs.map(b => (
                              <div key={b.id} className="p-4 bg-slate-50 rounded-xl border flex justify-between items-start">
                                 <div><h4 className="font-bold text-slate-800">{b.title}</h4><p className="text-xs text-slate-500">{b.description}</p></div>
                                 <button onClick={() => handleDeleteItem(b.id, 'beliefs')} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                              </div>
                           ))}
                        </div>
                        <div className="p-6 bg-slate-50 border-2 border-dashed rounded-2xl space-y-4">
                           <input className={inputStyle} placeholder="Titel" value={newBelief.title} onChange={e => setNewBelief({...newBelief, title: e.target.value})} />
                           <textarea className={inputStyle} placeholder="Omschrijving" value={newBelief.description} onChange={e => setNewBelief({...newBelief, description: e.target.value})} />
                           <button onClick={handleAddBelief} className="w-full py-3 bg-brand-blue text-white rounded-xl font-bold">Geloofspunt Toevoegen</button>
                        </div>
                      </div>
                    )}

                    {cmsSection === 'services' && (
                      <div className="space-y-8">
                        <h3 className={sectionHeaderStyle}><Clock className="w-6 h-6" /> Diensttijden & Volgorde</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                           {appSettings.serviceTimes.map((service, index) => (
                              <div key={service.id} draggable onDragStart={() => onDragStart(index)} onDragOver={(e) => onDragOver(e, index)} className={`p-5 bg-white border rounded-2xl shadow-sm relative group cursor-move transition-all ${draggedServiceIndex === index ? 'opacity-40 scale-95 border-brand-blue border-2' : 'border-slate-200'}`}>
                                 <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => setEditingServiceId(editingServiceId === service.id ? null : service.id)} className={`p-1.5 rounded-lg border ${editingServiceId === service.id ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-slate-400 border-slate-200 hover:text-brand-blue'}`}><Pencil className="w-4 h-4" /></button><button onClick={() => handleDeleteItem(service.id, 'serviceTimes')} className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div>
                                 <div className="absolute top-4 left-4 text-slate-200"><GripVertical className="w-5 h-5" /></div>
                                 <div className="mt-4 text-center">
                                    {editingServiceId === service.id ? (
                                       <div className="space-y-3 pt-2">
                                          <input className="w-full p-2 text-sm border rounded bg-slate-50 font-bold text-center" value={service.day} onChange={(e) => { const list = [...appSettings.serviceTimes]; list[index].day = e.target.value; setAppSettings({...appSettings, serviceTimes: list}); }} />
                                          <input className="w-full p-2 text-2xl border rounded bg-slate-50 font-serif font-bold text-center" value={service.time} onChange={(e) => { const list = [...appSettings.serviceTimes]; list[index].time = e.target.value; setAppSettings({...appSettings, serviceTimes: list}); }} />
                                          <input className="w-full p-2 text-xs border rounded bg-slate-50 text-slate-500 text-center" value={service.description} onChange={(e) => { const list = [...appSettings.serviceTimes]; list[index].description = e.target.value; setAppSettings({...appSettings, serviceTimes: list}); }} />
                                       </div>
                                    ) : (
                                       <><span className="font-bold text-slate-800 text-lg block mb-1">{service.day}</span><div className="text-4xl font-serif font-bold text-slate-900 mb-2">{service.time}</div><div className="text-sm text-slate-500 border-t pt-3">{service.description}</div></>
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4"><h4 className="font-bold text-slate-700">Nieuwe Dienst</h4><div className="grid md:grid-cols-3 gap-4"><input className={inputStyle} placeholder="Dag" value={newService.day} onChange={e => setNewService({...newService, day: e.target.value})} /><input className={inputStyle} placeholder="Tijd" value={newService.time} onChange={e => setNewService({...newService, time: e.target.value})} /><input className={inputStyle} placeholder="Omschrijving" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} /></div><button onClick={handleAddService} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">Toevoegen</button></div>
                      </div>
                    )}

                    {(cmsSection === 'suriname' || cmsSection === 'intl') && (
                       <div className="space-y-6">
                          <h3 className={sectionHeaderStyle}>{cmsSection === 'suriname' ? 'Kerken Suriname' : 'Internationaal Netwerk'}</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                             {appSettings[cmsSection === 'suriname' ? 'churchesSuriname' : 'churchesInternational'].map(c => (
                                <div key={c.id} className="p-4 bg-slate-50 rounded-xl border flex items-center gap-4">
                                   <div className="w-16 h-16 rounded overflow-hidden border border-slate-200"><img src={c.imageUrl} className="w-full h-full object-cover" /></div>
                                   <div className="flex-1">
                                      <h4 className="font-bold text-sm">{c.name}</h4>
                                      <p className="text-xs text-slate-400">{c.location}</p>
                                   </div>
                                   <button onClick={() => handleDeleteItem(c.id, cmsSection === 'suriname' ? 'churchesSuriname' : 'churchesInternational')} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                             ))}
                          </div>
                          <div className="p-6 bg-slate-50 border-2 border-dashed rounded-2xl space-y-4">
                             <input className={inputStyle} placeholder="Naam" value={newChurch.name} onChange={e => setNewChurch({...newChurch, name: e.target.value})} />
                             <input className={inputStyle} placeholder="Locatie" value={newChurch.location} onChange={e => setNewChurch({...newChurch, location: e.target.value})} />
                             <div className="flex gap-2">
                                <input className={inputStyle} placeholder="Afbeelding URL" value={newChurch.imageUrl} onChange={e => setNewChurch({...newChurch, imageUrl: e.target.value})} />
                                <label className="shrink-0 px-4 py-3 bg-slate-900 text-white rounded-xl cursor-pointer hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-bold">
                                  <Upload className="w-4 h-4" />
                                  <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, base64 => setNewChurch({...newChurch, imageUrl: base64}))} />
                                </label>
                             </div>
                             {newChurch.imageUrl && <div className="p-4 bg-white border rounded-xl flex justify-center"><img src={newChurch.imageUrl} className="h-20 object-contain" /></div>}
                             <button onClick={() => handleAddChurch(cmsSection === 'suriname' ? 'suriname' : 'intl')} className="w-full py-3 bg-brand-blue text-white rounded-xl font-bold">Toevoegen aan lijst</button>
                          </div>
                       </div>
                    )}

                    {cmsSection === 'agenda' && (
                       <div className="space-y-6">
                          <h3 className={sectionHeaderStyle}>Agenda Embed</h3>
                          <textarea className={inputStyle + " h-48 font-mono text-xs"} placeholder='<iframe src="..." ...></iframe>' value={embedHtml} onChange={e => setEmbedHtml(e.target.value)} />
                       </div>
                    )}

                    {cmsSection === 'contact' && (
                       <div className="space-y-6">
                          <h3 className={sectionHeaderStyle}>Contactgegevens</h3>
                          <div><label className={labelStyle}>Intro Tekst</label><textarea className={inputStyle + " h-24"} value={appSettings.contact.introText} onChange={e => setAppSettings({...appSettings, contact: {...appSettings.contact, introText: e.target.value}})} /></div>
                          <div><label className={labelStyle}>Adres</label><input className={inputStyle} value={appSettings.contact.address} onChange={e => setAppSettings({...appSettings, contact: {...appSettings.contact, address: e.target.value}})} /></div>
                          <div><label className={labelStyle}>Telefoon</label><input className={inputStyle} value={appSettings.contact.phone} onChange={e => setAppSettings({...appSettings, contact: {...appSettings.contact, phone: e.target.value}})} /></div>
                          <div><label className={labelStyle}>E-mail</label><input className={inputStyle} value={appSettings.contact.email} onChange={e => setAppSettings({...appSettings, contact: {...appSettings.contact, email: e.target.value}})} /></div>
                       </div>
                    )}

                    {cmsSection === 'footer' && (
                       <div className="space-y-6">
                          <h3 className={sectionHeaderStyle}>Footer Instellingen</h3>
                          <div><label className={labelStyle}>Copyright Tekst</label><input className={inputStyle} value={appSettings.footer.copyrightText} onChange={e => setAppSettings({...appSettings, footer: {...appSettings.footer, copyrightText: e.target.value}})} /></div>
                          <div><label className={labelStyle}>Extra Tekst</label><input className={inputStyle} value={appSettings.footer.subText} onChange={e => setAppSettings({...appSettings, footer: {...appSettings.footer, subText: e.target.value}})} /></div>
                       </div>
                    )}
                  </div>
                </div>
              )}

              {currentView === 'calendar' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-[700px] flex flex-col">
                   <h3 className="text-xl font-bold flex items-center gap-3 mb-6"><Calendar className="w-6 h-6 text-brand-blue" /> Live Agenda Overzicht</h3>
                   <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-100 shadow-inner" dangerouslySetInnerHTML={{ __html: embedHtml }}></div>
                </div>
              )}

              {currentView === 'media' && (
                <div className="space-y-6">
                  {/* YouTube Livestream */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h3 className={sectionHeaderStyle}><Youtube className="w-6 h-6 text-red-600" /> Livestream Link</h3>
                    <div><label className={labelStyle}>Embed URL</label><input className={inputStyle} value={appSettings.youtubeLink} onChange={e => setAppSettings({...appSettings, youtubeLink: e.target.value})} placeholder="https://www.youtube.com/embed/..." /></div>
                    <button onClick={handleSaveSettings} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2"><Save className="w-4 h-4" /> Opslaan</button>
                  </div>

                  {/* Flyers Image Upload */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h3 className={sectionHeaderStyle}><ImageIcon className="w-6 h-6" /> Highlights (Flyer Carrousel)</h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                       {appSettings.flyers.map(flyer => (
                          <div key={flyer.id} className="relative group aspect-[3/4] rounded-xl overflow-hidden border">
                             <img src={flyer.imageUrl} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                <p className="text-white text-sm font-bold truncate mb-2">{flyer.title}</p>
                                <button onClick={() => handleDeleteItem(flyer.id, 'flyers')} className="w-full py-2 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><Trash2 className="w-3 h-3" /> Verwijderen</button>
                             </div>
                          </div>
                       ))}
                    </div>
                    <div className="p-6 bg-slate-50 border-2 border-dashed rounded-2xl space-y-4">
                       <h4 className="font-bold text-slate-700">Nieuwe Flyer Toevoegen</h4>
                       <div className="grid md:grid-cols-2 gap-4">
                          <input className={inputStyle} placeholder="Titel Event" value={newFlyer.title} onChange={e => setNewFlyer({...newFlyer, title: e.target.value})} />
                          <div className="flex gap-2">
                             <input className={inputStyle} placeholder="Afbeelding URL" value={newFlyer.imageUrl} onChange={e => setNewFlyer({...newFlyer, imageUrl: e.target.value})} />
                             <label className="shrink-0 px-4 py-3 bg-slate-900 text-white rounded-xl cursor-pointer hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-bold">
                                <Upload className="w-4 h-4" /> Upload
                                <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, base64 => setNewFlyer({...newFlyer, imageUrl: base64}))} />
                             </label>
                          </div>
                       </div>
                       {newFlyer.imageUrl && <div className="p-4 bg-white border rounded-xl flex justify-center"><img src={newFlyer.imageUrl} className="h-32 object-contain" /></div>}
                       <button onClick={handleAddFlyer} className="w-full py-3 bg-brand-blue text-white rounded-xl font-bold flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Toevoegen aan Carrousel</button>
                    </div>
                  </div>

                  {/* Recent Media (Sermons) */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h3 className={sectionHeaderStyle}><Video className="w-6 h-6" /> Recente Video's</h3>
                    <div className="space-y-4 mb-8">
                       {appSettings.recentSermons.map(m => (
                          <div key={m.id} className="p-4 bg-slate-50 border rounded-xl flex justify-between items-center">
                             <div><h4 className="font-bold text-sm">{m.title}</h4><p className="text-xs text-slate-400">{m.preacher}</p></div>
                             <button onClick={() => handleDeleteItem(m.id, 'recentSermons')} className="text-slate-300 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                          </div>
                       ))}
                    </div>
                    <div className="p-6 bg-slate-50 border-2 border-dashed rounded-2xl space-y-4">
                       <input className={inputStyle} placeholder="Titel" value={newMedia.title} onChange={e => setNewMedia({...newMedia, title: e.target.value})} />
                       <input className={inputStyle} placeholder="Spreker" value={newMedia.preacher} onChange={e => setNewMedia({...newMedia, preacher: e.target.value})} />
                       <input className={inputStyle} placeholder="YouTube Embed URL" value={newMedia.videoUrl} onChange={e => setNewMedia({...newMedia, videoUrl: e.target.value})} />
                       <button onClick={handleAddMedia} className="w-full py-3 bg-brand-blue text-white rounded-xl font-bold">Video Publiceren</button>
                    </div>
                  </div>
                </div>
              )}

              {currentView === 'responses' && (
                <div className="space-y-8">
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-6 bg-slate-50 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div className="flex items-center gap-4">
                            <h3 className="text-xl font-bold flex items-center gap-3"><MessageCircle className="w-6 h-6 text-brand-blue" /> Inzendingen Overzicht</h3>
                            <button 
                              onClick={exportToCSV}
                              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
                              title="Exporteer naar CSV"
                            >
                               <Download className="w-3.5 h-3.5" /> Export
                            </button>
                         </div>
                         <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                            <button 
                              onClick={() => setResponsesTab('prayer')}
                              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${responsesTab === 'prayer' ? 'bg-brand-blue text-white shadow-md' : 'text-slate-500 hover:text-brand-blue'}`}
                            >
                               Gebedsverzoeken
                            </button>
                            <button 
                              onClick={() => setResponsesTab('conversion')}
                              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${responsesTab === 'conversion' ? 'bg-brand-red text-white shadow-md' : 'text-slate-500 hover:text-brand-red'}`}
                            >
                               Bekeerlingen
                            </button>
                            <button 
                              onClick={() => setResponsesTab('appointment')}
                              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${responsesTab === 'appointment' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                               Afspraken
                            </button>
                         </div>
                      </div>

                      <div className="p-8">
                         {responsesTab === 'prayer' && (
                            <div className="grid gap-4">
                               {prayerSubmissions.length > 0 ? prayerSubmissions.map(p => (
                                  <div key={p.id} className="p-6 bg-slate-50 rounded-2xl border group relative">
                                     <button 
                                       onClick={async () => { if(confirm('Verwijderen?')) { setPrayerSubmissions(await deletePrayerSubmission(p.id)); showSuccess('Verwijderd'); } }}
                                       className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                     >
                                        <Trash2 className="w-4 h-4" />
                                     </button>
                                     <span className="text-xs text-slate-400 block mb-2">{new Date(p.timestamp).toLocaleString()}</span>
                                     <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.type === 'Bekering' ? 'bg-blue-100 text-blue-700' : p.type === 'Genezing' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
                                           {p.type}
                                        </span>
                                        <h4 className="font-bold text-slate-800">{p.name}</h4>
                                     </div>
                                     <p className="text-sm text-slate-500 flex items-center gap-2 mb-3"><Phone className="w-3 h-3" /> {p.phone}</p>
                                     <div className="p-4 bg-white rounded-xl border border-slate-100 text-sm text-slate-600 italic">
                                        "{p.note}"
                                     </div>
                                  </div>
                               )) : <div className="text-center py-12 text-slate-400">Geen gebedsverzoeken gevonden.</div>}
                            </div>
                         )}

                         {responsesTab === 'conversion' && (
                            <div className="grid gap-4">
                               {conversionSubmissions.length > 0 ? conversionSubmissions.map(c => (
                                  <div key={c.id} className="p-6 bg-slate-50 rounded-2xl border group relative">
                                     <button 
                                       onClick={async () => { if(confirm('Verwijderen?')) { setConversionSubmissions(await deleteConversionSubmission(c.id)); showSuccess('Verwijderd'); } }}
                                       className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                     >
                                        <Trash2 className="w-4 h-4" />
                                     </button>
                                     <span className="text-xs text-slate-400 block mb-2">{new Date(c.timestamp).toLocaleString()}</span>
                                     <h4 className="font-bold text-slate-800 text-lg mb-1">{c.firstName} {c.lastName}</h4>
                                     <div className="grid md:grid-cols-2 gap-4 mt-4">
                                        <div className="space-y-2">
                                           <p className="text-sm text-slate-600 flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {c.phone}</p>
                                           <p className="text-sm text-slate-600 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {c.address || 'Geen adres'}</p>
                                        </div>
                                        <div className="space-y-2">
                                           <p className="text-sm text-slate-600 flex items-center gap-2"><UserCheck className="w-4 h-4 text-slate-400" /> Werker: {c.workerName || 'Onbekend'}</p>
                                           <div className="flex gap-2">
                                              {c.pickup && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] font-bold uppercase">Ophalen</span>}
                                              {c.contact && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase">Contact opnemen</span>}
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                               )) : <div className="text-center py-12 text-slate-400">Geen bekeerlingen gevonden.</div>}
                            </div>
                         )}

                         {responsesTab === 'appointment' && (
                            <div className="grid gap-4">
                               {appointments.length > 0 ? appointments.map(a => (
                                  <div key={a.id} className="p-6 bg-slate-50 rounded-2xl border group relative">
                                     <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <select 
                                          value={a.status} 
                                          onChange={async (e) => { setAppointments(await updateAppointmentStatus(a.id, e.target.value as any)); showSuccess('Status bijgewerkt'); }}
                                          className="text-[10px] font-bold uppercase bg-white border rounded p-1"
                                        >
                                           <option value="new">Nieuw</option>
                                           <option value="contacted">Gecontacteerd</option>
                                           <option value="completed">Voltooid</option>
                                        </select>
                                        <button 
                                          onClick={async () => { if(confirm('Verwijderen?')) { setAppointments(await deleteAppointment(a.id)); showSuccess('Verwijderd'); } }}
                                          className="p-2 text-slate-300 hover:text-red-500"
                                        >
                                           <Trash2 className="w-4 h-4" />
                                        </button>
                                     </div>
                                     <span className="text-xs text-slate-400 block mb-2">{new Date(a.date).toLocaleString()}</span>
                                     <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-2 h-2 rounded-full ${a.status === 'new' ? 'bg-blue-500 animate-pulse' : a.status === 'contacted' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                                        <h4 className="font-bold text-slate-800">{a.name}</h4>
                                     </div>
                                     <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                           <p className="text-sm text-slate-600 flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {a.phone}</p>
                                           <p className="text-sm text-slate-600 flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Voorkeur: {a.preferredDate}</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl border border-slate-100 text-sm text-slate-600">
                                           <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Reden:</span>
                                           {a.reason}
                                        </div>
                                     </div>
                                  </div>
                               )) : <div className="text-center py-12 text-slate-400">Geen afspraakverzoeken gevonden.</div>}
                            </div>
                         )}
                      </div>
                   </div>
                </div>
              )}

              {currentView === 'visitors' && (
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h3 className={sectionHeaderStyle}><BarChart3 className="w-6 h-6 text-green-500" /> Bezoekers Statistieken</h3>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left text-sm">
                          <thead><tr className="border-b text-slate-400 uppercase text-[10px]"><th className="pb-2">Datum</th><th className="pb-2 text-center">M</th><th className="pb-2 text-center">V</th><th className="pb-2 text-center">K</th><th className="pb-2 text-center">Totaal</th><th className="pb-2"></th></tr></thead>
                          <tbody className="divide-y">
                             {visitorLogs.map(l => (
                                <tr key={l.id}><td className="py-3 font-bold">{l.date}</td><td className="text-center">{l.men}</td><td className="text-center">{l.women}</td><td className="text-center">{l.children}</td><td className="text-center font-bold text-brand-blue">{l.total}</td><td><button onClick={async () => { setVisitorLogs(await deleteVisitorLog(l.id)); }} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></td></tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h4 className="font-bold mb-4">Log Toevoegen</h4>
                    <div className="grid grid-cols-3 gap-4">
                       <input className={inputStyle} type="number" placeholder="Mannen" value={newVisitorLog.men} onChange={e => setNewVisitorLog({...newVisitorLog, men: parseInt(e.target.value)})} />
                       <input className={inputStyle} type="number" placeholder="Vrouwen" value={newVisitorLog.women} onChange={e => setNewVisitorLog({...newVisitorLog, women: parseInt(e.target.value)})} />
                       <input className={inputStyle} type="number" placeholder="Kinderen" value={newVisitorLog.children} onChange={e => setNewVisitorLog({...newVisitorLog, children: parseInt(e.target.value)})} />
                    </div>
                    <button onClick={handleAddVisitorLog} className="mt-4 w-full py-3 bg-slate-900 text-white rounded-xl font-bold">Opslaan</button>
                  </div>
                </div>
              )}

              {currentView === 'users' && (
                <UsersView
                  usersList={usersList}
                  setUsersList={setUsersList}
                  showSuccess={showSuccess}
                  inputStyle={inputStyle}
                  labelStyle={labelStyle}
                  sectionHeaderStyle={sectionHeaderStyle}
                />
              )}

              {currentView === 'messages' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 bg-slate-50 border-b flex items-center justify-between">
                      <h3 className="text-xl font-bold flex items-center gap-3">
                        <Inbox className="w-6 h-6 text-brand-blue" /> Berichten van Website
                        {contactMessages.filter(m => !m.read).length > 0 && (
                          <span className="bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-full">{contactMessages.filter(m => !m.read).length} nieuw</span>
                        )}
                      </h3>
                      {contactMessages.length > 0 && (
                        <button
                          onClick={async () => {
                            if (confirm('Alle berichten verwijderen?')) {
                              await Promise.all(contactMessages.map(m => deleteContactMessage(m.id)));
                              setContactMessages([]);
                              showSuccess('Alle berichten verwijderd');
                            }
                          }}
                          className="px-3 py-1.5 bg-white border border-red-200 text-red-500 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Alles wissen
                        </button>
                      )}
                    </div>
                    <div className="p-6 space-y-4">
                      {contactMessages.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                          <Inbox className="w-12 h-12 mx-auto mb-4 opacity-30" />
                          <p className="font-medium">Geen berichten gevonden.</p>
                          <p className="text-sm mt-1">Berichten van het contactformulier verschijnen hier.</p>
                        </div>
                      ) : contactMessages.map(msg => (
                        <div key={msg.id} className={`p-5 rounded-2xl border group relative transition-all ${msg.read ? 'bg-slate-50 border-slate-100' : 'bg-blue-50/50 border-blue-200'}`}>
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={async () => { setContactMessages(await markContactMessageRead(msg.id)); }}
                              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-brand-blue text-[10px] flex items-center gap-1"
                              title={msg.read ? 'Al gelezen' : 'Markeer als gelezen'}
                            >
                              {msg.read ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={async () => { if (confirm('Verwijderen?')) { setContactMessages(await deleteContactMessage(msg.id)); showSuccess('Bericht verwijderd'); } }}
                              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            {!msg.read && <span className="w-2 h-2 bg-brand-blue rounded-full animate-pulse flex-shrink-0"></span>}
                            <h4 className="font-bold text-slate-900">{msg.name}</h4>
                            <span className="text-xs text-slate-400">{new Date(msg.timestamp).toLocaleString('nl-NL')}</span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3 mb-3 text-sm text-slate-500">
                            {msg.phone && <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{msg.phone}</span>}
                            {msg.email && <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{msg.email}</span>}
                          </div>
                          <div className="p-4 bg-white rounded-xl border border-slate-100 text-sm text-slate-700">
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentView === 'ai-settings' && (
                <div className="space-y-6">
                  {/* AI Info Banner */}
                  <div className="bg-gradient-to-r from-violet-600 to-brand-blue rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">AI Assistent Instellingen</h3>
                        <p className="text-white/80 text-sm">Powered by OpenRouter — Gratis OSS modellen</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {(() => { const r = checkRateLimit(aiSettings.rateLimit); return (
                        <>
                          <div className="bg-white/10 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">{r.remaining}</div>
                            <div className="text-xs text-white/70">Berichten resterend</div>
                          </div>
                          <div className="bg-white/10 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">{aiSettings.rateLimit}</div>
                            <div className="text-xs text-white/70">Limiet per minuut</div>
                          </div>
                          <div className="bg-white/10 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">✓</div>
                            <div className="text-xs text-white/70">Gratis OSS model</div>
                          </div>
                        </>
                      ); })()}
                    </div>
                  </div>

                  {/* Model & Rate Limit */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h4 className={sectionHeaderStyle}><Zap className="w-5 h-5" /> Model & Rate Limiting</h4>
                    <div className="space-y-4">
                      <div>
                        <label className={labelStyle}>AI Model (Open Source)</label>
                        <select
                          className={inputStyle}
                          value={aiSettings.model}
                          onChange={e => setAiSettings({...aiSettings, model: e.target.value})}
                        >
                          {OPENROUTER_MODELS.map(m => (
                            <option key={m.id} value={m.id}>{m.label}</option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-400 mt-1">Alle modellen zijn gratis beschikbaar via OpenRouter.</p>
                      </div>
                      <div>
                        <label className={labelStyle}>Rate Limit (berichten per minuut)</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range" min="3" max="30" step="1"
                            value={aiSettings.rateLimit}
                            onChange={e => setAiSettings({...aiSettings, rateLimit: parseInt(e.target.value)})}
                            className="flex-1 accent-brand-blue"
                          />
                          <span className="text-lg font-bold text-brand-blue w-10 text-center">{aiSettings.rateLimit}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* API Key (optional) */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h4 className={sectionHeaderStyle}><Key className="w-5 h-5" /> API Key (Optioneel)</h4>
                    <p className="text-sm text-slate-500 mb-4">Voor de gratis OSS modellen is geen API key nodig. Voeg er een toe voor hogere limieten of premium modellen.</p>
                    <div>
                      <label className={labelStyle}>OpenRouter API Key</label>
                      <div className="flex gap-2">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          className={inputStyle}
                          placeholder="sk-or-..."
                          value={aiSettings.apiKey}
                          onChange={e => setAiSettings({...aiSettings, apiKey: e.target.value})}
                        />
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-slate-600" />}
                        </button>
                      </div>
                      <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-blue hover:underline mt-1 block">
                        → Gratis API key aanmaken op openrouter.ai
                      </a>
                    </div>
                  </div>

                  {/* Assistant Persona */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h4 className={sectionHeaderStyle}><Bot className="w-5 h-5" /> Assistent Persona</h4>
                    <div className="space-y-4">
                      <div>
                        <label className={labelStyle}>Naam Assistent</label>
                        <input
                          className={inputStyle}
                          value={aiSettings.assistantName}
                          onChange={e => setAiSettings({...aiSettings, assistantName: e.target.value})}
                          placeholder="Bijv. Kerkassistent"
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Welkomstbericht</label>
                        <textarea
                          className={inputStyle + ' h-20'}
                          value={aiSettings.welcomeMessage}
                          onChange={e => setAiSettings({...aiSettings, welcomeMessage: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Systeem Instructie (Persoonlijkheid & Context)</label>
                        <textarea
                          className={inputStyle + ' h-40'}
                          value={aiSettings.systemInstruction}
                          onChange={e => setAiSettings({...aiSettings, systemInstruction: e.target.value})}
                        />
                        <p className="text-xs text-slate-400 mt-1">De systeem instructie bepaalt de persoonlijkheid en kennis van de AI.</p>
                      </div>
                    </div>
                  </div>

                  {/* Test Chat */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h4 className={sectionHeaderStyle}><Zap className="w-5 h-5 text-yellow-500" /> AI Testen</h4>
                    <div className="space-y-3">
                      <input
                        className={inputStyle}
                        placeholder="Typ een testbericht..."
                        value={aiTestMsg}
                        onChange={e => setAiTestMsg(e.target.value)}
                        onKeyDown={async e => { if (e.key === 'Enter' && aiTestMsg.trim() && !aiTestLoading) { setAiTestLoading(true); const resp = await sendMessageToOpenRouter(aiTestMsg); setAiTestResponse(resp); setAiTestLoading(false); setAiTestMsg(''); } }}
                      />
                      <button
                        onClick={async () => { if (!aiTestMsg.trim() || aiTestLoading) return; setAiTestLoading(true); const resp = await sendMessageToOpenRouter(aiTestMsg); setAiTestResponse(resp); setAiTestLoading(false); setAiTestMsg(''); }}
                        disabled={aiTestLoading || !aiTestMsg.trim()}
                        className="px-6 py-2.5 bg-brand-blue text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 hover:bg-blue-700 transition-colors"
                      >
                        {aiTestLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        Stuur Test
                      </button>
                      {aiTestResponse && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">AI Antwoord:</span>
                          {aiTestResponse}
                        </div>
                      )}
                      <button
                        onClick={() => { clearChatHistory(); setAiTestResponse(''); showSuccess('Chat geschiedenis gewist'); }}
                        className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Chat geschiedenis wissen
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => { saveAiSettings(aiSettings); showSuccess('AI instellingen opgeslagen!'); }}
                    className="w-full py-4 bg-brand-blue text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all"
                  >
                    <Save className="w-5 h-5" /> AI Instellingen Opslaan
                  </button>
                </div>
              )}

              {currentView === 'documentation' && <DocumentationPage />}

              {currentView === 'pastor' && (
                <div className="space-y-6">
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                      <h3 className={sectionHeaderStyle}><UserIcon className="w-6 h-6" /> Pastor Informatie</h3>
                      <div className="flex flex-col md:flex-row gap-8">
                         <div className="w-full md:w-48 text-center space-y-3">
                            <div className="aspect-square rounded-2xl overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100"><img src={appSettings.pastor.imageUrl} className="w-full h-full object-cover" /></div>
                            <label className="block px-4 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                              <Upload className="w-3 h-3 inline mr-2" /> Foto wijzigen
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, base64 => setAppSettings({...appSettings, pastor: {...appSettings.pastor, imageUrl: base64}}))} />
                            </label>
                         </div>
                         <div className="flex-1 space-y-4">
                            <div><label className={labelStyle}>Naam Pastor</label><input className={inputStyle} value={appSettings.pastor.name} onChange={e => setAppSettings({...appSettings, pastor: {...appSettings.pastor, name: e.target.value}})} /></div>
                            <div><label className={labelStyle}>Biografie</label><textarea className={inputStyle + " h-32"} value={appSettings.pastor.bio} onChange={e => setAppSettings({...appSettings, pastor: {...appSettings.pastor, bio: e.target.value}})} /></div>
                         </div>
                      </div>
                      <div className="mt-8 pt-6 border-t flex justify-end"><button onClick={handleSaveSettings} className="px-8 py-3 bg-brand-blue text-white font-bold rounded-xl shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all flex items-center gap-2"><Save className="w-5 h-5" /> Opslaan</button></div>
                   </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
