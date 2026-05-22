import _RemarkEmoji from 'remark-emoji'
import _GithubAlertCodeAliases from 'github-alert-code-aliases'
import _GithubAlerts from 'github-alerts'
import _Highlight from 'C:/Users/j1829/Desktop/blog-nuxt4/node_modules/@nuxtjs/mdc/dist/runtime/highlighter/rehype-nuxt.js'

export const remarkPlugins = {
  'remark-emoji': { instance: _RemarkEmoji },
  'github-alert-code-aliases': { instance: _GithubAlertCodeAliases, options: {} },
}

export const rehypePlugins = {
  'github-alerts': { instance: _GithubAlerts, options: {} },
  'highlight': { instance: _Highlight, options: {} },
}

export const highlight = {"theme":{"default":"github-light","dark":"github-dark"}}