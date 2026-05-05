'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Phone, Mail, Clock, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type CustomField = {
  id: string
  label: string
  type: string
  placeholder: string
  required: boolean
  options: string[]
}

export default function ContactPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({ name: '', email: '', subject: '', message: '' })
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [calcData, setCalcData] = useState<{ 
    isBundle?: boolean, 
    bundle?: any[], 
    loanType: string, 
    loanAmount: number, 
    tenure?: string, 
    rate?: string, 
    emi?: string, 
    isEligible?: string,
    jobType?: string,
    existingEmi?: string,
    cibil?: string,
    income?: string
  } | null>(null)

  useEffect(() => {
    // Parse URL parameters from calculator if any
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const type = params.get('type')
      if (type === 'bundle') {
        try {
          const bundleStr = sessionStorage.getItem('loanexpert_enquiry_bundle')
          if (bundleStr) {
            const bundleList = JSON.parse(bundleStr)
            setCalcData({ isBundle: true, bundle: bundleList, loanType: 'Multiple', loanAmount: bundleList[0]?.amount || 0 })
            setFormData(prev => ({ ...prev, subject: 'Enquiry about Multiple Loan Scenarios' }))
          }
        } catch(e) {}
      } else if (type) {
        const amountStr = params.get('amount') || '0'
        const tenure = params.get('tenure') || 'N/A'
        const rate = params.get('rate') || 'N/A'
        const emi = params.get('emi') || 'N/A'
        const isEligible = params.get('isEligible')
        const jobType = params.get('jobType')
        const existingEmi = params.get('existingEmi')
        const cibil = params.get('cibil')
        const income = params.get('income')
        
        const typeFormatted = type.charAt(0).toUpperCase() + type.slice(1)
        
        setFormData(prev => ({
          ...prev,
          subject: `Enquiry about ${typeFormatted} Loan`
        }))
        
        setCalcData({ 
          loanType: type, 
          loanAmount: Number(amountStr) || 0, 
          tenure, 
          rate, 
          emi, 
          isEligible: isEligible || undefined,
          jobType: jobType || undefined,
          existingEmi: existingEmi || undefined,
          cibil: cibil || undefined,
          income: income || undefined
        })
      }
    }
    fetch('/api/public/site-settings')
      .then(r => r.json())
      .then(data => setSettings(data.settings))
      .catch(() => {})
      .finally(() => setLoading(false))

    // Fetch config for unified contact form
    fetch('/api/public/form-config?formId=contact')
      .then(r => r.json())
      .then(data => setCustomFields(data.fields || []))
      .catch(() => {})
  }, [])

  const phone = settings?.contactPhone || '+91 99999 99999'
  const email = settings?.contactEmail || 'loans@loanexpert.com'
  const content = settings?.siteContent

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return
    setSubmitting(true)

    const customData = customFields
      .filter(f => formData[f.id])
      .map(f => `${f.label}: ${formData[f.id]}`)
      .join('\n')

    // Find if any custom field is for phone
    const phoneFieldId = customFields.find(f => f.label.toLowerCase().includes('phone') || f.label.toLowerCase().includes('mobile'))?.id
    const userPhone = phoneFieldId && formData[phoneFieldId] ? formData[phoneFieldId] : 'Not provided'

    const calcNotes = calcData 
      ? calcData.isBundle && calcData.bundle
        ? `\n\n--- Attached Calculator Scenarios (${calcData.bundle.length}) ---\n` + calcData.bundle.map((b: any, i:number) => `${i+1}. ${b.bankName || 'Custom'}: Amount ₹${Number(b.amount).toLocaleString('en-IN')}, Tenure ${b.tenure} ${b.tenureUnit}, Rate ${b.rate}%, EMI ₹${Number(b.emi).toLocaleString('en-IN')}`).join('\n')
        : `\n\n--- Attached Calculation Details ---\n` + 
          `Type: ${calcData.loanType.toUpperCase()}\n` +
          `Amount: ₹${calcData.loanAmount.toLocaleString('en-IN')}\n` +
          `Tenure: ${calcData.tenure} ${calcData.loanType === 'Multiple' ? '' : 'months'}\n` +
          `Rate: ${calcData.rate}%\n` +
          (calcData.jobType ? `Employment: ${calcData.jobType}\n` : '') +
          (calcData.existingEmi ? `Existing EMI: ₹${Number(calcData.existingEmi).toLocaleString('en-IN')}\n` : '') +
          (calcData.cibil ? `CIBIL Score: ${calcData.cibil}\n` : '') +
          `EMI: ${calcData.emi && calcData.emi !== 'N/A' ? `₹${Number(calcData.emi).toLocaleString('en-IN')}` : 'N/A'}\n` +
          (calcData.isEligible ? `Eligibility Status: ${calcData.isEligible === 'true' ? 'Eligible' : 'Not Eligible'}` : '')
      : ''

    try {
      await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: userPhone,
          loanType: calcData?.loanType || 'general',
          loanAmount: calcData?.loanAmount || 0,
          income: calcData?.income ? Number(calcData.income) : 0,
          employmentType: calcData?.jobType || 'salaried',
          cibilScore: calcData?.cibil ? Number(calcData.cibil) : undefined,
          notes: `[Unified Contact] Subject: ${formData.subject}\nMessage: ${formData.message}${calcNotes}${customData ? '\n\n--- Custom Fields ---\n' + customData : ''}`,
        }),
      })
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  const renderCustomField = (field: CustomField) => {
    const value = formData[field.id] || ''
    const onChange = (val: string) => setFormData(prev => ({ ...prev, [field.id]: val }))

    return (
      <div key={field.id} className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-1">
          {field.label}
          {field.required && <span className="text-destructive">*</span>}
        </label>
        {field.type === 'textarea' ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={3}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
            required={field.required}
          />
        ) : field.type === 'select' ? (
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
            required={field.required}
          >
            <option value="">{field.placeholder || 'Select...'}</option>
            {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={field.type || 'text'}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
            required={field.required}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-accent/5 to-transparent -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {content?.contactBadge || 'Agent Online Now'}
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-foreground leading-[1.1]">
                {content?.contactTitle || 'Need Help?'} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {content?.contactTitleHighlight || 'Connect Instantly.'}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg whitespace-pre-line">
                {content?.contactSubtitle || 'Get expert guidance for your loan application. Our agents are ready to help you find the best rates in minutes.'}
              </p>

              {/* Direct Connect Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="w-full sm:w-auto h-16 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold gap-3 shadow-lg shadow-primary/20">
                  <a href={`mailto:${email}`}>
                    <Mail className="w-6 h-6" />
                    Email via Gmail
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-16 px-8 rounded-2xl border-2 text-lg font-bold gap-3">
                  <a href={`tel:${phone.replace(/\D/g, '')}`}>
                    <Phone className="w-6 h-6" />
                    Call Expert
                  </a>
                </Button>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[2.5rem] blur-3xl opacity-50 -z-10 animate-pulse" />
              <Card className="p-8 border-primary/20 bg-background/80 backdrop-blur-xl rounded-[2rem] shadow-2xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Fast Response</h3>
                    <p className="text-muted-foreground underline decoration-primary/30 underline-offset-4">Typical reply in &lt; 24 hrs</p>
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  {[
                    'Instant Eligibility Check',
                    'Multiple Bank Comparisons',
                    'Low Interest Rate Guarantee',
                    'Direct Handholding for Documentation'
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-4">Quick Inquiry</h2>
              <p className="text-muted-foreground">Prefer to be contacted? Fill out this fast form and we&apos;ll get back to you.</p>
            </div>

            {submitted ? (
              <Card className="p-12 text-center border-green-500/30 bg-green-500/5 rounded-3xl">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Request Received!</h3>
                <p className="text-muted-foreground mb-8">Our expert loan agent will contact you shortly on your registered email/phone.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline">Send Another Request</Button>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Short description of your request"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                  />
                </div>

                <div className="space-y-4">
                  {calcData && (calcData.isBundle || calcData.loanAmount > 0) && (
                    <Card className="p-4 border-primary/20 bg-primary/5 relative overflow-hidden shadow-sm">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
                      <div className="flex items-center justify-between mb-3 text-primary font-bold relative z-10">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> 
                          {calcData.isBundle ? `Attached (${calcData.bundle?.length}) Scenarios` : 'Attached Calculation Scenario'}
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setCalcData(null)}
                          className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors bg-background/50 px-2 py-1 rounded-md border border-border/50"
                          title="Remove Attachment"
                        >
                          Remove
                        </button>
                      </div>
                      
                      {calcData.isBundle && calcData.bundle ? (
                        <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2">
                          {calcData.bundle.map((b: any, i: number) => (
                            <div key={i} className="flex justify-between items-center text-xs bg-background/50 p-2 rounded-lg border border-border/30">
                              <div>
                                <span className="font-bold">{b.bankName || 'Custom'}</span> - ₹{Number(b.amount).toLocaleString('en-IN')} 
                                <span className="text-muted-foreground ml-1 hidden sm:inline">({b.tenure} {b.tenureUnit}) @ {b.rate}%</span>
                              </div>
                              <div className="font-black text-primary">₹{Number(b.emi).toLocaleString('en-IN')}/mo</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Type</p>
                            <p className="font-bold">{calcData.loanType.charAt(0).toUpperCase() + calcData.loanType.slice(1)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Amount</p>
                            <p className="font-bold">₹{calcData.loanAmount.toLocaleString('en-IN')}</p>
                          </div>
                          {calcData.tenure && calcData.tenure !== 'N/A' && (
                            <div>
                              <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Tenure</p>
                              <p className="font-bold">{calcData.tenure} MOS</p>
                            </div>
                          )}
                          {calcData.jobType && (
                            <div>
                               <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Employment</p>
                               <p className="font-bold capitalize">{calcData.jobType}</p>
                            </div>
                          )}
                          {calcData.existingEmi && (
                            <div>
                               <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Exist. EMI</p>
                               <p className="font-bold">₹{Number(calcData.existingEmi).toLocaleString('en-IN')}</p>
                            </div>
                          )}
                          {calcData.cibil && (
                            <div>
                               <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">CIBIL</p>
                               <p className="font-bold">{calcData.cibil}</p>
                            </div>
                          )}
                          {calcData.emi && calcData.emi !== 'N/A' && (
                            <div>
                              <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Est. EMI</p>
                              <p className="font-bold text-primary">₹{Number(calcData.emi).toLocaleString('en-IN')}</p>
                            </div>
                          )}
                          {calcData.isEligible && (
                            <div>
                               <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Status</p>
                               <p className={`font-bold ${calcData.isEligible === 'true' ? 'text-green-500' : 'text-red-500'}`}>{calcData.isEligible === 'true' ? 'Eligible' : 'Not Eligible'}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Message / Requirement</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Type your specific questions or requirements here..."
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Dynamic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customFields.map(field => renderCustomField(field))}
                </div>

                <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-bold group" disabled={submitting}>
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...</>
                  ) : (
                    <><span className="mr-2">Send Inquiry</span> <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-8 border-none bg-muted/50 rounded-3xl">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Email Us</p>
                    <a href={`mailto:${email}`} className="text-lg font-bold hover:text-primary transition-colors">{email}</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shrink-0 shadow-sm">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Availability</p>
                    <p className="text-lg font-bold">Mon - Sat: 9 AM - 7 PM</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-none bg-primary/5 rounded-3xl border-l-4 border-l-primary">
              <h3 className="font-bold text-primary mb-2 italic">Pro Tip</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect via email for a detailed review of your application. You can attach your documents for an initial eligibility review.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
