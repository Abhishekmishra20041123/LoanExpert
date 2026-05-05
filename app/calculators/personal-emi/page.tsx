'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EMICalculator } from '@/components/EMICalculator'
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig'

const PERSONAL_DEFAULTS = {
  defaultRate: 10.5,
  minLoan: 50000,
  maxLoan: 1000000,
  minTenure: 12,
  maxTenure: 60,
}

const PERSONAL_BANKS = [
  { name: 'HDFC Bank', rate: 9.99 },
  { name: 'ICICI Bank', rate: 10.49 },
  { name: 'Axis Bank', rate: 10.25 },
  { name: 'Kotak Mahindra Bank', rate: 10.75 },
]

export default function PersonalEMICalculator() {
  const { config } = useCalculatorConfig('personal_emi', PERSONAL_DEFAULTS)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Personal Loan EMI Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your monthly EMI for personal loans instantly. Select a bank to auto-set its interest rate.
          </p>
        </div>

        <EMICalculator
          loanType="personal"
          minAmount={config.minLoan}
          maxAmount={config.maxLoan}
          minRate={8}
          maxRate={22}
          minTenure={config.minTenure}
          maxTenure={config.maxTenure}
          defaultAmount={500000}
          defaultRate={config.defaultRate}
          defaultTenure={3}
          banks={PERSONAL_BANKS}
        />
      </main>
      <Footer />
    </div>
  )
}
