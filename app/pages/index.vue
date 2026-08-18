<script setup lang="ts">
import { ref } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)
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
  <main class="px-4 sm:px-6 min-h-[calc(100vh-3rem)] flex items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
         style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 32px 32px;">
    </div>

    <div class="fixed bottom-3 right-4 z-40 hidden md:flex flex-col items-end font-mono text-[9px] leading-4 opacity-30 select-none pointer-events-none">
      <span>X: {{ mouseX }}</span>
      <span>Y: {{ mouseY }}</span>
    </div>

    <div class="hidden lg:block relative z-10 w-full max-w-4xl mx-auto h-[640px] select-none">

      <div class="absolute left-1/2 top-[2%] bottom-[2%] -translate-x-1/2 w-px border-l border-dashed border-black/15 dark:border-white/15 pointer-events-none"></div>

      <div class="absolute left-[20%] right-[20%] top-[5%] border-t border-dashed border-black/15 dark:border-white/15 pointer-events-none"></div>

      <span class="absolute left-1/2 top-[8%] -translate-x-1/2 w-1.5 h-1.5 rotate-45 border border-black/40 dark:border-white/40 pointer-events-none"></span>

      <span class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-black dark:border-white pointer-events-none"></span>
      <span class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-black dark:border-white pointer-events-none"></span>
      <span class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-black dark:border-white pointer-events-none"></span>
      <span class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-black dark:border-white pointer-events-none"></span>

      <div class="absolute left-[15%] top-[33%] h-16 border-l border-dashed border-black/25 dark:border-white/25 pointer-events-none"></div>
      <div class="absolute right-[15%] top-[42%] h-14 border-l border-dashed border-black/25 dark:border-white/25 pointer-events-none"></div>

      <div class="absolute left-1/2 bottom-[18%] -translate-x-1/2 w-40 border-t border-dashed border-black/15 dark:border-white/15 pointer-events-none"></div>

      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <NuxtLink
          to="/"
          class="relative block rotate-2
                 bg-white dark:bg-black border border-black dark:border-white p-3 pb-3.5 text-center
                 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]
                 hover:rotate-0 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200"
        >
          <span class="absolute -right-5 -top-3 font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-white dark:bg-black border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] rotate-6">
            SYS.VER_2.0.4
          </span>
          <img
            src="/images/jt.svg"
            alt="Avatar"
            class="w-32 aspect-square object-cover border border-black dark:border-white"
          />
          <p class="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] leading-none">MIUMA</p>
        </NuxtLink>

        <span class="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-black dark:border-white pointer-events-none"></span>
        <span class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-black dark:border-white pointer-events-none"></span>
        <span class="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-black dark:border-white pointer-events-none"></span>
        <span class="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-black dark:border-white pointer-events-none"></span>
      </div>

      <NuxtLink
        to="/news"
        class="group absolute left-[10%] top-[12%] w-64 p-4 flex items-center justify-between gap-3 text-left select-auto
               bg-white dark:bg-black border border-black dark:border-white
               shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
               hover:-translate-y-1 hover:-translate-x-1 hover:rotate-0 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]
               lg:-rotate-3 transition-all duration-200"
      >
        <div class="flex-1">
          <p class="font-mono text-[10px] uppercase tracking-wider mb-1 text-zinc-500">01</p>
          <p class="font-mono text-base uppercase tracking-tight">{{ $t('nav.articles') }}</p>
          <div class="my-2 h-px w-20 bg-black dark:bg-white"></div>
          <p class="font-light text-xs text-zinc-500 leading-relaxed">笔记合集</p>
        </div>
        <p class="font-mono text-base shrink-0 group-hover:underline underline-offset-4">&rarr;</p>
      </NuxtLink>

      <NuxtLink
        to="/friendlink"
        class="group absolute right-[10%] top-[12%] w-40 p-4 py-8 flex flex-col justify-between text-left select-auto
               bg-white dark:bg-black border border-black dark:border-white
               shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
               hover:-translate-y-1 hover:-translate-x-1 hover:rotate-0 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]
               lg:rotate-[4deg] transition-all duration-200"
      >
        <div>
          <p class="font-mono text-[10px] uppercase tracking-wider mb-1 text-zinc-500">03</p>
          <p class="font-mono text-sm uppercase tracking-tight">{{ $t('nav.friendlink') }}</p>
        </div>
        <div>
          <p class="font-light text-[10px] text-zinc-500 mb-3 leading-relaxed">超级大佬们</p>
          <p class="font-mono text-[10px] uppercase tracking-wider group-hover:underline underline-offset-4">&rarr;</p>
        </div>
      </NuxtLink>

      <div class="absolute left-[44%] top-[14%] lg:-rotate-2 select-auto">
        <a
          href="https://github.com/MIU-MA"
          target="_blank"
          rel="noopener noreferrer"
          class="group block w-32 px-3 py-2 flex items-center justify-between gap-2 text-left
                 bg-white dark:bg-black border border-black dark:border-white
                 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]
                 hover:-translate-y-1 hover:-translate-x-1 hover:rotate-0 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all duration-200"
        >
          <span class="font-mono text-[9px] uppercase tracking-wider">GitHub</span>
          <span class="font-mono text-[10px] group-hover:underline underline-offset-4">&rarr;</span>
        </a>
      </div>

      <NuxtLink
        to="/work"
        class="group absolute right-[7%] bottom-[28%] w-64 p-4 flex items-center justify-between gap-3 text-left select-auto
               bg-white dark:bg-black border border-black dark:border-white
               shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
               hover:-translate-y-1 hover:-translate-x-1 hover:rotate-0 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]
               lg:-rotate-3 transition-all duration-200"
      >
        <div class="flex-1">
          <p class="font-mono text-[10px] uppercase tracking-wider mb-1 text-zinc-500">04</p>
          <p class="font-mono text-base uppercase tracking-tight">{{ $t('nav.work') }}</p>
          <div class="my-2 h-px w-20 bg-black dark:bg-white"></div>
          <p class="font-light text-xs text-zinc-500 leading-relaxed">小作品</p>
        </div>
        <p class="font-mono text-base shrink-0 group-hover:underline underline-offset-4">&rarr;</p>
      </NuxtLink>

      <NuxtLink
        to="/about"
        class="group absolute left-[10%] bottom-[30%] w-44 p-4 flex flex-col justify-between gap-3 text-left select-auto
               bg-white dark:bg-black border border-black dark:border-white
               shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
               hover:-translate-y-1 hover:-translate-x-1 hover:rotate-0 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]
               lg:rotate-[3deg] transition-all duration-200"
      >
        <div>
          <p class="font-mono text-[10px] uppercase tracking-wider mb-0.5 text-zinc-500">02</p>
          <p class="font-mono text-base uppercase tracking-tight">{{ $t('nav.about') }}</p>
        </div>
        <div>
          <p class="font-light text-xs text-zinc-500 mb-2 leading-relaxed">碎碎念</p>
          <p class="font-mono text-[10px] uppercase tracking-wider group-hover:underline underline-offset-4">&rarr;</p>
        </div>
      </NuxtLink>

      <div class="absolute right-[44%] bottom-[24%] lg:rotate-2 select-auto">
        <a
          href="https://space.bilibili.com/295987645"
          target="_blank"
          rel="noopener noreferrer"
          class="group block w-32 px-3 py-2 flex items-center justify-between gap-2 text-left
                 bg-white dark:bg-black border border-black dark:border-white
                 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]
                 hover:-translate-y-1 hover:-translate-x-1 hover:rotate-0 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all duration-200"
        >
          <span class="font-mono text-[9px] uppercase tracking-wider">BiliBili</span>
          <span class="font-mono text-[10px] group-hover:underline underline-offset-4">&rarr;</span>
        </a>
      </div>

    </div>

    <div class="lg:hidden relative z-10 w-full max-w-sm mx-auto flex flex-col items-center text-center">

      <h1 class="font-mono text-4xl uppercase tracking-tighter leading-none select-none">MIUMA</h1>

      <NuxtLink to="/" class="relative mt-6 inline-block rotate-1 bg-white dark:bg-black border border-black dark:border-white p-2.5 pb-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
        <img
          src="/images/jt.svg"
          alt="Avatar"
          class="w-28 aspect-square object-cover border border-black dark:border-white"
        />
        <span class="absolute -right-4 -top-3 font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-white dark:bg-black border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] rotate-6 select-none">
          SYS.VER_2.0.4
        </span>
      </NuxtLink>

      <p class="mt-4 font-light text-sm leading-relaxed text-zinc-500">
        {{ $t('home.description') }}
      </p>

      <div class="mt-4 flex justify-center gap-3">
        <a
          href="https://github.com/MIU-MA"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 bg-white dark:bg-black border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
        >
          GitHub
        </a>
        <a
          href="https://space.bilibili.com/295987645"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 bg-white dark:bg-black border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
        >
          BiliBili
        </a>
      </div>

      <div class="mt-8 w-full grid grid-cols-2 gap-3">
        <NuxtLink to="/news" class="group block bg-white dark:bg-black border border-black dark:border-white p-4 text-left
                                    shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
          <p class="font-mono text-[10px] uppercase tracking-wider mb-0.5 text-zinc-500">01</p>
          <p class="font-mono text-base uppercase tracking-tight">{{ $t('nav.articles') }}</p>
          <p class="font-light text-xs text-zinc-500 mt-1 leading-relaxed">笔记合集</p>
        </NuxtLink>
        <NuxtLink to="/about" class="group block bg-white dark:bg-black border border-black dark:border-white p-4 text-left
                                    shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
          <p class="font-mono text-[10px] uppercase tracking-wider mb-0.5 text-zinc-500">02</p>
          <p class="font-mono text-base uppercase tracking-tight">{{ $t('nav.about') }}</p>
          <p class="font-light text-xs text-zinc-500 mt-1 leading-relaxed">碎碎念</p>
        </NuxtLink>
        <NuxtLink to="/friendlink" class="group block bg-white dark:bg-black border border-black dark:border-white p-4 text-left
                                        shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
          <p class="font-mono text-[10px] uppercase tracking-wider mb-0.5 text-zinc-500">03</p>
          <p class="font-mono text-base uppercase tracking-tight">{{ $t('nav.friendlink') }}</p>
          <p class="font-light text-xs text-zinc-500 mt-1 leading-relaxed">超级大佬们</p>
        </NuxtLink>
        <NuxtLink to="/work" class="group block bg-white dark:bg-black border border-black dark:border-white p-4 text-left
                                    shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
          <p class="font-mono text-[10px] uppercase tracking-wider mb-0.5 text-zinc-500">04</p>
          <p class="font-mono text-base uppercase tracking-tight">{{ $t('nav.work') }}</p>
          <p class="font-light text-xs text-zinc-500 mt-1 leading-relaxed">小作品</p>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>