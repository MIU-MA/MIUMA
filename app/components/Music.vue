<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Play, Pause, Music, SkipBack, SkipForward, RotateCcw, RotateCw, X ,Music2} from 'lucide-vue-next'

const SKIP_SECONDS = 10

const audioRef = ref<HTMLAudioElement | null>(null)
const progressBarRef = ref<HTMLDivElement | null>(null)
const isPlaying = ref(false)
const isDragging = ref(false)
const collapsed = ref(true)
const progress = ref(0)
const currentTime = ref('0:00')
const duration = ref('0:00')
const currentTrackIndex = ref(0)

const { data: apiMusicList } = useAsyncData('music-list', async () => {
  const runtimeConfig = useRuntimeConfig()
  try {
    return await $fetch<any[]>(`${runtimeConfig.public.apiBase}/api/music`)
  } catch {
    return null
  }
})

const apiBase = computed(() => {
  if (typeof window === 'undefined') return 'http://localhost:3001'
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
    {
      title: '那天下雨了',
      artist: '啦啦啦',
      src: '/music/那天下雨了.mp3',
    },
    {
      title: '黑色柳丁',
      artist: '啦啦啦',
      src: '/music/黑色柳丁.mp3',
    },
    {
      title: '十七岁',
      artist: '啦啦啦',
      src: '/music/十七岁.mp3',
    },
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
  if (audioRef.value) {
    audioRef.value.pause()
    isPlaying.value = false
  }
  collapsed.value = true
}

const seek = (clientX: number) => {
  if (!audioRef.value || !progressBarRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  audioRef.value.currentTime = ratio * (audioRef.value.duration || 0)
}

const onProgressMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  seek(e.clientX)
}

const onProgressMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  seek(e.clientX)
}

const onProgressMouseUp = () => {
  isDragging.value = false
}

const getTouchClientX = (e: TouchEvent) => {
  return e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX
}

const onProgressTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  const x = getTouchClientX(e)
  if (x !== undefined) seek(x)
}

const onProgressTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  const x = getTouchClientX(e)
  if (x !== undefined) seek(x)
}

const onProgressTouchEnd = () => {
  isDragging.value = false
}

const togglePlay = () => {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const skipBackward = () => {
  if (!audioRef.value) return
  audioRef.value.currentTime = Math.max(0, audioRef.value.currentTime - SKIP_SECONDS)
}

const skipForward = () => {
  if (!audioRef.value) return
  audioRef.value.currentTime = Math.min(
    audioRef.value.duration || 0,
    audioRef.value.currentTime + SKIP_SECONDS,
  )
}

const prevTrack = () => {
  if (musicList.value.length <= 1) return
  const wasPlaying = isPlaying.value
  currentTrackIndex.value =
    (currentTrackIndex.value - 1 + musicList.value.length) % musicList.value.length
  loadTrack()
  if (wasPlaying) {
    nextTick(() => {
      audioRef.value?.play()?.then(() => {
        isPlaying.value = true
      }).catch(() => {
        isPlaying.value = false
      })
    })
  }
}

const nextTrack = () => {
  if (musicList.value.length <= 1) return
  const wasPlaying = isPlaying.value
  currentTrackIndex.value =
    (currentTrackIndex.value + 1) % musicList.value.length
  loadTrack()
  if (wasPlaying) {
    nextTick(() => {
      audioRef.value?.play()?.then(() => {
        isPlaying.value = true
      }).catch(() => {
        isPlaying.value = false
      })
    })
  }
}

const onTimeUpdate = () => {
  if (!audioRef.value) return
  const current = audioRef.value.currentTime
  const total = audioRef.value.duration || 0
  progress.value = (current / total) * 100
  currentTime.value = formatTime(current)
}

const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = formatTime(audioRef.value.duration)
  }
}

const onEnded = () => {
  if (hasNext.value) {
    nextTrack()
  } else {
    isPlaying.value = false
    progress.value = 0
    currentTime.value = '0:00'
  }
}
</script>

<template>
  <div class="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
    <button
      v-if="collapsed"
      @click="collapsed = false"
      class="w-12 h-12 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      :class="{ 'animate-pulse': isPlaying }"
    >
      <Music class="w-5 h-5 text-slate-700 dark:text-slate-200" />
    </button>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-90 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-90 -translate-y-2"
    >
      <div
        v-if="!collapsed"
        class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-xl w-64"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-md">
              <Music2 class="text-black w-5 h-5" />
            </div>
            <div class="overflow-hidden">
              <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                {{ currentTrack?.title ?? '未知歌曲' }}
              </h3>
            </div>
          </div>
          <button
            @click="closePlayer"
            class="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- 进度条 + 时间 -->
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xs text-slate-400 dark:text-slate-500 font-mono w-8 text-right shrink-0">{{ currentTime }}</span>
          <div
            ref="progressBarRef"
            class="flex-1 cursor-pointer py-2 -my-2"
            @mousedown="onProgressMouseDown"
            @mousemove="onProgressMouseMove"
            @mouseup="onProgressMouseUp"
            @mouseleave="onProgressMouseUp"
            @touchstart.prevent="onProgressTouchStart"
            @touchmove.prevent="onProgressTouchMove"
            @touchend="onProgressTouchEnd"
          >
            <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                class="bg-rose-500 h-full rounded-full"
                :class="isDragging ? '' : 'transition-all duration-100 ease-linear'"
                :style="{ width: `${progress}%` }"
              />
            </div>
          </div>
          <span class="text-xs text-slate-400 dark:text-slate-500 font-mono w-8 text-left shrink-0">{{ duration }}</span>
        </div>

        <!-- 控制按钮 -->
        <div class="flex justify-center items-center gap-1.5">
          <button
            @click="prevTrack"
            class="w-7 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            :class="{ 'opacity-30 pointer-events-none': !hasPrev }"
          >
            <SkipBack class="w-3.5 h-3.5" />
          </button>

          <button
            @click="skipBackward"
            class="w-7 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <RotateCcw class="w-3.5 h-3.5" />
          </button>

          <button
            @click="togglePlay"
            class="w-8 h-8 flex items-center justify-center bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <Play v-if="!isPlaying" class="w-4 h-4 ml-1" />
            <Pause v-else class="w-4 h-4" />
          </button>

          <button
            @click="skipForward"
            class="w-7 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <RotateCw class="w-3.5 h-3.5" />
          </button>

          <button
            @click="nextTrack"
            class="w-7 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            :class="{ 'opacity-30 pointer-events-none': !hasNext }"
          >
            <SkipForward class="w-3.5 h-3.5" />
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
