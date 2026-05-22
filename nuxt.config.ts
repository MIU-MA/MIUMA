/// <reference types="nuxt" />
/// <reference path="./.nuxt/types/modules.d.ts" />

import rehypeGithubAlertPlugin, { remarkCodeLanguageAliasPlugin } from './app/utils/markdown-it-alert'

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  css: ['~/assets/css/main.css', 'katex/dist/katex.min.css'],

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],

  content: {
    renderer: {
      anchorLinks: false,
    },
    build: {
      markdown: {
        remarkPlugins: {
          'github-alert-code-aliases': {
            instance: remarkCodeLanguageAliasPlugin,
          },
        },
        rehypePlugins: {
          'github-alerts': {
            instance: rehypeGithubAlertPlugin,
          },
        },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: ['cpp', 'c', 'python', 'javascript', 'typescript', 'bash', 'json', 'xml'],
        },
      },
    },
  },

  i18n: {
    locales: [
      { code: 'zh', iso: 'zh-CN', file: 'zh.json' },
      { code: 'en', iso: 'en-US', file: 'en.json' },
    ],
    defaultLocale: 'zh',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    detectBrowserLanguage: false,
  },

  image: {
    format: ['avif', 'webp'],
  },
})
