"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"

type TenderStatus = "draft" | "published" | "accepting_bids" | "evaluating" | "closed"
type SortField = "name" | "status" | "category" | "submissions" | "deadline" | "budget" | null
type SortDirection = "asc" | "desc"

type TenderData = {
  id: string
  name: string
  referenceId: string
  status: TenderStatus
  category: string
  submissions: number
  deadline: string
  budget: number
  owner: string
}

const allTendersData: TenderData[] = [
  {
    id: "1",
    name: "Comprehensive Scope 3 Value Chain Emissions Analysis",
    referenceId: "TND-2026-001",
    status: "accepting_bids",
    category: "Scope 3 / Value Chain",
    submissions: 8,
    deadline: "May 15, 2026",
    budget: 450000,
    owner: "Emma Thompson",
  },
  {
    id: "2",
    name: "SBTi Target Setting & Validation Support",
    referenceId: "TND-2026-002",
    status: "evaluating",
    category: "Target Setting (SBTi)",
    submissions: 12,
    deadline: "Apr 28, 2026",
    budget: 320000,
    owner: "James Wilson",
  },
  {
    id: "3",
    name: "Embodied Carbon Life Cycle Assessment (LCA)",
    referenceId: "TND-2026-003",
    status: "draft",
    category: "Life Cycle Assessment (LCA)",
    submissions: 0,
    deadline: "June 1, 2026",
    budget: 280000,
    owner: "Maria Garcia",
  },
  {
    id: "4",
    name: "ISSB (IFRS S1 & S2) Integration & Reporting",
    referenceId: "TND-2026-004",
    status: "closed",
    category: "Regulatory Reporting (ISSB/CSRD)",
    submissions: 15,
    deadline: "Mar 31, 2026",
    budget: 420000,
    owner: "Emma Thompson",
  },
  {
    id: "5",
    name: "Renewable Energy Procurement & VPPA Structuring",
    referenceId: "TND-2026-005",
    status: "accepting_bids",
    category: "Renewable Energy (PPA/VPPA)",
    submissions: 6,
    deadline: "May 22, 2026",
    budget: 95000,
    owner: "James Wilson",
  },
  {
    id: "6",
    name: "Sustainable Catering Services",
    referenceId: "TND-2026-006",
    status: "published",
    category: "Services",
    submissions: 3,
    deadline: "May 15, 2026",
    budget: 180000,
    owner: "Maria Garcia",
  },
  {
    id: "7",
    name: "Electric Vehicle Fleet",
    referenceId: "TND-2026-007",
    status: "published",
    category: "Transportation",
    submissions: 5,
    deadline: "May 20, 2026",
    budget: 850000,
    owner: "Sarah Chen",
  },
  {
    id: "8",
    name: "Solar Panel Installation",
    referenceId: "TND-2026-008",
    status: "evaluating",
    category: "Energy",
    submissions: 9,
    deadline: "Apr 5, 2026",
    budget: 520000,
    owner: "James Wilson",
  },
  {
    id: "9",
    name: "Recycled Paper Products",
    referenceId: "TND-2026-009",
    status: "closed",
    category: "Office Supplies",
    submissions: 11,
    deadline: "Feb 28, 2026",
    budget: 75000,
    owner: "Maria Garcia",
  },
  {
    id: "10",
    name: "Green Building Materials",
    referenceId: "TND-2026-010",
    status: "draft",
    category: "Construction",
    submissions: 0,
    deadline: "Jun 1, 2026",
    budget: 2100000,
    owner: "Sarah Chen",
  },
]

const statusTabs = [
  { key: "all", label: "All", count: allTendersData.length },
  { key: "draft", label: "Draft", count: allTendersData.filter(t => t.status === "draft").length },
  { key: "published", label: "Published", count: allTendersData.filter(t => t.status === "published").length },
  { key: "accepting_bids", label: "Accepting Bids", count: allTendersData.filter(t => t.status === "accepting_bids").length },
  { key: "evaluating", label: "Evaluating", count: allTendersData.filter(t => t.status === "evaluating").length },
  { key: "closed", label: "Closed", count: allTendersData.filter(t => t.status === "closed").length },
]

