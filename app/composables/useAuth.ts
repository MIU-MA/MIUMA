function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    let base64 = parts[1]!.replace(/-/g, '+').replace(/_/g, '/')
    const pad = base64.length % 4
    if (pad === 2) base64 += '=='
    else if (pad === 3) base64 += '='
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function useAuth() {
  const token = useCookie<string | null>('blog_admin_token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  })

  const user = computed(() => {
    if (!token.value) return null
    const payload = decodeJwtPayload(token.value)
    if (!payload) return null
    return payload as { sub: number; username: string; iat: number; exp: number }
  })

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  /** 登录 */
  async function loginAction(username: string, password: string) {
    const config = useRuntimeConfig()
    const res = await $fetch<{ access_token: string }>(
      `${config.public.apiBase}/api/auth/login`,
      { method: 'POST', body: { username, password } },
    )
    token.value = res.access_token
    return res
  }

  /** 注册 */
  async function registerAction(username: string, password: string) {
    const config = useRuntimeConfig()
    const res = await $fetch<{ access_token: string }>(
      `${config.public.apiBase}/api/auth/register`,
      { method: 'POST', body: { username, password } },
    )
    token.value = res.access_token
    return res
  }

  /** 退出 */
  function logoutAction() {
    token.value = null
    navigateTo('/admin/login')
  }

  return {
    token,
    user,
    isLoggedIn,
    login: loginAction,
    register: registerAction,
    logout: logoutAction,
  }
}
