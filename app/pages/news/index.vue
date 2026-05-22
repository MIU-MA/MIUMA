<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next'

const { data } = await useAsyncData('articles', () =>
  queryCollection('content')
    .select('path', 'title', 'date', 'intro')
    .order('date', 'DESC')
    .all()
)

const articles = computed(() => data.value!)

useHead({ title: '文章 - MIUMA' })
</script>

<template>
  <main class="min-h-screen translate-y-5 relative z-10">
    <section class="px-6 pb-24">
      <div class="max-w-4xl mx-auto">
        <h1 class="flex justify-center text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
          {{ $t('home.articles') }}
        </h1>

        <template v-if="articles.length">
          <div class="grid gap-6">
            <NuxtLink
              v-for="article in articles"
              :key="article.path"
              :to="`/news${article.path}`"
              class="block rounded-lg p-6 transition-colors hover:bg-slate-900/5 dark:hover:bg-slate-100/5"
            >
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {{ article.title }}
              </h3>
              <p class="text-slate-500 dark:text-slate-400 text-sm mb-3">
                {{ article.intro }}
              </p>
              <span class="inline-flex items-center text-xs text-slate-400 dark:text-slate-500">
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
