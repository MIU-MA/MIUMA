import * as THREE from 'three'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js'
import { clampAtlas, connectWorkPoints, type AtlasPoint, type AtlasPosition } from './work-atlas-layout'

export interface WorkAtlasController {
  resize: (width: number, height: number) => void
  rotate: (horizontal: number, vertical: number) => void
  zoom: (factor: number) => void
  reset: () => void
  select: (index: number | null) => void
  setTheme: (background: string, foreground: string) => void
  setReducedMotion: (reduced: boolean) => void
  setVisible: (visible: boolean) => void
  destroy: () => void
}

export function createWorkAtlasScene(
  canvas: HTMLCanvasElement,
  positions: readonly AtlasPosition[],
  onFrame: (points: AtlasPoint[]) => void,
): WorkAtlasController {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 250)
  const background = new THREE.Color('#ffffff')
  const foreground = new THREE.Color('#171717')
  const backgroundSRGB = background.clone().convertLinearToSRGB()
  const foregroundSRGB = foreground.clone().convertLinearToSRGB()
  scene.background = background
  const nodes = positions.map(position => new THREE.Vector3(...position))
  const edges = connectWorkPoints(positions)
  const geometry = new LineSegmentsGeometry().setPositions(edges.flatMap(([a, b]) => [...positions[a]!, ...positions[b]!]))
  const colors = new Float32Array(edges.length * 6)
  geometry.setColors(colors)
  const colorAttribute = geometry.getAttribute('instanceColorStart') as THREE.InterleavedBufferAttribute
  colorAttribute.data.setUsage(THREE.DynamicDrawUsage)
  // Mesh-based lines keep a real two-pixel stroke across WebGL implementations.
  const material = new LineMaterial({ vertexColors: true, linewidth: 2, worldUnits: false, alphaToCoverage: true })
  scene.add(new LineSegments2(geometry, material))

  const helpers = new THREE.Group()
  const helperMaterial = new THREE.LineDashedMaterial({ color: foreground, opacity: 0.08, transparent: true, depthWrite: false, dashSize: 0.1, gapSize: 0.18 })
  const helperGeometries: THREE.BufferGeometry[] = []
  const extent = Math.max(7, ...nodes.map(node => node.length()))
  for (let axis = 0; axis < 3; axis++) {
    const start = new THREE.Vector3().setComponent(axis, -extent * 1.3)
    const end = new THREE.Vector3().setComponent(axis, extent * 1.3)
    const helperGeometry = new THREE.BufferGeometry().setFromPoints([start, end])
    const line = new THREE.Line(helperGeometry, helperMaterial)
    line.computeLineDistances()
    helpers.add(line)
    helperGeometries.push(helperGeometry)
  }
  scene.add(helpers)

  let width = 1
  let height = 1
  let baseDistance = 24
  let radius = 24
  let targetRadius = 24
  let theta = 0.34
  let targetTheta = theta
  let phi = 1.08
  let targetPhi = phi
  let selected: number | null = null
  let reducedMotion = false
  let visible = true
  let initialized = false
  let disposed = false
  let frame = 0
  let lastTime = 0
  const color = new THREE.Color()

  function draw(time: number) {
    frame = 0
    if (disposed || !visible) return
    const elapsed = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60
    lastTime = time
    const ease = reducedMotion ? 1 : 1 - Math.exp(-elapsed * 10)
    theta += (targetTheta - theta) * ease
    phi += (targetPhi - phi) * ease
    radius += (targetRadius - radius) * ease
    camera.position.set(radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.cos(theta))
    camera.lookAt(0, 0, 0)
    camera.updateMatrixWorld()
    const distances = nodes.map(node => camera.position.distanceTo(node))
    const near = Math.min(...distances)
    const far = Math.max(...distances)
    const span = Math.max(1, far - near)
    edges.forEach(([a, b], edgeIndex) => {
      for (const [offset, index] of [[0, a], [1, b]] as const) {
        const depth = 1 - (distances[index]! - near) / span
        const linked = selected === a || selected === b
        const strength = selected === null ? 0.36 + depth * 0.34 : linked ? 0.86 : 0.24 + depth * 0.08
        // Blend display colors so rear edges stay readable in both themes.
        color.copy(backgroundSRGB).lerp(foregroundSRGB, strength).convertSRGBToLinear()
        color.toArray(colors, edgeIndex * 6 + offset * 3)
      }
    })
    colorAttribute.data.needsUpdate = true
    renderer.render(scene, camera)
    onFrame(nodes.map((node, index) => {
      const projected = node.clone().project(camera)
      const x = (projected.x * 0.5 + 0.5) * width
      const y = (-projected.y * 0.5 + 0.5) * height
      return {
        x, y, depth: projected.z,
        visible: projected.z >= -1 && projected.z <= 1 && x >= 22 && x <= width - 22 && y >= 110 && y <= height - 88,
        opacity: 0.75 + (1 - (distances[index]! - near) / span) * 0.25,
      }
    }))
    if (Math.abs(theta - targetTheta) + Math.abs(phi - targetPhi) + Math.abs(radius - targetRadius) > 0.001) {
      frame = requestAnimationFrame(draw)
    }
  }

  function invalidate() {
    if (!disposed && visible && !frame) { lastTime = 0; frame = requestAnimationFrame(draw) }
  }

  return {
    resize(nextWidth, nextHeight) {
      width = Math.max(1, nextWidth)
      height = Math.max(1, nextHeight)
      const previousBase = baseDistance
      baseDistance = extent / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.max(1, height / width) * 1.08
      if (!initialized) { radius = baseDistance; targetRadius = baseDistance; initialized = true }
      else { radius *= baseDistance / previousBase; targetRadius *= baseDistance / previousBase }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(width, height, false)
      material.resolution.set(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      invalidate()
    },
    rotate(horizontal, vertical) {
      targetTheta -= horizontal * 0.006
      targetPhi = clampAtlas(targetPhi - vertical * 0.005, 0.2, Math.PI - 0.2)
      invalidate()
    },
    zoom(factor) {
      if (!Number.isFinite(factor) || factor <= 0) return
      targetRadius = clampAtlas(targetRadius * factor, baseDistance * 0.45, baseDistance * 2)
      invalidate()
    },
    reset() { targetTheta = 0.34; targetPhi = 1.08; targetRadius = baseDistance; selected = null; invalidate() },
    select(index) { selected = index; invalidate() },
    setTheme(nextBackground, nextForeground) {
      background.set(nextBackground)
      foreground.set(nextForeground)
      backgroundSRGB.copy(background).convertLinearToSRGB()
      foregroundSRGB.copy(foreground).convertLinearToSRGB()
      helperMaterial.color.copy(foreground)
      invalidate()
    },
    setReducedMotion(value) { reducedMotion = value; invalidate() },
    setVisible(value) {
      visible = value
      if (visible) invalidate()
      else { cancelAnimationFrame(frame); frame = 0 }
    },
    destroy() {
      if (disposed) return
      disposed = true
      cancelAnimationFrame(frame)
      geometry.dispose()
      material.dispose()
      helperGeometries.forEach(item => item.dispose())
      helperMaterial.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
