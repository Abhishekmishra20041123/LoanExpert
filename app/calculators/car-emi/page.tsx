'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EMICalculator } from '@/components/EMICalculator'

const CAR_BANKS = [
  { name: 'HDFC Bank', rate: 7.5 },
  { name: 'ICICI Bank', rate: 7.75 },
  { name: 'Axis Bank', rate: 8.0 },
  { name: 'Maruti Suzuki Finance', rate: 8.25 },
]

export default function CarEMICalculator() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Car Loan EMI Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your monthly EMI for car loans. Select a bank to auto-set its interest rate.
          </p>
        </div>

        <EMICalculator
          loanType="car"
          minAmount={300000}
          maxAmount={3000000}
          minRate={5.5}
          maxRate={14}
          minTenure={12}
          maxTenure={84}
          defaultAmount={800000}
          defaultRate={7.5}
          defaultTenure={36}
          banks={CAR_BANKS}
        />
      </main>
      <Footer />
    </div>
  )
}
