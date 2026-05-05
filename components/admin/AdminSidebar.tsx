'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Settings,
  LogOut,
  FileText,
  Building2,
  CheckCircle2,
  BookOpen,
  Calculator,
  HelpCircle,
  Newspaper,
  UserCircle,
  FormInput,
} from 'lucide-react'

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { logout, adminEmail } = useAdminAuth()

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const menuGroups = [
    {
      label: 'Overview',
      items: [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/leads', label: 'Leads', icon: Users },
      ],
    },
    {
      label: 'Configuration',
      items: [
        { href: '/admin/banks', label: 'Banks', icon: Building2 },
        { href: '/admin/rates', label: 'Loan Rates', icon: DollarSign },
        { href: '/admin/eligibility', label: 'Eligibility Rules', icon: CheckCircle2 },
        { href: '/admin/calculators', label: 'Calculators', icon: Calculator },
        { href: '/admin/form-fields', label: 'Form Fields', icon: FormInput },
      ],
    },
    {
      label: 'Content',
      items: [
        { href: '/admin/loan-content', label: 'Loan Content', icon: BookOpen },
        { href: '/admin/blog', label: 'Blog Manager', icon: Newspaper },
        { href: '/admin/faq', label: 'FAQ Manager', icon: HelpCircle },
        { href: '/admin/content', label: 'Site Content', icon: FileText },
      ],
    },
    {
      label: 'System',
      items: [
        { href: '/admin/profile', label: 'My Profile / About', icon: UserCircle },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
      ],
    },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-black">
            ₹
          </div>
          LoanExpert
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {menuGroups.map(group => (
          <div key={group.label} className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="px-3 py-2 rounded-lg bg-muted">
          <p className="text-xs text-muted-foreground">Logged in as</p>
          <p className="text-sm font-medium text-foreground truncate">{adminEmail}</p>
        </div>
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