export default function TendersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedTenders, setSelectedTenders] = useState<string[]>([])

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

  const filteredTenders = useMemo(() => {
    let result = allTendersData

    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter(t => t.status === activeTab)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          t.referenceId.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.owner.toLowerCase().includes(query)
      )
    }

    // Sort
    if (sortField) {
      result = [...result].sort((a, b) => {
        let comparison = 0

        switch (sortField) {
          case "name":
            comparison = a.name.localeCompare(b.name)
            break
          case "status":
            const statusOrder = { draft: 0, published: 1, accepting_bids: 2, evaluating: 3, closed: 4 }
            comparison = statusOrder[a.status] - statusOrder[b.status]
            break
          case "category":
            comparison = a.category.localeCompare(b.category)
            break
          case "submissions":
            comparison = a.submissions - b.submissions
            break
          case "deadline":
            comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            break
          case "budget":
            comparison = a.budget - b.budget
            break
        }

        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    return result
  }, [activeTab, searchQuery, sortField, sortDirection])

  return (
    <div className="space-y-6 p-5">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">
            RFPs
          </h1>
          <p className="text-sm text-[#6B7280]">
            Manage and track all your procurement RFPs
          </p>
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

        {/* Table */}
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
                      label="Submissions"
                      field="submissions"
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
                  {filteredTenders.map(tender => (
                    <TenderRow
                      key={tender.id}
                      tender={tender}
                      isSelected={selectedTenders.includes(tender.id)}
                      onSelect={handleSelectTender}
                    />
                  ))}
                </tbody>
              </table>

              {filteredTenders.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-[#6B7280]">No RFPs found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6B7280]">
            Showing {filteredTenders.length} of {allTendersData.length} RFPs
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-[#E5E7EB]" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="border-[#E5E7EB] bg-[#16A34A] text-white hover:bg-[#15803D]">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-[#E5E7EB]">
              2
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

function TenderRow({
  tender,
  isSelected,
  onSelect,
}: {
  tender: TenderData
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const router = useRouter()

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on checkbox or actions
    if ((e.target as HTMLElement).closest('input, button, [role="menuitem"]')) {
      return
    }
    router.push(`/buyer/tenders/${tender.id}`)
  }

  const statusConfig: Record<TenderStatus, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]" },
    published: { label: "Published", className: "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20" },
    accepting_bids: { label: "Accepting Bids", className: "bg-blue-50 text-blue-700 border-blue-200" },
    evaluating: { label: "Evaluating", className: "bg-amber-50 text-amber-700 border-amber-200" },
    closed: { label: "Closed", className: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]" },
  }

  const { label, className } = statusConfig[tender.status]

  const formatBudget = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  return (
    <tr 
      className={`hover:bg-[#F3F4F6] transition-colors cursor-pointer ${isSelected ? "bg-[#F0FDF4]" : ""}`}
      onClick={handleRowClick}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(tender.id)}
          className="size-4 rounded border-[#D1D5DB] text-[#16A34A] focus:ring-[#16A34A]"
        />
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-[#111827]">{tender.name}</p>
          <p className="text-xs text-[#6B7280]">{tender.referenceId}</p>
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
      <td className="px-4 py-3 text-[#6B7280]">{tender.category}</td>
      <td className="px-4 py-3 text-[#6B7280] tabular-nums text-center">{tender.submissions}</td>
      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{tender.deadline}</td>
      <td className="px-4 py-3 text-[#6B7280] tabular-nums whitespace-nowrap">{formatBudget(tender.budget)}</td>
      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{tender.owner}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-text-secondary hover:text-text-primary"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/buyer/tenders/${tender.id}`)
            }}
          >
            Open
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="size-8 p-0">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => router.push(`/buyer/tenders/${tender.id}`)}>
                <Eye className="size-4 mr-2" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/buyer/rfp/${tender.id}/edit`)}>
                <Pencil className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="size-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Archive className="size-4 mr-2" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}
