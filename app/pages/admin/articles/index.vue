<script setup lang="ts">
import { Plus, Pencil, Trash2, CalendarDays, RefreshCw } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: '文章管理 ' })

const api = useApi()

const articles = ref<any[]>([])
const pending = ref(true)
const error = ref('')

async function loadArticles() {
  pending.value = true
  error.value = ''
  try {
    articles.value = await api.get<any[]>('/api/articles')
  } catch (err: any) {
    error.value = err?.message || '加载失败'
    articles.value = []
  } finally {
    pending.value = false
  }
}

onMounted(() => loadArticles())

const deleting = ref<number | null>(null)
async function handleDelete(id: number, title: string) {
  if (!confirm(`确定删除「${title}」吗？此操作不可恢复。`)) return
  deleting.value = id
  try {
    await api.delete(`/api/articles/${id}`)
    await loadArticles()
  } catch (err: any) {
    alert(err?.message || '删除失败')
  } finally {
    deleting.value = null
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">文章管理</h2>
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          @click="loadArticles"
        >
          <RefreshCw :size="16" :class="{ 'animate-spin': pending }" />刷新
        </button>
        <NuxtLink to="/admin/articles/create" class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
          <Plus :size="16" />写文章
        </NuxtLink>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div v-if="pending" class="flex items-center justify-center py-20">
        <RefreshCw :size="24" class="animate-spin text-slate-400" />
      </div>

      <div v-else-if="error" class="text-center py-20 text-red-400 text-sm">{{ error }}</div>

      <table v-else-if="articles.length > 0" class="w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th class="text-left px-6 py-3 font-medium text-slate-500 dark:text-slate-400">标题</th>
            <th class="text-left px-6 py-3 font-medium text-slate-500 dark:text-slate-400 hidden sm:table-cell">创建时间</th>
            <th class="text-right px-6 py-3 font-medium text-slate-500 dark:text-slate-400">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="a in articles" :key="a.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <td class="px-6 py-3.5"><span class="font-medium text-slate-900 dark:text-slate-100 line-clamp-1">{{ a.title }}</span></td>
            <td class="px-6 py-3.5 text-slate-500 dark:text-slate-400 hidden sm:table-cell whitespace-nowrap">
              <span class="inline-flex items-center gap-1"><CalendarDays :size="13" />{{ formatDate(a.createdAt) }}</span>
            </td>
            <td class="px-6 py-3.5 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-1">
                <NuxtLink :to="`/admin/articles/${a.id}`" class="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                  <Pencil :size="16" />
                </NuxtLink>
                <button :disabled="deleting === a.id" @click="handleDelete(a.id, a.title)" class="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
                  <Trash2 :size="16" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="text-center py-20">
        <p class="text-slate-400 dark:text-slate-500 mb-4">还没有文章</p>
        <NuxtLink to="/admin/articles/create" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
          <Plus :size="16" />写第一篇
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
