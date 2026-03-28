import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel({ nodeVersion: '20.x' }),
  integrations: [tailwind()],
  site: 'https://example.vercel.app',
});
