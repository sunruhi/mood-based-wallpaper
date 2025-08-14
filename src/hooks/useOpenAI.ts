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
      console.error(`Error with ${provider} API:`, err);

      // Provide user-friendly error messages and automatic fallback
      if (errorMessage.includes('401') || errorMessage.includes('not valid') || errorMessage.includes('unauthorized')) {
        setError(`${provider} API key invalid. Using free quotes.`);
      } else if (errorMessage.includes('403') || errorMessage.includes('quota') || errorMessage.includes('limit')) {
        setError(`${provider} quota exceeded. Using free quotes.`);
      } else if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        setError(`${provider} temporarily unavailable. Using free quotes.`);
      } else {
        setError(`${provider} error. Using free quotes.`);
      }

      // Always return fallback quotes when external providers fail
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
      ],
      peaceful: [
        { text: "Peace cannot be kept by force; it can only be achieved by understanding.", author: "Albert Einstein" },
        { text: "In the midst of winter, I found there was, within me, an invincible summer.", author: "Albert Camus" },
        { text: "Peace comes from within. Do not seek it without.", author: "Buddha" }
      ],
      energetic: [
        { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
        { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { text: "Act as if what you do makes a difference. It does.", author: "William James" }
      ],
      romantic: [
        { text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.", author: "Lao Tzu" },
        { text: "Love is not about how many days, months, or years you have been together. It's about how much you love each other every day.", author: "Unknown" },
        { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" }
      ],
      mysterious: [
        { text: "The most beautiful thing we can experience is the mysterious.", author: "Albert Einstein" },
        { text: "Mystery creates wonder and wonder is the basis of man's desire to understand.", author: "Neil Armstrong" },
        { text: "In the depths of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus" }
      ],
      adventure: [
        { text: "Adventure is not outside man; it is within.", author: "George Eliot" },
        { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
        { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey" }
      ],
      creative: [
        { text: "Creativity takes courage.", author: "Henri Matisse" },
        { text: "The creative adult is the child who survived.", author: "Ursula K. Le Guin" },
        { text: "Imagination is more important than knowledge.", author: "Albert Einstein" }
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
