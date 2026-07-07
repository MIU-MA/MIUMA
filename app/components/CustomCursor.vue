<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
const x=ref(-100);
const y=ref(-100);
const isHovering=ref(false);
const onMouseMove=(e:MouseEvent)=>{
    x.value=e.clientX;
    y.value=e.clientY;
    const target=e.target as HTMLElement;
   if (target && target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer')) {
    isHovering.value = true
  } else {
    isHovering.value = false
  }
};
onMounted(()=>{
    window.addEventListener('mousemove',onMouseMove);
});
onUnmounted(()=>{
    window.removeEventListener('mousemove',onMouseMove);
});
</script>
<template>
<div
    class="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center transition-opacity duration-150"
    :class="isHovering ? 'opacity-100' : 'opacity-0'"
    :style="{ transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))` }"
  >
    <div
      class="h-[14px] w-[4px] border-y border-l border-black dark:border-white transition-transform duration-300 ease-out"
      :class="isHovering ? '-translate-x-[6px]' : '-translate-x-[16px]'"
    ></div>

    <div
      class="h-[14px] w-[4px] border-y border-r border-black dark:border-white transition-transform duration-300 ease-out"
      :class="isHovering ? 'translate-x-[6px]' : 'translate-x-[16px]'"
    ></div>
  </div>
</template>