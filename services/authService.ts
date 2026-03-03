
import { User, VisitorLog, AppSettings, Appointment } from '../types';

const STORAGE_USERS_KEY = 'app_users';
const STORAGE_VISITORS_KEY = 'app_visitor_logs';
const EMBED_STORAGE_KEY = 'service_embed_html';
const STORAGE_SETTINGS_KEY = 'app_settings';
const STORAGE_APPOINTMENTS_KEY = 'app_appointments';

const DEFAULT_USERS: User[] = [
  {
    id: '0',
    name: import.meta.env.VITE_SUPER_ADMIN_NAME || 'Super User',
    email: import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'admin@admin.com',
    role: 'admin',
    password: import.meta.env.VITE_SUPER_ADMIN_PASSWORD || 'admin123'
  },
  {
    id: '1',
    name: import.meta.env.VITE_CHURCH_ADMIN_NAME || 'Beheerder Lelydorp',
    email: import.meta.env.VITE_CHURCH_ADMIN_EMAIL || 'admin@dedeurlelydorp.com',
    role: 'admin',
    password: import.meta.env.VITE_CHURCH_ADMIN_PASSWORD || 'admin123'
  },
  {
    id: '2',
    name: import.meta.env.VITE_MEMBER_NAME || 'Gemeentelid',
    email: import.meta.env.VITE_MEMBER_EMAIL || 'lid@dedeurlelydorp.com',
    role: 'user',
    password: import.meta.env.VITE_MEMBER_PASSWORD || 'lid123'
  }
];

const DEFAULT_SETTINGS: AppSettings = {
  branding: {
    churchName: 'De Deur Lelydorp',
    logoUrl: 'https://dedeurlelydorp.com/wp-content/uploads/2025/10/Asset-2-2048x489.png',
    primaryColor: '#0052cc',
    secondaryColor: '#e11d48'
  },
  home: {
    welcomeTitle: 'Welkom Thuis',
    mainTitle: 'DE DEUR LELYDORP',
    subtitle: 'Een kerk waar levens veranderen. Ontdek je bestemming in een omgeving van geloof, hoop en liefde in het hart van Suriname.',
    buttonText: 'Onze Diensten'
  },
  about: {
    title: 'Meer dan een kerk.',
    subtitle: 'Een thuis.',
    content: 'Evangelie Gemeente De Deur Lelydorp is een plek van hoop en herstel. Wij geloven dat de Bijbel relevant is voor vandaag. Onze boodschap is eenvoudig: Jezus Christus verandert mensenlevens.'
  },
  beliefs: [
    { id: '1', title: "De Bijbel", description: "Wij geloven dat de Bijbel het geïnspireerde Woord van God is, foutloos in de originele geschriften. Het is de ultieme autoriteit voor geloof en leven (2 Timotheüs 3:16)." },
    { id: '2', title: "De Drie-eenheid", description: "Wij geloven in één God, eeuwig bestaand in drie personen: Vader, Zoon en Heilige Geest (Mattheüs 28:19)." },
    { id: '3', title: "Redding", description: "Wij geloven dat redding alleen mogelijk is door genade, door geloof in het vergoten bloed van Jezus Christus. Het is geen beloning voor goede daden, maar een geschenk van God (Efeziërs 2:8-9)." },
    { id: '4', title: "De Doop", description: "Wij geloven in de doop door onderdompeling als getuigenis van een goed geweten, en in de doop in de Heilige Geest met het bewijs van het spreken in tongen (Handelingen 2:38, 2:4)." },
    { id: '5', title: "Goddelijke Genezing", description: "Wij geloven dat goddelijke genezing beschikbaar is door het offer van Jezus aan het kruis. Wij bidden voor de zieken in de verwachting dat God herstelt (Jesaja 53:5, Jakobus 5:14)." },
    { id: '6', title: "De Wederkomst", description: "Wij geloven in de letterlijke, lichamelijke wederkomst van Jezus Christus om Zijn gemeente tot Zich te nemen en te regeren (1 Thessalonicenzen 4:16-17)." }
  ],
  serviceTimes: [
    { id: '1', day: 'Zondag', time: '11:00', description: 'Ochtenddienst & Kinderkerk' },
    { id: '2', day: 'Zondag', time: '18:00', description: 'Avonddienst - Wonderen & Genezing' },
    { id: '3', day: 'Woensdag', time: '19:00', description: 'Midweekdienst - Bijbelstudie' },
  ],
  contact: {
    introText: 'Wij zien u graag in onze samenkomst.',
    address: 'Lelydorp, Suriname',
    phone: '+597 123 4567',
    email: 'info@dedeurlelydorp.com'
  },
  footer: {
    copyrightText: 'Evangelie Gemeente De Deur Lelydorp',
    subText: 'Onderdeel van Christian Fellowship Ministries.'
  },
  churchesSuriname: [
    { id: '1', name: 'De Deur Paramaribo', location: 'Gemenelandsweg, Paramaribo', imageUrl: 'https://images.unsplash.com/photo-1548625361-195fe576b7bc?q=80&w=1000&auto=format&fit=crop' }
  ],
  churchesInternational: [
    { id: '1', name: 'The Door Prescott', location: 'Prescott, Arizona, USA', imageUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1000&auto=format&fit=crop', websiteUrl: 'https://www.prescottpottershouse.com' }
  ],
  youtubeLink: 'https://www.youtube.com/embed/live_stream?channel=UCxxxxxxxx', 
  flyers: [],
  pastor: {
    name: "Pastor Arjan Draaijer",
    title: "Pastor & Echtgenote",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop", 
    bio: "Welkom bij De Deur Lelydorp."
  },
  recentSermons: []
};

export const getAppSettings = (): AppSettings => {
    try {
        const stored = localStorage.getItem(STORAGE_SETTINGS_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
            return DEFAULT_SETTINGS;
        }
        const parsed = JSON.parse(stored);
        
        return { 
          ...DEFAULT_SETTINGS, 
          ...parsed,
          beliefs: (!parsed.beliefs || parsed.beliefs.length === 0) ? DEFAULT_SETTINGS.beliefs : parsed.beliefs,
          serviceTimes: (!parsed.serviceTimes || parsed.serviceTimes.length === 0) ? DEFAULT_SETTINGS.serviceTimes : parsed.serviceTimes
        };
    } catch (e) {
        return DEFAULT_SETTINGS;
    }
};

export const saveAppSettings = (settings: AppSettings) => {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('settings-updated'));
};

