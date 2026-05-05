'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import Link from 'next/link'

interface Bank {
  name: string
  rate: number
  logo?: string
}

interface EMICalculatorProps {
  loanType: 'personal' | 'home' | 'business' | 'car' | 'gold' | 'term' | 'mudra' | 'lap'
  minAmount?: number
  maxAmount?: number
  minRate?: number
  maxRate?: number
  minTenure?: number
  maxTenure?: number
  defaultAmount?: number
  defaultRate?: number
  defaultTenure?: number
  amountStep?: number
  tenureUnit?: 'months' | 'years'
  banks?: Bank[]
}

const TYPE_CONFIG = {
  home: { color: '[#1a365d]', accent: 'bg-[#2b6cb0]', hover: 'hover:bg-[#1e4e8c]', icon: '🏠', defaultUnit: 'years' },
  personal: { color: '[#2d3748]', accent: 'bg-[#38a169]', hover: 'hover:bg-[#2f855a]', icon: '👤', defaultUnit: 'months' },
  gold: { color: '[#744210]', accent: 'bg-[#d69e2e]', hover: 'hover:bg-[#b7791f]', icon: '💰', defaultUnit: 'months' },
  car: { color: '[#742a2a]', accent: 'bg-[#c53030]', hover: 'hover:bg-[#9b2c2c]', icon: '🚗', defaultUnit: 'years' },
  generic: { color: '[#1e3a8a]', accent: 'bg-primary', hover: 'hover:bg-primary/90', icon: '🏦', defaultUnit: 'months' }
};

