'use client'

import React from 'react'
import { EngagementRecord } from '@/types/supplier'
import { Mail, Phone, Users, FileText, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EngagementTimelineProps {
  records: EngagementRecord[]
}

export function EngagementTimeline({ records }: EngagementTimelineProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'call':
        return <Phone className="h-4 w-4" />
      case 'meeting':
        return <Users className="h-4 w-4" />
      case 'rfp_invitation':
        return <FileText className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'email':
        return 'Email'
      case 'call':
        return 'Call'
      case 'meeting':
        return 'Meeting'
      case 'rfp_invitation':
        return 'RFP Invitation'
      default:
        return 'Note'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-700'
      case 'call':
        return 'bg-purple-100 text-purple-700'
      case 'meeting':
        return 'bg-orange-100 text-orange-700'
      case 'rfp_invitation':
        return 'bg-brand-green-light text-brand-green'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-3">
      {sortedRecords.map((record, index) => (
        <div key={record.id} className="relative">
          {/* Timeline line */}
          {index !== sortedRecords.length - 1 && (
            <div className="absolute left-5 top-10 w-0.5 h-6 bg-border" />
          )}

          {/* Timeline item */}
          <div className="flex gap-3">
            {/* Icon */}
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 border-border shrink-0',
                getTypeColor(record.type)
              )}
            >
              {getTypeIcon(record.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-text-primary">
                  {getTypeLabel(record.type)}
                </p>
                <p className="text-xs text-text-muted shrink-0">
                  {formatDate(record.date)}
                </p>
              </div>
              {record.notes && (
                <p className="text-sm text-text-secondary mt-1">
                  {record.notes}
                </p>
              )}
              {record.relatedRFP && (
                <p className="text-xs text-brand-green mt-1">
                  RFP: {record.relatedRFP}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
