import React from 'react';
import { CoffeeDetails, FlavorRatings } from '../types';

interface FlavorInputProps {
  value: string;
  details: CoffeeDetails;
  ratings: FlavorRatings;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDetailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRatingChange: (name: keyof FlavorRatings, value: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const FlavorInput: React.FC<FlavorInputProps> = ({ 
  value, 
  details,
  ratings,
  onChange, 
  onDetailChange,
  onRatingChange,
  onKeyDown 
}) => {
  // Use font-hand for user input (which falls back properly)
  const inputBaseClass = "bg-transparent border-b border-pencil-gray focus:border-ink-black outline-none font-hand text-xl w-full py-1 placeholder-gray-400 transition-colors";

  const renderRatingSlider = (label: string, name: keyof FlavorRatings) => (
    <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 mb-4 mt-2">
      <label className="w-full md:w-24 font-sans font-bold text-xs tracking-wider uppercase text-gray-500 mb-2 md:mb-0 text-center md:text-left">{label}</label>
      <div className="flex-1 flex justify-between items-center relative h-6 w-full">
        {/* Hand-drawn track */}
        <div className="absolute inset-x-0 h-[2px] top-1/2 -translate-y-1/2 bg-ink-black/20" style={{ borderRadius: '50% 50% 50% 50% / 10% 10% 10% 10%' }}></div>
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => onRatingChange(name, val)}
            className="relative z-10 w-5 h-5 flex items-center justify-center transition-all group"
          >
            {ratings[name] >= val ? (
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] absolute text-ink-black animate-scribble" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
                <path d="M7 10C5 15 12 21 17 16C21 12 16 5 11 8C7 11 8 18 13 20C17 22 21 16 18 11C15 7 9 7 6 11C3 15 9 21 14 19C19 16 17 9 12 7C7 5 4 12 8 17C12 21 19 17 19 12C19 8 13 4 9 9C5 14 11 21 15 17C18 14 15 7 10 9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <div 
                className="w-[14px] h-[14px] rounded-full border-2 border-ink-black bg-white group-hover:bg-gray-100" 
                style={{ borderRadius: `${Math.random() * 20 + 40}% ${Math.random() * 20 + 40}% ${Math.random() * 20 + 40}% ${Math.random() * 20 + 40}%` }}
              />
            )}
          </button>
        ))}
      </div>
      <span className="w-4 font-hand text-lg text-center font-bold hidden md:block">{ratings[name]}</span>
    </div>
  );

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-8 space-y-6">
      
      {/* Coffee Details Form */}
      <div className="bg-white paper-texture p-6 pt-8 rounded-lg border border-ink-black/20 relative mt-4" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
        <div className="absolute -top-3 left-4 bg-yellow-100 opacity-80 px-3 py-1 z-10 font-sans font-bold uppercase tracking-widest text-ink-black/80 text-[10px]" style={{ transform: 'rotate(-1deg)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          Bean Identity (Optional)
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block font-sans text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Bean Name</label>
            <input 
              name="beanName"
              value={details.beanName}
              onChange={onDetailChange}
              placeholder="e.g. Ethiopia Yirgacheffe"
              className={inputBaseClass}
            />
          </div>

          <div>
            <label className="block font-sans text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Roaster</label>
            <input 
              name="roaster"
              value={details.roaster}
              onChange={onDetailChange}
              placeholder="e.g. Onyx Coffee Lab"
              className={inputBaseClass}
            />
          </div>

          <div>
             <label className="block font-sans text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Brewing Method</label>
             <input
               name="brewingMethod"
               value={details.brewingMethod}
               onChange={onDetailChange}
               placeholder="Filter, Espresso, Iced, Cappuccino..."
               className={inputBaseClass}
               list="brew-methods"
             />
             <datalist id="brew-methods">
               <option value="Filter" />
               <option value="Espresso" />
               <option value="Iced" />
               <option value="Cappuccino" />
             </datalist>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Origin</label>
              <input 
                name="origin"
                value={details.origin}
                onChange={onDetailChange}
                placeholder="Region/Farm"
                className={inputBaseClass}
              />
            </div>
            <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Varieties</label>
              <input 
                name="varieties"
                value={details.varieties}
                onChange={onDetailChange}
                placeholder="e.g. Geisha"
                className={inputBaseClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Process</label>
              <input 
                name="processMethod"
                value={details.processMethod}
                onChange={onDetailChange}
                placeholder="Washed/Natural"
                className={inputBaseClass}
              />
            </div>
            <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Elevation</label>
              <input 
                name="elevation"
                value={details.elevation}
                onChange={onDetailChange}
                placeholder="e.g. 2000masl"
                className={inputBaseClass}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Roast</label>
              <input 
                name="roastLevel"
                value={details.roastLevel}
                onChange={onDetailChange}
                placeholder="Light/Medium"
                className={inputBaseClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Flavor Profile Ratings */}
      <div className="bg-white paper-texture p-6 pt-8 rounded-lg border border-ink-black/20 relative mt-4" style={{ borderRadius: '15px 225px 15px 255px / 255px 15px 225px 15px' }}>
         <div className="absolute -top-3 left-4 bg-yellow-100 opacity-80 px-3 py-1 z-10 font-sans font-bold uppercase tracking-widest text-ink-black/80 text-[10px]" style={{ transform: 'rotate(1deg)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
           Flavor Profile
         </div>
         <div className="space-y-3">
            {renderRatingSlider('Sweetness', 'sweetness')}
            {renderRatingSlider('Acidity', 'acidity')}
            {renderRatingSlider('Bitterness', 'bitterness')}
            {renderRatingSlider('Body', 'body')}
            {renderRatingSlider('Aroma', 'aroma')}
            {renderRatingSlider('Aftertaste', 'aftertaste')}
         </div>
      </div>

      {/* Flavor Notes Input */}
      <div className="relative mt-8">
        <div className="absolute -top-3 left-4 bg-yellow-100 opacity-80 px-3 py-1 z-10 font-sans font-bold uppercase tracking-widest text-ink-black/80 text-[10px]" style={{ transform: 'rotate(-2deg)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          Flavor Notes
        </div>
        <textarea
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="e.g. Juicy peach, jasmine floral, hint of bergamot..."
          className="w-full h-32 bg-white paper-texture border border-ink-black/20 text-ink-black font-hand text-2xl p-4 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none pt-6"
          style={{
            borderRadius: '2px 255px 5px 25px / 255px 5px 225px 5px'
          }}
        />
        <div className="text-right text-xs font-sans text-gray-400 mt-1 uppercase tracking-wide">
          Try: "Dark chocolate, roasted nut, caramel"
        </div>
      </div>
    </div>
  );
};