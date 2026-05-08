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
import { 
  mockSupplierRFPs, 
  SUPPLIER_PHASE_CONFIG,
  type SupplierRFPPhase 
} from '@/lib/mock-supplier-rfps'

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
      (activeTab === 'in_progress' && ['new_rfp', 'in_progress', 'under_final_review'].includes(rfp.currentPhase)) ||
      (activeTab === 'submitted' && ['submitted', 'client_reviewing'].includes(rfp.currentPhase)) ||
      (activeTab === 'awarded' && rfp.currentPhase === 'awarded') ||
      (activeTab === 'archived' && (rfp.currentPhase === 'rejected' || rfp.currentPhase === 'declined'))

    return matchesSearch && matchesPhase && matchesTab
  })

  const counts = {
    all: mockSupplierRFPs.length,
    in_progress: mockSupplierRFPs.filter((r) => ['new_rfp', 'in_progress', 'under_final_review'].includes(r.currentPhase)).length,
    submitted: mockSupplierRFPs.filter((r) => ['submitted', 'client_reviewing'].includes(r.currentPhase)).length,
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
              <SelectItem value="new_rfp">New RFP</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="under_final_review">Under Final Review</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="client_reviewing">Client Reviewing</SelectItem>
              <SelectItem value="awarded">Awarded</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="declined">Decline to Submit</SelectItem>
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
                  const phaseConfig = SUPPLIER_PHASE_CONFIG[rfp.currentPhase]
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
