<script setup lang="ts">
import { ArrowLeft, Save, Eye } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: '写文章 — MIUMA 后台' })

const api = useApi()
const router = useRouter()

const title = ref('')
const content = ref('')
const saving = ref(false)
const errorMsg = ref('')
const preview = ref(false)

async function handleSave() {
  if (!title.value.trim()) { errorMsg.value = '请输入文章标题'; return }
  if (!content.value.trim()) { errorMsg.value = '请输入文章内容'; return }

  saving.value = true
  errorMsg.value = ''
  try {
    const article = await api.post<any>('/api/articles', {
      title: title.value.trim(),
      content: content.value,
    })
    await router.push(`/admin/articles/${article.id}`)
  } catch (err: any) {
    errorMsg.value = err?.data?.message || err?.message || '保存失败'
  } finally {
    saving.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault()
    const textarea = e.target as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    content.value = content.value.substring(0, start) + '  ' + content.value.substring(end)
    requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 2 })
  }
}
</script>

<template>
  <div class="max-w-4xl">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <NuxtLink to="/admin/articles" class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft :size="18" />
        </NuxtLink>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">写文章</h2>
      </div>
      <div class="flex items-center gap-2">
        <button @click="preview = !preview" class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
          <Eye :size="16" />{{ preview ? '编辑' : '预览' }}
        </button>
        <button :disabled="saving" @click="handleSave" class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50">
          <Save :size="16" />{{ saving ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>

    <div v-if="errorMsg" class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{{ errorMsg }}</div>

    <div v-if="!preview" class="space-y-4">
      <input v-model="title" type="text" placeholder="文章标题" class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-lg font-semibold placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors" />
      <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div class="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Markdown</span>
        </div>
        <textarea v-model="content" placeholder="在此输入 Markdown 内容…&#10;&#10;## 二级标题&#10;正文内容…&#10;&#10;```cpp&#10;int main() { return 0; }&#10;```" class="w-full h-[500px] px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono text-sm resize-none outline-none leading-relaxed" @keydown="onKeydown" />
      </div>
    </div>

    <div v-else class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <h1 v-if="title" class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">{{ title }}</h1>
      <div class="prose prose-slate dark:prose-invert max-w-none" v-html="content || '*（空内容）*'" />
    </div>
  </div>
</template>
