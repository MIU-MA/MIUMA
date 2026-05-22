export function useBlogLocale() {
  const { locale, setLocale } = useI18n()

  const toggle = () => {
    const next = locale.value === 'zh' ? 'en' : 'zh'
    setLocale(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', next)
      document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
    }
  }

  return { locale, setLocale, toggle }
}
