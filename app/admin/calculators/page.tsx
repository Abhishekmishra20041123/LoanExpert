'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LOAN_TYPES } from '@/lib/constants'
import { Save, TrendingUp, Calculator, ChevronDown, ChevronUp } from 'lucide-react'

const CALCULATOR_TYPES = [
  {
    id: 'personal_emi',
    label: 'Personal Loan EMI',
    icon: '💳',
    fields: [
      { key: 'defaultRate', label: 'Default Interest Rate (%)', type: 'number', step: '0.1' },
      { key: 'minLoan', label: 'Min Loan Amount (₹)', type: 'number', step: '1000' },
      { key: 'maxLoan', label: 'Max Loan Amount (₹)', type: 'number', step: '10000' },
      { key: 'minTenure', label: 'Min Tenure (months)', type: 'number', step: '1' },
      { key: 'maxTenure', label: 'Max Tenure (months)', type: 'number', step: '1' },
    ],
    defaults: { defaultRate: 10.5, minLoan: 10000, maxLoan: 3000000, minTenure: 12, maxTenure: 84 },
  },
  {
    id: 'home_emi',
    label: 'Home Loan EMI',
    icon: '🏠',
    fields: [
      { key: 'defaultRate', label: 'Default Interest Rate (%)', type: 'number', step: '0.1' },
      { key: 'minLoan', label: 'Min Loan Amount (₹)', type: 'number', step: '10000' },
      { key: 'maxLoan', label: 'Max Loan Amount (₹)', type: 'number', step: '100000' },
      { key: 'minTenure', label: 'Min Tenure (months)', type: 'number', step: '1' },
      { key: 'maxTenure', label: 'Max Tenure (months)', type: 'number', step: '1' },
    ],
    defaults: { defaultRate: 6.75, minLoan: 500000, maxLoan: 50000000, minTenure: 12, maxTenure: 360 },
  },
  {
    id: 'car_emi',
    label: 'Car Loan EMI',
    icon: '🚗',
    fields: [
      { key: 'defaultRate', label: 'Default Interest Rate (%)', type: 'number', step: '0.1' },
      { key: 'minLoan', label: 'Min Loan Amount (₹)', type: 'number', step: '1000' },
      { key: 'maxLoan', label: 'Max Loan Amount (₹)', type: 'number', step: '10000' },
      { key: 'minTenure', label: 'Min Tenure (months)', type: 'number', step: '1' },
      { key: 'maxTenure', label: 'Max Tenure (months)', type: 'number', step: '1' },
    ],
    defaults: { defaultRate: 8.5, minLoan: 100000, maxLoan: 5000000, minTenure: 12, maxTenure: 84 },
  },
  {
    id: 'business_emi',
    label: 'Business Loan EMI',
    icon: '🏢',
    fields: [
      { key: 'defaultRate', label: 'Default Interest Rate (%)', type: 'number', step: '0.1' },
      { key: 'minLoan', label: 'Min Loan Amount (₹)', type: 'number', step: '10000' },
      { key: 'maxLoan', label: 'Max Loan Amount (₹)', type: 'number', step: '100000' },
      { key: 'minTenure', label: 'Min Tenure (months)', type: 'number', step: '1' },
      { key: 'maxTenure', label: 'Max Tenure (months)', type: 'number', step: '1' },
    ],
    defaults: { defaultRate: 9.5, minLoan: 100000, maxLoan: 10000000, minTenure: 12, maxTenure: 84 },
  },
  {
    id: 'lap_emi',
    label: 'LAP EMI',
    icon: '🏗️',
    fields: [
      { key: 'defaultRate', label: 'Default Interest Rate (%)', type: 'number', step: '0.1' },
      { key: 'minLoan', label: 'Min Loan Amount (₹)', type: 'number', step: '10000' },
      { key: 'maxLoan', label: 'Max Loan Amount (₹)', type: 'number', step: '100000' },
      { key: 'minTenure', label: 'Min Tenure (months)', type: 'number', step: '1' },
      { key: 'maxTenure', label: 'Max Tenure (months)', type: 'number', step: '1' },
    ],
    defaults: { defaultRate: 8.0, minLoan: 500000, maxLoan: 25000000, minTenure: 12, maxTenure: 240 },
  },
  {
    id: 'gold_emi',
    label: 'Gold Loan EMI',
    icon: '🥇',
    fields: [
      { key: 'defaultRate', label: 'Default Interest Rate (%)', type: 'number', step: '0.1' },
      { key: 'goldRatePerGram', label: 'Gold Rate Per Gram (₹)', type: 'number', step: '100' },
      { key: 'ltvPercent', label: 'LTV % (Loan-to-Value)', type: 'number', step: '1' },
      { key: 'minTenure', label: 'Min Tenure (months)', type: 'number', step: '1' },
      { key: 'maxTenure', label: 'Max Tenure (months)', type: 'number', step: '1' },
    ],
    defaults: { defaultRate: 9.0, goldRatePerGram: 6200, ltvPercent: 75, minTenure: 3, maxTenure: 24 },
  },
  {
    id: 'fd',
    label: 'FD Calculator',
    icon: '🏦',
    fields: [
      { key: 'defaultRate', label: 'Default FD Rate (%)', type: 'number', step: '0.1' },
      { key: 'minDeposit', label: 'Min Deposit (₹)', type: 'number', step: '1000' },
      { key: 'maxDeposit', label: 'Max Deposit (₹)', type: 'number', step: '10000' },
      { key: 'minTenureMonths', label: 'Min Tenure (months)', type: 'number', step: '1' },
      { key: 'maxTenureMonths', label: 'Max Tenure (months)', type: 'number', step: '1' },
    ],
    defaults: { defaultRate: 6.5, minDeposit: 1000, maxDeposit: 10000000, minTenureMonths: 6, maxTenureMonths: 120 },
  },
  {
    id: 'mutual_fund',
    label: 'Mutual Fund SIP',
    icon: '📈',
    fields: [
      { key: 'defaultReturnRate', label: 'Default Expected Return (%)', type: 'number', step: '0.1' },
      { key: 'minSip', label: 'Min SIP Amount (₹)', type: 'number', step: '100' },
      { key: 'maxSip', label: 'Max SIP Amount (₹)', type: 'number', step: '1000' },
      { key: 'minTenureYears', label: 'Min Tenure (years)', type: 'number', step: '1' },
      { key: 'maxTenureYears', label: 'Max Tenure (years)', type: 'number', step: '1' },
    ],
    defaults: { defaultReturnRate: 12, minSip: 500, maxSip: 1000000, minTenureYears: 1, maxTenureYears: 30 },
  },
  {
    id: 'home_prepayment',
    label: 'Home Prepayment',
    icon: '💰',
    fields: [
      { key: 'defaultRate', label: 'Default Interest Rate (%)', type: 'number', step: '0.1' },
      { key: 'prepaymentPenaltyPercent', label: 'Prepayment Penalty (%)', type: 'number', step: '0.1' },
    ],
    defaults: { defaultRate: 6.75, prepaymentPenaltyPercent: 0 },
  },
]

