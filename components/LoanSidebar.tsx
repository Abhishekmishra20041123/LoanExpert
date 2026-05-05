'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, UserCheck, Building2, Home, Car, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useResponsive } from '@/hooks/useResponsive'

type LoanType = {
  id: string
  name: string
  path: string
  icon: React.ReactNode
}

const LOAN_TYPES: LoanType[] = [
  {
    id: 'personal',
    name: 'Personal Loan',
    path: '/loans/personal',
    icon: <UserCheck className="w-5 h-5" />,
  },
  {
    id: 'business',
    name: 'Business Loan',
    path: '/loans/business',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: 'home',
    name: 'Home Loan',
    path: '/loans/home',
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: 'car',
    name: 'Car Loan',
    path: '/loans/car',
    icon: <Car className="w-5 h-5" />,
  },
  {
    id: 'lap',
    name: 'Loan Against Property',
    path: '/loans/lap',
    icon: <TrendingUp className="w-5 h-5" />,
  },
]

interface LoanSidebarProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  className?: string
}

export default function LoanSidebar({
  activeTab = 'personal',
  onTabChange,
  className = '',
}: LoanSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { isMobile } = useResponsive()

  const handleLoanSelect = (loanId: string) => {
    if (onTabChange) {
      onTabChange(loanId)
    }
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden fixed top-20 left-4 z-40 p-2 rounded-md bg-primary text-white"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobileOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobile
            ? `fixed left-0 top-0 h-full w-64 transform transition-transform duration-300 z-40 ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'relative hidden md:block'
          }
          bg-background border-r border-border pt-20 md:pt-0
          ${className}
        `}
      >
        <nav className="space-y-2 p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 px-2">
            LOAN TYPES
          </h3>

          {LOAN_TYPES.map((loan) => {
            const isActive = activeTab === loan.id
            return (
              <Link key={loan.id} href={loan.path}>
                <button
                  onClick={() => handleLoanSelect(loan.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <span className="flex-shrink-0">{loan.icon}</span>
                  <span>{loan.name}</span>
                </button>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
