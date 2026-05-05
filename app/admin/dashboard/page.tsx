'use client'

import { useLoanData } from '@/hooks/useLoanData'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users, TrendingUp, CheckCircle2, Clock, Building2,
  Calculator, FileText, HelpCircle, Settings, BookOpen,
  BarChart3, ArrowRight, Loader2
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { leads, getLeadStats, counts, siteSettings, loading } = useLoanData()
  const stats = getLeadStats()

  const recentLeads = leads.slice(0, 5).sort((a, b) =>
    new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
  )

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  const leadStatCards = [
    { label: 'Total Leads', value: stats.total, icon: Users, bgClass: 'bg-blue-500/10', textClass: 'text-blue-600 dark:text-blue-400' },
    { label: 'This Week', value: stats.thisWeek, icon: TrendingUp, bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle2, bgClass: 'bg-green-500/10', textClass: 'text-green-600 dark:text-green-400' },
    { label: 'Pending', value: stats.pending, icon: Clock, bgClass: 'bg-amber-500/10', textClass: 'text-amber-600 dark:text-amber-400' },
  ]

  const entityCards = [
    { label: 'Banks', value: counts.banks, icon: Building2, href: '/admin/banks', bgClass: 'bg-violet-500/10', textClass: 'text-violet-600 dark:text-violet-400' },
    { label: 'Calculators', value: counts.calculators, icon: Calculator, href: '/admin/calculators', bgClass: 'bg-pink-500/10', textClass: 'text-pink-600 dark:text-pink-400' },
    { label: 'Blog Posts', value: counts.blogPosts, icon: FileText, href: '/admin/blog', bgClass: 'bg-cyan-500/10', textClass: 'text-cyan-600 dark:text-cyan-400' },
    { label: 'FAQs', value: counts.faqs, icon: HelpCircle, href: '/admin/faq', bgClass: 'bg-orange-500/10', textClass: 'text-orange-600 dark:text-orange-400' },
  ]

  const quickActions = [
    { label: 'Manage Leads', href: '/admin/leads', icon: Users },
    { label: 'Update Loan Rates', href: '/admin/rates', icon: BarChart3 },
    { label: 'Calculator Settings', href: '/admin/calculators', icon: Calculator },
    { label: 'Manage Blog', href: '/admin/blog', icon: BookOpen },
    { label: 'FAQs', href: '/admin/faq', icon: HelpCircle },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your loan business overview.
        </p>
      </div>

      {/* Lead Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {leadStatCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgClass} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textClass}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Entity Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {entityCards.map((card, i) => {
          const Icon = card.icon
          return (
            <Link key={i} href={card.href}>
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${card.bgClass} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${card.textClass}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <p className="text-2xl font-bold text-foreground">{card.value}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Leads */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Recent Leads</h2>
          <Link href="/admin/leads">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Loan Type</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No leads yet. Check back soon!
                  </td>
                </tr>
              ) : (
                recentLeads.map(lead => (
                  <tr key={lead.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium text-foreground">{lead.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {lead.loanType.charAt(0).toUpperCase() + lead.loanType.slice(1)}
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      ₹{(lead.loanAmount / 100000).toFixed(1)}L
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        lead.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        lead.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        lead.status === 'contacted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {new Date(lead.appliedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions & System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickActions.map(action => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">System Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Banks</span>
              <span className="font-medium text-foreground">{counts.banks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Loan Rate Entries</span>
              <span className="font-medium text-foreground">{counts.rates}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Eligibility Rules</span>
              <span className="font-medium text-foreground">{counts.eligibilityRules}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Calculator Configs</span>
              <span className="font-medium text-foreground">{counts.calculators}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Content Pages</span>
              <span className="font-medium text-foreground">{counts.loanContents}</span>
            </div>
            {siteSettings && (
              <>
                <hr className="border-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Site Name</span>
                  <span className="font-medium text-foreground">{siteSettings.siteName}</span>
                </div>
              </>
            )}
            <hr className="border-border" />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium text-foreground text-xs">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
