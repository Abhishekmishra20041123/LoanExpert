'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { type LoanContent } from '@/lib/storage'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { useLoanData } from '@/hooks/useLoanData'
import { LOAN_TYPES } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function LoanContentPage() {
  const router = useRouter()
  const { isAuthenticated, loading, adminEmail } = useAdminAuth()
  const { loanContents, updateLoanContent } = useLoanData()
  const [selectedLoan, setSelectedLoan] = useState(LOAN_TYPES[0].id)
  const [content, setContent] = useState<LoanContent | null>(null)
  const [formData, setFormData] = useState<Partial<LoanContent>>({})
  const [benefits, setBenefits] = useState<string[]>([])
  const [criteria, setCriteria] = useState<string[]>([])
  const [documents, setDocuments] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  // Sync state when data loads or selection changes
  useEffect(() => {
    const loanContent = loanContents[selectedLoan]
    if (loanContent) {
      setFormData({
        overview: loanContent.overview || '',
        processingTime: loanContent.processingTime || '',
        interestRates: loanContent.interestRates || '',
        maxLoanAmount: loanContent.maxLoanAmount || '',
        tenureRange: loanContent.tenureRange || '',
      })
      setBenefits(loanContent.keyBenefits || [])
      setCriteria(loanContent.eligibilityCriteria || [])
      setDocuments(loanContent.requiredDocuments || [])
    }
  }, [selectedLoan, loanContents])

  const handleSave = () => {
    updateLoanContent(selectedLoan, {
      ...formData,
      keyBenefits: benefits,
      eligibilityCriteria: criteria,
      requiredDocuments: documents,
    } as LoanContent)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const updateListItem = (list: string[], setList: (l: string[]) => void, index: number, val: string) => {
    const newList = [...list]
    newList[index] = val
    setList(newList)
  }


  const addBenefit = (benefit: string) => {
    if (benefit.trim()) {
      setBenefits([...benefits, benefit])
    }
  }

  const addCriteria = (crit: string) => {
    if (crit.trim()) {
      setCriteria([...criteria, crit])
    }
  }

  const addDocument = (doc: string) => {
    if (doc.trim()) {
      setDocuments([...documents, doc])
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Manage Loan Content</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Loan Types */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="font-bold mb-4">Loan Types</h2>
              <div className="space-y-2">
                {LOAN_TYPES.map(loanType => (
                  <button
                    key={loanType.id}
                    onClick={() => setSelectedLoan(loanType.id)}
                    className={`w-full text-left px-4 py-2 rounded transition-colors ${
                      selectedLoan === loanType.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {loanType.name}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content Editor */}
          <div className="lg:col-span-3 space-y-6">
            {saved && (
              <Card className="p-4 bg-green-50 border-green-200 dark:bg-green-950">
                <p className="text-green-700 dark:text-green-200">✓ Content saved successfully!</p>
              </Card>
            )}

            {/* Overview */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Loan Overview</h3>
              <textarea
                value={formData.overview || ''}
                onChange={e => setFormData({ ...formData, overview: e.target.value })}
                className="w-full border rounded-lg p-3 min-h-32 bg-background text-foreground mb-4"
                placeholder="Describe this loan product in detail..."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-70">Max Loan Amount (Display)</label>
                  <Input 
                    value={formData.maxLoanAmount || ''} 
                    onChange={e => setFormData({ ...formData, maxLoanAmount: e.target.value })}
                    placeholder="e.g. ₹50 Lakhs" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-70">Tenure Range (Display)</label>
                  <Input 
                    value={formData.tenureRange || ''} 
                    onChange={e => setFormData({ ...formData, tenureRange: e.target.value })}
                    placeholder="e.g. 12-84 Months" 
                  />
                </div>
              </div>
            </Card>

            {/* Key Benefits */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Key Benefits</h3>
              <div className="space-y-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted p-2 rounded">
                    <Input 
                      value={benefit} 
                      onChange={e => updateListItem(benefits, setBenefits, i, e.target.value)}
                      className="flex-1 bg-background h-9"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBenefits(benefits.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    id="benefit-input"
                    placeholder="Add a benefit..."
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        addBenefit((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const input = document.getElementById('benefit-input') as HTMLInputElement
                      addBenefit(input.value)
                      input.value = ''
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Eligibility Criteria */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Eligibility Criteria</h3>
              <div className="space-y-3">
                {criteria.map((crit, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted p-2 rounded">
                    <Input 
                      value={crit} 
                      onChange={e => updateListItem(criteria, setCriteria, i, e.target.value)}
                      className="flex-1 bg-background h-9"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCriteria(criteria.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    id="criteria-input"
                    placeholder="Add eligibility criteria..."
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        addCriteria((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const input = document.getElementById('criteria-input') as HTMLInputElement
                      addCriteria(input.value)
                      input.value = ''
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Required Documents */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Required Documents</h3>
              <div className="space-y-3">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted p-2 rounded">
                    <Input 
                      value={doc} 
                      onChange={e => updateListItem(documents, setDocuments, i, e.target.value)}
                      className="flex-1 bg-background h-9"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDocuments(documents.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    id="document-input"
                    placeholder="Add required document..."
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        addDocument((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const input = document.getElementById('document-input') as HTMLInputElement
                      addDocument(input.value)
                      input.value = ''
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Processing Time & Interest Rates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Processing Time</h3>
                <Input
                  value={formData.processingTime || ''}
                  onChange={e => setFormData({ ...formData, processingTime: e.target.value })}
                  placeholder="e.g., 3-5 Days"
                />
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Interest Rates</h3>
                <Input
                  value={formData.interestRates || ''}
                  onChange={e => setFormData({ ...formData, interestRates: e.target.value })}
                  placeholder="e.g., 9.5% - 11%"
                />
              </Card>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button size="lg" onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Content
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
