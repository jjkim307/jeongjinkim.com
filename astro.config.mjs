import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jeongjinkim.com',
  output: 'static',

  redirects: {
    '/contact': '/',
  },

  integrations: [sitemap()],
});