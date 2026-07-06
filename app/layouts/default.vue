<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'zh-CN' },
  link: [{ rel: 'icon', href: '/favicon.png' }],
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-black ">
    <AppHeader />
    <div class="pt-12">
      <slot />
    </div>
    <Music />
  </div>
</template>
