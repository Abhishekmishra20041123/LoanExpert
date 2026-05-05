'use client'

import { useEffect, useState } from 'react'

/**
 * Reusable hook for public calculator pages.
 * Fetches the DB-driven config for a given calculator type and
 * merges it with the hardcoded defaults, so the admin-configured
 * values override only the fields they've set.
 *
 * Usage:
 *   const { config, loading } = useCalculatorConfig('home_emi', {
 *     defaultRate: 7.25, minLoan: 500000, maxLoan: 50000000,
 *     minTenure: 12, maxTenure: 360,
 *   })
 */
export function useCalculatorConfig<T extends Record<string, any>>(
  calculatorType: string,
  defaults: T
): { config: T; loading: boolean } {
  const [config, setConfig] = useState<T>(defaults)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch(`/api/public/calculator-config/${encodeURIComponent(calculatorType)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        if (data.config && typeof data.config === 'object') {
          // Merge: DB values override defaults
          setConfig(prev => ({ ...prev, ...data.config }))
        }
      })
      .catch(() => {
        // Silently fall back to defaults
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [calculatorType]) // eslint-disable-line react-hooks/exhaustive-deps

  return { config, loading }
}
