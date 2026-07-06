<script setup lang="ts">
const { isScroll, isHidden } = useScrollHeader(80)
const { theme, toggleTheme } = useTheme()
const { locale, toggle } = useBlogLocale()
const menuOpen = ref(false)

const navLinks = [
  { to: '/', textKey: 'nav.home' },
  { to: '/news', textKey: 'nav.articles' },
  { to: '/about', textKey: 'nav.about' },
  { to: '/friendlink', textKey: 'nav.friendlink' },
]
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-black dark:border-white shadow-[0_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[0_4px_0px_0px_rgba(255,255,255,1)] transition-transform duration-300"
    :class="isHidden ? '-translate-y-full' : 'translate-y-0'"
  >
    <div class="flex items-center justify-between h-12 px-4 sm:px-6">
      <NuxtLink to="/" class="font-mono text-xs sm:text-sm uppercase tracking-widest hover:underline underline-offset-4 shrink-0">
        MIUMA
      </NuxtLink>

      <ul class="hidden md:flex items-center gap-0">
        <li v-for="link in navLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="font-mono text-xs uppercase tracking-wider px-2 xl:px-3 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            active-class="underline underline-offset-4"
          >
            {{ $t(link.textKey) }}
          </NuxtLink>
        </li>
      </ul>

      <div class="flex items-center gap-0">
        <button
          class="font-mono text-[10px] sm:text-xs uppercase tracking-wider px-1.5 sm:px-2 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shrink-0"
          @click="toggleTheme"
        >
          {{ theme === 'dark' ? '☀' : '☾' }}
        </button>
        <button
          class="font-mono text-[10px] sm:text-xs uppercase tracking-wider px-1.5 sm:px-2 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shrink-0"
          @click="toggle"
        >
          {{ locale === 'zh' ? 'EN' : '中' }}
        </button>

        <button
          class="md:hidden font-mono text-[10px] sm:text-xs uppercase tracking-wider px-1.5 sm:px-2 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shrink-0"
          @click="menuOpen = !menuOpen"
        >
          {{ menuOpen ? '✕' : '≡' }}
        </button>
      </div>
    </div>

    <div
      v-if="menuOpen"
      class="md:hidden absolute right-0 w-2/3 sm:w-64 border-t border-l border-b border-black dark:border-white bg-white dark:bg-black z-50"
      @click="menuOpen = false"
    >
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="block font-mono text-xs uppercase tracking-wider px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors border-b border-black dark:border-white last:border-b-0"
        active-class="underline underline-offset-4"
      >
        {{ $t(link.textKey) }}
      </NuxtLink>
    </div>
  </nav>
</template>
