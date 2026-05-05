'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import {
  Calculator,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Zap,
  Home,
  Briefcase,
  Banknote,
} from 'lucide-react'

interface CalculatorCard {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  href: string
  category: 'investment' | 'loan-emi' | 'eligibility'
}

const INVESTMENT_CALCULATORS: CalculatorCard[] = [
  {
    id: 'fd-calc',
    name: 'FD Calculator',
    description: 'Fixed Deposit maturity calculator',
    icon: <DollarSign className="w-6 h-6" />,
    href: '/calculators/fd',
    category: 'investment',
  },
  {
    id: 'gst-calc',
    name: 'GST Calculator',
    description: 'Calculate GST exclusive and inclusive amounts',
    icon: <Calculator className="w-6 h-6" />,
    href: '/calculators/gst',
    category: 'investment',
  },
  {
    id: 'mf-calc',
    name: 'Mutual Fund Calculator',
    description: 'SIP & Lumpsum investment calculator',
    icon: <TrendingUp className="w-6 h-6" />,
    href: '/calculators/mutual-fund',
    category: 'investment',
  },
  {
    id: 'post-office-fd',
    name: 'Post Office FD Calculator',
    description: 'Calculate Post Office Fixed Deposit returns',
    icon: <DollarSign className="w-6 h-6" />,
    href: '/calculators/post-office-fd',
    category: 'investment',
  },
]

const LOAN_EMI_CALCULATORS: CalculatorCard[] = [
  {
    id: 'personal-emi',
    name: 'Personal Loan EMI',
    description: 'Calculate monthly EMI for personal loans',
    icon: <Banknote className="w-6 h-6" />,
    href: '/calculators/personal-emi',
    category: 'loan-emi',
  },
  {
    id: 'home-emi',
    name: 'Home Loan EMI',
    description: 'Calculate home loan EMI with tenure options',
    icon: <Home className="w-6 h-6" />,
    href: '/calculators/home-emi',
    category: 'loan-emi',
  },
  {
    id: 'business-emi',
    name: 'Business Loan EMI',
    description: 'Calculate EMI for business loans',
    icon: <Briefcase className="w-6 h-6" />,
    href: '/calculators/business-emi',
    category: 'loan-emi',
  },
  {
    id: 'gold-emi',
    name: 'Gold Loan EMI',
    description: 'Calculate EMI for gold loans',
    icon: <Banknote className="w-6 h-6" />,
    href: '/calculators/gold-emi',
    category: 'loan-emi',
  },
  {
    id: 'term-emi',
    name: 'Term Loan EMI',
    description: 'Calculate term loan monthly payments',
    icon: <Calculator className="w-6 h-6" />,
    href: '/calculators/term-emi',
    category: 'loan-emi',
  },
  {
    id: 'mudra-emi',
    name: 'Mudra Loan EMI',
    description: 'Calculate Mudra loan EMI payments',
    icon: <Banknote className="w-6 h-6" />,
    href: '/calculators/mudra-emi',
    category: 'loan-emi',
  },
  {
    id: 'lap-emi',
    name: 'Loan Against Property EMI',
    description: 'Calculate LAP EMI payments',
    icon: <Home className="w-6 h-6" />,
    href: '/calculators/lap-emi',
    category: 'loan-emi',
  },
]



function CalculatorGrid({ calculators }: { calculators: CalculatorCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {calculators.map((calc) => (
        <Link key={calc.id} href={calc.href}>
          <div className="h-full p-6 border border-border rounded-lg hover:shadow-lg hover:border-primary transition-all cursor-pointer bg-card hover:bg-muted">
            <div className="flex items-start justify-between mb-3">
              <div className="text-primary">{calc.icon}</div>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-card-foreground">
              {calc.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {calc.description}
            </p>
            <div className="flex items-center text-primary text-sm font-medium">
              Use Calculator
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Financial Calculators
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Comprehensive suite of financial calculators to help you make informed decisions about loans, investments, and financial planning.
          </p>
        </div>

        {/* Investment Calculators */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Investment Calculators</h2>
              <p className="text-sm text-muted-foreground">
                Fixed Deposit, GST, Mutual Fund, Post Office FD
              </p>
            </div>
          </div>
          <CalculatorGrid calculators={INVESTMENT_CALCULATORS} />
        </section>

        {/* Loan EMI Calculators */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Loan EMI Calculators</h2>
              <p className="text-sm text-muted-foreground">
                Personal, Home, Business, Gold, Term, Mudra, LAP
              </p>
            </div>
          </div>
          <CalculatorGrid calculators={LOAN_EMI_CALCULATORS} />
        </section>



        {/* CTA Section */}
        <section className="mt-16 p-8 sm:p-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl text-primary-foreground">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Need Expert Guidance?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Talk to our loan experts to find the best loan product tailored to your needs.
            </p>
            <Link href="/contact-loan-agent">
              <Button variant="secondary" size="lg">
                Contact Loan Agent
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
