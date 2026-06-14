export function useArticleFilter<T extends { tags?: string[] }>(articles: Ref<T[]>) {
  const activeTag = ref<string | null>(null)

  const tags = computed<string[]>(() => {
    const raw = articles.value.flatMap((a) => a.tags ?? [])
    return [...new Set(raw)].sort()
  })

  const filteredArticles = computed(() => {
    if (activeTag.value === null) return articles.value
    return articles.value.filter((a) => a.tags?.includes(activeTag.value!))
  })

  const setTag = (tag: string) => {
    activeTag.value = activeTag.value === tag ? null : tag
  }

  return { tags, activeTag, filteredArticles, setTag }
}
