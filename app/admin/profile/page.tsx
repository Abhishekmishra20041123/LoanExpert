'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Save, Check, Loader2, User, Briefcase, MapPin,
  Linkedin, Instagram, Twitter, Facebook, Youtube,
  Phone, Mail, Award, Star, Shield, Plus, X
} from 'lucide-react'

type Profile = {
  fullName: string
  title: string
  photoUrl: string
  bio: string
  experience: string
  achievements: string[]
  certifications: string[]
  specializations: string[]
  linkedinUrl: string
  instagramUrl: string
  twitterUrl: string
  facebookUrl: string
  youtubeUrl: string
  personalPhone: string
  personalEmail: string
  location: string
}

const EMPTY_PROFILE: Profile = {
  fullName: '', title: 'Loan Expert', photoUrl: '', bio: '', experience: '',
  achievements: [], certifications: [], specializations: [],
  linkedinUrl: '', instagramUrl: '', twitterUrl: '', facebookUrl: '', youtubeUrl: '',
  personalPhone: '', personalEmail: '', location: '',
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/agent-profile', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.profile && typeof data.profile === 'object') {
          setProfile(prev => ({ ...prev, ...data.profile }))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/agent-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  const addToList = (field: 'achievements' | 'certifications' | 'specializations') => {
    setProfile(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const updateList = (field: 'achievements' | 'certifications' | 'specializations', index: number, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }))
  }

  const removeFromList = (field: 'achievements' | 'certifications' | 'specializations', index: number) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading profile…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile / About Page</h1>
          <p className="text-muted-foreground mt-1">
            This information is displayed on your public About page
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
          {saved ? (
            <><Check className="w-4 h-4" /> Saved!</>
          ) : saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="w-4 h-4" /> Save All</>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Personal Info */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
              <p className="text-xs text-muted-foreground">Your name and title as shown to customers</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
              <Input
                value={profile.fullName}
                onChange={e => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Title / Designation</label>
              <Input
                value={profile.title}
                onChange={e => setProfile(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Senior Loan Advisor"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Profile Photo URL</label>
              <Input
                value={profile.photoUrl}
                onChange={e => setProfile(prev => ({ ...prev, photoUrl: e.target.value }))}
                placeholder="https://example.com/photo.jpg"
              />
              {profile.photoUrl && (
                <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-border">
                  <img src={profile.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Experience</label>
              <Input
                value={profile.experience}
                onChange={e => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g. 10+ years in Banking & Financial Services"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Location</label>
              <Input
                value={profile.location}
                onChange={e => setProfile(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Mumbai, Maharashtra"
              />
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Contact Details</h2>
              <p className="text-xs text-muted-foreground">Shown on your About page</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
              <Input
                value={profile.personalPhone}
                onChange={e => setProfile(prev => ({ ...prev, personalPhone: e.target.value }))}
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
              <Input
                type="email"
                value={profile.personalEmail}
                onChange={e => setProfile(prev => ({ ...prev, personalEmail: e.target.value }))}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-bold text-foreground">Social Media Links</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-[#0A66C2] shrink-0" />
                <Input
                  value={profile.linkedinUrl}
                  onChange={e => setProfile(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-[#E4405F] shrink-0" />
                <Input
                  value={profile.instagramUrl}
                  onChange={e => setProfile(prev => ({ ...prev, instagramUrl: e.target.value }))}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
              <div className="flex items-center gap-3">
                <Twitter className="w-5 h-5 text-[#1DA1F2] shrink-0" />
                <Input
                  value={profile.twitterUrl}
                  onChange={e => setProfile(prev => ({ ...prev, twitterUrl: e.target.value }))}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div className="flex items-center gap-3">
                <Facebook className="w-5 h-5 text-[#1877F2] shrink-0" />
                <Input
                  value={profile.facebookUrl}
                  onChange={e => setProfile(prev => ({ ...prev, facebookUrl: e.target.value }))}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div className="flex items-center gap-3">
                <Youtube className="w-5 h-5 text-[#FF0000] shrink-0" />
                <Input
                  value={profile.youtubeUrl}
                  onChange={e => setProfile(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Bio */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">About / Bio</h2>
              <p className="text-xs text-muted-foreground">Tell customers about your background and expertise</p>
            </div>
          </div>
          <textarea
            value={profile.bio}
            onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground resize-y"
            placeholder="Share your professional background, experience working with loans, what makes you the right advisor..."
          />
        </Card>

        {/* Specializations */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Specializations</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => addToList('specializations')} className="gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {profile.specializations.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={e => updateList('specializations', i, e.target.value)}
                  placeholder="e.g. Home Loans"
                />
                <Button variant="ghost" size="sm" onClick={() => removeFromList('specializations', i)}>
                  <X className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            {profile.specializations.length === 0 && (
              <p className="text-sm text-muted-foreground">No specializations added. Click "Add" to start.</p>
            )}
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Achievements</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => addToList('achievements')} className="gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {profile.achievements.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={e => updateList('achievements', i, e.target.value)}
                  placeholder="e.g. ₹100 Cr+ loans processed"
                />
                <Button variant="ghost" size="sm" onClick={() => removeFromList('achievements', i)}>
                  <X className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            {profile.achievements.length === 0 && (
              <p className="text-sm text-muted-foreground">No achievements added. Click "Add" to start.</p>
            )}
          </div>
        </Card>

        {/* Certifications */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Certifications</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => addToList('certifications')} className="gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {profile.certifications.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={e => updateList('certifications', i, e.target.value)}
                  placeholder="e.g. IIBF Certified Banker"
                />
                <Button variant="ghost" size="sm" onClick={() => removeFromList('certifications', i)}>
                  <X className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            {profile.certifications.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-2">No certifications added. Click "Add" to start.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Save */}
      <div className="mt-8 flex items-center justify-between">
        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline hover:no-underline"
        >
          Preview public About page →
        </a>
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
          {saved ? (
            <><Check className="w-4 h-4" /> Saved!</>
          ) : saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="w-4 h-4" /> Save All Changes</>
          )}
        </Button>
      </div>
    </div>
  )
}
