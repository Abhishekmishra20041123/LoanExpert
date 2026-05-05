'use client'

import { useState, useEffect } from 'react'
import { LoanTypeDetail } from '@/components/LoanTypeDetail'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function BusinessLoanPage() {
  const [dynamicContent, setDynamicContent] = useState<any>(null)

  useEffect(() => {
    fetch('/api/public/loan-content/business')
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
        type="business"
        title="Business Loan"
        icon="🏢"
        description="Growth capital for your business - quick and flexible financing for expansion, equipment, or working capital."
        maxAmount={dynamicContent?.maxLoanAmount || "₹1 Cr+"}
        tenureRange={dynamicContent?.tenureRange || "1-5 Years"}
        interestRates={dynamicContent?.interestRates || "12% - 18%"}
        processingTime={dynamicContent?.processingTime || "7-15 Days"}
        overview={dynamicContent?.overview || "A Business Loan provides capital for various business needs like expansion, inventory purchase, or meeting daily operational expenses."}
        benefits={dynamicContent?.keyBenefits || [
          'Collateral-free loans up to ₹50 Lakhs',
          'Flexible repayment tenures up to 5 years',
          'Quick disbursement for verified businesses',
          'Helps in building business credit history',
          'Interest paid is a tax-deductible expense',
          'Dedicated support for MSME & Startups'
        ]}
        criteria={dynamicContent?.eligibilityCriteria || [
          'Business Vintage: Min 2 years in operation',
          'Annual Turnover: ₹30 Lakhs or above',
          'Applicant Age: 25-65 years',
          'Profitability: Business must be profit-making',
          'Trust: Good individual & business credit score'
        ]}
        documents={dynamicContent?.requiredDocuments || [
          'KYC of Promoters (Aadhar/PAN)',
          'Business Registration Proof (GST/Udyam)',
          'Bank Statements (Last 12 Months)',
          'ITR & Audited Financials (Last 2 Years)',
          'Business Address Proof (Lease/Utility Bill)'
        ]}
        schemes={[
          { name: 'Working Capital Loan', detail: 'Short-term funding to manage day-to-day business operations and cash flow gaps.' },
          { name: 'Machinery Loan', detail: 'Specific asset-backed financing for purchasing new industrial or office equipment.' },
          { name: 'MSME / Mudra Loans', detail: 'Government-backed schemes for small business owners and startups.' },
          { name: 'Overdraft Facility', detail: 'Flexible credit line where you only pay interest on the amount utilized.' }
        ]}
        comparisonRates={dynamicContent?.comparisonRates}
      />
      <Footer />
    </>
  )
}
