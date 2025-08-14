export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  textPosition: 'center' | 'top' | 'bottom' | 'left' | 'right';
  textAlign: 'left' | 'center' | 'right';
  backgroundColor: string;
  backgroundOpacity: number;
  textColor: string;
  borderRadius: number;
  padding: number;
  fontSize: {
    quote: string;
    author: string;
  };
  fontWeight: {
    quote: string;
    author: string;
  };
  shadowConfig: {
    enabled: boolean;
    blur: number;
    color: string;
  };
  borderConfig: {
    enabled: boolean;
    width: number;
    color: string;
  };
}

export const THEMES: Record<string, ThemeConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Clean centered text with subtle background',
    textPosition: 'center',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundOpacity: 0.5,
    textColor: '#ffffff',
    borderRadius: 8,
    padding: 32,
    fontSize: {
      quote: '2rem',
      author: '1.25rem'
    },
    fontWeight: {
      quote: '600',
      author: '400'
    },
    shadowConfig: {
      enabled: true,
      blur: 4,
      color: 'rgba(0, 0, 0, 0.3)'
    },
    borderConfig: {
      enabled: false,
      width: 2,
      color: '#ffffff'
    }
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple text with no background',
    textPosition: 'bottom',
    textAlign: 'left',
    backgroundColor: 'transparent',
    backgroundOpacity: 0,
    textColor: '#ffffff',
    borderRadius: 0,
    padding: 24,
    fontSize: {
      quote: '1.75rem',
      author: '1rem'
    },
    fontWeight: {
      quote: '500',
      author: '300'
    },
    shadowConfig: {
      enabled: true,
      blur: 8,
      color: 'rgba(0, 0, 0, 0.8)'
    },
    borderConfig: {
      enabled: false,
      width: 2,
      color: '#ffffff'
    }
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    description: 'Strong contrast with solid background',
    textPosition: 'center',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backgroundOpacity: 0.8,
    textColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    fontSize: {
      quote: '2.5rem',
      author: '1.5rem'
    },
    fontWeight: {
      quote: '700',
      author: '500'
    },
    shadowConfig: {
      enabled: false,
      blur: 0,
      color: 'transparent'
    },
    borderConfig: {
      enabled: true,
      width: 3,
      color: '#ffffff'
    }
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated with subtle borders',
    textPosition: 'bottom',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backgroundOpacity: 0.1,
    textColor: '#ffffff',
    borderRadius: 12,
    padding: 36,
    fontSize: {
      quote: '2rem',
      author: '1.125rem'
    },
    fontWeight: {
      quote: '400',
      author: '300'
    },
    shadowConfig: {
      enabled: true,
      blur: 6,
      color: 'rgba(0, 0, 0, 0.5)'
    },
    borderConfig: {
      enabled: true,
      width: 1,
      color: 'rgba(255, 255, 255, 0.3)'
    }
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with gradient background',
    textPosition: 'top',
    textAlign: 'left',
    backgroundColor: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3))',
    backgroundOpacity: 1,
    textColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    fontSize: {
      quote: '2.25rem',
      author: '1.25rem'
    },
    fontWeight: {
      quote: '600',
      author: '400'
    },
    shadowConfig: {
      enabled: true,
      blur: 12,
      color: 'rgba(0, 0, 0, 0.4)'
    },
    borderConfig: {
      enabled: false,
      width: 2,
      color: '#ffffff'
    }
  },
  vintage: {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic typography with warm tones',
    textPosition: 'center',
    textAlign: 'center',
    backgroundColor: 'rgba(139, 69, 19, 0.7)',
    backgroundOpacity: 0.7,
    textColor: '#f5f5dc',
    borderRadius: 4,
    padding: 40,
    fontSize: {
      quote: '2rem',
      author: '1.25rem'
    },
    fontWeight: {
      quote: '500',
      author: '300'
    },
    shadowConfig: {
      enabled: true,
      blur: 3,
      color: 'rgba(0, 0, 0, 0.6)'
    },
    borderConfig: {
      enabled: true,
      width: 2,
      color: '#f5f5dc'
    }
  }
};

export const DEFAULT_THEME = 'classic';
