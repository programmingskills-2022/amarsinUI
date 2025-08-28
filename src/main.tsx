import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

//import theme from './components/layout/theme';
import { GeneralProvider } from "./context/GeneralContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from 'stylis-plugin-rtl';

const theme = createTheme({
  direction: "rtl", // <-- This enables RTL for MUI
  typography: {
    fontFamily: "Vazir, sans-serif",
  },
});
// Create an Emotion cache that inserts styles after Tailwind's styles
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GeneralProvider>
      <CacheProvider value={cacheRtl}>
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
      </CacheProvider>      
    </GeneralProvider>
  </React.StrictMode>
);
