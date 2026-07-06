<script setup lang="ts">
useHead({ title: '关于 — MIUMA' })
</script>

<template>
  <main class="px-4 sm:px-6 py-12 sm:py-20">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-x-4">

      <div class="md:col-span-3 md:col-start-2 mb-6 sm:mb-8">
        <h1 class="font-mono text-xl sm:text-2xl uppercase tracking-tight">{{ $t('home.about') }}</h1>
      </div>

      <hr class="md:col-span-10 md:col-start-2 border-black dark:border-white mb-6 sm:mb-8" />

      <div class="md:col-span-2 md:col-start-2">
        <img
          src="/images/jt.svg"
          alt="Avatar"
          class="w-32 sm:w-full border border-black dark:border-white mx-auto sm:mx-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
        />
      </div>

      <div class="md:col-span-5 md:col-start-5 mt-4 sm:mt-8">
        <h2 class="font-mono text-base sm:text-lg uppercase tracking-tight mb-3 sm:mb-4">MIUMA</h2>
        <p class="font-light text-sm sm:text-base leading-relaxed text-zinc-500 mb-3 sm:mb-4">
          {{ $t('home.aboutDescription') }}
        </p>
        <p class="font-light text-sm sm:text-base leading-relaxed text-zinc-500 mb-5 sm:mb-6">
          {{ $t('home.aboutDescription2') }}
        </p>
        <div class="flex flex-wrap gap-0">
          <span class="font-mono text-[10px] sm:text-xs uppercase tracking-wider px-2.5 sm:px-3 py-1.5 bg-white dark:bg-black border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">睡觉</span>
          <span class="font-mono text-[10px] sm:text-xs uppercase tracking-wider px-2.5 sm:px-3 py-1.5 bg-white dark:bg-black border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">睡觉</span>
          <NuxtLink
            to="/test"
            class="font-mono text-[10px] sm:text-xs uppercase tracking-wider px-2.5 sm:px-3 py-1.5 bg-white dark:bg-black border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150"
          >
            还是睡觉
          </NuxtLink>
        </div>
      </div>

      <hr class="md:col-span-10 md:col-start-2 border-black dark:border-white my-8 sm:my-12" />

      <div class="md:col-span-5 md:col-start-5 md:-mt-4">
        <h2 class="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 mb-3 sm:mb-4">我不想毕业哇..........</h2>
        <ProgressBar />
      </div>

    </div>
  </main>
</template>
