import React, { useState, useCallback } from 'react';
import { generateFlavorImage, translateToTC } from './services/geminiService';
import { HandDrawnButton } from './components/HandDrawnButton';
import { FlavorInput } from './components/FlavorInput';
import { CardDisplay } from './components/CardDisplay';
import { FlavorCardState, Preset, CoffeeDetails, FlavorRatings } from './types';

const PRESETS: Preset[] = [
  { id: '1', label: 'Ethiopian Style', notes: 'Jasmine, bergamot, apricot' },
  { id: '2', label: 'Classic Roast', notes: 'Dark chocolate, toasted nut, caramel' },
  { id: '3', label: 'Summer Blend', notes: 'Strawberry, vanilla, citrus peel' },
];

const App: React.FC = () => {
  const [flavorText, setFlavorText] = useState('Peach, Jasmine, White Tea');
  const [coffeeDetails, setCoffeeDetails] = useState<CoffeeDetails>({
    beanName: 'Elida DRD Washed',
    roaster: 'Blendin',
    brewingMethod: 'Filter',
    roastLevel: 'light',
    processMethod: 'DRD washed',
    origin: 'Panama',
    elevation: '2000msl',
  });

  const [ratings, setRatings] = useState<FlavorRatings>({
    sweetness: 3,
    acidity: 3,
    bitterness: 2,
    body: 3,
  });

  const [state, setState] = useState<FlavorCardState>({
    status: 'idle',
    imageUrl: null,
    backgroundColor: null,
    errorMessage: null,
  });

  // State to hold the translated data specifically for the card display
  const [cardData, setCardData] = useState<{
    notes: string;
    details: CoffeeDetails;
  } | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!flavorText.trim()) return;

    setState(prev => ({ ...prev, status: 'generating', errorMessage: null }));

    try {
      // Execute Image Generation and Text Translation in parallel for speed
      const [imageResult, translationResult] = await Promise.all([
        generateFlavorImage(flavorText),
        translateToTC(flavorText, coffeeDetails)
      ]);

      setCardData({
        notes: translationResult.notes,
        details: translationResult.details
      });

      setState({
        status: 'success',
        imageUrl: imageResult.imageUrl,
        backgroundColor: imageResult.backgroundColor,
        errorMessage: null,
      });
    } catch (error: any) {
      console.error(error);
      setState({
        status: 'error',
        imageUrl: null,
        backgroundColor: null,
        errorMessage: error.message || 'Something went wrong while drawing.',
      });
    }
  }, [flavorText, coffeeDetails]);

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

  const handleRatingChange = (name: keyof FlavorRatings, value: number) => {
    setRatings(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-hand text-ink-black selection:bg-yellow-200">
      
      {/* Header */}
      <header className="mb-12 text-center relative">
        <h1 className="text-2xl font-bold mb-2 tracking-wide font-hand" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
          Flavor Sketch
        </h1>
        
        {/* Decorative underlines */}
        <svg className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-3 text-ink-black opacity-60" viewBox="0 0 200 20" preserveAspectRatio="none">
          <path d="M5 10 Q 50 20 90 10 T 195 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Input */}
        <div className="flex flex-col items-center lg:items-start space-y-8 w-full">
          
          <FlavorInput 
            value={flavorText}
            details={coffeeDetails}
            ratings={ratings}
            onChange={(e) => setFlavorText(e.target.value)}
            onDetailChange={handleDetailChange}
            onRatingChange={handleRatingChange}
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
             backgroundColor={state.backgroundColor}
             loading={state.status === 'generating'}
             // If we have generated (translated) cardData, use it. Otherwise fallback to live input.
             notes={cardData ? cardData.notes : (flavorText || 'Flavor Card')}
             details={cardData ? cardData.details : coffeeDetails}
             ratings={ratings}
           />
        </div>

      </main>

      <footer className="mt-auto pt-12 text-gray-400 text-sm font-hand-safe">
        <p>Powered by Gemini 2.5 Flash Image & Gemini 3 Flash</p>
      </footer>
    </div>
  );
};

export default App;