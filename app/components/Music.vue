<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const SKIP_SECONDS = 10

const audioRef = ref<HTMLAudioElement | null>(null)
const progressBarRef = ref<HTMLDivElement | null>(null)
const isPlaying = ref(false)
const isSeekDragging = ref(false)
const collapsed = ref(true)
const progress = ref(0)
const currentTime = ref('0:00')
const duration = ref('0:00')
const currentTrackIndex = ref(0)

const playerx=ref(40)
const playery=ref(100)
let isDragging = false
let hasDragging = false
let startx = 0
let starty = 0
let currentx = 0
let currenty = 0

onMounted(() => {
 playery.value = window.innerHeight - 120
})

const startDrag = (e: MouseEvent) => {
  isDragging = true
  hasDragging = false
  startx = playerx.value
  starty = playery.value
  currentx = e.clientX
  currenty = e.clientY

  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', endDrag)
}
const onDrag =(e: MouseEvent) => {
  if (!isDragging) return
  const dx = e.clientX - currentx
  const dy = e.clientY - currenty
  if(dx>=5||dy>=5) hasDragging = true
  if(hasDragging){
    playerx.value = startx + dx
    playery.value = starty + dy
  }
  hasDragging = true
}
const endDrag = (e: MouseEvent) => {
  if (!isDragging) return
  isDragging = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
}
onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
})
const handleCollapsedClick = () => {
  if (hasDragging) return
  collapsed.value = false
}

const { data: apiMusicList } = useAsyncData('music-list', async () => {
  const runtimeConfig = useRuntimeConfig()
  try {
    return await $fetch<any[]>(`${runtimeConfig.public.apiBase}/api/music`)
  } catch {
    return null
  }
})

const apiBase = computed(() => {
  if (typeof window === 'undefined') return 'http://localhost:3002'
  const config = useRuntimeConfig()
  return config.public.apiBase as string
})

const musicList = computed(() => {
  if (apiMusicList.value && apiMusicList.value.length > 0) {
    return apiMusicList.value.map((item: any) => ({
      title: item.title,
      artist: item.artist,
      src: item.audioUrl.startsWith('http')
        ? item.audioUrl
        : `${apiBase.value}${item.audioUrl}`,
    }))
  }
  return [
    { title: '那天下雨了', artist: '啦啦啦', src: '/music/那天下雨了.mp3' },
    { title: '黑色柳丁', artist: '啦啦啦', src: '/music/黑色柳丁.mp3' },
    { title: '十七岁', artist: '啦啦啦', src: '/music/十七岁.mp3' },
  ]
})

const currentTrack = computed(() => musicList.value[currentTrackIndex.value] ?? null)
const hasPrev = computed(() => musicList.value.length > 1)
const hasNext = computed(() => musicList.value.length > 1)

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

const loadTrack = () => {
  if (!audioRef.value || !currentTrack.value) return
  isPlaying.value = false
  audioRef.value.src = currentTrack.value.src
  audioRef.value.load()
  progress.value = 0
  currentTime.value = '0:00'
  duration.value = '0:00'
}

const closePlayer = () => {
  if (audioRef.value) { audioRef.value.pause(); isPlaying.value = false }
  collapsed.value = true
}

