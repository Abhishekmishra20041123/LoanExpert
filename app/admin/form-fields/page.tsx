'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Save, Check, Loader2, Plus, X, Trash2, GripVertical
} from 'lucide-react'

type FormField = {
  id: string
  label: string
  type: string
  placeholder: string
  required: boolean
  options: string[]
}

type FormConfig = {
  formId: string
  fields: FormField[]
}

const FORMS = [
  { id: 'contact', label: 'Unified Contact Form (/contact)' }
]

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'select', label: 'Dropdown' },
  { value: 'textarea', label: 'Text Area' },
]

export default function AdminFormFieldsPage() {
  const [configs, setConfigs] = useState<Record<string, FormField[]>>({})
  const [selectedForm, setSelectedForm] = useState(FORMS[0].id)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/form-config', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const map: Record<string, FormField[]> = {}
        for (const c of data.configs || []) {
          map[c.formId] = c.fields || []
        }
        setConfigs(map)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const fields = configs[selectedForm] || []

  const setFields = (newFields: FormField[]) => {
    setConfigs(prev => ({ ...prev, [selectedForm]: newFields }))
  }

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text',
      placeholder: '',
      required: false,
      options: [],
    }
    setFields([...fields, newField])
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    setFields(fields.map((f, i) => i === index ? { ...f, ...updates } : f))
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const addOption = (fieldIndex: number) => {
    const field = fields[fieldIndex]
    updateField(fieldIndex, { options: [...field.options, ''] })
  }

  const updateOption = (fieldIndex: number, optIndex: number, value: string) => {
    const field = fields[fieldIndex]
    updateField(fieldIndex, {
      options: field.options.map((o, i) => i === optIndex ? value : o),
    })
  }

  const removeOption = (fieldIndex: number, optIndex: number) => {
    const field = fields[fieldIndex]
    updateField(fieldIndex, {
      options: field.options.filter((_, i) => i !== optIndex),
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/form-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ formId: selectedForm, fields }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Form Fields Manager</h1>
          <p className="text-muted-foreground mt-1">
            Add or remove input fields on your contact forms
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
          {saved ? (
            <><Check className="w-4 h-4" /> Saved!</>
          ) : saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="w-4 h-4" /> Save</>
          )}
        </Button>
      </div>

      {/* Form Context */}
      <div className="flex items-center gap-2 mb-8 px-4 py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl w-max">
        <span className="text-sm font-semibold">Currently Editing:</span>
        <span className="text-sm">Unified Contact Hub (/contact)</span>
      </div>

      {/* Fields List */}
      <div className="space-y-4 mb-6">
        {fields.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No custom fields added yet. The form uses its default fields.
            </p>
            <p className="text-sm text-muted-foreground">
              Click "Add Field" below to add extra input fields that customers will fill out.
            </p>
          </Card>
        ) : (
          fields.map((field, i) => (
            <Card key={field.id} className="p-5">
              <div className="flex items-start gap-3">
                <GripVertical className="w-5 h-5 text-muted-foreground mt-2 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Label *</label>
                      <Input
                        value={field.label}
                        onChange={e => updateField(i, { label: e.target.value })}
                        placeholder="e.g. Company Name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Type</label>
                      <select
                        value={field.type}
                        onChange={e => updateField(i, { type: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
                      >
                        {FIELD_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Placeholder</label>
                      <Input
                        value={field.placeholder}
                        onChange={e => updateField(i, { placeholder: e.target.value })}
                        placeholder="e.g. Enter company name"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={e => updateField(i, { required: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-foreground">Required field</span>
                    </label>
                  </div>

                  {/* Select options */}
                  {field.type === 'select' && (
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Dropdown Options</span>
                        <Button variant="ghost" size="sm" onClick={() => addOption(i)} className="gap-1 h-7 text-xs">
                          <Plus className="w-3 h-3" /> Add Option
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {field.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <Input
                              value={opt}
                              onChange={e => updateOption(i, oi, e.target.value)}
                              placeholder={`Option ${oi + 1}`}
                              className="h-8 text-sm"
                            />
                            <Button variant="ghost" size="sm" onClick={() => removeOption(i, oi)} className="h-8 px-2">
                              <X className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button variant="ghost" size="sm" onClick={() => removeField(i)} className="text-destructive mt-1">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Button variant="outline" onClick={addField} className="gap-2">
        <Plus className="w-4 h-4" /> Add Field
      </Button>
    </div>
  )
}
