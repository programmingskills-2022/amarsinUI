import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    dts({
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace('path/to/file.d.ts', 'index.d.ts'),
        content,
      }),
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://api.dotis.ir',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@emotion/react': '@emotion/react',
      '@emotion/styled': '@emotion/styled',
    },
  },
})