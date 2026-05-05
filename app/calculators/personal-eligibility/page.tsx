import { EligibilityCalculator } from '@/components/EligibilityCalculator'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Personal Loan Eligibility Calculator | LoanExpert',
  description: 'Check your personal loan eligibility instantly. Get approved loan amount based on age, income, and CIBIL score.',
}

export default function PersonalEligibilityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EligibilityCalculator
            loanType="personal"
            title="Personal Loan Eligibility Calculator"
            description="Your personal loan eligibility, as defined by lending institutions, typically depends on various factors, such as your age, income, credit score, work experience, employment/business stability etc. To be eligible for a personal loan you should be ideally between 21 to 60 years of age, having minimum monthly income of Rs. 15,000, credit score of 750 or above with stable employment history."
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

