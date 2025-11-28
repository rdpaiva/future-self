import { Dream } from './types';

export const dreams: Dream[] = [
  {
    id: 'fitness',
    icon: '💪',
    title: 'Health & Vitality',
    description: 'Your strongest, most energetic self',
    prompt: 'fit, athletic, healthy, vibrant, energetic, working out, athletic wear, confident posture, strong physique',
  },
  {
    id: 'career',
    icon: '✨',
    title: 'Career Success',
    description: 'Confidence in your professional life',
    prompt: 'professional, successful, confident, business attire, executive office, leadership, accomplished, prestigious',
  },
  {
    id: 'home',
    icon: '🏡',
    title: 'Dream Home',
    description: 'Your perfect sanctuary',
    prompt: 'beautiful luxury home interior, elegant living space, modern sophisticated design, dream house, comfortable sanctuary',
  },
  {
    id: 'travel',
    icon: '✈️',
    title: 'Adventure',
    description: 'Exploring the world freely',
    prompt: 'traveling, exotic destination, beach paradise, mountains, adventure, vacation, worldly, exploring beautiful locations',
  },
  {
    id: 'style',
    icon: '🌟',
    title: 'Style & Confidence',
    description: 'Looking and feeling your best',
    prompt: 'fashionable, stylish, well-dressed, designer clothing, elegant, confident, photoshoot quality, polished appearance',
  },
  {
    id: 'wealth',
    icon: '🍃',
    title: 'Abundance',
    description: 'Financial peace and freedom',
    prompt: 'luxury lifestyle, successful, abundant, wealthy, high-end environment, prosperity, financial freedom, upscale',
  },
];

export const affirmations: string[] = [
  "I am becoming the person I'm meant to be",
  "Every day, I move closer to my dreams",
  "I deserve all the good things coming my way",
  "My potential is limitless",
  "I am worthy of success and happiness",
  "I attract abundance into my life",
  "My dreams are manifesting into reality",
  "I am confident, capable, and strong",
  "I trust the journey of my transformation",
  "Everything I need is already within me",
];

export const STORAGE_KEY = 'manifestr_visions';
