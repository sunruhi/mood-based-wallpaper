import { useState } from 'react';
import { GeneratedQuote, Mood, AIProvider } from '../types';

export const useOpenAI = (apiKey?: string, provider: AIProvider = 'free', azureEndpoint?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuote = async (mood: Mood): Promise<GeneratedQuote | null> => {
    const openaiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!openaiKey) {
      // Fallback to predefined quotes if OpenAI API key is not available
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

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: moodPrompts[mood]
            }
          ],
          max_tokens: 100,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const quoteText = data.choices[0]?.message?.content?.trim();

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
