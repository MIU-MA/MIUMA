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
  }
])

useHead({
  title: '友链 — MIUMA',
})
</script>

<template>
  <section class="flex min-h-screen  ">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h2 class="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6 sm:mb-8">
        {{ $t('home.friendLinks') }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <a
          v-for="link in friendLinks"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700"
        >
          <div class="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div class="relative w-10 h-10 shrink-0">
              <svg
                v-if="!loaded[link.icon]"
                class="absolute inset-0 w-10 h-10 animate-spin text-slate-300 dark:text-slate-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <img
                :src="link.icon"
                alt="Icon"
                loading="lazy"
                :class="['w-10 h-10 rounded-full', loaded[link.icon] ? 'opacity-100' : 'opacity-0']"
                @load="onLoad(link.icon)"
              />
            </div>
            <h3 class="shrink-0 text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              {{ link.name }}
            </h3>
          </div>
          <p class="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            {{ link.bio }}
          </p>
        </a>
      </div>
    </div>
  </section>
</template>
