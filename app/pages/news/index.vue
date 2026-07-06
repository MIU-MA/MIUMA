<script setup lang="ts">
const { data } = await useAsyncData('articles', () =>
  queryCollection('content')
    .select('path', 'title', 'date', 'intro', 'tags')
    .order('date', 'DESC')
    .all()
)

const articles = computed(() => data.value ?? [])
const { tags, activeTag, filteredArticles, setTag } = useArticleFilter(articles)

useHead({ title: '文章 - MIUMA' })
</script>

<template>
  <main class="px-4 sm:px-6 py-12 sm:py-20">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-x-4">

      <div class="md:col-span-3 md:col-start-2 mb-6 sm:mb-8">
        <h1 class="font-mono text-xl sm:text-2xl uppercase tracking-tight">{{ $t('home.articles') }}</h1>
      </div>

      <div class="md:col-span-7 md:col-start-5 mb-6 sm:mb-8 flex flex-wrap gap-0">
        <button
          :class="[
            'font-mono text-[10px] sm:text-xs uppercase tracking-wider px-2.5 sm:px-3 py-1.5 border border-black dark:border-white transition-all duration-150',
            'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]',
            activeTag === null
              ? 'bg-black text-white dark:bg-white dark:text-black translate-x-[2px] translate-y-[2px] shadow-none'
              : 'bg-white text-black dark:bg-black dark:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none',
          ]"
          @click="activeTag = null"
        >
          ALL
        </button>
        <button
          v-for="tag in tags"
          :key="tag"
          :class="[
            'font-mono text-[10px] sm:text-xs uppercase tracking-wider px-2.5 sm:px-3 py-1.5 border border-black dark:border-white transition-all duration-150',
            'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]',
            activeTag === tag
              ? 'bg-black text-white dark:bg-white dark:text-black translate-x-[2px] translate-y-[2px] shadow-none'
              : 'bg-white text-black dark:bg-black dark:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none',
          ]"
          @click="setTag(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <hr class="md:col-span-10 md:col-start-2 border-black dark:border-white mb-6" />

      <template v-if="filteredArticles.length">
        <div class="md:col-span-10 md:col-start-2 grid grid-cols-1 md:grid-cols-2 gap-0">
          <NuxtLink
            v-for="(article, i) in filteredArticles"
            :key="article.path"
            :to="`/news${article.path}`"
            :class="[
              'group block bg-white dark:bg-black border border-black dark:border-white p-4 sm:p-6 transition-all duration-200',
              'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]',
              'hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]',
              i > 0 ? 'border-t-0 md:border-t' : '',
            ]"
          >
            <p class="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 mb-2 sm:mb-3">
              {{ article.date }}
            </p>
            <h3 class="font-mono text-xs sm:text-sm uppercase tracking-tight mb-2 group-hover:underline underline-offset-4">
              {{ article.title }}
            </h3>
            <p class="font-light text-sm text-zinc-500 leading-relaxed">{{ article.intro }}</p>
          </NuxtLink>
        </div>
      </template>

      <div v-else class="md:col-span-10 md:col-start-2 py-20">
        <p class="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500">
          {{ $t('home.noArticles') }}
        </p>
      </div>

    </div>
  </main>
</template>
