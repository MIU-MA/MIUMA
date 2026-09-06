<script setup lang="ts">
import { ArrowUpRight, Github, Minus, Plus, RotateCcw, X } from 'lucide-vue-next'
import type { WorkNode, WorkText } from '~/data/works'
import { clampAtlas, placeWorkPopover, type AtlasPoint } from '~/utils/work-atlas-layout'
import type { WorkAtlasController } from '~/utils/work-atlas-scene'

const props = defineProps<{ nodes: readonly WorkNode[] }>()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const popover = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const points = shallowRef<AtlasPoint[]>([])
const selectedIndex = ref<number | null>(null)
const selectedNode = computed(() => selectedIndex.value === null ? null : props.nodes[selectedIndex.value] ?? null)
const publishedCount = computed(() => props.nodes.filter(node => node.status === 'published').length)
const loading = ref(true)
const failed = ref(false)
const attempt = ref(0)
const dragging = ref(false)
const viewport = reactive({ width: 1, height: 1 })
const panelSize = reactive({ width: 320, height: 260 })
const panelPosition = computed(() => {
  const anchor = selectedIndex.value === null ? undefined : points.value[selectedIndex.value]
  return placeWorkPopover(anchor ?? { x: viewport.width / 2, y: viewport.height / 2 }, viewport, panelSize)
})
const localized = (text: WorkText) => locale.value === 'en' ? text.en : text.zh
const number = (index: number) => String(index + 1).padStart(2, '0')
const nodeTitle = (node: WorkNode, index: number) => node.status === 'published' ? localized(node.title) : `${t('work.placeholder')} ${number(index)}`
const projectHref = (href: string) => href.startsWith('/') ? localePath(href) : href

let scene: WorkAtlasController | null = null
let generation = 0
let mounted = false
let originButton: HTMLButtonElement | null = null
let cleanups: (() => void)[] = []
const pointers = new Map<number, { x: number; y: number }>()
let pinchDistance = 0
let panelObserver: ResizeObserver | null = null

function closePopover(restoreFocus = false) {
  selectedIndex.value = null
  scene?.select(null)
  if (restoreFocus && originButton?.isConnected) originButton.focus({ preventScroll: true })
}

async function openPopover(index: number, event: MouseEvent) {
  if (selectedIndex.value === index) { closePopover(true); return }
  originButton = event.currentTarget as HTMLButtonElement
  selectedIndex.value = index
  scene?.select(index)
  await nextTick()
  closeButton.value?.focus({ preventScroll: true })
}

function resetView() { closePopover(); scene?.reset() }
function zoomView(factor: number) { scene?.zoom(factor) }

function stopScene() {
  generation++
  cleanups.forEach(cleanup => cleanup())
  cleanups = []
  scene?.destroy()
  scene = null
  pointers.clear()
  pinchDistance = 0
  dragging.value = false
}

async function startScene() {
  stopScene()
  const token = generation
  loading.value = true
  failed.value = false
  points.value = []
  closePopover()
  try {
    const { createWorkAtlasScene } = await import('~/utils/work-atlas-scene')
    if (!mounted || token !== generation || !canvas.value || !root.value) return
    const element = root.value
    const surface = canvas.value
    scene = createWorkAtlasScene(surface, props.nodes.map(node => node.position), nextPoints => {
      points.value = nextPoints
      loading.value = false
    })
    const resize = () => {
      viewport.width = element.clientWidth
      viewport.height = element.clientHeight
      scene?.resize(viewport.width, viewport.height)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(element)
    const syncTheme = () => {
      const style = getComputedStyle(element)
      scene?.setTheme(style.backgroundColor, style.color)
    }
    const themeObserver = new MutationObserver(syncTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => scene?.setReducedMotion(reduced.matches)
    reduced.addEventListener('change', syncMotion)
    let inView = true
    const syncVisibility = () => scene?.setVisible(inView && !document.hidden)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? false
      syncVisibility()
    })
    visibilityObserver.observe(element)
    document.addEventListener('visibilitychange', syncVisibility)
    const lost = (event: Event) => {
      event.preventDefault()
      scene?.setVisible(false)
      loading.value = false
      failed.value = true
      closePopover()
    }
    surface.addEventListener('webglcontextlost', lost)
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || failed.value) return
      event.preventDefault()
      scene?.zoom(Math.exp(clampAtlas(event.deltaY, -180, 180) * 0.0015))
    }
    surface.addEventListener('wheel', wheel, { passive: false })
    cleanups.push(() => {
      resizeObserver.disconnect()
      themeObserver.disconnect()
      visibilityObserver.disconnect()
      reduced.removeEventListener('change', syncMotion)
      document.removeEventListener('visibilitychange', syncVisibility)
      surface.removeEventListener('webglcontextlost', lost)
      surface.removeEventListener('wheel', wheel)
    })
    syncTheme()
    syncMotion()
    resize()
    syncVisibility()
  } catch {
    if (mounted && token === generation) {
      stopScene()
      loading.value = false
      failed.value = true
    }
  }
}

