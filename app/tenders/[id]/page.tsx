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
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
  ChevronDown,
  Plus,
  X,
  Eye,
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
    { 
      name: "Completeness", 
      weight: 15,
      instructions: "Assess whether the supplier has provided all required documentation and addressed all sections of the tender. Look for completeness of responses and adherence to submission guidelines.",
      subcategories: ["Documentation completeness", "Response coverage", "Compliance with requirements"]
    },
    { 
      name: "Quality", 
      weight: 20,
      instructions: "Evaluate the quality of proposed products/services, certifications held, and quality management processes in place. Consider track record and quality assurance measures.",
      subcategories: ["Product/service quality", "Quality certifications", "Quality management processes"]
    },
    { 
      name: "Capability", 
      weight: 15,
      instructions: "Review technical expertise, relevant project experience, team qualifications, and infrastructure capacity to deliver the requirements at scale.",
      subcategories: ["Technical expertise", "Relevant experience", "Team qualifications", "Infrastructure"]
    },
    { 
      name: "Price", 
      weight: 20,
      instructions: "Analyze pricing competitiveness, value for money, payment terms offered, and total cost of ownership including any hidden costs or long-term implications.",
      subcategories: ["Base pricing", "Value for money", "Payment terms", "Total cost of ownership"]
    },
    { 
      name: "Sustainability", 
      weight: 20,
      instructions: "Assess environmental impact, carbon footprint reduction measures, ethical sourcing practices, and social responsibility initiatives aligned with our ESG goals.",
      subcategories: ["Environmental impact", "Carbon footprint", "Ethical sourcing", "Social responsibility"]
    },
    { 
      name: "Risk", 
      weight: 10,
      instructions: "Evaluate financial stability, supply chain reliability, business continuity plans, and insurance coverage to minimize procurement risks.",
      subcategories: ["Financial stability", "Supply chain reliability", "Business continuity", "Insurance coverage"]
    },
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
    keyContact: "John Smith",
    keyContactEmail: "john.smith@ecosupply.com",
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
    keyContact: "Emma Davis",
    keyContactEmail: "emma.davis@greenoffice.com",
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
    keyContact: "Michael Brown",
    keyContactEmail: "m.brown@sustainablesolutions.com",
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
    keyContact: "Lisa Johnson",
    keyContactEmail: "lisa.j@earthfirst.com",
    proposedValue: 108000,
    totalHours: 200,
    completionDate: "Jun 15, 2026",
    scores: null,
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
    keyContact: "David Lee",
    keyContactEmail: "d.lee@cleantech.com",
    proposedValue: 121000,
    totalHours: 250,
    completionDate: "Jul 30, 2026",
    scores: null,
    weightedScore: null,
    documents: [
      { name: "Full Proposal.pdf", size: "4.1 MB" },
      { name: "Cost Analysis.xlsx", size: "267 KB" },
      { name: "References.pdf", size: "890 KB" },
      { name: "Certifications.pdf", size: "1.2 MB" },
    ],
  },
]

