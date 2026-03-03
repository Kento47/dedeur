
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventFlyer } from '../types';
import { getAppSettings } from '../services/authService';
import { ChevronLeft, ChevronRight, ImageIcon, X, ZoomIn } from 'lucide-react';

const EventCarousel: React.FC = () => {
  const [flyers, setFlyers] = useState<EventFlyer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [selectedFlyer, setSelectedFlyer] = useState<EventFlyer | null>(null);

  useEffect(() => {
    // Responsive handler
    const handleResize = () => {
        setItemsPerPage(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);

    // Data loader
    const loadSettings = () => {
        const settings = getAppSettings();
        setFlyers(settings.flyers || []);
    };
    loadSettings();
    window.addEventListener('settings-updated', loadSettings);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('settings-updated', loadSettings);
    };
  }, []);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % flyers.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + flyers.length) % flyers.length);
  };

  // Auto-play (pause if modal is open)
  useEffect(() => {
    if (flyers.length <= itemsPerPage || selectedFlyer) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [flyers.length, itemsPerPage, selectedFlyer]);

  if (flyers.length === 0) return null;

  // Calculate visible items
  const visibleFlyers = [];
  const displayCount = Math.min(itemsPerPage, flyers.length);
  
  for (let i = 0; i < displayCount; i++) {
      const index = (currentIndex + i) % flyers.length;
      visibleFlyers.push(flyers[index]);
  }

  return (
    <div className="w-full bg-slate-900 py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
         <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                <span className="text-brand-red">HIGHLIGHTS</span> & EVENTS
            </h2>
            <div className="w-24 h-1 bg-brand-blue mx-auto mt-4 rounded-full"></div>
         </div>

         <div className="relative max-w-7xl mx-auto">
            <div className="flex gap-6 justify-center">
                <AnimatePresence mode='popLayout'>
                    {visibleFlyers.map((flyer) => (
                        <motion.div
                            key={flyer.id} // Stable key ensures Framer Motion animates the position change (slide effect)
                            layout
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -100, scale: 0.9, transition: { duration: 0.3 } }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={() => setSelectedFlyer(flyer)}
                            className="w-full md:w-[300px] aspect-[105/148] relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 group cursor-zoom-in"
                        >
                            {flyer.imageUrl ? (
                                <img 
                                    src={flyer.imageUrl} 
                                    alt={flyer.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500 gap-4">
                                    <ImageIcon className="w-12 h-12" />
                                    <span className="font-bold text-xl">{flyer.title}</span>
                                </div>
                            )}
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                            
                            {/* Icon hint */}
                            <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <ZoomIn className="w-5 h-5" />
                            </div>

                            {/* Text Content */}
                            <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <h3 className="text-white font-bold text-xl md:text-2xl leading-tight mb-1 shadow-black drop-shadow-md">
                                    {flyer.title}
                                </h3>
                                <div className="w-0 group-hover:w-12 h-1 bg-brand-red transition-all duration-300"></div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            {flyers.length > itemsPerPage && (
                <>
                    <button 
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-brand-red text-white rounded-full backdrop-blur-sm transition-all shadow-lg hover:scale-110 z-20 group"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-brand-red text-white rounded-full backdrop-blur-sm transition-all shadow-lg hover:scale-110 z-20 group"
                    >
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </>
            )}
         </div>
         
         {/* Indicators */}
         <div className="flex justify-center gap-2 mt-8">
            {flyers.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                        (currentIndex % flyers.length) === idx 
                        ? 'w-8 bg-brand-red' 
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                />
            ))}
         </div>
      </div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {selectedFlyer && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedFlyer(null)}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            >
                <button 
                    onClick={() => setSelectedFlyer(null)}
                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-brand-red rounded-full text-white transition-colors z-50"
                >
                    <X className="w-8 h-8" />
                </button>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image area
                >
                    <img 
                        src={selectedFlyer.imageUrl} 
                        alt={selectedFlyer.title} 
                        className="w-full h-full object-contain max-h-[85vh] rounded-lg shadow-2xl"
                    />
                    <div className="mt-4 text-center">
                        <h3 className="text-white font-bold text-2xl font-serif">{selectedFlyer.title}</h3>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventCarousel;
