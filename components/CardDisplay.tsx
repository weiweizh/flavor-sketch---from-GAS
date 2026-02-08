import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { CoffeeDetails } from '../types';

interface CardDisplayProps {
  imageUrl: string | null;
  loading: boolean;
  notes: string;
  details: CoffeeDetails;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ imageUrl, loading, notes, details }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || !imageUrl) return;
    setDownloading(true);
    try {
      // Small timeout to allow state updates if any and ensure fonts/images are ready
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Increased scale for better text clarity
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${(details.beanName || 'flavor-card').replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Oops! Could not download the card.");
    } finally {
      setDownloading(false);
    }
  };

  if (!imageUrl && !loading) {
    return (
      <div className="w-full max-w-sm aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto opacity-50">
        <span className="font-hand-safe text-xl text-gray-400">Your record card will appear here</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[340px] mx-auto perspective-1000 group">
        
        {/* The Record Card (Capture Target) */}
        <div 
          id="flavor-card-capture"
          ref={cardRef}
          className={`relative bg-warm-white p-4 transition-all duration-500 transform ${loading ? 'animate-scribble' : 'rotate-1'}`}
          style={{
            boxShadow: '8px 8px 15px rgba(0,0,0,0.15)',
            borderRadius: '2px',
            border: '1px solid #e5e5e5'
          }}
        >
          {/* Tape effect */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-100 opacity-80 rotate-[-2deg] z-10" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}></div>

          {/* Image Container */}
          <div className="aspect-square w-full bg-gray-50 overflow-hidden relative border border-ink-black rounded-sm mb-4">
             {loading ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-warm-white">
                  <svg className="w-16 h-16 text-ink-black animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-4 font-hand text-xl animate-pulse">Brewing art...</p>
               </div>
             ) : (
               <img 
                 src={imageUrl!} 
                 alt={notes} 
                 className="w-full h-full object-cover filter contrast-105"
                 crossOrigin="anonymous" 
               />
             )}
          </div>

          {/* Record Details / Sticker Area */}
          <div className="border-t-2 border-dotted border-gray-300 pt-3">
             {/* Header: Name */}
             <div className="flex justify-between items-baseline mb-2">
               <h3 className="font-hand text-2xl font-bold text-ink-black break-words mr-2 flex-1 leading-none">
                 {details.beanName || "Mystery Bean"}
               </h3>
               <span className="font-hand-safe text-xs text-gray-400 whitespace-nowrap">
                 #{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}
               </span>
             </div>

             {/* Grid Details */}
             <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm font-hand mb-3">
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-12 flex-shrink-0 text-xs uppercase tracking-wider">Origin</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight">{details.origin || "—"}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-10 flex-shrink-0 text-xs uppercase tracking-wider">Elev</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight">{details.elevation || "—"}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-12 flex-shrink-0 text-xs uppercase tracking-wider">Proc</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight">{details.processMethod || "—"}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-10 flex-shrink-0 text-xs uppercase tracking-wider">Roast</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight">{details.roastLevel || "—"}</span>
                </div>
             </div>

             {/* Flavor Notes Footer */}
             <div className="bg-yellow-50/50 p-2 rounded border border-yellow-100">
               <span className="font-hand-safe text-xs text-gray-400 uppercase tracking-widest block mb-1">Tasting Notes</span>
               <p className="font-hand text-lg leading-tight text-ink-black break-words">
                 {notes || "..."}
               </p>
             </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        {!loading && imageUrl && (
          <div className="absolute -bottom-6 -right-6 w-12 h-12 border-2 border-dashed border-ink-black rounded-full opacity-10 pointer-events-none rotate-12"></div>
        )}
      </div>

      {/* Action Buttons */}
      {!loading && imageUrl && (
        <div className="mt-8">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 font-hand text-xl px-6 py-2 bg-transparent border-2 border-ink-black rounded-full hover:bg-ink-black hover:text-white transition-all disabled:opacity-50"
          >
            {downloading ? (
              <span>Saving...</span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Save Record Card
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};