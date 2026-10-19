// 完整复刻 @nuxt/content createParser → mdc parseMarkdown 的真实调用形态
import { parseMarkdown, rehypeHighlight, createShikiHighlighter } from '@nuxtjs/mdc/runtime'
import { createOnigurumaEngine } from 'shiki'
import fs from 'node:fs'
import rehypeGithubAlertPlugin, { remarkCodeLanguageAliasPlugin } from './app/utils/markdown-it-alert.ts'

// ---- 照抄 module.mjs:1382 _getHighlightPlugin ----
const LANGS = Array.from(new Set([
  'bash', 'html', 'mdc', 'vue', 'yml', 'scss', 'ts', 'typescript',
  'cpp', 'c', 'python', 'py', 'java', 'go', 'rust', 'sql',
  'javascript', 'js', 'css', 'json', 'xml', 'yaml', 'ini', 'toml',
  'http', 'nginx', 'sh', 'shell', 'diff', 'md', 'markdown', 'dockerfile',
]))
const bundledLangs = {}
for (const l of LANGS) bundledLangs[l] = (await import(`@shikijs/langs/${l}`)).default

const themesObject = { default: 'github-light', dark: 'github-dark' }
const bundledThemes = {}
for (const [k, t] of Object.entries(themesObject)) bundledThemes[k] = (await import(`shiki/themes/${t}.mjs`)).default

const highlighter = createShikiHighlighter({
  bundledThemes,
  bundledLangs,
  engine: createOnigurumaEngine(import('shiki/wasm')),
})

const seen = []
const wrapped = async (code, lang, theme, opts) => {
  const r = await highlighter(code, lang, theme, opts)
  const colors = [...new Set([...JSON.stringify(r.tree).matchAll(/"--shiki-default:#([0-9A-Fa-f]{6})/g)].map(m => m[1]))]
  seen.push({ lang, colors: colors.length })
  return r
}

// 真实管线：rehype.plugins.highlight = { instance: rehypeHighlight, options: { highlighter, theme } }
const highlightPlugin = {
  instance: rehypeHighlight,
  options: { highlighter: wrapped, theme: bundledThemes },
}

const file = 'content/seo.md'
const raw = fs.readFileSync(file, 'utf8').replace(/^---[\s\S]*?\n---\n/, '')

const parsed = await parseMarkdown(raw, {
  rehype: {
    plugins: {
      'github-alerts': { instance: rehypeGithubAlertPlugin, options: {} },
      highlight: highlightPlugin,
    },
  },
  remark: {
    plugins: {
      'github-alert-code-aliases': { instance: remarkCodeLanguageAliasPlugin, options: {} },
    },
  },
})

console.log('highlighter 收到的语言：')
for (const s of seen) console.log(`  lang=${String(s.lang).padEnd(11)} 着色色数=${s.colors}`)
