import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Download, ChevronDown, ChevronRight,
  Palette, Home, Info, Book, Clock, Map, Globe2, Calendar,
  Mail, Layout, Image as ImageIcon, Youtube, Video, Users,
  BarChart3, MessageCircle, User as UserIcon, CheckCircle2,
  Play, Lightbulb, AlertTriangle, FileText, Printer, ExternalLink,
  Star, Eye, ArrowUp, Check, X
} from 'lucide-react';

interface DocSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  color: string;
  parts: DocPart[];
  videoUrl?: string;
}

interface DocPart {
  id: string;
  title: string;
  goal: string;
  steps: DocStep[];
  tips?: string[];
  warnings?: string[];
  videoUrl?: string;
}

interface DocStep {
  num: number;
  text: string;
  screenshot?: string;
  note?: string;
}

const DOC_SECTIONS: DocSection[] = [
  {
    id: 'website-editor',
    icon: <Palette className="w-5 h-5" />,
    title: 'Website Editor',
    color: 'blue',
    videoUrl: '',
    parts: [
      {
        id: 'branding',
        title: 'Branding & Logo',
        goal: 'Pas de naam van de kerk, het logo en de kleuren van de website aan.',
        videoUrl: '',
        steps: [
          { num: 1, text: 'Klik op "Website Editor" in het linker menu.', screenshot: '/docs/screenshots/branding-1.png' },
          { num: 2, text: 'Kies "Branding & Logo" uit het dropdown menu bovenaan.', screenshot: '/docs/screenshots/branding-2.png' },
          { num: 3, text: 'Vul de naam van de kerk in bij "Naam Kerk".', note: 'Dit is de naam die overal op de website zichtbaar is.' },
          { num: 4, text: 'Klik op het kleurvlak bij "Primaire Kleur" om de hoofdkleur te kiezen.', screenshot: '/docs/screenshots/branding-4.png' },
          { num: 5, text: 'Klik op het kleurvlak bij "Accent Kleur" om de tweede kleur in te stellen.' },
          { num: 6, text: 'Voer een Logo URL in, of klik op "Upload" om een afbeelding van je computer te uploaden.', note: 'Beste formaat: PNG met transparante achtergrond, minimaal 200x200 pixels.' },
          { num: 7, text: 'Klik op "Alles Opslaan" om de wijzigingen door te voeren.' },
        ],
        tips: [
          'Gebruik een PNG formaat voor het logo zodat de achtergrond transparant is.',
          'Kies kleuren die goed leesbaar zijn — test op zowel lichte als donkere achtergronden.',
        ],
        warnings: [
          'Na het opslaan duurt het even voor de website-cache zich vernieuwt. Ververs de pagina als je de wijzigingen niet ziet.',
        ],
      },
      {
        id: 'home-text',
        title: 'Homepagina Teksten',
        goal: 'Bewerk de teksten op de hoofdpagina van de website: welkomsttekst, hoofdtitel en ondertitel.',
        videoUrl: '',
        steps: [
          { num: 1, text: 'Ga naar "Website Editor" → kies "Homepagina Teksten".' },
          { num: 2, text: 'Pas "Welkom Label" aan (bijv. "Welkom bij" of "God\'s Huis").', note: 'Dit verschijnt als klein label boven de hoofdtitel.' },
          { num: 3, text: 'Pas de "Hoofdtitel" aan — dit is de grote tekst die bezoekers als eerste zien.' },
          { num: 4, text: 'Voer een ondertitel in in het tekstveld "Ondertitel".', note: 'Houd het kort: 1 à 2 zinnen werkt het beste.' },
          { num: 5, text: 'Klik op "Alles Opslaan".' },
        ],
        tips: ['Houd de hoofdtitel onder de 10 woorden voor de beste weergave op mobiel.'],
      },
      {
        id: 'about',
        title: 'Over Ons Sectie',
        goal: 'Bewerk de "Over Ons" sectie van de website met een titel, ondertitel en langere tekst.',
        steps: [
          { num: 1, text: 'Ga naar "Website Editor" → kies "Over Ons Sectie".' },
          { num: 2, text: 'Voer de sectietitel in bij "Titel".' },
          { num: 3, text: 'Voer een korte samenvatting in bij "Ondertitel".' },
          { num: 4, text: 'Schrijf of plak de volledige tekst in het grote "Inhoud" veld.' },
          { num: 5, text: 'Klik op "Alles Opslaan".' },
        ],
        tips: ["Gebruik duidelijke alinea's met witregel ertussen voor de leesbaarheid."],
      },
      {
        id: 'beliefs',
        title: 'Geloofspunten Beheren',
        goal: 'Voeg geloofspunten toe aan de website of verwijder bestaande punten.',
        steps: [
          { num: 1, text: 'Ga naar "Website Editor" → kies "Geloofspunten".' },
          { num: 2, text: 'Bestaande geloofspunten zijn zichtbaar als kaarten. Klik op het prullenbak-icoon om er één te verwijderen.' },
          { num: 3, text: 'Vul bij "Titel" de naam van het geloofspunt in (bijv. "De Bijbel als Gods Woord").' },
          { num: 4, text: 'Voer een beschrijving in bij het tekstveld eronder.' },
          { num: 5, text: 'Klik op "Geloofspunt Toevoegen".' },
          { num: 6, text: 'Klik op "Alles Opslaan" bovenaan om alles definitief op te slaan.' },
        ],
        tips: ['Houd beschrijvingen kort — 1 à 3 zinnen is ideaal voor de website.'],
        warnings: ['Vergeet niet op "Alles Opslaan" te klikken na het toevoegen!'],
      },
      {
        id: 'services',
        title: 'Diensttijden Beheren',
        goal: 'Voeg diensten toe, bewerk tijden en verander de volgorde via drag-and-drop.',
        steps: [
          { num: 1, text: 'Ga naar "Website Editor" → kies "Diensttijden Beheer".' },
          { num: 2, text: 'Bestaande diensten zijn zichtbaar als kaarten met dag en tijd.' },
          { num: 3, text: 'BEWERKEN: Hover over een kaart → klik op het potlood-icoon rechts bovenaan de kaart.' },
          { num: 4, text: 'Pas de dag, tijd en omschrijving aan in de bewerkingsvelden die verschijnen.' },
          { num: 5, text: 'VOLGORDE: Klik en sleep een kaart naar een andere positie om de volgorde te veranderen.', note: 'Een grip-icoon links bovenaan elke kaart geeft aan dat je het kunt slepen.' },
          { num: 6, text: 'TOEVOEGEN: Vul onderin "Dag", "Tijd" en "Omschrijving" in bij "Nieuwe Dienst".' },
          { num: 7, text: 'Klik op "Toevoegen" en daarna op "Alles Opslaan".' },
        ],
        tips: ['Vul "Tijd" in als bijv. "10:00" of "10:00 AM" voor consistente weergave.'],
      },
      {
        id: 'churches',
        title: 'Kerken Suriname & Internationaal',
        goal: 'Beheer de lijst van aangesloten kerken in Suriname en internationaal.',
        steps: [
          { num: 1, text: 'Ga naar "Website Editor" → kies "Kerken Suriname" of "Internationaal Netwerk".' },
          { num: 2, text: 'Bestaande kerken zijn zichtbaar met foto en locatie.' },
          { num: 3, text: 'Vul "Naam" in bij het invoerveld.' },
          { num: 4, text: 'Vul "Locatie" in (stad, land).' },
          { num: 5, text: 'Voeg een afbeelding toe via URL of via de "Upload" knop.' },
          { num: 6, text: 'Klik op "Toevoegen aan lijst".' },
          { num: 7, text: 'Klik op "Alles Opslaan".' },
        ],
        tips: ['Gebruik een foto van de buitenkant van de kerk — formaat 4:3 werkt het best.'],
      },
      {
        id: 'contact',
        title: 'Contactgegevens',
        goal: 'Pas het adres, telefoonnummer, e-mailadres en de intro-tekst van de contactpagina aan.',
        steps: [
          { num: 1, text: 'Ga naar "Website Editor" → kies "Contactgegevens".' },
          { num: 2, text: 'Bewerk de "Intro Tekst" — dit is de welkomsttekst op de contactpagina.' },
          { num: 3, text: 'Vul het kerkadres in bij "Adres".' },
          { num: 4, text: 'Vul het telefoonnummer in bij "Telefoon".' },
          { num: 5, text: 'Vul het e-mailadres in bij "E-mail".' },
          { num: 6, text: 'Klik op "Alles Opslaan".' },
        ],
      },
      {
        id: 'footer',
        title: 'Footer Instellingen',
        goal: 'Pas de copyright-tekst en extra tekst onderaan de website aan.',
        steps: [
          { num: 1, text: 'Ga naar "Website Editor" → kies "Footer Instellingen".' },
          { num: 2, text: 'Pas "Copyright Tekst" aan (bijv. "© 2025 De Deur Lelydorp").' },
          { num: 3, text: 'Voeg optioneel extra tekst toe bij "Extra Tekst".' },
          { num: 4, text: 'Klik op "Alles Opslaan".' },
        ],
      },
    ],
  },
  {
    id: 'media-events',
    icon: <ImageIcon className="w-5 h-5" />,
    title: 'Media & Events',
    color: 'purple',
    videoUrl: '',
    parts: [
      {
        id: 'livestream',
        title: 'Livestream Link Instellen',
        goal: 'Koppel een YouTube livestream aan de website zodat bezoekers live kunnen meekijken.',
        steps: [
          { num: 1, text: 'Klik op "Media & Events" in het linker menu.' },
          { num: 2, text: 'Scroll naar de sectie "Livestream Link".' },
          { num: 3, text: 'Ga naar YouTube → open de live video → klik op "Delen" → "Insluiten".' },
          { num: 4, text: 'Kopieer de URL uit de iframe code (bijv. https://www.youtube.com/embed/XXXXX).', note: 'Kopieer alleen de URL, niet de volledige iframe code.' },
          { num: 5, text: 'Plak de URL in het "Embed URL" veld.' },
          { num: 6, text: 'Klik op "Opslaan".' },
        ],
        tips: ['Je kunt ook een gewone YouTube video URL invullen — de website converteert dit automatisch.'],
        warnings: ['Zorg dat de YouTube video op "Openbaar" staat, anders is de livestream niet zichtbaar.'],
      },
      {
        id: 'flyers',
        title: 'Flyers Uploaden (Carrousel)',
        goal: 'Voeg evenement-flyers toe aan de carrousel op de website.',
        steps: [
          { num: 1, text: 'Ga naar "Media & Events" → scroll naar "Highlights (Flyer Carrousel)".' },
          { num: 2, text: 'Bestaande flyers zijn zichtbaar als afbeeldingen. Hover over een flyer → klik "Verwijderen" om te wissen.' },
          { num: 3, text: 'Vul de evenementnaam in bij "Titel Event".' },
          { num: 4, text: 'Klik op "Upload" om een afbeelding van je computer te kiezen, of vul een URL in.' },
          { num: 5, text: 'Een voorbeeld van de afbeelding is zichtbaar na selectie.', note: 'Controleer of de afbeelding goed eruitziet voor je opslaat.' },
          { num: 6, text: 'Klik op "Toevoegen aan Carrousel".' },
        ],
        tips: ['Beste beeldverhouding: 3:4 (staand formaat) voor flyers.', 'Maximale bestandsgrootte: 5MB per afbeelding voor snelle laadtijden.'],
      },
      {
        id: 'videos',
        title: "Recente Video's Toevoegen",
        goal: "Publiceer recente preken en video's die zichtbaar zijn op de website.",
        steps: [
          { num: 1, text: 'Ga naar "Media & Events" → scroll naar "Recente Video\'s".' },
          { num: 2, text: 'Bestaande video\'s zijn zichtbaar in een lijst. Gebruik het prullenbak-icoon om te verwijderen.' },
          { num: 3, text: 'Vul de preektitel in bij "Titel".' },
          { num: 4, text: 'Vul de naam van de spreker in bij "Spreker".' },
          { num: 5, text: 'Plak de YouTube Embed URL in bij "YouTube Embed URL".' },
          { num: 6, text: 'Klik op "Video Publiceren".' },
        ],
        tips: ['YouTube Embed URL formaat: https://www.youtube.com/embed/VIDEO_ID'],
        warnings: ["De video moet op YouTube staan — directe videobestanden worden niet ondersteund."],
      },
    ],
  },
  {
    id: 'agenda',
    icon: <Calendar className="w-5 h-5" />,
    title: 'Agenda Overzicht',
    color: 'green',
    parts: [
      {
        id: 'calendar-view',
        title: 'Agenda Bekijken',
        goal: 'Bekijk de live kerkagenda direct in het beheerpaneel.',
        steps: [
          { num: 1, text: 'Klik op "Agenda Overzicht" in het linker menu.' },
          { num: 2, text: 'De live agenda is direct zichtbaar in de pagina.' },
          { num: 3, text: 'Gebruik de navigatieknoppen in de agenda om door maanden te scrollen.' },
        ],
        tips: ['De agenda wordt gevoed vanuit Google Calendar. Wijzigingen in Google Calendar zijn direct zichtbaar.'],
      },
      {
        id: 'agenda-embed',
        title: 'Agenda Embed Code Instellen',
        goal: 'Koppel een andere Google Calendar of agenda-dienst via een embed code.',
        steps: [
          { num: 1, text: 'Ga naar "Website Editor" → kies "Agenda Embed".' },
          { num: 2, text: 'Open je Google Calendar → Instellingen → kies de agenda → scroll naar "Integreer agenda".' },
          { num: 3, text: 'Kopieer de volledige iframe code.' },
          { num: 4, text: 'Plak de code in het tekstgebied in het beheerpaneel.' },
          { num: 5, text: 'Klik op "Alles Opslaan".' },
        ],
        tips: ['Zorg dat de Google Calendar op "Openbaar" staat zodat iedereen de agenda kan zien.'],
      },
    ],
  },
  {
    id: 'responses',
    icon: <MessageCircle className="w-5 h-5" />,
    title: 'Inzendingen',
    color: 'orange',
    parts: [
      {
        id: 'prayer',
        title: 'Gebedsverzoeken Beheren',
        goal: 'Bekijk en beheer ingestuurde gebedsverzoeken van website bezoekers.',
        steps: [
          { num: 1, text: 'Klik op "Inzendingen" in het linker menu.' },
          { num: 2, text: 'Klik op het tabblad "Gebedsverzoeken" bovenaan.' },
          { num: 3, text: 'Elk verzoek toont: datum, type, naam, telefoon en de boodschap.' },
          { num: 4, text: 'Hover over een kaart → klik op het prullenbak-icoon om een verzoek te verwijderen.', note: 'Er verschijnt een bevestigingsprompt voor verwijdering.' },
          { num: 5, text: 'Klik op "Export" bovenaan om alle verzoeken als CSV-bestand te downloaden.' },
        ],
        tips: ['Exporteer regelmatig naar CSV om een archief bij te houden.'],
      },
      {
        id: 'conversions',
        title: 'Bekeerlingen Registraties',
        goal: "Bekijk nieuwe bekeerlingen die zich via de website hebben aangemeld.",
        steps: [
          { num: 1, text: 'Ga naar "Inzendingen" → klik op tabblad "Bekeerlingen".' },
          { num: 2, text: 'Elk record toont: naam, telefoon, adres, werker en extra informatie.' },
          { num: 3, text: 'Controleer de badges "Ophalen" en "Contact opnemen" voor actievereisten.' },
          { num: 4, text: 'Verwijder verwerkte records via het prullenbak-icoon.' },
          { num: 5, text: 'Exporteer alle data via de "Export" knop.' },
        ],
        tips: ['Verwerk bekeerlingen zo snel mogelijk — de "Contact opnemen" badge vraagt om actie.'],
      },
      {
        id: 'appointments',
        title: 'Afspraakverzoeken Behandelen',
        goal: 'Bekijk en verwerk afspraakverzoeken van bezoekers met de pastor.',
        steps: [
          { num: 1, text: 'Ga naar "Inzendingen" → klik op tabblad "Afspraken".' },
          { num: 2, text: 'Elke afspraak heeft een status indicator: Blauw = Nieuw, Oranje = Gecontacteerd, Groen = Voltooid.' },
          { num: 3, text: 'Hover over een kaart → gebruik het dropdown menu om de status te wijzigen.' },
          { num: 4, text: 'Wijzig de status van "Nieuw" naar "Gecontacteerd" nadat je contact hebt opgenomen.' },
          { num: 5, text: 'Wijzig naar "Voltooid" nadat de afspraak heeft plaatsgevonden.' },
          { num: 6, text: 'Verwijder afsloten afspraken via het prullenbak-icoon.' },
        ],
        tips: ['Verwerk nieuwe afspraken (blauw knipperend stipje) als eerste prioriteit.'],
      },
    ],
  },
  {
    id: 'statistics',
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Statistieken',
    color: 'teal',
    parts: [
      {
        id: 'visitor-log',
        title: 'Bezoekers Loggen',
        goal: 'Registreer het aantal bezoekers per dienst voor statistieken.',
        steps: [
          { num: 1, text: 'Klik op "Statistieken" in het linker menu.' },
          { num: 2, text: 'Bestaande logs zijn zichtbaar in de tabel bovenaan (datum, mannen, vrouwen, kinderen, totaal).' },
          { num: 3, text: 'Scroll naar "Log Toevoegen" onderaan.' },
          { num: 4, text: 'Vul het aantal mannen, vrouwen en kinderen in.' },
          { num: 5, text: 'Klik op "Opslaan".' },
          { num: 6, text: 'Het totaal wordt automatisch berekend en in de tabel toegevoegd.' },
        ],
        tips: ['Log direct na iedere dienst voor de meest nauwkeurige statistieken.'],
      },
    ],
  },
  {
    id: 'users',
    icon: <Users className="w-5 h-5" />,
    title: 'Gebruikers Beheer',
    color: 'slate',
    parts: [
      {
        id: 'user-management',
        title: 'Gebruikers Toevoegen & Verwijderen',
        goal: 'Beheer wie toegang heeft tot het beheerpaneel.',
        steps: [
          { num: 1, text: 'Klik op "Gebruikers" in het linker menu.' },
          { num: 2, text: 'Bestaande gebruikers zijn zichtbaar met naam, e-mail en rol.' },
          { num: 3, text: 'Om een gebruiker te verwijderen → klik op het prullenbak-icoon naast de gebruiker.', note: 'Verwijder nooit je eigen admin-account!' },
          { num: 4, text: 'Vul de naam in bij het "Naam" invoerveld.' },
          { num: 5, text: 'Vul het e-mailadres in.' },
          { num: 6, text: 'Kies de rol: "admin" (volledige toegang) of "user" (beperkte toegang).' },
          { num: 7, text: 'Vul een wachtwoord in.' },
          { num: 8, text: 'Klik op "Gebruiker Toevoegen".' },
        ],
        warnings: [
          'Admins hebben volledige toegang tot alle functies. Geef deze rol alleen aan vertrouwde mensen.',
          'Verwijder nooit je eigen account — je verliest dan de toegang tot het panel.',
        ],
      },
    ],
  },
  {
    id: 'pastor',
    icon: <UserIcon className="w-5 h-5" />,
    title: 'Pastor Info',
    color: 'red',
    parts: [
      {
        id: 'pastor-edit',
        title: 'Pastor Informatie Bijwerken',
        goal: 'Bewerk de naam, biografie en profielfoto van de pastor op de website.',
        steps: [
          { num: 1, text: 'Klik op "Pastor Info" in het linker menu.' },
          { num: 2, text: 'De huidige foto is zichtbaar links — klik op "Foto wijzigen" om een nieuwe te uploaden.' },
          { num: 3, text: 'Selecteer een afbeelding van je computer (JPG of PNG).', note: 'Beste formaat: vierkante foto, minimaal 400x400 pixels.' },
          { num: 4, text: 'Bewerk de naam van de pastor bij "Naam Pastor".' },
          { num: 5, text: 'Schrijf of pas de biografie aan in het "Biografie" tekstveld.' },
          { num: 6, text: 'Klik op "Opslaan" rechtsonder.' },
        ],
        tips: ['Gebruik een professionele foto op neutrale achtergrond voor de beste weergave.'],
      },
    ],
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   badge: 'bg-blue-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-600' },
  green:  { bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',badge: 'bg-emerald-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-600' },
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   badge: 'bg-teal-600' },
  slate:  { bg: 'bg-slate-100', text: 'text-slate-700',  border: 'border-slate-300',  badge: 'bg-slate-600' },
  red:    { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    badge: 'bg-red-600' },
};

const DocumentationPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ 'website-editor': true });
  const [openParts, setOpenParts] = useState<Record<string, boolean>>({ 'branding': true });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePart = (id: string) => {
    setOpenParts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  React.useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredSections = search.trim() === ''
    ? DOC_SECTIONS
    : DOC_SECTIONS.map(section => ({
        ...section,
        parts: section.parts.filter(part =>
          part.title.toLowerCase().includes(search.toLowerCase()) ||
          part.goal.toLowerCase().includes(search.toLowerCase()) ||
          part.steps.some(s => s.text.toLowerCase().includes(search.toLowerCase()))
        ),
      })).filter(section => section.parts.length > 0);

  const handlePrint = () => {
    window.print();
  };

  const handlePdfDownload = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 15;
      const maxW = pageW - margin * 2;
      let y = 20;

      const addPage = () => { doc.addPage(); y = 20; };
      const checkY = (needed: number) => { if (y + needed > 270) addPage(); };

      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Beheerpaneel Handleiding', margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`De Deur Lelydorp — Gegenereerd op ${new Date().toLocaleDateString('nl-NL')}`, margin, y);
      y += 14;

      for (const section of DOC_SECTIONS) {
        checkY(20);
        doc.setFillColor(30, 41, 59);
        doc.roundedRect(margin, y, maxW, 10, 2, 2, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(section.title, margin + 4, y + 7);
        y += 16;

        for (const part of section.parts) {
          checkY(16);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 64, 175);
          doc.text(part.title, margin + 2, y);
          y += 5;
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(71, 85, 105);
          const goalLines = doc.splitTextToSize(`Doel: ${part.goal}`, maxW - 4);
          checkY(goalLines.length * 4 + 4);
          doc.text(goalLines, margin + 4, y);
          y += goalLines.length * 4 + 4;

          for (const step of part.steps) {
            const stepText = `${step.num}. ${step.text}`;
            const lines = doc.splitTextToSize(stepText, maxW - 10);
            checkY(lines.length * 4 + 3);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(15, 23, 42);
            doc.text(lines, margin + 8, y);
            y += lines.length * 4;
            if (step.note) {
              const noteLines = doc.splitTextToSize(`   → ${step.note}`, maxW - 12);
              checkY(noteLines.length * 4);
              doc.setTextColor(234, 88, 12);
              doc.setFont('helvetica', 'italic');
              doc.text(noteLines, margin + 10, y);
              y += noteLines.length * 4;
              doc.setTextColor(15, 23, 42);
            }
            y += 1;
          }

          if (part.tips && part.tips.length > 0) {
            checkY(6 + part.tips.length * 5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(5, 150, 105);
            doc.text('Tip:', margin + 4, y);
            y += 4;
            for (const tip of part.tips) {
              doc.setFont('helvetica', 'normal');
              const tipLines = doc.splitTextToSize(`• ${tip}`, maxW - 8);
              doc.text(tipLines, margin + 6, y);
              y += tipLines.length * 4 + 1;
            }
          }

          if (part.warnings && part.warnings.length > 0) {
            checkY(6 + part.warnings.length * 5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(220, 38, 38);
            doc.text('Let op:', margin + 4, y);
            y += 4;
            for (const w of part.warnings) {
              doc.setFont('helvetica', 'normal');
              const wLines = doc.splitTextToSize(`⚠ ${w}`, maxW - 8);
              doc.text(wLines, margin + 6, y);
              y += wLines.length * 4 + 1;
            }
          }
          y += 6;
        }
        y += 4;
      }

      doc.save('beheerpaneel-handleiding.pdf');
    } catch (err) {
      alert('PDF genereren mislukt. Probeer de print-functie als alternatief.');
    }
  };

  return (
    <div ref={contentRef} className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/10 rounded-xl"><BookOpen className="w-6 h-6" /></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Handleiding</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Beheerpaneel Documentatie</h2>
            <p className="text-slate-300 text-sm">Stap-voor-stap instructies voor alle functies van het beheerpaneel.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handlePdfDownload} className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg">
              <Download className="w-4 h-4" /> PDF Download
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-colors">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Secties', value: DOC_SECTIONS.length },
            { label: 'Onderdelen', value: DOC_SECTIONS.reduce((a, s) => a + s.parts.length, 0) },
            { label: 'Instructies', value: DOC_SECTIONS.reduce((a, s) => a + s.parts.reduce((b, p) => b + p.steps.length, 0), 0) },
            { label: 'Tips', value: DOC_SECTIONS.reduce((a, s) => a + s.parts.reduce((b, p) => b + (p.tips?.length || 0), 0), 0) },
          ].map(stat => (
            <div key={stat.label} className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-slate-300 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="Zoek in de handleiding... (bijv. logo, flyer, gebruiker)"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {search && (
          <p className="text-xs text-slate-500 mt-2 ml-1">
            {filteredSections.reduce((a, s) => a + s.parts.length, 0)} resultaten gevonden voor "{search}"
          </p>
        )}
      </div>

      {/* Sections */}
      {filteredSections.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-bold text-slate-500">Geen resultaten gevonden</p>
          <p className="text-sm">Probeer een ander zoekwoord.</p>
        </div>
      )}

      {filteredSections.map(section => {
        const colors = COLOR_MAP[section.color] || COLOR_MAP.blue;
        const isOpen = !!openSections[section.id];
        return (
          <div key={section.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Section header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text}`}>{section.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{section.title}</h3>
                  <p className="text-xs text-slate-400">{section.parts.length} onderdelen</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                    {section.parts.map(part => {
                      const isPartOpen = !!openParts[part.id];
                      return (
                        <div key={part.id} className={`rounded-xl border ${colors.border} overflow-hidden`}>
                          {/* Part header */}
                          <button
                            onClick={() => togglePart(part.id)}
                            className={`w-full flex items-center justify-between px-5 py-4 ${colors.bg} hover:opacity-90 transition-opacity text-left`}
                          >
                            <div className="flex items-center gap-3">
                              <ChevronRight className={`w-4 h-4 ${colors.text} transition-transform ${isPartOpen ? 'rotate-90' : ''}`} />
                              <span className={`font-bold text-sm ${colors.text}`}>{part.title}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{part.steps.length} stappen</span>
                          </button>

                          <AnimatePresence initial={false}>
                            {isPartOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-5 space-y-5">
                                  {/* Goal */}
                                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <Eye className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Doel</span>
                                      <p className="text-sm text-slate-600">{part.goal}</p>
                                    </div>
                                  </div>

                                  {/* Video tutorial placeholder */}
                                  {part.videoUrl !== undefined && (
                                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 flex items-center gap-4">
                                      <div className="p-3 bg-red-100 rounded-xl text-red-600 shrink-0"><Play className="w-5 h-5" /></div>
                                      <div className="flex-1">
                                        <p className="font-bold text-sm text-slate-700">Video Tutorial</p>
                                        {part.videoUrl ? (
                                          <a href={part.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                                            Bekijk video <ExternalLink className="w-3 h-3" />
                                          </a>
                                        ) : (
                                          <p className="text-xs text-slate-400">Video tutorial wordt binnenkort toegevoegd.</p>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Steps */}
                                  <div className="space-y-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stap voor stap</p>
                                    {part.steps.map(step => (
                                      <div key={step.num} className="flex gap-4">
                                        <div className={`shrink-0 w-7 h-7 rounded-full ${colors.badge} text-white text-xs font-bold flex items-center justify-center mt-0.5`}>
                                          {step.num}
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm text-slate-700 leading-relaxed">{step.text}</p>
                                          {step.note && (
                                            <p className="mt-1 text-xs text-orange-600 bg-orange-50 border border-orange-100 rounded-lg px-3 py-1.5 flex items-start gap-1.5">
                                              <Lightbulb className="w-3 h-3 mt-0.5 shrink-0" /> {step.note}
                                            </p>
                                          )}
                                          {step.screenshot && (
                                            <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                              <img
                                                src={step.screenshot}
                                                alt={`Stap ${step.num} screenshot`}
                                                className="w-full object-cover max-h-52"
                                                onError={e => {
                                                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                  (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                                                }}
                                              />
                                              <div className="hidden items-center justify-center h-24 text-slate-400 text-xs gap-2">
                                                <ImageIcon className="w-4 h-4" /> Screenshot wordt binnenkort toegevoegd
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Tips */}
                                  {part.tips && part.tips.length > 0 && (
                                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Tips
                                      </p>
                                      {part.tips.map((tip, i) => (
                                        <p key={i} className="text-sm text-emerald-800 flex items-start gap-2">
                                          <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400" /> {tip}
                                        </p>
                                      ))}
                                    </div>
                                  )}

                                  {/* Warnings */}
                                  {part.warnings && part.warnings.length > 0 && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-2">
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                                        <AlertTriangle className="w-3.5 h-3.5" /> Let op
                                      </p>
                                      {part.warnings.map((w, i) => (
                                        <p key={i} className="text-sm text-red-800 flex items-start gap-2">
                                          <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" /> {w}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-3 bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-700 transition-colors z-50"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentationPage;
