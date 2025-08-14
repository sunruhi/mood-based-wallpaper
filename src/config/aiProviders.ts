import { AIProviderConfig, AIProvider } from '../types';

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  free: {
    id: 'free',
    name: 'Free AI',
    description: 'Basic AI quotes (no API key required)',
    requiresApiKey: false,
    icon: '🆓'
  },
  openai: {
    id: 'openai',
    name: 'OpenAI GPT',
    description: 'Advanced AI with GPT models',
    requiresApiKey: true,
    getKeyUrl: 'https://platform.openai.com/api-keys',
    icon: '🤖'
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Claude AI for thoughtful responses',
    requiresApiKey: true,
    getKeyUrl: 'https://console.anthropic.com/',
    icon: '🧠'
  },
  google: {
    id: 'google',
    name: 'Google Gemini',
    description: 'Google\'s Gemini AI model',
    requiresApiKey: true,
    getKeyUrl: 'https://aistudio.google.com/app/apikey',
    icon: '🌟'
  },
  azure: {
    id: 'azure',
    name: 'Azure OpenAI',
    description: 'Enterprise OpenAI through Azure',
    requiresApiKey: true,
    getKeyUrl: 'https://portal.azure.com/',
    icon: '☁️'
  },
  meta: {
    id: 'meta',
    name: 'Meta Llama',
    description: 'Meta\'s Llama models for AI generation',
    requiresApiKey: true,
    getKeyUrl: 'https://developers.facebook.com/docs/llama-api',
    icon: '🦙'
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    description: 'Fast inference with Groq LPU technology',
    requiresApiKey: true,
    getKeyUrl: 'https://console.groq.com/keys',
    icon: '⚡'
  }
};

export const DEFAULT_AI_PROVIDER: AIProvider = 'free';

export const getProviderConfig = (providerId: AIProvider): AIProviderConfig => {
  return AI_PROVIDERS[providerId];
};

export const getProviderList = (): AIProviderConfig[] => {
  return Object.values(AI_PROVIDERS);
};
