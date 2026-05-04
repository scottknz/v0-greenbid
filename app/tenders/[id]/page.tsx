"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardShell } from "@/components/shell/DashboardShell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Pencil,
  MoreHorizontal,
  Copy,
  Archive,
  Send,
  Calendar,
  DollarSign,
  Users,
  Clock,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Upload,
  ExternalLink,
} from "lucide-react"

// Mock data - in production this would come from an API
const tenderData = {
  id: "1",
  name: "Sustainable Office Supplies 2026",
  referenceId: "TND-2026-001",
  status: "active" as const,
  category: "Office Supplies",
  description: "Procurement of sustainable and eco-friendly office supplies including recycled paper products, biodegradable pens and markers, energy-efficient desk accessories, and environmentally certified furniture items. This tender aims to reduce our carbon footprint while maintaining high-quality standards for workplace materials.",
  requirements: [
    "All paper products must contain minimum 80% post-consumer recycled content",
    "Plastic items must be recyclable or biodegradable",
    "Suppliers must hold ISO 14001 environmental certification",
    "Products must meet EU Ecolabel or equivalent standards",
    "Delivery vehicles must meet Euro 6 emission standards",
  ],
  evaluationCriteria: [
    { name: "Completeness", weight: 20 },
    { name: "Quality", weight: 30 },
    { name: "Capability", weight: 25 },
    { name: "Price", weight: 25 },
  ],
  budget: 125000,
  deadline: "Apr 15, 2026",
  publishedDate: "Mar 1, 2026",
  owner: "Sarah Chen",
  ownerEmail: "sarah.chen@company.com",
  submissions: 8,
  invitedSuppliers: 15,
}

const submissionsData = [
  {
    id: "s1",
    supplierName: "EcoSupply Co.",
    submittedDate: "Mar 15, 2026",
    status: "under_review",
    scores: {
      completeness: 95,
      quality: 88,
      capability: 92,
      price: 85,
    },
    unweightedScore: 90,
    weightedScore: 89,
    documents: [
      { name: "Company Profile.pdf", size: "1.2 MB" },
      { name: "Technical Proposal.pdf", size: "3.4 MB" },
      { name: "Pricing Schedule.xlsx", size: "245 KB" },
      { name: "Certifications.pdf", size: "890 KB" },
      { name: "References.pdf", size: "156 KB" },
    ],
  },
  {
    id: "s2",
    supplierName: "GreenOffice Ltd",
    submittedDate: "Mar 18, 2026",
    status: "evaluated",
    scores: {
      completeness: 100,
      quality: 85,
      capability: 88,
      price: 92,
    },
    unweightedScore: 91,
    weightedScore: 90,
    documents: [
      { name: "Company Overview.pdf", size: "2.1 MB" },
      { name: "Solution Proposal.pdf", size: "4.2 MB" },
      { name: "Cost Breakdown.xlsx", size: "312 KB" },
      { name: "ISO Certificates.pdf", size: "1.1 MB" },
    ],
  },
  {
    id: "s3",
    supplierName: "Sustainable Solutions Inc",
    submittedDate: "Mar 20, 2026",
    status: "under_review",
    scores: {
      completeness: 90,
      quality: 95,
      capability: 90,
      price: 78,
    },
    unweightedScore: 88,
    weightedScore: 87,
    documents: [
      { name: "Executive Summary.pdf", size: "890 KB" },
      { name: "Technical Specifications.pdf", size: "5.6 MB" },
      { name: "Pricing Proposal.xlsx", size: "178 KB" },
      { name: "Case Studies.pdf", size: "3.2 MB" },
      { name: "Team CVs.pdf", size: "2.4 MB" },
      { name: "Quality Certifications.pdf", size: "1.8 MB" },
    ],
  },
  {
    id: "s4",
    supplierName: "EarthFirst Supplies",
    submittedDate: "Mar 22, 2026",
    status: "pending",
    scores: null,
    unweightedScore: null,
    weightedScore: null,
    documents: [
      { name: "Proposal Document.pdf", size: "2.8 MB" },
      { name: "Pricing.xlsx", size: "145 KB" },
      { name: "Company Info.pdf", size: "1.4 MB" },
    ],
  },
  {
    id: "s5",
    supplierName: "CleanTech Office",
    submittedDate: "Mar 25, 2026",
    status: "pending",
    scores: null,
    unweightedScore: null,
    weightedScore: null,
    documents: [
      { name: "Full Proposal.pdf", size: "4.1 MB" },
      { name: "Cost Analysis.xlsx", size: "267 KB" },
      { name: "References.pdf", size: "890 KB" },
      { name: "Certifications.pdf", size: "1.2 MB" },
    ],
  },
]

