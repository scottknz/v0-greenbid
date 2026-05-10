'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, Clock, MessageSquare, AlertCircle, ChevronRight, 
  Calendar, Building2, ArrowRight, Sparkles, MapPin, DollarSign,
  Tag, Users, Settings, HelpCircle, TrendingUp
} from 'lucide-react'

export default function SupplierDashboard() {
  // Summary metrics
  const summary = {
    activeRfps: 5,
    requiresAttention: 3,
    newOpportunities: 4,
    proposalsDueThisWeek: 2,
    unansweredQuestions: 1,
    winRate: 32,
  }

  // Active RFPs — supplier's current proposals
  const activeRfps = [
    { 
      id: '1', 
      name: 'Sustainable Packaging RFP', 
      buyer: 'EcoRetail Inc',
      category: 'Packaging',
      status: 'drafting',
      deadline: '2026-05-12',
      pendingQA: 1
    },
    { 
      id: '2', 
      name: 'Supply Chain Audit Services', 
      buyer: 'GreenLogistics Ltd',
      category: 'Consulting',
      status: 'submitted',
      deadline: '2026-05-15',
      pendingQA: 0
    },
    { 
      id: '3', 
      name: 'Carbon Reporting Tools', 
      buyer: 'NetZero Corp',
      category: 'Software',
      status: 'under_review',
      deadline: '2026-05-20',
      pendingQA: 0
    },
    { 
      id: '4', 
      name: 'ESG Compliance Audit', 
      buyer: 'CleanTech Corp',
      category: 'Consulting',
      status: 'drafting',
      deadline: '2026-05-24',
      pendingQA: 0
    },
  ]

  // Requires Attention — urgent actions
  const attentionItems = [
    { 
      id: '1', 
      type: 'question',
      title: 'Answer question: "ISO certifications"',
      rfpName: 'Sustainable Packaging RFP',
      rfpId: '1',
      dueDate: '2026-05-10',
      urgency: 'overdue'
    },
    { 
      id: '2', 
      type: 'deadline',
      title: 'Submit proposal',
      rfpName: 'Supply Chain Audit Services',
      rfpId: '2',
      dueDate: '2026-05-12',
      urgency: 'soon'
    },
    { 
      id: '3', 
      type: 'approval',
      title: 'Internal approval required',
      rfpName: 'Carbon Reporting Tools',
      rfpId: '3',
      dueDate: '2026-05-15',
      urgency: 'normal'
    },
  ]

  // New Opportunities from marketplace — single-column with more details
  const opportunities = [
    {
      id: '10',
      name: 'ESG Data Platform Implementation',
      buyer: 'CleanTech Corp',
      category: 'Software',
      deadline: '2026-05-25',
      budget: '$150,000 - $250,000',
      location: 'Auckland, NZ',
    },
    {
      id: '11',
      name: 'Renewable Energy Audit',
      buyer: 'GreenPower Inc',
      category: 'Consulting',
      deadline: '2026-05-28',
      budget: '$75,000 - $120,000',
      location: 'Wellington, NZ',
    },
    {
      id: '12',
      name: 'Circular Economy Strategy',
      buyer: 'EcoManufacturing Ltd',
      category: 'Strategy',
      deadline: '2026-06-01',
      budget: '$50,000 - $80,000',
      location: 'Christchurch, NZ',
    },
    {
      id: '13',
      name: 'Carbon Offset Verification',
      buyer: 'NetZero Partners',
      category: 'Verification',
      deadline: '2026-06-05',
      budget: '$30,000 - $60,000',
      location: 'Remote',
    },
  ]

  // Recent activity
  const recentActivity = [
    { id: '1', action: 'Proposal submitted', rfp: 'Supply Chain Audit', time: '2 hours ago' },
    { id: '2', action: 'Question answered', rfp: 'Carbon Reporting Tools', time: '5 hours ago' },
    { id: '3', action: 'Document uploaded', rfp: 'ESG Compliance Audit', time: '1 day ago' },
  ]

  const daysUntilDeadline = (dateStr: string) => {
    const today = new Date('2026-05-10')
    const deadline = new Date(dateStr)
    const days = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'overdue': return 'text-red-700 bg-red-50 border-red-200'
      case 'soon': return 'text-amber-700 bg-amber-50 border-amber-200'
      default: return 'text-[#6B7280] bg-[#F9FAFB] border-[#E5E7EB]'
    }
  }

  const getUrgencyLabel = (days: number) => {
    if (days < 0) return 'Overdue'
    if (days === 0) return 'Due today'
    if (days === 1) return 'Due tomorrow'
    return `${days} days`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'drafting': 
        return <Badge variant="outline" className="bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]">Drafting</Badge>
      case 'submitted': 
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Submitted</Badge>
      case 'under_review': 
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Under Review</Badge>
      case 'awarded': 
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Awarded</Badge>
      default: 
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return <MessageSquare className="h-4 w-4 text-blue-600" />
      case 'deadline': return <Clock className="h-4 w-4 text-amber-600" />
      case 'approval': return <AlertCircle className="h-4 w-4 text-purple-600" />
      default: return <FileText className="h-4 w-4 text-[#6B7280]" />
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            You have <span className="font-medium text-[#111827]">{summary.proposalsDueThisWeek} proposals</span> due this week
            {summary.unansweredQuestions > 0 && (
              <> and <span className="font-medium text-amber-600">{summary.unansweredQuestions} unanswered question</span></>
            )}
          </p>
        </div>
      </div>

      {/* Three metric cards aligned with tables below */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active RFPs card */}
        <Link 
          href="/supplier/rfps"
          className="group flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#16A34A] hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#F0FDF4]">
            <FileText className="h-6 w-6 text-[#16A34A]" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-[#111827]">{summary.activeRfps}</p>
            <p className="text-sm text-[#6B7280]">Active RFPs</p>
          </div>
          <ChevronRight className="h-5 w-5 text-[#D1D5DB] group-hover:text-[#16A34A] transition-colors" />
        </Link>

        {/* New Opportunities card */}
        <Link 
          href="/supplier/marketplace"
          className="group flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-purple-500 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-50">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-[#111827]">{summary.newOpportunities}</p>
            <p className="text-sm text-[#6B7280]">New Opportunities</p>
          </div>
          <ChevronRight className="h-5 w-5 text-[#D1D5DB] group-hover:text-purple-500 transition-colors" />
        </Link>

        {/* Requires Attention card */}
        <Link 
          href="/supplier/rfps?filter=attention"
          className="group flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-amber-500 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-amber-50">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-[#111827]">{summary.requiresAttention}</p>
            <p className="text-sm text-[#6B7280]">Requires Attention</p>
          </div>
          <ChevronRight className="h-5 w-5 text-[#D1D5DB] group-hover:text-amber-500 transition-colors" />
        </Link>
      </div>

      {/* Three tables aligned with cards above */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Active RFPs — left column */}
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#16A34A]" />
                My Active RFPs
              </CardTitle>
              <Badge variant="secondary" className="bg-[#F3F4F6] text-[#6B7280]">{activeRfps.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {activeRfps.slice(0, 4).map((rfp) => {
                const days = daysUntilDeadline(rfp.deadline)
                return (
                  <Link
                    key={rfp.id}
                    href={`/supplier/rfps/${rfp.id}`}
                    className="block p-3 rounded-lg border border-[#E5E7EB] hover:border-[#16A34A] hover:bg-[#F9FAFB] transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-[#111827] group-hover:text-[#16A34A] line-clamp-1">{rfp.name}</p>
                      {rfp.pendingQA > 0 && (
                        <span className="flex items-center gap-1 text-xs text-blue-600 shrink-0">
                          <MessageSquare className="h-3 w-3" />
                          {rfp.pendingQA}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#6B7280] min-w-0">
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span className="truncate">{rfp.buyer}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusBadge(rfp.status)}
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${days <= 3 ? 'text-amber-700 bg-amber-50' : 'text-[#6B7280] bg-[#F3F4F6]'}`}>
                          {getUrgencyLabel(days)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            <Link href="/supplier/rfps">
              <Button variant="outline" size="sm" className="w-full mt-4 text-[#16A34A] border-[#16A34A] hover:bg-[#F0FDF4]">
                View all RFPs <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* New Opportunities — middle column, single-row format */}
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                New Opportunities
              </CardTitle>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700">{opportunities.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {opportunities.slice(0, 4).map((opp) => {
                const days = daysUntilDeadline(opp.deadline)
                return (
                  <Link
                    key={opp.id}
                    href={`/supplier/marketplace/${opp.id}`}
                    className="block p-3 rounded-lg border border-[#E5E7EB] hover:border-purple-400 hover:bg-purple-50/30 transition-all group"
                  >
                    <p className="text-sm font-medium text-[#111827] group-hover:text-purple-700 line-clamp-1 mb-2">{opp.name}</p>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-[#6B7280]">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span className="truncate">{opp.buyer}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-3 w-3 shrink-0" />
                        <span className="truncate">{opp.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-3 w-3 shrink-0" />
                        <span className="truncate">{opp.budget}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>{getUrgencyLabel(days)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{opp.location}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            <Link href="/supplier/marketplace">
              <Button variant="outline" size="sm" className="w-full mt-4 text-purple-600 border-purple-300 hover:bg-purple-50">
                Browse Marketplace <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Requires Attention — right column */}
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Requires Attention
              </CardTitle>
              <Badge variant="secondary" className="bg-amber-50 text-amber-700">{attentionItems.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {attentionItems.map((item) => {
                const days = daysUntilDeadline(item.dueDate)
                return (
                  <Link
                    key={item.id}
                    href={`/supplier/rfps/${item.rfpId}`}
                    className="block p-3 rounded-lg border border-[#E5E7EB] hover:border-amber-400 hover:bg-amber-50/30 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#111827] group-hover:text-amber-700 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-[#6B7280] truncate mt-0.5">{item.rfpName}</p>
                        <div className={`mt-2 text-xs font-medium px-2 py-0.5 rounded-full border w-fit ${getUrgencyColor(item.urgency)}`}>
                          {days < 0 ? 'Overdue' : days === 0 ? 'Due today' : `${days} days`}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            <Link href="/supplier/rfps?filter=attention">
              <Button variant="outline" size="sm" className="w-full mt-4 text-amber-600 border-amber-300 hover:bg-amber-50">
                View all tasks <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Recent Activity + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity — spans 2 columns */}
        <Card className="lg:col-span-2 border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#6B7280]" />
                Recent Activity
              </CardTitle>
              <Link href="/supplier/activity" className="text-xs font-medium text-[#16A34A] hover:text-[#15803D] flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-[#F3F4F6] last:border-0">
                  <div className="h-2 w-2 rounded-full bg-[#16A34A]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#111827]">
                      <span className="font-medium">{activity.action}</span>
                      <span className="text-[#6B7280]"> for </span>
                      <span className="font-medium">{activity.rfp}</span>
                    </p>
                  </div>
                  <span className="text-xs text-[#9CA3AF] shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links — right column */}
        <Card className="border-[#E5E7EB]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#111827]">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Link 
                href="/supplier/team" 
                className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors group"
              >
                <Users className="h-4 w-4 text-[#6B7280] group-hover:text-[#16A34A]" />
                <span className="text-sm text-[#374151] group-hover:text-[#111827]">Team Members</span>
                <ChevronRight className="h-4 w-4 text-[#D1D5DB] ml-auto" />
              </Link>
              <Link 
                href="/supplier/settings" 
                className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors group"
              >
                <Settings className="h-4 w-4 text-[#6B7280] group-hover:text-[#16A34A]" />
                <span className="text-sm text-[#374151] group-hover:text-[#111827]">Account Settings</span>
                <ChevronRight className="h-4 w-4 text-[#D1D5DB] ml-auto" />
              </Link>
              <Link 
                href="/supplier/help" 
                className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors group"
              >
                <HelpCircle className="h-4 w-4 text-[#6B7280] group-hover:text-[#16A34A]" />
                <span className="text-sm text-[#374151] group-hover:text-[#111827]">Help &amp; Support</span>
                <ChevronRight className="h-4 w-4 text-[#D1D5DB] ml-auto" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
