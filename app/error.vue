<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const statusCode = computed(() => props.error?.statusCode ?? 500)
</script>

<template>
  <main class="min-h-screen bg-white dark:bg-black flex items-center justify-center px-6">
    <div class="text-center">
      <h1 class="font-mono text-8xl uppercase tracking-tighter mb-4">{{ statusCode }}</h1>
      <p class="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-8">Page not found</p>
      <NuxtLink
        to="/"
        class="font-mono text-xs uppercase tracking-wider px-4 py-2 bg-white dark:bg-black border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150"
      >
        返回首页
      </NuxtLink>
    </div>
  </main>
</template>
