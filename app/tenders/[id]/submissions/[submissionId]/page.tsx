"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Download,
  ChevronDown,
  Search,
  Filter,
  Eye,
  FileText,
  Upload,
  MessageSquare,
  LogIn,
  FormInput,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  CheckCircle,
  Pencil,
  Save,
  X,
  ArrowUpDown,
  Users,
} from "lucide-react"

// Extended submission data with team and activities
const submissionsData: Record<string, {
  id: string
  supplierName: string
  submittedDate: string
  status: string
  keyContact: string
  keyContactEmail: string
  keyContactPhone: string
  companyAddress: string
  proposedValue: number
  totalHours: number
  completionDate: string
  scores: Record<string, number> | null
  weightedScore: number | null
  documents: Array<{ name: string; size: string; type: string; uploadedDate: string }>
  team: Array<{ id: string; name: string; role: string; email: string; isLead: boolean }>
  activities: Array<{ id: string; type: string; action: string; detail: string; timestamp: string }>
}> = {
  s1: {
    id: "s1",
    supplierName: "EcoSupply Co.",
    submittedDate: "Mar 15, 2026",
    status: "under_review",
    keyContact: "John Smith",
    keyContactEmail: "john.smith@ecosupply.com",
    keyContactPhone: "+1 (555) 123-4567",
    companyAddress: "123 Green Street, San Francisco, CA 94102",
    proposedValue: 118500,
    totalHours: 240,
    completionDate: "Jun 30, 2026",
    scores: {
      completeness: 95,
      quality: 88,
      capability: 92,
      price: 85,
      sustainability: 90,
      risk: 87,
    },
    weightedScore: 89,
    documents: [
      { name: "Company Profile.pdf", size: "1.2 MB", type: "PDF", uploadedDate: "Mar 15, 2026" },
      { name: "Technical Proposal.pdf", size: "3.4 MB", type: "PDF", uploadedDate: "Mar 15, 2026" },
      { name: "Pricing Schedule.xlsx", size: "245 KB", type: "Excel", uploadedDate: "Mar 15, 2026" },
      { name: "Certifications.pdf", size: "890 KB", type: "PDF", uploadedDate: "Mar 14, 2026" },
      { name: "References.pdf", size: "156 KB", type: "PDF", uploadedDate: "Mar 14, 2026" },
    ],
    team: [
      { id: "t1", name: "John Smith", role: "Account Manager", email: "john.smith@ecosupply.com", isLead: true },
      { id: "t2", name: "Sarah Wilson", role: "Technical Lead", email: "s.wilson@ecosupply.com", isLead: false },
      { id: "t3", name: "Mike Chen", role: "Sustainability Officer", email: "m.chen@ecosupply.com", isLead: false },
      { id: "t4", name: "Emily Davis", role: "Project Coordinator", email: "e.davis@ecosupply.com", isLead: false },
    ],
    activities: [
      { id: "a1", type: "upload", action: "Document uploaded", detail: "Uploaded Technical Proposal.pdf", timestamp: "2026-03-15T14:30:00" },
      { id: "a2", type: "upload", action: "Document uploaded", detail: "Uploaded Company Profile.pdf", timestamp: "2026-03-15T14:25:00" },
      { id: "a3", type: "upload", action: "Document uploaded", detail: "Uploaded Pricing Schedule.xlsx", timestamp: "2026-03-15T14:20:00" },
      { id: "a4", type: "form_submission", action: "Form submitted", detail: "Completed submission form", timestamp: "2026-03-15T14:15:00" },
      { id: "a5", type: "document_access", action: "Document viewed", detail: "Viewed RFP Document.pdf", timestamp: "2026-03-14T10:30:00" },
      { id: "a6", type: "document_access", action: "Document downloaded", detail: "Downloaded Technical Requirements v2.pdf", timestamp: "2026-03-14T10:25:00" },
      { id: "a7", type: "upload", action: "Document uploaded", detail: "Uploaded Certifications.pdf", timestamp: "2026-03-14T09:45:00" },
      { id: "a8", type: "communication", action: "Question submitted", detail: "Asked clarification about sustainability requirements", timestamp: "2026-03-12T11:00:00" },
      { id: "a9", type: "document_access", action: "Document viewed", detail: "Viewed Budget Breakdown.xlsx", timestamp: "2026-03-10T15:20:00" },
      { id: "a10", type: "login", action: "Portal login", detail: "Logged into supplier portal", timestamp: "2026-03-10T15:15:00" },
      { id: "a11", type: "communication", action: "Message received", detail: "Received response to clarification request", timestamp: "2026-03-08T09:00:00" },
      { id: "a12", type: "login", action: "Portal login", detail: "Logged into supplier portal", timestamp: "2026-03-05T10:00:00" },
    ],
  },
  s2: {
    id: "s2",
    supplierName: "GreenOffice Ltd",
    submittedDate: "Mar 18, 2026",
    status: "evaluated",
    keyContact: "Emma Davis",
    keyContactEmail: "emma.davis@greenoffice.com",
    keyContactPhone: "+1 (555) 234-5678",
    companyAddress: "456 Eco Avenue, Portland, OR 97201",
    proposedValue: 112000,
    totalHours: 220,
    completionDate: "Jul 15, 2026",
    scores: {
      completeness: 100,
      quality: 85,
      capability: 88,
      price: 92,
      sustainability: 86,
      risk: 91,
    },
    weightedScore: 90,
    documents: [
      { name: "Company Overview.pdf", size: "2.1 MB", type: "PDF", uploadedDate: "Mar 18, 2026" },
      { name: "Solution Proposal.pdf", size: "4.2 MB", type: "PDF", uploadedDate: "Mar 18, 2026" },
      { name: "Cost Breakdown.xlsx", size: "312 KB", type: "Excel", uploadedDate: "Mar 18, 2026" },
      { name: "ISO Certificates.pdf", size: "1.1 MB", type: "PDF", uploadedDate: "Mar 17, 2026" },
    ],
    team: [
      { id: "t1", name: "Emma Davis", role: "Business Development", email: "emma.davis@greenoffice.com", isLead: true },
      { id: "t2", name: "James Miller", role: "Operations Manager", email: "j.miller@greenoffice.com", isLead: false },
      { id: "t3", name: "Anna Lee", role: "Quality Assurance", email: "a.lee@greenoffice.com", isLead: false },
    ],
    activities: [
      { id: "a1", type: "upload", action: "Document uploaded", detail: "Uploaded Solution Proposal.pdf", timestamp: "2026-03-18T16:00:00" },
      { id: "a2", type: "form_submission", action: "Form submitted", detail: "Completed submission form", timestamp: "2026-03-18T15:50:00" },
      { id: "a3", type: "upload", action: "Document uploaded", detail: "Uploaded Cost Breakdown.xlsx", timestamp: "2026-03-18T15:45:00" },
      { id: "a4", type: "document_access", action: "Document viewed", detail: "Viewed RFP Document.pdf", timestamp: "2026-03-17T11:00:00" },
      { id: "a5", type: "login", action: "Portal login", detail: "Logged into supplier portal", timestamp: "2026-03-17T10:55:00" },
    ],
  },
  s3: {
    id: "s3",
    supplierName: "Sustainable Solutions Inc",
    submittedDate: "Mar 20, 2026",
    status: "under_review",
    keyContact: "Michael Brown",
    keyContactEmail: "m.brown@sustainablesolutions.com",
    keyContactPhone: "+1 (555) 345-6789",
    companyAddress: "789 Sustainability Blvd, Seattle, WA 98101",
    proposedValue: 135000,
    totalHours: 280,
    completionDate: "Aug 1, 2026",
    scores: {
      completeness: 90,
      quality: 95,
      capability: 90,
      price: 78,
      sustainability: 94,
      risk: 82,
    },
    weightedScore: 87,
    documents: [
      { name: "Executive Summary.pdf", size: "890 KB", type: "PDF", uploadedDate: "Mar 20, 2026" },
      { name: "Technical Specifications.pdf", size: "5.6 MB", type: "PDF", uploadedDate: "Mar 20, 2026" },
      { name: "Pricing Proposal.xlsx", size: "178 KB", type: "Excel", uploadedDate: "Mar 20, 2026" },
      { name: "Case Studies.pdf", size: "3.2 MB", type: "PDF", uploadedDate: "Mar 19, 2026" },
      { name: "Team CVs.pdf", size: "2.4 MB", type: "PDF", uploadedDate: "Mar 19, 2026" },
      { name: "Quality Certifications.pdf", size: "1.8 MB", type: "PDF", uploadedDate: "Mar 19, 2026" },
    ],
    team: [
      { id: "t1", name: "Michael Brown", role: "CEO", email: "m.brown@sustainablesolutions.com", isLead: true },
      { id: "t2", name: "Jennifer White", role: "CTO", email: "j.white@sustainablesolutions.com", isLead: false },
      { id: "t3", name: "Robert Green", role: "Project Manager", email: "r.green@sustainablesolutions.com", isLead: false },
      { id: "t4", name: "Linda Taylor", role: "Finance Director", email: "l.taylor@sustainablesolutions.com", isLead: false },
      { id: "t5", name: "Kevin Martinez", role: "Technical Lead", email: "k.martinez@sustainablesolutions.com", isLead: false },
    ],
    activities: [
      { id: "a1", type: "upload", action: "Document uploaded", detail: "Uploaded Executive Summary.pdf", timestamp: "2026-03-20T12:00:00" },
      { id: "a2", type: "upload", action: "Document uploaded", detail: "Uploaded Technical Specifications.pdf", timestamp: "2026-03-20T11:55:00" },
      { id: "a3", type: "form_submission", action: "Form submitted", detail: "Completed submission form", timestamp: "2026-03-20T11:50:00" },
      { id: "a4", type: "communication", action: "Question submitted", detail: "Asked about timeline flexibility", timestamp: "2026-03-19T14:00:00" },
      { id: "a5", type: "upload", action: "Document uploaded", detail: "Uploaded Case Studies.pdf", timestamp: "2026-03-19T10:30:00" },
      { id: "a6", type: "document_access", action: "Document downloaded", detail: "Downloaded all RFP documents", timestamp: "2026-03-15T09:00:00" },
      { id: "a7", type: "login", action: "Portal login", detail: "Logged into supplier portal", timestamp: "2026-03-15T08:55:00" },
    ],
  },
  s4: {
    id: "s4",
    supplierName: "EarthFirst Supplies",
    submittedDate: "Mar 22, 2026",
    status: "pending",
    keyContact: "Lisa Johnson",
    keyContactEmail: "lisa.j@earthfirst.com",
    keyContactPhone: "+1 (555) 456-7890",
    companyAddress: "321 Nature Way, Denver, CO 80201",
    proposedValue: 108000,
    totalHours: 200,
    completionDate: "Jun 15, 2026",
    scores: null,
    weightedScore: null,
    documents: [
      { name: "Proposal Document.pdf", size: "2.8 MB", type: "PDF", uploadedDate: "Mar 22, 2026" },
      { name: "Pricing.xlsx", size: "145 KB", type: "Excel", uploadedDate: "Mar 22, 2026" },
      { name: "Company Info.pdf", size: "1.4 MB", type: "PDF", uploadedDate: "Mar 22, 2026" },
    ],
    team: [
      { id: "t1", name: "Lisa Johnson", role: "Sales Director", email: "lisa.j@earthfirst.com", isLead: true },
      { id: "t2", name: "Tom Harris", role: "Account Executive", email: "t.harris@earthfirst.com", isLead: false },
    ],
    activities: [
      { id: "a1", type: "upload", action: "Document uploaded", detail: "Uploaded Proposal Document.pdf", timestamp: "2026-03-22T10:00:00" },
      { id: "a2", type: "form_submission", action: "Form submitted", detail: "Completed submission form", timestamp: "2026-03-22T09:55:00" },
      { id: "a3", type: "document_access", action: "Document viewed", detail: "Viewed RFP Document.pdf", timestamp: "2026-03-21T14:00:00" },
      { id: "a4", type: "login", action: "Portal login", detail: "Logged into supplier portal", timestamp: "2026-03-21T13:55:00" },
    ],
  },
  s5: {
    id: "s5",
    supplierName: "CleanTech Office",
    submittedDate: "Mar 25, 2026",
    status: "pending",
    keyContact: "David Lee",
    keyContactEmail: "d.lee@cleantech.com",
    keyContactPhone: "+1 (555) 567-8901",
    companyAddress: "555 Innovation Drive, Austin, TX 78701",
    proposedValue: 121000,
    totalHours: 250,
    completionDate: "Jul 30, 2026",
    scores: null,
    weightedScore: null,
    documents: [
      { name: "Full Proposal.pdf", size: "4.1 MB", type: "PDF", uploadedDate: "Mar 25, 2026" },
      { name: "Cost Analysis.xlsx", size: "267 KB", type: "Excel", uploadedDate: "Mar 25, 2026" },
      { name: "References.pdf", size: "890 KB", type: "PDF", uploadedDate: "Mar 25, 2026" },
      { name: "Certifications.pdf", size: "1.2 MB", type: "PDF", uploadedDate: "Mar 24, 2026" },
    ],
    team: [
      { id: "t1", name: "David Lee", role: "Managing Director", email: "d.lee@cleantech.com", isLead: true },
      { id: "t2", name: "Susan Park", role: "Operations Lead", email: "s.park@cleantech.com", isLead: false },
      { id: "t3", name: "Chris Yang", role: "Technical Specialist", email: "c.yang@cleantech.com", isLead: false },
    ],
    activities: [
      { id: "a1", type: "upload", action: "Document uploaded", detail: "Uploaded Full Proposal.pdf", timestamp: "2026-03-25T14:30:00" },
      { id: "a2", type: "upload", action: "Document uploaded", detail: "Uploaded Cost Analysis.xlsx", timestamp: "2026-03-25T14:25:00" },
      { id: "a3", type: "form_submission", action: "Form submitted", detail: "Completed submission form", timestamp: "2026-03-25T14:20:00" },
      { id: "a4", type: "document_access", action: "Document downloaded", detail: "Downloaded RFP Document.pdf", timestamp: "2026-03-24T11:00:00" },
      { id: "a5", type: "upload", action: "Document uploaded", detail: "Uploaded Certifications.pdf", timestamp: "2026-03-24T10:30:00" },
      { id: "a6", type: "login", action: "Portal login", detail: "Logged into supplier portal", timestamp: "2026-03-24T10:25:00" },
    ],
  },
}

