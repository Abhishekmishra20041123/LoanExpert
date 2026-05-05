import mongoose from 'mongoose'
import { LOAN_TYPES } from './constants'
import { LoanContent, AdminUser, SiteSettings, Bank, LoanRate, EligibilityRule, Faq, FormConfig } from './models'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('❌ FATAL: MONGODB_URI is missing. Please ensure MONGODB_URI is set in your .env file.')
}

export async function connectMongo() {
  try {
    if (mongoose.connection.readyState >= 1) return
    console.log('[DEBUG] Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('[DEBUG] Connected to MongoDB')
  } catch (err) {
    console.error('[ERROR] MongoDB connection failed:', err)
  }
}

let isSeeded = false
export async function ensureSeedData() {
  if (isSeeded) return
  try {
    // 1. Seed Admins
    const adminCount = await AdminUser.countDocuments()
    if (adminCount === 0) {
      console.log('[DEBUG] Seeding default admin...')
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash('admin@123', salt)
      await AdminUser.create({
        email: 'admin@loanexpert.com',
        passwordHash,
        fullName: 'System Administrator'
      })
    }

    // 2. Seed Site Settings
    const settingsCount = await SiteSettings.countDocuments()
    if (settingsCount === 0) {
      console.log('[DEBUG] Seeding default site settings...')
      await SiteSettings.create({
        key: 'main',
        siteName: 'LoanExpert',
        contactEmail: 'contact@loanexpert.com',
        contactPhone: '+91 99999 88888',
        whatsappNumber: '919999988888'
      })
    }

    // 3. Seed Banks
    const bankCount = await Bank.countDocuments()
    if (bankCount === 0) {
      console.log('[DEBUG] Seeding default banks...')
      await Bank.insertMany([
        { id: 'hdfc', name: 'HDFC Bank', contactPerson: 'John Doe' },
        { id: 'icici', name: 'ICICI Bank', contactPerson: 'Jane Smith' },
        { id: 'sbi', name: 'SBI Bank', contactPerson: 'Robert Brown' },
        { id: 'axis', name: 'Axis Bank', contactPerson: 'Sarah Wilson' },
        { id: 'kotak', name: 'Kotak Bank', contactPerson: 'Michael Lee' },
      ])
    }

    // 4. Seed Loan Rate Data
    // Self-healing: if we have legacy string-based bank IDs, clear them
    const hasLegacyRates = await LoanRate.exists({ bankId: 'hdfc' })
    if (hasLegacyRates) {
      console.log('[DEBUG] Clearing legacy loan rates...')
      await LoanRate.deleteMany({ bankId: { $in: ['hdfc', 'icici', 'sbi', 'axis', 'kotak'] } })
    }

    const rateCount = await LoanRate.countDocuments()
    if (rateCount === 0) {
      console.log('[DEBUG] Seeding default loan rates...')
      const defaultRates: any[] = []
      // Fetch actual bank IDs to ensure they match
      const dbBanks = await Bank.find({}).lean()
      const bankIds = dbBanks.length > 0 ? dbBanks.map(b => b.id) : ['1', '2', '3', '4', '5']

      const baseRates: Record<string, number> = {
        personal: 10.5,
        home: 8.5,
        business: 12.0,
        car: 8.75,
        lap: 9.0
      }

      bankIds.forEach((bankId, bIdx) => {
        LOAN_TYPES.forEach((loanType) => {
          defaultRates.push({
            bankId,
            loanType: loanType.id,
            interestRate: (baseRates[loanType.id] || 10) + (bIdx * 0.25),
            processingFee: 1.0
          })
        })
      })
      try {
        await LoanRate.insertMany(defaultRates, { ordered: false })
      } catch (err: any) {
        if (err.code !== 11000) console.error('[ERROR] LoanRate seeding failed:', err)
      }
    }

    // 5. Seed Eligibility Rule Data
    const ruleCount = await EligibilityRule.countDocuments()
    if (ruleCount === 0) {
      console.log('[DEBUG] Seeding default eligibility rules...')
      try {
        await EligibilityRule.insertMany([
          { loanType: 'personal', minAge: 21, maxAge: 60, minIncome: 25000, minCibil: 700, maxLoanAmount: 5000000, processingTime: '48 Hours' },
          { loanType: 'home', minAge: 21, maxAge: 70, minIncome: 30000, minCibil: 720, maxLoanAmount: 100000000, processingTime: '10 Days' },
          { loanType: 'business', minAge: 25, maxAge: 65, minIncome: 50000, minCibil: 700, maxLoanAmount: 1000000, processingTime: '7 Days' },
          { loanType: 'car', minAge: 21, maxAge: 65, minIncome: 25000, minCibil: 680, maxLoanAmount: 5000000, processingTime: '24 Hours' },
          { loanType: 'lap', minAge: 25, maxAge: 70, minIncome: 40000, minCibil: 700, maxLoanAmount: 5000000, processingTime: '15 Days' },
        ], { ordered: false })
      } catch (err: any) {
        if (err.code !== 11000) console.error('[ERROR] EligibilityRule seeding failed:', err)
      }
    }

    // 6. Seed/Update Loan Content
    console.log('[DEBUG] Checking/Updating LoanContent...')
    const seedData = [
      {
        loanType: 'personal',
        overview: 'A Personal Loan is an unsecured loan that can be used for various purposes like medical emergencies, travel, wedding, or debt consolidation.',
        processingTime: '24-48 Hours',
        interestRates: '10.5% - 24%',
        maxLoanAmount: '₹50 Lakhs',
        tenureRange: '6-60 Months',
        keyBenefits: [
          'No collateral or security required',
          'Funds disbursed within 24-48 hours',
          'Flexible tenure up to 5 years',
          'Minimal documentation for salaried individuals'
        ],
        eligibilityCriteria: [
          'Age: 21-60 years',
          'Employment: Salaried / Self-Employed',
          'Minimum Monthly Income: ₹25,000',
          'Credit Score: 650 or above'
        ],
        requiredDocuments: [
          'ID Proof (PAN Card / Aadhaar)',
          'Address Proof (Utility Bill / Passport)',
          'Bank Statements (Last 6 Months)',
          'Salary Slips (Last 3 Months)',
          'Form 16 / ITR for last 2 years'
        ]
      },
      {
        loanType: 'home',
        overview: 'A Home Loan is a secured loan used to buy or build a residential property. The property acts as collateral until the loan is fully repaid.',
        processingTime: '7-15 Days',
        interestRates: '8.5% - 10.5%',
        maxLoanAmount: '₹10 Cr+',
        tenureRange: 'Up to 30 Years',
        keyBenefits: [
          'Attractive interest rates (starting 8.5%)',
          'Long flexible tenure up to 30 years',
          'Tax benefits on principal & interest',
          'Low processing fees on government schemes',
          'PMAY subsidy benefits available',
          'Simplified documentation process'
        ],
        eligibilityCriteria: [
          'Age: 21-70 years',
          'Employment: Salaried / Self-Employed',
          'Income: Min ₹30,000/month',
          'Credit Score: 700 or above preferred',
          'Residence: Indian Citizen / NRI'
        ],
        requiredDocuments: [
          'KYC (Aadhar/PAN/Voter ID)',
          'Income Proof (Salary Slips/ITR)',
          'Bank Statements (Last 6 Months)',
          'Property Documents (Sale Deed/Chain)',
          'NOC from Builder/Society'
        ]
      },
      {
        loanType: 'business',
        overview: 'A Business Loan provides capital for various business needs like expansion, inventory purchase, or meeting daily operational expenses.',
        processingTime: '7-15 Days',
        interestRates: '12% - 18%',
        maxLoanAmount: '₹1 Cr+',
        tenureRange: '1-5 Years',
        keyBenefits: [
          'Collateral-free loans up to ₹50 Lakhs',
          'Flexible repayment tenures up to 5 years',
          'Quick disbursement for verified businesses',
          'Helps in building business credit history',
          'Funds for working capital or expansion',
          'Simple and digital application process'
        ],
        eligibilityCriteria: [
          'Business Vintage: Min 2 years in operation',
          'Annual Turnover: ₹30 Lakhs or above',
          'Applicant Age: 25-65 years',
          'Profitability: Business must be profit-making',
          'Credit History: Good repayment record'
        ],
        requiredDocuments: [
          'KYC of Promoters (Aadhar/PAN)',
          'Business Registration Proof (GST/Udyam)',
          'Bank Statements (Last 12 Months)',
          'ITR & Audited Financials (Last 2 Years)',
          'Business Address Proof (Lease/Utility Bill)'
        ]
      },
      {
        loanType: 'car',
        overview: 'A Car Loan helps you purchase a new or used car with low-interest financing. Most car loans are secured by the vehicle itself.',
        processingTime: '24-48 Hours',
        interestRates: '8.75% - 11%',
        maxLoanAmount: '100% On-road',
        tenureRange: '1-7 Years',
        keyBenefits: [
          'Financing up to 100% on-road price',
          'Quick approval & doorstep service',
          'Flexible tenure up to 7-8 years',
          'Low down-payment options',
          'Attractive interest rates',
          'Schemes for both new and used cars'
        ],
        eligibilityCriteria: [
          'Age: 21-65 years',
          'Employment: Salaried / Business',
          'Min Yearly Income: ₹3 Lakhs+',
          'CIBIL Score: 680 or above',
          'Work Vintage: At least 1 year'
        ],
        requiredDocuments: [
          'KYC Documents (PAN/Aadhar)',
          'Income Proof (Salary/ITR)',
          'Bank Statements (Last 6 Months)',
          'Vehicle Proforma Invoice',
          'Passport Sized Photographs'
        ]
      },
      {
        loanType: 'lap',
        overview: 'Loan Against Property (LAP) is a multi-purpose loan where you mortgage your property to get low-interest financing.',
        processingTime: '10-15 Days',
        interestRates: '9% - 13.5%',
        maxLoanAmount: '₹50 Cr+',
        tenureRange: '1-20 Years',
        keyBenefits: [
          'Lower interest rates than personal loans',
          'High loan amounts (up to ₹50 Cr)',
          'Flexible repayment up to 15-20 years',
          'Use funds for business or personal needs',
          'Continue using the mortgaged property',
          'Simple and transparent process'
        ],
        eligibilityCriteria: [
          'Property Type: Residential / Commercial',
          'Age: 25-70 years',
          'Income: Documented income preferred',
          'Ownership: Clear property title required',
          'Work Status: Stable employment or business'
        ],
        requiredDocuments: [
          'KYC Documents (PAN/Aadhar)',
          'Previous 6 Months Bank Statements',
          'ITR & Form 16 for last 3 years',
          'Original Property Title Deeds',
          'Approved Building Plan & NOC'
        ]
      }
    ]

    for (const data of seedData) {
      const exists = await LoanContent.findOne({ loanType: data.loanType })
      if (!exists) {
        await LoanContent.create(data)
      } else if (!exists.maxLoanAmount || !exists.tenureRange) {
        // Migration: Update existing records missing the new fields
        console.log(`[DEBUG] Migrating LoanContent: ${data.loanType}`)
        await LoanContent.updateOne(
          { loanType: data.loanType },
          { $set: { maxLoanAmount: data.maxLoanAmount, tenureRange: data.tenureRange } }
        )
      }
    }
    console.log('[DEBUG] LoanContent check complete')

    // 7. Seed FAQs
    const faqCount = await Faq.countDocuments()
    if (faqCount === 0) {
      console.log('[DEBUG] Seeding default FAQs...')
      const defaultFaqs = [
        {
          category: 'Loan Application',
          question: 'How do I apply for a loan?',
          answer: 'You can apply for any loan by visiting our specific loan pages (Personal, Home, Business, etc.) and clicking on the "Apply Now" button. Alternatively, you can connect with a loan agent through our "Connect Agent" button for a guided process.',
          displayOrder: 0
        },
        {
          category: 'Loan Application',
          question: 'What documents are required for a personal loan?',
          answer: 'Typically, you need identity proof (PAN/Aadhar), address proof, and income proof (last 3-6 months salary slips or bank statements). Requirements may vary slightly between different banks.',
          displayOrder: 1
        },
        {
          category: 'Loan Application',
          question: 'How long does the approval process take?',
          answer: 'Approval times vary: Personal loans can be approved within 24-48 hours, while Home loans and Business loans may take 5-10 working days due to deeper verification.',
          displayOrder: 2
        },
        {
          category: 'Eligibility & CIBIL',
          question: 'What is the minimum CIBIL score required?',
          answer: 'Generally, a CIBIL score of 700 or above is considered good for loan approval. Scores above 750 often help you secure lower interest rates.',
          displayOrder: 3
        },
        {
          category: 'Eligibility & CIBIL',
          question: 'Can I get a loan with a low CIBIL score?',
          answer: 'Yes, but it might come with a higher interest rate or require additional collateral. Some lenders specialized in low-credit profiles, but we recommend improving your score before applying for large amounts.',
          displayOrder: 4
        },
        {
          category: 'Eligibility & CIBIL',
          question: 'Does Job Type affect my eligibility?',
          answer: 'Yes! Salaried employees often have easier approval paths for Personal Loans. For Business Loans, lenders focus heavily on your business vintage (years in operation) and GST filings.',
          displayOrder: 5
        },
        {
          category: 'Interest Rates & Fees',
          question: 'What determines my interest rate?',
          answer: 'Your interest rate is determined by the specific loan type, your credit score, monthly income, tenure, and current market conditions. "Home Loans" typically have the lowest rates as they are asset-backed.',
          displayOrder: 6
        },
        {
          category: 'Interest Rates & Fees',
          question: 'Are there any hidden charges?',
          answer: 'At LoanExpert, we advocate for transparency. Standard charges include processing fees (usually 0.5% to 2%), GST on fees, and sometimes documentation charges. Always check the "Total Payable" in our EMI calculator.',
          displayOrder: 7
        }
      ]

      await Faq.insertMany(defaultFaqs.map(f => ({
        ...f,
        id: randomUUID(),
        isActive: true
      })))
      console.log('[DEBUG] FAQs seeded successfully')
    }

    // 8. Seed FormConfigs
    const formConfigCount = await FormConfig.countDocuments()
    if (formConfigCount === 0) {
      console.log('[DEBUG] Seeding default form configs...')
      await FormConfig.insertMany([
        {
          formId: 'contact',
          fields: [
            {
              id: 'preferred_time',
              label: 'Preferred Call Time',
              type: 'select',
              placeholder: 'Select best time to call...',
              required: false,
              options: ['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)']
            },
            {
              id: 'alt_phone',
              label: 'Alternative Phone Number',
              type: 'tel',
              placeholder: 'Optional second number',
              required: false,
              options: []
            }
          ]
        },
        {
          formId: 'contact-agent',
          fields: [
            {
              id: 'monthly_income',
              label: 'Current Monthly Net Income (₹)',
              type: 'number',
              placeholder: 'e.g. 50000',
              required: true,
              options: []
            },
            {
              id: 'existing_emis',
              label: 'Existing Monthly EMIs (₹)',
              type: 'number',
              placeholder: 'Total monthly loan payments',
              required: false,
              options: []
            }
          ]
        }
      ])
      console.log('[DEBUG] FormConfigs seeded successfully')
    }
    isSeeded = true
  } catch (err) {
    console.error('[ERROR] Seeding failed:', err)
  }
}
