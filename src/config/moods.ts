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
  }
};