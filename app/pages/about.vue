<script setup lang="ts">
import { BatteryMedium, Tag } from 'lucide-vue-next'
useHead({
  title: '关于 — MIUMA',
})
</script>

<template>
  <main class="min-h-screen">
    <section class="max-w-4xl mx-auto px-6 py-12">
      <h1 class="text-center text-3xl font-bold text-slate-900 dark:text-slate-100 mb-12">
        {{ $t('home.about') }}
      </h1>

      <div class="flex items-center gap-8 flex-col md:flex-row">
        <img
          src="/images/jt.svg"
          alt="Avatar"
          class="w-32 h-32 rounded-full shrink-0"
        />

        <div>
          <h2 class="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            MIUMA
          </h2>

          <p class="text-slate-500 dark:text-slate-400 text-lg mb-5">
            {{ $t('home.aboutDescription') }}<br />
            {{ $t('home.aboutDescription2') }}
          </p>

          <div class="flex flex-wrap gap-3">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-pink-100 dark:bg-slate-800 hover:bg-slate-500 hover:text-white transition-colors px-4 py-2 cursor-pointer">
              <Tag class="w-4 h-4" />
              睡觉
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-pink-100 dark:bg-slate-800 hover:bg-slate-500 hover:text-white transition-colors px-4 py-2 cursor-pointer">
              <Tag class="w-4 h-4" />
              睡觉
            </span>
            <NuxtLink to="/Music" class="inline-flex items-center gap-1.5 rounded-full bg-pink-100 dark:bg-slate-800 hover:bg-slate-500 hover:text-white transition-colors px-4 py-2 cursor-pointer">
              <Tag class="w-4 h-4" />
              还是睡觉
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-4xl mx-auto px-6 py-12">
      <div class="flex justify-center items-center gap-4 mb-6">
        <BatteryMedium class="w-5 h-5 text-slate-400 dark:text-slate-500" />
        <h2 class="text-xl font-semibold text-slate-400 dark:text-slate-100">
          我不想毕业哇..........
        </h2>
      </div>
      <ProgressBar />
    </section>
  </main>
</template>
