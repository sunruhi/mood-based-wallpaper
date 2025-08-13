import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApiKeySettings } from '../../components/ApiKeySettings';
import { ApiKeys } from '../../types';

describe('ApiKeySettings', () => {
  const mockApiKeys: ApiKeys = {
    unsplashKey: 'test-unsplash-key',
    openaiKey: 'test-openai-key'
  };

  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
    mockOnClose.mockClear();
  });

  it('renders when isOpen is true', () => {
    render(
      <ApiKeySettings
        apiKeys={mockApiKeys}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isOpen={true}
      />
    );

    expect(screen.getByText('API Settings')).toBeInTheDocument();
    expect(screen.getByTestId('unsplash-key-input')).toBeInTheDocument();
    expect(screen.getByTestId('openai-key-input')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <ApiKeySettings
        apiKeys={mockApiKeys}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isOpen={false}
      />
    );

    expect(screen.queryByText('API Settings')).not.toBeInTheDocument();
  });

  it('displays current API keys in inputs', () => {
    render(
      <ApiKeySettings
        apiKeys={mockApiKeys}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isOpen={true}
      />
    );

    const unsplashInput = screen.getByTestId('unsplash-key-input') as HTMLInputElement;
    const openaiInput = screen.getByTestId('openai-key-input') as HTMLInputElement;

    expect(unsplashInput.value).toBe(mockApiKeys.unsplashKey);
    expect(openaiInput.value).toBe(mockApiKeys.openaiKey);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <ApiKeySettings
        apiKeys={mockApiKeys}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isOpen={true}
      />
    );

    fireEvent.click(screen.getByTestId('settings-backdrop'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <ApiKeySettings
        apiKeys={mockApiKeys}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isOpen={true}
      />
    );

    fireEvent.click(screen.getByTestId('close-settings'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSave with updated keys when save button is clicked', () => {
    render(
      <ApiKeySettings
        apiKeys={mockApiKeys}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isOpen={true}
      />
    );

    const unsplashInput = screen.getByTestId('unsplash-key-input');
    const newUnsplashKey = 'new-unsplash-key';

    fireEvent.change(unsplashInput, { target: { value: newUnsplashKey } });
    fireEvent.click(screen.getByTestId('save-keys'));

    expect(mockOnSave).toHaveBeenCalledWith({
      unsplashKey: newUnsplashKey,
      openaiKey: mockApiKeys.openaiKey
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('toggles password visibility for Unsplash key', () => {
    render(
      <ApiKeySettings
        apiKeys={mockApiKeys}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isOpen={true}
      />
    );

    const unsplashInput = screen.getByTestId('unsplash-key-input') as HTMLInputElement;
    expect(unsplashInput.type).toBe('password');

    // Find and click the eye button for Unsplash input
    const eyeButtons = screen.getAllByRole('button');
    const unsplashEyeButton = eyeButtons.find(button => 
      button.parentElement?.querySelector('[data-testid="unsplash-key-input"]')
    );
    
    if (unsplashEyeButton) {
      fireEvent.click(unsplashEyeButton);
      expect(unsplashInput.type).toBe('text');
    }
  });

  it('shows helpful information about API keys', () => {
    render(
      <ApiKeySettings
        apiKeys={mockApiKeys}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isOpen={true}
      />
    );

    expect(screen.getByText(/Optional:/)).toBeInTheDocument();
    expect(screen.getByText(/stored locally/)).toBeInTheDocument();
    expect(screen.getByText('For high-quality, mood-specific images')).toBeInTheDocument();
    expect(screen.getByText('For AI-generated personalized quotes')).toBeInTheDocument();
  });

  it('includes links to get API keys', () => {
    render(
      <ApiKeySettings
        apiKeys={mockApiKeys}
        onSave={mockOnSave}
        onClose={mockOnClose}
        isOpen={true}
      />
    );

    const unsplashLink = screen.getByRole('link', { name: /Get Key/ });
    const openaiLink = screen.getAllByRole('link', { name: /Get Key/ })[1];

    expect(unsplashLink).toHaveAttribute('href', 'https://unsplash.com/developers');
    expect(openaiLink).toHaveAttribute('href', 'https://platform.openai.com/api-keys');
  });
});