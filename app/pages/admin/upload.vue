<script setup lang="ts">
import { Upload, Image, Music, Check, Copy, AlertCircle, FolderOpen, FileText, RefreshCw, Eye, Trash2 } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: '文件上传 — MIUMA 后台' })

const api = useApi()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

/** 当前 Tab */
type UploadTab = 'image' | 'music' | 'markdown'
const activeTab = ref<UploadTab>('image')

/** 上传状态 */
const uploading = ref(false)
const uploadResult = ref<{ code: number; url: string; message?: string } | null>(null)
const uploadError = ref('')
const copied = ref(false)

/** 图片上传 */
const imageFile = ref<File | null>(null)
function onImageChange(e: Event) {
  imageFile.value = (e.target as HTMLInputElement).files?.[0] || null
  uploadResult.value = null; uploadError.value = ''
}

/** 音乐上传 */
const musicFile = ref<File | null>(null)
function onMusicChange(e: Event) {
  musicFile.value = (e.target as HTMLInputElement).files?.[0] || null
  uploadResult.value = null; uploadError.value = ''
}

/** Markdown 上传 */
const mdFile = ref<File | null>(null)
function onMdChange(e: Event) {
  mdFile.value = (e.target as HTMLInputElement).files?.[0] || null
  uploadResult.value = null; uploadError.value = ''
}

/** 文件列表 */
const fileList = ref<{ name: string; size: number; url: string }[]>([])
const listLoading = ref(false)
const listError = ref('')

async function refreshFileList() {
  listLoading.value = true
  listError.value = ''
  try {
    if (activeTab.value === 'image') {
      const res = await api.get<{ code: number; data: any[] }>('/api/upload/images')
      fileList.value = res.data || []
    } else if (activeTab.value === 'music') {
      const res = await api.get<{ code: number; data: any[] }>('/api/upload/musics')
      fileList.value = res.data || []
    } else {
      // markdown tab — 也显示已上传的 .md 文件
      const res = await api.get<{ code: number; data: any[] }>('/api/upload/markdowns')
      fileList.value = res.data || []
    }
  } catch (err: any) {
    listError.value = err?.message || '加载失败'
    fileList.value = []
  } finally {
    listLoading.value = false
  }
}

// 切换 tab 时自动刷新列表
watch(activeTab, () => {
  uploadResult.value = null
  uploadError.value = ''
  refreshFileList()
})

onMounted(() => refreshFileList())

/** 删除文件 */
const deletingFile = ref('')
async function handleDeleteFile(name: string) {
  if (!confirm(`确定删除「${name}」吗？`)) return
  deletingFile.value = name
  try {
    const type = activeTab.value === 'image' ? 'image'
      : activeTab.value === 'music' ? 'music'
      : 'markdown'
    await api.delete(`/api/upload/${type}/${encodeURIComponent(name)}`)
    await refreshFileList()
  } catch (err: any) {
    alert(err?.data?.message || err?.message || '删除失败')
  } finally {
    deletingFile.value = ''
  }
}

/** 执行上传 */
async function handleUpload() {
  const file = activeTab.value === 'image' ? imageFile.value
    : activeTab.value === 'music' ? musicFile.value
    : mdFile.value

  if (!file) { uploadError.value = '请先选择文件'; return }

  uploading.value = true
  uploadResult.value = null
  uploadError.value = ''

  try {
    const formData = new FormData()
    if (activeTab.value === 'markdown') {
      formData.append('file', file)
    } else {
      formData.append(activeTab.value, file)
    }

    const endpoint = activeTab.value === 'image' ? '/api/upload/image'
      : activeTab.value === 'music' ? '/api/upload/music'
      : '/api/upload/markdown'

    const res = await api.upload<{ code: number; url: string; message?: string }>(endpoint, formData)
    uploadResult.value = res
    // 刷新列表
    await refreshFileList()
  } catch (err: any) {
    uploadError.value = err?.data?.message || err?.message || '上传失败'
  } finally {
    uploading.value = false
  }
}

