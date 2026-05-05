'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(8)
  const [tenure, setTenure] = useState(3)
  const [calculated, setCalculated] = useState(false)

  const calculateFD = () => {
    setCalculated(true)
  }

  // Compound Interest Formula: A = P(1 + r/100)^t
  const maturityAmount =
    principal * Math.pow(1 + rate / 100, tenure)
  const interestAmount = maturityAmount - principal

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            FD Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your Fixed Deposit maturity value and interest earned
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Fixed Deposit Calculation
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fixed Deposit Amount
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-foreground">₹</span>
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-border rounded-lg"
                  />
                </div>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rate of Interest (Yearly %)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-border rounded-lg"
                  />
                  <span>%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fixed Deposit Tenure
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-border rounded-lg"
                  />
                  <span>Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <Button
                onClick={calculateFD}
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
                Your FD Results
              </h2>

              <div className="space-y-4">
                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    Maturity Amount
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    ₹{maturityAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Interest Amount
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{interestAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    Principal Amount
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    ₹{principal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
