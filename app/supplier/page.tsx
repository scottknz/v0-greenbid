'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText, Clock, MessageSquare, AlertCircle, ChevronRight,
  ArrowRight, Sparkles, MapPin, DollarSign, Tag, Building2,
  Calendar, Users, TrendingUp, CheckCircle2,
} from 'lucide-react'

export default function SupplierDashboard() {
  const router = useRouter()

  // Active RFPs the supplier is responding to
  const activeRfps = [
    {
      id: '1',
      name: 'Sustainable Packaging RFP',
      buyer: 'EcoRetail Inc',
      category: 'Packaging',
      status: 'drafting',
      deadline: '2026-05-12',
      daysLeft: 2,
      pendingQA: 1,
      completion: 65,
    },
    {
      id: '2',
      name: 'Supply Chain Audit Services',
      buyer: 'GreenLogistics Ltd',
      category: 'Consulting',
      status: 'submitted',
      deadline: '2026-05-15',
      daysLeft: 5,
      pendingQA: 0,
      completion: 100,
    },
    {
      id: '3',
      name: 'Carbon Reporting Tools',
      buyer: 'NetZero Corp',
      category: 'Software',
      status: 'under_review',
      deadline: '2026-05-20',
      daysLeft: 10,
      pendingQA: 0,
      completion: 100,
    },
    {
      id: '4',
      name: 'ESG Compliance Audit',
      buyer: 'CleanTech Corp',
      category: 'Consulting',
      status: 'drafting',
      deadline: '2026-05-24',
      daysLeft: 14,
      pendingQA: 0,
      completion: 30,
    },
    {
      id: '5',
      name: 'Renewable Energy Assessment',
      buyer: 'GreenPower Inc',
      category: 'Energy',
      status: 'drafting',
      deadline: '2026-05-28',
      daysLeft: 18,
      pendingQA: 2,
      completion: 20,
    },
  ]

  // Items that need the supplier's immediate action
  const attentionItems = [
    {
      id: '1',
      type: 'question',
      title: 'Answer buyer question',
      detail: 'ISO certifications query',
      rfpName: 'Sustainable Packaging RFP',
      rfpId: '1',
      urgency: 'overdue' as const,
    },
    {
      id: '2',
      type: 'deadline',
      title: 'Submit proposal',
      detail: 'Deadline in 2 days',
      rfpName: 'Sustainable Packaging RFP',
      rfpId: '1',
      urgency: 'soon' as const,
    },
    {
      id: '3',
      type: 'approval',
      title: 'Internal approval needed',
      detail: 'Pending team sign-off',
      rfpName: 'Carbon Reporting Tools',
      rfpId: '3',
      urgency: 'normal' as const,
    },
  ]

  // Marketplace opportunities matched to this supplier
  const opportunities = [
    {
      id: '10',
      name: 'ESG Data Platform Implementation',
      buyer: 'CleanTech Corp',
      category: 'Software',
      industry: 'Energy & Utilities',
      deadline: '2026-05-25',
      daysLeft: 15,
      budget: '$150K – $250K',
      location: 'Auckland, NZ',
      suppliers: 4,
      status: 'Open',
    },
    {
      id: '11',
      name: 'Renewable Energy Audit & Certification',
      buyer: 'GreenPower Inc',
      category: 'Consulting',
      industry: 'Renewables',
      deadline: '2026-05-28',
      daysLeft: 18,
      budget: '$75K – $120K',
      location: 'Wellington, NZ',
      suppliers: 7,
      status: 'Open',
    },
    {
      id: '12',
      name: 'Circular Economy Strategy Report',
      buyer: 'EcoManufacturing Ltd',
      category: 'Strategy',
      industry: 'Manufacturing',
      deadline: '2026-06-01',
      daysLeft: 22,
      budget: '$50K – $80K',
      location: 'Christchurch, NZ',
      suppliers: 2,
      status: 'Open',
    },
    {
      id: '13',
      name: 'Carbon Offset Verification & Reporting',
      buyer: 'NetZero Partners',
      category: 'Verification',
      industry: 'Finance',
      deadline: '2026-06-05',
      daysLeft: 26,
      budget: '$30K – $60K',
      location: 'Remote',
      suppliers: 9,
      status: 'Open',
    },
    {
      id: '14',
      name: 'Supply Chain Decarbonisation Plan',
      buyer: 'Global Retail Group',
      category: 'Strategy',
      industry: 'Retail',
      deadline: '2026-06-10',
      daysLeft: 31,
      budget: '$90K – $140K',
      location: 'Auckland, NZ',
      suppliers: 3,
      status: 'Open',
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'drafting':
        return <Badge variant="outline" className="bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB] text-xs font-normal">Drafting</Badge>
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-normal">Submitted</Badge>
      case 'under_review':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-normal">Under Review</Badge>
      case 'awarded':
        return <Badge variant="outline" className="bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20 text-xs font-normal">Awarded</Badge>
      default:
        return <Badge variant="outline" className="text-xs font-normal">{status}</Badge>
    }
  }

  const getDeadlineChip = (days: number) => {
    const label = days < 0 ? 'Overdue' : days === 0 ? 'Today' : days === 1 ? '1 day' : `${days} days`
    const cls = days < 0
      ? 'text-red-700 bg-red-50'
      : days <= 3
      ? 'text-amber-700 bg-amber-50'
      : 'text-[#6B7280] bg-[#F3F4F6]'
    return <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${cls}`}>{label}</span>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return <MessageSquare className="h-3.5 w-3.5 text-blue-600 shrink-0" />
      case 'deadline': return <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
      case 'approval': return <AlertCircle className="h-3.5 w-3.5 text-purple-600 shrink-0" />
      default: return <FileText className="h-3.5 w-3.5 text-[#6B7280] shrink-0" />
    }
  }

  const getUrgencyBadge = (urgency: 'overdue' | 'soon' | 'normal') => {
    switch (urgency) {
      case 'overdue': return <Badge className="bg-red-50 text-red-700 border-red-200 text-xs font-normal border">Overdue</Badge>
      case 'soon':    return <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-normal border">Due soon</Badge>
      default:        return <Badge className="bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB] text-xs font-normal border">Upcoming</Badge>
    }
  }

  const proposalsDueThisWeek = activeRfps.filter(r => r.daysLeft <= 7).length
  const unansweredQA = activeRfps.reduce((sum, r) => sum + r.pendingQA, 0)

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#111827]">Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            {proposalsDueThisWeek > 0 && (
              <><span className="font-medium text-[#111827]">{proposalsDueThisWeek} proposal{proposalsDueThisWeek > 1 ? 's' : ''}</span> due this week{unansweredQA > 0 ? ' · ' : ''}</>
            )}
            {unansweredQA > 0 && (
              <><span className="font-medium text-amber-600">{unansweredQA} unanswered question{unansweredQA > 1 ? 's' : ''}</span></>
            )}
            {proposalsDueThisWeek === 0 && unansweredQA === 0 && 'All caught up — no urgent actions.'}
          </p>
        </div>
      </div>

      {/* ── Row 1: Active RFPs (wide) + Requires Attention (narrow) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Active RFPs — spans 2 of 3 */}
        <Card className="lg:col-span-2 border-[#E5E7EB] bg-white">
          {/* Card header with embedded stat */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-[#F0FDF4]">
                <FileText className="h-4 w-4 text-[#16A34A]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#111827]">My Active RFPs</h2>
                <p className="text-xs text-[#6B7280]">{activeRfps.length} in progress</p>
              </div>
            </div>
            <Link href="/supplier/rfps" className="text-xs text-[#16A34A] hover:underline flex items-center gap-1 font-medium">
              View all RFPs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <CardContent className="p-0">
            {/* Column headers */}
            <div className="grid grid-cols-12 gap-3 px-5 py-2.5 border-b border-[#F3F4F6] bg-[#FAFAFA]">
              <div className="col-span-4 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">RFP / Buyer</div>
              <div className="col-span-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">Status</div>
              <div className="col-span-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">Deadline</div>
              <div className="col-span-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">Completion</div>
              <div className="col-span-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide text-center">Q&A</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#F3F4F6]">
              {activeRfps.map((rfp) => (
                <div
                  key={rfp.id}
                  onClick={() => router.push(`/supplier/rfps/${rfp.id}`)}
                  className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center cursor-pointer hover:bg-[#F9FAFB] group transition-colors"
                >
                  <div className="col-span-4 min-w-0">
                    <p className="text-sm font-medium text-[#111827] group-hover:text-[#16A34A] truncate transition-colors leading-snug">
                      {rfp.name}
                    </p>
                    <p className="text-xs text-[#9CA3AF] flex items-center gap-1 mt-0.5 truncate">
                      <Building2 className="h-3 w-3 shrink-0" />
                      {rfp.buyer}
                    </p>
                  </div>
                  <div className="col-span-2">
                    {getStatusBadge(rfp.status)}
                  </div>
                  <div className="col-span-2">
                    {getDeadlineChip(rfp.daysLeft)}
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#16A34A] rounded-full transition-all"
                          style={{ width: `${rfp.completion}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#6B7280] w-7 shrink-0 tabular-nums">{rfp.completion}%</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    {rfp.pendingQA > 0 ? (
                      <span className="inline-flex items-center justify-center gap-1 text-xs text-blue-600 font-medium">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {rfp.pendingQA}
                      </span>
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#D1D5DB] mx-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Requires Attention — spans 1 of 3 */}
        <Card className="lg:col-span-1 border-[#E5E7EB] bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#111827]">Requires Attention</h2>
                <p className="text-xs text-[#6B7280]">{attentionItems.length} action{attentionItems.length !== 1 ? 's' : ''} pending</p>
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            {/* Column headers */}
            <div className="grid grid-cols-12 gap-2 px-5 py-2.5 border-b border-[#F3F4F6] bg-[#FAFAFA]">
              <div className="col-span-7 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">Action</div>
              <div className="col-span-5 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">Status</div>
            </div>

            <div className="divide-y divide-[#F3F4F6]">
              {attentionItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/supplier/rfps/${item.rfpId}`)}
                  className="grid grid-cols-12 gap-2 px-5 py-3.5 items-start cursor-pointer hover:bg-amber-50/40 group transition-colors"
                >
                  <div className="col-span-7 flex items-start gap-2 min-w-0">
                    <div className="mt-0.5">{getTypeIcon(item.type)}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#111827] group-hover:text-amber-700 transition-colors truncate leading-snug">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{item.rfpName}</p>
                    </div>
                  </div>
                  <div className="col-span-5 pt-0.5">
                    {getUrgencyBadge(item.urgency)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer link */}
            <div className="px-5 py-3 border-t border-[#F3F4F6]">
              <Link href="/supplier/rfps?filter=attention" className="text-xs text-amber-600 hover:underline font-medium flex items-center gap-1">
                View all tasks <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: New Opportunities — full width ── */}
      <Card className="border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-50">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">New Opportunities</h2>
              <p className="text-xs text-[#6B7280]">{opportunities.length} matched to your profile</p>
            </div>
          </div>
          <Link href="/supplier/marketplace" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
            Browse Marketplace <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <CardContent className="p-0">
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-3 px-5 py-2.5 border-b border-[#F3F4F6] bg-[#FAFAFA]">
            <div className="col-span-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">Opportunity / Buyer</div>
            <div className="col-span-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">Category</div>
            <div className="col-span-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
              <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />Budget</span>
            </div>
            <div className="col-span-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Deadline</span>
            </div>
            <div className="col-span-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Location</span>
            </div>
            <div className="col-span-1 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide text-center">
              <span className="flex items-center gap-1 justify-center"><Users className="h-3 w-3" />Bids</span>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#F3F4F6]">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                onClick={() => router.push(`/supplier/marketplace/${opp.id}`)}
                className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center cursor-pointer hover:bg-blue-50/30 group transition-colors"
              >
                {/* Name + buyer */}
                <div className="col-span-3 min-w-0">
                  <p className="text-sm font-medium text-[#111827] group-hover:text-blue-700 truncate transition-colors leading-snug">
                    {opp.name}
                  </p>
                  <p className="text-xs text-[#9CA3AF] flex items-center gap-1 mt-0.5 truncate">
                    <Building2 className="h-3 w-3 shrink-0" />
                    {opp.buyer}
                  </p>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1 text-xs text-[#374151] bg-[#F3F4F6] px-2 py-0.5 rounded">
                    <Tag className="h-3 w-3 text-[#9CA3AF] shrink-0" />
                    {opp.category}
                  </span>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">{opp.industry}</p>
                </div>

                {/* Budget */}
                <div className="col-span-2">
                  <p className="text-sm text-[#374151] font-medium tabular-nums">{opp.budget}</p>
                </div>

                {/* Deadline */}
                <div className="col-span-2 flex flex-col gap-0.5">
                  {getDeadlineChip(opp.daysLeft)}
                  <p className="text-[11px] text-[#9CA3AF]">
                    {new Date(opp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <p className="text-sm text-[#374151] flex items-center gap-1 truncate">
                    <MapPin className="h-3.5 w-3.5 text-[#9CA3AF] shrink-0" />
                    {opp.location}
                  </p>
                </div>

                {/* Bids count */}
                <div className="col-span-1 text-center">
                  <span className="inline-flex items-center gap-1 text-xs text-[#6B7280]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {opp.suppliers}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
