import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jeongjinkim.com',
  output: 'static',
  redirects: {
    '/contact': '/',
  },
});
