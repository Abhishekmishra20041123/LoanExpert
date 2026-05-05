// Banks
export const BANKS = [
  { id: '1', name: 'SBI', logo: '🏦', contactPerson: 'Bank Manager' },
  { id: '2', name: 'HDFC Bank', logo: '🏦', contactPerson: 'Bank Manager' },
  { id: '3', name: 'ICICI Bank', logo: '🏦', contactPerson: 'Bank Manager' },
  { id: '4', name: 'Axis Bank', logo: '🏦', contactPerson: 'Bank Manager' },
  { id: '5', name: 'Kotak Mahindra', logo: '🏦', contactPerson: 'Bank Manager' },
  { id: '6', name: 'PNB', logo: '🏦', contactPerson: 'Bank Manager' },
]

// Loan Types
export const LOAN_TYPES = [
  { id: 'personal', name: 'Personal Loan', description: 'Flexible personal loans for any need' },
  { id: 'home', name: 'Home Loan', description: 'Affordable home loans with low interest rates' },
  { id: 'business', name: 'Business Loan', description: 'Growth capital for your business' },
  { id: 'car', name: 'Car Loan', description: 'Finance your dream car' },
  { id: 'lap', name: 'Loan Against Property', description: 'Leverage your property for funds' },
]

// Default Eligibility Rules
export const DEFAULT_ELIGIBILITY_RULES = {
  personal: {
    loanType: 'personal',
    minAge: 21,
    maxAge: 65,
    minIncome: 25000,
    minCibil: 600,
    maxLoanAmount: 3000000,
    processingTime: '3-5 days',
  },
  home: {
    loanType: 'home',
    minAge: 25,
    maxAge: 60,
    minIncome: 50000,
    minCibil: 650,
    maxLoanAmount: 50000000,
    processingTime: '20-30 days',
  },
  business: {
    loanType: 'business',
    minAge: 30,
    maxAge: 65,
    minIncome: 100000,
    minCibil: 700,
    maxLoanAmount: 10000000,
    processingTime: '7-15 days',
  },
  car: {
    loanType: 'car',
    minAge: 21,
    maxAge: 65,
    minIncome: 30000,
    minCibil: 600,
    maxLoanAmount: 5000000,
    processingTime: '3-7 days',
  },
  lap: {
    loanType: 'lap',
    minAge: 25,
    maxAge: 70,
    minIncome: 40000,
    minCibil: 700,
    maxLoanAmount: 25000000,
    processingTime: '10-20 days',
  },
}

// Default Loan Rates (Annual Interest Rate %)
export const DEFAULT_LOAN_RATES = [
  // Personal Loan
  { bankId: '1', loanType: 'personal', interestRate: 9.5, processingFee: 1 },
  { bankId: '2', loanType: 'personal', interestRate: 9.99, processingFee: 1.5 },
  { bankId: '3', loanType: 'personal', interestRate: 10.5, processingFee: 1.5 },
  { bankId: '4', loanType: 'personal', interestRate: 10.99, processingFee: 1.25 },
  { bankId: '5', loanType: 'personal', interestRate: 10.25, processingFee: 1.5 },
  { bankId: '6', loanType: 'personal', interestRate: 11.0, processingFee: 2 },
  // Home Loan
  { bankId: '1', loanType: 'home', interestRate: 6.5, processingFee: 0.5 },
  { bankId: '2', loanType: 'home', interestRate: 6.75, processingFee: 0.5 },
  { bankId: '3', loanType: 'home', interestRate: 7.0, processingFee: 0.75 },
  { bankId: '4', loanType: 'home', interestRate: 7.25, processingFee: 0.75 },
  { bankId: '5', loanType: 'home', interestRate: 6.9, processingFee: 0.6 },
  { bankId: '6', loanType: 'home', interestRate: 7.5, processingFee: 1 },
  // Business Loan
  { bankId: '1', loanType: 'business', interestRate: 9.0, processingFee: 2 },
  { bankId: '2', loanType: 'business', interestRate: 9.5, processingFee: 2.5 },
  { bankId: '3', loanType: 'business', interestRate: 10.0, processingFee: 2 },
  { bankId: '4', loanType: 'business', interestRate: 10.5, processingFee: 2.5 },
  { bankId: '5', loanType: 'business', interestRate: 9.75, processingFee: 2 },
  { bankId: '6', loanType: 'business', interestRate: 10.75, processingFee: 3 },
  // Car Loan
  { bankId: '1', loanType: 'car', interestRate: 8.0, processingFee: 1.5 },
  { bankId: '2', loanType: 'car', interestRate: 8.25, processingFee: 1.5 },
  { bankId: '3', loanType: 'car', interestRate: 8.75, processingFee: 2 },
  { bankId: '4', loanType: 'car', interestRate: 9.0, processingFee: 1.75 },
  { bankId: '5', loanType: 'car', interestRate: 8.5, processingFee: 1.5 },
  { bankId: '6', loanType: 'car', interestRate: 9.25, processingFee: 2 },
  // LAP
  { bankId: '1', loanType: 'lap', interestRate: 7.5, processingFee: 1.5 },
  { bankId: '2', loanType: 'lap', interestRate: 7.75, processingFee: 1.75 },
  { bankId: '3', loanType: 'lap', interestRate: 8.0, processingFee: 2 },
  { bankId: '4', loanType: 'lap', interestRate: 8.25, processingFee: 1.75 },
  { bankId: '5', loanType: 'lap', interestRate: 8.0, processingFee: 1.5 },
  { bankId: '6', loanType: 'lap', interestRate: 8.5, processingFee: 2 },
]

// Admin credentials
export const ADMIN_CREDENTIALS = {
  email: 'admin@loanexpert.com',
  password: 'admin@123',
}

// WhatsApp
export const WHATSAPP_NUMBER = '+919999999999' // Replace with actual number

// Contact Details
export const CONTACT_PHONE = '9999999999'
export const CONTACT_EMAIL = 'loans@loanexpert.com'
