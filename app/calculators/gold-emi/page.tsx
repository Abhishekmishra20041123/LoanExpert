'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EMICalculator } from '@/components/EMICalculator'

const GOLD_BANKS = [
  { name: 'HDFC Bank', rate: 8.0 },
  { name: 'ICICI Bank', rate: 8.25 },
  { name: 'Axis Bank', rate: 8.5 },
  { name: 'Muthoot Finance', rate: 8.75 },
]

export default function GoldEMICalculator() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Gold Loan EMI Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your monthly EMI for gold loans. Select a bank to auto-set its interest rate.
          </p>
        </div>

        <EMICalculator
          loanType="gold"
          minAmount={50000}
          maxAmount={1000000}
          minRate={7}
          maxRate={15}
          minTenure={6}
          maxTenure={60}
          defaultAmount={500000}
          defaultRate={8.0}
          defaultTenure={12}
          banks={GOLD_BANKS}
        />
      </main>
      <Footer />
    </div>
  )
}
