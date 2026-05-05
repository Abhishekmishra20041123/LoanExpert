'use client'

import { useState } from 'react'
import { useLoanData } from '@/hooks/useLoanData'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, Trash2, Plus, X, ChevronDown } from 'lucide-react'
import { LOAN_TYPES } from '@/lib/constants'

const DEFAULT_RATES: Record<string, { rate: number; fee: number }> = {
  personal: { rate: 10.5, fee: 1.5 },
  home: { rate: 6.75, fee: 0.5 },
  business: { rate: 9.5, fee: 2 },
  car: { rate: 8.5, fee: 1.5 },
  lap: { rate: 8.0, fee: 1.5 },
}

export default function AdminBanksPage() {
  const { banks, rates: allRates, addBank, updateBank, deleteBank, updateRate } = useLoanData()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<{ name: string; contactPerson: string; logo: string }>({
    name: '',
    contactPerson: '',
    logo: '🏦',
  })

  // Inline rates per loan type when adding a new bank
  const [rates, setRates] = useState<Record<string, { rate: string; fee: string }>>(
    Object.fromEntries(
      LOAN_TYPES.map(lt => [lt.id, {
        rate: String(DEFAULT_RATES[lt.id]?.rate ?? 10),
        fee: String(DEFAULT_RATES[lt.id]?.fee ?? 1),
      }])
    )
  )

  const resetForm = () => {
    setEditingId(null)
    setShowForm(false)
    setForm({ name: '', contactPerson: '', logo: '🏦' })
    setRates(
      Object.fromEntries(
        LOAN_TYPES.map(lt => [lt.id, {
          rate: String(DEFAULT_RATES[lt.id]?.rate ?? 10),
          fee: String(DEFAULT_RATES[lt.id]?.fee ?? 1),
        }])
      )
    )
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) return

    if (editingId) {
      await updateBank(editingId, {
        name: form.name,
        contactPerson: form.contactPerson,
        logo: form.logo,
      })
      
      // Update individual rates
      for (const lt of LOAN_TYPES) {
        await updateRate(editingId, lt.id, {
          interestRate: parseFloat(rates[lt.id]?.rate) || 0,
          processingFee: parseFloat(rates[lt.id]?.fee) || 0,
        })
      }
    } else {
      // Build bank with initial rates embedded
      const ratesPayload = LOAN_TYPES.map(lt => ({
        loanType: lt.id,
        interestRate: parseFloat(rates[lt.id]?.rate) || 10,
        processingFee: parseFloat(rates[lt.id]?.fee) || 1,
      }))

      await addBank({
        name: form.name,
        contactPerson: form.contactPerson,
        logo: form.logo,
        // @ts-ignore — server accepts initialRates
        initialRates: ratesPayload,
      })
    }

    resetForm()
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Banks Management</h1>
          <p className="text-muted-foreground mt-1">Manage partner banks and their interest rates</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Bank
        </Button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <Card className="p-6 mb-8 border-primary/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {editingId ? 'Edit Bank' : 'Add New Bank'}
            </h2>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Bank Name *</label>
              <Input
                placeholder="e.g. HDFC Bank"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Contact Person</label>
              <Input
                placeholder="e.g. Bank Manager"
                value={form.contactPerson}
                onChange={e => setForm({ ...form, contactPerson: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Logo (emoji or text)</label>
              <Input
                placeholder="🏦"
                value={form.logo}
                onChange={e => setForm({ ...form, logo: e.target.value })}
              />
            </div>
          </div>

          {/* Interest Rates per Loan Type */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <ChevronDown className="w-4 h-4 text-primary" />
              {editingId ? 'Current Interest Rates' : 'Initial Interest Rates (per loan type)'}
            </h3>
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-2.5 px-4 font-semibold text-foreground">Loan Type</th>
                    <th className="text-right py-2.5 px-4 font-semibold text-foreground">Interest Rate (%)</th>
                    <th className="text-right py-2.5 px-4 font-semibold text-foreground">Processing Fee (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {LOAN_TYPES.map(lt => (
                    <tr key={lt.id} className="border-b border-border last:border-0">
                      <td className="py-2.5 px-4 font-medium text-foreground">{lt.name}</td>
                      <td className="py-2.5 px-4 text-right">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={rates[lt.id]?.rate ?? ''}
                          onChange={e =>
                            setRates(prev => ({
                              ...prev,
                              [lt.id]: { ...prev[lt.id], rate: e.target.value },
                            }))
                          }
                          className="w-24 px-2 py-1 rounded border border-input bg-background text-foreground text-right"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={rates[lt.id]?.fee ?? ''}
                          onChange={e =>
                            setRates(prev => ({
                              ...prev,
                              [lt.id]: { ...prev[lt.id], fee: e.target.value },
                            }))
                          }
                          className="w-24 px-2 py-1 rounded border border-input bg-background text-foreground text-right"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


          <div className="flex gap-3">
            <Button onClick={handleSubmit}>
              {editingId ? 'Save Changes' : 'Create Bank'}
            </Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Banks Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Logo</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Bank Name</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Contact Person</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    No banks added yet
                  </td>
                </tr>
              ) : (
                banks.map(bank => (
                  <tr key={bank.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-2xl">{bank.logo || '🏦'}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{bank.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{bank.contactPerson}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(bank.id)
                          setForm({
                            name: bank.name,
                            contactPerson: bank.contactPerson,
                            logo: bank.logo || '🏦',
                          })
                          
                          // Populate rates for this bank
                          const bankRates: Record<string, { rate: string; fee: string }> = {}
                          LOAN_TYPES.forEach(lt => {
                            const r = allRates.find(ar => ar.bankId === bank.id && ar.loanType === lt.id)
                            bankRates[lt.id] = {
                              rate: String(r?.interestRate ?? DEFAULT_RATES[lt.id]?.rate ?? 10),
                              fee: String(r?.processingFee ?? DEFAULT_RATES[lt.id]?.fee ?? 1),
                            }
                          })
                          setRates(bankRates)
                          
                          setShowForm(true)
                        }}
                        className="text-primary hover:bg-primary/10 p-1 rounded transition-colors inline-block"
                        title="Edit bank"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${bank.name}?`)) deleteBank(bank.id)
                        }}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors inline-block"
                        title="Delete bank"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
