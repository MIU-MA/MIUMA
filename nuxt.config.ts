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

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.jxufe-tech.top',
    },
  },

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

  /** /admin 路由关闭 SSR，纯客户端渲染，避免 useCookie SSG 阶段不可用 */
  routeRules: {
    '/admin/**': { ssr: false },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('blog-theme');if(!t)t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
          tagPriority: 'critical',
        },
      ],
    },
  },
})
