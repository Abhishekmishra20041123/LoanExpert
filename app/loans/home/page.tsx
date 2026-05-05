'use client'

import { useState, useEffect } from 'react'
import { LoanTypeDetail } from '@/components/LoanTypeDetail'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function HomeLoanPage() {
  const [dynamicContent, setDynamicContent] = useState<any>(null)

  useEffect(() => {
    fetch('/api/public/loan-content/home')
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
        type="home"
        title="Home Loan"
        icon="🏠"
        description="Your dream home is now within reach. Get competitive interest rates, long tenures, and expert guidance throughout your home buying journey."
        maxAmount={dynamicContent?.maxLoanAmount || "₹10 Cr+"}
        tenureRange={dynamicContent?.tenureRange || "Up to 30 Years"}
        interestRates={dynamicContent?.interestRates || "8.50% - 10.5%"}
        processingTime={dynamicContent?.processingTime || "7-15 Days"}
        overview={dynamicContent?.overview || "A Home Loan is a secured loan used to buy or build a residential property. The property acts as collateral until the loan is fully repaid."}
        benefits={dynamicContent?.keyBenefits || [
          'Attractive interest rates (starting 8.50%)',
          'Long flexible tenure up to 30 years',
          'Tax benefits on principal & interest',
          'Low processing fees on government schemes',
          'PMAY subsidy benefits available',
          'Simplified documentation process'
        ]}
        criteria={dynamicContent?.eligibilityCriteria || [
          'Age: 21-70 years',
          'Employment: Salaried / Self-Employed',
          'Income: Min ₹30,000/month',
          'Credit Score: 700 or above preferred',
          'Residence: Indian Citizen / NRI'
        ]}
        documents={dynamicContent?.requiredDocuments || [
          'KYC (Aadhar/PAN/Voter ID)',
          'Income Proof (Salary Slips/ITR)',
          'Bank Statements (Last 6 Months)',
          'Property Documents (Sale Deed/Chain)',
          'NOC from Builder/Society'
        ]}
        schemes={[
          { name: 'Pradhan Mantri Awas Yojana', detail: 'Credit linked subsidy scheme for EWS, LIG and MIG categories.' },
          { name: 'Home Extension Loan', detail: 'Specific funding for adding rooms or floors to your existing home.' },
          { name: 'Plot Purchase Loan', detail: 'Financing for buying residential plots for future construction.' },
          { name: 'Home Improvement Loan', detail: 'Fund for renovation, painting, or major repairs of your house.' }
        ]}
        comparisonRates={dynamicContent?.comparisonRates}
      />
      <Footer />
    </>
  )
}
