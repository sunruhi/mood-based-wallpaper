import { MoodConfig } from '../types';

export const MOODS: Record<string, MoodConfig> = {
  happy: {
    id: 'happy',
    label: 'Happy',
    description: 'Bright and joyful vibes',
    color: 'bg-yellow-400',
    gradient: 'from-yellow-300 to-orange-400',
    searchTerms: ['happiness', 'joy', 'bright', 'sunny', 'colorful', 'celebration'],
    icon: '😊'
  },
  sad: {
    id: 'sad',
    label: 'Sad',
    description: 'Calm and reflective moments',
    color: 'bg-blue-400',
    gradient: 'from-blue-300 to-indigo-400',
    searchTerms: ['melancholy', 'rain', 'contemplative', 'peaceful', 'quiet', 'reflection'],
    icon: '😔'
  },
  motivated: {
    id: 'motivated',
    label: 'Motivated',
    description: 'Energizing and inspiring',
    color: 'bg-red-400',
    gradient: 'from-red-300 to-pink-400',
    searchTerms: ['success', 'achievement', 'motivation', 'power', 'strength', 'determination'],
    icon: '💪'
  },
  peaceful: {
    id: 'peaceful',
    label: 'Peaceful',
    description: 'Serene and tranquil',
    color: 'bg-green-400',
    gradient: 'from-green-300 to-teal-400',
    searchTerms: ['peace', 'nature', 'zen', 'meditation', 'calm', 'serenity', 'forest', 'lake'],
    icon: '🧘'
  },
  energetic: {
    id: 'energetic',
    label: 'Energetic',
    description: 'Dynamic and vibrant',
    color: 'bg-orange-400',
    gradient: 'from-orange-300 to-red-400',
    searchTerms: ['energy', 'dynamic', 'action', 'movement', 'sport', 'adventure', 'exciting'],
    icon: '⚡'
  },
  romantic: {
    id: 'romantic',
    label: 'Romantic',
    description: 'Love and affection',
    color: 'bg-pink-400',
    gradient: 'from-pink-300 to-rose-400',
    searchTerms: ['love', 'romance', 'couple', 'heart', 'sunset', 'flowers', 'tender'],
    icon: '💕'
  },
  mysterious: {
    id: 'mysterious',
    label: 'Mysterious',
    description: 'Dark and enigmatic',
    color: 'bg-purple-400',
    gradient: 'from-purple-300 to-indigo-500',
    searchTerms: ['mystery', 'dark', 'night', 'shadow', 'moon', 'gothic', 'enigma'],
    icon: '🌙'
  },
  adventure: {
    id: 'adventure',
    label: 'Adventure',
    description: 'Exploration and discovery',
    color: 'bg-emerald-400',
    gradient: 'from-emerald-300 to-cyan-400',
    searchTerms: ['adventure', 'travel', 'exploration', 'mountain', 'journey', 'discovery', 'wild'],
    icon: '🏔️'
  },
  creative: {
    id: 'creative',
    label: 'Creative',
    description: 'Artistic and inspiring',
    color: 'bg-violet-400',
    gradient: 'from-violet-300 to-purple-400',
    searchTerms: ['art', 'creative', 'paint', 'design', 'artistic', 'imagination', 'colorful'],
    icon: '🎨'
  }
};
