'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, AlertCircle, CheckCircle, Clock, MessageSquare, 
  ArrowRight, Eye 
} from 'lucide-react'
import {
  buyerActions,
  buyerRfps,
  buyerMetrics,
  getDaysUntilDeadline,
  getUrgencyColor,
  getUrgencyLabel,
} from '@/lib/mock-buyer-dashboard'

// Data imported from lib/mock-buyer-dashboard.ts
const mockActions = buyerActions
const mockRFPs = buyerRfps
const mockMetrics = buyerMetrics

export default function BuyerDashboard() {
  const daysUntilDeadline = (dateStr: string) => getDaysUntilDeadline(dateStr)

  return (
    <div className="space-y-6 p-6">
      {/* Header with contextual summary */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Dashboard</h1>
        <p className="text-text-secondary">
          You have <span className="font-semibold text-text-primary">{mockActions.length} actions</span> requiring attention and <span className="font-semibold text-text-primary">{mockRFPs.filter(r => r.status === 'accepting_bids').length} RFPs</span> actively accepting bids
        </p>
      </div>

      {/* Actionable Metrics - 3 cards, all clickable */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <MetricCardLink
          href="/buyer/tenders?status=active"
          title="Active RFPs"
          value={mockMetrics.activeRFPs.toString()}
          description={`${mockRFPs.filter(r => r.status === 'accepting_bids').length} accepting bids`}
          icon={FileText}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <MetricCardLink
          href="/buyer/messages"
          title="Pending Q&A"
          value={mockMetrics.pendingQA.toString()}
          description="Unanswered questions"
          icon={MessageSquare}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <MetricCardLink
          href="/buyer/tenders?status=evaluating"
          title="Under Evaluation"
          value={mockMetrics.inEvaluation.toString()}
          description="Awaiting review"
          icon={AlertCircle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Two-column layout: Actions + RFPs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Priority Actions */}
        <Card className="lg:col-span-1 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Priority Actions</CardTitle>
              <Badge variant="secondary">{mockActions.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockActions.length > 0 ? (
              <>
                {mockActions.map((action) => {
                  const days = daysUntilDeadline(action.dueDate)
                  return (
                    <Link
                      key={action.id}
                      href={`/buyer/tenders/${action.rfpId}/manage`}
                      className="block p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-sm font-semibold text-text-primary">{action.title}</span>
                        <ArrowRight className="h-4 w-4 text-text-muted flex-shrink-0" />
                      </div>
                      <p className="text-xs text-text-secondary truncate">{action.rfpName}</p>
                      <div className={`mt-2 text-xs font-medium px-2 py-1 rounded w-fit ${getUrgencyColor(days)}`}>
                        {getUrgencyLabel(days)}
                      </div>
                    </Link>
                  )
                })}
              </>
            ) : (
              <p className="text-sm text-text-secondary py-4">No actions required</p>
            )}
            {mockActions.length > 0 && (
              <Link href="/buyer/tenders">
                <Button variant="outline" size="sm" className="w-full">
                  View All <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Right: Your RFPs */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Your RFPs</CardTitle>
              <Badge variant="secondary">{mockRFPs.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRFPs.map((rfp) => (
                <Link
                  key={rfp.id}
                  href={`/buyer/tenders/${rfp.id}/manage`}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-surface-hover transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary group-hover:text-green-600 truncate">
                      {rfp.name}
                    </p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Badge variant="outline" className={getStatusBadgeClass(rfp.status)}>
                          {getStatusLabel(rfp.status)}
                        </Badge>
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {rfp.submissions} {rfp.submissions === 1 ? 'bid' : 'bids'}
                      </span>
                      {rfp.pendingQA > 0 && (
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <MessageSquare className="h-3 w-3" />
                          {rfp.pendingQA} pending Q&A
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4 flex-shrink-0 text-right">
                    <div className="text-sm">
                      <p className="font-medium text-text-primary">{formatBudget(rfp.budget)}</p>
                      <p className="text-xs text-text-secondary">{rfp.deadline}</p>
                    </div>
                    <Eye className="h-4 w-4 text-text-muted group-hover:text-text-primary" />
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/buyer/tenders">
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All RFPs <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Banner */}
      <Card className="border-border bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-900">Ready to get started?</p>
              <p className="text-sm text-green-700 mt-1">Create a new RFP or manage existing procurement activities</p>
            </div>
            <Link href="/buyer/tenders">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                New RFP
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCardLink({
  href,
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  href: string
  title: string
  value: string
  description: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
}) {
  return (
    <Link href={href}>
      <Card className="border-border hover:border-green-200 hover:shadow-md transition-all cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{title}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">{value}</p>
              <p className="mt-1 text-sm text-text-secondary">{description}</p>
            </div>
            <div className={`rounded-lg p-2.5 flex-shrink-0 ${iconBg}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: 'Draft',
    accepting_bids: 'Accepting Bids',
    evaluating: 'Evaluating',
    completed: 'Completed',
  }
  return labels[status] || status
}

function getStatusBadgeClass(status: string) {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    accepting_bids: 'bg-green-100 text-green-700 border-green-200',
    evaluating: 'bg-amber-100 text-amber-700 border-amber-200',
    completed: 'bg-gray-100 text-gray-700 border-gray-200',
  }
  return classes[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

function formatBudget(value: number) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  return `$${(value / 1000).toFixed(0)}K`
}
