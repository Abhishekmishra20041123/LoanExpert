import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'

// We keep `id` as an application-level string to match your existing frontend types.
// (Mongo adds `_id` automatically, but rates/leads reference the string `id` field.)

const BankSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    logo: { type: String, default: '' },
    contactPerson: { type: String, default: '' },
  },
  { timestamps: true }
)

const LoanRateSchema = new Schema(
  {
    bankId: { type: String, required: true, index: true },
    loanType: { type: String, required: true, index: true },
    interestRate: { type: Number, required: true },
    processingFee: { type: Number, required: true },
  },
  { timestamps: true }
)

LoanRateSchema.index({ bankId: 1, loanType: 1 }, { unique: true })

const EligibilityRuleSchema = new Schema(
  {
    loanType: { type: String, required: true, unique: true, index: true },
    minAge: { type: Number, required: true },
    maxAge: { type: Number, required: true },
    minIncome: { type: Number, required: true },
    minCibil: { type: Number, required: true },
    maxLoanAmount: { type: Number, required: true },
    processingTime: { type: String, default: '' },
  },
  { timestamps: true }
)

const LoanContentSchema = new Schema(
  {
    loanType: { type: String, required: true, unique: true, index: true },
    overview: { type: String, default: '' },
    keyBenefits: { type: [String], default: [] },
    eligibilityCriteria: { type: [String], default: [] },
    requiredDocuments: { type: [String], default: [] },
    processingTime: { type: String, default: '' },
    interestRates: { type: String, default: '' },
    maxLoanAmount: { type: String, default: '' },
    tenureRange: { type: String, default: '' },
    schemes: {
      type: [
        {
          name: { type: String, required: true },
          detail: { type: String, required: true },
        },
      ],
      default: [],
    },
    lastUpdated: { type: String, default: '' },
    updatedBy: { type: String, default: '' },
  },
  { timestamps: true }
)

const LeadSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, default: '' },
    loanType: { type: String, required: true },
    loanAmount: { type: Number, required: true },
    income: { type: Number, default: 0 },
    employmentType: { type: String, default: '' },
    cibilScore: { type: Number, default: undefined },
    appliedDate: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['new', 'contacted', 'approved', 'rejected', 'closed'],
    },
    selectedBank: { type: String, default: undefined },
    notes: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    contactedDate: { type: String, default: undefined },
  },
  { timestamps: true }
)

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, default: 'Admin' },
    phone: { type: String, default: '' },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
)

const AdminSessionSchema = new Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    adminEmail: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
)

// Calculator configs — flexible JSONB-like config per calculator type
const CalculatorConfigSchema = new Schema(
  {
    calculatorType: { type: String, required: true, unique: true, index: true },
    config: { type: Schema.Types.Mixed, default: {} },
    updatedBy: { type: String, default: '' },
  },
  { timestamps: true }
)

// Site-wide settings (singleton)
const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true, default: 'main' },
    whatsappNumber: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    siteName: { type: String, default: 'LoanExpert' },
    siteContent: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

// Blog posts
const BlogPostSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    category: { type: String, default: 'General' },
    author: { type: String, default: 'Admin' },
    imageUrl: { type: String, default: '' },
    readTime: { type: String, default: '5 min read' },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: String, default: '' },
  },
  { timestamps: true }
)

// FAQ entries
const FaqSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Agent/Broker profile — singleton for the portfolio/about page
const AgentProfileSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true, default: 'main' },
    fullName: { type: String, default: '' },
    title: { type: String, default: 'Loan Expert' },
    photoUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    experience: { type: String, default: '' },
    achievements: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    specializations: { type: [String], default: [] },
    // Social media handles
    linkedinUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    // Contact (can differ from site settings)
    personalPhone: { type: String, default: '' },
    personalEmail: { type: String, default: '' },
    location: { type: String, default: '' },
  },
  { timestamps: true }
)

// Customer (public user) accounts
const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
)

// Customer sessions
const CustomerSessionSchema = new Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    customerEmail: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
)

