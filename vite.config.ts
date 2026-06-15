/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    // --- CONFIGURACIÓN DE TESTING AÑADIDA AQUÍ ---
    test: {
      environment: 'jsdom', // Simula el navegador
      globals: true, // Permite usar describe, it, expect sin importarlos cada vez
      setupFiles: ['./src/setupTests.ts'], // Archivo que se ejecuta antes de las pruebas
      coverage: {
        provider: 'v8',
        include: ['src/components/**/*.{ts,tsx}', 'src/services/**/*.{ts,tsx}'],
        exclude: ['src/main.tsx', 'src/vite-env.d.ts', '**/*.test.tsx', '**/*.d.ts']
      }
    },
  };
});