const documentsData = [
  { name: "Tender Specification Document.pdf", type: "PDF", size: "2.4 MB", uploadedDate: "Mar 1, 2026", uploadedBy: "Sarah Chen" },
  { name: "ESG Requirements Checklist.xlsx", type: "Excel", size: "156 KB", uploadedDate: "Mar 1, 2026", uploadedBy: "Sarah Chen" },
  { name: "Supplier Questionnaire Template.docx", type: "Word", size: "89 KB", uploadedDate: "Mar 2, 2026", uploadedBy: "Sarah Chen" },
  { name: "Budget Breakdown.xlsx", type: "Excel", size: "234 KB", uploadedDate: "Mar 3, 2026", uploadedBy: "James Wilson" },
  { name: "Evaluation Criteria Matrix.pdf", type: "PDF", size: "1.1 MB", uploadedDate: "Mar 5, 2026", uploadedBy: "Sarah Chen" },
]

const activityData = [
  { action: "Submission received", detail: "CleanTech Office submitted their proposal", date: "Mar 25, 2026", time: "2:30 PM" },
  { action: "Evaluation completed", detail: "GreenOffice Ltd evaluation finalized with score 90", date: "Mar 24, 2026", time: "4:15 PM" },
  { action: "Submission received", detail: "EarthFirst Supplies submitted their proposal", date: "Mar 22, 2026", time: "11:00 AM" },
  { action: "Document uploaded", detail: "Budget Breakdown.xlsx added by James Wilson", date: "Mar 3, 2026", time: "3:45 PM" },
  { action: "Supplier invited", detail: "5 additional suppliers invited to tender", date: "Mar 2, 2026", time: "10:30 AM" },
  { action: "Tender published", detail: "Tender made available to invited suppliers", date: "Mar 1, 2026", time: "9:00 AM" },
  { action: "Tender created", detail: "Initial tender draft created by Sarah Chen", date: "Feb 25, 2026", time: "2:00 PM" },
]

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "submissions", label: "Submissions", count: tenderData.submissions },
  { key: "evaluation", label: "Evaluation" },
  { key: "documents", label: "Documents", count: documentsData.length },
  { key: "activity", label: "Activity" },
]

