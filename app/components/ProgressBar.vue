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
  timer = setInterval(() => { now.value = Date.now() }, 1000 * 60 * 60)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="bg-white dark:bg-black border border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
    <div class="flex justify-between items-end mb-4">
      <span class="font-mono text-xs uppercase tracking-wider text-zinc-500">PROGRESS</span>
      <span class="font-mono text-3xl">{{ percentage }}%</span>
    </div>

    <div class="w-full border border-black dark:border-white h-3">
      <div
        class="bg-black dark:bg-white h-full"
        :style="{ width: `${percentage}%` }"
      />
    </div>

    <div class="flex justify-between mt-2 font-mono text-xs uppercase tracking-wider text-zinc-500">
      <span>2024.09</span>
      <span>2028.06</span>
    </div>
  </div>
</template>
