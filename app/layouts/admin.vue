<script setup lang="ts">
import {
  LayoutDashboard,
  FileText,
  Music,
  Upload,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-vue-next'

const { user, logout } = useAuth()
const sidebarOpen = ref(false)

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: '控制台', exact: true },
  { to: '/admin/articles', icon: FileText, label: '文章管理' },
  { to: '/admin/music', icon: Music, label: '音乐管理' },
  { to: '/admin/upload', icon: Upload, label: '文件上传' },
]

const linkClass =
  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors'
const activeClass = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
const inactiveClass = 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/30 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >

      <div class="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
        <NuxtLink to="/" class="text-lg font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors">
          MIUMA 后台
        </NuxtLink>
        <button
          class="lg:hidden p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          @click="sidebarOpen = false"
        >
          <X :size="18" />
        </button>
      </div>

 
      <nav class="flex flex-col gap-1 p-4">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[linkClass, inactiveClass]"
          :active-class="activeClass"
          :exact="item.exact"
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" :size="18" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-500 dark:text-slate-400 truncate">
            {{ user?.username || '管理员' }}
          </span>
          <button
            class="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="退出登录"
            @click="logout()"
          >
            <LogOut :size="16" />
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="lg:hidden flex items-center h-14 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <button
          class="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          @click="sidebarOpen = true"
        >
          <Menu :size="20" />
        </button>
        <span class="ml-3 font-semibold text-slate-900 dark:text-slate-100">MIUMA 后台</span>
      </header>

      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
