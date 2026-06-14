<script setup lang="ts">
import { CalendarDays, Tag } from 'lucide-vue-next'

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
  <main class="min-h-screen translate-y-5 relative z-10">
    <section class="px-6 pb-24">
      <div class="max-w-4xl mx-auto">
        <h1 class="flex justify-center text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
          {{ $t('home.articles') }}
        </h1>

        <div class="flex flex-wrap gap-2 mb-6">
          <button
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium transition-colors',
              activeTag === null
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
            ]"
            @click="activeTag = null"
          >
            全部
          </button>

          <button
            v-for="tag in tags"
            :key="tag"
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium transition-colors',
              activeTag === tag
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
            ]"
            @click="setTag(tag)"
          >
            {{ tag }}
          </button>
        </div>

        <template v-if="filteredArticles.length">
          <div class="grid gap-6">
            <NuxtLink
              v-for="article in filteredArticles"
              :key="article.path"
              :to="`/news${article.path}`"
              class="block rounded-lg p-6 transition-colors dark:bg-slate-800 hover:bg-slate-500/5 dark:hover:bg-slate-100/5"
            >
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {{ article.title }}
              </h3>
              <p class="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-3">
                <Tag class="w-4 h-4 mr-1" />{{ article.intro }}
              </p>
              <span class="flex items-center text-xs text-slate-400 dark:text-slate-500">
                <CalendarDays class="w-4 h-4 mr-1" />{{ article.date }}
              </span>
            </NuxtLink>
          </div>
        </template>

        <div v-else class="text-center py-20">
          <p class="text-slate-400 dark:text-slate-500">
            {{ $t('home.noArticles') }}
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
