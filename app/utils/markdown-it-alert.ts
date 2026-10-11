type HastNode = {
  type?: string
  tagName?: string
  properties?: Record<string, unknown>
  value?: string
  lang?: string
  children?: HastNode[]
}

const ALERT_RE = /^\s*\[?!(NOTE|WARNING|IMPORTANT|CAUTION)\]?\s*/i

const alertConfig: Record<string, { icon: string; classes: string; titleClasses: string; title: string }> = {
  NOTE: {
    icon: '\u24d8',
    title: 'Note',
    classes: 'marked-alert border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-r-lg p-4 my-4',
    titleClasses: 'marked-alert-title text-blue-700 dark:text-blue-400 font-semibold text-sm mb-1',
  },
  WARNING: {
    icon: '\u26a0',
    title: 'Warning',
    classes: 'marked-alert border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 rounded-r-lg p-4 my-4',
    titleClasses: 'marked-alert-title text-yellow-700 dark:text-yellow-400 font-semibold text-sm mb-1',
  },
  IMPORTANT: {
    icon: '\u2726',
    title: 'Important',
    classes: 'marked-alert border-l-4 border-l-violet-500 bg-violet-50 dark:bg-violet-950/30 rounded-r-lg p-4 my-4',
    titleClasses: 'marked-alert-title text-violet-700 dark:text-violet-400 font-semibold text-sm mb-1',
  },
  CAUTION: {
    icon: '\u25b2',
    title: 'Caution',
    classes: 'marked-alert border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/30 rounded-r-lg p-4 my-4',
    titleClasses: 'marked-alert-title text-red-700 dark:text-red-400 font-semibold text-sm mb-1',
  },
}

function isElement(node: HastNode | undefined, tagName: string) {
  return node?.type === 'element' && node.tagName === tagName
}

function toText(node: HastNode | undefined): string {
  if (!node) return ''
  if (node.type === 'text') return node.value || ''
  return (node.children || []).map(child => toText(child)).join('')
}

function removeLeadingText(node: HastNode, count: number): number {
  if (count <= 0) return 0

  if (node.type === 'text') {
    const value = node.value || ''
    node.value = value.slice(count)
    return Math.max(0, count - value.length)
  }

  for (const child of node.children || []) {
    count = removeLeadingText(child, count)
    if (count <= 0) break
  }

  return count
}

function hasVisibleContent(node: HastNode) {
  return toText(node).trim().length > 0
    || (node.children || []).some(child => child.type === 'element' && child.tagName !== 'br')
}

function visit(node: HastNode | undefined) {
  if (!node) return

  if (isElement(node, 'pre')) {
    normalizeCodeLanguage(node)
  }

  if (isElement(node, 'blockquote')) {
    transformAlertBlockquote(node)
  }

  for (const child of node.children || []) {
    visit(child)
  }
}

function visitMarkdown(node: HastNode | undefined) {
  if (!node) return

  if (node.type === 'code') {
    normalizeMarkdownCodeLanguage(node)
  }

  for (const child of node.children || []) {
    visitMarkdown(child)
  }
}

const codeLanguageAliases: Record<string, string> = {
  'c++': 'cpp',
  text: 'plaintext',
}

function normalizeMarkdownCodeLanguage(node: HastNode) {
  const language = codeLanguageAliases[String(node.lang || '').toLowerCase()]
  if (language) node.lang = language
}

function normalizeCodeLanguage(node: HastNode) {
  const properties = node.properties
  if (!properties) return

  const originalLanguage = String(properties.language || '').toLowerCase()
  const language = codeLanguageAliases[originalLanguage]
  if (!language) return

  properties.language = language

  const normalizeClassName = (item: unknown) =>
    typeof item === 'string' && item.toLowerCase() === `language-${originalLanguage}`
      ? `language-${language}`
      : item

  const className = properties.className
  if (Array.isArray(className)) {
    properties.className = className.map(normalizeClassName)
  } else if (typeof className === 'string') {
    properties.className = className.split(/(\s+)/).map(normalizeClassName).join('')
  }
}

function transformAlertBlockquote(node: HastNode) {
  const firstParagraphIndex = (node.children || []).findIndex(child => isElement(child, 'p'))
  if (firstParagraphIndex === -1) return

  const firstParagraph = node.children![firstParagraphIndex]
  if (!firstParagraph) return

  const markerMatch = toText(firstParagraph).match(ALERT_RE)
  if (!markerMatch) return

  const alertType = markerMatch[1]?.toUpperCase()
  if (!alertType) return

  const config = alertConfig[alertType]
  if (!config) return

  removeLeadingText(firstParagraph, markerMatch[0].length)

  node.tagName = 'div'
  node.properties = {
    ...node.properties,
    className: config.classes.split(' '),
  }

  const titleNode: HastNode = {
    type: 'element',
    tagName: 'p',
    properties: {
      className: config.titleClasses.split(' '),
    },
    children: [
      { type: 'text', value: `${config.icon} ${config.title}` },
    ],
  }

  if (hasVisibleContent(firstParagraph)) {
    node.children!.splice(firstParagraphIndex, 0, titleNode)
  } else {
    node.children!.splice(firstParagraphIndex, 1, titleNode)
  }
}

export function remarkCodeLanguageAliasPlugin() {
  return (tree: HastNode) => {
    visitMarkdown(tree)
  }
}

export default function rehypeGithubAlertPlugin() {
  return (tree: HastNode) => {
    visit(tree)
  }
}
