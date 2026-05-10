'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, Clock, MessageSquare, AlertCircle, ChevronRight, 
  Calendar, Building2, ArrowRight, Sparkles, MapPin, DollarSign,
  Tag
} from 'lucide-react'

export default function SupplierDashboard() {
  const router = useRouter()

  // Summary metrics
  const summary = {
    activeRfps: 5,
    requiresAttention: 3,
    newOpportunities: 4,
    proposalsDueThisWeek: 2,
    unansweredQuestions: 1,
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
    { 
      id: '5', 
      name: 'Renewable Energy Assessment', 
      buyer: 'GreenPower Inc',
      category: 'Energy',
      status: 'drafting',
      deadline: '2026-05-28',
      pendingQA: 2
    },
  ]

  // Requires Attention — urgent actions
  const attentionItems = [
    { 
      id: '1', 
      type: 'question',
      title: 'Answer buyer question',
      description: 'ISO certifications query',
      rfpName: 'Sustainable Packaging RFP',
      rfpId: '1',
      dueDate: '2026-05-10',
      urgency: 'overdue'
    },
    { 
      id: '2', 
      type: 'deadline',
      title: 'Submit proposal',
      description: 'Deadline approaching',
      rfpName: 'Supply Chain Audit',
      rfpId: '2',
      dueDate: '2026-05-12',
      urgency: 'soon'
    },
    { 
      id: '3', 
      type: 'approval',
      title: 'Internal approval needed',
      description: 'Pending team sign-off',
      rfpName: 'Carbon Reporting Tools',
      rfpId: '3',
      dueDate: '2026-05-15',
      urgency: 'normal'
    },
  ]

  // New Opportunities from marketplace
  const opportunities = [
    {
      id: '10',
      name: 'ESG Data Platform Implementation',
      buyer: 'CleanTech Corp',
      category: 'Software',
      deadline: '2026-05-25',
      budget: '$150K - $250K',
      location: 'Auckland, NZ',
    },
    {
      id: '11',
      name: 'Renewable Energy Audit',
      buyer: 'GreenPower Inc',
      category: 'Consulting',
      deadline: '2026-05-28',
      budget: '$75K - $120K',
      location: 'Wellington, NZ',
    },
    {
      id: '12',
      name: 'Circular Economy Strategy',
      buyer: 'EcoManufacturing Ltd',
      category: 'Strategy',
      deadline: '2026-06-01',
      budget: '$50K - $80K',
      location: 'Christchurch, NZ',
    },
    {
      id: '13',
      name: 'Carbon Offset Verification',
      buyer: 'NetZero Partners',
      category: 'Verification',
      deadline: '2026-06-05',
      budget: '$30K - $60K',
      location: 'Remote',
    },
  ]

  const daysUntilDeadline = (dateStr: string) => {
    const today = new Date('2026-05-10')
    const deadline = new Date(dateStr)
    const days = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'overdue': 
        return <Badge className="bg-red-100 text-red-700 border-red-200">Overdue</Badge>
      case 'soon': 
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Due Soon</Badge>
      default: 
        return <Badge className="bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]">Upcoming</Badge>
    }
  }

  const getDeadlineLabel = (days: number) => {
    if (days < 0) return 'Overdue'
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    return `${days}d`
  }

  const getDeadlineClass = (days: number) => {
    if (days < 0) return 'text-red-600 bg-red-50'
    if (days <= 3) return 'text-amber-600 bg-amber-50'
    return 'text-[#6B7280] bg-[#F3F4F6]'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'drafting': 
        return <Badge variant="outline" className="bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB] text-xs">Drafting</Badge>
      case 'submitted': 
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Submitted</Badge>
      case 'under_review': 
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Under Review</Badge>
      case 'awarded': 
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Awarded</Badge>
      default: 
        return <Badge variant="outline" className="text-xs">{status}</Badge>
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
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">Dashboard</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          You have <span className="font-medium text-[#111827]">{summary.proposalsDueThisWeek} proposals</span> due this week
          {summary.unansweredQuestions > 0 && (
            <> and <span className="font-medium text-amber-600">{summary.unansweredQuestions} unanswered question</span></>
          )}
        </p>
      </div>

      {/* Metric cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/supplier/rfps"
          className="group flex items-center gap-4 p-4 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#16A34A] hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-center h-11 w-11 rounded-lg bg-[#F0FDF4]">
            <FileText className="h-5 w-5 text-[#16A34A]" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-[#111827]">{summary.activeRfps}</p>
            <p className="text-sm text-[#6B7280]">Active RFPs</p>
          </div>
          <ChevronRight className="h-5 w-5 text-[#D1D5DB] group-hover:text-[#16A34A] transition-colors" />
        </Link>

        <Link 
          href="/supplier/rfps?filter=attention"
          className="group flex items-center gap-4 p-4 rounded-lg border border-[#E5E7EB] bg-white hover:border-amber-500 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-center h-11 w-11 rounded-lg bg-amber-50">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-[#111827]">{summary.requiresAttention}</p>
            <p className="text-sm text-[#6B7280]">Requires Attention</p>
          </div>
          <ChevronRight className="h-5 w-5 text-[#D1D5DB] group-hover:text-amber-500 transition-colors" />
        </Link>

        <Link 
          href="/supplier/marketplace"
          className="group flex items-center gap-4 p-4 rounded-lg border border-[#E5E7EB] bg-white hover:border-blue-500 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-center h-11 w-11 rounded-lg bg-blue-50">
            <Sparkles className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold text-[#111827]">{summary.newOpportunities}</p>
            <p className="text-sm text-[#6B7280]">New Opportunities</p>
          </div>
          <ChevronRight className="h-5 w-5 text-[#D1D5DB] group-hover:text-blue-500 transition-colors" />
        </Link>
      </div>

      {/* Two column layout: Active RFPs (left, wider) + Requires Attention (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left column: My Active RFPs (spans 2.5 of 4) */}
        <Card className="lg:col-span-3 border-[#E5E7EB]">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#111827] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#16A34A]" />
                My Active RFPs
              </CardTitle>
              <Badge variant="secondary" className="bg-[#F3F4F6] text-[#6B7280]">{activeRfps.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium text-[#6B7280] uppercase tracking-wide border-b border-[#E5E7EB]">
              <div className="col-span-5">RFP Name</div>
              <div className="col-span-2">Buyer</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Deadline</div>
              <div className="col-span-1 text-center">Q&A</div>
            </div>
            {/* Table rows */}
            <div className="divide-y divide-[#F3F4F6]">
              {activeRfps.map((rfp) => {
                const days = daysUntilDeadline(rfp.deadline)
                return (
                  <div
                    key={rfp.id}
                    onClick={() => router.push(`/supplier/rfps/${rfp.id}`)}
                    className="grid grid-cols-12 gap-3 px-3 py-3 items-center cursor-pointer hover:bg-[#F9FAFB] transition-colors group"
                  >
                    <div className="col-span-5 min-w-0">
                      <p className="text-sm font-medium text-[#111827] group-hover:text-[#16A34A] truncate">{rfp.name}</p>
                      <p className="text-xs text-[#9CA3AF] truncate">{rfp.category}</p>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <p className="text-sm text-[#374151] truncate">{rfp.buyer}</p>
                    </div>
                    <div className="col-span-2">
                      {getStatusBadge(rfp.status)}
                    </div>
                    <div className="col-span-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getDeadlineClass(days)}`}>
                        {getDeadlineLabel(days)}
                      </span>
                    </div>
                    <div className="col-span-1 text-center">
                      {rfp.pendingQA > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                          <MessageSquare className="h-3 w-3" />
                          {rfp.pendingQA}
                        </span>
                      ) : (
                        <span className="text-xs text-[#D1D5DB]">-</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Table footer */}
            <div className="pt-3 border-t border-[#E5E7EB] mt-2">
              <Link href="/supplier/rfps" className="text-sm text-[#16A34A] hover:underline font-medium flex items-center gap-1">
                View all RFPs
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Right column: Requires Attention (spans 1 of 4) */}
        <Card className="lg:col-span-1 border-[#E5E7EB]">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#111827] flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Requires Attention
                </CardTitle>
                <Badge variant="secondary" className="bg-amber-50 text-amber-700">{attentionItems.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-[#6B7280] uppercase tracking-wide border-b border-[#E5E7EB]">
                <div className="col-span-7">Action</div>
                <div className="col-span-5">Due</div>
              </div>
              {/* Table rows */}
              <div className="divide-y divide-[#F3F4F6]">
                {attentionItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/supplier/rfps/${item.rfpId}`)}
                    className="grid grid-cols-12 gap-2 px-3 py-3 items-center cursor-pointer hover:bg-amber-50/50 transition-colors group"
                  >
                    <div className="col-span-7 min-w-0 flex items-start gap-2">
                      <div className="mt-0.5 shrink-0">{getTypeIcon(item.type)}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#111827] group-hover:text-amber-700 truncate">{item.title}</p>
                        <p className="text-xs text-[#9CA3AF] truncate">{item.rfpName}</p>
                      </div>
                    </div>
                    <div className="col-span-5">
                      {getUrgencyBadge(item.urgency)}
                    </div>
                  </div>
                ))}
              </div>
              {/* Table footer */}
              <div className="pt-3 border-t border-[#E5E7EB] mt-2">
                <Link href="/supplier/rfps?filter=attention" className="text-sm text-amber-600 hover:underline font-medium flex items-center gap-1">
                  View all tasks
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

      {/* Full-width New Opportunities at bottom */}
      <Card className="border-[#E5E7EB]">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#111827] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  New Opportunities
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">{opportunities.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-[#6B7280] uppercase tracking-wide border-b border-[#E5E7EB]">
                <div className="col-span-6">Opportunity</div>
                <div className="col-span-3">Budget</div>
                <div className="col-span-3">Deadline</div>
              </div>
              {/* Table rows */}
              <div className="divide-y divide-[#F3F4F6]">
                {opportunities.slice(0, 4).map((opp) => {
                  const days = daysUntilDeadline(opp.deadline)
                  return (
                    <div
                      key={opp.id}
                      onClick={() => router.push(`/supplier/marketplace/${opp.id}`)}
                      className="grid grid-cols-12 gap-2 px-3 py-3 items-center cursor-pointer hover:bg-blue-50/50 transition-colors group"
                    >
                      <div className="col-span-6 min-w-0">
                        <p className="text-sm font-medium text-[#111827] group-hover:text-blue-700 truncate">{opp.name}</p>
                        <p className="text-xs text-[#9CA3AF] truncate flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {opp.category}
                        </p>
                      </div>
                      <div className="col-span-3 min-w-0">
                        <p className="text-xs text-[#374151] truncate">{opp.budget}</p>
                      </div>
                      <div className="col-span-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getDeadlineClass(days)}`}>
                          {getDeadlineLabel(days)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* Table footer */}
              <div className="pt-3 border-t border-[#E5E7EB] mt-2">
                <Link href="/supplier/marketplace" className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1">
                  Browse Marketplace
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