async function retry() {
  stopScene()
  attempt.value++
  await nextTick()
  if (mounted) void startScene()
}

function touchDistance() {
  const values = [...pointers.values()]
  return values.length < 2 ? 0 : Math.hypot(values[0]!.x - values[1]!.x, values[0]!.y - values[1]!.y)
}

function pointerDown(event: PointerEvent) {
  if (event.button !== 0 || loading.value || failed.value) return
  closePopover()
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  canvas.value?.setPointerCapture(event.pointerId)
  dragging.value = true
  if (pointers.size === 2) pinchDistance = touchDistance()
}

function pointerMove(event: PointerEvent) {
  const previous = pointers.get(event.pointerId)
  if (!previous) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (pointers.size >= 2) {
    const distance = touchDistance()
    if (distance > 4 && pinchDistance > 4) scene?.zoom(pinchDistance / distance)
    pinchDistance = distance
  } else {
    scene?.rotate(event.clientX - previous.x, event.clientY - previous.y)
  }
}

function pointerUp(event: PointerEvent) {
  pointers.delete(event.pointerId)
  if (canvas.value?.hasPointerCapture(event.pointerId)) canvas.value.releasePointerCapture(event.pointerId)
  pinchDistance = 0
  dragging.value = pointers.size > 0
}

function keyboard(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (selectedNode.value) { event.preventDefault(); event.stopPropagation(); closePopover(true) }
    return
  }
  if (popover.value?.contains(event.target as Node)) return
  const moves: Record<string, [number, number]> = { ArrowLeft: [24, 0], ArrowRight: [-24, 0], ArrowUp: [0, 24], ArrowDown: [0, -24] }
  const move = moves[event.key]
  if (move) { event.preventDefault(); scene?.rotate(...move) }
}

watch(popover, element => {
  panelObserver?.disconnect()
  panelObserver = null
  if (!element) return
  const measure = () => { panelSize.width = element.offsetWidth; panelSize.height = element.offsetHeight }
  panelObserver = new ResizeObserver(measure)
  panelObserver.observe(element)
  measure()
}, { flush: 'post' })

watch(() => props.nodes, () => { if (mounted) void retry() })
onMounted(() => { mounted = true; void startScene() })
onBeforeUnmount(() => { mounted = false; panelObserver?.disconnect(); stopScene() })
</script>