type Configs = Record<string, Record<string, any>>
type SavedState = Record<string, boolean>

export default function AdminCalculatorsPage() {
  const [configs, setConfigs] = useState<Configs>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<SavedState>({})
  const [expanded, setExpanded] = useState<string>(CALCULATOR_TYPES[0].id)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/calculators', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const loaded: Configs = {}
        for (const ct of CALCULATOR_TYPES) {
          loaded[ct.id] = data.configs?.[ct.id] ?? ct.defaults
        }
        setConfigs(loaded)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (calcId: string, key: string, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [calcId]: { ...prev[calcId], [key]: parseFloat(value) || 0 },
    }))
  }

  const handleSave = async (calcId: string) => {
    setSaving(prev => ({ ...prev, [calcId]: true }))
    try {
      await fetch('/api/admin/calculators', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ calculatorType: calcId, config: configs[calcId] }),
      })
      setSaved(prev => ({ ...prev, [calcId]: true }))
      setTimeout(() => setSaved(prev => ({ ...prev, [calcId]: false })), 3000)
    } finally {
      setSaving(prev => ({ ...prev, [calcId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center">
          <Calculator className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading calculator settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Calculator Configuration</h1>
        <p className="text-muted-foreground mt-1">
          Set default values, min/max ranges, and rates for each calculator shown to users
        </p>
      </div>

      <div className="space-y-4">
        {CALCULATOR_TYPES.map(ct => {
          const isOpen = expanded === ct.id
          const cfg = configs[ct.id] ?? ct.defaults

          return (
            <Card key={ct.id} className="overflow-hidden">
              {/* Header */}
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                onClick={() => setExpanded(isOpen ? '' : ct.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ct.icon}</span>
                  <div>
                    <p className="font-bold text-foreground">{ct.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {ct.fields.length} configurable settings
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {saved[ct.id] && (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded dark:bg-green-950 dark:text-green-400">
                      ✓ Saved
                    </span>
                  )}
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Fields */}
              {isOpen && (
                <div className="border-t border-border p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {ct.fields.map(field => (
                      <div key={field.key}>
                        <label className="text-sm font-medium text-foreground block mb-1.5">
                          {field.label}
                        </label>
                        <Input
                          type={field.type}
                          step={field.step}
                          value={cfg[field.key] ?? ''}
                          onChange={e => handleChange(ct.id, field.key, e.target.value)}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleSave(ct.id)}
                      disabled={saving[ct.id]}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saving[ct.id] ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setConfigs(prev => ({ ...prev, [ct.id]: { ...ct.defaults } }))
                      }
                    >
                      Reset to Defaults
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
