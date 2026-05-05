'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Check, Loader2, FileText, MessageSquare, Layout, Plus, Trash2, Zap } from 'lucide-react'

export type AnimationNode = {
  id: string
  label: string
  statusText: string
  icon?: string
}

type SiteContent = {
  heroTitle: string
  heroSubtitle: string
  trustIndicator1: string
  trustIndicator2: string
  trustIndicator3: string
  animationNodes?: AnimationNode[]
  finalNodeLabel?: string
  finalNodeValue?: string
  finalNodeStatus?: string
  contactBadge?: string
  contactTitle?: string
  contactTitleHighlight?: string
  contactSubtitle?: string
}

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: 'Compare Loans from Top Banks with Expert Guidance',
  heroSubtitle: 'Get the best loan rates, instant EMI calculations, and expert assistance from India\'s trusted loan comparison platform.',
  trustIndicator1: '1000+ Loans Processed',
  trustIndicator2: '20+ Banks Partnered',
  trustIndicator3: '98% Customer Satisfaction',
  animationNodes: [
    { id: 'an-1', label: 'Banks', statusText: 'Scanning 20+ Banks...', icon: '🏦' },
    { id: 'an-2', label: 'NBFCs', statusText: 'Comparing Interest Rates...', icon: '🏢' },
    { id: 'an-3', label: 'Private', statusText: 'Optimizing Loan Terms...', icon: '💼' }
  ],
  finalNodeLabel: 'Lowest Rate',
  finalNodeValue: '10.1%',
  finalNodeStatus: 'Best Offer Unlocked!',
  contactBadge: 'Agent Online Now',
  contactTitle: 'Need Help?',
  contactTitleHighlight: 'Connect Instantly.',
  contactSubtitle: 'Get expert guidance for your loan application. Our agents are ready to help you find the best rates in minutes.'
}

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/site-settings', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const s = data.settings || {}
        if (s.siteContent) {
          setContent(prev => ({
            ...prev,
            ...s.siteContent,
            animationNodes: s.siteContent.animationNodes || prev.animationNodes,
            finalNodeLabel: s.siteContent.finalNodeLabel || prev.finalNodeLabel,
            finalNodeValue: s.siteContent.finalNodeValue || prev.finalNodeValue,
            finalNodeStatus: s.siteContent.finalNodeStatus || prev.finalNodeStatus,
            contactBadge: s.siteContent.contactBadge || prev.contactBadge,
            contactTitle: s.siteContent.contactTitle || prev.contactTitle,
            contactTitleHighlight: s.siteContent.contactTitleHighlight || prev.contactTitleHighlight,
            contactSubtitle: s.siteContent.contactSubtitle || prev.contactSubtitle
          }))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save as part of site settings
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ siteContent: content }),
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
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading content settings…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
        <p className="text-muted-foreground">Edit website content, hero sections, and trust indicators</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Layout className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Homepage Hero</h2>
              <p className="text-xs text-muted-foreground">Main heading and subtitle</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Hero Title</label>
              <textarea
                value={content.heroTitle}
                onChange={e => setContent(prev => ({ ...prev, heroTitle: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Hero Subtitle</label>
              <textarea
                value={content.heroSubtitle}
                onChange={e => setContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Contact Page Header */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Contact Page Hero</h2>
              <p className="text-xs text-muted-foreground">Manage the /contact landing text</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Badge Text</label>
              <Input
                value={content.contactBadge || ''}
                onChange={e => setContent(prev => ({ ...prev, contactBadge: e.target.value }))}
                placeholder="e.g. Agent Online Now"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Hero Title</label>
                <Input
                  value={content.contactTitle || ''}
                  onChange={e => setContent(prev => ({ ...prev, contactTitle: e.target.value }))}
                  placeholder="e.g. Need Help?"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Title Highlight</label>
                <Input
                  value={content.contactTitleHighlight || ''}
                  onChange={e => setContent(prev => ({ ...prev, contactTitleHighlight: e.target.value }))}
                  placeholder="e.g. Connect Instantly."
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Hero Subtitle</label>
              <textarea
                value={content.contactSubtitle || ''}
                onChange={e => setContent(prev => ({ ...prev, contactSubtitle: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Trust Indicators */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Trust Indicators</h2>
              <p className="text-xs text-muted-foreground">Stats shown on homepage</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Indicator 1</label>
              <Input
                value={content.trustIndicator1}
                onChange={e => setContent(prev => ({ ...prev, trustIndicator1: e.target.value }))}
                placeholder="e.g. 1000+ Loans Processed"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Indicator 2</label>
              <Input
                value={content.trustIndicator2}
                onChange={e => setContent(prev => ({ ...prev, trustIndicator2: e.target.value }))}
                placeholder="e.g. 20+ Banks Partnered"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Indicator 3</label>
              <Input
                value={content.trustIndicator3}
                onChange={e => setContent(prev => ({ ...prev, trustIndicator3: e.target.value }))}
                placeholder="e.g. 98% Customer Satisfaction"
              />
            </div>
          </div>
        </Card>

        {/* Hero Animation Config */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">Hero Animation Logic</h2>
              <p className="text-xs text-muted-foreground">Manage the orbiting lender types and scanning steps</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const newNodes = [...(content.animationNodes || []), { id: Date.now().toString(), label: '', statusText: '', icon: '🏦' }]
                setContent(prev => ({ ...prev, animationNodes: newNodes }))
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Step
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-foreground">Orbiting Steps</h3>
              {(content.animationNodes || []).map((node, idx) => (
                <div key={node.id} className="p-4 rounded-xl border border-input bg-muted/30 relative group">
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-medium text-muted-foreground">Orbit Label (e.g. Banks)</label>
                        <Input 
                          value={node.label} 
                          onChange={e => {
                            const newNodes = [...(content.animationNodes || [])]
                            newNodes[idx].label = e.target.value
                            setContent(prev => ({ ...prev, animationNodes: newNodes }))
                          }}
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-xs font-medium text-muted-foreground">Icon (Emoji)</label>
                        <select
                          className="w-full px-3 py-2 h-9 rounded-md border border-input bg-background text-base"
                          value={node.icon || '🏦'}
                          onChange={e => {
                            const newNodes = [...(content.animationNodes || [])]
                            newNodes[idx].icon = e.target.value
                            setContent(prev => ({ ...prev, animationNodes: newNodes }))
                          }}
                        >
                          <option value="🏦">🏦</option>
                          <option value="🏢">🏢</option>
                          <option value="💼">💼</option>
                          <option value="🚗">🚗</option>
                          <option value="💳">💳</option>
                          <option value="📈">📈</option>
                          <option value="💰">💰</option>
                          <option value="🛡️">🛡️</option>
                          <option value="⚡">⚡</option>
                          <option value="🌟">🌟</option>
                          <option value="🤝">🤝</option>
                          <option value="💎">💎</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Status Text (e.g. Scanning...)</label>
                      <Input 
                        value={node.statusText} 
                        onChange={e => {
                          const newNodes = [...(content.animationNodes || [])]
                          newNodes[idx].statusText = e.target.value
                          setContent(prev => ({ ...prev, animationNodes: newNodes }))
                        }}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const newNodes = (content.animationNodes || []).filter((_, i) => i !== idx)
                      setContent(prev => ({ ...prev, animationNodes: newNodes }))
                    }}
                    className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-foreground">Final Result Step (Center)</h3>
              <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Status Text (e.g. Best Offer Unlocked!)</label>
                  <Input 
                    value={content.finalNodeStatus || ''} 
                    onChange={e => setContent(prev => ({ ...prev, finalNodeStatus: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Result Label (e.g. Lowest Rate)</label>
                  <Input 
                    value={content.finalNodeLabel || ''} 
                    onChange={e => setContent(prev => ({ ...prev, finalNodeLabel: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Result Value (e.g. 10.1%)</label>
                  <Input 
                    value={content.finalNodeValue || ''} 
                    onChange={e => setContent(prev => ({ ...prev, finalNodeValue: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>


        {/* Save Button */}
        <div className="lg:col-span-2">
          <Button onClick={handleSave} disabled={saving} className="gap-2" size="lg">
            {saved ? (
              <><Check className="w-4 h-4" /> Saved!</>
            ) : saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="w-4 h-4" /> Save All Content</>
            )}
          </Button>
        </div>

        {/* Info */}
        <Card className="p-6 lg:col-span-2 bg-muted/30">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground mb-1">Managing other content</h3>
              <p className="text-sm text-muted-foreground">
                Blog posts and FAQs have their own dedicated management pages accessible from the sidebar.
                Loan-specific content (eligibility criteria, required documents, etc.) can be managed from the{' '}
                <a href="/admin/loan-content" className="text-primary underline hover:no-underline">
                  Loan Content
                </a>{' '}
                section.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
