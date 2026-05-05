import { EligibilityCalculator } from '@/components/EligibilityCalculator'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'LAP (Loan Against Property) Eligibility Calculator | LoanExpert',
  description: 'Check your LAP eligibility based on your property value and financial standing.',
}

export default function LAPEligibilityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EligibilityCalculator
            loanType="lap"
            title="Loan Against Property (LAP) Eligibility Calculator"
            description="Determine your Loan Against Property eligibility based on your property value and financial profile. LAP eligibility depends on property location, current market value, outstanding mortgages, your age, income, credit score, and employment status. Typically, you should be aged 21-65, with minimum monthly income of Rs. 20,000, CIBIL score of 700+, and property with clear title."
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

