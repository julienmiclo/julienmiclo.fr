// @ts-check
import {defineConfig, fontProviders} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import {satteri} from '@astrojs/markdown-satteri';

import {lede} from './src/utils/markdown/lede.mjs';
import {errorPages} from './src/utils/integrations/error-pages.mjs';

// https://astro.build/config
export default defineConfig({
  // URL publique : sert aux URL absolues (canonique, Open Graph, plan du site).
  site: 'https://julienmiclo.fr',
  fonts: [
      {
          provider: fontProviders.local(),
          name: 'Advercase',
          cssVariable: '--font-advercase',
          fallbacks: ['sans-serif'],
          options: {
              variants: [
                  {
                      src: ['./src/assets/fonts/advercasefont-regular-webfont.woff2'],
                      weight: '400',
                      style: 'normal',
                  },
                  {
                      src: ['./src/assets/fonts/advercasefont-bold-webfont.woff2'],
                      weight: '700',
                      style: 'normal',
                  },
              ],
          },
      },
      {
          provider: fontProviders.google(),
          name: 'JetBrains Mono',
          cssVariable: '--font-jetbrains-mono',
          weights: ['400', '700'],
          styles: ['normal'],
          subsets: ['latin'],
          fallbacks: ['monospace'],
      },
  ],

  vite: {
      plugins: [tailwindcss()],
      build: {
          rolldownOptions: {
              output: {
                  assetFileNames: ({names}) => names.some((name) => name.endsWith('.css'))
                      ? '_astro/style.[hash][extname]'
                      : '_astro/[name].[hash][extname]',
              },
          },
      },
  },

  integrations: [
      mdx({
          // Directives (`:::lede` … `:::`) activées uniquement pour les fichiers .mdx.
          processor: satteri({features: {directive: true}, mdastPlugins: [lede]}),
      }),
      sitemap({
          filter: (page) => !new URL(page).pathname.startsWith('/error/'),
      }),
      errorPages(),
  ],
});
