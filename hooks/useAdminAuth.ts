'use client'

import { useCallback, useEffect, useState } from 'react'

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/admin/me', { credentials: 'include' })
        if (res.ok) {
          const data = (await res.json()) as { authenticated: boolean; email: string }
          if (data.authenticated) {
            setAdminEmail(data.email)
            setIsAuthenticated(true)
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) return false

      const data = (await res.json()) as { ok: boolean; email: string }
      if (data.ok) {
        setAdminEmail(data.email)
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch {
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // ignore
    } finally {
      setAdminEmail(null)
      setIsAuthenticated(false)
      setLoading(false)
    }
  }, [])

  return {
    isAuthenticated,
    adminEmail,
    loading,
    login,
    logout,
  }
}
