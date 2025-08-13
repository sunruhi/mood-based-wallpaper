import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoodCard } from '../../components/MoodCard';
import { MOODS } from '../../config/moods';

describe('MoodCard', () => {
  const mockOnSelect = vi.fn();
  const happyMood = MOODS.happy;

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders mood card with correct information', () => {
    render(<MoodCard mood={happyMood} onSelect={mockOnSelect} />);
    
    expect(screen.getByText(happyMood.label)).toBeInTheDocument();
    expect(screen.getByText(happyMood.description)).toBeInTheDocument();
    expect(screen.getByText(happyMood.icon)).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    render(<MoodCard mood={happyMood} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByTestId(`mood-card-${happyMood.id}`));
    expect(mockOnSelect).toHaveBeenCalledWith(happyMood.id);
  });

  it('applies selected styles when isSelected is true', () => {
    render(<MoodCard mood={happyMood} onSelect={mockOnSelect} isSelected={true} />);
    
    const card = screen.getByTestId(`mood-card-${happyMood.id}`);
    expect(card).toHaveClass('ring-4', 'ring-white', 'ring-opacity-50', 'scale-105');
  });

  it('does not apply selected styles when isSelected is false', () => {
    render(<MoodCard mood={happyMood} onSelect={mockOnSelect} isSelected={false} />);
    
    const card = screen.getByTestId(`mood-card-${happyMood.id}`);
    expect(card).not.toHaveClass('ring-4', 'ring-white', 'ring-opacity-50', 'scale-105');
  });
});