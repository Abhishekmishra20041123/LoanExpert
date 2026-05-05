'use client'

import { useState, useEffect } from 'react'
import { LoanTypeDetail } from '@/components/LoanTypeDetail'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function PersonalLoanPage() {
  const [dynamicContent, setDynamicContent] = useState<any>(null)

  useEffect(() => {
    fetch('/api/public/loan-content/personal')
      .then(res => res.json())
      .then(data => {
        if (data.loanContent) {
          setDynamicContent(data.loanContent)
        }
      })
      .catch(err => console.error('Error fetching loan content:', err))
  }, [])

  return (
    <>
      <Header />
      <LoanTypeDetail
        type="personal"
        title="Personal Loan"
        icon="💰"
        description="Compare personal loans from top banks and lenders. Get flexible repayment options, competitive interest rates, and quick approvals."
        maxAmount={dynamicContent?.maxLoanAmount || "₹50 Lakhs"}
        tenureRange={dynamicContent?.tenureRange || "6-60 Months"}
        interestRates={dynamicContent?.interestRates || "10.5% - 24%"}
        processingTime={dynamicContent?.processingTime || "24-48 Hours"}
        overview={dynamicContent?.overview || "A Personal Loan is an unsecured loan that can be used for various purposes like medical emergencies, travel, wedding, or debt consolidation."}
        benefits={dynamicContent?.keyBenefits || [
          'No collateral or security required',
          'Funds disbursed within 24-48 hours',
          'Flexible tenure up to 5 years',
          'Minimal documentation for salaried individuals',
          'Competitive rates for high CIBIL scores',
          'Zero hidden charges on processing'
        ]}
        criteria={dynamicContent?.eligibilityCriteria || [
          'Age: 21-60 years',
          'Employment: Salaried / Self-Employed',
          'Minimum Monthly Income: ₹25,000',
          'Credit Score: 650 or above',
          'Work Experience: Min 2 years total'
        ]}
        documents={dynamicContent?.requiredDocuments || [
          'ID Proof (PAN Card / Aadhaar)',
          'Address Proof (Utility Bill / Passport)',
          'Bank Statements (Last 6 Months)',
          'Salary Slips (Last 3 Months)',
          'Form 16 / ITR for last 2 years'
        ]}
        schemes={[
          { name: 'Instant Personal Loan', detail: 'Pre-approved offers for existing bank customers with zero documentation.' },
          { name: 'Debt Consolidation', detail: 'Combine multiple high-interest debts into one manageable monthly EMI.' },
          { name: 'Wedding Loan', detail: 'Special high-limit loans for managing large-scale expenses for marriage.' },
          { name: 'Medical Emergency Loan', detail: 'Priority processing for urgent healthcare requirements.' }
        ]}
        comparisonRates={dynamicContent?.comparisonRates}
      />
      <Footer />
    </>
  )
}

