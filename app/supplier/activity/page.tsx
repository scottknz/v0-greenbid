'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Download,
  Filter,
  Calendar,
  FileText,
  MessageSquare,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  UserPlus,
  UserMinus,
  Edit,
  Eye,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Activity types with icons and colors
const ACTIVITY_TYPES = {
  rfp_registered: { label: 'Registered Interest', icon: FileText, color: 'text-blue-600 bg-blue-100' },
  rfp_approved: { label: 'Registration Approved', icon: CheckCircle, color: 'text-brand-green bg-brand-green-light' },
  rfp_rejected: { label: 'Registration Rejected', icon: XCircle, color: 'text-red-600 bg-red-100' },
  submission_draft_saved: { label: 'Draft Saved', icon: Edit, color: 'text-grey-600 bg-grey-100' },
  submission_submitted: { label: 'Proposal Submitted', icon: Send, color: 'text-purple-600 bg-purple-100' },
  submission_release_requested: { label: 'Release Requested', icon: AlertCircle, color: 'text-amber-600 bg-amber-100' },
  submission_released: { label: 'Submission Released', icon: CheckCircle, color: 'text-brand-green bg-brand-green-light' },
  question_submitted: { label: 'Question Submitted', icon: MessageSquare, color: 'text-blue-600 bg-blue-100' },
  question_answered: { label: 'Question Answered', icon: MessageSquare, color: 'text-brand-green bg-brand-green-light' },
  document_uploaded: { label: 'Document Uploaded', icon: Upload, color: 'text-indigo-600 bg-indigo-100' },
  document_deleted: { label: 'Document Deleted', icon: XCircle, color: 'text-red-600 bg-red-100' },
  message_sent: { label: 'Message Sent', icon: Send, color: 'text-blue-600 bg-blue-100' },
  message_received: { label: 'Message Received', icon: MessageSquare, color: 'text-brand-green bg-brand-green-light' },
  team_member_added: { label: 'Team Member Added', icon: UserPlus, color: 'text-brand-green bg-brand-green-light' },
  team_member_removed: { label: 'Team Member Removed', icon: UserMinus, color: 'text-red-600 bg-red-100' },
  profile_updated: { label: 'Profile Updated', icon: Edit, color: 'text-grey-600 bg-grey-100' },
  rfp_viewed: { label: 'RFP Viewed', icon: Eye, color: 'text-grey-600 bg-grey-100' },
}

// Mock activity data
const mockActivityLog = [
  {
    id: 'act-001',
    type: 'submission_submitted',
    description: 'Submitted proposal for "SBTi Target Setting & Validation Support"',
    rfpId: 'rfp-002',
    rfpTitle: 'SBTi Target Setting & Validation Support',
    createdAt: '2026-04-10T14:30:00Z',
  },
  {
    id: 'act-002',
    type: 'message_received',
    description: 'Received message from Thistle Company regarding clarification questions',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    createdAt: '2026-04-09T10:15:00Z',
  },
  {
    id: 'act-003',
    type: 'document_uploaded',
    description: 'Uploaded "ISO 14001 Certificate" to Library',
    rfpId: null,
    rfpTitle: null,
    createdAt: '2026-04-08T16:45:00Z',
  },
  {
    id: 'act-004',
    type: 'rfp_approved',
    description: 'Registration approved for "Comprehensive Scope 3 Value Chain Emissions Analysis"',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    createdAt: '2026-04-07T09:00:00Z',
  },
  {
    id: 'act-005',
    type: 'submission_draft_saved',
    description: 'Saved draft response for "Comprehensive Scope 3 Value Chain Emissions Analysis"',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    createdAt: '2026-04-06T17:30:00Z',
  },
  {
    id: 'act-006',
    type: 'question_submitted',
    description: 'Submitted question about timeline requirements',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    createdAt: '2026-04-05T11:20:00Z',
  },
  {
    id: 'act-007',
    type: 'rfp_registered',
    description: 'Registered interest in "ISSB (IFRS S1 & S2) Integration & Reporting"',
    rfpId: 'rfp-004',
    rfpTitle: 'ISSB (IFRS S1 & S2) Integration & Reporting',
    createdAt: '2026-04-01T08:45:00Z',
  },
  {
    id: 'act-008',
    type: 'team_member_added',
    description: 'Added Sarah Johnson as Editor',
    rfpId: null,
    rfpTitle: null,
    createdAt: '2026-03-28T14:00:00Z',
  },
  {
    id: 'act-009',
    type: 'rfp_rejected',
    description: 'Not selected for "Renewable Energy Procurement Strategy"',
    rfpId: 'rfp-005',
    rfpTitle: 'Renewable Energy Procurement Strategy',
    createdAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'act-010',
    type: 'submission_submitted',
    description: 'Submitted proposal for "Renewable Energy Procurement Strategy"',
    rfpId: 'rfp-005',
    rfpTitle: 'Renewable Energy Procurement Strategy',
    createdAt: '2026-03-14T16:55:00Z',
  },
]

