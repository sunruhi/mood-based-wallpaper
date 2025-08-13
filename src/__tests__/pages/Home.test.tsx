import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Home } from '../../pages/Home';

// Mock the API keys hook
vi.mock('../../hooks/useApiKeys', () => ({
  useApiKeys: () => ({
    apiKeys: { unsplashKey: '', openaiKey: '' },
    saveApiKeys: vi.fn(),
    hasUnsplashKey: false,
    hasOpenaiKey: false,
  }),
}));

// Mock the hooks
vi.mock('../../hooks/useUnsplashAPI', () => ({
  useUnsplashAPI: vi.fn(() => ({
    fetchImageByMood: vi.fn().mockResolvedValue({
      id: '1',
      urls: { regular: 'test.jpg' },
      alt_description: 'Test image',
      user: { name: 'Test User', username: 'testuser' }
    }),
    loading: false,
    error: null,
  })),
}));

vi.mock('../../hooks/useOpenAI', () => ({
  useOpenAI: vi.fn(() => ({
    generateQuote: vi.fn().mockResolvedValue({
      text: 'Test quote',
      author: 'Test Author'
    }),
    loading: false,
    error: null,
  })),
}));

describe('Home', () => {
  it('renders the main title and description', () => {
    render(<Home />);
    
    expect(screen.getByText('Mood Wallpaper Generator')).toBeInTheDocument();
    expect(screen.getByText('Select your mood and get a personalized wallpaper with an inspiring quote')).toBeInTheDocument();
  });

  it('renders all mood cards', () => {
    render(<Home />);
    
    expect(screen.getByTestId('mood-card-happy')).toBeInTheDocument();
    expect(screen.getByTestId('mood-card-sad')).toBeInTheDocument();
    expect(screen.getByTestId('mood-card-motivated')).toBeInTheDocument();
  });

  it('shows instruction when no mood is selected', () => {
    render(<Home />);
    
    expect(screen.getByText('Choose a mood above to get started')).toBeInTheDocument();
  });

  it('renders settings button', () => {
    render(<Home />);
    
    expect(screen.getByTestId('settings-button')).toBeInTheDocument();
  });

  it('shows fallback content message when API keys are not configured', () => {
    render(<Home />);
    
    expect(screen.getByText(/Using fallback content/)).toBeInTheDocument();
  });

  it('opens settings modal when settings button is clicked', () => {
    render(<Home />);
    
    fireEvent.click(screen.getByTestId('settings-button'));
    
    expect(screen.getByText('API Settings')).toBeInTheDocument();
  });

  it('generates wallpaper when mood is selected', async () => {
    render(<Home />);
    
    fireEvent.click(screen.getByTestId('mood-card-happy'));
    
    await waitFor(() => {
      expect(screen.getByTestId('image-display')).toBeInTheDocument();
    });
  });
});