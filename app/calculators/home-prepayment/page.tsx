'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HomePrepaymentCalculator() {
  const [principal, setPrincipal] = useState(5000000)
  const [rate, setRate] = useState(7)
  const [tenure, setTenure] = useState(240)
  const [monthsPaid, setMonthsPaid] = useState(60)
  const [prepaymentAmount, setPrepaymentAmount] = useState(500000)
  const [calculated, setCalculated] = useState(false)

  const calculatePrepayment = () => {
    setCalculated(true)
  }

  // Calculate remaining loan
  const monthlyRate = rate / 12 / 100
  const totalMonths = tenure
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)

  const paidAmount = emi * monthsPaid
  const remainingMonths = totalMonths - monthsPaid

  // Remaining balance after prepayment
  const remainingBalanceBeforePrepay =
    (emi * (Math.pow(1 + monthlyRate, remainingMonths) - 1)) / monthlyRate
  const remainingBalanceAfterPrepay = Math.max(
    0,
    remainingBalanceBeforePrepay - prepaymentAmount
  )

  const interestSavedMonthly =
    (remainingBalanceBeforePrepay - remainingBalanceAfterPrepay) * monthlyRate
  const interestSavedTotal =
    remainingBalanceBeforePrepay - remainingBalanceAfterPrepay

  const newTenure = Math.ceil(
    Math.log(emi / (emi - remainingBalanceAfterPrepay * monthlyRate)) /
      Math.log(1 + monthlyRate)
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Home Loan Prepayment Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate interest savings and tenure reduction from prepayment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Prepayment Calculation
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Original Loan Amount
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rate of Interest (%)
                  </label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    step="0.1"
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tenure (Months)
                  </label>
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Months Paid So Far
                  </label>
                  <input
                    type="number"
                    value={monthsPaid}
                    onChange={(e) => setMonthsPaid(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    max={tenure}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Prepayment Amount
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">₹</span>
                    <input
                      type="number"
                      value={prepaymentAmount}
                      onChange={(e) =>
                        setPrepaymentAmount(Number(e.target.value))
                      }
                      className="flex-1 px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={calculatePrepayment}
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
                Prepayment Benefits
              </h2>

              <div className="space-y-4">
                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    Remaining Balance (Before Prepayment)
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    ₹
                    {remainingBalanceBeforePrepay
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    Remaining Balance (After Prepayment)
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    ₹
                    {remainingBalanceAfterPrepay
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Interest Saved
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹
                    {interestSavedTotal
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    New Tenure
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {newTenure} months ({(newTenure / 12).toFixed(1)} years)
                  </p>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    Remaining Months Reduced By
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {remainingMonths - newTenure} months
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
