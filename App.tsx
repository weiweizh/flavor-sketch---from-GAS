import React, { useState, useCallback, useEffect } from 'react';
import coffeeSketchLogo from './src/assets/images/coffee_sketch_logo.png';
import { generateFlavorImage, translateToTC } from './services/geminiService';
import { FlavorCardButton } from './components/FlavorCardButton';
import { SketchModal } from './components/SketchModal';
import { BackgroundDoodles } from './components/BackgroundDoodles';
import { FlavorInput } from './components/FlavorInput';
import { CardDisplay } from './components/CardDisplay';
import { OrbitCardStack } from './components/OrbitCardStack';
import { Preset, CoffeeDetails, FlavorRatings } from './types';
import { toPng } from 'html-to-image';

const PRESETS: Preset[] = [
  { id: '1', label: 'Ethiopian Style', notes: 'Jasmine, bergamot, apricot' },
  { id: '2', label: 'Classic Roast', notes: 'Dark chocolate, toasted nut, caramel' },
  { id: '3', label: 'Summer Blend', notes: 'Strawberry, vanilla, citrus peel' },
  { id: '4', label: 'Honey Bourbon', notes: 'Yellow peach, raw honey, bourbon vanilla' },
  { id: '5', label: 'Nutty Espresso', notes: 'Hazelnut, dark cocoa, brown sugar' },
];

interface CoffeeCardData {
  id: string;
  notes: string;
  flavorText: string;
  details: CoffeeDetails;
  ratings: FlavorRatings;
  imageUrl: string | null;
  backgroundColor: string | null;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
}

