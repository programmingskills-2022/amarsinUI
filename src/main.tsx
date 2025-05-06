import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import { ThemeProvider } from '@mui/material/styles';
import theme from './components/layout/theme';
import { GeneralProvider } from "./context/GeneralContext";

// Create an Emotion cache that inserts styles after Tailwind's styles
const emotionCache = createCache({
  key: 'emotion-css',
  prepend: true, // Ensures Emotion styles are inserted before other styles
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GeneralProvider>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </CacheProvider>      
    </GeneralProvider>
  </React.StrictMode>
);