export const getAppointments = (): Appointment[] => {
    try {
        const stored = localStorage.getItem(STORAGE_APPOINTMENTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch(e) { return []; }
};

export const addAppointment = (appt: Omit<Appointment, 'id' | 'status' | 'date'>) => {
    const appts = getAppointments();
    const newAppt: Appointment = { ...appt, id: Date.now(), date: new Date().toISOString(), status: 'new' };
    const newAppts = [newAppt, ...appts];
    localStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(newAppts));
    return newAppts;
};

export const updateAppointmentStatus = (id: number, status: Appointment['status']) => {
    const appts = getAppointments();
    const newAppts = appts.map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(newAppts));
    return newAppts;
};

export const deleteAppointment = (id: number) => {
    const appts = getAppointments();
    const newAppts = appts.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(newAppts));
    return newAppts;
};

export const getUsers = (): User[] => {
  const stored = localStorage.getItem(STORAGE_USERS_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try { return JSON.parse(stored); } catch (e) { return DEFAULT_USERS; }
};

export const addUser = (user: User) => {
  const users = getUsers();
  const newUsers = [...users, { ...user, id: Date.now().toString() }];
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(newUsers));
  return newUsers;
};

export const updateUser = (id: string, updates: Partial<User>): User[] => {
  const users = getUsers();
  const newUsers = users.map(u => u.id === id ? { ...u, ...updates } : u);
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(newUsers));
  return newUsers;
};

export const deleteUser = (id: string) => {
  const users = getUsers();
  const newUsers = users.filter(u => u.id !== id);
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(newUsers));
  return newUsers;
};

export const login = async (email: string, password: string): Promise<User> => {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  throw new Error('Ongeldige inloggegevens.');
};

export const logout = () => { localStorage.removeItem('currentUser'); };
export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) { return null; }
};

export const getVisitorLogs = (): VisitorLog[] => {
  try {
    const stored = localStorage.getItem(STORAGE_VISITORS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) { return []; }
};

export const addVisitorLog = (log: Omit<VisitorLog, 'id' | 'total'>) => {
  const logs = getVisitorLogs();
  const total = (Number(log.men) || 0) + (Number(log.women) || 0) + (Number(log.children) || 0);
  const newLog: VisitorLog = { ...log, id: Date.now(), total };
  const newLogs = [newLog, ...logs];
  localStorage.setItem(STORAGE_VISITORS_KEY, JSON.stringify(newLogs));
  return newLogs;
};

export const deleteVisitorLog = (id: number) => {
    const logs = getVisitorLogs();
    const newLogs = logs.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_VISITORS_KEY, JSON.stringify(newLogs));
    return newLogs;
}

export const saveEmbedCode = (html: string) => { localStorage.setItem(EMBED_STORAGE_KEY, html); };
export const getEmbedCode = (): string => {
  return localStorage.getItem(EMBED_STORAGE_KEY) || '<iframe src="https://calendar.google.com/calendar/embed?src=nl.dutch%23holiday%40group.v.calendar.google.com&ctz=America%2FParamaribo" style="border: 0" width="100%" height="600" frameborder="0" scrolling="no"></iframe>';
};

export const deletePrayerSubmission = (id: number) => {
    const existing = JSON.parse(localStorage.getItem('prayer_submissions') || '[]');
    const updated = existing.filter((p: any) => p.id !== id);
    localStorage.setItem('prayer_submissions', JSON.stringify(updated));
    return updated;
};

export const deleteConversionSubmission = (id: number) => {
    const existing = JSON.parse(localStorage.getItem('conversion_submissions') || '[]');
    const updated = existing.filter((c: any) => c.id !== id);
    localStorage.setItem('conversion_submissions', JSON.stringify(updated));
    return updated;
};

// ============================================================
// Contact Messages (from contact form on website)
// ============================================================
const CONTACT_MESSAGES_KEY = 'contact_messages';

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const getContactMessages = (): ContactMessage[] => {
  try {
    const stored = localStorage.getItem(CONTACT_MESSAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

export const addContactMessage = (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>): ContactMessage[] => {
  const messages = getContactMessages();
  const newMsg: ContactMessage = {
    ...msg,
    id: Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
  };
  const updated = [newMsg, ...messages];
  localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(updated));
  return updated;
};

export const markContactMessageRead = (id: number): ContactMessage[] => {
  const messages = getContactMessages();
  const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
  localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteContactMessage = (id: number): ContactMessage[] => {
  const messages = getContactMessages();
  const updated = messages.filter(m => m.id !== id);
  localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(updated));
  return updated;
};

export const getUnreadContactCount = (): number => {
  return getContactMessages().filter(m => !m.read).length;
};
