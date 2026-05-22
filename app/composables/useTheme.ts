const THEME_KEY = 'blog-theme'

export function useTheme() {
  const theme = useState<'light' | 'dark'>('blog-theme', () => 'light')

  const apply = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme.value === 'dark')
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  // Sync to DOM + localStorage whenever theme changes
  watch(theme, (val) => {
    apply()
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_KEY, val)
    }
  }, { immediate: false })

  onMounted(() => {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light') {
      theme.value = stored
    } else {
      theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    apply()
  })

  return { theme, toggleTheme }
}
