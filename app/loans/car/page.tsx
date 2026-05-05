'use client'

import { useState, useEffect } from 'react'
import { LoanTypeDetail } from '@/components/LoanTypeDetail'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function CarLoanPage() {
  const [dynamicContent, setDynamicContent] = useState<any>(null)

  useEffect(() => {
    fetch('/api/public/loan-content/car')
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
        type="car"
        title="Car Loan"
        icon="🚗"
        description="Drive home your dream car today. Low interest rates, fast approvals, and flexible repayment plans for new and pre-owned vehicles."
        maxAmount={dynamicContent?.maxLoanAmount || "100% On-road"}
        tenureRange={dynamicContent?.tenureRange || "1-7 Years"}
        interestRates={dynamicContent?.interestRates || "8.75% - 11%"}
        processingTime={dynamicContent?.processingTime || "24-48 Hours"}
        overview={dynamicContent?.overview || "A Car Loan helps you purchase a new or used car with low-interest financing. Most car loans are secured by the vehicle itself."}
        benefits={dynamicContent?.keyBenefits || [
          'Financing up to 100% on-road price',
          'Quick approval & doorstep service',
          'Flexible tenure up to 7-8 years',
          'Low down-payment options',
          'Special rates for luxury cars',
          'Fast-track options for salary account holders'
        ]}
        criteria={dynamicContent?.eligibilityCriteria || [
          'Age: 21-65 years',
          'Employment: Salaried / Business',
          'Min Yearly Income: ₹3 Lakhs+',
          'CIBIL Score: 680 or above'
        ]}
        documents={dynamicContent?.requiredDocuments || [
          'KYC Documents (PAN/Aadhar)',
          'Income Proof (Salary/ITR)',
          'Bank Statements (Last 6 Months)',
          'Vehicle Proforma Invoice',
          'Passport Sized Photographs'
        ]}
        schemes={[
          { name: 'New Car Loan', detail: 'Lowest interest rates for brand new Indian and imported vehicles.' },
          { name: 'Used Car Loan', detail: 'Affordable financing for certified pre-owned passenger cars.' },
          { name: 'Loan Against Car', detail: 'Unlock the value of your existing vehicle for immediate financial needs.' },
          { name: 'Corporate Car Loan', detail: 'Tax-friendly loan structures for companies and employees.' }
        ]}
        comparisonRates={dynamicContent?.comparisonRates}
      />
      <Footer />
    </>
  )
}