export default function SupplierActivityPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set())

  const filteredActivities = useMemo(() => {
    return mockActivityLog.filter((activity) => {
      const matchesSearch =
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.rfpTitle && activity.rfpTitle.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType = typeFilter === 'all' || activity.type === typeFilter

      // Date filtering
      let matchesDate = true
      if (dateFilter !== 'all') {
        const activityDate = new Date(activity.createdAt)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))

        if (dateFilter === '7days') matchesDate = daysDiff <= 7
        else if (dateFilter === '30days') matchesDate = daysDiff <= 30
        else if (dateFilter === '90days') matchesDate = daysDiff <= 90
      }

      return matchesSearch && matchesType && matchesDate
    })
  }, [searchTerm, typeFilter, dateFilter])

  const handleExportCSV = () => {
    const activitiesToExport =
      selectedActivities.size > 0
        ? filteredActivities.filter((a) => selectedActivities.has(a.id))
        : filteredActivities

    const headers = ['Date', 'Type', 'Description', 'RFP']
    const rows = activitiesToExport.map((a) => [
      new Date(a.createdAt).toLocaleString('en-GB'),
      ACTIVITY_TYPES[a.type as keyof typeof ACTIVITY_TYPES]?.label || a.type,
      a.description,
      a.rfpTitle || '-',
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const toggleSelectActivity = (id: string) => {
    setSelectedActivities((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedActivities.size === filteredActivities.length) {
      setSelectedActivities(new Set())
    } else {
      setSelectedActivities(new Set(filteredActivities.map((a) => a.id)))
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Activity Log</h1>
          <p className="text-sm text-text-secondary mt-1">
            Track all your platform activities and events
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export {selectedActivities.size > 0 ? `(${selectedActivities.size})` : 'All'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border border-border">
        <div className="flex flex-1 items-center gap-2 bg-white rounded-md border border-border px-3 py-2">
          <Search className="h-4 w-4 text-text-secondary" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-56">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activity Types</SelectItem>
            <SelectItem value="rfp_registered">Registered Interest</SelectItem>
            <SelectItem value="rfp_approved">Registration Approved</SelectItem>
            <SelectItem value="submission_submitted">Proposal Submitted</SelectItem>
            <SelectItem value="submission_draft_saved">Draft Saved</SelectItem>
            <SelectItem value="question_submitted">Question Submitted</SelectItem>
            <SelectItem value="message_sent">Message Sent</SelectItem>
            <SelectItem value="message_received">Message Received</SelectItem>
            <SelectItem value="document_uploaded">Document Uploaded</SelectItem>
            <SelectItem value="team_member_added">Team Member Added</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity List */}
      <div className="border border-border rounded-lg overflow-hidden bg-white">
        <div className="flex items-center gap-4 px-6 py-3 bg-background border-b border-border">
          <input
            type="checkbox"
            checked={selectedActivities.size === filteredActivities.length && filteredActivities.length > 0}
            onChange={toggleSelectAll}
            className="h-4 w-4 rounded border-grey-300"
          />
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            Select All ({filteredActivities.length} activities)
          </span>
        </div>

        <div className="divide-y divide-border">
          {filteredActivities.map((activity) => {
            const config = ACTIVITY_TYPES[activity.type as keyof typeof ACTIVITY_TYPES]
            const Icon = config?.icon || FileText

            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-background/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedActivities.has(activity.id)}
                  onChange={() => toggleSelectActivity(activity.id)}
                  className="h-4 w-4 mt-1 rounded border-grey-300"
                />
                <div className={cn('p-2 rounded-lg', config?.color || 'bg-grey-100')}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{activity.description}</p>
                  {activity.rfpTitle && (
                    <p className="text-xs text-text-secondary mt-1">
                      RFP: {activity.rfpTitle}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-text-secondary">
                    {new Date(activity.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {new Date(activity.createdAt).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activities found</p>
          </div>
        )}
      </div>
    </div>
  )
}
