"use client"

import { useState, useMemo } from "react"
import { DashboardShell } from "@/components/shell/DashboardShell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

type SortField = "status" | "submissions" | "deadline" | "budget" | null
type SortDirection = "asc" | "desc"

type TenderData = {
  name: string
  status: "draft" | "active" | "evaluation" | "completed"
  submissions: number
  deadline: string
  created: string
  budget: number
  owner: string
}

const tendersData: TenderData[] = [
  {
    name: "Sustainable Office Supplies 2026",
    status: "active",
    submissions: 8,
    deadline: "Apr 15, 2026",
    created: "Mar 1, 2026",
    budget: 125000,
    owner: "Sarah Chen",
  },
  {
    name: "Green IT Equipment Procurement",
    status: "evaluation",
    submissions: 12,
    deadline: "Mar 28, 2026",
    created: "Feb 15, 2026",
    budget: 450000,
    owner: "James Wilson",
  },
  {
    name: "Carbon-Neutral Logistics Services",
    status: "draft",
    submissions: 0,
    deadline: "May 1, 2026",
    created: "Apr 20, 2026",
    budget: 280000,
    owner: "Maria Garcia",
  },
  {
    name: "Renewable Energy Supply Contract",
    status: "completed",
    submissions: 15,
    deadline: "Mar 10, 2026",
    created: "Jan 5, 2026",
    budget: 1200000,
    owner: "Sarah Chen",
  },
  {
    name: "Eco-Friendly Packaging Materials",
    status: "active",
    submissions: 6,
    deadline: "Apr 22, 2026",
    created: "Mar 10, 2026",
    budget: 95000,
    owner: "James Wilson",
  },
]

