<script setup lang="ts">
const { isHidden, reveal } = useScrollHeader(80)
const route = useRoute()
const localePath = useLocalePath()
const { theme, toggleTheme } = useTheme()
const { locale, toggle } = useBlogLocale()
const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const header = ref<HTMLElement | null>(null)

const isActive = (path: string) => {
  const current = route.path.replace(/\/+$/, '') || '/'
  const target = localePath(path).replace(/\/+$/, '') || '/'
  return current === target || (path !== '/' && current.startsWith(`${target}/`))
}

const closeMenu = () => {
  menuOpen.value = false
  menuButton.value?.focus()
}

watch(() => route.fullPath, () => {
  menuOpen.value = false
  reveal()
})

const onPointerDown = (event: PointerEvent) => {
  if (event.target instanceof Node && !header.value?.contains(event.target)) menuOpen.value = false
}
const onResize = () => {
  if (window.innerWidth >= 768) menuOpen.value = false
}
onMounted(() => {
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  window.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('resize', onResize)
})

const navLinks = [
  { to: '/', textKey: 'nav.home' },
  { to: '/news', textKey: 'nav.articles' },
  { to: '/work', textKey: 'nav.work' },
  { to: '/about', textKey: 'nav.about' },
  { to: '/friendlink', textKey: 'nav.friendlink' },
]
</script>

<template>
  <nav
    ref="header"
    :aria-label="$t('nav.main')"
    @keydown.esc="closeMenu"
    class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-black dark:border-white shadow-[0_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[0_4px_0px_0px_rgba(255,255,255,1)] transition-transform duration-300"
    :class="isHidden && !menuOpen ? '-translate-y-full focus-within:translate-y-0' : 'translate-y-0'"
  >
    <div class="flex items-center justify-between h-12 px-4 sm:px-6">
      <NuxtLink :to="localePath('/')" class="font-mono text-xs sm:text-sm uppercase tracking-widest hover:underline underline-offset-4 shrink-0">
        MIUMA
      </NuxtLink>

      <ul class="hidden md:flex items-center gap-0">
        <li v-for="link in navLinks" :key="link.to">
          <NuxtLink
            :to="localePath(link.to)"
            class="font-mono text-xs uppercase tracking-wider px-2 xl:px-3 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            :class="{ 'underline underline-offset-4': isActive(link.to) }"
            :aria-current="isActive(link.to) ? 'page' : undefined"
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
          ref="menuButton"
          type="button"
          :aria-label="$t(menuOpen ? 'nav.closeMenu' : 'nav.openMenu')"
          :aria-expanded="menuOpen"
          aria-controls="mobile-navigation"
          @click="menuOpen = !menuOpen"
        >
          {{ menuOpen ? '✕' : '≡' }}
        </button>
      </div>
    </div>

    <div
      id="mobile-navigation"
      v-if="menuOpen"
      class="md:hidden absolute right-0 w-2/3 sm:w-64 border-t border-l border-b border-black dark:border-white bg-white dark:bg-black z-50"
      @click="menuOpen = false"
    >
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="localePath(link.to)"
        class="block font-mono text-xs uppercase tracking-wider px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors border-b border-black dark:border-white last:border-b-0"
        :class="{ 'underline underline-offset-4': isActive(link.to) }"
        :aria-current="isActive(link.to) ? 'page' : undefined"
      >
        {{ $t(link.textKey) }}
      </NuxtLink>
    </div>
  </nav>
</template>
