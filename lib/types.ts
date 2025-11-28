export interface Dream {
  id: string;
  icon: string;
  title: string;
  description: string;
  prompt: string; // Used for AI image generation
}

export interface Manifestation {
  id: string;
  originalImage: string;
  generatedImage: string;
  dreams: string[];
  createdAt: Date;
  affirmation: string;
}

export interface OnboardingState {
  step: number;
  uploadedImage: string | null;
  selectedDreams: string[];
}