// Admin-configurable custom form fields
const FormConfigSchema = new Schema(
  {
    formId: { type: String, required: true, unique: true, index: true }, // e.g. 'contact', 'contact-agent'
    fields: {
      type: [
        {
          id: { type: String, required: true },
          label: { type: String, required: true },
          type: { type: String, default: 'text' }, // text, number, email, tel, select, textarea
          placeholder: { type: String, default: '' },
          required: { type: Boolean, default: false },
          options: { type: [String], default: [] }, // for select type
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
)

export type BankDoc = InferSchemaType<typeof BankSchema>
export type LoanRateDoc = InferSchemaType<typeof LoanRateSchema>
export type EligibilityRuleDoc = InferSchemaType<typeof EligibilityRuleSchema>
export type LoanContentDoc = InferSchemaType<typeof LoanContentSchema>
export type LeadDoc = InferSchemaType<typeof LeadSchema>
export type AdminUserDoc = InferSchemaType<typeof AdminUserSchema>
export type AdminSessionDoc = InferSchemaType<typeof AdminSessionSchema>
export type CalculatorConfigDoc = InferSchemaType<typeof CalculatorConfigSchema>
export type SiteSettingsDoc = InferSchemaType<typeof SiteSettingsSchema>
export type BlogPostDoc = InferSchemaType<typeof BlogPostSchema>
export type FaqDoc = InferSchemaType<typeof FaqSchema>
export type AgentProfileDoc = InferSchemaType<typeof AgentProfileSchema>
export type CustomerDoc = InferSchemaType<typeof CustomerSchema>
export type CustomerSessionDoc = InferSchemaType<typeof CustomerSessionSchema>
export type FormConfigDoc = InferSchemaType<typeof FormConfigSchema>

export const Bank: Model<BankDoc> = (mongoose.models.Bank as Model<BankDoc>) || mongoose.model('Bank', BankSchema)
export const LoanRate: Model<LoanRateDoc> =
  (mongoose.models.LoanRate as Model<LoanRateDoc>) || mongoose.model('LoanRate', LoanRateSchema)
export const EligibilityRule: Model<EligibilityRuleDoc> =
  (mongoose.models.EligibilityRule as Model<EligibilityRuleDoc>) || mongoose.model('EligibilityRule', EligibilityRuleSchema)
export const LoanContent: Model<LoanContentDoc> =
  (mongoose.models.LoanContent as Model<LoanContentDoc>) || mongoose.model('LoanContent', LoanContentSchema)
export const Lead: Model<LeadDoc> = (mongoose.models.Lead as Model<LeadDoc>) || mongoose.model('Lead', LeadSchema)
export const AdminUser: Model<AdminUserDoc> =
  (mongoose.models.AdminUser as Model<AdminUserDoc>) || mongoose.model('AdminUser', AdminUserSchema)
export const AdminSession: Model<AdminSessionDoc> =
  (mongoose.models.AdminSession as Model<AdminSessionDoc>) || mongoose.model('AdminSession', AdminSessionSchema)
export const CalculatorConfig: Model<CalculatorConfigDoc> =
  (mongoose.models.CalculatorConfig as Model<CalculatorConfigDoc>) || mongoose.model('CalculatorConfig', CalculatorConfigSchema)
export const SiteSettings: Model<SiteSettingsDoc> =
  (mongoose.models.SiteSettings as Model<SiteSettingsDoc>) || mongoose.model('SiteSettings', SiteSettingsSchema)
export const BlogPost: Model<BlogPostDoc> =
  (mongoose.models.BlogPost as Model<BlogPostDoc>) || mongoose.model('BlogPost', BlogPostSchema)
export const Faq: Model<FaqDoc> = (mongoose.models.Faq as Model<FaqDoc>) || mongoose.model('Faq', FaqSchema)
export const AgentProfile: Model<AgentProfileDoc> =
  (mongoose.models.AgentProfile as Model<AgentProfileDoc>) || mongoose.model('AgentProfile', AgentProfileSchema)
export const Customer: Model<CustomerDoc> =
  (mongoose.models.Customer as Model<CustomerDoc>) || mongoose.model('Customer', CustomerSchema)
export const CustomerSession: Model<CustomerSessionDoc> =
  (mongoose.models.CustomerSession as Model<CustomerSessionDoc>) || mongoose.model('CustomerSession', CustomerSessionSchema)
export const FormConfig: Model<FormConfigDoc> =
  (mongoose.models.FormConfig as Model<FormConfigDoc>) || mongoose.model('FormConfig', FormConfigSchema)


