'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EMICalculator } from '@/components/EMICalculator'
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig'

const HOME_DEFAULTS = {
  defaultRate: 7.25,
  minLoan: 500000,
  maxLoan: 50000000,
  minTenure: 120,
  maxTenure: 360,
}

const HOME_BANKS = [
  { name: 'HDFC Bank', rate: 7.1 },
  { name: 'ICICI Bank', rate: 7.45 },
  { name: 'Axis Bank', rate: 7.25 },
  { name: 'SBI Bank', rate: 6.9 },
]

export default function HomeEMICalculator() {
  const { config } = useCalculatorConfig('home_emi', HOME_DEFAULTS)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Home Loan EMI Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your monthly EMI for home loans with flexible tenure. Select a bank to auto-set its interest rate.
          </p>
        </div>

        <EMICalculator
          loanType="home"
          minAmount={config.minLoan}
          maxAmount={config.maxLoan}
          minRate={5.5}
          maxRate={12}
          minTenure={config.minTenure}
          maxTenure={config.maxTenure}
          defaultAmount={5000000}
          defaultRate={config.defaultRate}
          defaultTenure={240}
          tenureUnit="months"
          banks={HOME_BANKS}
        />
      </main>
      <Footer />
    </div>
  )
}
