'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, TrendingUp, Clock } from 'lucide-react'

const loanTypes = [
  {
    href: '/loans/personal',
    title: 'Personal Loan',
    icon: '💳',
    description: 'Flexible personal loans for any need',
    features: ['Quick approval', 'No collateral', 'Up to ₹30L'],
  },
  {
    href: '/loans/home',
    title: 'Home Loan',
    icon: '🏠',
    description: 'Finance your dream home',
    features: ['Low rates', 'Long tenure', 'Tax benefits'],
  },
  {
    href: '/loans/business',
    title: 'Business Loan',
    icon: '💼',
    description: 'Grow your business with ease',
    features: ['Quick disbursal', 'Flexible terms', 'Business focused'],
  },
  {
    href: '/loans/car',
    title: 'Car Loan',
    icon: '🚗',
    description: 'Drive home your dream car',
    features: ['Competitive rates', 'Fast approval', 'Easy process'],
  },
  {
    href: '/loans/lap',
    title: 'Loan Against Property',
    icon: '🏢',
    description: 'Unlock the value of your property',
    features: ['Instant approval', 'High amounts', 'Lower rates'],
  },
]

const stats = [
  { icon: TrendingUp, label: 'Loan Products', value: '5+' },
  { icon: Zap, label: 'Quick Approval', value: '24hrs' },
  { icon: Shield, label: 'Trusted By', value: '50k+' },
  { icon: Clock, label: 'Avg Processing', value: '3-5 days' },
]

export default function LoansPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted">
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-pretty">
                Find Your Perfect Loan
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Explore loans from multiple banks, get instant approval, and access
                funds within 24-48 hours. Choose from our wide range of loan products.
              </p>
              <Link href="/contact-loan-agent">
                <Button size="lg" className="gap-2">
                  Connect with Loan Agent
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <Card key={i} className="p-6 text-center">
                    <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Loan Types Grid */}
        <section className="py-12 md:py-16 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Our Loan Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loanTypes.map((loan, i) => (
                <Link key={i} href={loan.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow p-6 cursor-pointer">
                    <div className="text-4xl mb-3">{loan.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{loan.title}</h3>
                    <p className="text-muted-foreground mb-4">{loan.description}</p>
                    <div className="space-y-2 mb-6">
                      {loan.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full gap-2">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Comparison */}
        <section className="py-12 md:py-16 px-4 md:px-6 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Quick Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-bold">Loan Type</th>
                    <th className="text-left py-4 px-4 font-bold">Amount</th>
                    <th className="text-left py-4 px-4 font-bold">Interest Rate</th>
                    <th className="text-left py-4 px-4 font-bold">Tenure</th>
                    <th className="text-left py-4 px-4 font-bold">Approval</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Personal Loan', amount: '₹50K - ₹30L', rate: '9.5% - 11%', tenure: 'Up to 60m', approval: '24-48hrs' },
                    { type: 'Home Loan', amount: '₹50L - ₹2Cr', rate: '7% - 8.5%', tenure: 'Up to 30yr', approval: '7-10 days' },
                    { type: 'Business Loan', amount: '₹1L - ₹50L', rate: '10% - 12%', tenure: 'Up to 84m', approval: '3-5 days' },
                    { type: 'Car Loan', amount: '₹5L - ₹50L', rate: '8% - 10%', tenure: 'Up to 84m', approval: '1-2 days' },
                    { type: 'LAP', amount: '₹10L - ₹1Cr', rate: '8% - 9.5%', tenure: 'Up to 15yr', approval: '5-7 days' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b hover:bg-muted transition-colors">
                      <td className="py-4 px-4">{row.type}</td>
                      <td className="py-4 px-4">{row.amount}</td>
                      <td className="py-4 px-4">{row.rate}</td>
                      <td className="py-4 px-4">{row.tenure}</td>
                      <td className="py-4 px-4">{row.approval}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with our loan experts to find the best loan product for your needs.
              Get pre-approved in minutes and access funds within 24-48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact-loan-agent">
                <Button size="lg" className="gap-2">
                  Contact Our Agent
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/emi-calculator">
                <Button variant="outline" size="lg">
                  Use EMI Calculator
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
