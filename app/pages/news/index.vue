<script setup lang="ts">
import { CalendarDays, Loader2, AlertTriangle, RefreshCw } from 'lucide-vue-next'

const { data, status, refresh } = await useAsyncData('articles', () =>
  queryCollection('content').all()
)

const isLoading = computed(() => status.value === 'pending')
const isError = computed(() => status.value === 'error')

const articles = computed(() => {
  if (!data.value) return []
  return [...data.value]
    .filter((a: any) => a.meta?.date)
    .sort((a: any, b: any) => (b.meta?.date || '').localeCompare(a.meta?.date || ''))
})

// 如果服务端返回空数据，客户端重新拉取（内容库可能正在重建）
onMounted(() => {
  if (!data.value?.length) refresh()
})

useHead({ title: '文章 — MIUMA' })
</script>

<template>
  <main class="min-h-screen translate-y-5 relative z-10">
    <section class="px-6 pb-24">
      <div class="max-w-4xl mx-auto">
        <h1 class="flex justify-center text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
          {{ $t('home.articles') }}
        </h1>

        <!-- 加载中 -->
        <div v-if="isLoading" class="text-center py-20">
          <Loader2 class="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p class="text-slate-500">加载中...</p>
        </div>

        <!-- 加载出错 -->
        <div v-else-if="isError" class="text-center py-20">
          <AlertTriangle class="w-8 h-8 text-amber-500 mx-auto mb-4" />
          <p class="text-slate-500 mb-4">内容加载失败</p>
          <button @click="refresh()" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <RefreshCw class="w-4 h-4" /> 重试
          </button>
        </div>

        <!-- 文章列表 -->
        <template v-else>
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

          <div v-if="!articles.length" class="text-center py-20">
            <p class="text-slate-400 dark:text-slate-500 mb-4">
              {{ $t('home.noArticles') }}
            </p>
            <button @click="refresh()" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <RefreshCw class="w-4 h-4" /> 刷新
            </button>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>
