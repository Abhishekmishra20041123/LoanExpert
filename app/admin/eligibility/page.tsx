'use client'

import { useLoanData } from '@/hooks/useLoanData'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LOAN_TYPES } from '@/lib/constants'
import { Save } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AdminEligibilityPage() {
  const { eligibilityRules, updateEligibilityRule } = useLoanData()
  const [selectedLoan, setSelectedLoan] = useState(LOAN_TYPES[0].id)
  const [editValues, setEditValues] = useState<any>({})


  // Sync state when data loads or selection changes
  useEffect(() => {
    if (eligibilityRules[selectedLoan]) {
      setEditValues(eligibilityRules[selectedLoan])
    } else {
      setEditValues({})
    }
  }, [selectedLoan, eligibilityRules])

  const handleSave = () => {
    updateEligibilityRule(selectedLoan, editValues)
  }

  const rule = eligibilityRules[selectedLoan]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Eligibility Rules</h1>
        <p className="text-muted-foreground">Configure eligibility criteria for each loan type</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Loan Type Selector */}
        <div>
          <Card className="p-6 space-y-2">
            {LOAN_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedLoan(type.id)
                  setEditValues(eligibilityRules[type.id] || {})
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedLoan === type.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                {type.name}
              </button>
            ))}
          </Card>
        </div>

        {/* Rules Editor */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {LOAN_TYPES.find(t => t.id === selectedLoan)?.name} Rules
            </h2>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Minimum Age</label>
                  <input
                    type="number"
                    value={editValues.minAge || 0}
                    onChange={(e) => setEditValues({ ...editValues, minAge: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Maximum Age</label>
                  <input
                    type="number"
                    value={editValues.maxAge || 0}
                    onChange={(e) => setEditValues({ ...editValues, maxAge: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Minimum Income (₹)</label>
                  <input
                    type="number"
                    value={editValues.minIncome || 0}
                    onChange={(e) => setEditValues({ ...editValues, minIncome: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Minimum CIBIL Score</label>
                  <input
                    type="number"
                    value={editValues.minCibil || 0}
                    onChange={(e) => setEditValues({ ...editValues, minCibil: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-foreground block mb-1">Max Loan Amount (₹)</label>
                  <input
                    type="number"
                    value={editValues.maxLoanAmount || 0}
                    onChange={(e) => setEditValues({ ...editValues, maxLoanAmount: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>

            {rule && (
              <div className="border-t border-border pt-6 text-sm text-muted-foreground">
                <p>Processing Time: {rule.processingTime}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
