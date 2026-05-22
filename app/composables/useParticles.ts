let ctx: CanvasRenderingContext2D | null = null
let canvas: HTMLCanvasElement | null = null
let animationId = 0
let particles: Particle[] = []
let mouse = { x: -9999, y: -9999 }
let frameSkip = 0
let lastIsDark = false

const PARTICLE_COUNT = 80
const MAX_DIST = 170
const MOUSE_RADIUS = 130

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number

  constructor(w: number, h: number) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = (Math.random() - 0.5) * 0.4
    this.vy = (Math.random() - 0.5) * 0.4
    this.r = Math.random() * 3 + 2
  }

  update(w: number, h: number) {
    this.x += this.vx
    this.y += this.vy

    const dx = this.x - mouse.x
    const dy = this.y - mouse.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < MOUSE_RADIUS && dist > 0) {
      const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.5
      this.vx += (dx / dist) * force
      this.vy += (dy / dist) * force
    }

    this.vx *= 0.999
    this.vy *= 0.999

    if (this.x < -10) this.x = w + 10
    if (this.x > w + 10) this.x = -10
    if (this.y < -10) this.y = h + 10
    if (this.y > h + 10) this.y = -10
  }
}

function initParticles(w: number, h: number) {
  particles = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle(w, h))
  }
}

function draw(isDark: boolean) {
  if (!ctx || !canvas) return
  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  const lineColor = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.3)'
  const dotColor = isDark ? 'rgba(148, 163, 184, 0.9)' : 'rgba(100, 116, 139, 0.8)'

  for (let i = 0; i < particles.length; i++) {
    const pi = particles[i]
    if (!pi) continue
    for (let j = i + 1; j < particles.length; j++) {
      const pj = particles[j]
      if (!pj) continue
      const dx = pi.x - pj.x
      const dy = pi.y - pj.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MAX_DIST) {
        ctx.beginPath()
        ctx.moveTo(pi.x, pi.y)
        ctx.lineTo(pj.x, pj.y)
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 1 - dist / MAX_DIST
        ctx.stroke()
      }
    }
  }

  for (const p of particles) {
    p.update(w, h)
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = dotColor
    ctx.fill()
  }
}

function resize() {
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = document.documentElement.scrollHeight
}

function animate() {
  animationId = requestAnimationFrame(animate)
  frameSkip = (frameSkip + 1) % 2
  if (frameSkip !== 0) return

  const isDark = document.documentElement.classList.contains('dark')
  lastIsDark = isDark
  draw(isDark)
}

function onMouseMove(e: MouseEvent) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

export function useParticles() {
  if (import.meta.server) return

  onMounted(() => {
    canvas = document.createElement('canvas')
    canvas.className = 'fixed inset-0 pointer-events-none'
    canvas.style.cssText = 'z-index:0;'

    ctx = canvas.getContext('2d')
    document.body.appendChild(canvas)

    resize()
    initParticles(canvas.width, canvas.height)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    animate()
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', onMouseMove)
    if (canvas) {
      canvas.remove()
      canvas = null
      ctx = null
    }
  })
}
