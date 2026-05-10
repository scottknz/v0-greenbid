'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
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
  DropdownMenuSeparator,
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Globe,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  mockSupplierRFPs, 
  SUPPLIER_PHASE_CONFIG,
  type SupplierRFPPhase 
} from '@/lib/mock-supplier-rfps'

type SortField = 'title' | 'phase' | 'buyer' | 'deadline' | 'budget' | null
type SortDirection = 'asc' | 'desc'

const phaseTabs = [
  { key: 'all', label: 'All' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'awarded', label: 'Awarded' },
  { key: 'archived', label: 'Archived' },
]

export default function SupplierRFPsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedRFPs, setSelectedRFPs] = useState<string[]>([])

  // Calculate counts
  const counts = useMemo(() => ({
    all: mockSupplierRFPs.length,
    in_progress: mockSupplierRFPs.filter(r => ['new_rfp', 'in_progress', 'under_final_review'].includes(r.currentPhase)).length,
    submitted: mockSupplierRFPs.filter(r => ['submitted', 'client_reviewing'].includes(r.currentPhase)).length,
    awarded: mockSupplierRFPs.filter(r => r.currentPhase === 'awarded').length,
    archived: mockSupplierRFPs.filter(r => r.currentPhase === 'rejected' || r.currentPhase === 'declined').length,
  }), [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = () => {
    if (selectedRFPs.length === filteredRFPs.length) {
      setSelectedRFPs([])
    } else {
      setSelectedRFPs(filteredRFPs.map(r => r.id))
    }
  }

  const handleSelectRFP = (id: string) => {
    setSelectedRFPs(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const filteredRFPs = useMemo(() => {
    let result = mockSupplierRFPs

    // Filter by tab
    if (activeTab === 'in_progress') {
      result = result.filter(r => ['new_rfp', 'in_progress', 'under_final_review'].includes(r.currentPhase))
    } else if (activeTab === 'submitted') {
      result = result.filter(r => ['submitted', 'client_reviewing'].includes(r.currentPhase))
    } else if (activeTab === 'awarded') {
      result = result.filter(r => r.currentPhase === 'awarded')
    } else if (activeTab === 'archived') {
      result = result.filter(r => r.currentPhase === 'rejected' || r.currentPhase === 'declined')
    }

    // Filter by phase dropdown
    if (phaseFilter !== 'all') {
      result = result.filter(r => r.currentPhase === phaseFilter)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.buyerCompany.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query)
      )
    }

    // Sort
    if (sortField) {
      result = [...result].sort((a, b) => {
        let comparison = 0
        switch (sortField) {
          case 'title':
            comparison = a.title.localeCompare(b.title)
            break
          case 'phase':
            const phaseOrder = ['new_rfp', 'in_progress', 'under_final_review', 'submitted', 'client_reviewing', 'awarded', 'rejected', 'declined']
            comparison = phaseOrder.indexOf(a.currentPhase) - phaseOrder.indexOf(b.currentPhase)
            break
          case 'buyer':
            comparison = a.buyerCompany.localeCompare(b.buyerCompany)
            break
          case 'deadline':
            comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            break
          case 'budget':
            // Parse budget strings like "$150,000 - $200,000" to get numeric value
            const parseVal = (s: string) => {
              const match = s.match(/\$?([\d,]+)/)
              return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0
            }
            comparison = parseVal(a.budget) - parseVal(b.budget)
            break
        }
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return result
  }, [activeTab, phaseFilter, searchQuery, sortField, sortDirection])

  const getDeadlineStatus = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
    if (days < 0) return { label: 'Overdue', className: 'text-red-600' }
    if (days <= 7) return { label: `${days}d left`, className: 'text-red-600 font-medium' }
    if (days <= 14) return { label: `${days}d left`, className: 'text-amber-600 font-medium' }
    return { label: `${days}d left`, className: 'text-[#6B7280]' }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="My RFPs"
          description="Manage and track your RFP responses"
        />
        <Link href="/supplier/marketplace">
          <Button variant="outline" className="gap-2 shrink-0">
            <Globe className="h-4 w-4" />
            Public Marketplace
            <ExternalLink className="h-3.5 w-3.5 text-[#9CA3AF]" />
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB]">
        <nav className="flex gap-6" aria-label="Tabs">
          {phaseTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative pb-3 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'text-[#16A34A]'
                  : 'text-[#6B7280] hover:text-[#111827]'
              )}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs',
                    activeTab === tab.key
                      ? 'bg-[#DCFCE7] text-[#16A34A]'
                      : 'bg-[#F3F4F6] text-[#6B7280]'
                  )}
                >
                  {counts[tab.key as keyof typeof counts]}
                </span>
              </span>
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16A34A]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <Input
            placeholder="Search RFPs by title, buyer, or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 border-[#E5E7EB] bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          {selectedRFPs.length > 0 && (
            <span className="text-sm text-[#6B7280] mr-2">
              {selectedRFPs.length} selected
            </span>
          )}
          <Select value={phaseFilter} onValueChange={setPhaseFilter}>
            <SelectTrigger className="w-44 border-[#E5E7EB]">
              <Filter className="h-4 w-4 mr-2 text-[#6B7280]" />
              <SelectValue placeholder="Filter by phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              <SelectItem value="new_rfp">Initial Review</SelectItem>
              <SelectItem value="in_progress">Preparation</SelectItem>
              <SelectItem value="under_final_review">Internal Review</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="client_reviewing">Client Review</SelectItem>
              <SelectItem value="awarded">Awarded</SelectItem>
              <SelectItem value="rejected">Not Successful</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="border-[#E5E7EB] gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="border-[#E5E7EB] bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRFPs.length === filteredRFPs.length && filteredRFPs.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-[#D1D5DB] text-[#16A34A] focus:ring-[#16A34A]"
                    />
                  </th>
                  <SortableHeader
                    label="RFP Title"
                    field="title"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Buyer"
                    field="buyer"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Phase"
                    field="phase"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                    Category
                  </th>
                  <SortableHeader
                    label="Deadline"
                    field="deadline"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Est. Value"
                    field="budget"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredRFPs.map(rfp => {
                  const phaseConfig = SUPPLIER_PHASE_CONFIG[rfp.currentPhase]
                  const deadlineStatus = getDeadlineStatus(rfp.deadline)
                  const isSelected = selectedRFPs.includes(rfp.id)

                  return (
                    <tr
                      key={rfp.id}
                      onClick={(e) => {
                        if (!(e.target as HTMLElement).closest('input, button, [role="menuitem"]')) {
                          router.push(`/supplier/rfps/${rfp.id}`)
                        }
                      }}
                      className={cn(
                        'hover:bg-[#F9FAFB] transition-colors cursor-pointer',
                        isSelected && 'bg-[#F0FDF4]'
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRFP(rfp.id)}
                          className="h-4 w-4 rounded border-[#D1D5DB] text-[#16A34A] focus:ring-[#16A34A]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-[#111827] line-clamp-1">{rfp.title}</p>
                          <p className="text-xs text-[#9CA3AF]">{rfp.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-[#9CA3AF]" />
                          <span className="text-[#374151] text-sm">{rfp.buyerCompany}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={cn('rounded-full text-xs font-medium whitespace-nowrap border', phaseConfig.color)}
                        >
                          {phaseConfig.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">{rfp.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <p className="text-[#374151] text-sm">
                            {new Date(rfp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className={cn('text-xs', deadlineStatus.className)}>{deadlineStatus.label}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#374151] tabular-nums whitespace-nowrap">
                        {rfp.budget}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#16A34A] rounded-full"
                              style={{ width: `${phaseConfig.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#6B7280] tabular-nums">
                            {phaseConfig.progressPercent}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#6B7280] hover:text-[#111827]"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/supplier/rfps/${rfp.id}`)
                            }}
                          >
                            Open
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => router.push(`/supplier/rfps/${rfp.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                View Documents
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Decline RFP
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredRFPs.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-[#9CA3AF]">No RFPs found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B7280]">
          Showing {filteredRFPs.length} of {mockSupplierRFPs.length} RFPs
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-[#E5E7EB]" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="border-[#E5E7EB] bg-[#16A34A] text-white hover:bg-[#15803D]">
            1
          </Button>
          <Button variant="outline" size="sm" className="border-[#E5E7EB]">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

function SortableHeader({
  label,
  field,
  currentField,
  direction,
  onSort,
}: {
  label: string
  field: SortField
  currentField: SortField
  direction: SortDirection
  onSort: (field: SortField) => void
}) {
  const isActive = currentField === field

  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide cursor-pointer hover:bg-[#F3F4F6] transition-colors select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {isActive ? (
          direction === 'asc' ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-40" />
        )}
      </div>
    </th>
  )
}
