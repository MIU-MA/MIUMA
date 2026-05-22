import katex from 'katex'

let isRenderingMath = false

function renderMathInProse(root: ParentNode = document) {
  if (isRenderingMath) return

  isRenderingMath = true

  const els = Array.from(root.querySelectorAll('.prose'))
  try {
    for (const el of els) {
      const currentHtml = el.innerHTML
      const nextHtml = currentHtml
        .replace(/\$\$(.+?)\$\$/gs, (_, expr) => {
          try {
            return katex.renderToString(expr, { displayMode: true, throwOnError: false })
          } catch (e) {
            return `$$${expr}$$`
          }
        })
        .replace(/\$(.+?)\$/gs, (_, expr) => {
          // Avoid replacing already-rendered katex (contains class "katex")
          if (expr.includes('class="katex"')) return `$${expr}$`
          try {
            return katex.renderToString(expr, { displayMode: false, throwOnError: false })
          } catch (e) {
            return `$${expr}$`
          }
        })

      if (nextHtml !== currentHtml) {
        el.innerHTML = nextHtml
      }
    }
  } finally {
    isRenderingMath = false
  }
}

export default defineNuxtPlugin(() => {
  // Initial render after mount
  window.requestAnimationFrame(() => renderMathInProse())

  // Render after each route change
  const router = useRouter()
  const removeAfterEach = router.afterEach(() => {
    // slight delay to allow DOM updates
    setTimeout(() => renderMathInProse(), 50)
  })

  // Also observe DOM changes inside content containers
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes.length) renderMathInProse()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })

  window.addEventListener('beforeunload', () => {
    removeAfterEach()
    observer.disconnect()
  }, { once: true })
})
