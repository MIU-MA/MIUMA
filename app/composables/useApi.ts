/**
 * API 请求封装 —— 从 useAuth 拿 token，与登录页共用同一 cookie 实例。
 */

export function useApi() {
  const { token, logout } = useAuth()
  const config = useRuntimeConfig()

  async function request<T>(
    path: string,
    { method = 'GET', body }: { method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; body?: any } = {},
  ): Promise<T> {
    const headers: Record<string, string> = {}

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    // 非 FormData 设 Content-Type
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    try {
      return await $fetch<T>(`${config.public.apiBase}${path}`, {
        method,
        headers,
        body,
      })
    } catch (err: any) {
      if (err?.response?.status === 401) {
        logout()
        throw new Error('登录已过期')
      }
      throw err
    }
  }

  return {
    get: <T = any>(path: string) => request<T>(path),
    post: <T = any>(path: string, body?: any) => request<T>(path, { method: 'POST', body }),
    patch: <T = any>(path: string, body?: any) => request<T>(path, { method: 'PATCH', body }),
    delete: <T = any>(path: string) => request<T>(path, { method: 'DELETE' }),
    upload: <T = any>(path: string, formData: FormData) =>
      request<T>(path, { method: 'POST', body: formData }),
  }
}
