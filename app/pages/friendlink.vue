<script lang="ts" setup>
const loaded = reactive<Record<string, boolean>>({})

function onLoad(url: string) {
  loaded[url] = true
}

const friendLinks = computed(() => [
  {
    name: '江西财经大学数智技术协会',
    url: 'https://www.jxufe-tech.top',
    bio: '快来加入我们吧！',
    icon: '/images/logo.jpg',
  },
  {
    name: '糖糖毬',
    url: 'https://tantanchugasuki.cn/',
    bio: '是TangTangChu大人喵',
    icon: 'https://img.tantanchugasuki.cn/i/r/avatar',
  },
  {
    name: 'Heaven',
    url: 'https://www.dearheaven.cn',
    bio: '热爱可抵岁月漫长',
    icon: 'https://pic-bed.dearheaven.cn/img/avator.webp',
  },
  {
    name: 'Woodfish',
    url: 'https://www.woodfish.site',
    bio: 'woodfish!orz orz orz',
    icon: 'https://www.woodfish.site/newBlog/asset/f725f7fc67d79930b505550749765877.webp',
  },
])

useHead({ title: '友链 — MIUMA' })
</script>

<template>
  <main class="px-4 sm:px-6 py-12 sm:py-20">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-x-4">

      <div class="md:col-span-3 md:col-start-2 mb-6 sm:mb-8">
        <h1 class="font-mono text-xl sm:text-2xl uppercase tracking-tight">{{ $t('home.friendLinks') }}</h1>
      </div>

      <hr class="md:col-span-10 md:col-start-2 border-black dark:border-white mb-6 sm:mb-8" />

      <div class="md:col-span-10 md:col-start-2 grid grid-cols-1 md:grid-cols-2 gap-0">
        <a
          v-for="(link, i) in friendLinks"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          :class="[
            'group block bg-white dark:bg-black border border-black dark:border-white p-4 sm:p-5 transition-all duration-200',
            'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]',
            'hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]',
            i > 0 ? 'border-t-0 md:border-t' : '',
          ]"
        >
          <div class="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div class="relative w-10 h-10 shrink-0 border border-black dark:border-white">
              <img
                :src="link.icon"
                alt="Icon"
                loading="lazy"
                :class="['w-full h-full object-cover', loaded[link.icon] ? 'opacity-100' : 'opacity-0']"
                @load="onLoad(link.icon)"
              />
            </div>
            <h3 class="font-mono text-[10px] sm:text-xs uppercase tracking-wider group-hover:underline underline-offset-4 leading-tight">
              {{ link.name }}
            </h3>
          </div>
          <p class="font-light text-sm text-zinc-500 leading-relaxed">{{ link.bio }}</p>
        </a>
      </div>

    </div>
  </main>
</template>