const activityTypes = [
  { key: "document_access", label: "Document Access", color: "bg-blue-100 text-blue-700" },
  { key: "upload", label: "Upload", color: "bg-green-100 text-green-700" },
  { key: "communication", label: "Communication", color: "bg-purple-100 text-purple-700" },
  { key: "form_submission", label: "Form", color: "bg-amber-100 text-amber-700" },
  { key: "login", label: "Login", color: "bg-gray-100 text-gray-700" },
]

const evaluationCriteria = [
  { name: "Content", weight: 10 },
  { name: "Quality", weight: 25 },
  { name: "Capability", weight: 15 },
  { name: "Sustainability", weight: 25 },
  { name: "Risk", weight: 5 },
  { name: "Price", weight: 20 },
]

// Communication data
const communicationsData: Record<string, Array<{
  id: string
  subject: string
  from: { name: string; email: string }
  to: { name: string; email: string }
  cc?: Array<{ name: string; email: string }>
  date: string
  preview: string
  body: string
  type: "incoming" | "outgoing"
  attachments?: Array<{ name: string; size: string }>
}>> = {
  s1: [
    {
      id: "c1",
      subject: "RE: Clarification on Sustainability Requirements",
      from: { name: "Sarah Chen", email: "sarah.chen@greenbid.com" },
      to: { name: "John Smith", email: "john.smith@ecosupply.com" },
      date: "2026-03-13T09:00:00",
      preview: "Thank you for your question. The sustainability requirements outlined in Section 7...",
      body: `Dear John,

Thank you for your question regarding the sustainability requirements.

The sustainability requirements outlined in Section 7 of the RFP specify that all products must meet at least one of the following certifications:
- ISO 14001 Environmental Management
- EU Ecolabel
- Forest Stewardship Council (FSC) for paper products

Additionally, we require suppliers to provide:
1. Carbon footprint data for the proposed products
2. End-of-life recycling or disposal programs
3. Documentation of supply chain sustainability practices

Please let me know if you need any further clarification.

Best regards,
Sarah Chen
Procurement Lead`,
      type: "outgoing",
    },
    {
      id: "c2",
      subject: "Question: Sustainability Requirements Clarification",
      from: { name: "John Smith", email: "john.smith@ecosupply.com" },
      to: { name: "Sarah Chen", email: "sarah.chen@greenbid.com" },
      cc: [{ name: "Mike Chen", email: "m.chen@ecosupply.com" }],
      date: "2026-03-12T11:00:00",
      preview: "Hi Sarah, I wanted to ask for clarification regarding the sustainability requirements...",
      body: `Hi Sarah,

I hope this message finds you well.

I wanted to ask for clarification regarding the sustainability requirements outlined in the RFP. Specifically:

1. What certifications are acceptable for demonstrating environmental compliance?
2. Is there a specific format required for carbon footprint reporting?
3. Are there minimum thresholds for recycled content in products?

We want to ensure our proposal fully addresses your sustainability criteria.

Thank you for your time.

Best regards,
John Smith
Account Manager, EcoSupply Co.`,
      type: "incoming",
      attachments: [{ name: "Current_Certifications.pdf", size: "245 KB" }],
    },
    {
      id: "c3",
      subject: "Welcome to the Sustainable Office Supplies RFP",
      from: { name: "GreenBid Platform", email: "notifications@greenbid.com" },
      to: { name: "John Smith", email: "john.smith@ecosupply.com" },
      date: "2026-03-05T10:00:00",
      preview: "You have been invited to participate in the Sustainable Office Supplies RFP...",
      body: `Dear John Smith,

You have been invited to submit a proposal for the Sustainable Office Supplies RFP by GreenBid Corp.

RFP Details:
- Title: Sustainable Office Supplies
- Submission Deadline: April 15, 2026
- Estimated Value: $120,000

To access the RFP documents and submit your proposal, please log in to your supplier portal.

If you have any questions, please contact the procurement team.

Best regards,
GreenBid Platform`,
      type: "outgoing",
    },
  ],
  s2: [
    {
      id: "c1",
      subject: "Submission Confirmation",
      from: { name: "GreenBid Platform", email: "notifications@greenbid.com" },
      to: { name: "Emma Davis", email: "emma.davis@greenoffice.com" },
      date: "2026-03-18T16:05:00",
      preview: "Your proposal has been received successfully...",
      body: `Dear Emma Davis,

Your proposal for the Sustainable Office Supplies RFP has been received successfully.

Submission Details:
- Submission ID: S2-GO-2026
- Submitted: March 18, 2026 at 4:00 PM
- Documents: 4 files uploaded

Our team will review your proposal and you will be notified of the evaluation outcome.

Best regards,
GreenBid Platform`,
      type: "outgoing",
    },
  ],
  s3: [
    {
      id: "c1",
      subject: "RE: Timeline Flexibility",
      from: { name: "James Wilson", email: "james.wilson@greenbid.com" },
      to: { name: "Michael Brown", email: "m.brown@sustainablesolutions.com" },
      date: "2026-03-20T09:00:00",
      preview: "Thank you for your question. The project timeline has some flexibility...",
      body: `Dear Michael,

Thank you for your question about timeline flexibility.

The preferred completion date is June 30, 2026. However, we understand that quality delivery is paramount, and there is some flexibility for proposals that demonstrate exceptional value.

If your proposed timeline extends beyond this date, please provide:
1. Detailed justification for the extended timeline
2. Key milestones and delivery schedule
3. Risk mitigation strategies for any delays

We will consider all proposals holistically based on overall value.

Best regards,
James Wilson
Budget Reviewer`,
      type: "outgoing",
    },
    {
      id: "c2",
      subject: "Question: Timeline Flexibility",
      from: { name: "Michael Brown", email: "m.brown@sustainablesolutions.com" },
      to: { name: "Procurement Team", email: "procurement@greenbid.com" },
      date: "2026-03-19T14:00:00",
      preview: "Hello, I would like to inquire about the project timeline flexibility...",
      body: `Hello,

I would like to inquire about the project timeline mentioned in the RFP.

Given the comprehensive nature of our proposed solution and our commitment to quality, we anticipate needing approximately 4 months for full implementation rather than the 3 months suggested.

Would there be flexibility in the completion timeline for proposals that offer enhanced quality and sustainability features?

Thank you for your consideration.

Best regards,
Michael Brown
CEO, Sustainable Solutions Inc`,
      type: "incoming",
    },
  ],
  s4: [],
  s5: [],
}

