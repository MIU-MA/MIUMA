<script setup lang="ts">
const START_DATE = new Date('2024-09-01T00:00:00').getTime()
const END_DATE = new Date('2028-06-30T23:59:59').getTime()
const TOTAL_DURATION = END_DATE - START_DATE

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval>

const percentage = computed(() => {
  const passed = now.value - START_DATE
  if (passed >= TOTAL_DURATION) return '100.0000'
  return ((passed / TOTAL_DURATION) * 100).toFixed(2)
})

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000 * 60 * 60)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="relative w-full max-w-4xl mx-auto p-6 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors hover:scale-[1.02]">
    <div class="flex justify-between items-end mb-4">
      <span class="text-sm font-bold text-gray-400 dark:text-slate-500 tracking-[0.2em] uppercase">
        Progress
      </span>
      <span class="text-3xl font-extrabold text-rose-400 dark:text-rose-500 font-mono">
        {{ percentage }}%
      </span>
    </div>

    <div class="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
      <div
        class="bg-rose-400 dark:bg-rose-500 h-full rounded-full"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>

    <div class="flex justify-between mt-2 text-xs text-gray-300 dark:text-slate-600 font-mono">
      <span>2024.09</span>
      <span>2028.06</span>
    </div>
  </div>
</template>
