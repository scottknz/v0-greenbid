'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data for supplier RFPs
export type RFPPhase = 'initial_review' | 'develop_proposal' | 'final_review' | 'submitted' | 'external_review' | 'awarded' | 'rejected' | 'declined'

export interface RFPPhaseTransition {
  phase: RFPPhase
  timestamp: string
  user: string
  notes?: string
}

const mockSupplierRFPs = [
  {
    id: 'rfp-001',
    title: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    buyerCompany: 'Thistle Company',
    currentPhase: 'develop_proposal' as RFPPhase,
    phaseHistory: [
      { phase: 'initial_review' as RFPPhase, timestamp: '2026-03-15T10:00:00Z', user: 'Sarah Chen', notes: 'RFP received and reviewed' },
      { phase: 'develop_proposal' as RFPPhase, timestamp: '2026-03-18T14:30:00Z', user: 'James Wilson', notes: 'Started proposal development' }
    ] as RFPPhaseTransition[],
    proposalNotes: [
      { timestamp: '2026-03-20T09:00:00Z', user: 'Sarah Chen', text: 'Need to gather additional data from clients' },
      { timestamp: '2026-03-22T15:00:00Z', user: 'James Wilson', text: 'Received all supporting documentation' }
    ],
    registeredAt: '2026-03-15',
    deadline: '2026-04-30',
    budget: '$150,000 - $200,000',
    category: 'Sustainability',
    submissionStatus: 'draft',
    completionPercent: 65,
  },
  {
    id: 'rfp-002',
    title: 'SBTi Target Setting & Validation Support',
    buyerCompany: 'GreenCorp Industries',
    currentPhase: 'external_review' as RFPPhase,
    phaseHistory: [
      { phase: 'initial_review' as RFPPhase, timestamp: '2026-03-10T10:00:00Z', user: 'Sarah Chen', notes: 'RFP reviewed' },
      { phase: 'develop_proposal' as RFPPhase, timestamp: '2026-03-11T09:00:00Z', user: 'Michael Park', notes: 'Proposal development started' },
      { phase: 'final_review' as RFPPhase, timestamp: '2026-04-08T16:00:00Z', user: 'Sarah Chen', notes: 'Final review completed' },
      { phase: 'submitted' as RFPPhase, timestamp: '2026-04-10T12:00:00Z', user: 'James Wilson', notes: 'Proposal submitted to buyer' },
      { phase: 'external_review' as RFPPhase, timestamp: '2026-04-11T08:00:00Z', user: 'System', notes: 'Automatically marked as under review' }
    ] as RFPPhaseTransition[],
    proposalNotes: [
      { timestamp: '2026-03-15T10:00:00Z', user: 'Sarah Chen', text: 'Completed SBTi documentation review' },
      { timestamp: '2026-04-08T14:00:00Z', user: 'Michael Park', text: 'Final proposal polish complete' }
    ],
    registeredAt: '2026-03-10',
    deadline: '2026-04-15',
    budget: '$80,000 - $120,000',
    category: 'Climate',
    submissionStatus: 'submitted',
    submittedAt: '2026-04-10',
    completionPercent: 100,
  },
  {
    id: 'rfp-003',
    title: 'Embodied Carbon Life Cycle Assessment (LCA)',
    buyerCompany: 'EcoBuilders Ltd',
    currentPhase: 'awarded' as RFPPhase,
    phaseHistory: [
      { phase: 'initial_review' as RFPPhase, timestamp: '2026-02-20T10:00:00Z', user: 'Sarah Chen', notes: 'RFP reviewed' },
      { phase: 'develop_proposal' as RFPPhase, timestamp: '2026-02-21T09:00:00Z', user: 'Emily Rodriguez', notes: 'Proposal development started' },
      { phase: 'final_review' as RFPPhase, timestamp: '2026-03-25T16:00:00Z', user: 'Sarah Chen', notes: 'Final review completed' },
      { phase: 'submitted' as RFPPhase, timestamp: '2026-03-29T14:00:00Z', user: 'James Wilson', notes: 'Proposal submitted' },
      { phase: 'external_review' as RFPPhase, timestamp: '2026-03-30T09:00:00Z', user: 'System', notes: 'Under buyer review' },
      { phase: 'awarded' as RFPPhase, timestamp: '2026-04-05T11:00:00Z', user: 'System', notes: 'Won the contract' }
    ] as RFPPhaseTransition[],
    proposalNotes: [
      { timestamp: '2026-03-20T10:00:00Z', user: 'Emily Rodriguez', text: 'LCA assessment finalized' }
    ],
    registeredAt: '2026-02-20',
    deadline: '2026-03-31',
    budget: '$200,000 - $280,000',
    category: 'Construction',
    submissionStatus: 'awarded',
    awardedAt: '2026-04-05',
    completionPercent: 100,
  },
  {
    id: 'rfp-004',
    title: 'ISSB (IFRS S1 & S2) Integration & Reporting',
    buyerCompany: 'Financial Services Corp',
    currentPhase: 'initial_review' as RFPPhase,
    phaseHistory: [
      { phase: 'initial_review' as RFPPhase, timestamp: '2026-04-01T10:00:00Z', user: 'Sarah Chen', notes: 'RFP received and reviewed' }
    ] as RFPPhaseTransition[],
    proposalNotes: [],
    registeredAt: '2026-04-01',
    deadline: '2026-05-15',
    budget: '$100,000 - $150,000',
    category: 'Reporting',
    submissionStatus: 'not_started',
    completionPercent: 0,
  },
  {
    id: 'rfp-005',
    title: 'Renewable Energy Procurement Strategy',
    buyerCompany: 'Manufacturing Plus',
    currentPhase: 'rejected' as RFPPhase,
    phaseHistory: [
      { phase: 'initial_review' as RFPPhase, timestamp: '2026-02-01T10:00:00Z', user: 'Sarah Chen', notes: 'RFP reviewed' },
      { phase: 'develop_proposal' as RFPPhase, timestamp: '2026-02-02T09:00:00Z', user: 'Alex Kumar', notes: 'Proposal development started' },
      { phase: 'final_review' as RFPPhase, timestamp: '2026-03-10T16:00:00Z', user: 'Sarah Chen', notes: 'Final review completed' },
      { phase: 'submitted' as RFPPhase, timestamp: '2026-03-14T12:00:00Z', user: 'James Wilson', notes: 'Proposal submitted' },
      { phase: 'external_review' as RFPPhase, timestamp: '2026-03-15T09:00:00Z', user: 'System', notes: 'Under buyer review' },
      { phase: 'rejected' as RFPPhase, timestamp: '2026-03-20T10:00:00Z', user: 'System', notes: 'Proposal not selected' }
    ] as RFPPhaseTransition[],
    proposalNotes: [
      { timestamp: '2026-03-10T14:00:00Z', user: 'Alex Kumar', text: 'Proposal finalized' }
    ],
    registeredAt: '2026-02-01',
    deadline: '2026-03-15',
    budget: '$50,000 - $75,000',
    category: 'Energy',
    submissionStatus: 'rejected',
    rejectedAt: '2026-03-20',
    completionPercent: 100,
  },
]

