'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function GSTCalculator() {
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive')
  const [amount, setAmount] = useState(1000)
  const [gstRate, setGstRate] = useState(18)
  const [calculated, setCalculated] = useState(false)

  const calculateGST = () => {
    setCalculated(true)
  }

  let preGST, gstAmount, postGST

  if (mode === 'exclusive') {
    preGST = amount
    gstAmount = (amount * gstRate) / 100
    postGST = amount + gstAmount
  } else {
    postGST = amount
    preGST = amount / (1 + gstRate / 100)
    gstAmount = amount - preGST
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            GST Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate GST exclusive and inclusive amounts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Calculate Your GST
            </h2>

            <div className="space-y-6">
              {/* Mode Toggle */}
              <div className="flex gap-3">
                <button
                  onClick={() => setMode('exclusive')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    mode === 'exclusive'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  GST Exclusive
                </button>
                <button
                  onClick={() => setMode('inclusive')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    mode === 'inclusive'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  GST Inclusive
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-foreground">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  GST Rate
                </label>
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                >
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                </select>
              </div>

              <Button
                onClick={calculateGST}
                className="w-full"
                size="lg"
              >
                Calculate
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          {calculated && (
            <Card className="p-6 sm:p-8 bg-primary/5 border-primary/20">
              <h2 className="text-xl font-bold text-foreground mb-6">
                GST Breakdown
              </h2>

              <div className="space-y-4">
                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    {mode === 'exclusive' ? 'Pre-GST Amount' : 'Pre-GST Amount'}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{preGST.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    GST Amount ({gstRate}%)
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{gstAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    {mode === 'exclusive' ? 'Post-GST Amount' : 'Total Amount'}
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    ₹{postGST.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
