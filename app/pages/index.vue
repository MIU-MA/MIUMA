<script setup lang="ts">
useHead({
  title: 'MIUMA',
})
</script>

<template>
  <main>
    <RetroGrid
      :angle="60"
      :cellSize="50"
      :lightOpacity="1"
      :darkOpacity="0.4"
      lightLineColor="#cbd5e1"
      darkLineColor="#38bdf8"
    /> 
    <section class="relative z-10 min-h-screen flex items-center justify-center px-6">
      <div class="max-w-4xl mx-auto text-center -translate-y-25">
        <img src="/images/jt.svg" alt="Avatar" class="w-40 h-40 object-contain mx-auto mb-6" />
        <h1 class="text-4xl z-[1] sm:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
          MIUMA
        </h1>
        <p class="text-lg mb-6 text-slate-900 dark:text-slate-100 mb-4">
          {{ $t('home.description') }}
        </p>
        <div class="flex justify-center gap-4">
          <a href="https://github.com/MIU-MA" target="_blank" rel="noopener noreferrer" class="dark:bg-slate-800 inline-flex items-center gap-2 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105">
            <img src="/images/github.svg" alt="GitHub" class="w-5 h-5" />
          </a>
          <a href="https://space.bilibili.com/295987645?spm_id_from=333.1007.0.0" target="_blank" rel="noopener noreferrer" class="dark:bg-slate-800 inline-flex items-center gap-2 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105">
            <img src="/images/bilibili.svg" alt="Bilibili" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  </main>
</template>
