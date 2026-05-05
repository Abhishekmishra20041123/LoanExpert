'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EMICalculator } from '@/components/EMICalculator'

const BUSINESS_BANKS = [
  { name: 'HDFC Bank', rate: 10.5 },
  { name: 'ICICI Bank', rate: 10.75 },
  { name: 'Axis Bank', rate: 10.99 },
  { name: 'Kotak Mahindra Bank', rate: 11.25 },
]

export default function BusinessEMICalculator() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Business Loan EMI Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your monthly EMI for business loans. Select a bank to auto-set its interest rate.
          </p>
        </div>

        <EMICalculator
          loanType="business"
          minAmount={100000}
          maxAmount={10000000}
          minRate={10}
          maxRate={18}
          minTenure={12}
          maxTenure={84}
          defaultAmount={1000000}
          defaultRate={10.5}
          defaultTenure={36}
          banks={BUSINESS_BANKS}
        />
      </main>
      <Footer />
    </div>
  )
}
