import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss()
  ],
    resolve: {
      alias: {
          '@stf/components/common': path.resolve(__dirname, 'src/components/common'),
          '@stf/components/layout': path.resolve(__dirname, 'src/components/layout'),
          '@stf/features': path.resolve(__dirname, 'src/features'),
          '@stf/lib': path.resolve(__dirname, 'src/lib'),
          '@stf/hooks': path.resolve(__dirname, 'src/hooks'),
          '@stf/models': path.resolve(__dirname, 'src/models'),
          '@stf/pages': path.resolve(__dirname, 'src/pages'),
          '@stf/store': path.resolve(__dirname, 'src/store'),
          '@stf/utils': path.resolve(__dirname, 'src/utils'),
          '@sts/models': path.resolve(__dirname, '../shared/models'),
          '@sts/schemas': path.resolve(__dirname, '../shared/schemas'),
      }
    },
    envPrefix: 'VITE_'
})
