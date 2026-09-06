<script setup lang="ts">
import { workNodes } from '~/data/works'

const { t } = useI18n()
useHead(() => ({ title: `${t('nav.work')} — MIUMA` }))
</script>

<template>
  <main>
    <ClientOnly>
      <WorkAtlas :nodes="workNodes" />
      <template #fallback>
        <section class="min-h-[calc(100svh-3rem)] px-5 py-8 sm:px-12">
          <p class="text-xs text-zinc-500 mb-3">{{ t('work.eyebrow') }}</p>
          <h1 class="font-mono text-3xl tracking-tight">WORK ATLAS.</h1>
          <p class="mt-24 text-center text-sm text-zinc-500" role="status">{{ t('work.loading') }}</p>
        </section>
      </template>
    </ClientOnly>
  </main>
</template>
