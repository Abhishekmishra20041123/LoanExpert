'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MutualFundCalculator() {
  const [investmentType, setInvestmentType] = useState<'sip' | 'lumpsum'>('sip')
  const [monthlyAmount, setMonthlyAmount] = useState(5000)
  const [lumpsumAmount, setLumpsumAmount] = useState(100000)
  const [years, setYears] = useState(10)
  const [expectedROI, setExpectedROI] = useState(12)
  const [calculated, setCalculated] = useState(false)

  const calculateMutualFund = () => {
    setCalculated(true)
  }

  let investedAmount, wealthCreated

  if (investmentType === 'sip') {
    const monthlyRate = expectedROI / 12 / 100
    const months = years * 12
    investedAmount = monthlyAmount * months
    wealthCreated =
      monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
  } else {
    const rate = expectedROI / 100
    investedAmount = lumpsumAmount
    wealthCreated = lumpsumAmount * Math.pow(1 + rate, years)
  }

  const gains = wealthCreated - investedAmount

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Mutual Fund Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate SIP and Lumpsum mutual fund returns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Calculate Investment Returns
            </h2>

            <div className="space-y-6">
              {/* Investment Type Toggle */}
              <div className="flex gap-3">
                <button
                  onClick={() => setInvestmentType('sip')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    investmentType === 'sip'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  SIP
                </button>
                <button
                  onClick={() => setInvestmentType('lumpsum')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    investmentType === 'lumpsum'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  Lumpsum
                </button>
              </div>

              {investmentType === 'sip' ? (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Monthly Investment Amount
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">₹</span>
                    <input
                      type="number"
                      value={monthlyAmount}
                      onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Lumpsum Investment Amount
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">₹</span>
                    <input
                      type="number"
                      value={lumpsumAmount}
                      onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={lumpsumAmount}
                    onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Investment Duration
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-border rounded-lg"
                  />
                  <span>Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Expected ROI (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={expectedROI}
                    onChange={(e) => setExpectedROI(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-border rounded-lg"
                  />
                  <span>%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={expectedROI}
                  onChange={(e) => setExpectedROI(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <Button
                onClick={calculateMutualFund}
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
                Your Investment Results
              </h2>

              <div className="space-y-4">
                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    Invested Amount
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{investedAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    Wealth Created
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    ₹{wealthCreated.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    Gains/Returns
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{gains.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
