import { EligibilityCalculator } from '@/components/EligibilityCalculator'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Car Loan Eligibility Calculator | LoanExpert',
  description: 'Check your car loan eligibility online. Get instant approval amount for your dream car.',
}

export default function CarEligibilityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EligibilityCalculator
            loanType="car"
            title="Car Loan Eligibility Calculator"
            description="Calculate your car loan eligibility instantly. Car loans are evaluated based on your age, monthly income, existing financial obligations, CIBIL score, employment status, and vehicle details. To qualify, you typically need to be aged 21-60, with a minimum monthly income of Rs. 15,000, CIBIL score of 700+, and employment stability of at least 1 year."
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