// Detailed AI assessment data for each evaluated submission
const assessmentData: Record<string, {
  categories: {
    name: string
    aiScore: number
    actualScore: number
    subcategories: {
      name: string
      aiScore: number
      actualScore: number
      aiJustification: string
      humanJustification: string
    }[]
  }[]
}> = {
  s1: {
    categories: [
      {
        name: "Completeness",
        aiScore: 95,
        actualScore: 95,
        subcategories: [
          { name: "Documentation completeness", aiScore: 98, actualScore: 98, aiJustification: "All required documents have been submitted including company profile, technical proposal, pricing schedule, certifications, and references. The submission follows the required format and structure.", humanJustification: "" },
          { name: "Response coverage", aiScore: 94, actualScore: 94, aiJustification: "The proposal addresses 94% of the requirements outlined in the tender specification. Minor gaps identified in the waste management section.", humanJustification: "" },
          { name: "Compliance with requirements", aiScore: 93, actualScore: 93, aiJustification: "Strong compliance with ISO 14001 requirements. All paper products exceed the 80% recycled content threshold. Delivery vehicles confirmed as Euro 6 compliant.", humanJustification: "" },
        ]
      },
      {
        name: "Quality",
        aiScore: 88,
        actualScore: 88,
        subcategories: [
          { name: "Product/service quality", aiScore: 90, actualScore: 90, aiJustification: "Product samples provided demonstrate high quality. Customer reviews indicate 4.5/5 average satisfaction rating.", humanJustification: "" },
          { name: "Quality certifications", aiScore: 85, actualScore: 85, aiJustification: "Holds ISO 9001 and ISO 14001 certifications. EU Ecolabel certification confirmed for 80% of product range.", humanJustification: "" },
          { name: "Quality management processes", aiScore: 89, actualScore: 89, aiJustification: "Robust QMS documented with clear inspection protocols and defect tracking systems in place.", humanJustification: "" },
        ]
      },
      {
        name: "Capability",
        aiScore: 92,
        actualScore: 92,
        subcategories: [
          { name: "Technical expertise", aiScore: 94, actualScore: 94, aiJustification: "Team includes certified sustainability professionals. 15 years experience in eco-friendly office supplies.", humanJustification: "" },
          { name: "Relevant experience", aiScore: 91, actualScore: 91, aiJustification: "Successfully delivered similar contracts for 3 Fortune 500 companies in the past 5 years.", humanJustification: "" },
          { name: "Team qualifications", aiScore: 90, actualScore: 90, aiJustification: "Key personnel hold relevant certifications including CIPS and environmental management qualifications.", humanJustification: "" },
          { name: "Infrastructure", aiScore: 93, actualScore: 93, aiJustification: "Modern warehouse facilities with capacity to handle orders up to 3x current requirements. Established logistics network.", humanJustification: "" },
        ]
      },
      {
        name: "Price",
        aiScore: 85,
        actualScore: 85,
        subcategories: [
          { name: "Base pricing", aiScore: 82, actualScore: 82, aiJustification: "Pricing is 5% above market average but includes premium sustainable materials.", humanJustification: "" },
          { name: "Value for money", aiScore: 88, actualScore: 88, aiJustification: "Total cost of ownership analysis shows 12% savings over 3-year period due to durability.", humanJustification: "" },
          { name: "Payment terms", aiScore: 84, actualScore: 84, aiJustification: "Offers Net 45 payment terms with 2% early payment discount.", humanJustification: "" },
          { name: "Total cost of ownership", aiScore: 86, actualScore: 86, aiJustification: "Comprehensive TCO breakdown provided including maintenance, replacement, and disposal costs.", humanJustification: "" },
        ]
      },
      {
        name: "Sustainability",
        aiScore: 90,
        actualScore: 90,
        subcategories: [
          { name: "Environmental impact", aiScore: 92, actualScore: 92, aiJustification: "Carbon neutral operations certified. Uses 100% renewable energy in manufacturing.", humanJustification: "" },
          { name: "Carbon footprint", aiScore: 88, actualScore: 88, aiJustification: "Documented 40% reduction in carbon footprint over past 5 years. Offset program for remaining emissions.", humanJustification: "" },
          { name: "Ethical sourcing", aiScore: 91, actualScore: 91, aiJustification: "Fair Trade certified suppliers. Transparent supply chain with published audit results.", humanJustification: "" },
          { name: "Social responsibility", aiScore: 89, actualScore: 89, aiJustification: "Active community programs and diversity initiatives. Living wage certification for all employees.", humanJustification: "" },
        ]
      },
      {
        name: "Risk",
        aiScore: 87,
        actualScore: 87,
        subcategories: [
          { name: "Financial stability", aiScore: 90, actualScore: 90, aiJustification: "Strong balance sheet with 8 years consecutive profitability. Dun & Bradstreet rating of AA.", humanJustification: "" },
          { name: "Supply chain reliability", aiScore: 85, actualScore: 85, aiJustification: "Dual-sourcing strategy in place. 98.5% on-time delivery rate over past 2 years.", humanJustification: "" },
          { name: "Business continuity", aiScore: 86, actualScore: 86, aiJustification: "Comprehensive BCP documented with regular testing. Backup facilities available.", humanJustification: "" },
          { name: "Insurance coverage", aiScore: 87, actualScore: 87, aiJustification: "Adequate liability coverage of $5M. Product liability and professional indemnity in place.", humanJustification: "" },
        ]
      },
    ]
  },
  s2: {
    categories: [
      {
        name: "Completeness",
        aiScore: 100,
        actualScore: 100,
        subcategories: [
          { name: "Documentation completeness", aiScore: 100, actualScore: 100, aiJustification: "Exceptional submission with all required and supplementary documents provided. Clear organization and professional presentation.", humanJustification: "" },
          { name: "Response coverage", aiScore: 100, actualScore: 100, aiJustification: "Every requirement addressed comprehensively with detailed explanations and supporting evidence.", humanJustification: "" },
          { name: "Compliance with requirements", aiScore: 100, actualScore: 100, aiJustification: "Full compliance with all mandatory requirements. No gaps or exceptions noted.", humanJustification: "" },
        ]
      },
      {
        name: "Quality",
        aiScore: 85,
        actualScore: 85,
        subcategories: [
          { name: "Product/service quality", aiScore: 86, actualScore: 86, aiJustification: "Good quality products with consistent customer feedback. Some variation noted in batch quality.", humanJustification: "" },
          { name: "Quality certifications", aiScore: 84, actualScore: 84, aiJustification: "ISO 9001 certified. EU Ecolabel for 65% of product range - below tender preference.", humanJustification: "" },
          { name: "Quality management processes", aiScore: 85, actualScore: 85, aiJustification: "Standard QMS in place with documented procedures. Room for improvement in traceability.", humanJustification: "" },
        ]
      },
      {
        name: "Capability",
        aiScore: 88,
        actualScore: 88,
        subcategories: [
          { name: "Technical expertise", aiScore: 87, actualScore: 87, aiJustification: "Competent team with 10 years industry experience. Growing sustainability expertise.", humanJustification: "" },
          { name: "Relevant experience", aiScore: 89, actualScore: 89, aiJustification: "Strong track record with mid-market clients. Limited Fortune 500 experience.", humanJustification: "" },
          { name: "Team qualifications", aiScore: 88, actualScore: 88, aiJustification: "Team includes procurement specialists and environmental consultants.", humanJustification: "" },
          { name: "Infrastructure", aiScore: 88, actualScore: 88, aiJustification: "Modern facilities with room to scale. Strategic warehouse locations.", humanJustification: "" },
        ]
      },
      {
        name: "Price",
        aiScore: 92,
        actualScore: 92,
        subcategories: [
          { name: "Base pricing", aiScore: 94, actualScore: 94, aiJustification: "Most competitive pricing among evaluated submissions. 8% below market average.", humanJustification: "" },
          { name: "Value for money", aiScore: 91, actualScore: 91, aiJustification: "Excellent price-to-quality ratio. Bulk discount structure favorable.", humanJustification: "" },
          { name: "Payment terms", aiScore: 90, actualScore: 90, aiJustification: "Flexible Net 60 terms available. Volume-based pricing tiers.", humanJustification: "" },
          { name: "Total cost of ownership", aiScore: 93, actualScore: 93, aiJustification: "Lowest overall TCO projection over contract period.", humanJustification: "" },
        ]
      },
      {
        name: "Sustainability",
        aiScore: 86,
        actualScore: 86,
        subcategories: [
          { name: "Environmental impact", aiScore: 85, actualScore: 85, aiJustification: "Working towards carbon neutrality - currently at 70% reduction. Strong improvement trajectory.", humanJustification: "" },
          { name: "Carbon footprint", aiScore: 84, actualScore: 84, aiJustification: "Published carbon footprint data. Active reduction program with measurable targets.", humanJustification: "" },
          { name: "Ethical sourcing", aiScore: 88, actualScore: 88, aiJustification: "Supplier code of conduct in place. Regular audits conducted.", humanJustification: "" },
          { name: "Social responsibility", aiScore: 87, actualScore: 87, aiJustification: "Community engagement programs. Apprenticeship scheme for sustainability skills.", humanJustification: "" },
        ]
      },
      {
        name: "Risk",
        aiScore: 91,
        actualScore: 91,
        subcategories: [
          { name: "Financial stability", aiScore: 93, actualScore: 93, aiJustification: "Excellent financial health with strong cash reserves. Part of larger group providing additional stability.", humanJustification: "" },
          { name: "Supply chain reliability", aiScore: 90, actualScore: 90, aiJustification: "Well-established supplier network. 99.2% fulfillment rate.", humanJustification: "" },
          { name: "Business continuity", aiScore: 89, actualScore: 89, aiJustification: "Comprehensive BCP with tested disaster recovery procedures.", humanJustification: "" },
          { name: "Insurance coverage", aiScore: 92, actualScore: 92, aiJustification: "Comprehensive insurance package exceeding requirements.", humanJustification: "" },
        ]
      },
    ]
  },
  s3: {
    categories: [
      {
        name: "Completeness",
        aiScore: 90,
        actualScore: 90,
        subcategories: [
          { name: "Documentation completeness", aiScore: 92, actualScore: 92, aiJustification: "Most required documents provided. Minor formatting inconsistencies noted.", humanJustification: "" },
          { name: "Response coverage", aiScore: 88, actualScore: 88, aiJustification: "Good coverage of requirements with some sections lacking detail.", humanJustification: "" },
          { name: "Compliance with requirements", aiScore: 90, actualScore: 90, aiJustification: "Meets all mandatory requirements. Some preferred criteria not fully addressed.", humanJustification: "" },
        ]
      },
      {
        name: "Quality",
        aiScore: 95,
        actualScore: 95,
        subcategories: [
          { name: "Product/service quality", aiScore: 96, actualScore: 96, aiJustification: "Premium quality products with exceptional durability. Industry-leading specifications.", humanJustification: "" },
          { name: "Quality certifications", aiScore: 94, actualScore: 94, aiJustification: "Comprehensive certification portfolio including ISO 9001, 14001, and B Corp.", humanJustification: "" },
          { name: "Quality management processes", aiScore: 95, actualScore: 95, aiJustification: "Best-in-class QMS with continuous improvement culture. Six Sigma methodology.", humanJustification: "" },
        ]
      },
      {
        name: "Capability",
        aiScore: 90,
        actualScore: 90,
        subcategories: [
          { name: "Technical expertise", aiScore: 91, actualScore: 91, aiJustification: "Highly skilled team with deep sustainability expertise.", humanJustification: "" },
          { name: "Relevant experience", aiScore: 89, actualScore: 89, aiJustification: "Impressive project portfolio in sustainability sector.", humanJustification: "" },
          { name: "Team qualifications", aiScore: 90, actualScore: 90, aiJustification: "Industry-recognized experts on the team.", humanJustification: "" },
          { name: "Infrastructure", aiScore: 90, actualScore: 90, aiJustification: "State-of-the-art facilities purpose-built for sustainable operations.", humanJustification: "" },
        ]
      },
      {
        name: "Price",
        aiScore: 78,
        actualScore: 78,
        subcategories: [
          { name: "Base pricing", aiScore: 75, actualScore: 75, aiJustification: "Premium pricing - 15% above market average. Reflects quality positioning.", humanJustification: "" },
          { name: "Value for money", aiScore: 82, actualScore: 82, aiJustification: "Higher upfront cost offset by superior durability and lower replacement frequency.", humanJustification: "" },
          { name: "Payment terms", aiScore: 78, actualScore: 78, aiJustification: "Standard Net 30 terms. Limited flexibility on pricing.", humanJustification: "" },
          { name: "Total cost of ownership", aiScore: 77, actualScore: 77, aiJustification: "Highest TCO among evaluated suppliers despite quality benefits.", humanJustification: "" },
        ]
      },
      {
        name: "Sustainability",
        aiScore: 94,
        actualScore: 94,
        subcategories: [
          { name: "Environmental impact", aiScore: 96, actualScore: 96, aiJustification: "Industry leader in environmental performance. Net positive impact achieved.", humanJustification: "" },
          { name: "Carbon footprint", aiScore: 95, actualScore: 95, aiJustification: "Carbon negative operations. Extensive offset and removal programs.", humanJustification: "" },
          { name: "Ethical sourcing", aiScore: 93, actualScore: 93, aiJustification: "Exemplary supply chain ethics. Full transparency and traceability.", humanJustification: "" },
          { name: "Social responsibility", aiScore: 92, actualScore: 92, aiJustification: "Award-winning CSR programs. Significant positive community impact.", humanJustification: "" },
        ]
      },
      {
        name: "Risk",
        aiScore: 82,
        actualScore: 82,
        subcategories: [
          { name: "Financial stability", aiScore: 80, actualScore: 80, aiJustification: "Smaller company with good growth trajectory but limited reserves.", humanJustification: "" },
          { name: "Supply chain reliability", aiScore: 83, actualScore: 83, aiJustification: "Strong supplier relationships but some single-source dependencies.", humanJustification: "" },
          { name: "Business continuity", aiScore: 82, actualScore: 82, aiJustification: "BCP in place but not recently tested.", humanJustification: "" },
          { name: "Insurance coverage", aiScore: 83, actualScore: 83, aiJustification: "Adequate coverage meeting minimum requirements.", humanJustification: "" },
        ]
      },
    ]
  },
}

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

