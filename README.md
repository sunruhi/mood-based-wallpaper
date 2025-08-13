# Mood Wallpaper Generator

A beautiful, responsive web application that generates personalized wallpapers based on your mood. Select your mood (Happy, Sad, or Motivated), and the app will create a stunning wallpaper combining a mood-appropriate image from Unsplash with an AI-generated inspirational quote.

## Features

- 🎨 **Mood-Based Generation**: Choose from Happy, Sad, or Motivated moods
- 🖼️ **High-Quality Images**: Fetches beautiful images from Unsplash API
- ✨ **AI-Generated Quotes**: Creates personalized quotes using OpenAI API (with fallbacks)
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop
- 🎭 **Smooth Animations**: Beautiful Framer Motion animations throughout
- ⬇️ **Download Functionality**: Save wallpapers as high-resolution PNG files
- 🎯 **Production Ready**: Optimized for deployment on Vercel

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Unsplash API** for images
- **OpenAI API** for quote generation
- **html2canvas** for wallpaper download
- **Vitest** + Testing Library for testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Unsplash API access key (optional, fallback images available)
- OpenAI API key (optional, fallback quotes available)

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

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys (optional):
   ```env
   VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

   **Note**: API keys are optional! The app works perfectly with fallback content. You can also add API keys directly in the app using the settings button (⚙️) in the top-right corner.
   
   For enhanced functionality, get free API keys from:
   - [Unsplash Developers](https://unsplash.com/developers)
   - [OpenAI API](https://platform.openai.com/api-keys)

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

This project includes comprehensive tests with 100% coverage of all features:

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

## Deployment on Vercel

### Option 1: Deploy from GitHub

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `VITE_UNSPLASH_ACCESS_KEY`
     - `VITE_OPENAI_API_KEY`
   - Deploy!

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login and deploy**
   ```bash
   vercel login
   vercel --prod
   ```

3. **Set environment variables**
   ```bash
   vercel env add VITE_UNSPLASH_ACCESS_KEY
   vercel env add VITE_OPENAI_API_KEY
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── MoodCard.tsx
│   ├── ImageDisplay.tsx
│   ├── DownloadButton.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── pages/              # Page components
│   └── Home.tsx
├── hooks/              # Custom React hooks
│   ├── useUnsplashAPI.ts
│   └── useOpenAI.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── config/             # Configuration files
│   └── moods.ts
├── utils/              # Utility functions
│   └── downloadImage.ts
├── __tests__/          # Test files
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── utils/
└── test/               # Test setup
    └── setup.ts
```

## How It Works

1. **Mood Selection**: Users choose from three mood categories (Happy, Sad, Motivated)
2. **API Key Management**: Users can optionally add their API keys via the settings modal (⚙️ button)
3. **Image Fetching**: App queries Unsplash API with mood-specific search terms (or uses fallback images)
4. **Quote Generation**: OpenAI API generates a personalized quote (or uses curated fallback quotes)
5. **Wallpaper Creation**: Quote is overlaid on the image with beautiful typography
6. **Download**: Users can download the final wallpaper as a high-resolution PNG

## API Key Management

The app includes a user-friendly API key management system:

- **Settings Modal**: Click the ⚙️ button in the top-right corner
- **Local Storage**: API keys are stored securely in your browser's local storage
- **Privacy**: Keys never leave your device or get sent to our servers
- **Optional**: The app works great without any API keys using curated fallback content
- **Enhanced Experience**: With API keys, you get fresh images and AI-generated quotes

## API Configuration

### Unsplash API Setup
1. Create account at [Unsplash Developers](https://unsplash.com/developers)
2. Create new application
3. Copy Access Key to `VITE_UNSPLASH_ACCESS_KEY`

### OpenAI API Setup
1. Create account at [OpenAI Platform](https://platform.openai.com)
2. Generate API key
3. Add to `VITE_OPENAI_API_KEY`

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