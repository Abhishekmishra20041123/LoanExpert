'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Zap, Home, Briefcase, Banknote, Calculator } from 'lucide-react'

const ELIGIBILITY_CALCULATORS = [
  {
    id: 'personal-elig',
    name: 'Personal Loan Eligibility',
    description: 'Check personal loan eligibility',
    icon: <Zap className="w-6 h-6" />,
    href: '/calculators/personal-eligibility',
  },
  {
    id: 'home-elig',
    name: 'Home Loan Eligibility',
    description: 'Check home loan eligibility',
    icon: <Home className="w-6 h-6" />,
    href: '/calculators/home-eligibility',
  },
  {
    id: 'business-elig',
    name: 'Business Loan Eligibility',
    description: 'Check business loan eligibility',
    icon: <Briefcase className="w-6 h-6" />,
    href: '/calculators/business-eligibility',
  },
  {
    id: 'car-elig',
    name: 'Car Loan Eligibility',
    description: 'Check car loan eligibility',
    icon: <Banknote className="w-6 h-6" />,
    href: '/calculators/car-eligibility',
  },
  {
    id: 'lap-elig',
    name: 'LAP Eligibility',
    description: 'Check Loan Against Property eligibility',
    icon: <Home className="w-6 h-6" />,
    href: '/calculators/lap-eligibility',
  },
  {
    id: 'home-prepay',
    name: 'Home Loan Prepayment',
    description: 'Calculate prepayment savings & benefits',
    icon: <Calculator className="w-6 h-6" />,
    href: '/calculators/home-prepayment',
  },
]

export default function EligibilityPage() {
  return (
    <>
      <Header />

      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Eligibility Checker</h1>
          <p className="text-muted-foreground">Check your loan eligibility across all banks instantly</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Eligibility Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ELIGIBILITY_CALCULATORS.map((calc) => (
            <Link key={calc.id} href={calc.href}>
              <Card className="h-full p-8 hover:shadow-xl hover:border-primary transition-all cursor-pointer bg-card group border-2 border-transparent hover:bg-muted/50">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {calc.icon}
                  </div>
                </div>
                <h3 className="font-bold text-2xl mb-3 text-foreground group-hover:text-primary transition-colors">
                  {calc.name}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {calc.description}
                </p>
                <div className="flex items-center text-primary text-sm font-bold pt-4 border-t border-border/50">
                  Use Calculator
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}
