import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { CoffeeDetails, FlavorRatings } from '../types';
import { FlavorCardButton } from './FlavorCardButton';

interface CardDisplayProps {
  id?: string;
  imageUrl: string | null;
  backgroundColor?: string | null;
  loading: boolean;
  notes: string;
  details: CoffeeDetails;
  ratings?: FlavorRatings;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ id, imageUrl, backgroundColor, loading, notes, details, ratings }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Generate today's date in YYYY.MM.DD format
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

  const handleDownload = async () => {
    if (!cardRef.current || !imageUrl) return;
    setDownloading(true);
    try {
      // Small timeout to allow state updates if any and ensure fonts/images are ready
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `${(details.beanName || 'flavor-card').replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Oops! Could not download the card.");
    } finally {
      setDownloading(false);
    }
  };

  const renderRadarChart = (ratings: FlavorRatings) => {
    const data = [
      { label: 'Aroma', value: ratings.aroma || 0 },
      { label: 'Sweet', value: ratings.sweetness || 0 },
      { label: 'Acidity', value: ratings.acidity || 0 },
      { label: 'Body', value: ratings.body || 0 },
      { label: 'Bitter', value: ratings.bitterness || 0 },
      { label: 'Aftertaste', value: ratings.aftertaste || 0 },
    ];
    
    const maxVal = 5;
    const centerX = 100;
    const centerY = 100;
    const radius = 60;

    const getPoint = (val: number, index: number, max: number) => {
      const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
      const r = (val / max) * radius;
      return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
    };

    const points = data.map((d, i) => getPoint(d.value, i, maxVal)).join(' ');
    const levels = [1, 2, 3, 4, 5];

    return (
      <div className="w-full flex justify-center pb-2">
        <svg width="200" height="200" viewBox="0 0 200 200" className="text-ink-black overflow-visible">
          <defs>
             <pattern id="dot-pattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
               <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.2" />
             </pattern>
          </defs>

          {/* Background Web */}
          {/* White background for the radar chart area */}
          <polygon 
            points={data.map((_, i) => getPoint(maxVal, i, maxVal)).join(' ')}
            fill="white"
            opacity="0.8"
          />
          {levels.map((level) => (
            <polygon 
              key={level}
              points={data.map((_, i) => getPoint(level, i, maxVal)).join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.1"
            />
          ))}

          {/* Axis Lines */}
          {data.map((_, i) => {
             const [x, y] = getPoint(maxVal, i, maxVal).split(',');
             return <line key={i} x1={centerX} y1={centerY} x2={x} y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.1" />
          })}

          {/* Data Polygon */}
          <polygon 
            points={points}
            fill="url(#dot-pattern)"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.6"
          />

          {/* Points on Polygon */}
          {data.map((d, i) => {
             const [x, y] = getPoint(d.value, i, maxVal).split(',');
             return <circle key={i} cx={x} cy={y} r="2" fill="currentColor" />
          })}

          {/* Labels */}
          {data.map((d, i) => {
             const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
             const r = radius + 15; 
             const x = centerX + r * Math.cos(angle);
             const y = centerY + r * Math.sin(angle);
             
             let textAnchor = "middle";
             if (Math.abs(Math.cos(angle)) > 0.1) {
               textAnchor = Math.cos(angle) > 0 ? "start" : "end";
             }
             const yOffset = 3;

             return (
               <text 
                 key={i} 
                 x={x} 
                 y={y + yOffset} 
                 textAnchor={textAnchor}
                 className="font-hand-safe text-[8px] font-bold uppercase tracking-widest fill-ink-black"
               >
                 {d.label}
               </text>
             );
          })}
        </svg>
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
    <div className="flex flex-col items-center">
      <div className="relative w-[420px] h-[720px] mx-auto perspective-1000 group">
        
        {/* The Record Card (Capture Target) */}
        <div 
          id={id ? `flavor-card-capture-${id}` : "flavor-card-capture"}
          ref={cardRef}
          className={`coffee-card-capture-target relative w-full h-full p-[48px] flex flex-col transition-all duration-500 transform ${loading ? 'animate-scribble' : ''}`}
          style={{
            backgroundColor: '#ffffff', // Pure white
            boxShadow: '8px 8px 15px rgba(0,0,0,0.15)',
            borderRadius: '2px',
            border: '1px solid #e5e5e5'
          }}
        >
          {/* Loading Overlay - Blurs content behind it */}
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm rounded-sm transition-all duration-300">
               <svg className="w-16 h-16 text-ink-black animate-spin" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <p className="mt-4 font-hand text-xl animate-pulse text-ink-black font-bold tracking-widest bg-white/80 px-2 py-1 rounded shadow-sm">Brewing art...</p>
            </div>
          )}

          {/* Tape effect */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-100 opacity-80 rotate-[-2deg] z-10" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}></div>

          {/* Record Details / Header */}
          <div className="pt-2 pb-4">
             {/* Header: Name and Date */}
             <div className="flex justify-between items-start mb-2 gap-2">
               <h3 className="font-hand text-2xl font-bold text-ink-black break-words flex-1 leading-none line-clamp-2 h-[48px]">
                 {details.beanName || "Mystery Bean"}
               </h3>
               {/* Date Stamp */}
               <span className="font-hand-safe text-[10px] text-gray-400 tracking-widest border border-gray-200 px-1.5 py-0.5 rounded-sm bg-white/50 shrink-0 mt-1">
                 {formattedDate}
               </span>
             </div>

             {/* Sub-header: Roaster */}
             <div className="font-hand text-[15px] text-gray-500 mb-2 -mt-1 italic min-h-[22.5px]">
               {details.roaster ? `by ${details.roaster}` : ""}
             </div>

             {/* Grid Details */}
             <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-hand mb-4 border-b border-dotted border-gray-300 pb-4">
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-14 flex-shrink-0 text-[10px] uppercase tracking-wider">ORIGIN</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight text-sm">{details.origin || "—"}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-14 flex-shrink-0 text-[10px] uppercase tracking-wider">VAR</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight text-sm">{details.varieties || "—"}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-14 flex-shrink-0 text-[10px] uppercase tracking-wider">ELEV</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight text-sm">{details.elevation || "—"}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-14 flex-shrink-0 text-[10px] uppercase tracking-wider">PROC</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight text-sm">{details.processMethod || "—"}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-14 flex-shrink-0 text-[10px] uppercase tracking-wider">ROAST</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight text-sm">{details.roastLevel || "—"}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="font-hand-safe text-gray-500 w-14 flex-shrink-0 text-[10px] uppercase tracking-wider">BREW</span>
                  <span className="text-ink-black border-b border-gray-200 flex-1 break-words leading-tight text-sm">{details.brewingMethod || "—"}</span>
                </div>
             </div>
          </div>

          {/* Integrated Overlay (Visual-First) Section */}
          <div className="relative w-full aspect-square bg-gray-50 overflow-hidden border border-ink-black rounded-sm shadow-sm mb-6">
             {/* Background Image */}
             {imageUrl ? (
               <img 
                 src={imageUrl} 
                 alt={notes} 
                 className="absolute inset-0 w-full h-full object-cover filter contrast-105"
                 crossOrigin="anonymous" 
               />
             ) : (
               <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-warm-white">
                  <span className="font-hand text-6xl text-gray-200">?</span>
               </div>
             )}

             {/* Overlaid Radar Chart (Bottom Right) */}
             <div className="absolute bottom-0 right-[5%] w-28 h-28 p-[10%] flex flex-col items-center justify-center overflow-visible pointer-events-none">
                <div className="scale-[0.55] origin-center opacity-70">
                   {ratings && renderRadarChart(ratings)}
                </div>
             </div>
          </div>

          {/* Tasting Notes Banner */}
          <div className="relative w-full bg-[#fffff8] px-4 py-3 rounded-md mb-2 shadow-sm h-[64px] flex items-center">
             <p className="font-hand text-sm leading-tight text-ink-black break-words line-clamp-3">
               {notes || "..."}
             </p>
          </div>
        </div>
        
        {/* Background decorative elements */}
        {!loading && imageUrl && (
          <div className="absolute -bottom-6 -right-6 w-12 h-12 border-2 border-dashed border-ink-black rounded-full opacity-10 pointer-events-none rotate-12"></div>
        )}

        {/* Action Buttons Overlay */}
        {!loading && imageUrl && (
          <div className="absolute inset-0 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5 rounded-sm pointer-events-none">
            <div className="pointer-events-auto">
              <FlavorCardButton
                onClick={handleDownload}
                disabled={downloading}
                size="small"
              >
                {downloading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download Card
                  </>
                )}
              </FlavorCardButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};