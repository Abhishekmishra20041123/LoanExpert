'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { EligibilityRule, LoanContent } from '@/lib/storage'

interface EligibilityCalculatorProps {
  loanType: 'personal' | 'home' | 'business' | 'car' | 'lap'
  title: string
  description: string
}

const loanConfig = {
  personal: {
    ageRange: [18, 70],
    incomeRange: [20000, 400000],
    loanRange: [50000, 5000000],
    emiRange: [0, 40000],
    rateRange: [8, 30],
    tenureMonths: [12, 60],
    minIncome: 15000,
    minScore: 750,
    criteria: 'Age 21-60, Min Income ₹15,000, CIBIL ≥750'
  },
  home: {
    ageRange: [18, 70],
    incomeRange: [30000, 500000],
    loanRange: [500000, 50000000],
    emiRange: [0, 200000],
    rateRange: [6, 30],
    tenureMonths: [120, 360],
    minIncome: 25000,
    minScore: 700,
    criteria: 'Age 21-65, Min Income ₹25,000, CIBIL ≥700, Property required'
  },
  business: {
    ageRange: [18, 70],
    incomeRange: [50000, 1000000],
    loanRange: [100000, 10000000],
    emiRange: [0, 100000],
    rateRange: [8, 30],
    tenureMonths: [12, 84],
    minIncome: 50000,
    minScore: 650,
    criteria: 'Age 25-65, Min Income ₹50,000, CIBIL ≥650, Business proof'
  },
  car: {
    ageRange: [18, 70],
    incomeRange: [20000, 300000],
    loanRange: [100000, 5000000],
    emiRange: [0, 50000],
    rateRange: [7, 25],
    tenureMonths: [12, 84],
    minIncome: 15000,
    minScore: 700,
    criteria: 'Age 21-60, Min Income ₹15,000, CIBIL ≥700'
  },
  lap: {
    ageRange: [18, 70],
    incomeRange: [30000, 500000],
    loanRange: [200000, 20000000],
    emiRange: [0, 100000],
    rateRange: [7, 25],
    tenureMonths: [12, 180],
    minIncome: 20000,
    minScore: 700,
    criteria: 'Age 21-65, Min Income ₹20,000, CIBIL ≥700, Property required'
  }
}

const STRICTNESS_FACTORS = {
  personal: 1.1, // Less strict, higher multiplier
  car: 1.0,      // Medium
  home: 0.85,    // More strict
  lap: 0.8,      // Strict
  business: 0.7  // Very strict
}

const JOB_TYPE_MULTIPLIERS = {
  salaried: 1.0,
  selfemployed: 0.9,
  business: 0.85
}