export default function TenderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const statusConfig = {
    draft: { label: "Draft", className: "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]" },
    open: { label: "Open", className: "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20" },
    active: { label: "Active", className: "bg-blue-50 text-blue-700 border-blue-200" },
    evaluation: { label: "Evaluation", className: "bg-amber-50 text-amber-700 border-amber-200" },
    closed: { label: "Closed", className: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]" },
  }

  const { label: statusLabel, className: statusClassName } = statusConfig[tenderData.status]

  const formatBudget = (value: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
  }

  return (
    <DashboardShell>
      <div className="space-y-6 p-5">
        {/* Back Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#6B7280] hover:text-[#111827]"
            onClick={() => router.push("/tenders")}
          >
            <ArrowLeft className="size-4 mr-1" />
            Back to Tenders
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">
                {tenderData.name}
              </h1>
              <Badge variant="outline" className={`rounded-full text-xs font-medium ${statusClassName}`}>
                {statusLabel}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
              <span>{tenderData.referenceId}</span>
              <span className="text-[#D1D5DB]">|</span>
              <span>{tenderData.category}</span>
              <span className="text-[#D1D5DB]">|</span>
              <span>Owner: {tenderData.owner}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-[#E5E7EB]">
              <Pencil className="size-4 mr-2" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#E5E7EB]">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Send className="size-4 mr-2" />
                  Invite Suppliers
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="size-4 mr-2" />
                  Duplicate Tender
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="size-4 mr-2" />
                  Export Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Archive className="size-4 mr-2" />
                  Archive Tender
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#E5E7EB] bg-white">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md p-2 bg-[#F0FDF4]">
                  <DollarSign className="size-4 text-[#16A34A]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Budget</p>
                  <p className="text-lg font-semibold text-[#111827]">{formatBudget(tenderData.budget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#E5E7EB] bg-white">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md p-2 bg-blue-50">
                  <Users className="size-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Submissions</p>
                  <p className="text-lg font-semibold text-[#111827]">{tenderData.submissions} / {tenderData.invitedSuppliers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#E5E7EB] bg-white">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md p-2 bg-amber-50">
                  <Clock className="size-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Deadline</p>
                  <p className="text-lg font-semibold text-[#111827]">{tenderData.deadline}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#E5E7EB] bg-white">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md p-2 bg-[#F3F4F6]">
                  <Calendar className="size-4 text-[#6B7280]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Published</p>
                  <p className="text-lg font-semibold text-[#111827]">{tenderData.publishedDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#E5E7EB]">
          <nav className="flex gap-6" aria-label="Tabs">
            {tabs.map(tab => (
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
                  {tab.count !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        activeTab === tab.key
                          ? "bg-[#F0FDF4] text-[#16A34A]"
                          : "bg-[#F3F4F6] text-[#6B7280]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16A34A]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="border-[#E5E7EB] bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#6B7280] leading-relaxed">{tenderData.description}</p>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="border-[#E5E7EB] bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tenderData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="size-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                        <span className="text-[#6B7280]">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* ESG Criteria */}
              <Card className="border-[#E5E7EB] bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Evaluation Criteria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tenderData.evaluationCriteria.map((criteria, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">{criteria.name}</span>
                        <span className="font-medium text-[#111827]">{criteria.weight}%</span>
                      </div>
                      <Progress value={criteria.weight} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Owner */}
              <Card className="border-[#E5E7EB] bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Tender Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#F0FDF4] text-[#16A34A]">
                        {tenderData.owner.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-[#111827]">{tenderData.owner}</p>
                      <p className="text-sm text-[#6B7280]">{tenderData.ownerEmail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "submissions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">
                {tenderData.submissions} submissions received from {tenderData.invitedSuppliers} invited suppliers
              </p>
              <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white">
                <Send className="size-4 mr-2" />
                Invite More Suppliers
              </Button>
            </div>

            <Card className="border-[#E5E7EB] bg-white">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                      <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Supplier</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Status</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Complete</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Quality</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Capability</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Price</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide bg-[#F0FDF4]">Unweighted</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide bg-[#F0FDF4]">Weighted</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Docs</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {submissionsData.map(submission => (
                      <tr key={submission.id} className="hover:bg-[#F3F4F6] transition-colors">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-7">
                              <AvatarFallback className="bg-[#F0FDF4] text-[#16A34A] text-xs">
                                {submission.supplierName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium text-[#111827] text-sm">{submission.supplierName}</span>
                              <p className="text-xs text-[#9CA3AF]">{submission.submittedDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <SubmissionStatusBadge status={submission.status} />
                        </td>
                        <td className="px-2 py-3 text-center">
                          {submission.scores ? (
                            <span className="font-medium text-[#111827]">{submission.scores.completeness}</span>
                          ) : (
                            <span className="text-[#D1D5DB]">-</span>
                          )}
                        </td>
                        <td className="px-2 py-3 text-center">
                          {submission.scores ? (
                            <span className="font-medium text-[#111827]">{submission.scores.quality}</span>
                          ) : (
                            <span className="text-[#D1D5DB]">-</span>
                          )}
                        </td>
                        <td className="px-2 py-3 text-center">
                          {submission.scores ? (
                            <span className="font-medium text-[#111827]">{submission.scores.capability}</span>
                          ) : (
                            <span className="text-[#D1D5DB]">-</span>
                          )}
                        </td>
                        <td className="px-2 py-3 text-center">
                          {submission.scores ? (
                            <span className="font-medium text-[#111827]">{submission.scores.price}</span>
                          ) : (
                            <span className="text-[#D1D5DB]">-</span>
                          )}
                        </td>
                        <td className="px-2 py-3 text-center bg-[#FAFDFB]">
                          {submission.unweightedScore ? (
                            <span className="font-semibold text-[#111827]">{submission.unweightedScore}</span>
                          ) : (
                            <span className="text-[#D1D5DB]">-</span>
                          )}
                        </td>
                        <td className="px-2 py-3 text-center bg-[#FAFDFB]">
                          {submission.weightedScore ? (
                            <span className="font-semibold text-[#16A34A]">{submission.weightedScore}</span>
                          ) : (
                            <span className="text-[#D1D5DB]">-</span>
                          )}
                        </td>
                        <td className="px-2 py-3 text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-[#6B7280] hover:text-[#111827]">
                                <FileText className="size-3 mr-1" />
                                {submission.documents.length}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Documents - {submission.supplierName}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-2 mt-4">
                                {submission.documents.map((doc, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
                                    <div className="flex items-center gap-3">
                                      <FileText className="size-4 text-[#6B7280]" />
                                      <div>
                                        <p className="text-sm font-medium text-[#111827]">{doc.name}</p>
                                        <p className="text-xs text-[#6B7280]">{doc.size}</p>
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="size-8 p-0">
                                      <Download className="size-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-3 text-xs border-[#E5E7EB]"
                            onClick={() => window.location.href = `/tenders/${tenderData.id}/submissions/${submission.id}`}
                          >
                            <ExternalLink className="size-3 mr-1" />
                            Open
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "evaluation" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">Evaluation Progress</h3>
                <p className="text-sm text-[#6B7280]">
                  {submissionsData.filter(s => s.weightedScore).length} of {tenderData.submissions} submissions evaluated
                </p>
              </div>
              <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white">
                Start Evaluation
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {submissionsData.filter(s => s.weightedScore).map(submission => (
                <Card key={submission.id} className="border-[#E5E7EB] bg-white">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-[#F0FDF4] text-[#16A34A]">
                            {submission.supplierName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{submission.supplierName}</CardTitle>
                          <CardDescription>{submission.submittedDate}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#16A34A]">{submission.weightedScore}</p>
                        <p className="text-xs text-[#6B7280]">Weighted Score</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280]">Completeness</span>
                        <span className="font-medium text-[#111827]">{submission.scores?.completeness}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280]">Quality</span>
                        <span className="font-medium text-[#111827]">{submission.scores?.quality}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280]">Capability</span>
                        <span className="font-medium text-[#111827]">{submission.scores?.capability}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7280]">Price</span>
                        <span className="font-medium text-[#111827]">{submission.scores?.price}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-sm">
                      <span className="text-[#6B7280]">Unweighted Score</span>
                      <span className="font-semibold text-[#111827]">{submission.unweightedScore}</span>
                    </div>
                    <div className="pt-2 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-[#E5E7EB]">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-[#E5E7EB]">
                        Compare
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pending Evaluations */}
              {submissionsData.filter(s => !s.weightedScore).map(submission => (
                <Card key={submission.id} className="border-[#E5E7EB] bg-white border-dashed">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-[#F3F4F6] text-[#6B7280]">
                            {submission.supplierName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{submission.supplierName}</CardTitle>
                          <CardDescription>{submission.submittedDate}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white">
                      Start Evaluation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">{documentsData.length} documents attached</p>
              <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white">
                <Upload className="size-4 mr-2" />
                Upload Document
              </Button>
            </div>

            <Card className="border-[#E5E7EB] bg-white">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Size</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Uploaded</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">By</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {documentsData.map((doc, index) => (
                      <tr key={index} className="hover:bg-[#F3F4F6] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="size-5 text-[#6B7280]" />
                            <span className="font-medium text-[#111827]">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#6B7280]">{doc.type}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{doc.size}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{doc.uploadedDate}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{doc.uploadedBy}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="size-8 p-0">
                              <Eye className="size-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="size-8 p-0">
                              <Download className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "activity" && (
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
              <CardDescription>Complete history of tender activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-[#E5E7EB]" />
                <div className="space-y-6">
                  {activityData.map((activity, index) => (
                    <div key={index} className="relative flex gap-4 pl-10">
                      <div className="absolute left-2.5 top-1 size-3 rounded-full bg-[#16A34A] border-2 border-white" />
                      <div className="flex-1">
                        <p className="font-medium text-[#111827]">{activity.action}</p>
                        <p className="text-sm text-[#6B7280]">{activity.detail}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">{activity.date} at {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}

function SubmissionStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]" },
    under_review: { label: "Under Review", className: "bg-amber-50 text-amber-700 border-amber-200" },
    evaluated: { label: "Evaluated", className: "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20" },
    rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border-red-200" },
  }

  const { label, className } = config[status] || config.pending

  return (
    <Badge variant="outline" className={`rounded-full text-xs font-medium whitespace-nowrap ${className}`}>
      {label}
    </Badge>
  )
}