<template>
  <section ref="root" class="relative h-[calc(100svh_-_3rem)] min-h-[26rem] w-full overflow-hidden bg-white text-zinc-900 dark:bg-black dark:text-zinc-100" :aria-label="t('work.sceneLabel')" @keydown="keyboard">
    <canvas :key="attempt" ref="canvas" class="block h-full w-full touch-pan-y" :class="dragging ? 'cursor-grabbing' : 'cursor-grab'" aria-hidden="true" @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerUp" @pointercancel="pointerUp" @lostpointercapture="pointerUp" />

    <header class="pointer-events-none absolute left-[clamp(1.25rem,4vw,3rem)] top-6 z-20 sm:top-8">
      <p class="mb-2.5 text-xs tracking-[0.12em] text-zinc-600 dark:text-zinc-400">{{ t('work.eyebrow') }}</p>
      <h1 class="font-mono text-[clamp(1.6rem,3.5vw,2.8rem)] font-normal leading-[1.15] tracking-[-0.07em]">WORK ATLAS.</h1>
    </header>

    <div v-if="!failed && !loading" class="pointer-events-none absolute inset-0" role="group" :aria-label="t('work.pointsLabel')">
      <button
        v-for="(node, index) in nodes"
        v-show="points[index]?.visible"
        :key="node.id"
        type="button"
        class="group/point pointer-events-auto absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center border-0 bg-transparent p-0 hover:z-20 focus-visible:z-20 aria-expanded:z-20"
        :class="node.status === 'published' ? 'z-10' : 'z-[1]'"
        :style="{ left: (points[index]?.x ?? 0) + 'px', top: (points[index]?.y ?? 0) + 'px' }"
        :aria-label="nodeTitle(node, index)"
        aria-haspopup="dialog"
        :aria-expanded="selectedIndex === index"
        :aria-controls="selectedIndex === index ? 'work-atlas-popover' : undefined"
        @click="openPopover(index, $event)"
      >
        <span
          class="block ring-2 ring-white group-hover/point:opacity-100 group-focus-visible/point:opacity-100 group-aria-expanded/point:opacity-100 dark:ring-black"
          :class="[
            node.status === 'published' ? 'size-2.5 bg-current' : 'size-2 border-2 border-zinc-600 bg-white dark:border-zinc-300 dark:bg-black',
            (points[index]?.opacity ?? 1) > 0.92 ? 'opacity-100' : (points[index]?.opacity ?? 1) > 0.82 ? 'opacity-90' : 'opacity-75',
          ]"
          aria-hidden="true"
        />
        <span class="absolute inset-2 rounded-full border border-current opacity-0 group-hover/point:opacity-70 group-focus-visible/point:opacity-70 group-aria-expanded/point:opacity-100 motion-safe:transition-opacity motion-safe:duration-150" aria-hidden="true" />
        <span
          class="pointer-events-none absolute top-2.5 whitespace-nowrap bg-white px-1 text-sm leading-relaxed group-aria-expanded/point:invisible dark:bg-black"
          :class="[
            (points[index]?.x ?? 0) > viewport.width - 170 ? 'right-10 text-right' : 'left-10 text-left',
            node.status === 'placeholder' ? 'opacity-0 group-hover/point:opacity-100 group-focus-visible/point:opacity-100' : 'opacity-100',
          ]"
          aria-hidden="true"
        >
          <span class="absolute top-3 w-3 border-t border-zinc-400 dark:border-zinc-500" :class="(points[index]?.x ?? 0) > viewport.width - 170 ? '-right-4' : '-left-4'" />
          <small class="block font-mono text-[11px] leading-relaxed tracking-[0.06em] text-zinc-600 dark:text-zinc-400">{{ number(index) }} / {{ node.status === 'published' ? node.category : '…' }}</small>
          <span>{{ node.status === 'published' ? localized(node.title) : t('work.placeholder') }}</span>
        </span>
      </button>
    </div>

    <section
      v-if="selectedNode"
      id="work-atlas-popover"
      ref="popover"
      role="dialog"
      aria-modal="false"
      aria-labelledby="work-popover-title"
      class="absolute z-40 max-h-[calc(100%_-_12rem)] w-[calc(100%_-_2rem)] max-w-xs overflow-y-auto border border-zinc-900 bg-white p-4 shadow-[4px_4px_0_0] shadow-zinc-900 dark:border-zinc-100 dark:bg-black dark:shadow-zinc-100 sm:p-5"
      :style="{ left: panelPosition.left + 'px', top: panelPosition.top + 'px' }"
    >
      <div class="flex items-center justify-between gap-3 text-[11px] tracking-[0.06em] text-zinc-600 dark:text-zinc-400">
        <span class="font-mono">{{ number(selectedIndex!) }} / {{ selectedNode.status === 'published' ? selectedNode.category : t('work.placeholderKind') }}</span>
        <button ref="closeButton" type="button" class="-my-1.5 -mr-1.5 grid size-10 shrink-0 place-items-center bg-transparent text-zinc-900 hover:bg-zinc-200 dark:text-zinc-100 dark:hover:bg-zinc-800" :aria-label="t('work.close')" @click="closePopover(true)"><X :size="16" aria-hidden="true" /></button>
      </div>
      <h2 id="work-popover-title" class="mb-3 mt-4 text-lg font-normal leading-normal">{{ selectedNode.status === 'published' ? localized(selectedNode.title) : t('work.placeholder') }}</h2>
      <p class="text-sm leading-[1.9] text-zinc-600 dark:text-zinc-400">{{ selectedNode.status === 'published' ? localized(selectedNode.summary) : t('work.placeholderSummary') }}</p>
      <template v-if="selectedNode.status === 'published'">
        <ul v-if="selectedNode.stack.length" class="mt-4 flex list-none flex-wrap gap-x-3 gap-y-1.5 p-0 font-mono text-[11px] text-zinc-600 dark:text-zinc-400" :aria-label="t('work.stack')"><li v-for="technology in selectedNode.stack" :key="technology">{{ technology }}</li></ul>
        <div v-if="selectedNode.href || selectedNode.source" class="mt-5 flex flex-wrap gap-6 border-t border-zinc-300 pt-4 dark:border-zinc-700">
          <NuxtLink v-if="selectedNode.href" class="inline-flex items-center gap-1.5 text-[13px] underline-offset-4 hover:underline" :to="projectHref(selectedNode.href)" :external="!selectedNode.href.startsWith('/')" :target="selectedNode.href.startsWith('/') ? undefined : '_blank'" rel="noopener noreferrer">{{ t('work.visit') }}<ArrowUpRight :size="14" aria-hidden="true" /></NuxtLink>
          <a v-if="selectedNode.source" class="inline-flex items-center gap-1.5 text-[13px] underline-offset-4 hover:underline" :href="selectedNode.source" target="_blank" rel="noopener noreferrer"><Github :size="14" aria-hidden="true" />{{ t('work.source') }}</a>
        </div>
      </template>
      <span v-else class="mt-5 block font-mono text-[11px] text-zinc-600 dark:text-zinc-400">{{ t('work.placeholderNote') }}</span>
    </section>
    
    <div v-if="!failed" class="absolute bottom-5 right-[clamp(1.25rem,4vw,3rem)] z-20 flex items-center gap-1.5 sm:bottom-6" role="group" :aria-label="t('work.viewControls')">
      <button type="button" class="inline-flex min-h-10 min-w-11 items-center justify-center gap-2 bg-white p-1.5 text-xs enabled:hover:bg-zinc-200 disabled:opacity-40 dark:bg-black dark:enabled:hover:bg-zinc-800 sm:min-h-9 sm:min-w-9" :disabled="loading" :aria-label="t('work.zoomIn')" @click="zoomView(0.82)"><Plus :size="16" aria-hidden="true" /></button>
      <button type="button" class="inline-flex min-h-10 min-w-11 items-center justify-center gap-2 bg-white p-1.5 text-xs enabled:hover:bg-zinc-200 disabled:opacity-40 dark:bg-black dark:enabled:hover:bg-zinc-800 sm:min-h-9 sm:min-w-9" :disabled="loading" :aria-label="t('work.zoomOut')" @click="zoomView(1.22)"><Minus :size="16" aria-hidden="true" /></button>
      <button type="button" class="ml-2.5 inline-flex min-h-10 min-w-11 items-center justify-center gap-2 bg-white p-1.5 text-xs enabled:hover:bg-zinc-200 disabled:opacity-40 dark:bg-black dark:enabled:hover:bg-zinc-800 sm:min-h-9 sm:min-w-9" :disabled="loading" @click="resetView"><RotateCcw :size="13" aria-hidden="true" />{{ t('work.reset') }}</button>
    </div>

    <div v-if="loading || failed" class="absolute inset-x-4 top-[42%] z-30 text-center text-sm text-zinc-600 dark:text-zinc-400" role="status">
      <template v-if="failed">
        <p>{{ t('work.unavailable') }}</p>
        <button type="button" class="mt-4 border border-zinc-300 bg-white px-4 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-black dark:hover:bg-zinc-800" @click="retry">{{ t('work.retry') }}</button>
        <ul class="my-6 list-none space-y-2 p-0">
          <template v-for="node in nodes" :key="node.id">
            <li v-if="node.status === 'published' && (node.href || node.source)">
              <NuxtLink class="underline underline-offset-4" :to="projectHref(node.href ?? node.source ?? '/')" :target="(node.href ?? node.source)?.startsWith('/') ? undefined : '_blank'" rel="noopener noreferrer">{{ localized(node.title) }} ↗</NuxtLink>
            </li>
          </template>
        </ul>
      </template>
      <p v-else>{{ t('work.loading') }}</p>
    </div>
  </section>
</template>
