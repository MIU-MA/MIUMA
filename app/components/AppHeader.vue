<script setup lang="ts">
import { Sun, Moon, User, Link, FileText, Home, Menu, X, Settings } from 'lucide-vue-next'

const { theme, toggleTheme } = useTheme()
const { locale, toggle } = useBlogLocale()
const menuOpen = ref(false)

const navLinks = [
  { to: '/', icon: Home, textKey: 'nav.home' },
  { to: '/news', icon: FileText, textKey: 'nav.articles' },
  { to: '/about', icon: User, textKey: 'nav.about' },
  { to: '/friendlink', icon: Link, textKey: 'nav.friendlink' },
]

const linkClass = "inline-flex items-center whitespace-nowrap text-sm text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
const iconBtnClass = "p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
</script>

<template>
  <nav class="fixed top-2 left-6 right-6 z-50 rounded-lg backdrop-blur-md bg-gray-50/85 dark:bg-slate-800/85 shadow-lg shadow-gray-300/40 dark:shadow-black/40 border border-gray-200/50 dark:border-slate-700/50 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

      <NuxtLink to="/" class="inline-flex items-center gap-2 sm:gap-3 shrink-0">
        <img src="/images/jt.svg" alt="Logo" class="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full shrink-0" />
        <span class="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          MIUMA
        </span>
      </NuxtLink>

      <ul class="hidden md:flex items-center gap-1">
        <li v-for="link in navLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            :class="[linkClass, 'px-3 py-1.5']"
            active-class="text-gray-900 bg-gray-200 font-semibold dark:text-white dark:bg-slate-800">
            <component :is="link.icon" class="w-5 h-5 mr-2 shrink-0" />
            {{ $t(link.textKey) }}
          </NuxtLink>
        </li>
      </ul>

      <div class="flex items-center gap-1 sm:gap-3 shrink-0">
        <button :title="$t('theme.switchLight')" :class="iconBtnClass" @click="toggleTheme">
          <Sun v-if="theme === 'dark'" :size="16" />
          <Moon v-else :size="16" />
        </button>
        <button :title="$t('lang.switch')" :class="[iconBtnClass, 'text-sm px-3 py-1.5 font-medium']" @click="toggle">
          {{ locale === 'zh' ? 'EN' : '中文' }}
        </button>

        <div class="md:hidden relative flex items-center">
          <button :class="iconBtnClass" @click="menuOpen = !menuOpen">
            <Menu v-if="!menuOpen" :size="20" />
            <X v-else :size="20" />
          </button>

          <ul
            v-if="menuOpen"
            class="absolute top-full right-0 mt-3 w-48 border border-gray-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2 rounded-xl shadow-lg flex flex-col gap-1 z-50"
            @click="menuOpen = false"
          >
            <li v-for="link in navLinks" :key="link.to">
              <NuxtLink :to="link.to" :class="[linkClass, 'w-full px-4 py-2']">
                <component :is="link.icon" class="w-4 h-4 mr-2 shrink-0" />
                {{ $t(link.textKey) }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </nav>
</template>
