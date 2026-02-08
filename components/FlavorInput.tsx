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
  // Use font-hand-mixed: English uses Playwrite (Handwritten), Chinese falls back to sans-serif (Standard)
  const inputBaseClass = "bg-transparent border-b-2 border-pencil-gray focus:border-ink-black outline-none font-hand-mixed text-lg w-full py-1 placeholder-gray-300 transition-colors";

  const renderRatingSlider = (label: string, name: keyof FlavorRatings) => (
    <div className="flex items-center space-x-4">
      <label className="w-24 font-hand-safe text-sm text-gray-500">{label}</label>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={ratings[name]}
        onChange={(e) => onRatingChange(name, parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-ink-black"
      />
      <span className="w-4 font-hand text-sm text-center">{ratings[name]}</span>
    </div>
  );

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 mb-8 space-y-6">
      
      {/* Coffee Details Form */}
      <div className="bg-white p-6 rounded-lg border-2 border-ink-black relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
        <h3 className="font-hand text-xl font-bold mb-4 text-ink-black opacity-80 border-b border-dotted border-gray-300 pb-2">Bean Identity (Optional)</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block font-hand-safe text-sm text-gray-500 mb-1">Bean Name</label>
            <input 
              name="beanName"
              value={details.beanName}
              onChange={onDetailChange}
              placeholder="e.g. Ethiopia Yirgacheffe"
              className={inputBaseClass}
            />
          </div>

          <div>
            <label className="block font-hand-safe text-sm text-gray-500 mb-1">Roaster</label>
            <input 
              name="roaster"
              value={details.roaster}
              onChange={onDetailChange}
              placeholder="e.g. Onyx Coffee Lab"
              className={inputBaseClass}
            />
          </div>

          <div>
             <label className="block font-hand-safe text-sm text-gray-500 mb-1">Brewing Method</label>
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
              <label className="block font-hand-safe text-sm text-gray-500 mb-1">Origin</label>
              <input 
                name="origin"
                value={details.origin}
                onChange={onDetailChange}
                placeholder="Region/Farm"
                className={inputBaseClass}
              />
            </div>
            <div>
              <label className="block font-hand-safe text-sm text-gray-500 mb-1">Elevation</label>
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
              <label className="block font-hand-safe text-sm text-gray-500 mb-1">Process</label>
              <input 
                name="processMethod"
                value={details.processMethod}
                onChange={onDetailChange}
                placeholder="Washed/Natural"
                className={inputBaseClass}
              />
            </div>
            <div>
              <label className="block font-hand-safe text-sm text-gray-500 mb-1">Roast</label>
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
      <div className="bg-white p-6 rounded-lg border-2 border-ink-black relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" style={{ borderRadius: '15px 225px 15px 255px / 255px 15px 225px 15px' }}>
         <h3 className="font-hand text-xl font-bold mb-4 text-ink-black opacity-80 border-b border-dotted border-gray-300 pb-2">Flavor Profile</h3>
         <div className="space-y-3">
            {renderRatingSlider('Sweetness', 'sweetness')}
            {renderRatingSlider('Acidity', 'acidity')}
            {renderRatingSlider('Bitterness', 'bitterness')}
            {renderRatingSlider('Body', 'body')}
         </div>
      </div>

      {/* Flavor Notes Input */}
      <div className="relative mt-8">
        <div className="absolute -top-4 left-4 bg-warm-white px-2 z-10 font-hand font-bold text-ink-black text-xl tracking-wide">
          Flavor Notes
        </div>
        {/* Use font-hand-mixed for standard Chinese input support but handwritten English */}
        <textarea
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="e.g. Juicy peach, jasmine floral, hint of bergamot..."
          className="w-full h-32 bg-transparent border-2 border-ink-black text-ink-black font-hand-mixed text-xl p-4 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none pt-6"
          style={{
            borderRadius: '2px 255px 5px 25px / 255px 5px 225px 5px',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.1)'
          }}
        />
        <div className="text-right text-sm font-hand-safe text-pencil-gray mt-1">
          Try: "Dark chocolate, roasted nut, caramel"
        </div>
      </div>
    </div>
  );
};