import React from 'react';
import { render, screen } from '@testing-library/react';
import { ImageDisplay } from '../../components/ImageDisplay';
import { UnsplashImage, GeneratedQuote } from '../../types';

const mockImage: UnsplashImage = {
  id: '1',
  urls: {
    raw: 'https://example.com/raw.jpg',
    full: 'https://example.com/full.jpg',
    regular: 'https://example.com/regular.jpg',
    small: 'https://example.com/small.jpg',
    thumb: 'https://example.com/thumb.jpg',
  },
  alt_description: 'Test image',
  user: {
    name: 'Test User',
    username: 'testuser',
  },
};

const mockQuote: GeneratedQuote = {
  text: 'This is a test quote',
  author: 'Test Author',
};

describe('ImageDisplay', () => {
  it('renders loading state', () => {
    render(<ImageDisplay image={mockImage} quote={mockQuote} isLoading={true} />);
    
    expect(screen.getByTestId('image-loading')).toBeInTheDocument();
  });

  it('renders image and quote when not loading', () => {
    render(<ImageDisplay image={mockImage} quote={mockQuote} isLoading={false} />);
    
    expect(screen.getByTestId('image-display')).toBeInTheDocument();
    expect(screen.getByText(`"${mockQuote.text}"`)).toBeInTheDocument();
    expect(screen.getByText(`— ${mockQuote.author}`)).toBeInTheDocument();
    expect(screen.getByText(`Photo by ${mockImage.user.name}`)).toBeInTheDocument();
  });

  it('renders quote without author when author is not provided', () => {
    const quoteWithoutAuthor = { ...mockQuote, author: undefined };
    render(<ImageDisplay image={mockImage} quote={quoteWithoutAuthor} isLoading={false} />);
    
    expect(screen.getByText(`"${mockQuote.text}"`)).toBeInTheDocument();
    expect(screen.queryByText('—')).not.toBeInTheDocument();
  });

  it('renders image with correct attributes', () => {
    render(<ImageDisplay image={mockImage} quote={mockQuote} isLoading={false} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockImage.urls.regular);
    expect(img).toHaveAttribute('alt', mockImage.alt_description);
  });
});