const App: React.FC = () => {
  const [apiKeyReady, setApiKeyReady] = useState<boolean>(false);
  const [cards, setCards] = useState<CoffeeCardData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [flavorText, setFlavorText] = useState('Peach, Jasmine, White Tea');
  const [coffeeDetails, setCoffeeDetails] = useState<CoffeeDetails>({
    beanName: 'Elida DRD Washed',
    roaster: 'Blendin',
    brewingMethod: 'Filter',
    roastLevel: 'light',
    processMethod: 'DRD washed',
    origin: 'Panama',
    elevation: '2000msl',
    varieties: 'Geisha',
  });

  const [ratings, setRatings] = useState<FlavorRatings>({
    sweetness: 3,
    acidity: 3,
    bitterness: 2,
    body: 3,
    aroma: 4,
    aftertaste: 3,
  });

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyReady(hasKey);
      } else {
        setApiKeyReady(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setApiKeyReady(true);
      } catch (err) {
        console.error("Failed to select API key", err);
      }
    }
  };

  const handleGenerate = useCallback(async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setApiKeyReady(false);
        return;
      }
    }

    if (!flavorText.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const [imageResult, translationResult] = await Promise.all([
        generateFlavorImage(flavorText),
        translateToTC(flavorText, coffeeDetails)
      ]);

      const newCard: CoffeeCardData = {
        id: Date.now().toString(),
        notes: translationResult.notes,
        flavorText,
        details: translationResult.details,
        ratings: { ...ratings },
        imageUrl: imageResult.imageUrl,
        backgroundColor: imageResult.backgroundColor,
        rotation: Math.random() * 12 - 6,
        offsetX: Math.random() * 40 - 20,
        offsetY: Math.random() * 40 - 20,
      };

      setCards(prev => [newCard, ...prev].slice(0, 10)); // max 10 cards
      setIsModalOpen(false);
      setFlavorText('');
      setCoffeeDetails({
        beanName: '',
        roaster: '',
        brewingMethod: 'Filter',
        roastLevel: '',
        processMethod: '',
        origin: '',
        elevation: '',
        varieties: '',
      });
      setRatings({ sweetness: 3, acidity: 3, bitterness: 2, body: 3 });
    } catch (err: any) {
      console.error(err);
      const msg = err.message || 'Something went wrong while drawing.';
      
      if (msg.includes("API_KEY") || msg.includes("403")) {
         if (window.aistudio) setApiKeyReady(false);
      }
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  }, [flavorText, coffeeDetails, ratings]);

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    try {
      const cardElements = document.querySelectorAll('.coffee-card-capture-target');
      for (let i = 0; i < cardElements.length; i++) {
        const element = cardElements[i] as HTMLElement;
        const dataUrl = await toPng(element, {
          pixelRatio: 3,
          cacheBust: true,
        });
        
        const link = document.createElement('a');
        link.download = `coffee-flavor-card-${i+1}.png`;
        link.href = dataUrl;
        link.click();
        
        await new Promise(r => setTimeout(r, 400));
      }
    } catch (err) {
      console.error('Failed to download all cards:', err);
      alert('Failed to download all cards.');
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handlePresetClick = (notes: string) => setFlavorText(notes);
  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCoffeeDetails(prev => ({ ...prev, [name]: value }));
  };
  const handleRatingChange = (name: keyof FlavorRatings, value: number) => {
    setRatings(prev => ({ ...prev, [name]: value }));
  };

  if (!apiKeyReady) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-hand text-ink-black text-center">
        <div className="max-w-md w-full bg-white border-2 border-ink-black p-8 rounded-lg relative" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={coffeeSketchLogo} alt="Logo" className="w-12 h-12 object-contain -rotate-6" referrerPolicy="no-referrer" />
            <h1 className="text-3xl font-bold">Flavor Sketch</h1>
          </div>
          <p className="text-xl mb-8 font-hand-safe text-gray-600">
            To create your hand-drawn flavor cards, please connect your Google AI account.
          </p>
          <FlavorCardButton onClick={handleSelectKey}>
            Connect API Key
          </FlavorCardButton>
        </div>
      </div>
    );
  }

  const renderForm = () => (
    <div className="w-full max-w-full mx-auto pb-8 flex flex-col items-center">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-fredericka mb-2">Log Today's Brew</h2>
        <p className="font-hand-safe text-gray-600">Tell us what you're tasting today.</p>
      </div>
      
      <FlavorInput 
        value={flavorText}
        onChange={(e) => setFlavorText(e.target.value)}
        details={coffeeDetails}
        onDetailChange={handleDetailChange}
        ratings={ratings}
        onRatingChange={handleRatingChange}
        onKeyDown={handleKeyDown}
      />
      
      <div className="mt-8 mb-4 flex flex-col items-center">
        <h3 className="text-xl mb-3 border-b-2 border-black/10 pb-1 inline-block font-hand font-bold text-center">Quick Mixes:</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {PRESETS.map(preset => (
            <FlavorCardButton
              key={preset.id}
              onClick={() => handlePresetClick(preset.notes)}
              size="small"
            >
              {preset.label}
            </FlavorCardButton>
          ))}
        </div>
      </div>
      
      {error && (
        <div className="w-full max-w-xl p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800 font-hand-safe mb-4">
          <p className="font-bold text-center">Oops! The sketch got smudged.</p>
          <p className="text-sm opacity-80 text-center">{error}</p>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <FlavorCardButton 
          onClick={handleGenerate} 
          isLoading={isGenerating}
          disabled={!flavorText.trim() || isGenerating}
        >
          Generate Flavor Card
        </FlavorCardButton>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col py-12 px-4 sm:px-6 lg:px-8 font-hand text-ink-black selection:bg-yellow-200">
      <BackgroundDoodles />
      {/* Header */}
      <header className="relative w-[70%] max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-center md:items-end pb-8 gap-6">
        {/* Hand drawn border line with snail */}
        <div className="absolute left-0 right-0 bottom-0 pointer-events-none w-full h-8 overflow-visible opacity-70 flex items-center">
          {/* Wobbly line that stretches */}
          <svg width="100%" height="100%" viewBox="0 0 100 32" preserveAspectRatio="none" className="flex-1 text-gray-500 overflow-visible">
             <path d="M 0 16 Q 25 14, 50 17 T 100 16" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
          {/* Fixed size loop and snail so they never distort */}
          <svg width="80" height="32" viewBox="0 0 80 32" className="text-gray-500 flex-shrink-0 overflow-visible">
             {/* Loop */}
             <path d="M 0 16 C 14 16, 16 6, 10 6 C 4 6, 4 16, 20 16 L 38 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
             {/* Snail at the end of the line */}
             <g transform="translate(50, 16) scale(0.8)">
               {/* Snail Shell */}
               <path d="M 0 0 C -5 -15, 15 -15, 10 0 C 15 5, 20 -5, 10 -10 C 5 -10, 5 -5, 10 -5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
               {/* Snail Body */}
               <path d="M -5 5 L 20 5 C 25 5, 25 -5, 20 -5 L 18 -5 M -5 5 C -10 5, -15 -5, -10 -5 C -8 -5, -8 0, -5 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
               {/* Antennae */}
               <path d="M -10 -5 L -15 -10 M -8 -5 L -5 -12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
               <circle cx="-15" cy="-10" r="1" fill="currentColor" />
               <circle cx="-5" cy="-12" r="1" fill="currentColor" />
             </g>
          </svg>
        </div>
        <div className="text-center md:text-left relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <img src={coffeeSketchLogo} alt="Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain -rotate-6" referrerPolicy="no-referrer" />
            <h1 className="text-4xl md:text-5xl font-fredericka tracking-wide text-gray-800 drop-shadow-sm">
              Flavor Sketch
            </h1>
          </div>
          <p className="text-xl mt-2 text-gray-600 font-hand-safe">Your personal coffee diary.</p>
        </div>
        {cards.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            <FlavorCardButton 
              size="small"
              onClick={handleDownloadAll}
              isLoading={isDownloadingAll}
            >
              Download All Cards
            </FlavorCardButton>
            <FlavorCardButton onClick={() => setIsModalOpen(true)} size="small">
              + Log Today's Brew
            </FlavorCardButton>
          </div>
        )}
      </header>

      <main className="w-[70%] max-w-7xl mx-auto flex-1">
        {cards.length === 0 ? (
          <div className="flex justify-center">
            {renderForm()}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 pb-[30vh] w-full">
            <OrbitCardStack spread={200} lift={60}>
              {cards.map((card) => (
                <div 
                  key={card.id}
                  className="transition-all duration-300 hover:scale-[1.02]"
                >
                  <CardDisplay
                    id={card.id}
                    loading={false}
                    imageUrl={card.imageUrl}
                    notes={card.notes}
                    details={card.details}
                    ratings={card.ratings}
                    backgroundColor={card.backgroundColor}
                  />
                </div>
              ))}
            </OrbitCardStack>
          </div>
        )}
      </main>

      <footer className="mt-auto pt-12 text-center text-gray-400 text-sm font-hand-safe">
        <p>Powered by Gemini Models</p>
      </footer>

      <SketchModal isOpen={isModalOpen && cards.length > 0} onClose={() => setIsModalOpen(false)}>
        {renderForm()}
      </SketchModal>
    </div>
  );
};

export default App;