export function EMICalculator({
  loanType,
  minAmount = 50000,
  maxAmount = 10000000,
  minRate = 8,
  maxRate = 25,
  minTenure = 12, // default is months
  maxTenure = 60, // default is months
  defaultAmount = 500000,
  defaultRate = 10,
  defaultTenure = 36, // default to 36 months if not specified differently
  amountStep = 100000,
  tenureUnit: initialTenureUnit = 'months',
  banks = [],
}: EMICalculatorProps) {
  const config = (TYPE_CONFIG[loanType as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.generic) as typeof TYPE_CONFIG.generic
  
  const [loanAmount, setLoanAmount] = useState(defaultAmount)
  const [rateOfInterest, setRateOfInterest] = useState(defaultRate)
  const [tenureMonths, setTenureMonths] = useState(defaultTenure)
  const [tenureUnit, setTenureUnit] = useState<'months' | 'years'>(config.defaultUnit as 'months' | 'years')
  const [processingFeePercent, setProcessingFeePercent] = useState(1)
  const [selectedBanks, setSelectedBanks] = useState<Bank[]>([])
  const [activeBankIndex, setActiveBankIndex] = useState(0)
  const [shortlistedBanks, setShortlistedBanks] = useState<Bank[]>(banks)
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  interface SavedCalculation {
    id: number
    bankName?: string
    amount: number
    tenure: number
    tenureUnit: string
    rate: number
    emi: number
    totalInterest: number
    processingFeeAmount: number
    totalWithFee: number
    timestamp: Date
  }
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([])
  const [bundleSelection, setBundleSelection] = useState<number[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`loanexpert_saved_emi_${loanType}`)
      if (saved) {
        setSavedCalculations(JSON.parse(saved))
      }
    } catch (e) {
      console.error("Failed to load saved calculations")
    }
  }, [loanType])

  useEffect(() => {
    if (savedCalculations.length > 0) {
      localStorage.setItem(`loanexpert_saved_emi_${loanType}`, JSON.stringify(savedCalculations))
    } else {
      localStorage.removeItem(`loanexpert_saved_emi_${loanType}`)
    }
  }, [savedCalculations, loanType])

  const handleSaveCalculation = () => {
    if (selectedBanks.length > 0) {
      const newSaves = selectedBanks.map((bank, idx) => {
        const monthlyRate = bank.rate / 12 / 100
        const numberOfPayments = tenureMonths
        let monthlyEMI = 0
        if (numberOfPayments > 0) {
          monthlyEMI = monthlyRate === 0 
           ? loanAmount / numberOfPayments 
           : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
        }
        const totalAmount = monthlyEMI * numberOfPayments
        const totalInterest = totalAmount - loanAmount
        const processingFeeAmount = (loanAmount * processingFeePercent) / 100
        
        return {
          id: Date.now() + idx,
          bankName: bank.name,
          amount: loanAmount,
          tenure: tenureMonths,
          tenureUnit: tenureUnit,
          rate: bank.rate,
          emi: Math.round(monthlyEMI),
          totalInterest: Math.round(totalInterest),
          processingFeeAmount: Math.round(processingFeeAmount),
          totalWithFee: Math.round(totalAmount + processingFeeAmount),
          timestamp: new Date()
        }
      })
      setSavedCalculations(prev => [...newSaves, ...prev])
    } else {
      setSavedCalculations(prev => [
        {
          id: Date.now(),
          bankName: undefined,
          amount: loanAmount,
          tenure: tenureMonths,
          tenureUnit: tenureUnit,
          rate: rateOfInterest,
          emi: calculations.monthlyEMI,
          totalInterest: calculations.totalInterest,
          processingFeeAmount: calculations.processingFeeAmount,
          totalWithFee: calculations.totalWithFee,
          timestamp: new Date()
        },
        ...prev
      ])
    }
  }
  
  const handleRemoveSaved = (id: number) => {
    setSavedCalculations(prev => prev.filter(c => c.id !== id))
    setBundleSelection(prev => prev.filter(cId => cId !== id))
  }

  const handleBundleSubmit = () => {
    const bundle = savedCalculations.filter(c => bundleSelection.includes(c.id))
    if (bundle.length === 0) return
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('loanexpert_enquiry_bundle', JSON.stringify(bundle));
      window.location.href = `/contact?type=bundle`;
    }
  }

  useEffect(() => {
     // Re-init if loanType changes
     setTenureUnit(config.defaultUnit as 'months' | 'years')
  }, [loanType, config.defaultUnit])

  // Placeholder for a larger list of banks (Master List)
  const ALL_BANKS: Bank[] = useMemo(() => [
    ...banks,
    { name: 'SBI Bank', rate: 9.15 },
    { name: 'PNB Bank', rate: 9.40 },
    { name: 'Canara Bank', rate: 9.25 },
    { name: 'Bank of Baroda', rate: 9.35 },
    { name: 'Union Bank', rate: 9.30 },
    { name: 'IndusInd Bank', rate: 10.50 },
    { name: 'Yes Bank', rate: 10.99 },
    { name: 'HSBC Bank', rate: 10.15 },
    { name: 'Standard Chartered', rate: 10.45 },
    { name: 'Citibank', rate: 10.20 },
    { name: 'RBL Bank', rate: 14.00 },
    { name: 'Federal Bank', rate: 10.49 },
    { name: 'DBS Bank', rate: 10.99 }
  ].filter((v, i, a) => a.findIndex(t => t.name === v.name) === i), [banks])

  const filteredBanks = ALL_BANKS.filter(bank => 
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBankSelect = (bank: Bank) => {
    const isSelected = selectedBanks.some(b => b.name === bank.name)
    if (isSelected) {
      const next = selectedBanks.filter(b => b.name !== bank.name)
      setSelectedBanks(next)
      if (next.length > 0) {
        const nextIndex = Math.min(activeBankIndex, next.length - 1)
        setActiveBankIndex(nextIndex)
        setRateOfInterest(next[nextIndex].rate)
      } else {
        setRateOfInterest(defaultRate)
      }
    } else {
      const next = [...selectedBanks, bank]
      setSelectedBanks(next)
      setActiveBankIndex(next.length - 1)
      setRateOfInterest(bank.rate)
      
      // Add to shortcuts if not already there
      if (!shortlistedBanks.find(b => b.name === bank.name)) {
        setShortlistedBanks(prev => [bank, ...prev].slice(0, 6)) // Keep top 6
      }
    }
    setIsBankModalOpen(false)
  }

  const calculations = useMemo(() => {
    const principal = loanAmount
    const monthlyRate = rateOfInterest / 12 / 100
    const numberOfPayments = tenureMonths

    let monthlyEMI = 0
    if (numberOfPayments > 0) {
      if (monthlyRate === 0) {
        monthlyEMI = principal / numberOfPayments
      } else {
        monthlyEMI =
          (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      }
    }

    const totalAmount = monthlyEMI * numberOfPayments
    const totalInterest = totalAmount - principal
    const processingFeeAmount = (principal * processingFeePercent) / 100

    return {
      monthlyEMI: Math.round(monthlyEMI),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principal),
      processingFeeAmount: Math.round(processingFeeAmount),
      totalWithFee: Math.round(totalAmount + processingFeeAmount)
    }
  }, [loanAmount, rateOfInterest, tenureMonths, processingFeePercent])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getQuickAmounts = () => {
    const baseAmounts = [100000, 300000, 500000, 1000000, 2500000, 5000000, 10000000]
    return baseAmounts
      .filter(v => v >= minAmount && v <= maxAmount)
      .slice(0, 5)
      .map(value => {
        const label = value >= 10000000 ? `₹${(value / 10000000).toFixed(0)}Cr` : `₹${(value / 100000).toFixed(0)}L`
        return { label, value }
      })
  }
  
  const quickAmounts = getQuickAmounts()

  const displayTenure = tenureUnit === 'years' ? Math.round(tenureMonths / 12) : tenureMonths

  return (
    <div className="w-full space-y-6">
      {/* Search/Modal Import */}
      <Dialog open={isBankModalOpen} onOpenChange={setIsBankModalOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              Select Your Bank
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search bank name..." 
                className="pl-9 bg-muted/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-6">
            {filteredBanks.map(bank => {
              const isSelected = selectedBanks.some(b => b.name === bank.name)
              return (
              <button
                key={bank.name}
                onClick={() => handleBankSelect(bank)}
                className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 rounded-xl transition-colors group border ${isSelected ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border/60'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${config.accent.replace('bg-', 'bg-opacity-10 ')} flex items-center justify-center font-bold ${config.accent.replace('bg-', 'text-')} text-xs uppercase`}>
                    {bank.name.substring(0, 2)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{bank.name}</p>
                    <p className="text-xs text-muted-foreground italic">Interest rate approx {bank.rate}% p.a</p>
                  </div>
                </div>
                <div className="text-right">
                  <ChevronRight className={`w-5 h-5 transition-all ${isSelected ? 'text-primary opacity-100' : 'text-muted-foreground opacity-0 group-hover:opacity-100'}`} />
                </div>
              </button>
            )})}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bank Selection Shortcut Bar */}
      <Card className="border border-border/30 shadow-sm bg-background">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <label className="text-sm font-semibold text-foreground">Select Your Bank</label>
               <Button 
                variant="ghost" 
                size="sm" 
                className={`text-xs font-bold px-2 h-7 ${config.accent.replace('bg-', 'text-')} hover:bg-muted`}
                onClick={() => setIsBankModalOpen(true)}
               >
                 View All Banks
                 <ChevronRight className="w-3 h-3 ml-1" />
               </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {shortlistedBanks.map((bank) => (
                <Button
                  key={bank.name}
                  variant={selectedBanks.some(b => b.name === bank.name) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleBankSelect(bank)}
                  className={`text-xs h-9 min-w-[100px] transition-all ${
                    selectedBanks.some(b => b.name === bank.name) 
                    ? `shadow-md ${config.accent} text-white hover:${config.accent}/90`
                    : 'border-border/60 hover:border-foreground'
                  }`}
                >
                  {bank.name}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBankModalOpen(true)}
                className="border-dashed border-2 hover:border-foreground h-9 min-w-[100px] font-bold text-xs"
              >
                + More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Input Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input Form */}
        <div className="space-y-4">
          {/* Loan Amount Card */}
          <Card className="border border-border/30 shadow-sm bg-background">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-muted-foreground font-medium">Loan Amount</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-bold">₹</span>
                  <Input
                    type="number"
                    value={loanAmount === 0 ? '' : loanAmount}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setLoanAmount(Math.min(maxAmount, val));
                    }}
                    className={`w-36 text-right font-bold h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${config.accent.replace('bg-', 'text-')}`}
                  />
                </div>
              </div>
              <Slider
                value={[loanAmount]}
                onValueChange={(value) => setLoanAmount(value[0])}
                min={minAmount}
                max={maxAmount}
                step={amountStep}
                className="mb-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                 <span>{formatCurrency(minAmount)}</span>
                 <span>{formatCurrency(maxAmount)}</span>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2">
                {getQuickAmounts().map((qa) => (
                    <Button
                      key={qa.value}
                      variant={loanAmount === qa.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLoanAmount(qa.value)}
                      className={`text-xs rounded-full ${
                        loanAmount === qa.value ? `${config.accent} text-white` : ''
                      }`}
                    >
                      {qa.label}
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Rate & Tenure Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Rate of Interest Card */}
            <Card className="border border-border/30 shadow-sm bg-background">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-muted-foreground font-medium">Rate (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={rateOfInterest === 0 ? '' : rateOfInterest}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      setRateOfInterest(Math.min(maxRate, val));
                    }}
                    className={`w-16 text-right font-bold h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${config.accent.replace('bg-', 'text-')}`}
                  />
                </div>
                <Slider
                  value={[rateOfInterest]}
                  onValueChange={(value) => {
                    setRateOfInterest(value[0])
                    setSelectedBanks([]) // Clear multip-bank tab context if sliders touched manually
                  }}
                  min={minRate}
                  max={maxRate}
                  step={0.01}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{minRate}%</span>
                  <span>{maxRate}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Loan Tenure Card */}
            <Card className="border border-border/30 shadow-sm bg-background">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center mb-1">
                   <label className="text-xs text-muted-foreground font-medium">Tenure</label>
                   <Input
                    type="number"
                    value={displayTenure === 0 ? '' : displayTenure}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      const inMonths = tenureUnit === 'years' ? val * 12 : val;
                      setTenureMonths(Math.min(maxTenure, inMonths));
                    }}
                    className={`w-16 text-right font-bold h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${config.accent.replace('bg-', 'text-')}`}
                  />
                </div>
                <div className="flex gap-2 mb-3 h-8">
                  <Button
                    variant={tenureUnit === 'months' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                        setTenureUnit('months');
                    }}
                    className={`flex-1 text-[10px] font-bold ${tenureUnit === 'months' ? config.accent : ''}`}
                  >
                    MO
                  </Button>
                  <Button
                    variant={tenureUnit === 'years' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                        setTenureUnit('years');
                    }}
                    className={`flex-1 text-[10px] font-bold ${tenureUnit === 'years' ? config.accent : ''}`}
                  >
                    YR
                  </Button>
                </div>
                <Slider
                  value={[tenureMonths]}
                  onValueChange={(value) => setTenureMonths(value[0])}
                  min={minTenure}
                  max={maxTenure}
                  step={1}
                />
              </CardContent>
            </Card>
          </div>

          {/* Processing Fee Card */}
          <Card className="border border-border/30 shadow-sm bg-background">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-muted-foreground font-medium font-bold">Processing Fee (%)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={processingFeePercent === 0 ? '' : processingFeePercent}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      setProcessingFeePercent(Math.min(10, val));
                    }}
                    className={`w-20 text-right font-bold h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${config.accent.replace('bg-', 'text-')}`}
                  />
                  <span className={`text-sm font-bold ${config.accent.replace('bg-', 'text-')}`}>%</span>
                </div>
              </div>
              <Slider
                value={[processingFeePercent]}
                onValueChange={(value) => setProcessingFeePercent(value[0])}
                min={0}
                max={10}
                step={0.1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>10%</span>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="bg-muted/20 border border-muted-foreground/20 rounded-lg p-3 text-[10px] text-muted-foreground italic">
            * The EMI calculation is indicative based on user inputs. Practical rates and terms may vary by lender policies.
          </div>
        </div>

        {/* Right Column - Results */}
        <Card className="border border-border/30 shadow-lg bg-background sticky top-20 h-fit overflow-hidden">
          {selectedBanks.length > 1 && (
            <div className={`flex overflow-x-auto gap-2 px-6 pt-4 pb-2 border-b border-white/20 ${config.accent} hide-scrollbar`}>
              {selectedBanks.map((bank, idx) => (
                <button
                  key={bank.name}
                  onClick={() => { setActiveBankIndex(idx); setRateOfInterest(bank.rate) }}
                  className={`px-4 py-1.5 text-[10px] uppercase font-bold rounded-full transition-all whitespace-nowrap border-2 ${
                    activeBankIndex === idx 
                      ? 'bg-white text-foreground border-white shadow-sm' 
                      : 'bg-transparent text-white border-white/30 hover:bg-white/10'
                  }`}
                >
                  {bank.name}
                </button>
              ))}
            </div>
          )}
          
          <CardHeader className={`${config.accent} text-white ${selectedBanks.length > 1 ? 'pt-4 pb-4' : 'py-4'} transition-colors duration-500`}>
            <h3 className="text-lg font-bold text-center flex items-center justify-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              {selectedBanks.length > 0 && selectedBanks[activeBankIndex] ? `${selectedBanks[activeBankIndex].name} EMI` : `${loanType.charAt(0).toUpperCase() + loanType.slice(1)} EMI Result`}
            </h3>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="text-center space-y-2 pb-6 border-b border-border/30">
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Monthly EMI</p>
              <p className={`text-5xl font-black ${config.accent.replace('bg-', 'text-')}`}>
                {formatCurrency(calculations.monthlyEMI)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Principal</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(calculations.principal)}</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Interest</p>
                <p className={`text-lg font-bold ${config.accent.replace('bg-', 'text-')}`}>{formatCurrency(calculations.totalInterest)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Proc. Fee</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(calculations.processingFeeAmount)}</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total Payable</p>
                <p className={`text-lg font-bold ${config.accent.replace('bg-', 'text-')}`}>{formatCurrency(calculations.totalWithFee)}</p>
              </div>
            </div>

            <Link href={`/contact?type=${loanType}&amount=${loanAmount}&tenure=${tenureMonths}&rate=${rateOfInterest}&emi=${calculations.monthlyEMI}`} className="w-full">
              <Button size="lg" className={`w-full ${config.accent} ${config.hover} text-white font-bold py-6 rounded-xl shadow-lg transform active:scale-95 transition-all`}>
                Get Expert Advice
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Button onClick={handleSaveCalculation} variant="outline" size="lg" className="w-full font-bold py-6 rounded-xl shadow-sm border-2">
              Save Calculation to Compare
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Saved Calculations List */}
      {savedCalculations.length > 0 && (
        <div className="mt-8 space-y-4 animate-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
          <h3 className="text-xl font-bold text-foreground self-start pl-2 border-l-4 border-primary">Saved Calculations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {savedCalculations.map(saved => (
              <Card key={saved.id} className="border border-border/80 relative group hover:border-primary/50 transition-colors shadow-sm bg-muted/10">
                <CardContent className="p-4 space-y-4">
                  <button 
                    onClick={() => handleRemoveSaved(saved.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
                    title="Remove Calculation"
                  >
                    ×
                  </button>
                  <div className="text-center space-y-1 pb-4 border-b border-border/50">
                    {saved.bankName && (
                      <div className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-black uppercase tracking-wider mb-2 border border-primary/20">
                        {saved.bankName}
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Monthly EMI</p>
                    <p className={`font-black text-3xl ${config.accent.replace('bg-', 'text-')}`}>{formatCurrency(saved.emi)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">Principal</p>
                      <p className="text-sm font-bold text-foreground">{formatCurrency(saved.amount)}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">Interest</p>
                      <p className={`text-sm font-bold ${config.accent.replace('bg-', 'text-')}`}>{formatCurrency(saved.totalInterest)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">Proc. Fee</p>
                      <p className="text-sm font-bold text-foreground">{formatCurrency(saved.processingFeeAmount)}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">Total Payable</p>
                      <p className={`text-sm font-bold ${config.accent.replace('bg-', 'text-')}`}>{formatCurrency(saved.totalWithFee)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs px-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span className="font-semibold">Tenure:</span>
                      <span className="font-bold text-foreground">{saved.tenureUnit === 'years' ? `${Math.round(saved.tenure / 12)} YRS` : `${saved.tenure} MOS`}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground justify-end">
                      <span className="font-semibold">Rate:</span>
                      <span className="font-bold text-foreground">{saved.rate}%</span>
                    </div>
                  </div>

                  <Link href={`/contact?type=${loanType}&amount=${saved.amount}&tenure=${saved.tenureUnit === 'years' ? saved.tenure * 12 : saved.tenure}&rate=${saved.rate}&emi=${saved.emi}`} className="block pt-2 mb-2">
                    <Button size="sm" className={`w-full ${config.accent} ${config.hover} text-white font-bold rounded-lg shadow-sm transition-all h-10`}>
                      Get Expert Advice (Just this)
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </Link>
                  
                  <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                    <Checkbox 
                      id={`bundle-${saved.id}`}
                      checked={bundleSelection.includes(saved.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBundleSelection([...bundleSelection, saved.id])
                        } else {
                          setBundleSelection(bundleSelection.filter(id => id !== saved.id))
                        }
                      }}
                    />
                    <label htmlFor={`bundle-${saved.id}`} className="text-xs font-semibold cursor-pointer text-muted-foreground hover:text-foreground">
                      Select for Multi-Comparison Enquiry
                    </label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {bundleSelection.length > 0 && (
            <div className="flex justify-center w-full mt-8 animate-in fade-in zoom-in duration-500 delay-150">
              <Button onClick={handleBundleSubmit} size="lg" className={`${config.accent} ${config.hover} text-white font-bold px-10 py-6 rounded-2xl shadow-lg border-2 border-white/10`}>
                Get Expert Advice for Selected ({bundleSelection.length})
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
