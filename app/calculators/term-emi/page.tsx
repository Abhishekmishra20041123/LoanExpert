'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EMICalculator } from '@/components/EMICalculator'

const TERM_BANKS = [
  { name: 'HDFC Bank', rate: 8.5 },
  { name: 'ICICI Bank', rate: 9.0 },
  { name: 'Axis Bank', rate: 8.75 },
  { name: 'IDBI Bank', rate: 9.25 },
]

export default function TermEMICalculator() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Term Loan EMI Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your monthly EMI for term loans. Select a bank to auto-set its interest rate.
          </p>
        </div>

        <EMICalculator
          loanType="term"
          minAmount={100000}
          maxAmount={5000000}
          minRate={6}
          maxRate={18}
          minTenure={12}
          maxTenure={180}
          defaultAmount={500000}
          defaultRate={8.5}
          defaultTenure={36}
          banks={TERM_BANKS}
        />
      </main>
      <Footer />
    </div>
  )
}
