'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EMICalculator } from '@/components/EMICalculator'

const MUDRA_BANKS = [
  { name: 'State Bank of India', rate: 8.5 },
  { name: 'Punjab National Bank', rate: 8.75 },
  { name: 'Bank of Baroda', rate: 9.0 },
  { name: 'IDBI Bank', rate: 9.25 },
]

export default function MudraEMICalculator() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Mudra Loan EMI Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your monthly EMI for PMMY Mudra loans. Select a bank to auto-set its interest rate.
          </p>
        </div>

        <EMICalculator
          loanType="mudra"
          minAmount={50000}
          maxAmount={1000000}
          minRate={8}
          maxRate={14}
          minTenure={12}
          maxTenure={60}
          defaultAmount={300000}
          defaultRate={8.5}
          defaultTenure={24}
          banks={MUDRA_BANKS}
        />
      </main>
      <Footer />
    </div>
  )
}
