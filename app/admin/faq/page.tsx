'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, Trash2, Plus, X, HelpCircle, GripVertical } from 'lucide-react'

type Faq = {
  id: string
  question: string
  answer: string
  category: string
  displayOrder: number
  isActive: boolean
}

const FAQ_CATEGORIES = ['General', 'Loan Application', 'Eligibility & CIBIL', 'Interest Rates & Fees', 'Personal Loan', 'Home Loan', 'Business', 'Car Loan']

const emptyForm = {
  question: '',
  answer: '',
  category: 'General',
  isActive: true,
}

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')

  const fetchFaqs = async () => {
    const res = await fetch('/api/admin/faq', { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      setFaqs(data.faqs || [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchFaqs() }, [])

  const resetForm = () => {
    setForm({ ...emptyForm })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (faq: Faq) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive,
    })
    setEditingId(faq.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!form.question.trim() || !form.answer.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await fetch(`/api/admin/faq/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        })
      } else {
        await fetch('/api/admin/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        })
      }
      await fetchFaqs()
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return
    await fetch(`/api/admin/faq/${id}`, { method: 'DELETE', credentials: 'include' })
    await fetchFaqs()
  }

  const handleToggleActive = async (faq: Faq) => {
    await fetch(`/api/admin/faq/${faq.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...faq, isActive: !faq.isActive }),
    })
    await fetchFaqs()
  }

  const allCategories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))]
  const filtered = faqs.filter(f => filterCategory === 'All' || f.category === filterCategory)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">FAQ Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage frequently asked questions shown on the public FAQ page
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }} className="gap-2">
          <Plus className="w-4 h-4" />
          Add FAQ
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 mb-8 border-primary/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {editingId ? 'Edit FAQ' : 'New FAQ Entry'}
            </h2>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                {FAQ_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Question *</label>
              <Input
                placeholder="Enter the frequently asked question..."
                value={form.question}
                onChange={e => setForm({ ...form, question: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Answer *</label>
              <textarea
                value={form.answer}
                onChange={e => setForm({ ...form, answer: e.target.value })}
                placeholder="Enter the complete answer..."
                className="w-full border rounded-lg p-3 min-h-32 bg-background text-foreground border-input"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-input accent-primary"
              />
              <span className="text-sm font-medium text-foreground">Active (visible on public FAQ page)</span>
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update FAQ' : 'Add FAQ'}
            </Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading FAQs...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">No FAQs yet. Add one to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((faq, i) => (
              <div
                key={faq.id}
                className={`p-5 flex gap-4 ${!faq.isActive ? 'opacity-50' : ''} hover:bg-muted/30`}
              >
                <div className="flex items-start pt-1 text-muted-foreground">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {faq.category}
                        </span>
                        {!faq.isActive && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-foreground leading-snug">{faq.question}</p>
                      <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleActive(faq)}
                        title={faq.isActive ? 'Hide' : 'Show'}
                        className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                          faq.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950 dark:text-green-400'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {faq.isActive ? 'Active' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => handleEdit(faq)}
                        className="p-1.5 rounded hover:bg-primary/10 transition-colors text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-4 text-sm text-muted-foreground">
        {filtered.length} FAQ{filtered.length !== 1 ? 's' : ''} •{' '}
        {faqs.filter(f => f.isActive).length} active
      </div>
    </div>
  )
}
