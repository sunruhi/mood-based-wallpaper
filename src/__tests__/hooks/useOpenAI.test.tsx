import { renderHook, act } from '@testing-library/react';
import { useOpenAI } from '../../hooks/useOpenAI';

// Mock fetch
global.fetch = vi.fn();

describe('useOpenAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useOpenAI());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.generateQuote).toBe('function');
  });

  it('should return fallback quote when API key is not configured', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', undefined);
    const { result } = renderHook(() => useOpenAI());
    
    let returnedQuote;
    await act(async () => {
      returnedQuote = await result.current.generateQuote('happy');
    });
    
    expect(returnedQuote).toHaveProperty('text');
    expect(returnedQuote).toHaveProperty('author');
    expect(result.current.error).toBe(null);
  });

  it('should handle successful API response', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-api-key');
    
    const mockResponse = {
      choices: [{
        message: {
          content: 'Test generated quote'
        }
      }]
    };
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    
    const { result } = renderHook(() => useOpenAI());
    
    let returnedQuote;
    await act(async () => {
      returnedQuote = await result.current.generateQuote('happy');
    });
    
    expect(returnedQuote).toEqual({
      text: 'Test generated quote',
      author: 'AI Generated'
    });
    expect(result.current.error).toBe(null);
  });

  it('should return fallback quote on API error', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-api-key');
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });
    
    const { result } = renderHook(() => useOpenAI());
    
    let returnedQuote;
    await act(async () => {
      returnedQuote = await result.current.generateQuote('happy');
    });
    
    expect(returnedQuote).toHaveProperty('text');
    expect(returnedQuote).toHaveProperty('author');
    expect(result.current.error).toBe('OpenAI API error: 401');
  });
});