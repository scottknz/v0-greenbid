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
const mockSupplierRFPs = [
  {
    id: 'rfp-001',
    title: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    buyerCompany: 'Thistle Company',
    status: 'in_progress',
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
    status: 'submitted',
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
    status: 'awarded',
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
    status: 'invited',
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
    status: 'rejected',
    registeredAt: '2026-02-01',
    deadline: '2026-03-15',
    budget: '$50,000 - $75,000',
    category: 'Energy',
    submissionStatus: 'rejected',
    rejectedAt: '2026-03-20',
    completionPercent: 100,
  },
]

const STATUS_CONFIG = {
  invited: { label: 'Invited', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-800', icon: Clock },
  submitted: { label: 'Submitted', color: 'bg-purple-100 text-purple-800', icon: FileText },
  awarded: { label: 'Awarded', color: 'bg-brand-green-light text-brand-green', icon: CheckCircle },
  rejected: { label: 'Not Selected', color: 'bg-grey-100 text-grey-600', icon: XCircle },
}

export default function SupplierRFPsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  const filteredRFPs = mockSupplierRFPs.filter((rfp) => {
    const matchesSearch =
      rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.buyerCompany.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || rfp.status === statusFilter

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'invited' && rfp.status === 'invited') ||
      (activeTab === 'in_progress' && rfp.status === 'in_progress') ||
      (activeTab === 'submitted' && rfp.status === 'submitted') ||
      (activeTab === 'awarded' && rfp.status === 'awarded') ||
      (activeTab === 'archived' && (rfp.status === 'rejected' || rfp.status === 'awarded'))

    return matchesSearch && matchesStatus && matchesTab
  })

  const counts = {
    all: mockSupplierRFPs.length,
    invited: mockSupplierRFPs.filter((r) => r.status === 'invited').length,
    in_progress: mockSupplierRFPs.filter((r) => r.status === 'in_progress').length,
    submitted: mockSupplierRFPs.filter((r) => r.status === 'submitted').length,
    awarded: mockSupplierRFPs.filter((r) => r.status === 'awarded').length,
    archived: mockSupplierRFPs.filter((r) => r.status === 'rejected' || r.status === 'awarded').length,
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
          <TabsTrigger value="invited">Invited ({counts.invited})</TabsTrigger>
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

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="awarded">Awarded</SelectItem>
              <SelectItem value="rejected">Not Selected</SelectItem>
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
                  const statusConfig = STATUS_CONFIG[rfp.status as keyof typeof STATUS_CONFIG]
                  const StatusIcon = statusConfig.icon

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
                        <Badge className={cn('text-xs font-medium gap-1', statusConfig.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-text-primary">
                          <Calendar className="h-4 w-4 text-text-secondary" />
                          {new Date(rfp.deadline).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
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
                            <span>{rfp.completionPercent}%</span>
                          </div>
                          <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                rfp.completionPercent === 100
                                  ? 'bg-brand-green'
                                  : 'bg-amber-500'
                              )}
                              style={{ width: `${rfp.completionPercent}%` }}
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