const seek = (clientX: number) => {
  if (!audioRef.value || !progressBarRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  audioRef.value.currentTime = ratio * (audioRef.value.duration || 0)
}

const getTouchClientX = (e: TouchEvent) => e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX

const togglePlay = () => {
  if (!audioRef.value) return
  if (isPlaying.value) audioRef.value.pause()
  else audioRef.value.play()
  isPlaying.value = !isPlaying.value
}

const skipBackward = () => {
  if (!audioRef.value) return
  audioRef.value.currentTime = Math.max(0, audioRef.value.currentTime - SKIP_SECONDS)
}

const skipForward = () => {
  if (!audioRef.value) return
  audioRef.value.currentTime = Math.min(audioRef.value.duration || 0, audioRef.value.currentTime + SKIP_SECONDS)
}

const prevTrack = () => {
  if (musicList.value.length <= 1) return
  const wasPlaying = isPlaying.value
  currentTrackIndex.value = (currentTrackIndex.value - 1 + musicList.value.length) % musicList.value.length
  loadTrack()
  if (wasPlaying) nextTick(() => { audioRef.value?.play()?.then(() => { isPlaying.value = true }).catch(() => { isPlaying.value = false }) })
}

const nextTrack = () => {
  if (musicList.value.length <= 1) return
  const wasPlaying = isPlaying.value
  currentTrackIndex.value = (currentTrackIndex.value + 1) % musicList.value.length
  loadTrack()
  if (wasPlaying) nextTick(() => { audioRef.value?.play()?.then(() => { isPlaying.value = true }).catch(() => { isPlaying.value = false }) })
}

const onTimeUpdate = () => {
  if (!audioRef.value) return
  const current = audioRef.value.currentTime
  const total = audioRef.value.duration || 0
  progress.value = (current / total) * 100
  currentTime.value = formatTime(current)
}

const onLoadedMetadata = () => {
  if (audioRef.value) duration.value = formatTime(audioRef.value.duration)
}

const onEnded = () => {
  if (hasNext.value) nextTrack()
  else { isPlaying.value = false; progress.value = 0; currentTime.value = '0:00' }
}
</script>

<template>
  <div class="fixed z-50 flex flex-col items-start gap-0"
    :style="{ left: `${playerx}px`, top: `${playery}px` }">
    <button
      v-if="collapsed"
      @mousedown="startDrag"
      @click="handleCollapsedClick"
      class="font-mono text-xs uppercase tracking-wider px-3 py-1.5 border border-black dark:border-white bg-white dark:bg-black hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
    >
      MUSIC {{ isPlaying ? '▶' : '' }}
    </button>

    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="!collapsed"
        @mousedown="startDrag"
        class="bg-white dark:bg-black border border-black dark:border-white p-4 w-64"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="overflow-hidden">
            <p class="font-mono text-xs uppercase tracking-wider truncate max-w-[140px]">
              {{ currentTrack?.title ?? '---' }}
            </p>

          </div>
          <button
            @click="closePlayer"
            @mousedown="endDrag"
            class="font-mono text-xs uppercase tracking-wider px-1.5 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            X
          </button>
        </div>

        <div class="flex items-center gap-2 mb-3">
          <span class="font-mono text-xs text-zinc-500 w-8 shrink-0">{{ currentTime }}</span>
          <div
            ref="progressBarRef"
            class="flex-1 cursor-pointer py-2 -my-2"
            @mousedown="seek($event.clientX); isSeekDragging = true"
            @mousemove="isSeekDragging && seek($event.clientX)"
            @mouseup="isSeekDragging = false"
            @mouseleave="isSeekDragging = false"
            @touchstart.prevent="seek(getTouchClientX($event)!); isSeekDragging = true"
            @touchmove.prevent="isSeekDragging && seek(getTouchClientX($event)!)"
            @touchend="isSeekDragging = false"
          >
            <div class="w-full border border-black dark:border-white h-1.5">
              <div
                class="bg-black dark:bg-white h-full"
                :style="{ width: `${progress}%` }"
              />
            </div>
          </div>
          <span class="font-mono text-xs text-zinc-500 w-8 shrink-0">{{ duration }}</span>
        </div>

        <div class="flex justify-center items-center gap-0">
          <button @click="prevTrack" class="font-mono text-xs uppercase tracking-wider px-2 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors" :class="{ 'text-zinc-300 pointer-events-none': !hasPrev }">
            PREV
          </button>
          <button @click="skipBackward" class="font-mono text-xs uppercase tracking-wider px-2 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            -10
          </button>
          <button @click="togglePlay" class="font-mono text-xs uppercase tracking-wider px-3 py-1 border border-black dark:border-white mx-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            {{ isPlaying ? 'PAUSE' : 'PLAY' }}
          </button>
          <button @click="skipForward" class="font-mono text-xs uppercase tracking-wider px-2 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            +10
          </button>
          <button @click="nextTrack" class="font-mono text-xs uppercase tracking-wider px-2 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors" :class="{ 'text-zinc-300 pointer-events-none': !hasNext }">
            NEXT
          </button>
        </div>

        <audio
          ref="audioRef"
          :src="currentTrack?.src"
          preload="metadata"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetadata"
          @ended="onEnded"
          class="hidden"
        />
      </div>
    </Transition>
  </div>
</template>
