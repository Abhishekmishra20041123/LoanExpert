'use client'

import { useState, useMemo, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { calculateEMIWithFee, formatCurrency, generateAmortizationSchedule } from '@/lib/calculations'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'

export default function EMICalculatorPage() {
  const [loading, setLoading] = useState(true)
  
  // Values (Dynamic controlled by DB defaults)
  const [loanAmount, setLoanAmount] = useState(500000)
  const [interestRate, setInterestRate] = useState(9.5)
  const [tenure, setTenure] = useState(60)
  const [processingFee, setProcessingFee] = useState(1.5)

  // Boundaries (Dynamic controlled by DB config)
  const [minLoan, setMinLoan] = useState(100000)
  const [maxLoan, setMaxLoan] = useState(10000000)
  const [minTenure, setMinTenure] = useState(12)
  const [maxTenure, setMaxTenure] = useState(360)

  useEffect(() => {
    fetch('/api/public/calculator-config/personal_emi')
      .then(r => r.json())
      .then(data => {
        if (data.config) {
          const cfg = data.config
          if (cfg.defaultRate) setInterestRate(cfg.defaultRate)
          if (cfg.minLoan) setMinLoan(cfg.minLoan)
          if (cfg.maxLoan) setMaxLoan(cfg.maxLoan)
          if (cfg.minTenure) setMinTenure(cfg.minTenure)
          if (cfg.maxTenure) setMaxTenure(cfg.maxTenure)
          
          // Set a pleasant default amount (e.g. 50% of the way, or just 500k if fits)
          setLoanAmount(cfg.maxLoan > 5000000 ? 500000 : Math.max(cfg.minLoan, 50000))
          setTenure(cfg.minTenure > 60 || cfg.maxTenure < 60 ? cfg.minTenure : 60)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const calculation = useMemo(() => {
    return calculateEMIWithFee(loanAmount, interestRate, tenure, processingFee)
  }, [loanAmount, interestRate, tenure, processingFee])

  const schedule = useMemo(() => {
    return generateAmortizationSchedule(loanAmount, interestRate, tenure, processingFee)
  }, [loanAmount, interestRate, tenure, processingFee])

  const savingsPerMonth = useMemo(() => {
    // Calculate difference between highest and lowest possible EMI
    const highestRate = 12 // Approximate
    const lowestRate = 6.5 // Approximate
    const highEMI = calculateEMIWithFee(loanAmount, highestRate, tenure, processingFee).emi
    const lowEMI = calculateEMIWithFee(loanAmount, lowestRate, tenure, processingFee).emi
    return highEMI - lowEMI
  }, [loanAmount, tenure, processingFee])

  return (
    <>
      <Header />

      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">EMI Calculator</h1>
          <p className="text-muted-foreground">Calculate your monthly EMI and view the complete amortization schedule</p>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[500px] flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">Fetching the latest market rates...</p>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8 lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold text-foreground mb-6">Loan Details</h2>

              <div className="space-y-6">
                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Loan Amount</label>
                    <span className="text-lg font-bold text-primary">{formatCurrency(loanAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={minLoan}
                    max={maxLoan}
                    step={maxLoan > 1000000 ? 50000 : 10000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatCurrency(minLoan)}</span>
                    <span>{formatCurrency(maxLoan)}</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Annual Interest Rate</label>
                    <span className="text-lg font-bold text-accent">{interestRate.toFixed(2)}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>5%</span>
                    <span>15%</span>
                  </div>
                </div>

                {/* Tenure */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Loan Tenure</label>
                    <span className="text-lg font-bold text-secondary">{tenure} months ({Math.round(tenure / 12)} years)</span>
                  </div>
                  <input
                    type="range"
                    min={minTenure}
                    max={maxTenure}
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{minTenure} M</span>
                    <span>{maxTenure} M</span>
                  </div>
                </div>

                {/* Processing Fee */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Processing Fee</label>
                    <span className="text-lg font-bold text-muted-foreground">{processingFee.toFixed(2)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={processingFee}
                    onChange={(e) => setProcessingFee(Number(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>5%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <Card className="p-6 border-2 border-primary bg-primary/5">
              <p className="text-xs text-muted-foreground mb-1">Monthly EMI</p>
              <p className="text-4xl font-bold text-primary">{formatCurrency(calculation.emi)}</p>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-xs text-muted-foreground mb-2">Total Amount</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(calculation.totalAmount)}</p>
              </Card>

              <Card className="p-4">
                <p className="text-xs text-muted-foreground mb-2">Total Interest</p>
                <p className="text-2xl font-bold text-accent">{formatCurrency(calculation.totalInterest)}</p>
              </Card>
            </div>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-2">Processing Fee</p>
              <p className="text-2xl font-bold text-secondary">{formatCurrency(calculation.processingFee)}</p>
            </Card>

            <Card className="p-4 bg-accent/5 border-accent">
              <p className="text-xs text-muted-foreground mb-2">Potential Savings</p>
              <p className="text-2xl font-bold text-accent">{formatCurrency(savingsPerMonth)}/month</p>
              <p className="text-xs text-muted-foreground mt-2">By comparing loan offers</p>
            </Card>

            <Link href="/loans" className="w-full">
              <Button className="w-full" size="lg">
                Explore Loans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Amortization Table */}
        <div className="mt-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Amortization Schedule</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Month</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">EMI</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Principal</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Interest</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.slice(0, Math.min(12, schedule.length)).map((row) => (
                    <tr key={row.month} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground">{row.month}</td>
                      <td className="text-right py-3 px-4 text-foreground">{formatCurrency(row.emi)}</td>
                      <td className="text-right py-3 px-4 text-primary">{formatCurrency(row.principal)}</td>
                      <td className="text-right py-3 px-4 text-accent">{formatCurrency(row.interest)}</td>
                      <td className="text-right py-3 px-4 text-foreground font-semibold">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {schedule.length > 12 && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Showing first 12 months of {schedule.length} total months
              </p>
            )}
          </Card>
        </div>
      </div>
      )}

      <Footer />
    </>
  )
}
