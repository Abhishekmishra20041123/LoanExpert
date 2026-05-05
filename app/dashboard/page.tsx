'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import {
  Loader2, LogOut, Calculator, FileText, Phone,
  ClipboardList, ArrowRight, User
} from 'lucide-react'

export default function CustomerDashboard() {
  const { isAuthenticated, customer, loading, logout } = useAuth()
  const router = useRouter()
  const [leads, setLeads] = useState<any[]>([])
  const [leadsLoading, setLeadsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  // Fetch customer's leads by email
  useEffect(() => {
    if (customer?.email) {
      fetch(`/api/public/my-leads?email=${encodeURIComponent(customer.email)}`)
        .then(r => r.json())
        .then(data => setLeads(data.leads || []))
        .catch(() => {})
        .finally(() => setLeadsLoading(false))
    }
  }, [customer?.email])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) return null

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    closed: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
              Welcome, {customer?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">Manage your loan inquiries and explore tools</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 hidden sm:flex">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Profile Summary */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{customer?.name}</h2>
              <p className="text-sm text-muted-foreground">{customer?.email}</p>
              {customer?.phone && (
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              )}
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2 sm:hidden">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Link href="/emi-calculator">
            <Card className="p-5 hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full">
              <Calculator className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-bold text-foreground mb-1">EMI Calculator</h4>
              <p className="text-xs text-muted-foreground">Calculate your monthly EMI</p>
            </Card>
          </Link>
          <Link href="/eligibility">
            <Card className="p-5 hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full">
              <ClipboardList className="w-8 h-8 text-accent mb-3" />
              <h4 className="font-bold text-foreground mb-1">Check Eligibility</h4>
              <p className="text-xs text-muted-foreground">See which loans you qualify for</p>
            </Card>
          </Link>
          <Link href="/loans">
            <Card className="p-5 hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full">
              <FileText className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-bold text-foreground mb-1">Compare Loans</h4>
              <p className="text-xs text-muted-foreground">Compare rates across banks</p>
            </Card>
          </Link>
          <Link href="/contact-loan-agent">
            <Card className="p-5 hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full">
              <Phone className="w-8 h-8 text-green-500 mb-3" />
              <h4 className="font-bold text-foreground mb-1">Contact Agent</h4>
              <p className="text-xs text-muted-foreground">Get personalized loan advice</p>
            </Card>
          </Link>
        </div>

        {/* My Inquiries */}
        <h3 className="text-lg font-bold text-foreground mb-4">My Loan Inquiries</h3>
        {leadsLoading ? (
          <div className="flex items-center gap-3 p-8 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading your inquiries...
          </div>
        ) : leads.length === 0 ? (
          <Card className="p-8 text-center">
            <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-bold text-foreground mb-2">No Inquiries Yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Submit a loan inquiry to see its status here.
            </p>
            <Link href="/contact-loan-agent">
              <Button className="gap-2">Submit an Inquiry <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {leads.map((lead: any, i: number) => (
              <Card key={i} className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-bold text-foreground capitalize">{lead.loanType?.replace(/_/g, ' ')} Loan</p>
                    <p className="text-sm text-muted-foreground">
                      Amount: ₹{Number(lead.loanAmount || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submitted: {new Date(lead.appliedDate || lead.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColors[lead.status] || statusColors.new}`}>
                    {lead.status || 'new'}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
