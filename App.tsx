import React, { useState, useCallback } from 'react';
import { generateFlavorImage } from './services/geminiService';
import { HandDrawnButton } from './components/HandDrawnButton';
import { FlavorInput } from './components/FlavorInput';
import { CardDisplay } from './components/CardDisplay';
import { FlavorCardState, Preset, CoffeeDetails } from './types';

const PRESETS: Preset[] = [
  { id: '1', label: 'Ethiopian Style', notes: 'Jasmine, bergamot, apricot' },
  { id: '2', label: 'Classic Roast', notes: 'Dark chocolate, toasted nut, caramel' },
  { id: '3', label: 'Summer Blend', notes: 'Strawberry, vanilla, citrus peel' },
];

const App: React.FC = () => {
  const [flavorText, setFlavorText] = useState('');
  const [coffeeDetails, setCoffeeDetails] = useState<CoffeeDetails>({
    beanName: '',
    roastLevel: '',
    processMethod: '',
    origin: '',
    elevation: '',
  });

  const [state, setState] = useState<FlavorCardState>({
    status: 'idle',
    imageUrl: null,
    errorMessage: null,
  });

  const handleGenerate = useCallback(async () => {
    if (!flavorText.trim()) return;

    setState(prev => ({ ...prev, status: 'generating', errorMessage: null }));

    try {
      const imageUrl = await generateFlavorImage(flavorText);
      setState({
        status: 'success',
        imageUrl,
        errorMessage: null,
      });
    } catch (error: any) {
      setState({
        status: 'error',
        imageUrl: null,
        errorMessage: error.message || 'Something went wrong while drawing.',
      });
    }
  }, [flavorText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handlePresetClick = (notes: string) => {
    setFlavorText(notes);
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCoffeeDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-hand text-ink-black selection:bg-yellow-200">
      
      {/* Header */}
      <header className="mb-12 text-center relative">
        <h1 className="text-6xl font-bold mb-2 tracking-wide font-hand" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
          Flavor Sketch
        </h1>
        
        {/* Decorative underlines */}
        <svg className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 text-ink-black opacity-80" viewBox="0 0 200 20" preserveAspectRatio="none">
          <path d="M5 10 Q 50 20 90 10 T 195 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Input */}
        <div className="flex flex-col items-center lg:items-start space-y-8 w-full">
          
          <FlavorInput 
            value={flavorText}
            details={coffeeDetails}
            onChange={(e) => setFlavorText(e.target.value)}
            onDetailChange={handleDetailChange}
            onKeyDown={handleKeyDown}
          />

          {/* Presets - Quick Mixes */}
          <div className="w-full max-w-md lg:max-w-none">
            <h3 className="text-xl mb-3 border-b-2 border-black/10 pb-1 inline-block font-hand">Quick Mixes:</h3>
            <div className="flex flex-wrap gap-3">
              {PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset.notes)}
                  className="px-4 py-2 bg-white border border-dashed border-gray-400 rounded-lg hover:bg-yellow-50 hover:border-solid hover:border-black transition-all text-lg font-hand-safe text-left"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full flex justify-center lg:justify-start">
            <HandDrawnButton 
              onClick={handleGenerate}
              isLoading={state.status === 'generating'}
              disabled={!flavorText.trim() || state.status === 'generating'}
              className="text-2xl"
            >
              Draw My Flavors
            </HandDrawnButton>
          </div>

          {state.status === 'error' && (
            <div className="w-full p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800 animate-pulse font-hand-safe">
              Error: {state.errorMessage}
            </div>
          )}

        </div>

        {/* Right Column: Output */}
        <div className="flex justify-center items-start lg:mt-8 w-full">
           <CardDisplay 
             imageUrl={state.imageUrl}
             loading={state.status === 'generating'}
             notes={flavorText || 'Flavor Card'}
             details={coffeeDetails}
           />
        </div>

      </main>

      <footer className="mt-auto pt-12 text-gray-400 text-sm font-hand-safe">
        <p>Powered by Gemini 2.5 Flash Image</p>
      </footer>
    </div>
  );
};

export default App;