export default function SubmissionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const tenderId = params.id as string
  const submissionId = params.submissionId as string

  const submission = submissionsData[submissionId]
  const communications = communicationsData[submissionId] || []

  // Tabs
  const [activeTab, setActiveTab] = useState("summary")
  const tabs = [
    { key: "summary", label: "Summary" },
    { key: "documents", label: "Documents", count: submission?.documents.length },
    { key: "communication", label: "Communication", count: communications.length },
    { key: "activity", label: "Activity Log", count: submission?.activities.length },
  ]

  // Activity filters
  const [activitySearch, setActivitySearch] = useState("")
  const [activityTypeFilter, setActivityTypeFilter] = useState<string[]>([])
  const [activitySortOrder, setActivitySortOrder] = useState<"asc" | "desc">("desc")

  // Team collapsible
  const [teamExpanded, setTeamExpanded] = useState(false)

  // Results editing
  const [resultsEditing, setResultsEditing] = useState(false)
  const [editableScores, setEditableScores] = useState(submission?.scores || {})
  
  // Communication
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [justifications, setJustifications] = useState<Record<string, string>>({
    completeness: "All required documents submitted with thorough responses.",
    quality: "High-quality proposal with detailed technical specifications.",
    capability: "Strong track record with relevant industry experience.",
    price: "Competitive pricing with clear value proposition.",
    sustainability: "Excellent environmental credentials and certifications.",
    risk: "Stable financials with robust business continuity plans.",
  })

  if (!submission) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FA]">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-[#111827]">Submission not found</h2>
          <p className="text-[#6B7280] mt-2">The requested submission does not exist.</p>
          <Button 
            className="mt-4 bg-[#16A34A] hover:bg-[#15803D] text-white"
            onClick={() => router.push(`/tenders/${tenderId}`)}
          >
            Back to Tender
          </Button>
        </Card>
      </div>
    )
  }

  // Filter and sort activities
  const filteredActivities = submission.activities
    .filter(activity => {
      if (activitySearch && !activity.action.toLowerCase().includes(activitySearch.toLowerCase()) && 
          !activity.detail.toLowerCase().includes(activitySearch.toLowerCase())) {
        return false
      }
      if (activityTypeFilter.length > 0 && !activityTypeFilter.includes(activity.type)) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp)
      const dateB = new Date(b.timestamp)
      return activitySortOrder === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document_access": return <Eye className="size-4" />
      case "upload": return <Upload className="size-4" />
      case "communication": return <MessageSquare className="size-4" />
      case "form_submission": return <FormInput className="size-4" />
      case "login": return <LogIn className="size-4" />
      default: return <Clock className="size-4" />
    }
  }

  const getActivityTypeStyle = (type: string) => {
    const typeInfo = activityTypes.find(t => t.key === type)
    return typeInfo?.color || "bg-gray-100 text-gray-700"
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "evaluated": return "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20"
      case "under_review": return "bg-blue-50 text-blue-700 border-blue-200"
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200"
      case "shortlisted": return "bg-purple-50 text-purple-700 border-purple-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const formatStatus = (status: string) => {
    return status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  }

  const hasActiveFilters = activitySearch || activityTypeFilter.length > 0

  const clearActivityFilters = () => {
    setActivitySearch("")
    setActivityTypeFilter([])
  }

  const teamLead = submission.team.find(m => m.isLead)
  const otherMembers = submission.team.filter(m => !m.isLead)

  const calculateWeightedScore = () => {
    if (!editableScores || Object.keys(editableScores).length === 0) return null
    let total = 0
    let totalWeight = 0
    evaluationCriteria.forEach(c => {
      const key = c.name.toLowerCase()
      if (editableScores[key]) {
        total += editableScores[key] * c.weight
        totalWeight += c.weight
      }
    })
    return totalWeight > 0 ? Math.round(total / totalWeight) : null
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push(`/tenders/${tenderId}?tab=submissions`)}
              className="text-[#6B7280] hover:text-[#111827]"
            >
              <ArrowLeft className="size-4 mr-2" />
              Back to Submissions
            </Button>
          </div>
          <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white">
            <Download className="size-4 mr-2" />
            Download Pack
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Company Header Card */}
        <Card className="border-[#E5E7EB] bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="size-16">
                  <AvatarFallback className="bg-[#F0FDF4] text-[#16A34A] text-xl font-semibold">
                    {submission.supplierName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-[#111827]">{submission.supplierName}</h1>
                    <Badge variant="outline" className={getStatusColor(submission.status)}>
                      {formatStatus(submission.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      Submitted {submission.submittedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="size-4" />
                      {submission.companyAddress}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-[#111827]">
                      <Users className="size-4 text-[#6B7280]" />
                      {submission.keyContact}
                    </span>
                    <span className="flex items-center gap-1 text-[#6B7280]">
                      <Mail className="size-4" />
                      {submission.keyContactEmail}
                    </span>
                    <span className="flex items-center gap-1 text-[#6B7280]">
                      <Phone className="size-4" />
                      {submission.keyContactPhone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#6B7280]">Proposed Value</p>
                <p className="text-2xl font-bold text-[#111827]">${submission.proposedValue.toLocaleString()}</p>
                {submission.weightedScore && (
                  <div className="mt-2">
                    <Badge className="bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20">
                      Score: {submission.weightedScore}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
          <nav className="flex gap-1" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  if (tab.key !== "communication") setSelectedMessage(null)
                }}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "text-[#16A34A] border-[#16A34A] bg-white"
                    : "text-[#6B7280] hover:text-[#111827] border-transparent hover:border-[#D1D5DB]"
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="text-xs font-semibold text-[#6B7280]">
                      {tab.count}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Summary Tab */}
        {activeTab === "summary" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Evaluation Results first */}
            <div className="lg:col-span-2 space-y-6">
              {/* Evaluation Results */}
            <Card className="border-[#E5E7EB] bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">Evaluation Results</CardTitle>
                  <CardDescription>
                    {submission.scores ? "Scores and justifications for this submission" : "Evaluation not yet completed"}
                  </CardDescription>
                </div>
                {submission.scores && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-[#E5E7EB]"
                    onClick={() => setResultsEditing(!resultsEditing)}
                  >
                    {resultsEditing ? (
                      <>
                        <Save className="size-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Pencil className="size-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {submission.scores ? (
                  <div className="space-y-4">
                    {/* Overall Score */}
                    <div className="flex items-center justify-between p-4 bg-[#F0FDF4] rounded-lg border border-[#16A34A]/20">
                      <div>
                        <p className="text-sm text-[#6B7280]">Weighted Score</p>
                        <p className="text-3xl font-bold text-[#16A34A]">{calculateWeightedScore() || submission.weightedScore}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#6B7280]">Rank</p>
                        <p className="text-xl font-semibold text-[#111827]">#2 of 5</p>
                      </div>
                    </div>

                    {/* Criteria Scores */}
                    <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide w-20">Weight</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide w-24">Score</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Justification</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                          {evaluationCriteria.map(criteria => {
                            const key = criteria.name.toLowerCase()
                            const score = editableScores[key] || 0
                            return (
                              <tr key={criteria.name} className="hover:bg-[#F9FAFB] transition-colors">
                                <td className="px-4 py-3 font-medium text-[#111827]">{criteria.name}</td>
                                <td className="px-4 py-3 text-[#6B7280]">{criteria.weight}%</td>
                                <td className="px-4 py-3">
                                  {resultsEditing ? (
                                    <Input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={score}
                                      onChange={(e) => setEditableScores(prev => ({
                                        ...prev,
                                        [key]: parseInt(e.target.value) || 0
                                      }))}
                                      className="h-8 w-20 text-sm"
                                    />
                                  ) : (
                                    <Badge className={`${score >= 90 ? 'bg-green-100 text-green-700' : score >= 80 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'} border-0`}>
                                      {score}
                                    </Badge>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  {resultsEditing ? (
                                    <Textarea
                                      value={justifications[key] || ""}
                                      onChange={(e) => setJustifications(prev => ({
                                        ...prev,
                                        [key]: e.target.value
                                      }))}
                                      className="min-h-[60px] text-sm text-[#6B7280]"
                                    />
                                  ) : (
                                    <span className="text-[#6B7280]">{justifications[key]}</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#6B7280]">This submission has not been evaluated yet.</p>
                    <Button className="mt-4 bg-[#16A34A] hover:bg-[#15803D] text-white">
                      Start Evaluation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Team */}
          <div className="space-y-6">
            <Card className="border-[#E5E7EB] bg-white">
              <CardContent className="p-4">
                <Collapsible open={teamExpanded} onOpenChange={setTeamExpanded}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-[#111827]">Supplier Team</h3>
                    <Button variant="outline" size="sm" className="border-[#E5E7EB]">
                      <Download className="size-4 mr-1" />
                      Export
                    </Button>
                  </div>
                  
                  {/* Lead - Always shown */}
                  {teamLead && (
                    <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-[#F0FDF4] text-[#16A34A] text-sm font-medium">
                          {teamLead.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#111827] truncate">{teamLead.name}</p>
                        <p className="text-xs text-[#6B7280] truncate">{teamLead.role}</p>
                        <p className="text-xs text-[#6B7280] truncate">{teamLead.email}</p>
                      </div>
                      <Badge className="bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20 text-xs">
                        Lead
                      </Badge>
                    </div>
                  )}

                  {/* Other members - Collapsible */}
                  {otherMembers.length > 0 && (
                    <>
                      <CollapsibleTrigger className="flex items-center gap-2 text-xs text-[#6B7280] hover:text-[#111827] w-full py-3 mt-2 border-t border-[#E5E7EB]">
                        <ChevronDown className={`size-3 transition-transform ${teamExpanded ? 'rotate-180' : ''}`} />
                        <span>{otherMembers.length} other team members</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 pt-2">
                        {otherMembers.map(member => (
                          <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F9FAFB]">
                            <Avatar className="size-8">
                              <AvatarFallback className="bg-[#F3F4F6] text-[#6B7280] text-xs">
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#111827] truncate">{member.name}</p>
                              <p className="text-xs text-[#6B7280] truncate">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </>
                  )}
                </Collapsible>
              </CardContent>
            </Card>

            {/* Submission Summary */}
            <Card className="border-[#E5E7EB] bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#6B7280]">Submission Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Total Documents</span>
                  <span className="text-sm font-medium text-[#111827]">{submission.documents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Total Activities</span>
                  <span className="text-sm font-medium text-[#111827]">{submission.activities.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Team Members</span>
                  <span className="text-sm font-medium text-[#111827]">{submission.team.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Proposed Hours</span>
                  <span className="text-sm font-medium text-[#111827]">{submission.totalHours}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Completion Date</span>
                  <span className="text-sm font-medium text-[#111827]">{submission.completionDate}</span>
                </div>
              </CardContent>
            </Card>
            </div>
        </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Submission Documents</CardTitle>
                <CardDescription>{submission.documents.length} documents uploaded</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-[#E5E7EB]">
                <Download className="size-4 mr-2" />
                Download All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide w-24">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide w-24">Size</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide w-32">Uploaded</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wide w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {submission.documents.map((doc, index) => (
                      <tr key={index} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-[#6B7280]" />
                            <span className="font-medium text-[#111827]">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#6B7280]">{doc.type}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{doc.size}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{doc.uploadedDate}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#6B7280]">
                              <Eye className="size-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#6B7280]">
                              <Download className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Communication Tab */}
        {activeTab === "communication" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Messages List */}
            <Card className="border-[#E5E7EB] bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">Messages</CardTitle>
                  <CardDescription>{communications.length} communications</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="border-[#E5E7EB]">
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                {communications.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="size-12 mx-auto text-[#D1D5DB] mb-3" />
                    <p className="text-[#6B7280]">No communications yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {communications.map(message => {
                      const { date, time } = formatTimestamp(message.date)
                      return (
                        <div
                          key={message.id}
                          onClick={() => setSelectedMessage(message.id)}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedMessage === message.id
                              ? "border-[#16A34A] bg-[#F0FDF4]"
                              : "border-[#E5E7EB] hover:bg-[#F9FAFB]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`size-2 rounded-full ${message.type === "incoming" ? "bg-blue-500" : "bg-green-500"}`} />
                              <span className="font-medium text-sm text-[#111827] truncate">
                                {message.from.name}
                              </span>
                            </div>
                            <span className="text-xs text-[#9CA3AF] whitespace-nowrap">{date}</span>
                          </div>
                          <p className="font-medium text-[#111827] mt-1 truncate">{message.subject}</p>
                          <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">{message.preview}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-[#6B7280]">
                              <FileText className="size-3" />
                              <span>{message.attachments.length} attachment(s)</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Message Detail */}
            <Card className="border-[#E5E7EB] bg-white">
              <CardContent className="p-0">
                {selectedMessage ? (
                  (() => {
                    const message = communications.find(m => m.id === selectedMessage)
                    if (!message) return null
                    const { date, time } = formatTimestamp(message.date)
                    return (
                      <div className="p-6">
                        <div className="border-b border-[#E5E7EB] pb-4 mb-4">
                          <h2 className="text-lg font-semibold text-[#111827]">{message.subject}</h2>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-[#6B7280] w-12">From:</span>
                              <span className="text-[#111827]">{message.from.name}</span>
                              <span className="text-[#6B7280]">&lt;{message.from.email}&gt;</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-[#6B7280] w-12">To:</span>
                              <span className="text-[#111827]">{message.to.name}</span>
                              <span className="text-[#6B7280]">&lt;{message.to.email}&gt;</span>
                            </div>
                            {message.cc && message.cc.length > 0 && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-[#6B7280] w-12">Cc:</span>
                                {message.cc.map((cc, i) => (
                                  <span key={i} className="text-[#6B7280]">
                                    {cc.name} &lt;{cc.email}&gt;{i < message.cc!.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-[#6B7280] w-12">Date:</span>
                              <span className="text-[#111827]">{date} at {time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-sm text-[#374151] leading-relaxed">
                            {message.body}
                          </pre>
                        </div>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                            <p className="text-sm font-medium text-[#6B7280] mb-2">Attachments</p>
                            <div className="space-y-2">
                              {message.attachments.map((att, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-[#F9FAFB] rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <FileText className="size-4 text-[#6B7280]" />
                                    <span className="text-sm text-[#111827]">{att.name}</span>
                                    <span className="text-xs text-[#9CA3AF]">{att.size}</span>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#6B7280]">
                                    <Download className="size-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()
                ) : (
                  <div className="flex items-center justify-center h-96 text-center">
                    <div>
                      <Mail className="size-12 mx-auto text-[#D1D5DB] mb-3" />
                      <p className="text-[#6B7280]">Select a message to view</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Activity Log Tab */}
        {activeTab === "activity" && (
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Activity Log</CardTitle>
                <CardDescription>All actions taken by this supplier</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-[#E5E7EB]">
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF]" />
                  <Input
                    placeholder="Search activities..."
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 border-[#E5E7EB]">
                      <Filter className="size-4 mr-2" />
                      Type
                      {activityTypeFilter.length > 0 && (
                        <Badge className="ml-2 bg-[#16A34A] text-white text-xs px-1.5">{activityTypeFilter.length}</Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {activityTypes.map(type => (
                      <DropdownMenuItem
                        key={type.key}
                        onClick={() => setActivityTypeFilter(prev => 
                          prev.includes(type.key) ? prev.filter(t => t !== type.key) : [...prev, type.key]
                        )}
                        className="flex items-center justify-between"
                      >
                        <span>{type.label}</span>
                        {activityTypeFilter.includes(type.key) && <CheckCircle className="size-4 text-[#16A34A]" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => setActivitySortOrder(prev => prev === "desc" ? "asc" : "desc")}
                >
                  <ArrowUpDown className="size-3 mr-1" />
                  {activitySortOrder === "desc" ? "Newest" : "Oldest"}
                </Button>

                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 text-[#6B7280] hover:text-red-600"
                    onClick={clearActivityFilters}
                  >
                    <X className="size-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Activity Table */}
              <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide w-32">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Details</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide w-36">Date/Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredActivities.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-[#6B7280]">
                          No activities match your filters
                        </td>
                      </tr>
                    ) : (
                      filteredActivities.map(activity => {
                        const { date, time } = formatTimestamp(activity.timestamp)
                        return (
                          <tr key={activity.id} className="hover:bg-[#F9FAFB] transition-colors">
                            <td className="px-4 py-3">
                              <Badge className={`${getActivityTypeStyle(activity.type)} border-0 text-xs font-medium`}>
                                <span className="mr-1">{getActivityIcon(activity.type)}</span>
                                {activityTypes.find(t => t.key === activity.type)?.label}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 font-medium text-[#111827]">
                              {activity.action}
                            </td>
                            <td className="px-4 py-3 text-[#6B7280]">
                              {activity.detail}
                            </td>
                            <td className="px-4 py-3 text-[#6B7280]">
                              <div>
                                <p>{date}</p>
                                <p className="text-xs text-[#9CA3AF]">{time}</p>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[#6B7280]">
                Showing {filteredActivities.length} of {submission.activities.length} activities
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
