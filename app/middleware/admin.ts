
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/admin/login') return

  const token = useCookie<string | null>('blog_admin_token')
  if (!token.value) {
    return navigateTo('/admin/login')
  }
})
