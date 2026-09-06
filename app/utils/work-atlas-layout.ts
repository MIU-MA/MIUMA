export interface AtlasPoint {
  x: number
  y: number
  depth: number
  visible: boolean
  opacity: number
}

export interface AtlasSize { width: number; height: number }
export type AtlasPosition = readonly [number, number, number]

export const clampAtlas = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max))

export function placeWorkPopover(anchor: Pick<AtlasPoint, 'x' | 'y'>, viewport: AtlasSize, panel: AtlasSize) {
  const margin = 16
  const width = Math.min(panel.width, Math.max(0, viewport.width - margin * 2))
  const gap = 24
  const rightFits = anchor.x + gap + width <= viewport.width - margin
  const left = clampAtlas(rightFits ? anchor.x + gap : anchor.x - gap - width, margin, viewport.width - width - margin)
  const minTop = viewport.height >= 400 ? 108 : margin
  const maxTop = viewport.height - panel.height - 76
  const top = clampAtlas(anchor.y - 30, Math.min(minTop, Math.max(margin, maxTop)), Math.max(margin, maxTop))
  return { left, top }
}

export function connectWorkPoints(positions: readonly AtlasPosition[]): [number, number][] {
  if (positions.length < 2) return []
  const distance = (a: number, b: number) => {
    const first = positions[a]!
    const second = positions[b]!
    return first.reduce((sum, coordinate, axis) => sum + (coordinate - second[axis]!) ** 2, 0)
  }
  const edges: [number, number][] = []
  const keys = new Set<string>()
  const add = (a: number, b: number) => {
    const key = `${Math.min(a, b)}:${Math.max(a, b)}`
    if (a !== b && !keys.has(key)) { keys.add(key); edges.push([a, b]) }
  }
  const connected = new Set([0])
  while (connected.size < positions.length) {
    let closest: [number, number] = [0, 0]
    let minimum = Infinity
    for (const a of connected) {
      for (let b = 0; b < positions.length; b++) {
        if (connected.has(b)) continue
        const next = distance(a, b)
        if (next < minimum) { minimum = next; closest = [a, b] }
      }
    }
    add(...closest)
    connected.add(closest[1])
  }
  for (let a = 0; a < positions.length; a++) {
    const neighbors = positions.map((_, b) => b).filter(b => b !== a).sort((b, c) => distance(a, b) - distance(a, c))
    for (const b of neighbors.slice(0, 2)) add(a, b)
  }
  return edges
}
