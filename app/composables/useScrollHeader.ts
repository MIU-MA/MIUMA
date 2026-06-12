export function useScrollHeader(threshold = 0) {
  const y = ref(0)
  const isHidden = ref(false);

  let lastY=0;
  const onScroll = () => {
    y.value = window.scrollY
    let currentY = y.value;
    if(y.value>threshold&&currentY>lastY){
      isHidden.value = true;
    } else if(currentY<lastY){
      isHidden.value = false;
    }
    lastY = currentY;
  }

    onMounted(() => {
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
    })
    onUnmounted(() => {
        window.removeEventListener('scroll', onScroll)
    })

    const isScroll=computed(() => y.value > threshold);

  return { y, isHidden, isScroll }
}