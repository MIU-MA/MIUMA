<script setup lang="ts">
import { Play, Pause, Music } from 'lucide-vue-next'

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const progress = ref(0)
const currentTime = ref('0:00')
const duration = ref('0:00')

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
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
  isPlaying.value = false
  progress.value = 0
  currentTime.value = '0:00'
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 dark:bg-slate-900/60 transition-colors">
    <section class="max-w-4xl mx-auto px-6 py-12">
      <h1 class="text-center text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-12">
        {{ $t('home.music') }}
      </h1>

      <div class="max-w-sm mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xl transition-all">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-400 to-orange-300 flex items-center justify-center shrink-0 shadow-md">
            <Music class="text-white w-8 h-8" />
          </div>
          <div class="overflow-hidden">
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">YOUR SONG TITLE</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 truncate">Artist Name</p>
          </div>
        </div>

        <div class="mb-2 group cursor-pointer">
          <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div
              class="bg-rose-500 h-full rounded-full transition-all duration-100 ease-linear"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <div class="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-mono mb-4">
          <span>{{ currentTime }}</span>
          <span>{{ duration }}</span>
        </div>

        <div class="flex justify-center items-center gap-6">
          <button
            @click="togglePlay"
            class="w-12 h-12 flex items-center justify-center bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <Play v-if="!isPlaying" class="w-5 h-5 ml-1" />
            <Pause v-else class="w-5 h-5" />
          </button>
        </div>

        <audio
          ref="audioRef"
          src="/your-music-file.mp3"
          preload="metadata"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetadata"
          @ended="onEnded"
          class="hidden"
        ></audio>
      </div>
    </section>
  </div>
</template>
