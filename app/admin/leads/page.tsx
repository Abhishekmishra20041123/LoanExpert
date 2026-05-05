'use client'

import { useState } from 'react'
import { useLoanData } from '@/hooks/useLoanData'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Eye, Check, X, Download, Calculator, UserSearch } from 'lucide-react'

function exportLeadsCSV(leads: any[]) {
  const headers = [
    'Name', 'Email', 'Phone', 'City', 'Loan Type', 'Loan Amount',
    'Monthly Income', 'Employment Type', 'CIBIL Score', 'Status',
    'Applied Date', 'Notes'
  ]
  const rows = leads.map(l => [
    l.name, l.email, l.phone, l.city, l.loanType,
    l.loanAmount, l.income, l.employmentType,
    l.cibilScore ?? '', l.status,
    new Date(l.appliedDate).toLocaleDateString(),
    (l.notes || '').replace(/,/g, ';'),
  ])
  const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminLeadsPage() {
  const { leads, updateLead, deleteLead } = useLoanData()
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'approved' | 'rejected'>('all')
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [adminVisibleNotes, setAdminVisibleNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'all' || lead.status === filter
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
    return matchesFilter && matchesSearch
  })

  const handleStatusChange = (id: string, newStatus: string) => {
    updateLead(id, {
      status: newStatus as any,
      contactedDate: newStatus === 'contacted' ? new Date().toISOString() : undefined,
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id)
      setSelectedLead(null)
    }
  }

  const handleSaveNotes = async (id: string) => {
    setSavingNotes(true)
    await updateLead(id, { adminNotes: adminVisibleNotes })
    setSavingNotes(false)
  }

  const selectedLeadData = leads.find(l => l.id === selectedLead)

  // Sync notes when selected lead changes
  const handleSelectLead = (id: string) => {
    setSelectedLead(id)
    const lead = leads.find(l => l.id === id)
    setAdminVisibleNotes(lead?.adminNotes || '')
  }

  const statusColors: Record<string, string> = {
    approved: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    rejected: 'bg-destructive/20 text-destructive',
    contacted: 'bg-primary/20 text-primary',
    new: 'bg-muted text-muted-foreground',
    closed: 'bg-muted text-muted-foreground',
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-muted-foreground">Manage and track all loan applications</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => exportLeadsCSV(filteredLeads)}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {/* Filters and Search */}
            <div className="mb-6 space-y-4">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-2 flex-wrap">
                {(['all', 'new', 'contacted', 'approved', 'rejected', 'closed'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status as any)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === status
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    {status !== 'all' && (
                      <span className="ml-1 text-xs opacity-70">
                        ({leads.filter(l => l.status === status).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Loan Type</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Amount</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Calc</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status/Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No leads found
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map(lead => (
                      <tr
                        key={lead.id}
                        className={`border-b border-border hover:bg-muted/50 cursor-pointer ${
                          selectedLead === lead.id ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleSelectLead(lead.id)}
                      >
                        <td className="py-3 px-4 font-medium text-foreground">{lead.name}</td>
                        <td className="py-3 px-4 text-muted-foreground capitalize">
                          {lead.loanType}
                        </td>
                        <td className="py-3 px-4 font-medium text-foreground text-right">
                          ₹{(lead.loanAmount / 100000).toFixed(1)}L
                        </td>
                        <td className="py-3 px-4 text-center">
                          {lead.notes && lead.notes.includes('Attached Calculation') ? (
                            <Calculator className="w-4 h-4 text-primary mx-auto" />
                          ) : lead.notes && lead.notes.includes('Attached Calculator') ? (
                            <Calculator className="w-4 h-4 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground/30">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${statusColors[lead.status] || 'bg-muted text-muted-foreground'}`}>
                              {lead.status}
                            </span>
                            <button
                              onClick={e => { e.stopPropagation(); handleDelete(lead.id) }}
                              className="text-destructive hover:bg-destructive/10 p-1.5 rounded-full transition-colors ml-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Showing {filteredLeads.length} of {leads.length} leads
            </p>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedLeadData ? (
            <Card className="p-6 sticky top-4 space-y-5">
              <h3 className="font-bold text-lg text-foreground">Lead Details</h3>

              {/* Side Panel: Case Highlights */}
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-3">
                  <UserSearch className="w-4 h-4" />
                  Lead Snapshot
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  {[
                    { label: 'Amount', value: `₹${selectedLeadData.loanAmount?.toLocaleString()}` },
                    { label: 'Type', value: selectedLeadData.loanType.toUpperCase() },
                    { label: 'Employment', value: selectedLeadData.employmentType ? selectedLeadData.employmentType.charAt(0).toUpperCase() + selectedLeadData.employmentType.slice(1) : '—' },
                    { label: 'Monthly Income', value: `₹${selectedLeadData.income?.toLocaleString()}` },
                    { label: 'CIBIL', value: selectedLeadData.cibilScore?.toString() || '—' },
                    { label: 'Applied', value: new Date(selectedLeadData.appliedDate).toLocaleDateString() },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{item.label}</p>
                      <p className="font-bold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attached Calculation Details */}
              {selectedLeadData.notes && (selectedLeadData.notes.includes('Attached Calculation') || selectedLeadData.notes.includes('Attached Calculator')) && (
                <div className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/20 shadow-sm">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider mb-3">
                    <Calculator className="w-4 h-4" />
                    Attached Calculation
                  </div>
                  <div className="bg-background/80 rounded-lg p-3 border border-orange-500/10">
                    <pre className="text-[11px] whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                      {selectedLeadData.notes.split('--- Attached Calculation Details ---')[1] || 
                       selectedLeadData.notes.split('--- Attached Calculator Details ---')[1] || 
                       selectedLeadData.notes.split('--- Attached Calculator Scenarios')[1] || 
                       selectedLeadData.notes}
                    </pre>
                  </div>
                </div>
              )}

              {/* Full Original Message */}
              {selectedLeadData.notes && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Full Enquiry Message</label>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border/50 max-h-[150px] overflow-y-auto">
                    <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                      {selectedLeadData.notes.split('---')[0]}
                    </p>
                  </div>
                </div>
              )}

              {/* Editable Internal Notes */}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-bold uppercase tracking-wider">Internal Admin Notes</label>
                <textarea
                  value={adminVisibleNotes}
                  onChange={e => setAdminVisibleNotes(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm min-h-20 bg-background text-foreground border-input focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Add private notes for staff..."
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full"
                  disabled={savingNotes}
                  onClick={() => handleSaveNotes(selectedLeadData.id)}
                >
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </Button>
              </div>

              {/* Status Actions */}
              <div className="border-t border-border pt-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-3">Change Status:</p>
                {[
                  { status: 'contacted', label: 'Mark Contacted', icon: Check, cls: 'bg-primary text-primary-foreground hover:bg-primary/90' },
                  { status: 'approved', label: 'Approve', icon: Check, cls: 'bg-green-600 text-white hover:bg-green-700' },
                  { status: 'rejected', label: 'Reject', icon: X, cls: 'bg-destructive/20 text-destructive hover:bg-destructive/30' },
                  { status: 'closed', label: 'Close', icon: X, cls: 'bg-muted text-muted-foreground hover:bg-muted/80' },
                ].map(action => {
                  const Icon = action.icon
                  return (
                    <button
                      key={action.status}
                      onClick={() => handleStatusChange(selectedLeadData.id, action.status)}
                      className={`w-full px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-2 ${action.cls}`}
                    >
                      <Icon className="w-4 h-4" />
                      {action.label}
                    </button>
                  )
                })}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Select a lead to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