/** 复制完整 URL */
async function copyUrl() {
  if (!uploadResult.value?.url) return
  const fullUrl = `${apiBase}${uploadResult.value.url}`
  try {
    await navigator.clipboard.writeText(fullUrl)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    const input = document.createElement('input')
    input.value = fullUrl
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}

/** 格式化文件大小 */
function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const tabs = [
  { key: 'image' as const, icon: Image, label: '上传图片', accept: 'image/*' },
  { key: 'music' as const, icon: Music, label: '上传音乐', accept: 'audio/*' },
  { key: 'markdown' as const, icon: FileText, label: '导入 Markdown', accept: '.md' },
]
</script>

<template>
  <div class="max-w-4xl">
    <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">文件管理</h2>

    <!-- Tab 切换 -->
    <div class="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit">
      <button
        v-for="tab in tabs" :key="tab.key"
        class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        :class="activeTab === tab.key
          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'"
        @click="activeTab = tab.key"
      >
        <component :is="tab.icon" :size="16" />
        {{ tab.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- 左侧：上传区 -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          {{ activeTab === 'markdown' ? '导入 Markdown 文件' : '上传文件' }}
        </h3>

        <p v-if="activeTab === 'markdown'" class="text-xs text-slate-500 mb-3">
          选择一个 .md 文件，系统会自动读取内容并以文件名作为标题创建文章
        </p>

        <!-- 文件选择 -->
        <label class="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors">
          <Upload :size="28" class="text-slate-400" />
          <span class="text-sm text-slate-500 text-center">
            {{ activeTab === 'image' ? '点击选择图片' : activeTab === 'music' ? '点击选择音乐' : '点击选择 .md 文件' }}
          </span>
          <span class="text-xs text-slate-400">
            {{ activeTab === 'image' ? '最大 10MB' : activeTab === 'music' ? '最大 50MB' : '最大 5MB' }}
          </span>
          <input
            type="file"
            :accept="tabs.find(t => t.key === activeTab)?.accept"
            class="hidden"
            @change="activeTab === 'image' ? onImageChange($event) : activeTab === 'music' ? onMusicChange($event) : onMdChange($event)"
          />
        </label>

        <!-- 已选文件 -->
        <div v-if="imageFile || musicFile || mdFile" class="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-2">
          <component :is="activeTab === 'image' ? Image : activeTab === 'music' ? Music : FileText" :size="18" class="text-indigo-500 shrink-0" />
          <span class="text-sm text-slate-700 dark:text-slate-300 truncate">
            {{ imageFile?.name || musicFile?.name || mdFile?.name }}
          </span>
        </div>

        <!-- 错误 -->
        <div v-if="uploadError" class="mt-3 flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle :size="16" />{{ uploadError }}
        </div>

        <!-- 成功 -->
        <div v-if="uploadResult" class="mt-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-1">
            <Check :size="16" />上传成功
          </div>
          <div class="flex items-center gap-2">
            <code class="flex-1 px-2 py-1 rounded bg-white dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 break-all">
              {{ uploadResult.url }}
            </code>
            <button
              v-if="uploadResult.url"
              class="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border text-xs font-medium transition-colors shrink-0"
              @click="copyUrl"
            >
              <Check v-if="copied" :size="12" class="text-emerald-500" />
              <Copy v-else :size="12" />
              {{ copied ? '已复制' : '复制' }}
            </button>
          </div>
          <p v-if="uploadResult.message" class="text-xs text-emerald-500 mt-1">{{ uploadResult.message }}</p>
        </div>

        <!-- 上传按钮 -->
        <button
          :disabled="uploading || (!imageFile && !musicFile && !mdFile)"
          class="flex items-center justify-center gap-2 w-full mt-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all disabled:opacity-50"
          @click="handleUpload"
        >
          <Upload :size="16" />
          {{ uploading ? '上传中...' : '开始上传' }}
        </button>
      </div>

      <!-- 右侧：已有文件列表 -->
      <div class="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderOpen :size="20" />
            {{ activeTab === 'image' ? '已上传图片' : activeTab === 'music' ? '已上传音乐' : '已导入 Markdown' }}
          </h3>
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            @click="refreshFileList" :disabled="listLoading"
          >
            <RefreshCw :size="14" :class="{ 'animate-spin': listLoading }" />
            刷新
          </button>
        </div>

        <!-- Markdown tab 底部提示 -->
        <div v-if="activeTab === 'markdown' && fileList.length === 0" class="text-sm text-slate-400 space-y-2 mb-3">
          <p>选择本地 .md 文件上传，自动以文件名创建文章。</p>
        </div>

        <div v-if="listLoading" class="flex items-center justify-center py-12">
          <RefreshCw :size="20" class="animate-spin text-slate-400" />
        </div>

        <div v-else-if="listError" class="text-center py-12 text-red-400 text-sm">{{ listError }}</div>

        <div v-else-if="fileList.length === 0" class="text-center py-12">
          <FolderOpen :size="32" class="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p class="text-sm text-slate-400">暂无文件</p>
        </div>

        <div v-else class="space-y-1 max-h-96 overflow-y-auto">
          <div
            v-for="item in fileList" :key="item.name"
            class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div class="flex items-center gap-3 min-w-0">
              <component :is="activeTab === 'image' ? Image : activeTab === 'music' ? Music : FileText" :size="16" class="text-slate-400 shrink-0" />
              <div class="min-w-0">
                <p class="text-sm text-slate-900 dark:text-slate-100 truncate">{{ item.name }}</p>
                <p class="text-xs text-slate-400">{{ formatSize(item.size) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <span class="text-xs text-slate-400 font-mono truncate max-w-[120px] hidden sm:inline">{{ item.url }}</span>
              <a
                :href="`${apiBase}${item.url}`"
                target="_blank"
                class="p-1.5 rounded text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                :title="activeTab === 'markdown' ? '查看文件' : activeTab === 'image' ? '查看图片' : '播放'"
              >
                <Eye :size="14" />
              </a>
              <button
                :disabled="deletingFile === item.name"
                class="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                title="删除"
                @click="handleDeleteFile(item.name)"
              >
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
