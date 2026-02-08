import React from 'react';
import { CoffeeDetails } from '../types';

interface FlavorInputProps {
  value: string;
  details: CoffeeDetails;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDetailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const FlavorInput: React.FC<FlavorInputProps> = ({ 
  value, 
  details,
  onChange, 
  onDetailChange,
  onKeyDown 
}) => {
  const inputBaseClass = "bg-transparent border-b-2 border-pencil-gray focus:border-ink-black outline-none font-hand text-xl w-full py-1 placeholder-gray-300 transition-colors";

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

      {/* Flavor Notes Input */}
      <div className="relative">
        <div className="absolute -top-3 left-4 bg-warm-white px-2 z-10 font-bubbly text-ink-black text-xl tracking-wide">
          Flavor Notes
        </div>
        <textarea
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="e.g. Juicy peach, jasmine floral, hint of bergamot..."
          className="w-full h-32 bg-transparent border-2 border-ink-black text-ink-black font-hand text-2xl p-4 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
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