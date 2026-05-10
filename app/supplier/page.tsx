'use client'

import React from 'react'
import Link from 'next/link'
import { 
  FileText, Clock, MessageSquare, AlertCircle, ChevronRight, 
  Calendar, Building2, ArrowRight, Sparkles
} from 'lucide-react'

export default function SupplierDashboard() {
  // Mock data - contextual summary
  const summary = {
    proposalsDueThisWeek: 2,
    unansweredQuestions: 1,
    activeRfps: 5,
    pendingQuestions: 1,
    nextDeadlineDays: 2,
  }

  // Requires Attention items - urgent actions
  const attentionItems = [
    { 
      id: '1', 
      type: 'question',
      title: 'Answer question: "ISO certifications"',
      rfpName: 'Sustainable Packaging RFP',
      rfpId: '1',
      dueDate: 'Today',
      urgency: 'overdue'
    },
    { 
      id: '2', 
      type: 'deadline',
      title: 'Submit proposal',
      rfpName: 'Supply Chain Audit Services',
      rfpId: '2',
      dueDate: '2 days',
      urgency: 'soon'
    },
    { 
      id: '3', 
      type: 'feedback',
      title: 'Review buyer feedback',
      rfpName: 'Carbon Reporting Tools',
      rfpId: '3',
      dueDate: '5 days',
      urgency: 'normal'
    },
  ]

  // Active RFPs
  const activeRfps = [
    { 
      id: '1', 
      name: 'Sustainable Packaging RFP', 
      buyer: 'EcoRetail Inc',
      status: 'drafting',
      deadline: '2 days',
      pendingQA: 1
    },
    { 
      id: '2', 
      name: 'Supply Chain Audit Services', 
      buyer: 'GreenLogistics Ltd',
      status: 'submitted',
      deadline: '5 days',
      pendingQA: 0
    },
    { 
      id: '3', 
      name: 'Carbon Reporting Tools', 
      buyer: 'NetZero Corp',
      status: 'under_review',
      deadline: '10 days',
      pendingQA: 0
    },
    { 
      id: '4', 
      name: 'ESG Compliance Audit', 
      buyer: 'CleanTech Corp',
      status: 'drafting',
      deadline: '14 days',
      pendingQA: 0
    },
  ]

  // New Opportunities from marketplace
  const opportunities = [
    {
      id: '5',
      name: 'ESG Data Platform Implementation',
      buyer: 'CleanTech Corp',
      deadline: 'May 20',
      value: '$150,000 - $250,000'
    },
    {
      id: '6',
      name: 'Renewable Energy Audit',
      buyer: 'GreenPower Inc',
      deadline: 'May 25',
      value: '$75,000 - $120,000'
    },
  ]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200'
      case 'soon': return 'text-amber-600 bg-amber-50 border-amber-200'
      default: return 'text-[#6B7280] bg-[#F9FAFB] border-[#E5E7EB]'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'drafting': 
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#F3F4F6] text-[#6B7280]">Drafting</span>
      case 'submitted': 
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700">Submitted</span>
      case 'under_review': 
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-700">Under Review</span>
      case 'awarded': 
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-700">Awarded</span>
      default: 
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#F3F4F6] text-[#6B7280]">{status}</span>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return <MessageSquare className="h-4 w-4 text-blue-600" />
      case 'deadline': return <Clock className="h-4 w-4 text-amber-600" />
      case 'feedback': return <AlertCircle className="h-4 w-4 text-[#6B7280]" />
      default: return <FileText className="h-4 w-4 text-[#6B7280]" />
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header with contextual summary */}
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">Dashboard</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          You have <span className="font-medium text-[#111827]">{summary.proposalsDueThisWeek} proposals</span> due this week
          {summary.unansweredQuestions > 0 && (
            <> and <span className="font-medium text-amber-600">{summary.unansweredQuestions} unanswered question</span></>
          )}
        </p>
      </div>

      {/* Metric Cards - 3 columns, clickable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/supplier/rfps?status=active"
          className="group flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#16A34A] hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#F0FDF4]">
            <FileText className="h-5 w-5 text-[#16A34A]" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-[#111827]">{summary.activeRfps}</p>
            <p className="text-xs text-[#6B7280]">Active RFPs</p>
          </div>
          <ChevronRight className="h-4 w-4 text-[#D1D5DB] group-hover:text-[#16A34A] transition-colors" />
        </Link>

        <Link 
          href="/supplier/messages?filter=questions"
          className="group flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-blue-500 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-50">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-[#111827]">{summary.pendingQuestions}</p>
            <p className="text-xs text-[#6B7280]">Pending Questions</p>
          </div>
          <ChevronRight className="h-4 w-4 text-[#D1D5DB] group-hover:text-blue-500 transition-colors" />
        </Link>

        <Link 
          href="/supplier/rfps/1"
          className="group flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-amber-500 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-amber-50">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-[#111827]">{summary.nextDeadlineDays}d</p>
            <p className="text-xs text-[#6B7280]">Next Deadline</p>
          </div>
          <ChevronRight className="h-4 w-4 text-[#D1D5DB] group-hover:text-amber-500 transition-colors" />
        </Link>
      </div>

      {/* Main Content - Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Requires Attention */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-[#E5E7EB] bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-semibold text-[#111827]">Requires Attention</h2>
              <span className="text-xs font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
                {attentionItems.length}
              </span>
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              {attentionItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/supplier/rfps/${item.rfpId}`}
                  className="flex items-start gap-3 p-4 hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="mt-0.5">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111827] truncate">{item.title}</p>
                    <p className="text-xs text-[#6B7280] truncate mt-0.5">{item.rfpName}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getUrgencyColor(item.urgency)}`}>
                    {item.dueDate}
                  </span>
                </Link>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-[#E5E7EB]">
              <Link href="/supplier/rfps" className="text-xs font-medium text-[#16A34A] hover:text-[#15803D] flex items-center gap-1">
                View all tasks <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right: My Active RFPs */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-[#E5E7EB] bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-semibold text-[#111827]">My Active RFPs</h2>
              <Link href="/supplier/rfps" className="text-xs font-medium text-[#16A34A] hover:text-[#15803D] flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              {activeRfps.slice(0, 4).map((rfp) => (
                <Link
                  key={rfp.id}
                  href={`/supplier/rfps/${rfp.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111827] truncate">{rfp.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="h-3 w-3 text-[#9CA3AF]" />
                      <p className="text-xs text-[#6B7280] truncate">{rfp.buyer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(rfp.status)}
                    {rfp.pendingQA > 0 && (
                      <span className="flex items-center gap-1 text-xs text-blue-600">
                        <MessageSquare className="h-3 w-3" />
                        {rfp.pendingQA}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                      <Calendar className="h-3 w-3" />
                      {rfp.deadline}
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#D1D5DB]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Opportunities */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#16A34A]" />
            <h2 className="text-sm font-semibold text-[#111827]">New Opportunities</h2>
          </div>
          <Link href="/marketplace" className="text-xs font-medium text-[#16A34A] hover:text-[#15803D] flex items-center gap-1">
            Browse Marketplace <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
          {opportunities.map((opp) => (
            <Link
              key={opp.id}
              href={`/marketplace/${opp.id}`}
              className="flex items-center justify-between p-4 hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#111827] truncate">{opp.name}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{opp.buyer}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs font-medium text-[#111827]">{opp.deadline}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{opp.value}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
