export function useScrollHeader(threshold = 0) {
  const y = ref(0)
  const isHidden = ref(false)
  let lastY = 0

  const reveal = () => {
    y.value = Math.max(0, window.scrollY)
    lastY = y.value
    isHidden.value = false
  }

  const onScroll = () => {
    const currentY = Math.max(0, window.scrollY)
    y.value = currentY
    if (currentY <= threshold || currentY < lastY) {
      isHidden.value = false
    } else if (currentY > lastY) {
      isHidden.value = true
    }
    lastY = currentY
  }

  onMounted(() => {
    reveal()
    window.addEventListener('scroll', onScroll, { passive: true })
  })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  const isScroll = computed(() => y.value > threshold)
  return { y, isHidden, isScroll, reveal }
}
