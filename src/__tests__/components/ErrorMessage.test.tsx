import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from '../../components/ErrorMessage';

describe('ErrorMessage', () => {
  const mockOnRetry = vi.fn();

  beforeEach(() => {
    mockOnRetry.mockClear();
  });

  it('renders error message', () => {
    const errorMessage = 'Something went wrong';
    render(<ErrorMessage message={errorMessage} />);
    
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorMessage message="Error" onRetry={mockOnRetry} />);
    
    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Error" />);
    
    expect(screen.queryByTestId('retry-button')).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    render(<ErrorMessage message="Error" onRetry={mockOnRetry} />);
    
    fireEvent.click(screen.getByTestId('retry-button'));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
});