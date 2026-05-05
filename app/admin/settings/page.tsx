'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { User, Phone, Mail, MessageSquare, Shield, Database, LogOut, Save, Check } from 'lucide-react'

export default function AdminSettingsPage() {
  const { logout, adminEmail } = useAdminAuth()
  const router = useRouter()

  // Password change
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSaved, setPasswordSaved] = useState(false)

  // Profile
  const [adminEmailDisplay, setAdminEmailDisplay] = useState('')
  const [fullName, setFullName] = useState('')
  const [adminPhone, setAdminPhone] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Site settings
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [savingSite, setSavingSite] = useState(false)
  const [siteSaved, setSiteSaved] = useState(false)

  // Load admin profile
  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setAdminEmailDisplay(data.email || '')
        setFullName(data.fullName || '')
        setAdminPhone(data.phone || '')
      })
      .catch(() => {})

    fetch('/api/admin/site-settings', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const s = data.settings || {}
        setContactPhone(s.contactPhone || '')
        setContactEmail(s.contactEmail || '')
      })
      .catch(() => {})
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const handleChangePassword = async () => {
    setPasswordError(null)
    setPasswordSaved(false)

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match')
      return
    }

    setSavingPassword(true)
    try {
      const res = await fetch('/api/admin/me/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setPasswordError(data.error || 'Failed to update password')
        return
      }
      setPasswordSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } finally {
      setSavingPassword(false)
    }
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    setProfileError(null)
    setProfileSaved(false)
    try {
      const res = await fetch('/api/admin/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fullName, phone: adminPhone, email: adminEmailDisplay }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setProfileError(data.error || 'Failed to update profile')
        return
      }
      setProfileSaved(true)
      // We might need to refresh state if the email changed
      if (adminEmailDisplay.toLowerCase() !== adminEmail?.toLowerCase()) {
        window.location.reload()
      } else {
        setTimeout(() => setProfileSaved(false), 3000)
      }
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSaveSiteSettings = async () => {
    setSavingSite(true)
    try {
      await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ contactPhone, contactEmail }),
      })
      setSiteSaved(true)
      setTimeout(() => setSiteSaved(false), 3000)
    } finally {
      setSavingSite(false)
    }
  }

  const handleExportData = async () => {
    const res = await fetch('/api/admin/loan-config', { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()

    let csvStr = ''
    const formatCSV = (title: string, arr: any[]) => {
      if (!arr || !arr.length) return ''
      
      // Get all unique keys across all objects, ignoring complex nested structures 
      const keys = Array.from(new Set(arr.flatMap(Object.keys))).filter(k => 
        typeof arr[0][k] !== 'object' || arr[0][k] === null
      )
      
      let block = `--- ${title.toUpperCase()} ---\n`
      block += keys.join(',') + '\n'
      for (const item of arr) {
        block += keys.map(k => {
          const val = item[k] === null || item[k] === undefined ? '' : String(item[k])
          return `"${val.replace(/"/g, '""')}"`
        }).join(',') + '\n'
      }
      return block + '\n'
    }

    csvStr += formatCSV('Banks', data.banks || [])
    csvStr += formatCSV('Rates', data.rates || [])
    csvStr += formatCSV('Eligibility Rules', data.eligibilityRules ? Object.values(data.eligibilityRules) : [])
    csvStr += formatCSV('Leads', data.leads || [])
    csvStr += formatCSV('Loan Contents', data.loanContents ? Object.values(data.loanContents) : [])

    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `loanexpert-backup-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage admin profile, site configuration, and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Admin Profile */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Admin Profile</h2>
              <p className="text-xs text-muted-foreground">Your personal account details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email Address (Admin Login)</label>
              <Input 
                value={adminEmailDisplay} 
                onChange={e => setAdminEmailDisplay(e.target.value)} 
                placeholder="admin@loanexpert.com"
              />
              <p className="text-xs text-muted-foreground mt-1">This is your login email. If you change it, you'll be logged in with the new email.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
              <Input
                placeholder="Your full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
              <Input
                placeholder="+91 99999 99999"
                value={adminPhone}
                onChange={e => setAdminPhone(e.target.value)}
              />
            </div>
            {profileError && <p className="text-destructive text-sm font-medium mb-2">{profileError}</p>}

            <Button onClick={handleSaveProfile} disabled={savingProfile} className="w-full gap-2">
              {profileSaved ? (
                <><Check className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" />{savingProfile ? 'Saving...' : 'Save Profile'}</>
              )}
            </Button>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Change Password</h2>
              <p className="text-xs text-muted-foreground">Update your login credentials</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            {passwordError && <p className="text-destructive text-sm">{passwordError}</p>}
            {passwordSaved && <p className="text-green-600 text-sm font-medium dark:text-green-400">✓ Password updated successfully</p>}

            <Button onClick={handleChangePassword} className="w-full gap-2" disabled={savingPassword}>
              <Shield className="w-4 h-4" />
              {savingPassword ? 'Updating...' : 'Save Password'}
            </Button>
          </div>
        </Card>

        {/* Site Contact Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Site Contact Settings</h2>
              <p className="text-xs text-muted-foreground">Show on contact page and footer</p>
            </div>
          </div>

          <div className="space-y-4">

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Contact Phone
              </label>
              <Input
                placeholder="9999999999"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Direct Contact Gmail (User Enquiries)
              </label>
              <Input
                type="email"
                placeholder="loans@gmail.com"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
              />
            </div>

            <Button onClick={handleSaveSiteSettings} disabled={savingSite} className="w-full gap-2">
              {siteSaved ? (
                <><Check className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" />{savingSite ? 'Saving...' : 'Save Settings'}</>
              )}
            </Button>
          </div>
        </Card>

        {/* Data & Session */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Data Backup</h2>
                <p className="text-xs text-muted-foreground">Export all data as CSV</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Download a complete backup of banks, rates, eligibility rules, and leads.
            </p>
            <Button variant="outline" className="w-full" onClick={handleExportData}>
              Export Data (CSV)
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Session</h2>
                <p className="text-xs text-muted-foreground">Logged in as {adminEmail}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
