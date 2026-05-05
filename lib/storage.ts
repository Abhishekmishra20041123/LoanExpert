// localStorage utilities for loan platform

export type Bank = {
  id: string
  name: string
  logo: string
  contactPerson: string
}

export type LoanRate = {
  bankId: string
  loanType: string
  interestRate: number
  processingFee: number
}

export type EligibilityRule = {
  loanType: string
  minAge: number
  maxAge: number
  minIncome: number
  minCibil: number
  maxLoanAmount: number
  processingTime: string
}

export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  loanType: string
  loanAmount: number
  income: number
  employmentType: string
  cibilScore?: number
  appliedDate: string
  status: 'new' | 'contacted' | 'approved' | 'rejected' | 'closed'
  selectedBank?: string
  notes: string
  adminNotes?: string
  contactedDate?: string
}

export type AdminUser = {
  id: string
  email: string
  password: string
}

export type LoanContent = {
  loanType: string
  overview: string
  keyBenefits: string[]
  eligibilityCriteria: string[]
  requiredDocuments: string[]
  processingTime: string
  interestRates: string
  maxLoanAmount: string
  tenureRange: string
  lastUpdated: string
  updatedBy: string
}

// Generic localStorage functions
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key}:`, error)
  }
}

function removeItem(key: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing ${key}:`, error)
  }
}

// Banks Management
export const bankStorage = {
  getAll: (defaultBanks: Bank[]): Bank[] => getItem('banks', defaultBanks),
  save: (banks: Bank[]) => setItem('banks', banks),
  add: (bank: Bank, defaultBanks: Bank[]) => {
    const banks = bankStorage.getAll(defaultBanks)
    bankStorage.save([...banks, bank])
  },
  update: (id: string, updates: Partial<Bank>, defaultBanks: Bank[]) => {
    const banks = bankStorage.getAll(defaultBanks)
    const updated = banks.map(b => b.id === id ? { ...b, ...updates } : b)
    bankStorage.save(updated)
  },
  delete: (id: string, defaultBanks: Bank[]) => {
    const banks = bankStorage.getAll(defaultBanks)
    bankStorage.save(banks.filter(b => b.id !== id))
  },
}

// Loan Rates Management
export const rateStorage = {
  getAll: (defaultRates: LoanRate[]): LoanRate[] => getItem('loanRates', defaultRates),
  save: (rates: LoanRate[]) => setItem('loanRates', rates),
  getByLoanType: (loanType: string, defaultRates: LoanRate[]): LoanRate[] => {
    const rates = rateStorage.getAll(defaultRates)
    return rates.filter(r => r.loanType === loanType)
  },
  getByBankAndType: (bankId: string, loanType: string, defaultRates: LoanRate[]) => {
    const rates = rateStorage.getAll(defaultRates)
    return rates.find(r => r.bankId === bankId && r.loanType === loanType)
  },
  update: (bankId: string, loanType: string, updates: Partial<LoanRate>, defaultRates: LoanRate[]) => {
    const rates = rateStorage.getAll(defaultRates)
    const updated = rates.map(r =>
      r.bankId === bankId && r.loanType === loanType ? { ...r, ...updates } : r
    )
    rateStorage.save(updated)
  },
}

// Eligibility Rules Management
export const eligibilityStorage = {
  getAll: (defaultRules: Record<string, EligibilityRule>) => getItem('eligibilityRules', defaultRules),
  get: (loanType: string, defaultRules: Record<string, EligibilityRule>) => {
    const rules = eligibilityStorage.getAll(defaultRules)
    return rules[loanType]
  },
  save: (rules: Record<string, EligibilityRule>) => setItem('eligibilityRules', rules),
  update: (loanType: string, updates: Partial<EligibilityRule>, defaultRules: Record<string, EligibilityRule>) => {
    const rules = eligibilityStorage.getAll(defaultRules)
    eligibilityStorage.save({
      ...rules,
      [loanType]: { ...rules[loanType], ...updates },
    })
  },
}

