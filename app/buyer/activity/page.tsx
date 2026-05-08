'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Clock,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  mockBuyerActivityLog, 
  BUYER_ACTIVITY_TYPES,
  type BuyerActivityType 
} from '@/lib/mock-activity'

export default function BuyerActivityPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set())

  const filteredActivities = useMemo(() => {
    return mockBuyerActivityLog.filter((activity) => {
      const matchesSearch =
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.rfpTitle && activity.rfpTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (activity.supplierName && activity.supplierName.toLowerCase().includes(searchTerm.toLowerCase()))

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

    const headers = ['Date', 'Type', 'Description', 'RFP', 'Supplier', 'User']
    const rows = activitiesToExport.map((a) => [
      new Date(a.createdAt).toLocaleString('en-GB'),
      BUYER_ACTIVITY_TYPES[a.type as BuyerActivityType]?.label || a.type,
      a.description,
      a.rfpTitle || '-',
      a.supplierName || '-',
      a.userName,
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `buyer-activity-log-${new Date().toISOString().split('T')[0]}.csv`
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
            Track all procurement activities across your RFPs
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
            placeholder="Search activities, RFPs, or suppliers..."
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
            <SelectItem value="rfp_created">RFP Created</SelectItem>
            <SelectItem value="rfp_published">RFP Published</SelectItem>
            <SelectItem value="rfp_sent_for_approval">Sent for Approval</SelectItem>
            <SelectItem value="rfp_approved">RFP Approved</SelectItem>
            <SelectItem value="rfp_changes_requested">Changes Requested</SelectItem>
            <SelectItem value="supplier_registered">Supplier Registered</SelectItem>
            <SelectItem value="supplier_approved">Supplier Approved</SelectItem>
            <SelectItem value="submission_received">Submission Received</SelectItem>
            <SelectItem value="submission_reviewed">Submission Reviewed</SelectItem>
            <SelectItem value="submission_shortlisted">Shortlisted</SelectItem>
            <SelectItem value="question_received">Question Received</SelectItem>
            <SelectItem value="question_answered">Question Answered</SelectItem>
            <SelectItem value="message_sent">Message Sent</SelectItem>
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
            const config = BUYER_ACTIVITY_TYPES[activity.type as BuyerActivityType]
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
                  <div className="flex items-center gap-3 mt-1">
                    {activity.rfpTitle && (
                      <p className="text-xs text-text-secondary">
                        RFP: {activity.rfpTitle}
                      </p>
                    )}
                    {activity.supplierName && (
                      <p className="text-xs text-text-secondary">
                        Supplier: {activity.supplierName}
                      </p>
                    )}
                  </div>
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
                  <p className="text-xs text-text-muted mt-0.5">
                    by {activity.userName}
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
