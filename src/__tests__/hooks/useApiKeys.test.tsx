import { renderHook, act } from '@testing-library/react';
import { useApiKeys } from '../../hooks/useApiKeys';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useApiKeys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial empty state', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useApiKeys());
    
    expect(result.current.apiKeys).toEqual({
      unsplashKey: '',
      openaiKey: ''
    });
    expect(result.current.hasUnsplashKey).toBe(false);
    expect(result.current.hasOpenaiKey).toBe(false);
  });

  it('should load API keys from localStorage on mount', () => {
    const storedKeys = {
      unsplashKey: 'stored-unsplash-key',
      openaiKey: 'stored-openai-key'
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedKeys));
    
    const { result } = renderHook(() => useApiKeys());
    
    expect(result.current.apiKeys).toEqual(storedKeys);
    expect(result.current.hasUnsplashKey).toBe(true);
    expect(result.current.hasOpenaiKey).toBe(true);
  });

  it('should handle invalid JSON in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useApiKeys());
    
    expect(result.current.apiKeys).toEqual({
      unsplashKey: '',
      openaiKey: ''
    });
    expect(consoleSpy).toHaveBeenCalledWith('Failed to parse stored API keys:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should save API keys to localStorage', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useApiKeys());
    
    const newKeys = {
      unsplashKey: 'new-unsplash-key',
      openaiKey: 'new-openai-key'
    };
    
    act(() => {
      result.current.saveApiKeys(newKeys);
    });
    
    expect(result.current.apiKeys).toEqual(newKeys);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'mood-wallpaper-api-keys',
      JSON.stringify(newKeys)
    );
  });

  it('should clear API keys', () => {
    const storedKeys = {
      unsplashKey: 'stored-unsplash-key',
      openaiKey: 'stored-openai-key'
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedKeys));
    
    const { result } = renderHook(() => useApiKeys());
    
    act(() => {
      result.current.clearApiKeys();
    });
    
    expect(result.current.apiKeys).toEqual({
      unsplashKey: '',
      openaiKey: ''
    });
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('mood-wallpaper-api-keys');
  });

  it('should correctly determine if keys exist (ignoring whitespace)', () => {
    const { result } = renderHook(() => useApiKeys());
    
    act(() => {
      result.current.saveApiKeys({
        unsplashKey: '  valid-key  ',
        openaiKey: '   '
      });
    });
    
    expect(result.current.hasUnsplashKey).toBe(true);
    expect(result.current.hasOpenaiKey).toBe(false);
  });
});