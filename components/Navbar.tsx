
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User as UserIcon, LogIn, FileText, Globe } from 'lucide-react';
import { NavItem, PageId, User, AppSettings } from '../types';
import { getAppSettings } from '../services/authService';

interface NavbarProps {
  onNavigate: (page: PageId) => void;
  currentPage: PageId;
  user: User | null;
}

const navItems: NavItem[] = [
  { label: 'Home', id: 'home' },
  { 
    label: 'Gemeente', 
    children: [
      { label: 'Over Ons', id: 'about' },
      { label: 'Geloofspunten', id: 'beliefs' },
      { label: 'Leiderschap', id: 'pastor' },
    ]
  },
  {
    label: 'Locaties',
    children: [
      { label: 'Kerken in Suriname', id: 'churches-suriname' },
      { label: 'Internationaal', id: 'churches-intl' },
    ]
  },
  { 
    label: 'Connect', 
    children: [
      { label: 'Agenda', id: 'calendar' },
      { label: 'Media', id: 'media' },
      { label: 'Formulieren', id: 'forms' },
    ]
  },
  { label: 'Contact', id: 'contact' },
];

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const update = () => setSettings(getAppSettings());
    window.addEventListener('settings-updated', update);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('settings-updated', update);
    };
  }, []);

  const handleNavClick = (item: NavItem) => {
    if (item.children) {
      if (window.innerWidth < 768) {
         setActiveDropdown(activeDropdown === item.label ? null : item.label);
      }
    } else if (item.id) {
      onNavigate(item.id);
      setIsOpen(false);
      setActiveDropdown(null);
      window.scrollTo(0, 0);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <button onClick={() => handleNavClick({ label: 'Home', id: 'home' })} className="flex items-center gap-3">
          {settings.branding.logoUrl ? (
              <img 
                src={settings.branding.logoUrl} 
                alt={settings.branding.churchName} 
                className="h-12 md:h-16 w-auto object-contain"
              />
          ) : (
              <span className="text-xl font-bold font-serif text-slate-900">{settings.branding.churchName}</span>
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-1 items-center">
          {navItems.map((item) => (
            <div 
              key={item.label} 
              className="relative group"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                  ${currentPage === item.id 
                    ? 'text-brand-blue bg-blue-50' 
                    : 'text-slate-600 hover:text-brand-blue hover:bg-slate-50'}
                `}
              >
                {item.label}
                {item.children && <ChevronDown className="w-3 h-3 opacity-70" />}
              </button>

              {/* Dropdown */}
              {item.children && (
                <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-200 origin-top-left
                  ${activeDropdown === item.label ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}
                `}>
                  {item.children.map((child) => (
                    <button
                      key={child.label}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavClick(child);
                      }}
                      className="block w-full text-left px-6 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors border-l-2 border-transparent hover:border-brand-blue"
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Login Button */}
          <button
            onClick={() => onNavigate(user ? 'dashboard' : 'login')}
            className={`ml-6 flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all
              ${user 
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 hover:bg-blue-700 hover:-translate-y-0.5'
              }`}
          >
             {user ? <UserIcon className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
             {user ? 'Portal' : 'Login'}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white h-screen overflow-y-auto pb-24 shadow-2xl">
          <div className="flex flex-col p-6 space-y-2">
            {navItems.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => handleNavClick(item)}
                  className="flex items-center justify-between w-full py-4 text-lg text-slate-900 font-bold border-b border-slate-100"
                >
                  {item.label}
                  {item.children && <ChevronDown className={`w-5 h-5 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />}
                </button>
                
                {item.children && activeDropdown === item.label && (
                  <div className="bg-slate-50 pl-6 rounded-lg mt-2 mb-2">
                    {item.children.map((child) => (
                      <button
                        key={child.label}
                        onClick={() => handleNavClick(child)}
                        className="block w-full text-left py-3 text-slate-600 hover:text-brand-blue font-medium"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
             <button
                onClick={() => {
                    onNavigate(user ? 'dashboard' : 'login');
                    setIsOpen(false);
                }}
                className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold bg-brand-blue text-white shadow-xl"
              >
                 {user ? 'Open Portal' : 'Leden Login'}
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
