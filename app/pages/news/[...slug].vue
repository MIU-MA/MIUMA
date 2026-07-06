<script setup lang="ts">
definePageMeta({ key: route => route.fullPath })

const route = useRoute()

const slugParam = route.params.slug
const targetPath = computed(() => {
  const rawStr = Array.isArray(slugParam) ? slugParam.join('/') : slugParam || ''
  return `/${decodeURIComponent(rawStr)}`
})

const { data: articleList } = await useAsyncData(
  `article-${targetPath.value}`,
  () => queryCollection('content').path(targetPath.value).first(),
  { watch: [targetPath] }
)

const article = computed(() => articleList.value ?? null)

const { data: allData } = await useAsyncData('all-articles-nav', () =>
  queryCollection('content').all()
)

const allArticles = computed(() => {
  if (!allData.value) return []
  return [...allData.value]
    .filter((a: any) => a.date)
    .sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''))
})

const prevArticle = computed(() => {
  if (!allArticles.value) return null
  const idx = allArticles.value.findIndex((a: any) => a.path === targetPath.value)
  return idx > 0 ? allArticles.value[idx - 1] : null
})

const nextArticle = computed(() => {
  if (!allArticles.value) return null
  const idx = allArticles.value.findIndex((a: any) => a.path === targetPath.value)
  return idx < allArticles.value.length - 1 && idx !== -1 ? allArticles.value[idx + 1] : null
})

useHead({
  title: computed(() => article.value?.title ? `${article.value.title} — MIUMA` : '文章 — MIUMA'),
})
</script>

<template>
  <main class="px-4 sm:px-6 py-12 sm:py-20">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-x-4">

      <div v-if="article" class="md:col-span-8 md:col-start-3">

        <header class="mb-6 sm:mb-8">
          <p v-if="article.date" class="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 mb-2 sm:mb-3">
            {{ article.date }}
          </p>
          <h1 class="font-mono text-xl sm:text-3xl uppercase tracking-tight mb-4">
            {{ article.title || (article.meta as any)?.title }}
          </h1>
          <div v-if="article.intro" class="flex gap-2">
            <span class="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500">{{ article.intro }}</span>
          </div>
        </header>

        <hr class="border-black dark:border-white mb-6 sm:mb-8" />

        <div class="prose max-w-none font-light leading-relaxed prose-headings:font-mono prose-headings:uppercase prose-headings:tracking-tight prose-headings:font-normal prose-p:font-light prose-p:leading-relaxed prose-pre:border prose-pre:border-black dark:prose-pre:border-white prose-pre:text-xs sm:prose-pre:text-sm prose-img:border prose-img:border-black dark:prose-img:border-white">
          <ContentRenderer :value="article" />
        </div>

        <hr class="border-black dark:border-white mt-10 sm:mt-12 mb-6 sm:mb-8" />

        <div class="flex justify-between items-center gap-4">
          <NuxtLink
            v-if="prevArticle"
            :to="`/news${prevArticle.path}`"
            class="font-mono text-[10px] sm:text-xs uppercase tracking-wider px-3 py-1.5 bg-white dark:bg-black border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150 truncate max-w-[45%]"
          >
            &larr; PREV
          </NuxtLink>
          <span v-else class="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-300 dark:text-zinc-700">
            &larr; PREV
          </span>

          <NuxtLink
            v-if="nextArticle"
            :to="`/news${nextArticle.path}`"
            class="font-mono text-[10px] sm:text-xs uppercase tracking-wider px-3 py-1.5 bg-white dark:bg-black border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150 truncate max-w-[45%] text-right"
          >
            NEXT &rarr;
          </NuxtLink>
          <span v-else class="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-300 dark:text-zinc-700">
            NEXT &rarr;
          </span>
        </div>

      </div>

      <div v-else class="md:col-span-8 md:col-start-3 py-20">
        <p class="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500">Article not found.</p>
      </div>

    </div>
  </main>
</template>
