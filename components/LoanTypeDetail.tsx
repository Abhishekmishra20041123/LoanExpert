'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Percent, 
  HandCoins,
  CalendarDays
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LoanTypeDetailProps {
  type: string
  title: string
  icon: string
  description: string
  // Stats
  maxAmount: string
  tenureRange: string
  interestRates: string
  processingTime: string
  // Tabs Content
  overview: string
  benefits: string[]
  criteria: string[]
  documents: string[]
  schemes?: { name: string, detail: string }[]
  comparisonRates?: { bankName: string, interestRate: number }[] | null
}

export function LoanTypeDetail({
  type,
  title,
  icon,
  description,
  maxAmount,
  tenureRange,
  interestRates,
  processingTime,
  overview,
  benefits,
  criteria,
  documents,
  schemes = [],
  comparisonRates
}: LoanTypeDetailProps) {
  const [activeTab, setActiveTab] = React.useState("benefits");

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent pb-12 pt-16 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-4">
                <span className="text-4xl sm:text-5xl drop-shadow-sm shrink-0">{icon}</span>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight break-words">
                  {title}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {overview || description}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Max Loan Amount', value: maxAmount, icon: <HandCoins className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Tenure Range', value: tenureRange, icon: <CalendarDays className="w-5 h-5" />, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Interest Rate', value: interestRates, icon: <Percent className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Processing Time', value: processingTime, icon: <Clock className="w-5 h-5" />, color: 'text-green-600', bg: 'bg-green-50' },
            ].map((stat, i) => (
              <Card key={i} className="border-border/40 shadow-sm hover:shadow-lg transition-all group overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
                  <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150`} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-muted/30 h-14 w-full md:w-auto inline-flex justify-start border rounded-2xl p-1.5 mb-10 overflow-x-auto no-scrollbar">
                <TabsTrigger value="benefits" className="rounded-xl px-8 font-black transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm uppercase text-[11px] tracking-widest">
                  Key Benefits
                </TabsTrigger>
                <TabsTrigger value="eligibility" className="rounded-xl px-8 font-black transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm uppercase text-[11px] tracking-widest">
                  Eligibility
                </TabsTrigger>
                <TabsTrigger value="documents" className="rounded-xl px-8 font-black transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm uppercase text-[11px] tracking-widest">
                   Documents
                </TabsTrigger>
                <TabsTrigger value="interest" className="rounded-xl px-8 font-black transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm uppercase text-[11px] tracking-widest">
                  Interest Rates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interest" className="mt-0 animate-in fade-in duration-500">
                 <Card className="border-border/40 shadow-xl overflow-hidden rounded-3xl">
                    <div className="bg-primary/5 p-8 border-b border-border/40">
                      <h4 className="text-2xl font-black">Latest {title} Interest Rates 2024</h4>
                    </div>
                    <CardContent className="p-0">
                       <table className="w-full text-left">
                         <thead className="bg-muted text-muted-foreground font-black uppercase text-[10px] tracking-widest">
                           <tr>
                             <th className="px-8 py-5">Loan Provider</th>
                             <th className="px-8 py-5 text-right">Interest Rate (p.a)</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-border/30">
                           {(comparisonRates && comparisonRates.length > 0 ? comparisonRates : [
                             { bankName: 'SBI Bank', interestRate: 9.5 },
                             { bankName: 'HDFC Bank', interestRate: 9.99 },
                             { bankName: 'ICICI Bank', interestRate: 10.5 },
                             { bankName: 'Axis Bank', interestRate: 10.99 }
                           ]).map((bank: any, idx: number) => (
                             <tr key={idx} className="hover:bg-primary/5 transition-all">
                               <td className="px-8 py-5 font-black text-foreground">{bank.bankName}</td>
                               <td className="px-8 py-5 text-right text-primary font-black text-lg">
                                 {typeof bank.interestRate === 'number' ? `${bank.interestRate}%` : bank.interestRate}
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                    </CardContent>
                 </Card>
              </TabsContent>

              <TabsContent value="benefits" className="mt-0 animate-in fade-in duration-500">
                <div className="bg-primary/5 rounded-[2.5rem] p-10 border border-primary/10">
                  <h4 className="text-3xl font-black mb-10 border-b pb-6 border-primary/20 text-primary">Why Choose {title}?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-border/20 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                           <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-foreground/80 leading-snug">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="eligibility" className="mt-0 animate-in fade-in duration-500">
                <div className="bg-accent/5 rounded-[2.5rem] p-10 border border-accent/10">
                  <h4 className="text-3xl font-black mb-10 border-b pb-6 border-accent/20 text-accent">Eligibility Criteria</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {criteria.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-border/20 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                           <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-foreground/80 leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-0 animate-in fade-in duration-500">

                <div className="bg-muted/10 rounded-[2.5rem] p-10 border border-border/40">
                  <h4 className="text-3xl font-black mb-10 border-b pb-6 border-border/50">Documentation Checklist</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {documents.map((doc, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 border border-border/20 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                           <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-foreground/80 leading-snug">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="border-border/40 shadow-2xl bg-white overflow-hidden rounded-[2rem] border-t-8 border-t-primary">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                      <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-3">Approval Chances</p>
                      <div className="flex items-center gap-4">
                        <div className="h-3 flex-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[88%]" />
                        </div>
                        <span className="text-lg font-black text-primary">88%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                       <Link href={`/calculators/${type}-eligibility`} className="block group">
                        <Button variant="outline" className="w-full justify-between h-16 rounded-2xl px-6 border-border/60 hover:border-primary hover:bg-primary/5 group transition-all text-sm font-bold">
                          <span className="flex items-center gap-3">
                             <ShieldCheck className="w-5 h-5 text-primary" /> Check Eligibility
                          </span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                        </Button>
                      </Link>
                      <Link href={`/calculators/${type}-emi`} className="block group">
                        <Button variant="outline" className="w-full justify-between h-16 rounded-2xl px-6 border-border/60 hover:border-primary hover:bg-primary/5 group transition-all text-sm font-bold">
                          <span className="flex items-center gap-3">
                             <Percent className="w-5 h-5 text-primary" /> EMI Calculator
                          </span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-border/30 space-y-6">
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-accent/5 border border-accent/10">
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md rotate-3 group-hover:rotate-0 transition-transform">
                        <HandCoins className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Support</p>
                        <p className="text-sm font-black text-foreground">Dedicated Loan Advisor</p>
                      </div>
                    </div>
                    <Link href="/contact">
                       <Button className="w-full h-14 rounded-2xl font-black bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 text-sm uppercase tracking-widest">
                         Connect with Expert
                       </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
