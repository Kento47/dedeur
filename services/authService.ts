
import { User, VisitorLog, AppSettings, Appointment } from '../types';

const API = '/api';

// ============================================================
// Helper
// ============================================================
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Onbekende fout' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ============================================================
// Auth
// ============================================================
export const login = async (email: string, password: string): Promise<User> => {
  const user = await apiFetch<User>('/auth.php', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

export const logout = () => { localStorage.removeItem('currentUser'); };

export const getCurrentUser = (): User | null => {
  try {
    const s = localStorage.getItem('currentUser');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

// ============================================================
// Users
// ============================================================
export const getUsers = async (): Promise<User[]> => {
  return apiFetch<User[]>('/users.php');
};

export const addUser = async (user: Omit<User, 'id'>): Promise<User[]> => {
  await apiFetch('/users.php', { method: 'POST', body: JSON.stringify(user) });
  return getUsers();
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User[]> => {
  await apiFetch('/users.php', { method: 'PUT', body: JSON.stringify({ id, ...updates }) });
  return getUsers();
};

export const deleteUser = async (id: string): Promise<User[]> => {
  await apiFetch(`/users.php?id=${id}`, { method: 'DELETE' });
  return getUsers();
};

// ============================================================
// App Settings
// ============================================================

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

export const getAppSettings = async (): Promise<AppSettings> => {
  try {
    const data = await apiFetch<AppSettings | null>('/settings.php');
    if (!data) return DEFAULT_SETTINGS;
    const merged = {
      ...DEFAULT_SETTINGS,
      ...data,
      beliefs: (!data.beliefs || data.beliefs.length === 0) ? DEFAULT_SETTINGS.beliefs : data.beliefs,
      serviceTimes: (!data.serviceTimes || data.serviceTimes.length === 0) ? DEFAULT_SETTINGS.serviceTimes : data.serviceTimes,
    };
    localStorage.setItem('app_settings_cache', JSON.stringify(merged));
    return merged;
  } catch {
    return getAppSettingsSync();
  }
};

// Sync versie leest uit localStorage-cache (voor componenten die sync initialisatie nodig hebben)
export const getAppSettingsSync = (): AppSettings => {
  try {
    const cached = localStorage.getItem('app_settings_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...DEFAULT_SETTINGS, ...parsed,
        beliefs: (!parsed.beliefs || parsed.beliefs.length === 0) ? DEFAULT_SETTINGS.beliefs : parsed.beliefs,
        serviceTimes: (!parsed.serviceTimes || parsed.serviceTimes.length === 0) ? DEFAULT_SETTINGS.serviceTimes : parsed.serviceTimes,
      };
    }
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
};

export const saveAppSettings = async (settings: AppSettings): Promise<void> => {
  await apiFetch('/settings.php', { method: 'POST', body: JSON.stringify(settings) });
  localStorage.setItem('app_settings_cache', JSON.stringify(settings));
  window.dispatchEvent(new Event('settings-updated'));
};

// ============================================================
// Appointments
// ============================================================
export const getAppointments = async (): Promise<Appointment[]> => {
  return apiFetch<Appointment[]>('/appointments.php');
};

export const addAppointment = async (appt: Omit<Appointment, 'id' | 'status' | 'date'>): Promise<Appointment[]> => {
  const newAppt = { ...appt, id: Date.now(), date: new Date().toISOString(), status: 'new' as const };
  await apiFetch('/appointments.php', { method: 'POST', body: JSON.stringify(newAppt) });
  return getAppointments();
};

export const updateAppointmentStatus = async (id: number, status: Appointment['status']): Promise<Appointment[]> => {
  await apiFetch('/appointments.php', { method: 'PUT', body: JSON.stringify({ id, status }) });
  return getAppointments();
};

export const deleteAppointment = async (id: number): Promise<Appointment[]> => {
  await apiFetch(`/appointments.php?id=${id}`, { method: 'DELETE' });
  return getAppointments();
};

// ============================================================
// Visitor Logs
// ============================================================
export const getVisitorLogs = async (): Promise<VisitorLog[]> => {
  return apiFetch<VisitorLog[]>('/visitors.php');
};

export const addVisitorLog = async (log: Omit<VisitorLog, 'id' | 'total'>): Promise<VisitorLog[]> => {
  const newLog = { ...log, id: Date.now() };
  await apiFetch('/visitors.php', { method: 'POST', body: JSON.stringify(newLog) });
  return getVisitorLogs();
};

export const deleteVisitorLog = async (id: number): Promise<VisitorLog[]> => {
  await apiFetch(`/visitors.php?id=${id}`, { method: 'DELETE' });
  return getVisitorLogs();
};

// ============================================================
// Embed Code (blijft in localStorage — is geen gedeelde data)
// ============================================================
const EMBED_STORAGE_KEY = 'service_embed_html';
export const saveEmbedCode = (html: string) => { localStorage.setItem(EMBED_STORAGE_KEY, html); };
export const getEmbedCode = (): string => {
  return localStorage.getItem(EMBED_STORAGE_KEY) || '<iframe src="https://calendar.google.com/calendar/embed?src=nl.dutch%23holiday%40group.v.calendar.google.com&ctz=America%2FParamaribo" style="border: 0" width="100%" height="600" frameborder="0" scrolling="no"></iframe>';
};

// ============================================================
// Prayer Submissions
// ============================================================
export const getPrayerSubmissions = async (): Promise<any[]> => {
  return apiFetch<any[]>('/prayer.php');
};

export const addPrayerSubmission = async (submission: any): Promise<void> => {
  await apiFetch('/prayer.php', { method: 'POST', body: JSON.stringify(submission) });
};

export const deletePrayerSubmission = async (id: number): Promise<any[]> => {
  await apiFetch(`/prayer.php?id=${id}`, { method: 'DELETE' });
  return getPrayerSubmissions();
};

// ============================================================
// Conversion Submissions
// ============================================================
export const getConversionSubmissions = async (): Promise<any[]> => {
  return apiFetch<any[]>('/conversion.php');
};

export const addConversionSubmission = async (submission: any): Promise<void> => {
  await apiFetch('/conversion.php', { method: 'POST', body: JSON.stringify(submission) });
};

export const deleteConversionSubmission = async (id: number): Promise<any[]> => {
  await apiFetch(`/conversion.php?id=${id}`, { method: 'DELETE' });
  return getConversionSubmissions();
};

// ============================================================
// Contact Messages
// ============================================================
export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  return apiFetch<ContactMessage[]>('/messages.php');
};

export const addContactMessage = async (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>): Promise<ContactMessage[]> => {
  const newMsg = { ...msg, id: Date.now(), timestamp: new Date().toISOString() };
  await apiFetch('/messages.php', { method: 'POST', body: JSON.stringify(newMsg) });
  return getContactMessages();
};

export const markContactMessageRead = async (id: number): Promise<ContactMessage[]> => {
  await apiFetch('/messages.php', { method: 'PUT', body: JSON.stringify({ id }) });
  return getContactMessages();
};

export const deleteContactMessage = async (id: number): Promise<ContactMessage[]> => {
  await apiFetch(`/messages.php?id=${id}`, { method: 'DELETE' });
  return getContactMessages();
};

export const getUnreadContactCount = async (): Promise<number> => {
  const msgs = await getContactMessages();
  return msgs.filter(m => !m.read).length;
};
