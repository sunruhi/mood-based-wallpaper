# Mood Wallpaper Generator

A beautiful, responsive web application that generates personalized wallpapers based on your mood. Select your mood (Happy, Sad, or Motivated), customize themes, and the app will create a stunning wallpaper combining a mood-appropriate image from multiple providers with AI-generated inspirational quotes.

## Features

- 🎨 **Mood-Based Generation**: Choose from Happy, Sad, or Motivated moods
- 🖼️ **Multiple Image Providers**: Fetches beautiful images from Unsplash API and other sources
- ✨ **AI-Generated Quotes**: Creates personalized quotes using OpenAI API and other AI providers
- 🎭 **Theme Selection**: Multiple beautiful themes for wallpaper styling
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop
- 🎬 **Smooth Animations**: Beautiful Framer Motion animations throughout
- ⬇️ **Download Functionality**: Save wallpapers as high-resolution PNG files
- 📤 **Share Feature**: Easy sharing of generated wallpapers
- 🔄 **History Panel**: Keep track of previously generated wallpapers
- ✏️ **Custom Quotes**: Add your own inspirational quotes
- ⚙️ **API Key Management**: Secure local storage of API keys
- 🎯 **Production Ready**: Optimized for deployment

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Multiple Image APIs** (Unsplash and more)
- **Multiple AI Providers** (OpenAI and alternatives)
- **html2canvas** for wallpaper download
- **Vitest** + Testing Library for comprehensive testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Optional API keys for enhanced functionality:
  - Unsplash API access key
  - OpenAI API key
  - Other supported AI providers

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mood-wallpaper-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional)**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

   **Note**: API keys are optional! The app works perfectly with fallback content. You can also add API keys directly in the app using the settings button (⚙️) in the top-right corner.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint

## Testing

This project includes comprehensive tests with excellent coverage:

```bash
# Run all tests
npm run test

# Run tests with coverage report
npm run test:coverage
```

Tests cover:
- ✅ Component rendering and interactions
- ✅ API hooks functionality
- ✅ Utility functions
- ✅ Error handling and edge cases
- ✅ Loading states and conditional rendering
- ✅ History management
- ✅ Theme selection
- ✅ Custom quote functionality

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ApiKeySettings.tsx      # API key management modal
│   ├── CustomQuoteInput.tsx    # Custom quote input component
│   ├── DownloadButton.tsx      # Download functionality
��   ├── ErrorMessage.tsx        # Error display component
│   ├── HistoryPanel.tsx        # Wallpaper history management
│   ├── ImageDisplay.tsx        # Image rendering component
│   ├── LoadingSpinner.tsx      # Loading state component
│   ├── MoodCard.tsx            # Mood selection cards
│   ├── ShareButton.tsx         # Social sharing functionality
│   └── ThemeSelector.tsx       # Theme selection component
├── pages/              # Page components
│   └── Home.tsx               # Main application page
├── hooks/              # Custom React hooks
│   ├── useApiKeys.ts          # API key management
│   ├── useImageAPI.ts         # Image provider abstraction
│   ├── useOpenAI.ts           # OpenAI integration
│   ├── useUnsplashAPI.ts      # Unsplash integration
│   └── useWallpaperHistory.ts # History management
├── config/             # Configuration files
│   ├── aiProviders.ts         # AI provider configurations
│   ├── imageProviders.ts      # Image provider configurations
│   ├── moods.ts               # Mood definitions
│   └── themes.ts              # Theme configurations
├── types/              # TypeScript type definitions
│   └��─ index.ts
├── utils/              # Utility functions
│   ├── clipboardTest.ts       # Clipboard functionality
│   ├── downloadImage.ts       # Image download utilities
│   └── historyStorage.ts      # Local storage management
├── __tests__/          # Test files
│   ├── components/            # Component tests
│   ├── hooks/                 # Hook tests
│   ├── pages/                 # Page tests
│   └── utils/                 # Utility tests
└── test/               # Test setup
    └── setup.ts
```

## How It Works

1. **Mood Selection**: Users choose from three mood categories (Happy, Sad, Motivated)
2. **Theme Selection**: Pick from multiple beautiful themes for wallpaper styling
3. **API Configuration**: Users can optionally add their API keys via the settings modal (⚙️ button)
4. **Image Fetching**: App queries multiple image providers with mood-specific search terms
5. **Quote Generation**: Multiple AI providers generate personalized quotes or use curated fallbacks
6. **Custom Quotes**: Users can input their own inspirational quotes
7. **Wallpaper Creation**: Quote is overlaid on the image with beautiful themed typography
8. **History Tracking**: All generated wallpapers are saved locally for easy access
9. **Download & Share**: Users can download wallpapers as high-resolution PNGs or share them

## API Key Management

The app includes a comprehensive API key management system:

- **Settings Modal**: Click the ⚙️ button in the top-right corner
- **Multiple Providers**: Support for various AI and image providers
- **Local Storage**: API keys are stored securely in your browser's local storage
- **Privacy**: Keys never leave your device or get sent to our servers
- **Optional**: The app works great without any API keys using curated fallback content
- **Enhanced Experience**: With API keys, you get fresh images and AI-generated quotes

## Supported Providers

### Image Providers
- **Unsplash**: High-quality stock photography
- **Fallback Images**: Curated collection when APIs unavailable

### AI Providers
- **OpenAI**: GPT-powered quote generation
- **Alternative Providers**: Multiple AI services for quote generation
- **Fallback Quotes**: Curated inspirational quotes when APIs unavailable

## API Setup Guides

### Unsplash API Setup
1. Create account at [Unsplash Developers](https://unsplash.com/developers)
2. Create new application
3. Copy Access Key to `VITE_UNSPLASH_ACCESS_KEY`

### OpenAI API Setup
1. Create account at [OpenAI Platform](https://platform.openai.com)
2. Generate API key
3. Add to `VITE_OPENAI_API_KEY`

## Deployment

### Vercel (Recommended)

#### Option 1: Deploy from GitHub
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables in Vercel dashboard
6. Deploy!

#### Option 2: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod

# Set environment variables
vercel env add VITE_UNSPLASH_ACCESS_KEY
vercel env add VITE_OPENAI_API_KEY
```

### Other Platforms
The app can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Unsplash](https://unsplash.com) for beautiful, free images
- [OpenAI](https://openai.com) for AI-powered quote generation
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [TailwindCSS](https://tailwindcss.com) for utility-first styling
- [Vite](https://vitejs.dev) for lightning-fast development
- [Vitest](https://vitest.dev) for comprehensive testing