// Team members for this tender
const teamMembersData = [
  { id: "t1", name: "Sarah Chen", email: "sarah.chen@company.com", companyTitle: "Senior Procurement Manager", projectRole: "Lead", isLead: true },
  { id: "t2", name: "James Wilson", email: "james.wilson@company.com", companyTitle: "Finance Analyst", projectRole: "Budget Reviewer", isLead: false },
  { id: "t3", name: "Emily Rodriguez", email: "emily.rodriguez@company.com", companyTitle: "Sustainability Officer", projectRole: "ESG Evaluator", isLead: false },
  { id: "t4", name: "Michael Park", email: "michael.park@company.com", companyTitle: "Legal Counsel", projectRole: "Contract Reviewer", isLead: false },
]

// Available company members to add
const companyMembersData = [
  { id: "c1", name: "David Thompson", email: "david.thompson@company.com", companyTitle: "Operations Manager" },
  { id: "c2", name: "Lisa Wang", email: "lisa.wang@company.com", companyTitle: "IT Director" },
  { id: "c3", name: "Robert Martinez", email: "robert.martinez@company.com", companyTitle: "Quality Assurance Lead" },
  { id: "c4", name: "Jennifer Adams", email: "jennifer.adams@company.com", companyTitle: "Compliance Officer" },
]

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "team", label: "Team", count: teamMembersData.length },
  { key: "submissions", label: "Submissions", count: tenderData.submissions },
  { key: "criteria", label: "Evaluation Criteria" },
  { key: "results", label: "Results" },
  { key: "documents", label: "Documents", count: documentsData.length },
  { key: "activity", label: "Activity" },
]

