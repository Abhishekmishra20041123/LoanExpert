'use client'

import { useCallback, useEffect, useState } from 'react'

type CustomerInfo = {
  name: string
  email: string
  phone: string
  city: string
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [customer, setCustomer] = useState<CustomerInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          if (data.authenticated) {
            setCustomer(data.customer)
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

  const login = useCallback(async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || 'Login failed' }

      setCustomer(data.customer)
      setIsAuthenticated(true)
      return { ok: true }
    } catch {
      return { ok: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (info: {
    name: string; email: string; phone: string; city: string; password: string
  }): Promise<{ ok: boolean; error?: string }> => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      })

      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || 'Registration failed' }

      return { ok: true }
    } catch {
      return { ok: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // ignore
    } finally {
      setCustomer(null)
      setIsAuthenticated(false)
      setLoading(false)
    }
  }, [])

  return {
    isAuthenticated,
    customer,
    loading,
    login,
    register,
    logout,
  }
}
