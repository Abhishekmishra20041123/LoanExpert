'use client'

import { useCallback, useEffect, useState } from 'react'
import { type Bank, type LoanRate, type EligibilityRule, type Lead, type LoanContent } from '@/lib/storage'

export type SiteSettings = {
  whatsappNumber: string
  contactPhone: string
  contactEmail: string
  siteName: string
}

export type EntityCounts = {
  banks: number
  rates: number
  eligibilityRules: number
  leads: number
  loanContents: number
  calculators: number
  blogPosts: number
  faqs: number
}

export function useLoanData() {
  const [banks, setBanks] = useState<Bank[]>([])
  const [rates, setRates] = useState<LoanRate[]>([])
  const [eligibilityRules, setEligibilityRules] = useState<Record<string, EligibilityRule>>({})
  const [leads, setLeads] = useState<Lead[]>([])
  const [loanContents, setLoanContents] = useState<Record<string, LoanContent>>({})
  const [calculatorConfigs, setCalculatorConfigs] = useState<Record<string, any>>({})
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [counts, setCounts] = useState<EntityCounts>({
    banks: 0, rates: 0, eligibilityRules: 0, leads: 0,
    loanContents: 0, calculators: 0, blogPosts: 0, faqs: 0,
  })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const res = await fetch('/api/admin/loan-config', { credentials: 'include' })
    if (!res.ok) return

    const data = (await res.json()) as {
      banks: Bank[]
      rates: LoanRate[]
      eligibilityRules: Record<string, EligibilityRule>
      leads: Lead[]
      loanContents?: Record<string, LoanContent>
      calculatorConfigs?: Record<string, any>
      siteSettings?: SiteSettings | null
      counts?: EntityCounts
    }

    setBanks(data.banks || [])
    setRates(data.rates || [])
    setEligibilityRules(data.eligibilityRules || {})
    setLeads(data.leads || [])
    setLoanContents(data.loanContents || {})
    setCalculatorConfigs(data.calculatorConfigs || {})
    setSiteSettings(data.siteSettings || null)
    if (data.counts) setCounts(data.counts)
  }, [])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        await refresh()
      } finally {
        setLoading(false)
      }
    })()
  }, [refresh])

  // Bank operations
  const addBank = useCallback(async (bank: Omit<Bank, 'id'> & { id?: string }) => {
    const res = await fetch('/api/admin/banks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(bank),
    })
    if (!res.ok) return
    await refresh()
  }, [refresh])

  const updateBank = useCallback(async (id: string, updates: Partial<Bank>) => {
    const res = await fetch(`/api/admin/banks/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    })
    if (!res.ok) return
    await refresh()
  }, [refresh])

  const deleteBank = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/banks/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) return
    await refresh()
  }, [refresh])

  // Rate operations
  const updateRate = useCallback(async (bankId: string, loanType: string, updates: Partial<LoanRate>) => {
    const res = await fetch('/api/admin/rates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        bankId,
        loanType,
        interestRate: updates.interestRate,
        processingFee: updates.processingFee,
      }),
    })
    if (!res.ok) return
    await refresh()
  }, [refresh])

  const getRatesByLoanType = useCallback((loanType: string) => {
    return rates.filter(r => r.loanType === loanType)
  }, [rates])

  // Eligibility operations
  const updateEligibilityRule = useCallback(async (loanType: string, updates: Partial<EligibilityRule>) => {
    const res = await fetch(`/api/admin/eligibility/${encodeURIComponent(loanType)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    })
    if (!res.ok) return
    await refresh()
  }, [refresh])

  const getEligibilityRule = useCallback((loanType: string) => eligibilityRules[loanType], [eligibilityRules])

  const updateLoanContent = useCallback(
    async (loanType: string, updates: Partial<LoanContent>) => {
      const res = await fetch(`/api/admin/loan-content/${encodeURIComponent(loanType)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      })
      if (!res.ok) return
      await refresh()
    },
    [refresh]
  )

  // Lead operations
  const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
    const res = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    })
    if (!res.ok) return
    await refresh()
  }, [refresh])

  const deleteLead = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) return
    await refresh()
  }, [refresh])

  const getLeadStats = useCallback(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const todayStr = now.toDateString()

    return {
      total: leads.length,
      today: leads.filter(l => new Date(l.appliedDate).toDateString() === todayStr).length,
      thisWeek: leads.filter(l => new Date(l.appliedDate) >= weekAgo).length,
      pending: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      approved: leads.filter(l => l.status === 'approved').length,
    }
  }, [leads])

  return {
    // State
    banks,
    rates,
    eligibilityRules,
    leads,
    loanContents,
    calculatorConfigs,
    siteSettings,
    counts,
    loading,

    // Bank operations
    addBank,
    updateBank,
    deleteBank,

    // Rate operations
    updateRate,
    getRatesByLoanType,

    // Eligibility operations
    updateEligibilityRule,
    getEligibilityRule,

    // Loan content operations
    updateLoanContent,

    // Lead operations
    updateLead,
    deleteLead,
    getLeadStats,
  }
}
