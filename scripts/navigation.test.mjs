import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'
import { computed, ref } from 'vue'

function setup(scrollY = 0) {
  const listeners = new Map()
  const window = {
    scrollY,
    addEventListener: (name, listener) => listeners.set(name, listener),
    removeEventListener: (name, listener) => {
      assert.equal(listeners.get(name), listener)
      listeners.delete(name)
    },
  }
  let mount, unmount
  const source = readFileSync(new URL('../app/composables/useScrollHeader.ts', import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } })
  const exports = {}
  new Function('exports', 'ref', 'computed', 'onMounted', 'onUnmounted', 'window', outputText)(
    exports, ref, computed, callback => { mount = callback }, callback => { unmount = callback }, window,
  )
  const state = exports.useScrollHeader(80)
  mount()
  return {
    state, listeners, unmount,
    scroll(y) { window.scrollY = y; listeners.get('scroll')() },
  }
}

test('header stays visible on deep-link scroll restoration until the user scrolls down', () => {
  const { state, scroll } = setup(500)
  assert.equal(state.isHidden.value, false)
  assert.equal(state.isScroll.value, true)
  scroll(510)
  assert.equal(state.isHidden.value, true)
  scroll(509)
  assert.equal(state.isHidden.value, false)
})

test('header reappears near the top, including overscroll and stationary events', () => {
  const { state, scroll } = setup()
  scroll(200)
  assert.equal(state.isHidden.value, true)
  scroll(0)
  scroll(0)
  scroll(-10)
  scroll(50)
  assert.equal(state.isHidden.value, false)
  assert.equal(state.isScroll.value, false)
})

test('page navigation reveals the header and resets its scroll baseline', () => {
  const { state, scroll, unmount, listeners } = setup()
  scroll(1000)
  assert.equal(state.isHidden.value, true)
  state.reveal()
  assert.equal(state.isHidden.value, false)
  scroll(1000)
  assert.equal(state.isHidden.value, false)
  scroll(1001)
  assert.equal(state.isHidden.value, true)
  unmount()
  assert.equal(listeners.size, 0)
})
