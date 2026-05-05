import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import {
  Bank,
  LoanRate,
  EligibilityRule,
  Lead,
  LoanContent,
  CalculatorConfig,
  SiteSettings,
  BlogPost,
  Faq,
} from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  // Fetch documents
  let [
    banksDocs,
    ratesDocs,
    eligibilityDocs,
    leadsDocs,
    contentDocs,
    calcConfigDocs,
    siteSettingsDoc,
    blogCount,
    faqCount,
  ] = await Promise.all([
    Bank.find({}).sort({ createdAt: -1 }).lean(),
    LoanRate.find({}).lean(),
    EligibilityRule.find({}).lean(),
    Lead.find({}).sort({ appliedDate: -1 }).lean(),
    LoanContent.find({}).lean(),
    CalculatorConfig.find({}).lean(),
    SiteSettings.findOne({ key: 'main' }).lean(),
    BlogPost.countDocuments({}),
    Faq.countDocuments({}),
  ])

  // CRITICAL: If content is missing, the DB probably skipped seeding it.
  // Re-run it immediately and re-fetch if empty.
  if (contentDocs.length === 0) {
    console.log('[DEBUG] Missing LoanContent, initiating forced seed...');
    // We already call ensureSeedData at top, but we'll try to re-fetch once
    await new Promise(r => setTimeout(r, 100)); // Brief pause
    contentDocs = await LoanContent.find({}).lean();
  }


  const banks = banksDocs.map(b => ({
    id: b.id,
    name: b.name,
    logo: b.logo,
    contactPerson: b.contactPerson,
  }))

  const rates = ratesDocs.map(r => ({
    bankId: r.bankId,
    loanType: r.loanType,
    interestRate: r.interestRate,
    processingFee: r.processingFee,
  }))

  const eligibilityRules: Record<string, any> = {}
  for (const r of eligibilityDocs) {
    eligibilityRules[r.loanType] = {
      loanType: r.loanType,
      minAge: r.minAge,
      maxAge: r.maxAge,
      minIncome: r.minIncome,
      minCibil: r.minCibil,
      maxLoanAmount: r.maxLoanAmount,
      processingTime: r.processingTime,
    }
  }

  const leads = leadsDocs.map(l => ({
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    city: l.city,
    loanType: l.loanType,
    loanAmount: l.loanAmount,
    income: l.income,
    employmentType: l.employmentType,
    cibilScore: l.cibilScore,
    appliedDate: l.appliedDate,
    status: l.status,
    selectedBank: l.selectedBank,
    notes: l.notes,
    contactedDate: l.contactedDate,
  }))

  const loanContents: Record<string, any> = {}
  for (const c of contentDocs) {
    loanContents[c.loanType] = {
      loanType: c.loanType,
      overview: c.overview,
      keyBenefits: c.keyBenefits,
      eligibilityCriteria: c.eligibilityCriteria,
      requiredDocuments: c.requiredDocuments,
      processingTime: c.processingTime,
      interestRates: c.interestRates || '',
      maxLoanAmount: c.maxLoanAmount || '',
      tenureRange: c.tenureRange || '',
      schemes: c.schemes || [],
      lastUpdated: c.lastUpdated || '',
      updatedBy: c.updatedBy || '',
    }
  }

  // Calculator configurations (keyed by calculatorType)
  const calculatorConfigs: Record<string, any> = {}
  for (const d of calcConfigDocs) {
    calculatorConfigs[(d as any).calculatorType] = (d as any).config
  }

  // Site settings (singleton)
  const siteSettings = siteSettingsDoc
    ? {
        whatsappNumber: (siteSettingsDoc as any).whatsappNumber || '',
        contactPhone: (siteSettingsDoc as any).contactPhone || '',
        contactEmail: (siteSettingsDoc as any).contactEmail || '',
        siteName: (siteSettingsDoc as any).siteName || 'LoanExpert',
      }
    : null

  // Counts for the dashboard
  const counts = {
    banks: banks.length,
    rates: rates.length,
    eligibilityRules: Object.keys(eligibilityRules).length,
    leads: leads.length,
    loanContents: Object.keys(loanContents).length,
    calculators: calcConfigDocs.length,
    blogPosts: blogCount,
    faqs: faqCount,
  }

  return NextResponse.json({
    banks,
    rates,
    eligibilityRules,
    leads,
    loanContents,
    calculatorConfigs,
    siteSettings,
    counts,
  })
}
