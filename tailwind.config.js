import { transform } from 'lodash';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        'full-minus-40': 'calc(100% - 40px)',
        'full-minus-24': 'calc(100% - 24px)',
        'full-minus-12': 'calc(100% - 12px)',
        '50-minus-24': 'calc(50% - 24px)',
        '25-minus-24': 'calc(25% - 24px)',
      },
      height: {
        'screen-minus-500': 'calc(100vh - 500px)',
        'screen-minus-400': 'calc(100vh - 400px)',
        'screen-minus-300': 'calc(100vh - 300px)',
        'screen-minus-260': 'calc(100vh - 260px)',
        'screen-minus-200': 'calc(100vh - 200px)',
      },
      keyframes:{
        'open-modal' :{
          '0%':{transform: 'scaleY(0)'},
          '80%':{transform: 'scaleY(1.2)'},
          '100%':{transform: 'scaleY(1)'},
        },
        'open-modalMsg':{
          '0%':{transform: 'scaleX(0)'},
          '80%':{transform: 'scaleX(1.2)'},
          '100%':{transform: 'scaleX(1)'},
        }
      },
      animation:{
        'open-modal':'open-modal 0.5s ease-in-out forwards',
        'open-modalMsg':'open-modalMsg 1s ease-in-out forwards',
      }

    },
  },
  plugins: [],
  mode: 'jit',
  safelist: [
    'hover:bg-green-600',
    'hover:bg-green-500',
    'hover:bg-blue-600',
    'hover:bg-blue-500',
    // other classes you want to ensure
  ],
} 