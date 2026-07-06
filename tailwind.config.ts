import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{vue,ts}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        black: '#111111',
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              backgroundColor: '#fafafa',
              border: '1px solid #000000',
            },
          },
        },
        invert: {
          css: {
            pre: {
              backgroundColor: '#0a0a0a',
              border: '1px solid #ffffff',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