export default function BuyerDashboard() {
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedTenders = useMemo(() => {
    if (!sortField) return tendersData

    return [...tendersData].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case "status":
          const statusOrder = { draft: 0, active: 1, evaluation: 2, completed: 3 }
          comparison = statusOrder[a.status] - statusOrder[b.status]
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
  }, [sortField, sortDirection])
  return (
    <DashboardShell>
      <div className="space-y-6 p-5">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">
            Dashboard
          </h1>
          <p className="text-sm text-[#6B7280]">
            Welcome back! Here&apos;s an overview of your procurement activities.
          </p>
        </div>

        {/* Top Row: Metric Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <MetricCard
            title="Open RFPs"
            value="5"
            description="Accepting proposals"
            icon={FileText}
            iconColor="text-[#16A34A]"
            iconBg="bg-[#F0FDF4]"
          />
          <MetricCard
            title="Active RFPs"
            value="12"
            description="3 closing this week"
            icon={FileText}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
          />
          <MetricCard
            title="In Evaluation"
            value="8"
            description="Awaiting review"
            icon={AlertCircle}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <MetricCard
            title="Closed"
            value="45"
            description="This quarter"
            icon={CheckCircle}
            iconColor="text-[#6B7280]"
            iconBg="bg-[#F3F4F6]"
          />
        </div>

        {/* Main Content: Left Column (Actions + Activity) | Right Column (Recent Tenders) */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* Actions Required */}
            <Card className="border-[#E5E7EB] bg-white flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-[#6B7280]">
                    Actions Required
                  </CardTitle>
                  <div className="rounded-md p-1.5 bg-red-50">
                    <AlertCircle className="size-4 text-red-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ActionItem
                  title="Review supplier submissions"
                  tender="Green IT Equipment Procurement"
                  dueDate="May 8, 2026"
                />
                <ActionItem
                  title="Approve evaluation criteria"
                  tender="Sustainable Office Supplies"
                  dueDate="May 10, 2026"
                />
                <ActionItem
                  title="Finalize contract terms"
                  tender="Carbon-Neutral Logistics"
                  dueDate="May 12, 2026"
                />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-[#E5E7EB] bg-white flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#6B7280]">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ActivityItem
                  action="New submission received"
                  detail="EcoTech Solutions submitted a proposal"
                  time="2 hours ago"
                />
                <ActivityItem
                  action="RFP published"
                  detail="Sustainable Office Supplies 2026"
                  time="Yesterday"
                />
                <ActivityItem
                  action="Evaluation completed"
                  detail="Green IT Equipment awarded to GreenIT Corp"
                  time="2 days ago"
                />
                <ActivityItem
                  action="Supplier invited"
                  detail="3 suppliers invited to Carbon-Neutral Logistics"
                  time="3 days ago"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Recent RFPs Table */}
          <Card className="border-[#E5E7EB] bg-white lg:col-span-3 overflow-hidden pt-0">
            <CardHeader className="bg-white border-b border-[#E5E7EB]">
              <CardTitle className="text-lg font-semibold text-[#111827]">
                Recent RFPs
              </CardTitle>
              <CardDescription className="text-[#6B7280]">
                Your most recent procurement activities
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                        RFP Name
                      </th>
                      <SortableHeader
                        label="Status"
                        field="status"
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {sortedTenders.map((tender) => (
                      <TenderRow
                        key={tender.name}
                        name={tender.name}
                        status={tender.status}
                        submissions={tender.submissions}
                        deadline={tender.deadline}
                        budget={tender.budget}
                        owner={tender.owner}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
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
      className="px-3 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide cursor-pointer hover:bg-[#E5E7EB] transition-colors select-none"
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

function ActivityItem({
  action,
  detail,
  time,
}: {
  action: string
  detail: string
  time: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1.5 size-2 rounded-full bg-[#16A34A] flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#111827]">{action}</p>
        <p className="text-xs text-[#6B7280] truncate">{detail}</p>
        <p className="text-xs text-[#9CA3AF] mt-0.5">{time}</p>
      </div>
    </div>
  )
}

function ActionItem({
  title,
  tender,
  dueDate,
}: {
  title: string
  tender: string
  dueDate: string
}) {
  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#111827]">{title}</p>
        <p className="text-xs text-[#6B7280] truncate">{tender}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-xs font-medium text-red-600">{dueDate}</p>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  title: string
  value: string
  description: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
}) {
  return (
    <Card className="border-[#E5E7EB] bg-white max-h-[100px] overflow-hidden">
      <CardContent className="p-3 h-full flex flex-col justify-center">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#6B7280] truncate">{title}</p>
            <p className="mt-0.5 text-lg font-semibold tracking-tight text-[#111827] tabular-nums">
              {value}
            </p>
            <p className="mt-0.5 text-[10px] text-[#9CA3AF] truncate">{description}</p>
          </div>
          <div className={`rounded-md p-1.5 flex-shrink-0 ${iconBg}`}>
            <Icon className={`size-3 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TenderRow({
  name,
  status,
  submissions,
  deadline,
  budget,
  owner,
}: {
  name: string
  status: "draft" | "active" | "evaluation" | "completed"
  submissions: number
  deadline: string
  budget: number
  owner: string
}) {
  const statusConfig = {
    draft: { label: "Draft", className: "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]" },
    active: { label: "Active", className: "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20" },
    evaluation: { label: "Evaluation", className: "bg-amber-50 text-amber-700 border-amber-200" },
    completed: { label: "Completed", className: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]" },
  }

  const { label, className } = statusConfig[status]

  const formatBudget = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  return (
    <tr className="hover:bg-[#F3F4F6] transition-colors cursor-pointer">
      <td className="px-4 py-3 font-medium text-[#111827] max-w-[180px] truncate" title={name}>{name}</td>
      <td className="px-3 py-3">
        <Badge
          variant="outline"
          className={`rounded-full text-xs font-medium whitespace-nowrap ${className}`}
        >
          {label}
        </Badge>
      </td>
      <td className="px-3 py-3 text-[#6B7280] tabular-nums text-center">{submissions}</td>
      <td className="px-3 py-3 text-[#6B7280] whitespace-nowrap">{deadline}</td>
      <td className="px-3 py-3 text-[#6B7280] tabular-nums whitespace-nowrap">{formatBudget(budget)}</td>
      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{owner}</td>
    </tr>
  )
}
