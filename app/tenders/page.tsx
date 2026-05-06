"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardShell } from "@/components/shell/DashboardShell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Copy,
  Archive,
  Filter,
  Download,
  FileText,
} from "lucide-react"
import { getAllRFPs, deleteRFP } from "@/lib/mock-rfp"
import type { RFPDocument } from "@/types/rfp"

type TenderStatus = "draft" | "open" | "active" | "evaluation" | "closed"
type SortField = "name" | "status" | "category" | "deadline" | "budget" | null
type SortDirection = "asc" | "desc"

export default function TendersPage() {
  const router = useRouter()
  const [rfps, setRfps] = useState<RFPDocument[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedTenders, setSelectedTenders] = useState<string[]>([])

  // Load RFPs from the store
  useEffect(() => {
    const loadRFPs = () => {
      const allRfps = getAllRFPs()
      setRfps(allRfps)
    }
    loadRFPs()
    
    // Refresh every 2 seconds to catch new RFPs
    const interval = setInterval(loadRFPs, 2000)
    return () => clearInterval(interval)
  }, [])

  const statusTabs = useMemo(() => [
    { key: "all", label: "All", count: rfps.length },
    { key: "draft", label: "Draft", count: rfps.filter(t => t.status === "draft").length },
    { key: "open", label: "Open", count: rfps.filter(t => t.status === "open").length },
    { key: "active", label: "Active", count: rfps.filter(t => t.status === "active").length },
    { key: "evaluation", label: "Evaluation", count: rfps.filter(t => t.status === "evaluation").length },
    { key: "closed", label: "Closed", count: rfps.filter(t => t.status === "closed").length },
  ], [rfps])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = () => {
    if (selectedTenders.length === filteredTenders.length) {
      setSelectedTenders([])
    } else {
      setSelectedTenders(filteredTenders.map(t => t.id))
    }
  }

  const handleSelectTender = (id: string) => {
    setSelectedTenders(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const handleArchive = (id: string) => {
    deleteRFP(id)
    setRfps(getAllRFPs())
  }

  const filteredTenders = useMemo(() => {
    let result = rfps

    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter(t => t.status === activeTab)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          t.id.toLowerCase().includes(query) ||
          t.projectInfo?.category?.toLowerCase().includes(query) ||
          t.projectInfo?.primaryContact?.toLowerCase().includes(query)
      )
    }

    // Sort
    if (sortField) {
      result = [...result].sort((a, b) => {
        let comparison = 0

        switch (sortField) {
          case "name":
            comparison = a.title.localeCompare(b.title)
            break
          case "status":
            const statusOrder = { draft: 0, open: 1, active: 2, evaluation: 3, closed: 4 }
            comparison = (statusOrder[a.status as TenderStatus] || 0) - (statusOrder[b.status as TenderStatus] || 0)
            break
          case "category":
            comparison = (a.projectInfo?.category || '').localeCompare(b.projectInfo?.category || '')
            break
          case "deadline":
            const dateA = a.projectInfo?.submissionDeadline ? new Date(a.projectInfo.submissionDeadline).getTime() : 0
            const dateB = b.projectInfo?.submissionDeadline ? new Date(b.projectInfo.submissionDeadline).getTime() : 0
            comparison = dateA - dateB
            break
          case "budget":
            comparison = (a.projectInfo?.expectedBudget || 0) - (b.projectInfo?.expectedBudget || 0)
            break
        }

        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    return result
  }, [rfps, activeTab, searchQuery, sortField, sortDirection])

  const formatBudget = (value: number | undefined) => {
    if (!value) return '-'
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]" },
    open: { label: "Open", className: "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20" },
    active: { label: "Active", className: "bg-blue-50 text-blue-700 border-blue-200" },
    evaluation: { label: "Evaluation", className: "bg-amber-50 text-amber-700 border-amber-200" },
    closed: { label: "Closed", className: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]" },
  }

  return (
    <DashboardShell>
      <div className="space-y-6 p-5">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">
              RFPs
            </h1>
            <p className="text-sm text-[#6B7280]">
              Manage and track all your procurement RFPs
            </p>
          </div>
          <Link href="/rfp/create">
            <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white">
              <Plus className="size-4 mr-2" />
              Create RFP
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#E5E7EB]">
          <nav className="flex gap-6" aria-label="Tabs">
            {statusTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-[#16A34A]"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === tab.key
                        ? "bg-[#F0FDF4] text-[#16A34A]"
                        : "bg-[#F3F4F6] text-[#6B7280]"
                    }`}
                  >
                    {tab.count}
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search RFPs by name, ID, category, or owner..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 border-[#E5E7EB] bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            {selectedTenders.length > 0 && (
              <span className="text-sm text-[#6B7280] mr-2">
                {selectedTenders.length} selected
              </span>
            )}
            <Button variant="outline" size="sm" className="border-[#E5E7EB]">
              <Filter className="size-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="border-[#E5E7EB]">
              <Download className="size-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Table or Empty State */}
        {rfps.length === 0 ? (
          <Card className="border-[#E5E7EB] bg-white">
            <CardContent className="py-16 text-center">
              <FileText className="size-12 mx-auto text-[#9CA3AF] mb-4" />
              <h3 className="text-lg font-medium text-[#111827] mb-2">No RFPs yet</h3>
              <p className="text-[#6B7280] mb-6 max-w-sm mx-auto">
                Get started by creating your first RFP. You can save it as a draft and continue working on it later.
              </p>
              <Link href="/rfp/create">
                <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white">
                  <Plus className="size-4 mr-2" />
                  Create Your First RFP
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-[#E5E7EB] bg-white overflow-hidden pt-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedTenders.length === filteredTenders.length && filteredTenders.length > 0}
                          onChange={handleSelectAll}
                          className="size-4 rounded border-[#D1D5DB] text-[#16A34A] focus:ring-[#16A34A]"
                        />
                      </th>
                      <SortableHeader
                        label="RFP Name"
                        field="name"
                        currentField={sortField}
                        direction={sortDirection}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        label="Status"
                        field="status"
                        currentField={sortField}
                        direction={sortDirection}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        label="Category"
                        field="category"
                        currentField={sortField}
                        direction={sortDirection}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        label="Deadline"
                        field="deadline"
                        currentField={sortField}
                        direction={sortDirection}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        label="Budget"
                        field="budget"
                        currentField={sortField}
                        direction={sortDirection}
                        onSort={handleSort}
                      />
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                        Owner
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredTenders.map(rfp => {
                      const isSelected = selectedTenders.includes(rfp.id)
                      const { label, className } = statusConfig[rfp.status] || statusConfig.draft

                      return (
                        <tr 
                          key={rfp.id}
                          className={`hover:bg-[#F3F4F6] transition-colors cursor-pointer ${isSelected ? "bg-[#F0FDF4]" : ""}`}
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest('input, button, [role="menuitem"]')) return
                            // For drafts, go to editor. For others, go to view page
                            if (rfp.status === 'draft') {
                              router.push(`/rfp/${rfp.id}/edit`)
                            } else {
                              router.push(`/tenders/${rfp.id}`)
                            }
                          }}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectTender(rfp.id)}
                              className="size-4 rounded border-[#D1D5DB] text-[#16A34A] focus:ring-[#16A34A]"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-[#111827]">{rfp.title || rfp.projectInfo?.projectName || 'Untitled RFP'}</p>
                              <p className="text-xs text-[#6B7280]">{rfp.projectInfo?.referenceId || rfp.id}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={`rounded-full text-xs font-medium whitespace-nowrap ${className}`}
                            >
                              {label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-[#6B7280]">{rfp.projectInfo?.category || '-'}</td>
                          <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                            {formatDate(rfp.projectInfo?.submissionDeadline)}
                          </td>
                          <td className="px-4 py-3 text-[#6B7280] tabular-nums whitespace-nowrap">
                            {rfp.projectInfo?.budgetConfidential ? 'Confidential' : formatBudget(rfp.projectInfo?.expectedBudget)}
                          </td>
                          <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                            {rfp.projectInfo?.primaryContact || '-'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="size-8 p-0">
                                  <MoreHorizontal className="size-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => router.push(`/tenders/${rfp.id}`)}>
                                  <Eye className="size-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/rfp/${rfp.id}/edit`)}>
                                  <Pencil className="size-4 mr-2" />
                                  {rfp.status === 'draft' ? 'Continue Editing' : 'Edit'}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="size-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleArchive(rfp.id)}
                                >
                                  <Archive className="size-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {filteredTenders.length === 0 && rfps.length > 0 && (
                  <div className="py-12 text-center">
                    <p className="text-[#6B7280]">No RFPs found matching your criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {filteredTenders.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#6B7280]">
              Showing {filteredTenders.length} of {rfps.length} RFPs
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
        )}
      </div>
    </DashboardShell>
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
      className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide cursor-pointer hover:bg-[#E5E7EB] transition-colors select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {isActive ? (
          direction === "asc" ? (
            <ArrowUp className="size-3" />
          ) : (
            <ArrowDown className="size-3" />
          )
        ) : (
          <ArrowUpDown className="size-3 opacity-40" />
        )}
      </div>
    </th>
  )
}
