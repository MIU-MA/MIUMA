<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const statusCode = computed(() => props.error?.statusCode ?? 500)
const message = computed(() => {
  if (props.error?.statusCode === 404) return 'Page Not Found'
  return props.error?.statusMessage ?? 'Something went wrong'
})
</script>

<template>
  <main class="min-h-screen bg-white/60 dark:bg-slate-900/60 transition-colors flex items-center justify-center px-6">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-slate-300 dark:text-slate-600 mb-4">{{ statusCode }}</h1>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        好像出bug了噢
      </NuxtLink>
    </div>
  </main>
</template>
