<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next'

definePageMeta({ key: route => route.fullPath })

const route = useRoute()

const slugParam = route.params.slug
const targetPath = computed(() => {
  const rawStr = Array.isArray(slugParam) ? slugParam.join('/') : slugParam || ''
  return `/${decodeURIComponent(rawStr)}`
})

const { data: articleList } = await useAsyncData(
  `article-${targetPath.value}`,
  () => queryCollection('content').where('path', '=', targetPath.value).all(),
  { watch: [targetPath] }
)

const article = computed(() => articleList.value?.[0] ?? null)

const { data: allData } = await useAsyncData('all-articles-nav', () =>
  queryCollection('content').all()
)

const allArticles = computed(() => {
  if (!allData.value) return []
  return [...allData.value]
    .filter((a: any) => a.date)
    .sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''))
})

const prevArticle = computed(() => {
  if (!allArticles.value) return null
  const idx = allArticles.value.findIndex((a: any) => a.path === targetPath.value)
  return idx > 0 ? allArticles.value[idx - 1] : null
})

const nextArticle = computed(() => {
  if (!allArticles.value) return null
  const idx = allArticles.value.findIndex((a: any) => a.path === targetPath.value)
  return idx < allArticles.value.length - 1 && idx !== -1 ? allArticles.value[idx + 1] : null
})

useHead({
  title: computed(() => article.value?.title ? `${article.value.title} — MIUMA` : '文章 — MIUMA'),
})
</script>

<template>
  <main class="pt-24 pb-12 px-4 sm:px-6 relative z-10">
    <div v-if="article" class="article-wrapper max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 shadow-sm rounded-2xl transition-colors">
      <header class="mb-8 border-b border-slate-100 dark:border-slate-700 pb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">{{ article.title || (article.meta as any)?.title }}</h1>
        <div v-if="article.date" class="flex items-center text-slate-500 dark:text-slate-400 text-sm">
          <CalendarDays class="w-4 h-4 mr-1" /> {{ article.date }}
        </div>
      </header>

      <div v-if="(article.meta as any)?.cover" class="mb-8">
        <img :src="(article.meta as any).cover" :alt="article.title" loading="lazy" class="w-full h-auto rounded-xl shadow-md mx-auto">
      </div>

      <div class="prose prose-blue dark:prose-invert max-w-none prose-img:rounded-xl prose-headings:text-slate-900 dark:prose-headings:text-slate-100">
        <ContentRenderer :value="article" />
      </div>

      <div class="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <NuxtLink
          v-if="prevArticle"
          :to="`/news${prevArticle.path}`"
          class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <span>&laquo;</span>
          <span class="hidden sm:inline">{{ prevArticle.title || (prevArticle.meta as any)?.title }}</span>
          <span class="sm:hidden">{{ $t('news.prevArticle') }}</span>
        </NuxtLink>
        <span v-else class="text-slate-300 dark:text-slate-600">&laquo; {{ $t('news.noPrevArticle') }}</span>

        <NuxtLink
          v-if="nextArticle"
          :to="`/news${nextArticle.path}`"
          class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <span class="hidden sm:inline">{{ nextArticle.title || (nextArticle.meta as any)?.title }}</span>
          <span class="sm:hidden">{{ $t('news.nextArticle') }}</span>
          <span>&raquo;</span>
        </NuxtLink>
        <span v-else class="text-slate-300 dark:text-slate-600">{{ $t('news.noNextArticle') }} &raquo;</span>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl max-w-4xl mx-auto shadow-sm">
      <h2 class="text-2xl font-semibold text-slate-600 dark:text-slate-400">文章未找到了 🥲</h2>
      <p class="text-slate-400 mt-2">路径: {{ targetPath }}</p>
      <NuxtLink to="/news" class="text-blue-500 mt-6 inline-block hover:underline">返回文章列表</NuxtLink>
    </div>
  </main>
</template>
