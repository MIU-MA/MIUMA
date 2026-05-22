<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'zh-CN' },
  link: [{ rel: 'icon', href: '/favicon.png' }],
})
</script>

<template>
  <div class="min-h-screen bg-white/60 dark:bg-slate-900/60 transition-colors duration-500 relative">
    <AppHeader class="relative z-10" />
    <div class="pt-14 relative z-[1]">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
