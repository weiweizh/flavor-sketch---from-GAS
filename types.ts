export interface FlavorCardState {
  status: 'idle' | 'generating' | 'success' | 'error';
  imageUrl: string | null;
  errorMessage: string | null;
}

export interface Preset {
  id: string;
  label: string;
  notes: string;
}

export interface CoffeeDetails {
  beanName: string;
  roastLevel: string;
  processMethod: string;
  origin: string;
  elevation: string;
}