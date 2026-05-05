// EMI and loan calculation utilities

export interface EMICalculation {
  loanAmount: number
  annualRate: number
  monthlyRate: number
  tenure: number // in months
  emi: number
  totalAmount: number
  totalInterest: number
  processingFee: number
}

/**
 * Calculate EMI using the standard formula:
 * EMI = (P × r × (1+r)^n) / ((1+r)^n - 1)
 * Where:
 * P = Loan Amount
 * r = Monthly Interest Rate (annual / 12 / 100)
 * n = Number of months
 */
export function calculateEMI(loanAmount: number, annualRate: number, tenureMonths: number): EMICalculation {
  const monthlyRate = annualRate / 12 / 100

  // Handle zero interest rate
  if (monthlyRate === 0) {
    const emi = loanAmount / tenureMonths
    return {
      loanAmount,
      annualRate,
      monthlyRate,
      tenure: tenureMonths,
      emi: Math.round(emi),
      totalAmount: loanAmount,
      totalInterest: 0,
      processingFee: 0,
    }
  }

  const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)
  const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1
  const emi = numerator / denominator

  const totalAmount = emi * tenureMonths
  const totalInterest = totalAmount - loanAmount

  return {
    loanAmount,
    annualRate,
    monthlyRate,
    tenure: tenureMonths,
    emi: Math.round(emi),
    totalAmount: Math.round(totalAmount),
    totalInterest: Math.round(totalInterest),
    processingFee: 0,
  }
}

/**
 * Calculate EMI with processing fee included
 */
export function calculateEMIWithFee(
  loanAmount: number,
  annualRate: number,
  tenureMonths: number,
  processingFeePercent: number = 0
): EMICalculation {
  const processingFee = (loanAmount * processingFeePercent) / 100
  const principalAmount = loanAmount + processingFee

  const calculation = calculateEMI(principalAmount, annualRate, tenureMonths)
  calculation.processingFee = Math.round(processingFee)

  return calculation
}

/**
 * Format currency in INR
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}

/**
 * Calculate max loan eligible based on income and loan type rules
 */
export function calculateMaxLoanEligible(
  monthlyIncome: number,
  employmentType: string,
  rule: { maxLoanAmount: number }
): number {
  // General rule: loan should not exceed 60 months of income for salaried employees
  // and 36 months for self-employed
  const multiplier = employmentType === 'salaried' ? 60 : 36
  const incomeBasedMax = monthlyIncome * multiplier

  return Math.min(incomeBasedMax, rule.maxLoanAmount)
}

/**
 * Check eligibility based on rules
 */
export function checkEligibility(
  age: number,
  monthlyIncome: number,
  loanAmount: number,
  cibilScore: number | undefined,
  rule: any
): {
  eligible: boolean
  reasons: string[]
  maxLoan: number
} {
  const reasons: string[] = []
  let eligible = true

  // Age check
  if (age < rule.minAge) {
    eligible = false
    reasons.push(`Minimum age requirement is ${rule.minAge} years`)
  }
  if (age > rule.maxAge) {
    eligible = false
    reasons.push(`Maximum age limit is ${rule.maxAge} years`)
  }

  // Income check
  if (monthlyIncome < rule.minIncome) {
    eligible = false
    reasons.push(`Minimum monthly income required is ₹${rule.minIncome.toLocaleString()}`)
  }

  // CIBIL score check
  if (cibilScore !== undefined && cibilScore < rule.minCibil) {
    eligible = false
    reasons.push(`Minimum CIBIL score required is ${rule.minCibil}`)
  }

  // Loan amount check
  const maxEligible = calculateMaxLoanEligible(monthlyIncome, 'salaried', rule)
  if (loanAmount > maxEligible) {
    eligible = false
    reasons.push(`Maximum eligible loan amount is ₹${Math.round(maxEligible).toLocaleString()}`)
  }

  return {
    eligible,
    reasons,
    maxLoan: maxEligible,
  }
}

/**
 * Generate amortization schedule
 */
export function generateAmortizationSchedule(
  loanAmount: number,
  annualRate: number,
  tenureMonths: number,
  processingFeePercent: number = 0
): Array<{
  month: number
  emi: number
  principal: number
  interest: number
  balance: number
}> {
  const calculation = calculateEMIWithFee(loanAmount, annualRate, tenureMonths, processingFeePercent)
  const schedule = []

  let balance = loanAmount + calculation.processingFee
  const emi = calculation.emi

  for (let i = 1; i <= tenureMonths; i++) {
    const interest = Math.round(balance * calculation.monthlyRate)
    const principal = emi - interest
    balance -= principal

    schedule.push({
      month: i,
      emi,
      principal,
      interest,
      balance: Math.max(0, balance),
    })
  }

  return schedule
}

/**
 * Compare loan offers from different banks
 */
export interface LoanOffer {
  bankId: string
  bankName: string
  interestRate: number
  emi: number
  totalAmount: number
  totalInterest: number
  processingFee: number
  isRecommended?: boolean
}

export function compareLoanOffers(
  loanAmount: number,
  tenureMonths: number,
  offers: Array<{
    bankId: string
    bankName: string
    interestRate: number
    processingFee: number
    isRecommended?: boolean
  }>
): LoanOffer[] {
  const comparisons = offers.map(offer => {
    const calculation = calculateEMIWithFee(loanAmount, offer.interestRate, tenureMonths, offer.processingFee)

    return {
      bankId: offer.bankId,
      bankName: offer.bankName,
      interestRate: offer.interestRate,
      emi: calculation.emi,
      totalAmount: calculation.totalAmount,
      totalInterest: calculation.totalInterest,
      processingFee: calculation.processingFee,
      isRecommended: offer.isRecommended,
    }
  })

  // Sort by EMI (ascending)
  return comparisons.sort((a, b) => a.emi - b.emi)
}
