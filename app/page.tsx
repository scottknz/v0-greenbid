import { DashboardShell } from "@/components/shell/DashboardShell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, AlertCircle } from "lucide-react"

export default function BuyerDashboard() {
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

        {/* Metric Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* Actions Required - larger card */}
          <Card className="border-[#E5E7EB] bg-white md:row-span-1">
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

          {/* Active Tenders */}
          <MetricCard
            title="Active Tenders"
            value="12"
            description="3 closing this week"
            icon={FileText}
            iconColor="text-[#16A34A]"
            iconBg="bg-[#F0FDF4]"
          />

          {/* Completed */}
          <MetricCard
            title="Completed"
            value="45"
            description="This quarter"
            icon={CheckCircle}
            iconColor="text-[#16A34A]"
            iconBg="bg-[#F0FDF4]"
          />
        </div>

        {/* Recent Tenders Table */}
        <Card className="border-[#E5E7EB] bg-white">
          <CardHeader className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
            <CardTitle className="text-lg font-semibold text-[#111827]">
              Recent Tenders
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                      Tender Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                      Submissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                      Deadline
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  <TenderRow
                    name="Sustainable Office Supplies 2026"
                    status="active"
                    submissions={8}
                    deadline="Apr 15, 2026"
                  />
                  <TenderRow
                    name="Green IT Equipment Procurement"
                    status="evaluation"
                    submissions={12}
                    deadline="Mar 28, 2026"
                  />
                  <TenderRow
                    name="Carbon-Neutral Logistics Services"
                    status="draft"
                    submissions={0}
                    deadline="May 1, 2026"
                  />
                  <TenderRow
                    name="Renewable Energy Supply Contract"
                    status="completed"
                    submissions={15}
                    deadline="Mar 10, 2026"
                  />
                  <TenderRow
                    name="Eco-Friendly Packaging Materials"
                    status="active"
                    submissions={6}
                    deadline="Apr 22, 2026"
                  />
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
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
}: {
  name: string
  status: "draft" | "active" | "evaluation" | "completed"
  submissions: number
  deadline: string
}) {
  const statusConfig = {
    draft: { label: "Draft", className: "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]" },
    active: { label: "Active", className: "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20" },
    evaluation: { label: "Evaluation", className: "bg-amber-50 text-amber-700 border-amber-200" },
    completed: { label: "Completed", className: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]" },
  }

  const { label, className } = statusConfig[status]

  return (
    <tr className="hover:bg-[#F3F4F6] transition-colors cursor-pointer">
      <td className="px-6 py-4 font-medium text-[#111827]">{name}</td>
      <td className="px-6 py-4">
        <Badge
          variant="outline"
          className={`rounded-full text-xs font-medium ${className}`}
        >
          {label}
        </Badge>
      </td>
      <td className="px-6 py-4 text-[#6B7280] tabular-nums">{submissions} suppliers</td>
      <td className="px-6 py-4 text-[#6B7280]">{deadline}</td>
    </tr>
  )
}
