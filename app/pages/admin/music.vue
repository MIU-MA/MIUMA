<script setup lang="ts">
import { Plus, Trash2, Pencil, Check, X, Music, User, RefreshCw, FolderSync } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: '音乐管理 — MIUMA 后台' })

const api = useApi()

const musicList = ref<any[]>([])
const pending = ref(true)
const error = ref('')

async function loadMusic() {
  pending.value = true; error.value = ''
  try {
    musicList.value = await api.get<any[]>('/api/music')
  } catch (err: any) {
    error.value = err?.message || '加载失败'
    musicList.value = []
  } finally {
    pending.value = false
  }
}

onMounted(() => loadMusic())

// ── 同步本地文件 ──
const syncing = ref(false)
const syncResult = ref('')
async function handleSync() {
  syncing.value = true; syncResult.value = ''
  try {
    const res = await api.post<{ created: number; total: number }>('/api/music/sync')
    if (res.created === 0) {
      syncResult.value = `扫描了 ${res.total} 个文件，全部已入库，无需同步`
    } else {
      syncResult.value = `从 ${res.total} 个文件中同步了 ${res.created} 首新歌`
    }
    await loadMusic()
  } catch (err: any) {
    syncResult.value = err?.data?.message || err?.message || '同步失败'
  } finally {
    syncing.value = false
  }
}

// ── 添加 ──
const showForm = ref(false)
const form = reactive({ title: '', artist: '', coverUrl: '', audioUrl: '' })
const adding = ref(false)
const formError = ref('')

async function handleAdd() {
  if (!form.title || !form.artist || !form.audioUrl) {
    formError.value = '歌名、歌手、音频URL 为必填项'; return
  }
  adding.value = true; formError.value = ''
  try {
    await api.post('/api/music', {
      title: form.title.trim(), artist: form.artist.trim(),
      coverUrl: form.coverUrl.trim() || undefined, audioUrl: form.audioUrl.trim(),
    })
    form.title = ''; form.artist = ''; form.coverUrl = ''; form.audioUrl = ''
    showForm.value = false
    await loadMusic()
  } catch (err: any) {
    formError.value = err?.data?.message || err?.message || '添加失败'
  } finally { adding.value = false }
}

// ── 删除 ──
const deleting = ref<number | null>(null)
async function handleDelete(id: number, title: string) {
  if (!confirm(`确定删除「${title}」吗？`)) return
  deleting.value = id
  try { await api.delete(`/api/music/${id}`); await loadMusic() }
  catch (err: any) { alert(err?.message || '删除失败') }
  finally { deleting.value = null }
}

// ── 行内编辑 ──
const editingId = ref<number | null>(null)
const editForm = reactive({ title: '', artist: '' })
const saving = ref(false)

/** 进入编辑模式 */
function startEdit(item: { id: number; title: string; artist: string }) {
  editingId.value = item.id
  editForm.title = item.title
  editForm.artist = item.artist
}

/** 保存编辑 */
async function saveEdit() {
  if (!editingId.value) return
  if (!editForm.title.trim()) return
  saving.value = true
  try {
    await api.patch(`/api/music/${editingId.value}`, {
      title: editForm.title.trim(),
      artist: editForm.artist.trim(),
    })
    // 更新本地列表，避免重新请求
    const idx = musicList.value.findIndex((m) => m.id === editingId.value)
    if (idx !== -1) {
      musicList.value[idx].title = editForm.title.trim()
      musicList.value[idx].artist = editForm.artist.trim()
    }
    editingId.value = null
  } catch (err: any) {
    alert(err?.data?.message || err?.message || '保存失败')
  } finally { saving.value = false }
}

/** 取消编辑 */
function cancelEdit() { editingId.value = null }