const PHASE_CONFIG = {
  initial_review: { label: 'Initial Review', color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', progressPercent: 14 },
  develop_proposal: { label: 'Develop Proposal', color: 'bg-amber-100 text-amber-800', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', progressPercent: 43 },
  final_review: { label: 'Final Review', color: 'bg-orange-100 text-orange-800', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', progressPercent: 57 },
  submitted: { label: 'Submitted', color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', progressPercent: 71 },
  external_review: { label: 'External Review', color: 'bg-indigo-100 text-indigo-800', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', progressPercent: 86 },
  awarded: { label: 'Awarded', color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50', borderColor: 'border-green-200', progressPercent: 100 },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50', borderColor: 'border-red-200', progressPercent: 100 },
  declined: { label: 'Declined', color: 'bg-gray-100 text-gray-800', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', progressPercent: 0 },
}

export default function SupplierRFPsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  const filteredRFPs = mockSupplierRFPs.filter((rfp) => {
    const matchesSearch =
      rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.buyerCompany.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPhase = phaseFilter === 'all' || rfp.currentPhase === phaseFilter

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'in_progress' && ['initial_review', 'develop_proposal', 'final_review'].includes(rfp.currentPhase)) ||
      (activeTab === 'submitted' && ['submitted', 'external_review'].includes(rfp.currentPhase)) ||
      (activeTab === 'awarded' && rfp.currentPhase === 'awarded') ||
      (activeTab === 'archived' && (rfp.currentPhase === 'rejected' || rfp.currentPhase === 'declined'))

    return matchesSearch && matchesPhase && matchesTab
  })

  const counts = {
    all: mockSupplierRFPs.length,
    in_progress: mockSupplierRFPs.filter((r) => ['initial_review', 'develop_proposal', 'final_review'].includes(r.currentPhase)).length,
    submitted: mockSupplierRFPs.filter((r) => ['submitted', 'external_review'].includes(r.currentPhase)).length,
    awarded: mockSupplierRFPs.filter((r) => r.currentPhase === 'awarded').length,
    archived: mockSupplierRFPs.filter((r) => r.currentPhase === 'rejected' || r.currentPhase === 'declined').length,
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">RFPs</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your RFP responses and track submission status
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-background border border-border">
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({counts.in_progress})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({counts.submitted})</TabsTrigger>
          <TabsTrigger value="awarded">Awarded ({counts.awarded})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({counts.archived})</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex flex-1 items-center gap-2 bg-white rounded-md border border-border px-3 py-2">
            <Search className="h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search RFPs by title or buyer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0"
            />
          </div>

          <Select value={phaseFilter} onValueChange={setPhaseFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              <SelectItem value="initial_review">Initial Review</SelectItem>
              <SelectItem value="develop_proposal">Develop Proposal</SelectItem>
              <SelectItem value="final_review">Final Review</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="external_review">External Review</SelectItem>
              <SelectItem value="awarded">Awarded</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          {/* RFPs Table */}
          <div className="border border-border rounded-lg overflow-hidden bg-white">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    RFP Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRFPs.map((rfp) => {
                  const phaseConfig = PHASE_CONFIG[rfp.currentPhase]
                  const daysDue = Math.ceil((new Date(rfp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  const isDeadlineSoon = daysDue <= 7 && daysDue > 0
                  const isOverdue = daysDue < 0

                  return (
                    <tr key={rfp.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <Link
                            href={`/supplier/rfps/${rfp.id}`}
                            className="font-medium text-text-primary hover:text-brand-green transition-colors"
                          >
                            {rfp.title}
                          </Link>
                          <p className="text-xs text-text-secondary mt-1">{rfp.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-text-secondary" />
                          <span className="text-sm text-text-primary">{rfp.buyerCompany}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn('text-xs font-medium', phaseConfig.color)}>
                          {phaseConfig.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn('flex items-center gap-2 text-sm', isOverdue ? 'text-red-600' : isDeadlineSoon ? 'text-amber-600' : 'text-text-primary')}>
                          <Calendar className="h-4 w-4" />
                          {new Date(rfp.deadline).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                          {isOverdue && <span className="text-xs font-medium text-red-600 ml-1">(OVERDUE)</span>}
                          {isDeadlineSoon && !isOverdue && <span className="text-xs font-medium text-amber-600 ml-1">(Due soon)</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-text-primary">
                          <DollarSign className="h-4 w-4 text-text-secondary" />
                          {rfp.budget}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full max-w-[120px]">
                          <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                            <span>{phaseConfig.progressPercent}%</span>
                          </div>
                          <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all bg-brand-green"
                              style={{ width: `${phaseConfig.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/supplier/rfps/${rfp.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {rfp.status === 'in_progress' && (
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Continue Response
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download RFP
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredRFPs.length === 0 && (
              <div className="text-center py-12 text-text-secondary">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No RFPs found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
