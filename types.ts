export interface FlavorCardState {
  status: 'idle' | 'generating' | 'success' | 'error';
  imageUrl: string | null;
  backgroundColor: string | null;
  errorMessage: string | null;
}

export interface Preset {
  id: string;
  label: string;
  notes: string;
}

export interface CoffeeDetails {
  beanName: string;
  roaster: string;
  brewingMethod: string;
  roastLevel: string;
  processMethod: string;
  origin: string;
  elevation: string;
  varieties: string;
}

export interface FlavorRatings {
  sweetness: number;
  acidity: number;
  bitterness: number;
  body: number;
  aroma: number;
  aftertaste: number;
}

declare global {
  interface Window {
    // Fixed: Removed conflicting 'aistudio' property declaration. It is already declared globally as 'AIStudio'.
    process?: {
      env: {
        [key: string]: string | undefined;
      };
    };
  }
}