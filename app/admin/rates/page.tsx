'use client'

import { useLoanData } from '@/hooks/useLoanData'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LOAN_TYPES } from '@/lib/constants'
import { Edit2, Save } from 'lucide-react'
import { useState } from 'react'

export default function AdminRatesPage() {
  const { banks, rates, updateRate } = useLoanData()
  const [editingRate, setEditingRate] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ rate: number; fee: number }>({ rate: 0, fee: 0 })

  const handleSaveRate = (bankId: string, loanType: string) => {
    updateRate(bankId, loanType, { interestRate: editValues.rate, processingFee: editValues.fee })
    setEditingRate(null)
  }

  const getRateForBankAndLoan = (bankId: string, loanType: string) => {
    return rates.find(r => r.bankId === bankId && r.loanType === loanType)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Loan Rates Management</h1>
        <p className="text-muted-foreground">Update interest rates and processing fees for each bank and loan type</p>
      </div>

      <div className="space-y-6">
        {LOAN_TYPES.map(loanType => (
          <Card key={loanType.id} className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">{loanType.name}</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Bank</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Interest Rate (%)</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Processing Fee (%)</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map(bank => {
                    const rate = getRateForBankAndLoan(bank.id, loanType.id)
                    const isEditing = editingRate === `${bank.id}-${loanType.id}`

                    return (
                      <tr key={`${bank.id}-${loanType.id}`} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium text-foreground">{bank.name}</td>
                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={editValues.rate}
                              onChange={(e) => setEditValues({ ...editValues, rate: Number(e.target.value) })}
                              className="w-24 px-2 py-1 rounded border border-input bg-background text-foreground text-right"
                            />
                          ) : (
                            <span className="text-primary font-medium">{rate?.interestRate.toFixed(2)}%</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={editValues.fee}
                              onChange={(e) => setEditValues({ ...editValues, fee: Number(e.target.value) })}
                              className="w-24 px-2 py-1 rounded border border-input bg-background text-foreground text-right"
                            />
                          ) : (
                            <span className="text-accent font-medium">{rate?.processingFee.toFixed(2)}%</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveRate(bank.id, loanType.id)}
                              className="text-accent hover:bg-accent/10 p-1 rounded transition-colors inline-block"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditValues({
                                  rate: rate?.interestRate ?? 10,
                                  fee: rate?.processingFee ?? 1,
                                })
                                setEditingRate(`${bank.id}-${loanType.id}`)
                              }}
                              className="text-primary hover:bg-primary/10 p-1 rounded transition-colors inline-block"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
