import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://utpal.dev',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    sitemap(),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
