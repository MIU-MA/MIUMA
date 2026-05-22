import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{vue,ts}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            pre: {
              backgroundColor: '#f1f5f9',
              borderRadius: '0.5rem',
            },
          },
        },
        invert: {
          css: {
            pre: {
              backgroundColor: '#161b22',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
