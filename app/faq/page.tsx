'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Input } from '@/components/ui/input'
import { Search, Plus, Minus } from 'lucide-react'

const STATIC_FAQS = [
  {
    category: 'Loan Application',
    questions: [
      {
        q: 'How do I apply for a loan?',
        a: 'You can apply for any loan by visiting our specific loan pages (Personal, Home, Business, etc.) and clicking on the "Apply Now" button. Alternatively, you can connect with a loan agent through our "Connect Agent" button for a guided process.'
      },
      {
        q: 'What documents are required for a personal loan?',
        a: 'Typically, you need identity proof (PAN/Aadhar), address proof, and income proof (last 3-6 months salary slips or bank statements). Requirements may vary slightly between different banks.'
      },
      {
        q: 'How long does the approval process take?',
        a: 'Approval times vary: Personal loans can be approved within 24-48 hours, while Home loans and Business loans may take 5-10 working days due to deeper verification.'
      }
    ]
  },
  {
    category: 'Eligibility & CIBIL',
    questions: [
      {
        q: 'What is the minimum CIBIL score required?',
        a: 'Generally, a CIBIL score of 700 or above is considered good for loan approval. Scores above 750 often help you secure lower interest rates.'
      },
      {
        q: 'Can I get a loan with a low CIBIL score?',
        a: 'Yes, but it might come with a higher interest rate or require additional collateral. Some lenders specialized in low-credit profiles, but we recommend improving your score before applying for large amounts.'
      },
      {
        q: 'Does Job Type affect my eligibility?',
        a: 'Yes! Salaried employees often have easier approval paths for Personal Loans. For Business Loans, lenders focus heavily on your business vintage (years in operation) and GST filings.'
      }
    ]
  },
  {
    category: 'Interest Rates & Fees',
    questions: [
      {
        q: 'What determines my interest rate?',
        a: 'Your interest rate is determined by the specific loan type, your credit score, monthly income, tenure, and current market conditions. "Home Loans" typically have the lowest rates as they are asset-backed.'
      },
      {
        q: 'Are there any hidden charges?',
        a: 'At LoanExpert, we advocate for transparency. Standard charges include processing fees (usually 0.5% to 2%), GST on fees, and sometimes documentation charges. Always check the "Total Payable" in our EMI calculator.'
      }
    ]
  }
]

type FaqEntry = { id: string; question: string; answer: string; category: string }

function groupByCategory(faqs: FaqEntry[]) {
  const map: Record<string, { q: string; a: string }[]> = {}
  for (const f of faqs) {
    if (!map[f.category]) map[f.category] = []
    map[f.category].push({ q: f.question, a: f.answer })
  }
  return Object.entries(map).map(([category, questions]) => ({ category, questions }))
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openIndex, setOpenIndex] = useState<string | null>(null)
  const [faqGroups, setFaqGroups] = useState(STATIC_FAQS)

  useEffect(() => {
    fetch('/api/public/faq')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.faqs?.length > 0) {
          setFaqGroups(groupByCategory(data.faqs))
        }
      })
      .catch(() => {})
  }, [])

  const filteredFaqs = faqGroups.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg">Everything you need to know about loans, eligibility, and interest rates.</p>
        </div>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search your question..."
            className="pl-12 h-14 text-lg rounded-2xl border-border shadow-sm focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-12">
          {filteredFaqs.map((cat, catIdx) => (
            <div key={catIdx} className="space-y-6">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="w-8 h-1 bg-primary rounded-full" />
                {cat.category}
              </h2>
              <div className="space-y-4">
                {cat.questions.map((faq, qIdx) => {
                  const id = `${catIdx}-${qIdx}`
                  const isOpen = openIndex === id
                  return (
                    <div
                      key={id}
                      className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'border-primary ring-1 ring-primary/10 bg-primary/5' : 'border-border bg-background hover:bg-muted/30'}`}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : id)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="font-bold text-foreground pr-4">{faq.q}</span>
                        {isOpen ? (
                          <Minus className="w-5 h-5 text-primary shrink-0" />
                        ) : (
                          <Plus className="w-5 h-5 text-muted-foreground shrink-0" />
                        )}
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                        <div className="p-5 pt-0 text-muted-foreground leading-relaxed">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground">No questions found matching your search. Try a different term or contact us.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
