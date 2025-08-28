# Amarsin UI

A modern React application with TypeScript, Tailwind CSS, and Zustand for state management.

## Features

- React with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- React Query for API data fetching
- React Router for navigation
- Custom authentication system
- Persian font (Vazir) support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (if needed for environment variables)

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── api/          # API configuration and services
├── assets/       # Static assets (fonts, images)
├── components/   # Reusable components
├── hooks/        # Custom React hooks
├── pages/        # Page components
├── store/        # Zustand store definitions
└── styles/       # Global styles and Tailwind config
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Font Configuration

The project uses the Vazir font. Place the font files in the following directory:
```
src/assets/fonts/
├── Vazir.woff
└── Vazir.woff2
``` 