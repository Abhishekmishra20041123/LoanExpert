import { EligibilityCalculator } from '@/components/EligibilityCalculator'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Home Loan Eligibility Calculator | LoanExpert',
  description: 'Check your home loan eligibility with our instant calculator. Get your maximum loan amount based on income and financial profile.',
}

export default function HomeEligibilityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EligibilityCalculator
            loanType="home"
            title="Home Loan Eligibility Calculator"
            description="Determine your home loan eligibility based on your financial profile. Home loans consider your age, monthly income, existing EMI obligations, credit score (CIBIL), employment stability, and property details. Typically, you should be between 21 to 65 years, with a minimum monthly income of Rs. 25,000, CIBIL score of 700+, and a valid property for loan against."
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

