<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next'

const { data } = await useAsyncData('articles', () =>
  queryCollection('content').all()
)

const articles = computed(() => {
  if (!data.value) return []
  return [...data.value]
    .filter((a: any) => a.meta?.date)
    .sort((a: any, b: any) => (b.meta?.date || '').localeCompare(a.meta?.date || ''))
})

useHead({ title: '文章 — MIUMA' })
</script>

<template>
  <main class="translate-y-5 relative z-10">
    <section class="px-6 pb-24">
      <div class="max-w-4xl mx-auto">
        <h1 class="flex justify-center text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
          {{ $t('home.articles') }}
        </h1>

        <div class="grid gap-6">
          <NuxtLink
            v-for="article in articles"
            :key="article.id"
            :to="`/news${article.path}`"
            class="block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700"
          >
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {{ article.title || (article.meta as any)?.title }}
            </h3>
            <p v-if="(article.meta as any)?.intro" class="text-slate-500 dark:text-slate-400 text-sm mb-3">
              {{ (article.meta as any).intro }}
            </p>
            <span v-if="(article.meta as any)?.date" class="inline-flex items-center text-xs text-slate-400 dark:text-slate-500">
              <CalendarDays class="w-4 h-4 mr-1" />{{ (article.meta as any).date }}
            </span>
          </NuxtLink>
        </div>

        <p v-if="!articles?.length" class="text-center text-slate-400 dark:text-slate-500 py-20">
          {{ $t('home.noArticles') }}
        </p>
      </div>
    </section>
  </main>
</template>