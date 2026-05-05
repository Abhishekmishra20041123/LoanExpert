'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown, Menu, X, User, LogOut, Calculator, ShieldCheck, Info, HelpCircle, FileText, Phone, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(null)

  // Submenu states for mobile
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.authenticated) setCustomer(data.customer)
      })
      .catch(() => { })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setCustomer(null)
    window.location.href = '/'
  }

  const loanTypes = [
    { name: 'Personal Loan', href: '/loans/personal' },
    { name: 'Business Loan', href: '/loans/business' },
    { name: 'Home Loan', href: '/loans/home' },
    { name: 'Car Loan', href: '/loans/car' },
    { name: 'Loan Against Property', href: '/loans/lap' },
    { name: 'All Loans', href: '/loans' },
  ]

  const toggleSubmenu = (name: string) => {
    setMobileSubmenu(mobileSubmenu === name ? null : name)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-16 max-w-7xl mx-auto items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary shrink-0">
            <Image 
              src="/logo.png" 
              alt="LoanExpert Logo" 
              width={40} 
              height={40} 
              className="rounded-xl shadow-lg"
            />
            <span className="block italic tracking-tight font-black">LoanExpert</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Loans Dropdown */}
          <div className="relative group">
            <button className="text-[15px] font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5 py-2">
              Loans
              <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-0 w-64 bg-background border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-50">
              <div className="px-3 pb-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">Categories</div>
              {loanTypes.map((loan) => (
                <Link key={loan.href} href={loan.href} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-all rounded-lg mx-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                  {loan.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Calculators Dropdown */}
          <div className="relative group">
            <button className="text-[15px] font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5 py-2">
              Tools
              <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-0 w-64 bg-background border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-50">
              <Link href="/emi-calculator" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-all rounded-lg mx-2 border-b border-border/50 mb-1">
                <Calculator className="w-5 h-5 text-primary" />
                EMI Calculator
              </Link>
              <Link href="/eligibility" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-all rounded-lg mx-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                Eligibility Hub
              </Link>
              <Link href="/calculators" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-all rounded-lg mx-2">
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                All Calculators
              </Link>
            </div>
          </div>

          <Link href="/about" className="text-[15px] font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5 px-1">About</Link>
          <Link href="/faq" className="text-[15px] font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5 px-1">FAQ</Link>
          <Link href="/blog" className="text-[15px] font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5 px-1">Blog</Link>
        </div>

        <div className="flex items-center gap-3">
          {customer && (
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex rounded-full px-5 border-primary text-primary hover:bg-primary/5">
              <Link href="/dashboard" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Dashboard
              </Link>
            </Button>
          )}

          <Button asChild size="sm" className="hidden sm:inline-flex rounded-full px-5 shadow-lg shadow-primary/20">
            <Link href="/contact">Connect Agent</Link>
          </Button>

          {/* Auth Buttons */}
          {customer ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-1 pr-3 rounded-full bg-muted/50 border border-border/50 text-sm font-semibold text-foreground hover:bg-muted transition-all">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs shadow-sm">
                  {customer.name[0]}
                </div>
                <span className="hidden sm:inline">{customer.name.split(' ')[0]}</span>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border/50 bg-muted/20">
                  <p className="text-xs font-medium text-muted-foreground">Logged in as</p>
                  <p className="text-sm font-bold truncate">{customer.email}</p>
                </div>
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-colors">
                  <User className="w-4 h-4" /> My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="secondary" size="sm" className="rounded-full px-5">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-full text-foreground hover:bg-muted transition-all border border-transparent hover:border-border active:scale-95"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 bg-background/80 backdrop-blur-md z-[100] animate-in fade-in duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Content */}
      <div className={cn(
        "lg:hidden fixed right-0 top-16 h-[calc(100vh-64px)] w-[300px] bg-background border-l border-border z-[101] shadow-2xl transition-transform duration-300 ease-out overflow-y-auto",
        mobileOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6 space-y-2">
          {/* Loans Accordion */}
          <div className="space-y-1">
            <button
              onClick={(e) => { e.stopPropagation(); toggleSubmenu('loans'); }}
              className="flex items-center justify-between w-full py-3 text-base font-bold text-foreground border-b border-border/50 group"
            >
              Loans
              <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", mobileSubmenu === 'loans' ? "rotate-180" : "")} />
            </button>
            <div className={cn(
              "grid transition-all duration-300 ease-in-out",
              mobileSubmenu === 'loans' ? "grid-rows-[1fr] opacity-100 mt-2 mb-4" : "grid-rows-[0fr] opacity-0 overflow-hidden"
            )}>
              <div className="overflow-hidden bg-muted/30 rounded-xl px-2 py-2 space-y-1">
                {loanTypes.map((loan) => (
                  <Link
                    key={loan.href}
                    href={loan.href}
                    className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {loan.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Tools Accordion */}
          <div className="space-y-1">
            <button
              onClick={(e) => { e.stopPropagation(); toggleSubmenu('tools'); }}
              className="flex items-center justify-between w-full py-3 text-base font-bold text-foreground border-b border-border/50"
            >
              Tools & Calculators
              <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", mobileSubmenu === 'tools' ? "rotate-180" : "")} />
            </button>
            <div className={cn(
              "grid transition-all duration-300 ease-in-out",
              mobileSubmenu === 'tools' ? "grid-rows-[1fr] opacity-100 mt-2 mb-4" : "grid-rows-[0fr] opacity-0 overflow-hidden"
            )}>
              <div className="overflow-hidden bg-muted/30 rounded-xl p-2 space-y-1">
                <Link href="/emi-calculator" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:text-primary transition-colors border-b border-border/30" onClick={() => setMobileOpen(false)}>
                  <Calculator className="w-5 h-5" /> EMI Calculator
                </Link>
                <Link href="/eligibility" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>
                  <ShieldCheck className="w-5 h-5" /> Eligibility Hub
                </Link>
                <Link href="/calculators" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>
                  <ArrowRight className="w-5 h-5" /> All Calculators
                </Link>
              </div>
            </div>
          </div>

          <Link href="/about" className="flex items-center gap-3 py-4 text-base font-bold text-foreground border-b border-border/50" onClick={() => setMobileOpen(false)}>
            <Info className="w-5 h-5 text-muted-foreground" /> About Us
          </Link>
          <Link href="/faq" className="flex items-center gap-3 py-4 text-base font-bold text-foreground border-b border-border/50" onClick={() => setMobileOpen(false)}>
            <HelpCircle className="w-5 h-5 text-muted-foreground" /> FAQ
          </Link>
          <Link href="/blog" className="flex items-center gap-3 py-4 text-base font-bold text-foreground border-b border-border/50" onClick={() => setMobileOpen(false)}>
            <FileText className="w-5 h-5 text-muted-foreground" /> Blog
          </Link>
          <Link href="/contact" className="flex items-center gap-3 py-4 text-base font-bold text-primary border-b border-border/50" onClick={() => setMobileOpen(false)}>
            <Phone className="w-5 h-5" /> Connect with Agent
          </Link>

          <div className="pt-8 space-y-3">
            {customer ? (
              <>
                <Link href="/dashboard" className="flex items-center justify-center w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg" onClick={() => setMobileOpen(false)}>
                  My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full py-3 rounded-xl border border-destructive text-destructive font-bold hover:bg-destructive/5"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" className="flex items-center justify-center py-3 rounded-xl border border-border font-bold text-foreground" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="flex items-center justify-center py-3 rounded-xl bg-secondary text-secondary-foreground font-bold" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
