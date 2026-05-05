'use client'

import { useState, useEffect } from 'react'
import { LoanTypeDetail } from '@/components/LoanTypeDetail'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function LAPLoanPage() {
  const [dynamicContent, setDynamicContent] = useState<any>(null)

  useEffect(() => {
    fetch('/api/public/loan-content/lap')
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
        type="lap"
        title="Loan Against Property (LAP)"
        icon="🏢"
        description="Unlock the value of your asset. Get high loan amounts at low interest rates by leveraging your residential or commercial property."
        maxAmount={dynamicContent?.maxLoanAmount || "₹50 Cr+"}
        tenureRange={dynamicContent?.tenureRange || "1-20 Years"}
        interestRates={dynamicContent?.interestRates || "9% - 13.5%"}
        processingTime={dynamicContent?.processingTime || "10-15 Days"}
        overview={dynamicContent?.overview || "Loan Against Property (LAP) is a multi-purpose loan where you mortgage your property to get low-interest financing."}
        benefits={dynamicContent?.keyBenefits || [
          'Lower interest rates than personal loans',
          'High loan amounts (up to ₹50 Cr)',
          'Flexible repayment up to 15-20 years',
          'Use funds for business or personal needs',
          'Continue to use your property normally',
          'Balance transfer options available'
        ]}
        criteria={dynamicContent?.eligibilityCriteria || [
          'Property Type: Residential / Commercial',
          'Age: 25-70 years',
          'Income: Documented income preferred',
          'Ownership: Clear property title required',
          'Property Usage: Must be self-occupied/let-out'
        ]}
        documents={dynamicContent?.requiredDocuments || [
          'KYC Documents (PAN/Aadhar)',
          'Previous 6 Months Bank Statements',
          'ITR & Form 16 for last 3 years',
          'Original Property Title Deeds',
          'Approved Building Plan & NOC'
        ]}
        schemes={[
          { name: 'Residential LAP', detail: 'Best rates for mortgage against self-occupied or rented residential homes.' },
          { name: 'Commercial LAP', detail: 'High values for shops, offices, and industrial layouts.' },
          { name: 'LAP for Debt Consolidation', detail: 'Clear multiple high-interest debts with one low-interest mortgage loan.' },
          { name: 'Lease Rental Discounting', detail: 'Loan against future rental income from your commercial property.' }
        ]}
        comparisonRates={dynamicContent?.comparisonRates}
      />
      <Footer />
    </>
  )
}