/** 按 ESC 取消 */
function onEditKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') cancelEdit()
  if (e.key === 'Enter') saveEdit()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">音乐管理</h2>
      <div class="flex items-center gap-3">
        <button :disabled="syncing"
          class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors disabled:opacity-50"
          @click="handleSync">
          <FolderSync :size="16" :class="{ 'animate-spin': syncing }" />
          {{ syncing ? '同步中...' : '同步本地文件' }}
        </button>
        <button @click="loadMusic" class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <RefreshCw :size="16" :class="{ 'animate-spin': pending }" />刷新
        </button>
        <button @click="showForm = !showForm" class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
          <Plus :size="16" />添加音乐
        </button>
      </div>
    </div>

    <div v-if="syncResult" class="mb-4 p-3 rounded-lg text-sm"
      :class="syncResult.includes('失败') ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'">
      {{ syncResult }}
    </div>

    <!-- 添加表单 -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2 max-h-0 overflow-hidden"
      enter-to-class="opacity-100 translate-y-0 max-h-96"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 max-h-96"
      leave-to-class="opacity-0 -translate-y-2 max-h-0 overflow-hidden">
      <div v-if="showForm" class="mb-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">添加新音乐</h3>
        <div v-if="formError" class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{{ formError }}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">歌名 *</label>
            <input v-model="form.title" type="text" placeholder="晴天" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">歌手 *</label>
            <input v-model="form.artist" type="text" placeholder="周杰伦" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">封面图 URL</label>
            <input v-model="form.coverUrl" type="text" placeholder="/uploads/cover-xxx.jpg（选填）" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">音频文件 URL *</label>
            <input v-model="form.audioUrl" type="text" placeholder="/music/xxx.mp3" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button :disabled="adding" @click="handleAdd" class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50">
            <Plus :size="16" />{{ adding ? '添加中...' : '添加' }}
          </button>
          <button @click="showForm = false" class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors">取消</button>
        </div>
      </div>
    </Transition>

    <!-- 列表 -->
    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div v-if="pending" class="flex items-center justify-center py-20">
        <RefreshCw :size="24" class="animate-spin text-slate-400" />
      </div>
      <div v-else-if="error" class="text-center py-20 text-red-400 text-sm">{{ error }}</div>
      <table v-else-if="musicList.length > 0" class="w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th class="text-left px-6 py-3 font-medium text-slate-500 dark:text-slate-400">歌名</th>
            <th class="text-left px-6 py-3 font-medium text-slate-500 dark:text-slate-400 hidden sm:table-cell">歌手</th>
            <th class="text-left px-6 py-3 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">音频</th>
            <th class="text-right px-6 py-3 font-medium text-slate-500 dark:text-slate-400 w-28">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="item in musicList" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <!-- 歌名列 -->
            <td class="px-6 py-3.5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-gradient-to-br from-rose-400 to-orange-300 flex items-center justify-center shrink-0">
                  <Music :size="14" class="text-white" />
                </div>
                <!-- 编辑模式 -->
                <input
                  v-if="editingId === item.id"
                  v-model="editForm.title"
                  class="px-2 py-1 rounded border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-[160px]"
                  @keydown="onEditKeydown"
                />
                <!-- 显示模式 -->
                <span v-else class="font-medium text-slate-900 dark:text-slate-100">{{ item.title }}</span>
              </div>
            </td>
            <!-- 歌手列 -->
            <td class="px-6 py-3.5 text-slate-500 dark:text-slate-400 hidden sm:table-cell">
              <!-- 编辑模式 -->
              <div v-if="editingId === item.id" class="flex items-center gap-1">
                <User :size="13" class="shrink-0" />
                <input
                  v-model="editForm.artist"
                  class="px-2 py-1 rounded border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-[140px]"
                  @keydown="onEditKeydown"
                />
              </div>
              <!-- 显示模式 -->
              <span v-else class="inline-flex items-center gap-1"><User :size="13" />{{ item.artist }}</span>
            </td>
            <!-- 音频列 -->
            <td class="px-6 py-3.5 text-slate-400 dark:text-slate-500 hidden md:table-cell">
              <span class="text-xs font-mono truncate max-w-[200px] block">{{ item.audioUrl }}</span>
            </td>
            <!-- 操作列 -->
            <td class="px-6 py-3.5 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-1">
                <!-- 编辑中：保存 + 取消 -->
                <template v-if="editingId === item.id">
                  <button :disabled="saving" @click="saveEdit"
                    class="p-2 rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors disabled:opacity-50"
                    title="保存">
                    <Check :size="16" />
                  </button>
                  <button @click="cancelEdit"
                    class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="取消">
                    <X :size="16" />
                  </button>
                </template>
                <!-- 未编辑：编辑 + 删除 -->
                <template v-else>
                  <button @click="startEdit(item)"
                    class="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                    title="编辑">
                    <Pencil :size="16" />
                  </button>
                  <button :disabled="deleting === item.id" @click="handleDelete(item.id, item.title)"
                    class="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    title="删除">
                    <Trash2 :size="16" />
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center py-20">
        <p class="text-slate-400 dark:text-slate-500 mb-4">还没有音乐</p>
        <button @click="showForm = true" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
          <Plus :size="16" />添加第一首
        </button>
      </div>
    </div>
  </div>
</template>
