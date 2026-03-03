
export interface ServiceTime {
  id: string;
  day: string;
  time: string;
  description: string;
}

export type PageId = 'home' | 'about' | 'beliefs' | 'pastor' | 'calendar' | 'media' | 'contact' | 'login' | 'dashboard' | 'forms' | 'churches-suriname' | 'churches-intl' | 'privacy' | 'cookies';

export interface NavItem {
  label: string;
  id?: PageId;
  href?: string;
  children?: NavItem[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  password?: string;
}

export interface VisitorLog {
  id: number;
  date: string;
  serviceType: 'Zondag Ochtend' | 'Zondag Avond' | 'Woensdag' | 'Event';
  men: number;
  women: number;
  children: number;
  newVisitors: number;
  total: number;
  notes?: string;
}

export interface EventFlyer {
  id: string;
  title: string;
  imageUrl: string;
}

export interface MediaItem {
  id: string;
  title: string;
  preacher: string;
  date: string;
  videoUrl: string;
}

export interface PastorSettings {
  name: string;
  title: string;
  imageUrl: string;
  bio: string;
}

export interface Appointment {
  id: number;
  date: string;
  name: string;
  phone: string;
  preferredDate: string;
  reason: string;
  status: 'new' | 'contacted' | 'completed';
}

export interface ChurchItem {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  websiteUrl?: string;
}

export interface BrandingSettings {
  churchName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface HomeSettings {
  welcomeTitle: string;
  mainTitle: string;
  subtitle: string;
  buttonText: string;
}

export interface AboutSettings {
  title: string;
  subtitle: string;
  content: string;
}

export interface BeliefItem {
  id: string;
  title: string;
  description: string;
}

export interface ContactSettings {
  introText: string;
  address: string;
  phone: string;
  email: string;
}

export interface FooterSettings {
  copyrightText: string;
  subText: string;
}

export interface AppSettings {
  branding: BrandingSettings;
  home: HomeSettings;
  about: AboutSettings;
  beliefs: BeliefItem[];
  contact: ContactSettings;
  footer: FooterSettings;
  churchesSuriname: ChurchItem[];
  churchesInternational: ChurchItem[];
  youtubeLink: string;
  flyers: EventFlyer[];
  pastor: PastorSettings;
  recentSermons: MediaItem[];
  serviceTimes: ServiceTime[];
}

export enum SectionId {
  HOME = 'home',
  ABOUT = 'about',
  SERVICES = 'services',
  CONTACT = 'contact',
  GIVING = 'giving',
  MEDIA = 'media'
}
