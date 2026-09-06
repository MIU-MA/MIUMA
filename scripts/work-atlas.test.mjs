import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'
import * as Three from 'three'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js'

function loadTypeScript(path, modules = {}, environment = {}) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
  const exports = {}
  const names = Object.keys(environment)
  const require = id => {
    if (!(id in modules)) throw new Error(`Unexpected import: ${id}`)
    return modules[id]
  }
  new Function('require', 'exports', ...names, outputText)(require, exports, ...Object.values(environment))
  return exports
}

const layout = loadTypeScript('../app/utils/work-atlas-layout.ts')
const { workNodes } = loadTypeScript('../app/data/works.ts')

test('floating descriptions fit phone and desktop edges without covering the view controls', () => {
  for (const viewport of [{ width: 320, height: 420 }, { width: 390, height: 700 }, { width: 1440, height: 850 }]) {
    const panel = { width: Math.min(320, viewport.width - 32), height: Math.min(285, viewport.height - 192) }
    for (const x of [-100, 0, viewport.width / 2, viewport.width, viewport.width + 100]) {
      for (const y of [-100, 0, viewport.height / 2, viewport.height, viewport.height + 100]) {
        const position = layout.placeWorkPopover({ x, y }, viewport, panel)
        assert.ok(position.left >= 16)
        assert.ok(position.top >= 16)
        assert.ok(position.left + panel.width <= viewport.width - 16)
        assert.ok(position.top + panel.height <= viewport.height - 76)
      }
    }
  }
  const rightEdge = layout.placeWorkPopover({ x: 990, y: 300 }, { width: 1024, height: 768 }, { width: 320, height: 280 })
  assert.ok(rightEdge.left + 320 < 990, 'description flips to the left of a point near the right edge')
})

test('adding projects preserves a connected graph without duplicate links or self links', () => {
  const configurations = [[], [[0, 0, 0]], workNodes.map(node => node.position), Array.from({ length: 60 }, (_, i) => [Math.sin(i * 1.3) * 12, Math.cos(i * 2.7) * 9, i % 7])]
  for (const positions of configurations) {
    const edges = layout.connectWorkPoints(positions)
    assert.equal(new Set(edges.map(([a, b]) => [a, b].sort((x, y) => x - y).join(':'))).size, edges.length)
    for (const [a, b] of edges) { assert.notEqual(a, b); assert.ok(positions[a]); assert.ok(positions[b]) }
    if (positions.length === 0) { assert.deepEqual(edges, []); continue }
    const reached = new Set([0])
    for (let pass = 0; pass < positions.length; pass++) {
      for (const [a, b] of edges) {
        if (reached.has(a)) reached.add(b)
        if (reached.has(b)) reached.add(a)
      }
    }
    assert.equal(reached.size, positions.length)
  }
})

test('camera interaction settles, honors reduced motion, pauses offscreen, and releases its resources', () => {
  const frames = new Map()
  let nextId = 0
  let time = 0
  let renderer
  let projected = []
  class RendererStub {
    renders = 0
    disposed = 0
    lost = 0
    constructor() { renderer = this }
    setPixelRatio() {}
    setSize() {}
    render(scene) { this.scene = scene; this.renders++ }
    dispose() { this.disposed++ }
    forceContextLoss() { this.lost++ }
  }
  const { createWorkAtlasScene } = loadTypeScript('../app/utils/work-atlas-scene.ts', {
    three: { ...Three, WebGLRenderer: RendererStub },
    'three/addons/lines/LineMaterial.js': { LineMaterial },
    'three/addons/lines/LineSegments2.js': { LineSegments2 },
    'three/addons/lines/LineSegmentsGeometry.js': { LineSegmentsGeometry },
    './work-atlas-layout': layout,
  }, {
    window: { devicePixelRatio: 2 },
    requestAnimationFrame: callback => { const id = ++nextId; frames.set(id, callback); return id },
    cancelAnimationFrame: id => frames.delete(id),
  })
  const controller = createWorkAtlasScene({}, workNodes.map(node => node.position), points => { projected = points })
  const flush = () => {
    for (let pass = 0; frames.size && pass < 500; pass++) {
      time += 16
      const pending = [...frames.values()]
      frames.clear()
      pending.forEach(callback => callback(time))
    }
    assert.equal(frames.size, 0, 'idle scenes must not run an endless animation loop')
  }
  controller.resize(1200, 740)
  controller.setTheme('#ffffff', '#171717')
  flush()
  assert.equal(projected.length, workNodes.length)
  assert.ok(projected.every(point => Number.isFinite(point.x) && Number.isFinite(point.y)))
  const graph = renderer.scene.children.find(object => object.isLineSegments2)
  assert.ok(graph, 'use mesh-based strokes that can render wider than a native WebGL line')
  assert.ok(graph.material.linewidth >= 1.5)
  assert.equal(graph.material.worldUnits, false, 'zoom must not shrink the line width')
  for (const [background, foreground] of [['#ffffff', '#18181b'], ['#111111', '#f4f4f5']]) {
    controller.setTheme(background, foreground)
    flush()
    const luminance = color => color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722
    const backgroundLuminance = luminance(new Three.Color(background))
    for (const attribute of ['instanceColorStart', 'instanceColorEnd']) {
      const colors = graph.geometry.getAttribute(attribute)
      for (let index = 0; index < colors.count; index++) {
        const edgeLuminance = luminance(new Three.Color().fromBufferAttribute(colors, index))
        const contrast = (Math.max(backgroundLuminance, edgeLuminance) + 0.05) / (Math.min(backgroundLuminance, edgeLuminance) + 0.05)
        assert.ok(contrast >= 2, 'even rear edges should remain distinct from the background')
      }
    }
  }
  const colorBuffer = graph.geometry.getAttribute('instanceColorStart').data
  const colorVersion = colorBuffer.version
  controller.select(0)
  flush()
  assert.ok(colorBuffer.version > colorVersion, 'selection must upload the updated line colors')
  controller.select(null)
  for (const [width, height] of [[390, 700], [1200, 740]]) {
    controller.resize(width, height)
    flush()
    assert.deepEqual(graph.material.resolution.toArray(), [width, height])
  }
  const before = projected.map(point => [point.x, point.y])
  controller.rotate(80, 30)
  flush()
  assert.notDeepEqual(projected.map(point => [point.x, point.y]), before)
  controller.reset()
  flush()
  const spread = () => projected.reduce((sum, point) => sum + (point.x - 600) ** 2 + (point.y - 370) ** 2, 0)
  const originalSpread = spread()
  controller.zoom(0.82)
  flush()
  assert.ok(spread() > originalSpread)
  controller.setVisible(false)
  const renders = renderer.renders
  controller.rotate(100, 10)
  assert.equal(frames.size, 0)
  assert.equal(renderer.renders, renders)
  controller.setVisible(true)
  flush()
  controller.setReducedMotion(true)
  controller.rotate(60, 20)
  const pending = [...frames.values()]
  frames.clear()
  pending.forEach(callback => callback(time += 16))
  assert.equal(frames.size, 0, 'reduced motion should apply the new view in one frame')
  let geometryDisposals = 0
  renderer.scene.traverse(object => object.geometry?.addEventListener('dispose', () => geometryDisposals++))
  controller.rotate(20, 0)
  controller.destroy()
  controller.destroy()
  assert.equal(frames.size, 0)
  assert.equal(renderer.disposed, 1)
  assert.equal(renderer.lost, 1)
  assert.equal(geometryDisposals, 4)
})
