import { useState } from 'react';
import { GeneratedQuote, Mood, AIProvider } from '../types';

export const useOpenAI = (apiKey?: string, provider: AIProvider = 'free', azureEndpoint?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuote = async (mood: Mood): Promise<GeneratedQuote | null> => {
    // For free provider, always use fallback quotes
    if (provider === 'free') {
      return getFallbackQuote(mood);
    }

    const currentApiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY;

    if (!currentApiKey || !currentApiKey.trim()) {
      console.warn(`${provider} requires API key, falling back to free quotes`);
      setError(`${provider} API key missing. Using free quotes.`);
      return getFallbackQuote(mood);
    }

    setLoading(true);
    setError(null);

    try {
      const moodPrompts = {
        happy: "Generate a short, uplifting quote about happiness, joy, or positivity. Keep it under 50 words.",
        sad: "Generate a short, comforting quote about finding peace in difficult times or gentle reflection. Keep it under 50 words.",
        motivated: "Generate a short, inspiring quote about achievement, success, or motivation. Keep it under 50 words."
      };

      let endpoint = '';
      let headers: HeadersInit = { 'Content-Type': 'application/json' };
      let body: any = {};

      switch (provider) {
        case 'openai':
          endpoint = 'https://api.openai.com/v1/chat/completions';
          headers.Authorization = `Bearer ${currentApiKey}`;
          body = {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: moodPrompts[mood] }],
            max_tokens: 100,
            temperature: 0.8,
          };
          break;

        case 'anthropic':
          endpoint = 'https://api.anthropic.com/v1/messages';
          headers['x-api-key'] = currentApiKey;
          headers['anthropic-version'] = '2023-06-01';
          body = {
            model: 'claude-3-haiku-20240307',
            max_tokens: 100,
            messages: [{ role: 'user', content: moodPrompts[mood] }],
          };
          break;

        case 'google':
          endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${currentApiKey}`;
          body = {
            contents: [{ parts: [{ text: moodPrompts[mood] }] }],
            generationConfig: { maxOutputTokens: 100, temperature: 0.8 }
          };
          break;

        case 'azure':
          if (!azureEndpoint) {
            throw new Error('Azure endpoint is required');
          }
          endpoint = `${azureEndpoint}/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15`;
          headers['api-key'] = currentApiKey;
          body = {
            messages: [{ role: 'user', content: moodPrompts[mood] }],
            max_tokens: 100,
            temperature: 0.8,
          };
          break;

        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`${provider} API error: ${response.status}`);
      }

      const data = await response.json();
      let quoteText = '';

      // Parse response based on provider
      switch (provider) {
        case 'openai':
        case 'azure':
          quoteText = data.choices[0]?.message?.content?.trim();
          break;
        case 'anthropic':
          quoteText = data.content[0]?.text?.trim();
          break;
        case 'google':
          quoteText = data.candidates[0]?.content?.parts[0]?.text?.trim();
          break;
      }

      if (!quoteText) {
        throw new Error('No quote generated');
      }

      return {
        text: quoteText,
        author: 'AI Generated'
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quote';
      setError(errorMessage);

      // If there's an API error and we're not using free provider,
      // return fallback but keep the error state
      return getFallbackQuote(mood);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackQuote = (mood: Mood): GeneratedQuote => {
    const fallbackQuotes = {
      happy: [
        { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
        { text: "The secret of happiness is freedom, the secret of freedom is courage.", author: "Carrie Jones" },
        { text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" }
      ],
      sad: [
        { text: "The wound is the place where the Light enters you.", author: "Rumi" },
        { text: "It's okay to not be okay, as long as you don't give up.", author: "Unknown" },
        { text: "Every storm runs out of rain.", author: "Maya Angelou" }
      ],
      motivated: [
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
      ]
    };

    const quotes = fallbackQuotes[mood];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return {
    generateQuote,
    loading,
    error,
  };
};