// Leads Management
export const leadStorage = {
  getAll: (): Lead[] => getItem('leads', []),
  save: (leads: Lead[]) => setItem('leads', leads),
  add: (lead: Lead) => {
    const leads = leadStorage.getAll()
    leadStorage.save([...leads, lead])
  },
  update: (id: string, updates: Partial<Lead>) => {
    const leads = leadStorage.getAll()
    const updated = leads.map(l => l.id === id ? { ...l, ...updates } : l)
    leadStorage.save(updated)
  },
  delete: (id: string) => {
    const leads = leadStorage.getAll()
    leadStorage.save(leads.filter(l => l.id !== id))
  },
  getById: (id: string): Lead | undefined => {
    const leads = leadStorage.getAll()
    return leads.find(l => l.id === id)
  },
  getByStatus: (status: Lead['status']): Lead[] => {
    const leads = leadStorage.getAll()
    return leads.filter(l => l.status === status)
  },
  getByLoanType: (loanType: string): Lead[] => {
    const leads = leadStorage.getAll()
    return leads.filter(l => l.loanType === loanType)
  },
  getStats: () => {
    const leads = leadStorage.getAll()
    return {
      total: leads.length,
      today: leads.filter(l => {
        const today = new Date().toDateString()
        return new Date(l.appliedDate).toDateString() === today
      }).length,
      thisWeek: leads.filter(l => {
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return new Date(l.appliedDate) >= weekAgo
      }).length,
      pending: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      approved: leads.filter(l => l.status === 'approved').length,
    }
  },
}

// Admin Users
export const adminStorage = {
  getAll: (): AdminUser[] => getItem('adminUsers', []),
  add: (admin: AdminUser) => {
    const admins = adminStorage.getAll()
    adminStorage.save([...admins, admin])
  },
  save: (admins: AdminUser[]) => setItem('adminUsers', admins),
  findByEmail: (email: string): AdminUser | undefined => {
    const admins = adminStorage.getAll()
    return admins.find(a => a.email === email)
  },
}

// Session Management
export const adminSessionStorage = {
  setAdminSession: (email: string) => {
    if (typeof window === 'undefined') return
    if (typeof window.sessionStorage !== 'undefined') {
      window.sessionStorage.setItem('adminEmail', email)
      window.sessionStorage.setItem('adminLoginTime', new Date().toISOString())
    }
  },
  getAdminSession: (): { email: string; loginTime: string } | null => {
    if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return null
    const email = window.sessionStorage.getItem('adminEmail')
    const loginTime = window.sessionStorage.getItem('adminLoginTime')
    return email && loginTime ? { email, loginTime } : null
  },
  clearAdminSession: () => {
    if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return
    window.sessionStorage.removeItem('adminEmail')
    window.sessionStorage.removeItem('adminLoginTime')
  },
}

// Loan Content Management
export const loanContentStorage = {
  getByType: (loanType: string): LoanContent | null => {
    const contents = getItem('loanContents', [] as LoanContent[])
    return contents.find(c => c.loanType === loanType) || null
  },
  getAll: (): LoanContent[] => getItem('loanContents', []),
  save: (content: LoanContent) => {
    const contents = getItem('loanContents', [] as LoanContent[])
    const index = contents.findIndex(c => c.loanType === content.loanType)
    if (index >= 0) {
      contents[index] = content
    } else {
      contents.push(content)
    }
    setItem('loanContents', contents)
  },
  delete: (loanType: string) => {
    const contents = getItem('loanContents', [] as LoanContent[])
    setItem('loanContents', contents.filter(c => c.loanType !== loanType))
  },
}

// Analytics
export const analyticsStorage = {
  trackPageView: (page: string) => {
    if (typeof window === 'undefined') return
    const views = getItem('pageViews', {} as Record<string, number>)
    views[page] = (views[page] || 0) + 1
    setItem('pageViews', views)
  },
  trackLoanSearch: (loanType: string, amount: number) => {
    if (typeof window === 'undefined') return
    const searches = getItem('loanSearches', [] as Array<{ type: string; amount: number; date: string }>)
    searches.push({ type: loanType, amount, date: new Date().toISOString() })
    setItem('loanSearches', searches)
  },
  getPageViews: () => getItem('pageViews', {} as Record<string, number>),
  getLoanSearches: () => getItem('loanSearches', [] as Array<{ type: string; amount: number; date: string }>),
}
