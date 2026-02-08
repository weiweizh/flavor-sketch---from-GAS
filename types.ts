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
}

export interface FlavorRatings {
  sweetness: number;
  acidity: number;
  bitterness: number;
  body: number;
}