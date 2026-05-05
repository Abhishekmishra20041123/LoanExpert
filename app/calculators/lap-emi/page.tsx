'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EMICalculator } from '@/components/EMICalculator'

const LAP_BANKS = [
  { name: 'HDFC Bank', rate: 9.5 },
  { name: 'ICICI Bank', rate: 9.75 },
  { name: 'Axis Bank', rate: 10.0 },
  { name: 'Kotak Mahindra Bank', rate: 10.25 },
]

export default function LAPEMICalculator() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Loan Against Property EMI Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your monthly EMI for Loan Against Property. Select a bank to auto-set its interest rate.
          </p>
        </div>

        <EMICalculator
          loanType="lap"
          minAmount={500000}
          maxAmount={5000000}
          minRate={8}
          maxRate={14}
          minTenure={60}
          maxTenure={240}
          defaultAmount={2000000}
          defaultRate={9.5}
          defaultTenure={120}
          tenureUnit="months"
          banks={LAP_BANKS}
        />
      </main>
      <Footer />
    </div>
  )
}
