import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { CoffeeDetails, FlavorRatings } from '../types';

interface CardDisplayProps {
  imageUrl: string | null;
  backgroundColor?: string | null;
  loading: boolean;
  notes: string;
  details: CoffeeDetails;
  ratings?: FlavorRatings;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ imageUrl, backgroundColor, loading, notes, details, ratings }) => {
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

  const renderRatingDots = (value: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className={`w-1.5 h-1.5 rounded-full border border-ink-black ${i <= value ? 'bg-ink-black' : 'bg-transparent'}`} 
          />
        ))}
      </div>
    );
  };

  const getBrewIcon = (method: string) => {
    const m = method.toLowerCase();
    
    // Espresso / Cappuccino (Cup-like)
    if (m.includes('espresso') || m.includes('cappuccino') || m.includes('latte') || m.includes('macchiato') || m.includes('濃縮')) {
      return (
        <svg className="w-6 h-6 text-ink-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8v9a3 3 0 003 3h6a3 3 0 003-3V8H6z" />
          <path d="M6 8h12" />
          <path d="M18 11h3a2 2 0 010 4h-3" />
          <path d="M9 5l-1-2" />
          <path d="M12 5l-1-2" />
          <path d="M15 5l-1-2" />
        </svg>
      );
    }

    // Filter / Pour Over / Drip (V60/Cone-like)
    if (m.includes('filter') || m.includes('pour') || m.includes('drip') || m.includes('chemex') || m.includes('v60') || m.includes('手沖')) {
      return (
        <svg className="w-6 h-6 text-ink-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6l8 14 8-14H4z" />
          <path d="M2 6h20" />
          <path d="M12 20v2" />
          <line x1="8" y1="12" x2="16" y2="12" strokeDasharray="1 3" />
        </svg>
      );
    }

    // Iced / Cold Brew (Tall glass with straw)
    if (m.includes('iced') || m.includes('cold') || m.includes('frappe') || m.includes('冰')) {
      return (
        <svg className="w-6 h-6 text-ink-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 21h10V8H7v13z" />
          <path d="M13 2l-2 20" />
          <path d="M8 14l2 2" />
          <path d="M14 18l2-2" />
        </svg>
      );
    }
    
    // Default Mug
    return (
      <svg className="w-6 h-6 text-ink-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
        <path d="M19 8h2a2 2 0 010 4h-2" />
        <path d="M4 8h16" />
        <path d="M9 4v2" />
        <path d="M15 4v2" />
      </svg>
    );
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
          className={`relative p-4 transition-all duration-500 transform ${loading ? 'animate-scribble' : 'rotate-1'}`}
          style={{
            backgroundColor: '#fdfbf7', // Fixed to warm white
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
               <h3 className="font-hand text-xl font-bold text-ink-black break-words flex-1 leading-none">
                 {details.beanName || "Mystery Bean"}
               </h3>
               {/* Display Brewing Method here if layout requires, but sticking to current layout for now */}
             </div>

             {/* Sub-header: Roaster */}
             {details.roaster && (
               <div className="font-hand text-sm text-gray-500 mb-2 -mt-1 italic">
                 by {details.roaster}
               </div>
             )}

             {/* Grid Details (Headers updated to font-hand-safe [Patrick Hand] and uppercase abbreviations) */}
             <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm font-hand mb-3">
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-16 flex-shrink-0 text-[10px] uppercase tracking-wider">ORIGIN</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight">{details.origin || "—"}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-16 flex-shrink-0 text-[10px] uppercase tracking-wider">ELEV</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight">{details.elevation || "—"}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-16 flex-shrink-0 text-[10px] uppercase tracking-wider">PROC</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight">{details.processMethod || "—"}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-16 flex-shrink-0 text-[10px] uppercase tracking-wider">ROAST</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight">{details.roastLevel || "—"}</span>
                </div>
             </div>

             {/* Ratings Grid (Headers updated) */}
             {ratings && (
               <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 pt-1 border-t border-dotted border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-hand-safe text-[10px] text-gray-500 uppercase">SWEET</span>
                    {renderRatingDots(ratings.sweetness)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-hand-safe text-[10px] text-gray-500 uppercase">ACIDITY</span>
                    {renderRatingDots(ratings.acidity)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-hand-safe text-[10px] text-gray-500 uppercase">BITTER</span>
                    {renderRatingDots(ratings.bitterness)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-hand-safe text-[10px] text-gray-500 uppercase">BODY</span>
                    {renderRatingDots(ratings.body)}
                  </div>
               </div>
             )}
             
             {/* Brewing Method Row */}
             {details.brewingMethod && (
               <div className="flex items-center gap-2 mb-2 pt-1 border-t border-dotted border-gray-200">
                 <div className="flex-shrink-0 opacity-80">
                   {getBrewIcon(details.brewingMethod)}
                 </div>
                 <span className="font-hand text-base text-ink-black leading-tight">
                   {details.brewingMethod}
                 </span>
               </div>
             )}

             {/* Flavor Notes Footer */}
             <div className="bg-yellow-50/50 p-2 rounded border border-yellow-100">
               <span className="font-hand-safe text-[10px] text-gray-400 uppercase tracking-widest block mb-1">TASTING NOTES</span>
               <p className="font-hand text-base leading-tight text-ink-black break-words">
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