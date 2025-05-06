<<<<<<< HEAD
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 
=======
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import { ThemeProvider } from '@mui/material/styles';
import theme from './components/layout/theme';

// Create an Emotion cache that inserts styles after Tailwind's styles
const emotionCache = createCache({
  key: 'emotion-css',
  prepend: true, // Ensures Emotion styles are inserted before other styles
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
>>>>>>> cee5e85 (create menu)
