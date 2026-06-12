<script setup lang="ts">
import { FileText, Music, Upload, ArrowUpRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({ title: '控制台' })

const api = useApi()

/** 统计数据 —— 仅客户端请求（SSR 阶段 cookie 不可用） */
const stats = ref({ articles: 0, music: 0 })
const pending = ref(true)

onMounted(async () => {
  try {
    const [articles, music] = await Promise.all([
      api.get<any[]>('/api/articles').catch(() => []),
      api.get<any[]>('/api/music').catch(() => []),
    ])
    stats.value = { articles: articles.length, music: music.length }
  } finally {
    pending.value = false
  }
})

const cards = computed(() => [
  { label: '文章总数', value: pending.value ? '...' : stats.value.articles, icon: FileText, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30', to: '/admin/articles' },
  { label: '音乐总数', value: pending.value ? '...' : stats.value.music, icon: Music, color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30', to: '/admin/music' },
  { label: '文件上传', value: '管理', icon: Upload, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30', to: '/admin/upload' },
])
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">控制台</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <NuxtLink
        v-for="card in cards" :key="card.label" :to="card.to"
        class="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-all"
      >
        <div class="flex items-center justify-between">
          <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', card.color]">
            <component :is="card.icon" :size="20" />
          </div>
          <ArrowUpRight :size="16" class="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
        </div>
        <p class="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">{{ card.value }}</p>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ card.label }}</p>
      </NuxtLink>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">快捷操作</h3>
      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/admin/articles/create" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
          <FileText :size="16" />写文章
        </NuxtLink>
        <NuxtLink to="/admin/upload" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors">
          <Upload :size="16" />上传文件
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
