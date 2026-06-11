<script setup lang="ts">

definePageMeta({ layout: false })
useHead({ title: '管理员登录 — MIUMA' })

const { login } = useAuth()
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  if (!username.value || !password.value) {
    errorMsg.value = '请输入用户名和密码'
    return
  }
  loading.value = true
  try {
    await login(username.value, password.value)
    await navigateTo('/admin')
  } catch (err: any) {
    console.error('[login]', err)
    errorMsg.value = err?.data?.message || err?.message || '登录失败，后端是否已启动？'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <NuxtLink to="/">
          <img src="/images/jt.svg" alt="Logo" class="w-16 h-16 mx-auto rounded-full mb-3" />
        </NuxtLink>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">管理员登录</h1>
        <p class="text-sm text-slate-400 mt-1">MIUMA 博客后台</p>
      </div>

      <!-- 错误提示 -->
      <div
        v-if="errorMsg"
        class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800"
      >
        {{ errorMsg }}
      </div>

      <!-- 表单 -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
        <div class="flex flex-col gap-4">
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="用户名"
            class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
          />
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="密码"
            class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
            @keyup.enter="handleLogin"
          />
          <button
            :disabled="loading"
            class="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登  录' }}
          </button>
        </div>
      </div>

      <div class="text-center mt-6">
        <NuxtLink to="/" class="text-sm text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          &larr; 返回前台
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