export default function TenderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [criteriaEditOpen, setCriteriaEditOpen] = useState(false)
  const [editableCriteria, setEditableCriteria] = useState(tenderData.evaluationCriteria)
  const [expandedCriteria, setExpandedCriteria] = useState<string[]>([])
  const [expandedEvalCriteria, setExpandedEvalCriteria] = useState<string[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null)
  const [assessmentScores, setAssessmentScores] = useState<Record<string, typeof assessmentData.s1>>(assessmentData)
  const [expandedAiJustification, setExpandedAiJustification] = useState<Record<string, boolean>>({})
  const [ownerEditOpen, setOwnerEditOpen] = useState(false)
  const [editableOwner, setEditableOwner] = useState({ name: tenderData.owner, email: tenderData.ownerEmail })
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState(teamMembersData)
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [addNewMemberOpen, setAddNewMemberOpen] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", email: "", companyTitle: "", projectRole: "" })
  const [selectedMemberRole, setSelectedMemberRole] = useState("")

  const addExistingMember = (member: typeof companyMembersData[0]) => {
    const newTeamMember = {
      id: `t${teamMembers.length + 1}`,
      name: member.name,
      email: member.email,
      companyTitle: member.companyTitle,
      projectRole: selectedMemberRole || "Team Member",
      isLead: false,
    }
    setTeamMembers(prev => [...prev, newTeamMember])
    setAddMemberOpen(false)
    setSelectedMemberRole("")
  }

  const addNewTeamMember = () => {
    if (!newMember.name || !newMember.email) return
    const newTeamMember = {
      id: `t${teamMembers.length + 1}`,
      name: newMember.name,
      email: newMember.email,
      companyTitle: newMember.companyTitle,
      projectRole: newMember.projectRole || "Team Member",
      isLead: false,
    }
    setTeamMembers(prev => [...prev, newTeamMember])
    setAddNewMemberOpen(false)
    setNewMember({ name: "", email: "", companyTitle: "", projectRole: "" })
  }

  const removeTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id))
  }

  const availableCompanyMembers = companyMembersData.filter(
    cm => !teamMembers.some(tm => tm.email === cm.email)
  )

  const toggleCriteriaExpand = (name: string) => {
    setExpandedCriteria(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const updateCriteriaWeight = (index: number, weight: number) => {
    setEditableCriteria(prev => prev.map((c, i) => 
      i === index ? { ...c, weight: Math.max(0, Math.min(100, weight)) } : c
    ))
  }

  const addSubcategory = (criteriaIndex: number) => {
    setEditableCriteria(prev => prev.map((c, i) => 
      i === criteriaIndex 
        ? { ...c, subcategories: [...c.subcategories, "New subcategory"] }
        : c
    ))
  }

  const updateSubcategory = (criteriaIndex: number, subIndex: number, value: string) => {
    setEditableCriteria(prev => prev.map((c, i) => 
      i === criteriaIndex 
        ? { ...c, subcategories: c.subcategories.map((s, si) => si === subIndex ? value : s) }
        : c
    ))
  }

  const removeSubcategory = (criteriaIndex: number, subIndex: number) => {
    setEditableCriteria(prev => prev.map((c, i) => 
      i === criteriaIndex 
        ? { ...c, subcategories: c.subcategories.filter((_, si) => si !== subIndex) }
        : c
    ))
  }

  const updateCriteriaInstructions = (index: number, instructions: string) => {
    setEditableCriteria(prev => prev.map((c, i) => 
      i === index ? { ...c, instructions } : c
    ))
  }

  const toggleEvalCriteriaExpand = (name: string) => {
    setExpandedEvalCriteria(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const updateAssessmentScore = (submissionId: string, categoryIndex: number, subcategoryIndex: number, score: number) => {
    setAssessmentScores(prev => {
      const updated = { ...prev }
      if (updated[submissionId]) {
        updated[submissionId] = {
          ...updated[submissionId],
          categories: updated[submissionId].categories.map((cat, ci) => 
            ci === categoryIndex ? {
              ...cat,
              subcategories: cat.subcategories.map((sub, si) => 
                si === subcategoryIndex ? { ...sub, actualScore: score } : sub
              )
            } : cat
          )
        }
      }
      return updated
    })
  }

  const updateAssessmentJustification = (submissionId: string, categoryIndex: number, subcategoryIndex: number, justification: string) => {
    setAssessmentScores(prev => {
      const updated = { ...prev }
      if (updated[submissionId]) {
        updated[submissionId] = {
          ...updated[submissionId],
          categories: updated[submissionId].categories.map((cat, ci) => 
            ci === categoryIndex ? {
              ...cat,
              subcategories: cat.subcategories.map((sub, si) => 
                si === subcategoryIndex ? { ...sub, humanJustification: justification } : sub
              )
            } : cat
          )
        }
      }
      return updated
    })
  }

  const toggleAiJustification = (key: string) => {
    setExpandedAiJustification(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const saveCriteria = () => {
    // In production, this would save to the API
    setCriteriaEditOpen(false)
  }

  const makeWeights100 = () => {
    if (totalWeight === 0) return
    const factor = 100 / totalWeight
    setEditableCriteria(prev => prev.map(c => ({
      ...c,
      weight: Math.round(c.weight * factor)
    })))
  }

  const totalWeight = editableCriteria.reduce((sum, c) => sum + c.weight, 0)

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
            <div className="space-y-4">
              {/* Team */}
              <Card className="border-[#E5E7EB] bg-white">
                <CardContent className="p-4 space-y-3">
                  {/* Lead */}
                  {teamMembers.filter(m => m.isLead).map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-[#F0FDF4] text-[#16A34A] text-xs">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-[#111827]">{member.name}</p>
                          <p className="text-xs text-[#6B7280]">{member.companyTitle}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20">
                        {member.projectRole}
                      </Badge>
                    </div>
                  ))}
                  
                  {/* Other team members - collapsible */}
                  {teamMembers.filter(m => !m.isLead).length > 0 && (
                    <Collapsible open={teamDropdownOpen} onOpenChange={setTeamDropdownOpen}>
                      <CollapsibleTrigger className="flex items-center gap-2 text-xs text-[#6B7280] hover:text-[#111827] w-full py-1">
                        <ChevronDown className={`size-3 transition-transform ${teamDropdownOpen ? 'rotate-180' : ''}`} />
                        <span>{teamMembers.filter(m => !m.isLead).length} other team members</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 pt-2">
                        {teamMembers.filter(m => !m.isLead).map(member => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="size-7">
                                <AvatarFallback className="bg-[#F3F4F6] text-[#6B7280] text-xs">
                                  {member.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-[#111827]">{member.name}</p>
                                <p className="text-xs text-[#6B7280]">{member.companyTitle}</p>
                              </div>
                            </div>
                            <span className="text-xs text-[#6B7280]">{member.projectRole}</span>
                          </div>
                        ))}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full h-7 text-xs text-[#6B7280] hover:text-[#16A34A] mt-1"
                          onClick={() => setActiveTab("team")}
                        >
                          Manage team
                        </Button>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </CardContent>
              </Card>

              {/* Evaluation Criteria */}
              <Card className="border-[#E5E7EB] bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">Evaluation Criteria</CardTitle>
                  <Dialog open={criteriaEditOpen} onOpenChange={setCriteriaEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 border-[#E5E7EB]">
                        <Pencil className="size-3 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Evaluation Criteria</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B7280]">Total Weight:</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${totalWeight === 100 ? 'text-[#16A34A]' : 'text-red-600'}`}>
                              {totalWeight}%
                            </span>
                            {totalWeight !== 100 && totalWeight > 0 && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-6 text-xs border-[#E5E7EB]"
                                onClick={makeWeights100}
                              >
                                Make 100%
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="link"
                          className="h-auto p-0 text-sm text-[#16A34A] hover:text-[#15803D]"
                          onClick={() => {
                            setCriteriaEditOpen(false)
                            setActiveTab("criteria")
                          }}
                        >
                          Open Evaluation Criteria tab for detailed instructions
                          <ExternalLink className="size-3 ml-1" />
                        </Button>
                        
                        {editableCriteria.map((criteria, criteriaIndex) => (
                          <div key={criteria.name} className="border border-[#E5E7EB] rounded-lg p-3 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <Label className="text-sm font-medium text-[#111827]">{criteria.name}</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={criteria.weight}
                                  onChange={(e) => updateCriteriaWeight(criteriaIndex, parseInt(e.target.value) || 0)}
                                  className="w-16 h-8 text-center text-sm"
                                  min={0}
                                  max={100}
                                />
                                <span className="text-sm text-[#6B7280]">%</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-xs text-[#6B7280]">Subcategories</Label>
                              {criteria.subcategories.map((sub, subIndex) => (
                                <div key={subIndex} className="flex items-center gap-2">
                                  <Input
                                    value={sub}
                                    onChange={(e) => updateSubcategory(criteriaIndex, subIndex, e.target.value)}
                                    className="flex-1 h-8 text-sm"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="size-8 p-0 text-[#6B7280] hover:text-red-600"
                                    onClick={() => removeSubcategory(criteriaIndex, subIndex)}
                                  >
                                    <X className="size-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-[#6B7280] hover:text-[#16A34A]"
                                onClick={() => addSubcategory(criteriaIndex)}
                              >
                                <Plus className="size-3 mr-1" />
                                Add subcategory
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCriteriaEditOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={saveCriteria} 
                          className="bg-[#16A34A] hover:bg-[#15803D] text-white"
                          disabled={totalWeight !== 100}
                        >
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-3">
                  {editableCriteria.map((criteria, index) => (
                    <Collapsible 
                      key={index}
                      open={expandedCriteria.includes(criteria.name)}
                      onOpenChange={() => toggleCriteriaExpand(criteria.name)}
                    >
                      <div className="space-y-2">
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between text-sm hover:bg-[#F3F4F6] rounded p-1 -mx-1 transition-colors">
                            <div className="flex items-center gap-2">
                              <ChevronDown className={`size-4 text-[#6B7280] transition-transform ${expandedCriteria.includes(criteria.name) ? 'rotate-180' : ''}`} />
                              <span className="text-[#6B7280]">{criteria.name}</span>
                            </div>
                            <span className="font-medium text-[#111827]">{criteria.weight}%</span>
                          </div>
                        </CollapsibleTrigger>
                        <Progress value={criteria.weight} className="h-2" />
                        <CollapsibleContent>
                          <ul className="mt-2 ml-6 space-y-1">
                            {criteria.subcategories.map((sub, subIndex) => (
                              <li key={subIndex} className="text-xs text-[#6B7280] flex items-center gap-2">
                                <span className="size-1 rounded-full bg-[#D1D5DB]" />
                                {sub}
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </CardContent>
              </Card>

              </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">Team Members</h3>
                <p className="text-sm text-[#6B7280]">{teamMembers.length} people assigned to this tender</p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-[#E5E7EB]">
                      <Users className="size-4 mr-2" />
                      Add from Company
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Project Role</Label>
                        <Input 
                          placeholder="e.g. Technical Reviewer, Evaluator..."
                          value={selectedMemberRole}
                          onChange={(e) => setSelectedMemberRole(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Select from Company</Label>
                        {availableCompanyMembers.length > 0 ? (
                          <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {availableCompanyMembers.map(member => (
                              <div 
                                key={member.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                                onClick={() => addExistingMember(member)}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="size-8">
                                    <AvatarFallback className="bg-[#F3F4F6] text-[#6B7280] text-xs">
                                      {member.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-[#111827]">{member.name}</p>
                                    <p className="text-xs text-[#6B7280]">{member.companyTitle}</p>
                                  </div>
                                </div>
                                <Plus className="size-4 text-[#6B7280]" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-[#6B7280] py-4 text-center">All company members have been added</p>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={addNewMemberOpen} onOpenChange={setAddNewMemberOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white">
                      <Plus className="size-4 mr-2" />
                      New Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input 
                          placeholder="Full name"
                          value={newMember.name}
                          onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input 
                          type="email"
                          placeholder="email@company.com"
                          value={newMember.email}
                          onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company Title</Label>
                        <Input 
                          placeholder="e.g. Procurement Analyst"
                          value={newMember.companyTitle}
                          onChange={(e) => setNewMember(prev => ({ ...prev, companyTitle: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Project Role</Label>
                        <Input 
                          placeholder="e.g. Technical Reviewer"
                          value={newMember.projectRole}
                          onChange={(e) => setNewMember(prev => ({ ...prev, projectRole: e.target.value }))}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddNewMemberOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={addNewTeamMember}
                        className="bg-[#16A34A] hover:bg-[#15803D] text-white"
                        disabled={!newMember.name || !newMember.email}
                      >
                        Add Member
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card className="border-[#E5E7EB] bg-white">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Company Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Project Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Email</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {teamMembers.map(member => (
                        <tr key={member.id} className="hover:bg-[#F3F4F6] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="size-8">
                                <AvatarFallback className={`text-xs ${member.isLead ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                  {member.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-medium text-[#111827]">{member.name}</span>
                                {member.isLead && (
                                  <Badge variant="outline" className="ml-2 text-xs bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20">
                                    Lead
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#6B7280]">{member.companyTitle}</td>
                          <td className="px-6 py-4 text-[#6B7280]">{member.projectRole}</td>
                          <td className="px-6 py-4 text-[#6B7280]">{member.email}</td>
                          <td className="px-6 py-4 text-right">
                            {!member.isLead && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 text-[#6B7280] hover:text-red-600"
                                onClick={() => removeTeamMember(member.id)}
                              >
                                <X className="size-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Completeness</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Quality</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Capability</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Price</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Sustainability</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Risk</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Weighted</th>
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
                        <td className="px-2 py-3 text-center">
                          {submission.scores ? (
                            <span className="font-medium text-[#111827]">{submission.scores.sustainability}</span>
                          ) : (
                            <span className="text-[#D1D5DB]">-</span>
                          )}
                        </td>
                        <td className="px-2 py-3 text-center">
                          {submission.scores ? (
                            <span className="font-medium text-[#111827]">{submission.scores.risk}</span>
                          ) : (
                            <span className="text-[#D1D5DB]">-</span>
                          )}
                        </td>
                        <td className="px-2 py-3 text-center">
                          {submission.weightedScore ? (
                            <span className="font-semibold text-[#111827]">{submission.weightedScore}</span>
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

        {/* Evaluation Criteria Tab */}
        {activeTab === "criteria" && (
          <div className="space-y-6">
            <Card className="border-[#E5E7EB] bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">Evaluation Criteria</CardTitle>
                  <CardDescription>Configure weightings and instructions for each evaluation category</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#6B7280]">Total:</span>
                    <span className={`font-semibold ${totalWeight === 100 ? 'text-[#16A34A]' : 'text-red-600'}`}>
                      {totalWeight}%
                    </span>
                    {totalWeight !== 100 && totalWeight > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs border-[#E5E7EB]"
                        onClick={makeWeights100}
                      >
                        Make 100%
                      </Button>
                    )}
                  </div>
                  <Button 
                    onClick={saveCriteria}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white"
                    disabled={totalWeight !== 100}
                  >
                    Save Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editableCriteria.map((criteria, criteriaIndex) => (
                  <Collapsible
                    key={criteria.name}
                    open={expandedEvalCriteria.includes(criteria.name)}
                    onOpenChange={() => toggleEvalCriteriaExpand(criteria.name)}
                  >
                    <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 bg-[#F8F9FA] hover:bg-[#F3F4F6] transition-colors">
                          <div className="flex items-center gap-3">
                            <ChevronDown className={`size-4 text-[#6B7280] transition-transform ${expandedEvalCriteria.includes(criteria.name) ? 'rotate-180' : ''}`} />
                            <span className="font-medium text-[#111827]">{criteria.name}</span>
                            <span className="text-xs text-[#6B7280]">({criteria.subcategories.length} subcategories)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <Input
                                type="number"
                                value={criteria.weight}
                                onChange={(e) => updateCriteriaWeight(criteriaIndex, parseInt(e.target.value) || 0)}
                                className="w-16 h-8 text-center text-sm"
                                min={0}
                                max={100}
                              />
                              <span className="text-sm text-[#6B7280]">%</span>
                            </div>
                            <Progress value={criteria.weight} className="w-24 h-2" />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-4 space-y-4 border-t border-[#E5E7EB]">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#111827]">Evaluation Instructions</Label>
                            <Textarea
                              value={criteria.instructions}
                              onChange={(e) => updateCriteriaInstructions(criteriaIndex, e.target.value)}
                              placeholder="Describe what evaluators should look for when assessing this criteria..."
                              className="min-h-[80px] text-sm"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#111827]">Subcategories</Label>
                            <div className="space-y-2">
                              {criteria.subcategories.map((sub, subIndex) => (
                                <div key={subIndex} className="flex items-center gap-2">
                                  <Input
                                    value={sub}
                                    onChange={(e) => updateSubcategory(criteriaIndex, subIndex, e.target.value)}
                                    className="flex-1 h-9 text-sm"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="size-9 p-0 text-[#6B7280] hover:text-red-600"
                                    onClick={() => removeSubcategory(criteriaIndex, subIndex)}
                                  >
                                    <X className="size-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs border-dashed border-[#E5E7EB] text-[#6B7280] hover:text-[#16A34A] hover:border-[#16A34A]"
                                onClick={() => addSubcategory(criteriaIndex)}
                              >
                                <Plus className="size-3 mr-1" />
                                Add subcategory
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "results" && !selectedAssessment && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">Evaluation Results</h3>
                <p className="text-sm text-[#6B7280]">
                  {submissionsData.filter(s => s.weightedScore).length} of {submissionsData.length} submissions evaluated
                </p>
              </div>
            </div>

            <Card className="border-[#E5E7EB] bg-white">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Supplier</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Completeness</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Quality</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Capability</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Price</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Sustainability</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Risk</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Weighted</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wide">Value</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Hours</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Completion</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Contact</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Assessment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {submissionsData.map(submission => (
                        <tr key={submission.id} className="hover:bg-[#F3F4F6] transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="size-8">
                                <AvatarFallback className={`text-xs ${submission.weightedScore ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                  {submission.supplierName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-[#111827]">{submission.supplierName}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            {submission.scores ? (
                              <span className="font-medium text-[#111827]">{submission.scores.completeness}</span>
                            ) : (
                              <span className="text-[#D1D5DB]">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {submission.scores ? (
                              <span className="font-medium text-[#111827]">{submission.scores.quality}</span>
                            ) : (
                              <span className="text-[#D1D5DB]">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {submission.scores ? (
                              <span className="font-medium text-[#111827]">{submission.scores.capability}</span>
                            ) : (
                              <span className="text-[#D1D5DB]">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {submission.scores ? (
                              <span className="font-medium text-[#111827]">{submission.scores.price}</span>
                            ) : (
                              <span className="text-[#D1D5DB]">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {submission.scores ? (
                              <span className="font-medium text-[#111827]">{submission.scores.sustainability}</span>
                            ) : (
                              <span className="text-[#D1D5DB]">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {submission.scores ? (
                              <span className="font-medium text-[#111827]">{submission.scores.risk}</span>
                            ) : (
                              <span className="text-[#D1D5DB]">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {submission.weightedScore ? (
                              <span className="font-semibold text-[#16A34A]">{submission.weightedScore}</span>
                            ) : (
                              <span className="text-[#D1D5DB]">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-right text-[#111827]">
                            {formatBudget(submission.proposedValue)}
                          </td>
                          <td className="px-3 py-3 text-center text-[#6B7280]">
                            {submission.totalHours}
                          </td>
                          <td className="px-3 py-3 text-[#6B7280]">
                            {submission.completionDate}
                          </td>
                          <td className="px-3 py-3">
                            <div>
                              <p className="text-[#111827] text-xs">{submission.keyContact}</p>
                              <p className="text-[#6B7280] text-xs truncate max-w-[120px]">{submission.keyContactEmail}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {submission.weightedScore ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs border-[#E5E7EB]"
                                onClick={() => setSelectedAssessment(submission.id)}
                              >
                                View
                              </Button>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                                Pending
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Assessment View */}
        {activeTab === "results" && selectedAssessment && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#6B7280]"
                onClick={() => setSelectedAssessment(null)}
              >
                <ArrowLeft className="size-4 mr-1" />
                Back to Results
              </Button>
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">
                  Assessment: {submissionsData.find(s => s.id === selectedAssessment)?.supplierName}
                </h3>
                <p className="text-sm text-[#6B7280]">
                  Detailed evaluation breakdown with AI and human scores
                </p>
              </div>
            </div>

            {assessmentScores[selectedAssessment]?.categories.map((category, categoryIndex) => (
              <Card key={category.name} className="border-[#E5E7EB] bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">{category.name}</CardTitle>
                      <Badge variant="outline" className="text-xs bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]">
                        {editableCriteria.find(c => c.name === category.name)?.weight}% weight
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-[#6B7280]">AI Score:</span>
                        <span className="font-medium text-[#6B7280]">{category.aiScore}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#6B7280]">Final Score:</span>
                        <span className="font-semibold text-[#16A34A]">{category.actualScore}</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {editableCriteria.find(c => c.name === category.name)?.instructions}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.subcategories.map((sub, subIndex) => {
                    const justificationKey = `${selectedAssessment}-${categoryIndex}-${subIndex}`
                    return (
                      <div key={sub.name} className="border border-[#E5E7EB] rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#111827]">{sub.name}</span>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-[#6B7280]">AI:</span>
                              <span className="font-medium text-[#6B7280]">{sub.aiScore}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-[#6B7280]">Score:</span>
                              <Input
                                type="number"
                                value={sub.actualScore}
                                onChange={(e) => updateAssessmentScore(selectedAssessment, categoryIndex, subIndex, parseInt(e.target.value) || 0)}
                                className="w-16 h-8 text-center text-sm font-semibold text-[#16A34A]"
                                min={0}
                                max={100}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* AI Justification - Collapsible */}
                        <Collapsible
                          open={expandedAiJustification[justificationKey]}
                          onOpenChange={() => toggleAiJustification(justificationKey)}
                        >
                          <CollapsibleTrigger className="flex items-center gap-2 text-xs text-[#6B7280] hover:text-[#111827]">
                            <ChevronDown className={`size-3 transition-transform ${expandedAiJustification[justificationKey] ? 'rotate-180' : ''}`} />
                            AI Justification
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <p className="mt-2 text-sm text-[#6B7280] bg-[#F3F4F6] rounded p-3 italic">
                              {sub.aiJustification}
                            </p>
                          </CollapsibleContent>
                        </Collapsible>

                        {/* Human Justification - Editable */}
                        <div className="space-y-2">
                          <Label className="text-xs text-[#6B7280]">Final Justification</Label>
                          <Textarea
                            value={sub.humanJustification || sub.aiJustification}
                            onChange={(e) => updateAssessmentJustification(selectedAssessment, categoryIndex, subIndex, e.target.value)}
                            placeholder="Edit or add to the AI-generated justification..."
                            className="min-h-[60px] text-sm"
                          />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end gap-3">
              <Button variant="outline" className="border-[#E5E7EB]" onClick={() => setSelectedAssessment(null)}>
                Cancel
              </Button>
              <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white" onClick={() => setSelectedAssessment(null)}>
                Save Assessment
              </Button>
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
