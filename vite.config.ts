import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { cmsPlugin } from './vite-plugin-cms';

export default defineConfig({
  plugins: [react(), tailwindcss(), cmsPlugin()],
});
