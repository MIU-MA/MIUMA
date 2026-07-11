<script setup lang="ts">
import {ref} from 'vue'
let mouseX = ref(0)
let mouseY = ref(0)
const updateMousePosition = (event: MouseEvent) => {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
}
onMounted(() => {
  window.addEventListener('mousemove', updateMousePosition)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', updateMousePosition)
})
</script>
<template>
  <main class="px-4 sm:px-6 min-h-[calc(100vh-3rem)] flex items-center justify-center relative">
    <div class="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
         style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 32px 32px;">
    </div>

    <div class="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-4 relative z-10">

      <div class="hidden md:flex flex-col justify-between items-start col-span-1 col-start-1 border-l border-black dark:border-white pl-2 opacity-40">
        <span class="font-mono text-xs">+</span>
        <span class="font-mono text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 my-8 select-none">
          SYS.VER_2.0.4
        </span>
        <span class="font-mono text-xs">+</span>
      </div>

      <div class="md:col-span-3 md:col-start-3">
        <NuxtLink to="/">
          <img
            src="/images/jt.svg"
            alt="Avatar"
            class="w-36 md:w-40 aspect-square object-cover border border-black dark:border-white mx-auto sm:mx-0 
                   shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
                   hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200"
          />
        </NuxtLink>
      </div>

      <div class="md:col-span-5 md:col-start-6 mt-6 md:mt-10">
        <h1 class="font-mono text-3xl sm:text-5xl uppercase tracking-tighter font-normal mb-6 text-center sm:text-left">
          MIUMA
        </h1>
        <p class="font-light text-base sm:text-lg leading-relaxed text-zinc-500 mb-8 text-center sm:text-left">
          {{ $t('home.description') }}
        </p>
        <div class="flex justify-center sm:justify-start gap-4">
          <a
            href="https://github.com/MIU-MA"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono text-[10px] sm:text-xs uppercase tracking-wider px-4 py-2 bg-white dark:bg-black border border-black dark:border-white 
                   shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]
                   hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150 "
          >
            GitHub
          </a>
          <a
            href="https://space.bilibili.com/295987645"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono text-[10px] sm:text-xs uppercase tracking-wider px-4 py-2 bg-white dark:bg-black border border-black dark:border-white 
                   shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]
                   hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150"
          >
            BiliBili
          </a>
        </div>
      </div>

      <div class="hidden md:flex flex-col justify-between items-end col-span-1 col-start-12 border-r border-black dark:border-white pr-2 opacity-40">
        <span class="font-mono text-xs">+</span>
        <div class="text-right">
          <p class="font-mono text-[9px]">X: {{ mouseX }}</p>
          <p class="font-mono text-[9px]">Y: {{ mouseY }}</p>
        </div>
        <span class="font-mono text-xs">+</span>
      </div>

      <hr class="md:col-span-12 border-black dark:border-white mt-10 sm:mt-12 mb-12 sm:mb-16" />

      <div class="md:col-span-3 md:-mt-6 mb-6 md:mb-0">
        <NuxtLink to="/news" class="group block bg-white dark:bg-black border border-black dark:border-white p-4 sm:p-5 
                                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
                                    hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200">
          <p class="font-mono text-[10px] sm:text-xs uppercase tracking-wider mb-1 text-zinc-500">01</p>
          <p class="font-mono text-base sm:text-lg uppercase tracking-tight">{{ $t('nav.articles') }}</p>
          <p class="font-light text-sm text-zinc-500 mt-1 sm:mt-2 leading-relaxed">其实只是用来存放笔记的啦</p>
          <p class="font-mono text-[10px] sm:text-xs uppercase tracking-wider mt-3 sm:mt-4 group-hover:underline underline-offset-4">&rarr;</p>
        </NuxtLink>
      </div>

      <div class="md:col-span-3 md:mt-12 mb-6 md:mb-0">
        <NuxtLink to="/about" class="group block bg-white dark:bg-black border border-black dark:border-white p-4 sm:p-5 
                                     shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
                                     hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200">
          <p class="font-mono text-[10px] sm:text-xs uppercase tracking-wider mb-1 text-zinc-500">02</p>
          <p class="font-mono text-base sm:text-lg uppercase tracking-tight">{{ $t('nav.about') }}</p>
          <p class="font-light text-sm text-zinc-500 mt-1 sm:mt-2 leading-relaxed">一点碎碎念</p>
          <p class="font-mono text-[10px] sm:text-xs uppercase tracking-wider mt-3 sm:mt-4 group-hover:underline underline-offset-4">&rarr;</p>
        </NuxtLink>
      </div>

      <div class="md:col-span-3 md:mt-2 mb-6 md:mb-0">
        <NuxtLink to="/friendlink" class="group block bg-white dark:bg-black border border-black dark:border-white p-4 sm:p-5 
                                          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
                                          hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200">
          <p class="font-mono text-[10px] sm:text-xs uppercase tracking-wider mb-1 text-zinc-500">03</p>
          <p class="font-mono text-base sm:text-lg uppercase tracking-tight">{{ $t('nav.friendlink') }}</p>
          <p class="font-light text-sm text-zinc-500 mt-1 sm:mt-2 leading-relaxed">超级大佬们</p>
          <p class="font-mono text-[10px] sm:text-xs uppercase tracking-wider mt-3 sm:mt-4 group-hover:underline underline-offset-4">&rarr;</p>
        </NuxtLink>
      </div>

      <div class="md:col-span-3 md:mt-16">
        <NuxtLink to="/work" class="group block bg-white dark:bg-black border border-black dark:border-white p-4 sm:p-5 
                                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
                                    hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200">
          <p class="font-mono text-[10px] sm:text-xs uppercase tracking-wider mb-1 text-zinc-500">04</p>
          <p class="font-mono text-base sm:text-lg uppercase tracking-tight">{{ $t('nav.work') }}</p>
          <p class="font-light text-sm text-zinc-500 mt-1 sm:mt-2 leading-relaxed">一些小作品</p>
          <p class="font-mono text-[10px] sm:text-xs uppercase tracking-wider mt-3 sm:mt-4 group-hover:underline underline-offset-4">&rarr;</p>
        </NuxtLink>
      </div>

    </div>
  </main>
</template>