export function EligibilityCalculator({ loanType, title, description }: EligibilityCalculatorProps) {
  const config = loanConfig[loanType]
  const [age, setAge] = useState(30)
  const [jobType, setJobType] = useState<'salaried' | 'selfemployed' | 'business'>('salaried')
  const [monthlyIncome, setMonthlyIncome] = useState(40000)
  const [cibilScore, setCibilScore] = useState(700)
  const [desiredLoan, setDesiredLoan] = useState(2000000)
  const [monthlyEmi, setMonthlyEmi] = useState(10000)
  const [rateOfInterest, setRateOfInterest] = useState(10)
  const [loanTenure, setLoanTenure] = useState(3)
  const [tenureUnit, setTenureUnit] = useState<'months' | 'years'>('years')
  const [showResults, setShowResults] = useState(false)

  interface SavedEligibility {
    id: number
    loanType: string
    desiredLoan: number
    maxLoan: number
    monthlyIncome: number
    jobType: 'salaried' | 'selfemployed' | 'business'
    existingEmi: number
    cibilScore: number
    tenure: number
    tenureUnit: string
    rate: number
    isEligible: boolean
    monthlyEmi: number
    timestamp: Date
  }
  const [savedCalculations, setSavedCalculations] = useState<SavedEligibility[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`loanexpert_saved_eligibility_${loanType}`)
      if (saved) {
        setSavedCalculations(JSON.parse(saved))
      }
    } catch (e) {
      console.error("Failed to load saved eligibility calculations")
    }
  }, [loanType])

  useEffect(() => {
    if (savedCalculations.length > 0) {
      localStorage.setItem(`loanexpert_saved_eligibility_${loanType}`, JSON.stringify(savedCalculations))
    } else {
      localStorage.removeItem(`loanexpert_saved_eligibility_${loanType}`)
    }
  }, [savedCalculations, loanType])

  const handleSaveCalculation = () => {
    setSavedCalculations(prev => [
      {
        id: Date.now(),
        loanType: loanType,
        desiredLoan: desiredLoan,
        maxLoan: calculations.maxLoan,
        monthlyIncome: monthlyIncome,
        jobType: jobType,
        existingEmi: monthlyEmi,
        cibilScore: cibilScore,
        tenure: loanTenure,
        tenureUnit: tenureUnit,
        rate: rateOfInterest,
        isEligible: calculations.loanEligible && calculations.ageEligible && calculations.incomeEligible && calculations.cibilEligible,
        monthlyEmi: calculations.monthlyEmi,
        timestamp: new Date()
      },
      ...prev
    ])
  }
  
  const handleRemoveSaved = (id: number) => {
    setSavedCalculations(prev => prev.filter(c => c.id !== id))
  }

  const [eligibilityRule, setEligibilityRule] = useState<EligibilityRule | null>(null)
  const [loanContent, setLoanContent] = useState<LoanContent | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [erRes, lcRes] = await Promise.all([
          fetch(`/api/public/eligibility/${encodeURIComponent(loanType)}`),
          fetch(`/api/public/loan-content/${encodeURIComponent(loanType)}`),
        ])

        if (!cancelled) {
          if (erRes.ok) {
            const erData = (await erRes.json()) as { eligibilityRule: EligibilityRule | null }
            setEligibilityRule(erData.eligibilityRule)
          } else {
            setEligibilityRule(null)
          }

          if (lcRes.ok) {
            const lcData = (await lcRes.json()) as { loanContent: LoanContent | null }
            setLoanContent(lcData.loanContent)
          } else {
            setLoanContent(null)
          }
        }
      } catch {
        if (!cancelled) {
          setEligibilityRule(null)
          setLoanContent(null)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [loanType])

  const calculations = useMemo(() => {
    // Multiplier for max loan calculation (usually 60x for personal/home, varies)
    const baseFoir = 0.6 // Financial Obligation to Income Ratio
    const strictness = STRICTNESS_FACTORS[loanType] || 1.0
    const jobMultiplier = JOB_TYPE_MULTIPLIERS[jobType] || 1.0
    
    const effectiveMinAge = eligibilityRule?.minAge ?? config.ageRange[0]
    const effectiveMaxAge = eligibilityRule?.maxAge ?? config.ageRange[1]
    const effectiveMinIncome = eligibilityRule?.minIncome ?? config.minIncome
    const effectiveMinCibil = eligibilityRule?.minCibil ?? config.minScore
    const effectiveMaxLoanCap = eligibilityRule?.maxLoanAmount ?? Number.POSITIVE_INFINITY

    // Effective FOIR based on strictness and job type
    const foir = baseFoir * strictness * jobMultiplier
    
    const availableForEmi = (monthlyIncome * foir) - monthlyEmi
    
    // Max loan based on available EMI and interest rate/tenure
    const tenureMonths = tenureUnit === 'months' ? loanTenure : loanTenure * 12
    const r = (rateOfInterest / 12) / 100
    const n = tenureMonths
    
    let maxLoanByEmi = 0
    if (n > 0) {
      if (r > 0) {
        maxLoanByEmi = (availableForEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n))
      } else {
        maxLoanByEmi = availableForEmi * n
      }
    }

    // Risk-adjusted income cap
    const incomeCapMultiplier = (loanType === 'home' || loanType === 'lap') ? 72 : 48
    const incomeBasedMax = monthlyIncome * incomeCapMultiplier * strictness * jobMultiplier
    
    const maxLoan = Math.max(0, Math.min(incomeBasedMax, maxLoanByEmi, effectiveMaxLoanCap))

    const eligibility = {
      isEligible:
        age >= effectiveMinAge &&
        age <= effectiveMaxAge &&
        monthlyIncome >= effectiveMinIncome &&
        cibilScore >= effectiveMinCibil &&
        desiredLoan <= maxLoan,
      maxLoan: Math.round(maxLoan),
      approvedAmount: Math.round(desiredLoan <= maxLoan ? desiredLoan : maxLoan),
      monthlyEmi: Math.round(availableForEmi > 0 ? availableForEmi : 0),
      tenureMonths: n,
      ageEligible: age >= effectiveMinAge && age <= effectiveMaxAge,
      incomeEligible: monthlyIncome >= effectiveMinIncome,
      cibilEligible: cibilScore >= effectiveMinCibil,
      loanEligible: desiredLoan <= maxLoan,
      jobType: jobType
    }

    return eligibility
  }, [age, monthlyIncome, desiredLoan, monthlyEmi, rateOfInterest, loanTenure, tenureUnit, config, jobType, loanType, eligibilityRule, cibilScore])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const eligibilityPercentage = showResults ? Math.min(
    (calculations.approvedAmount / desiredLoan) * 100,
    100
  ) : 0

  const handleCheck = () => {
    setShowResults(true)
  }

  return (
    <div className="w-full">
      {/* Header Description */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left Column - Input Form */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-muted/50 to-background">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
            <h2 className="text-2xl font-bold text-foreground">Check {loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan Eligibility Online</h2>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Age */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Age</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={age === 0 ? '' : age}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setAge(Math.min(config.ageRange[1], val));
                      setShowResults(false);
                    }}
                    className="w-20 text-right font-bold text-primary h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-sm text-muted-foreground">yrs</span>
                </div>
              </div>
              <Slider
                value={[age]}
                onValueChange={(value) => { setAge(value[0]); setShowResults(false); }}
                min={config.ageRange[0]}
                max={config.ageRange[1]}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>{config.ageRange[0]} Yrs</span>
                <span>{config.ageRange[1]} yrs</span>
              </div>
            </div>

            {/* Job Type */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Job Type</label>
              <div className="flex bg-muted/50 p-1 rounded-lg gap-1 border border-border/50">
                {(['salaried', 'selfemployed', 'business'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => { setJobType(type); setShowResults(false); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                      jobType === type 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {type === 'selfemployed' ? 'Self Employed' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Desired Loan Amount */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Desired Loan Amount</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    value={desiredLoan === 0 ? '' : desiredLoan}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setDesiredLoan(Math.min(config.loanRange[1], val));
                      setShowResults(false);
                    }}
                    className="w-32 text-right font-bold text-primary h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <Slider
                value={[desiredLoan]}
                onValueChange={(value) => { setDesiredLoan(value[0]); setShowResults(false); }}
                min={config.loanRange[0]}
                max={config.loanRange[1]}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>{formatCurrency(config.loanRange[0])}</span>
                <span>{formatCurrency(config.loanRange[1])}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Rate of Interest */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground block">Interest Rate (%)</label>
                <div className="flex items-center gap-2 mb-2">
                   <Input
                    type="number"
                    step="0.1"
                    value={rateOfInterest === 0 ? '' : rateOfInterest}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      setRateOfInterest(Math.min(config.rateRange[1], val));
                      setShowResults(false);
                    }}
                    className="w-full font-bold text-primary h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <Slider
                  value={[rateOfInterest]}
                  onValueChange={(value) => { setRateOfInterest(value[0]); setShowResults(false); }}
                  min={config.rateRange[0]}
                  max={config.rateRange[1]}
                  step={0.1}
                />
              </div>

              {/* Loan Tenure */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Loan Tenure</label>
                <div className="flex gap-2 h-8">
                  <Input
                    type="number"
                    value={loanTenure === 0 ? '' : loanTenure}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setLoanTenure(val);
                      setShowResults(false);
                    }}
                    className="text-center font-bold text-primary h-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="flex border rounded-md overflow-hidden shrink-0">
                    <button
                      onClick={() => { setTenureUnit('months'); setShowResults(false); }}
                      className={`px-2 text-[10px] font-bold transition-colors ${tenureUnit === 'months' ? 'bg-primary text-white' : 'bg-transparent text-muted-foreground'}`}
                    >
                      MO
                    </button>
                    <button
                      onClick={() => { setTenureUnit('years'); setShowResults(false); }}
                      className={`px-2 text-[10px] font-bold transition-colors ${tenureUnit === 'years' ? 'bg-primary text-white' : 'bg-transparent text-muted-foreground'}`}
                    >
                      YR
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Income */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Monthly Income</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    value={monthlyIncome === 0 ? '' : monthlyIncome}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setMonthlyIncome(Math.min(config.incomeRange[1], val));
                      setShowResults(false);
                    }}
                    className="w-32 text-right font-bold text-primary h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <Slider
                value={[monthlyIncome]}
                onValueChange={(value) => { setMonthlyIncome(value[0]); setShowResults(false); }}
                min={config.incomeRange[0]}
                max={config.incomeRange[1]}
                step={5000}
                className="w-full"
              />
            </div>

            {/* CIBIL Score */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">CIBIL Score</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={cibilScore === 0 ? '' : cibilScore}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value)
                      setCibilScore(Math.max(0, Math.min(900, val)))
                      setShowResults(false)
                    }}
                    className="w-24 text-right font-bold text-primary h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <Slider
                value={[cibilScore]}
                onValueChange={(value) => {
                  setCibilScore(value[0])
                  setShowResults(false)
                }}
                min={300}
                max={900}
                step={1}
                className="w-full"
              />
            </div>

            {/* Monthly EMI */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Existing Monthly EMI</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    value={monthlyEmi === 0 ? '' : monthlyEmi}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setMonthlyEmi(Math.min(config.emiRange[1], val));
                      setShowResults(false);
                    }}
                    className="w-32 text-right font-bold text-primary h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <Slider
                value={[monthlyEmi]}
                onValueChange={(value) => { setMonthlyEmi(value[0]); setShowResults(false); }}
                min={config.emiRange[0]}
                max={config.emiRange[1]}
                step={1000}
                className="w-full"
              />
            </div>

            <Button onClick={handleCheck} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg transform active:scale-95 transition-all">
              Check Eligibility Now
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Right Column - Results */}
        <Card className="border-0 shadow-lg bg-white sticky top-20 h-fit overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary to-accent rounded-t-lg text-primary-foreground py-6">
            <h3 className="text-2xl font-bold text-center">Eligibility Result</h3>
          </CardHeader>
          <CardContent className="pt-8 space-y-8 relative min-h-[400px]">
            {!showResults ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/80 backdrop-blur-sm z-10">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                   <ChevronRight className="w-12 h-12 text-primary animate-pulse" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2">Ready to See Your Eligibility?</h4>
                <p className="text-sm text-muted-foreground">Adjust the sliders and click &quot;Check Eligibility Now&quot; to calculate your personalized loan approval amount.</p>
              </div>
            ) : null}

            <div className="text-center space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">You are eligible for</h4>
                <div className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="url(#eligibility-gradient)"
                        strokeWidth="10"
                        strokeDasharray={`${(eligibilityPercentage / 100) * 339.3} 339.3`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="eligibility-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="var(--accent)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <span className="text-2xl font-black text-primary leading-tight">
                        {calculations.ageEligible && calculations.incomeEligible 
                          ? formatCurrency(Math.min(desiredLoan, calculations.maxLoan)) 
                          : '₹ 0'}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mt-1">Eligible Amount</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-xl p-4 border border-border/50 text-left">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Max Loan Limit</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(calculations.maxLoan)}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4 border border-border/50 text-left">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Tenure</p>
                  <p className="text-lg font-bold text-foreground">{tenureUnit === 'years' ? `${loanTenure} Years` : `${loanTenure} Months`}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border shadow-sm">
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${calculations.ageEligible ? 'bg-green-500' : 'bg-red-500'}`}>
                    {calculations.ageEligible ? '✓' : '✗'}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Age Requirement Met ({(eligibilityRule?.minAge ?? config.ageRange[0])}-{(eligibilityRule?.maxAge ?? config.ageRange[1])})
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border shadow-sm">
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${calculations.incomeEligible ? 'bg-green-500' : 'bg-red-500'}`}>
                    {calculations.incomeEligible ? '✓' : '✗'}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Minimum Income Met (₹{(eligibilityRule?.minIncome ?? config.minIncome).toLocaleString()}+)
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border shadow-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${calculations.cibilEligible ? 'bg-green-500' : 'bg-red-500'}`}>
                    {calculations.cibilEligible ? '✓' : '✗'}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Minimum CIBIL Met ({eligibilityRule?.minCibil ?? config.minScore}+)
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border shadow-sm">
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${calculations.loanEligible ? 'bg-green-500' : 'bg-red-500'}`}>
                    {calculations.loanEligible ? '✓' : '✗'}
                  </div>
                  <span className="text-sm font-medium text-foreground">Desired Amount within Limits</span>
                </div>
              </div>

              {/* Specificity Insight */}
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 text-left space-y-2">
                <p className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Market Insight
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                  As a <strong className="text-foreground">{jobType === 'selfemployed' ? 'Self-Employed' : jobType.charAt(0).toUpperCase() + jobType.slice(1)}</strong> applicant, 
                  lenders for <strong className="text-foreground">{loanType.toUpperCase()}</strong> loans are 
                  {loanType === 'home' ? ' very strict with property value and income stability.' : 
                   loanType === 'personal' ? ' generally more flexible with approval thresholds.' :
                   loanType === 'business' ? ' heavily focused on your business vintage and cash flow.' : 
                   ' moderately strict regarding vehicle usage and collateral.'}
                </p>
              </div>

              {showResults && loanContent?.requiredDocuments?.length ? (
                <div className="bg-muted/20 rounded-xl p-4 border border-border/50 text-left">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-2">
                    Required Documents
                  </p>
                  <ul className="space-y-1">
                    {loanContent.requiredDocuments.map((doc, i) => (
                      <li key={`${doc}-${i}`} className="text-[13px] text-muted-foreground">
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <Link href={`/contact?type=${loanType}&amount=${desiredLoan}&tenure=${tenureUnit === 'years' ? loanTenure * 12 : loanTenure}&rate=${rateOfInterest}&emi=${calculations.monthlyEmi}&isEligible=${calculations.loanEligible && calculations.ageEligible && calculations.incomeEligible && calculations.cibilEligible}&jobType=${jobType}&existingEmi=${monthlyEmi}&cibil=${cibilScore}&income=${monthlyIncome}`} className="block">
                <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 rounded-xl">
                  Get Expert Advice Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              {showResults && (
                <Button onClick={handleSaveCalculation} variant="outline" className="w-full font-bold py-6 rounded-xl shadow-sm border-2">
                  Save Eligibility to Compare
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Comparisons List */}
      {savedCalculations.length > 0 && (
        <div className="mt-8 space-y-4 animate-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
          <h3 className="text-xl font-bold text-foreground self-start pl-2 border-l-4 border-primary">Saved Comparisons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {savedCalculations.map(saved => (
              <Card key={saved.id} className="border border-border/80 relative group hover:border-primary/50 transition-colors shadow-sm bg-muted/10">
                <CardContent className="p-4 space-y-3">
                  <button 
                    onClick={() => handleRemoveSaved(saved.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
                    title="Remove Comparison"
                  >
                    ×
                  </button>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Income / CIBIL</p>
                      <p className="font-bold text-foreground">{formatCurrency(saved.monthlyIncome)} / {saved.cibilScore}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Eligibility</p>
                      <p className={`font-black text-lg ${saved.isEligible ? 'text-green-600' : 'text-red-500'}`}>{saved.isEligible ? 'Eligible' : 'Not Eligible'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-border/50">
                    <div>
                      <p className="text-muted-foreground font-semibold">Desired Loan</p>
                      <p className="font-bold">{formatCurrency(saved.desiredLoan)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground font-semibold">Max Approved</p>
                      <p className="font-bold text-primary">{formatCurrency(saved.maxLoan)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] pt-3 border-t border-border/50">
                    <div>
                      <p className="text-muted-foreground font-semibold uppercase tracking-tight">Job Type</p>
                      <p className="font-bold truncate capitalize">{saved.jobType === 'selfemployed' ? 'Self-Employed' : saved.jobType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold uppercase tracking-tight">Existing EMI</p>
                      <p className="font-bold">{formatCurrency(saved.existingEmi)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold uppercase tracking-tight">Tenure</p>
                      <p className="font-bold">{saved.tenure} {saved.tenureUnit === 'years' ? 'Yrs' : 'Mos'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold uppercase tracking-tight">Interest Rate</p>
                      <p className="font-bold text-primary">{saved.rate}%</p>
                    </div>
                  </div>

                  <Link href={`/contact?type=${saved.loanType}&amount=${saved.desiredLoan}&tenure=${saved.tenureUnit === 'years' ? saved.tenure * 12 : saved.tenure}&rate=${saved.rate}&isEligible=${saved.isEligible}&jobType=${saved.jobType}&existingEmi=${saved.existingEmi}&cibil=${saved.cibilScore}&income=${saved.monthlyIncome}&emi=${saved.monthlyEmi}`} className="block pt-3">
                    <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-10 shadow-sm">
                      Get Expert Advice
                      <ArrowRight className="ml-1.5 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
