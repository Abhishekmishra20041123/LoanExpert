import { EligibilityCalculator } from '@/components/EligibilityCalculator'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Business Loan Eligibility Calculator | LoanExpert',
  description: 'Check your business loan eligibility instantly. Get maximum loan amount for your business needs.',
}

export default function BusinessEligibilityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EligibilityCalculator
            loanType="business"
            title="Business Loan Eligibility Calculator"
            description="Evaluate your business loan eligibility based on your business income and financial standing. Business loans require proof of business operations, minimum monthly turnover, stable business history, CIBIL score, and collateral. Ideally, you should be aged 25-65, with minimum monthly business income of Rs. 50,000, CIBIL score of 650+, and 2+ years of business operations."
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

