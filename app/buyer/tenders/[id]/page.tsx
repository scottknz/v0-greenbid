"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
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
import { Checkbox } from "@/components/ui/checkbox"
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
  Trash2,
  Star,
  Sparkles,
  Save,
  Loader2,
  Search,
  Filter,
  MessageSquare,
  ClipboardList,
  ArrowUpDown,
  MessageCircle,
  Paperclip,
  Reply,
  Globe,
  Lock,
  Zap,
  CheckCircle2,
  CircleDot,
  Scale,
  Trophy,
} from "lucide-react"
import { ApprovalRequestModal } from "@/components/approval/ApprovalRequestModal"
import { ApprovalStatus } from "@/components/approval/ApprovalStatus"
import { mockBuyerApprovalRequests } from "@/lib/mock-approvals"
import { cn } from "@/lib/utils"
import { RFPProgressBar } from "@/components/rfp/RFPProgressBar"
import type { ApprovalRequest } from "@/types/approval"

// Q&A Thread types
interface QaMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderCompany?: string;
  senderType: "buyer" | "supplier";
  content: string;
  attachments: { name: string; size: string; url: string }[];
  timestamp: string;
}

interface QaThread {
  id: string;
  subject: string;
  visibility: "all" | "private";
  createdAt: string;
  updatedAt: string;
  participants: string[];
  messages: QaMessage[];
}

// Mock data - in production this would come from an API
const tenderData = {
  id: "1",
  name: "Comprehensive Scope 3 Value Chain Emissions Analysis",
  referenceId: "TND-2026-001",
  status: "accepting_bids" as const,
  category: "Scope 3 / Value Chain",
  description: "Procurement of sustainable and eco-friendly office supplies including recycled paper products, biodegradable pens and markers, energy-efficient desk accessories, and environmentally certified furniture items. This RFP aims to reduce our carbon footprint while maintaining high-quality standards for workplace materials.",
  requirements: [
    "All paper products must contain minimum 80% post-consumer recycled content",
    "Plastic items must be recyclable or biodegradable",
    "Suppliers must hold ISO 14001 environmental certification",
    "Products must meet EU Ecolabel or equivalent standards",
    "Delivery vehicles must meet Euro 6 emission standards",
  ],
  evaluationCriteria: [
    { 
      name: "Content", 
      weight: 15,
      instructions: "Assess whether the supplier has provided all required documentation and addressed all sections of the RFP. Look for completeness of responses and adherence to submission guidelines.",
      instructionsSaved: true,
      subcategories: [
        { name: "Documentation completeness", description: "Verify all required documents are submitted including company profile, technical proposal, pricing, certifications, and references.", saved: true },
        { name: "Response coverage", description: "Check that all sections of the RFP specification have been addressed with appropriate detail and clarity.", saved: true },
        { name: "Compliance with requirements", description: "Confirm adherence to mandatory requirements including format, deadlines, and submission guidelines.", saved: true }
      ]
    },
    { 
      name: "Quality", 
      weight: 20,
      instructions: "Evaluate the quality of proposed products/services, certifications held, and quality management processes in place. Consider track record and quality assurance measures.",
      instructionsSaved: true,
      subcategories: [
        { name: "Product/service quality", description: "Assess the quality standards of proposed products or services based on specifications, samples, and track record.", saved: true },
        { name: "Quality certifications", description: "Review relevant quality certifications such as ISO 9001, industry-specific standards, and third-party validations.", saved: true },
        { name: "Quality management processes", description: "Evaluate documented QMS, inspection procedures, defect tracking, and continuous improvement practices.", saved: true }
      ]
    },
    { 
      name: "Capability", 
      weight: 15,
      instructions: "Review technical expertise, relevant project experience, team qualifications, and infrastructure capacity to deliver the requirements at scale.",
      instructionsSaved: true,
      subcategories: [
        { name: "Technical expertise", description: "Assess depth of technical knowledge, specialized skills, and industry-specific competencies of the team.", saved: true },
        { name: "Relevant experience", description: "Review past projects of similar scope, complexity, and industry to demonstrate proven capability.", saved: true },
        { name: "Team qualifications", description: "Evaluate credentials, certifications, and experience levels of key personnel assigned to the project.", saved: true },
        { name: "Infrastructure", description: "Assess facilities, equipment, technology systems, and capacity to handle project requirements.", saved: true }
      ]
    },
    { 
      name: "Sustainability", 
      weight: 20,
      instructions: "Assess environmental impact, carbon footprint reduction measures, ethical sourcing practices, and social responsibility initiatives aligned with our ESG goals.",
      instructionsSaved: true,
      subcategories: [
        { name: "Environmental impact", description: "Evaluate environmental policies, certifications, and measurable impact reduction initiatives.", saved: true },
        { name: "Carbon footprint", description: "Assess carbon emissions data, reduction targets, offset programs, and climate commitments.", saved: true },
        { name: "Ethical sourcing", description: "Review supply chain transparency, fair trade practices, and responsible material sourcing policies.", saved: true },
        { name: "Social responsibility", description: "Evaluate community engagement, diversity initiatives, labor practices, and social impact programs.", saved: true }
      ]
    },
    { 
      name: "Risk", 
      weight: 10,
      instructions: "Evaluate financial stability, supply chain reliability, business continuity plans, and insurance coverage to minimize procurement risks.",
      instructionsSaved: true,
      subcategories: [
        { name: "Financial stability", description: "Assess financial health through credit ratings, profitability trends, and balance sheet strength.", saved: true },
        { name: "Supply chain reliability", description: "Evaluate supplier network diversity, delivery track record, and contingency arrangements.", saved: true },
        { name: "Business continuity", description: "Review documented BCP, disaster recovery plans, and crisis management procedures.", saved: true },
        { name: "Insurance coverage", description: "Verify adequate liability, professional indemnity, and product insurance coverage levels.", saved: true }
      ]
    },
    { 
      name: "Price", 
      weight: 20,
      instructions: "Analyze pricing competitiveness, value for money, payment terms offered, and total cost of ownership including any hidden costs or long-term implications.",
      instructionsSaved: true,
      subcategories: [
        { name: "Base pricing", description: "Compare proposed pricing against market rates, budget constraints, and competitor offerings.", saved: true },
        { name: "Value for money", description: "Assess the overall value proposition considering quality, service levels, and long-term benefits relative to cost.", saved: true },
        { name: "Payment terms", description: "Evaluate flexibility of payment schedules, early payment discounts, and financing options offered.", saved: true },
        { name: "Total cost of ownership", description: "Calculate all costs including implementation, maintenance, training, and disposal over the contract period.", saved: true }
      ]
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
    keyContactPhone: "+1 (555) 123-4567",
    companyAddress: "123 Green Street, San Francisco, CA 94102",
    proposedValue: 118500,
    totalHours: 240,
    completionDate: "Jun 30, 2026",
    scores: {
      content: 95,
      quality: 88,
      capability: 92,
      sustainability: 90,
      risk: 87,
      price: 85,
    },
    weightedScore: 89,
    documents: [
      { name: "Company Profile.pdf", size: "1.2 MB" },
      { name: "Technical Proposal.pdf", size: "3.4 MB" },
      { name: "Pricing Schedule.xlsx", size: "245 KB" },
      { name: "Certifications.pdf", size: "890 KB" },
      { name: "References.pdf", size: "156 KB" },
    ],
    questionnaireResponses: [
      { question: "Describe your company's experience with sustainability consulting projects in the last 5 years.", answer: "EcoSupply has completed over 50 sustainability projects for Fortune 500 companies, including comprehensive carbon footprint assessments, supply chain sustainability audits, and sustainability reporting implementations. Notable clients include Tesla, Patagonia, and Unilever." },
      { question: "What certifications does your organization currently hold?", answer: "We hold ISO 14001:2015 Environmental Management, ISO 9001:2015 Quality Management, B Corp Certification (Score: 142), and are a certified Science Based Targets initiative (SBTi) partner." },
      { question: "How do you ensure data accuracy in your sustainability reporting?", answer: "We employ a three-tier verification process: automated data validation at collection, independent third-party audits, and continuous monitoring with real-time anomaly detection. All data is traceable to source documentation." },
      { question: "Describe your approach to stakeholder engagement in sustainability initiatives.", answer: "We facilitate multi-stakeholder workshops, conduct materiality assessments with both internal and external stakeholders, and provide regular progress reporting through dedicated dashboards and quarterly reviews." },
      { question: "What is your proposed timeline for initial assessment and recommendations?", answer: "We propose a 6-week initial assessment phase: Weeks 1-2 for data gathering and stakeholder interviews, Weeks 3-4 for analysis and benchmarking, and Weeks 5-6 for developing recommendations and presenting findings." },
    ],
  },
  {
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
      content: 100,
      quality: 85,
      capability: 88,
      sustainability: 86,
      risk: 91,
      price: 92,
    },
    weightedScore: 90,
    documents: [
      { name: "Company Overview.pdf", size: "2.1 MB" },
      { name: "Solution Proposal.pdf", size: "4.2 MB" },
      { name: "Cost Breakdown.xlsx", size: "312 KB" },
      { name: "ISO Certificates.pdf", size: "1.1 MB" },
    ],
    questionnaireResponses: [
      { question: "Describe your company's experience with sustainability consulting projects in the last 5 years.", answer: "GreenOffice has delivered 35+ sustainability transformation projects across manufacturing, retail, and technology sectors. Our team has helped companies achieve average emissions reductions of 28% within the first year." },
      { question: "What certifications does your organization currently hold?", answer: "ISO 14001:2015, ISO 50001:2018 Energy Management, CDP Supply Chain Member, GRI Certified Training Partner, and we maintain LEED AP credentials across our consulting team." },
      { question: "How do you ensure data accuracy in your sustainability reporting?", answer: "We use industry-standard GHG Protocol methodologies with built-in validation rules. All data undergoes peer review and we maintain full audit trails. Our reporting platform integrates directly with client ERP systems to minimize manual data entry errors." },
      { question: "Describe your approach to stakeholder engagement in sustainability initiatives.", answer: "We implement a comprehensive engagement framework including executive briefings, department-level working sessions, employee awareness programs, and external stakeholder surveys. We believe sustainable change requires buy-in at all levels." },
      { question: "What is your proposed timeline for initial assessment and recommendations?", answer: "Our accelerated assessment methodology delivers initial findings in 4 weeks: Week 1 for rapid data collection and system access, Weeks 2-3 for deep-dive analysis, and Week 4 for recommendations workshop and roadmap development." },
    ],
  },
  {
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
      content: 90,
      quality: 95,
      capability: 90,
      sustainability: 94,
      risk: 82,
      price: 78,
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
    questionnaireResponses: [
      { question: "Describe your company's experience with sustainability consulting projects in the last 5 years.", answer: "Sustainable Solutions Inc has been a leader in corporate sustainability for over 15 years, with 200+ completed projects. We specialize in complex, multi-site implementations and have particular expertise in Scope 3 emissions accounting and science-based target setting." },
      { question: "What certifications does your organization currently hold?", answer: "We maintain ISO 14001, ISO 14064-1 (GHG verification), and are CDP Gold Partner. Our team includes 12 certified GHG Lead Verifiers and 8 SASB FSA credential holders. We're also an official SBTi consulting partner." },
      { question: "How do you ensure data accuracy in your sustainability reporting?", answer: "Our proprietary SustainTrack platform provides automated data collection with 99.7% accuracy rates. We implement multi-level verification including AI-powered anomaly detection, cross-reference validation with utility data, and independent third-party limited assurance engagements." },
      { question: "Describe your approach to stakeholder engagement in sustainability initiatives.", answer: "We deploy our proven 'Sustainability Champions' model, identifying and training internal advocates across departments. This is complemented by regular town halls, interactive sustainability dashboards, and gamified engagement programs that have achieved 85%+ employee participation rates." },
      { question: "What is your proposed timeline for initial assessment and recommendations?", answer: "Given the comprehensive scope, we recommend an 8-week assessment: Weeks 1-3 for thorough data gathering across all value chain categories, Weeks 4-6 for detailed analysis and scenario modeling, and Weeks 7-8 for strategic recommendations and implementation roadmap with board-ready deliverables." },
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
        name: "Content",
        aiScore: 95,
        actualScore: 95,
        subcategories: [
          { name: "Documentation completeness", aiScore: 98, actualScore: 98, aiJustification: "All required documents have been submitted including company profile, technical proposal, pricing schedule, certifications, and references. The submission follows the required format and structure.", humanJustification: "" },
          { name: "Response coverage", aiScore: 94, actualScore: 94, aiJustification: "The proposal addresses 94% of the requirements outlined in the RFP specification. Minor gaps identified in the waste management section.", humanJustification: "" },
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
    ]
  },
  s2: {
    categories: [
      {
        name: "Content",
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
          { name: "Quality certifications", aiScore: 84, actualScore: 84, aiJustification: "ISO 9001 certified. EU Ecolabel for 65% of product range - below RFP preference.", humanJustification: "" },
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
    ]
  },
  s3: {
    categories: [
      {
        name: "Content",
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
    ]
  },
}

const documentsData = [
  { name: "RFP Specification Document.pdf", type: "PDF", size: "2.4 MB", uploadedDate: "Mar 1, 2026", uploadedBy: "Sarah Chen" },
  { name: "ESG Requirements Checklist.xlsx", type: "Excel", size: "156 KB", uploadedDate: "Mar 1, 2026", uploadedBy: "Sarah Chen" },
  { name: "Supplier Questionnaire Template.docx", type: "Word", size: "89 KB", uploadedDate: "Mar 2, 2026", uploadedBy: "Sarah Chen" },
  { name: "Budget Breakdown.xlsx", type: "Excel", size: "234 KB", uploadedDate: "Mar 3, 2026", uploadedBy: "James Wilson" },
  { name: "Evaluation Criteria Matrix.pdf", type: "PDF", size: "1.1 MB", uploadedDate: "Mar 5, 2026", uploadedBy: "Sarah Chen" },
]

const activityTypes = [
  { key: "submission", label: "Submission", color: "bg-blue-100 text-blue-700" },
    { key: "evaluation", label: "Evaluating", color: "bg-purple-100 text-purple-700" },
  { key: "document", label: "Document", color: "bg-amber-100 text-amber-700" },
  { key: "team", label: "Team", color: "bg-cyan-100 text-cyan-700" },
  { key: "tender", label: "Tender", color: "bg-brand-green-light text-brand-green" },
  { key: "comment", label: "Comment", color: "bg-gray-100 text-gray-700" },
]

const activityData = [
  { id: "a1", type: "submission", action: "Submission received", detail: "CleanTech Office submitted their proposal", person: "CleanTech Office", date: "2026-03-25", time: "2:30 PM" },
  { id: "a2", type: "evaluation", action: "Evaluation completed", detail: "GreenOffice Ltd evaluation finalized with score 90", person: "Sarah Chen", date: "2026-03-24", time: "4:15 PM" },
  { id: "a3", type: "evaluation", action: "Evaluation started", detail: "Started AI-assisted evaluation for EcoSupply Co.", person: "Emily Rodriguez", date: "2026-03-23", time: "10:00 AM" },
  { id: "a4", type: "submission", action: "Submission received", detail: "EarthFirst Supplies submitted their proposal", person: "EarthFirst Supplies", date: "2026-03-22", time: "11:00 AM" },
  { id: "a5", type: "comment", action: "Comment added", detail: "Added note on sustainability scoring methodology", person: "Emily Rodriguez", date: "2026-03-21", time: "3:00 PM" },
  { id: "a6", type: "submission", action: "Submission received", detail: "Sustainable Solutions Inc submitted their proposal", person: "Sustainable Solutions Inc", date: "2026-03-20", time: "9:45 AM" },
  { id: "a7", type: "evaluation", action: "Criteria updated", detail: "Updated Sustainability weighting from 15% to 20%", person: "Sarah Chen", date: "2026-03-19", time: "2:30 PM" },
  { id: "a8", type: "submission", action: "Submission received", detail: "GreenOffice Ltd submitted their proposal", person: "GreenOffice Ltd", date: "2026-03-18", time: "4:00 PM" },
  { id: "a9", type: "team", action: "Team member added", detail: "Michael Park joined as Contract Reviewer", person: "Sarah Chen", date: "2026-03-17", time: "11:30 AM" },
  { id: "a10", type: "submission", action: "Submission received", detail: "EcoSupply Co. submitted their proposal", person: "EcoSupply Co.", date: "2026-03-15", time: "10:15 AM" },
  { id: "a11", type: "document", action: "Document uploaded", detail: "Technical Requirements v2.pdf uploaded", person: "James Wilson", date: "2026-03-10", time: "9:00 AM" },
  { id: "a12", type: "team", action: "Team member added", detail: "Emily Rodriguez joined as ESG Evaluator", person: "Sarah Chen", date: "2026-03-08", time: "2:00 PM" },
  { id: "a13", type: "document", action: "Document uploaded", detail: "Budget Breakdown.xlsx added", person: "James Wilson", date: "2026-03-03", time: "3:45 PM" },
  { id: "a14", type: "tender", action: "Supplier invited", detail: "5 additional suppliers invited to RFP", person: "Sarah Chen", date: "2026-03-02", time: "10:30 AM" },
  { id: "a15", type: "tender", action: "RFP published", detail: "RFP made available to invited suppliers", person: "Sarah Chen", date: "2026-03-01", time: "9:00 AM" },
  { id: "a16", type: "document", action: "Document uploaded", detail: "RFP Document.pdf uploaded", person: "Sarah Chen", date: "2026-02-28", time: "4:00 PM" },
  { id: "a17", type: "team", action: "Team member added", detail: "James Wilson joined as Budget Reviewer", person: "Sarah Chen", date: "2026-02-26", time: "11:00 AM" },
  { id: "a18", type: "tender", action: "RFP created", detail: "Initial RFP draft created", person: "Sarah Chen", date: "2026-02-25", time: "2:00 PM" },
]

// Team members for this tender
const teamMembersData = [
  { id: "t1", name: "Sarah Chen", email: "sarah.chen@company.com", phone: "(555) 123-4567", companyTitle: "Senior Procurement Manager", projectRole: "Lead", isLead: true },
  { id: "t2", name: "James Wilson", email: "james.wilson@company.com", phone: "(555) 123-4568", companyTitle: "Finance Analyst", projectRole: "Budget Reviewer", isLead: false },
  { id: "t3", name: "Emily Rodriguez", email: "emily.rodriguez@company.com", phone: "(555) 123-4569", companyTitle: "Sustainability Officer", projectRole: "ESG Evaluator", isLead: false },
  { id: "t4", name: "Michael Park", email: "michael.park@company.com", phone: "(555) 123-4570", companyTitle: "Legal Counsel", projectRole: "Contract Reviewer", isLead: false },
]

// Available company members to add
const companyMembersData = [
  { id: "c1", name: "David Thompson", email: "david.thompson@company.com", companyTitle: "Operations Manager" },
  { id: "c2", name: "Lisa Wang", email: "lisa.wang@company.com", companyTitle: "IT Director" },
  { id: "c3", name: "Robert Martinez", email: "robert.martinez@company.com", companyTitle: "Quality Assurance Lead" },
  { id: "c4", name: "Jennifer Adams", email: "jennifer.adams@company.com", companyTitle: "Compliance Officer" },
]

// Q&A Threads mock data
const qaThreadsData = [
  {
    id: "t1",
    subject: "Clarification on recycled content requirements",
    visibility: "all" as const,
    createdAt: "2026-03-10T09:30:00Z",
    updatedAt: "2026-03-12T14:20:00Z",
    participants: ["s1", "s2", "s3"],
    messages: [
      {
        id: "m1",
        threadId: "t1",
        senderId: "buyer",
        senderName: "Sarah Chen",
        senderType: "buyer" as const,
        content: "Please note that all paper products must contain a minimum of 80% post-consumer recycled content. This is a mandatory requirement and submissions not meeting this threshold will be marked non-compliant.",
        attachments: [
          { name: "Recycling_Standards.pdf", size: "245 KB", url: "#" }
        ],
        timestamp: "2026-03-10T09:30:00Z",
      },
      {
        id: "m2",
        threadId: "t1",
        senderId: "s1",
        senderName: "John Smith",
        senderCompany: "EcoSupply Co.",
        senderType: "supplier" as const,
        content: "Thank you for the clarification. Can you confirm if this applies to all paper products or just A4 copy paper? Our specialty papers (card stock, envelopes) use different recycling streams.",
        attachments: [],
        timestamp: "2026-03-10T14:15:00Z",
      },
      {
        id: "m3",
        threadId: "t1",
        senderId: "buyer",
        senderName: "Sarah Chen",
        senderType: "buyer" as const,
        content: "Good question. The 80% requirement applies specifically to copy paper and printer paper. Specialty items like card stock and envelopes should contain at least 50% recycled content where technically feasible.",
        attachments: [],
        timestamp: "2026-03-12T14:20:00Z",
      },
    ],
  },
  {
    id: "t2",
    subject: "Delivery schedule flexibility",
    visibility: "private" as const,
    createdAt: "2026-03-11T10:00:00Z",
    updatedAt: "2026-03-11T16:45:00Z",
    participants: ["s2"],
    messages: [
      {
        id: "m4",
        threadId: "t2",
        senderId: "s2",
        senderName: "Emma Davis",
        senderCompany: "GreenOffice Ltd",
        senderType: "supplier" as const,
        content: "We wanted to discuss the delivery schedule privately. Our logistics partner has capacity constraints in June. Would there be flexibility to front-load deliveries in May or extend into July?",
        attachments: [
          { name: "Delivery_Capacity_Analysis.xlsx", size: "128 KB", url: "#" }
        ],
        timestamp: "2026-03-11T10:00:00Z",
      },
      {
        id: "m5",
        threadId: "t2",
        senderId: "buyer",
        senderName: "David Thompson",
        senderType: "buyer" as const,
        content: "Thank you for flagging this early. We have some flexibility on timing. Please include your preferred delivery schedule in your proposal and we will evaluate it alongside other factors.",
        attachments: [],
        timestamp: "2026-03-11T16:45:00Z",
      },
    ],
  },
  {
    id: "t3",
    subject: "ISO 14001 certification timeline",
    visibility: "all" as const,
    createdAt: "2026-03-13T08:00:00Z",
    updatedAt: "2026-03-13T08:00:00Z",
    participants: ["s1", "s2", "s3", "s4", "s5"],
    messages: [
      {
        id: "m6",
        threadId: "t3",
        senderId: "buyer",
        senderName: "Sarah Chen",
        senderType: "buyer" as const,
        content: "Several suppliers have asked about ISO 14001 certification. Please note: if you are currently in the certification process, please provide documentation of your application status and expected certification date. Applications will be considered if certification is expected before contract commencement.",
        attachments: [
          { name: "Certification_Requirements.pdf", size: "312 KB", url: "#" }
        ],
        timestamp: "2026-03-13T08:00:00Z",
      },
    ],
  },
  {
    id: "t4",
    subject: "Question about pricing structure",
    visibility: "private" as const,
    createdAt: "2026-03-14T11:30:00Z",
    updatedAt: "2026-03-14T11:30:00Z",
    participants: ["s3"],
    messages: [
      {
        id: "m7",
        threadId: "t4",
        senderId: "s3",
        senderName: "Michael Brown",
        senderCompany: "Sustainable Solutions Inc",
        senderType: "supplier" as const,
        content: "Should we provide volume-based pricing tiers in our submission, or a single fixed price per unit? We can offer significant discounts at higher volumes.",
        attachments: [],
        timestamp: "2026-03-14T11:30:00Z",
      },
    ],
  },
]

// Global supplier database (suppliers not yet registered for this RFP)
const globalSuppliersData = [
  { id: "g1", name: "RecycleFirst Corp", contact: "Alex Turner", email: "alex@recyclefirst.com" },
  { id: "g2", name: "EcoMaterials Global", contact: "Nina Patel", email: "nina@ecomaterials.com" },
  { id: "g3", name: "GreenPrint Solutions", contact: "Tom Wilson", email: "tom@greenprint.com" },
  { id: "g4", name: "SustainaPaper Ltd", contact: "Rachel Green", email: "rachel@sustainapaper.co.uk" },
]

// Determine visible tabs based on RFP status
const getVisibleTabs = (status: string) => {
  const allTabs = [
    { key: "overview", label: "Overview" },
    { key: "team", label: "Team", count: teamMembersData.length },
    { key: "documents", label: "Documents", count: documentsData.length },
    { key: "submissions", label: "Submissions", count: tenderData.submissions },
    { key: "qa", label: "Q&A", count: qaThreadsData.length },
    { key: "criteria", label: "Scoring" },
    { key: "results", label: "Results" },
    { key: "activity", label: "Activity" },
  ]

  // Draft/Preparation phase: editing phase before publishing
  if (status === "draft") {
    return allTabs.filter(t => ["overview", "team", "documents", "activity"].includes(t.key))
  }

  // Active/Accepting bids phase: waiting for supplier responses
  if (status === "accepting_bids") {
    return allTabs.filter(t => ["overview", "team", "submissions", "qa", "activity"].includes(t.key))
  }

  // Evaluation phase: reviewing and scoring submissions
  if (status === "under_review" || status === "evaluated") {
    return allTabs.filter(t => ["overview", "submissions", "criteria", "results", "activity"].includes(t.key))
  }

  // Completed phase: read-only results
  if (status === "completed" || status === "awarded") {
    return allTabs.filter(t => ["overview", "submissions", "results", "activity"].includes(t.key))
  }

  // Default: show all tabs
  return allTabs
}

const tabs = getVisibleTabs(tenderData.status)

export default function TenderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isEditingRFP, setIsEditingRFP] = useState(false)
  const [editableRFPData, setEditableRFPData] = useState({
    name: tenderData.name,
    description: tenderData.description,
    category: tenderData.category,
    internalContact: tenderData.owner,
    budget: tenderData.budget,
    deadline: tenderData.deadline,
  })
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  
  // Reset tab if it becomes invalid after status change
  if (!tabs.find(t => t.key === activeTab)) {
    setActiveTab("overview")
  }
  const [criteriaEditOpen, setCriteriaEditOpen] = useState(false)
  const [editableCriteria, setEditableCriteria] = useState(tenderData.evaluationCriteria)
  const [expandedCriteria, setExpandedCriteria] = useState<string[]>([])
  const [expandedEvalCriteria, setExpandedEvalCriteria] = useState<string[]>([])

  const [ownerEditOpen, setOwnerEditOpen] = useState(false)
  const [editableOwner, setEditableOwner] = useState({ name: tenderData.owner, email: tenderData.ownerEmail })
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState(teamMembersData)
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [addNewMemberOpen, setAddNewMemberOpen] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", email: "", companyTitle: "", projectRole: "" })
  const [selectedMemberRole, setSelectedMemberRole] = useState("")
  const [editMemberOpen, setEditMemberOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<typeof teamMembersData[0] | null>(null)
  const [descriptionEdit, setDescriptionEdit] = useState({ text: tenderData.description, editing: false, saved: true })
  const [requirementsEdit, setRequirementsEdit] = useState(tenderData.requirements.map(r => ({ text: r, editing: false, saved: true })))
  
  // Activity filters
  const [activitySearch, setActivitySearch] = useState("")
  const [activityTypeFilter, setActivityTypeFilter] = useState<string[]>([])
  const [activityPersonFilter, setActivityPersonFilter] = useState<string[]>([])
  const [activityDateFrom, setActivityDateFrom] = useState("")
  const [activityDateTo, setActivityDateTo] = useState("")
  const [activitySortOrder, setActivitySortOrder] = useState<"asc" | "desc">("desc")
  const [selectedActivityRows, setSelectedActivityRows] = useState<Set<string>>(new Set())

  // Approval workflow states
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [currentApproval, setCurrentApproval] = useState<ApprovalRequest | null>(
    mockBuyerApprovalRequests.find(a => a.itemId === tenderData.id) || null
  )
  const [approvalMode, setApprovalMode] = useState<'any' | 'all'>('all')

  const availableApproversForBuyer = [
    { id: 'user-emily', name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', role: 'VP Sustainability' },
    { id: 'user-james', name: 'James Wilson', email: 'james.wilson@company.com', role: 'Finance Director' },
    { id: 'user-michael', name: 'Michael Park', email: 'michael.park@company.com', role: 'Legal Counsel' },
  ]

  const handleSendForApproval = (data: { approverIds: string[]; message: string; approvalMode: 'any' | 'all' }) => {
    const newApproval: ApprovalRequest = {
      id: `apr-${Date.now()}`,
      type: 'rfp_publication',
      itemId: tenderData.id,
      itemTitle: tenderData.name,
      requestedBy: 'user-sarah',
      requestedByName: 'Sarah Chen',
      requestedAt: new Date().toISOString(),
      message: data.message,
      approvalMode: data.approvalMode,
      approvers: availableApproversForBuyer
        .filter(a => data.approverIds.includes(a.id))
        .map(a => ({
          userId: a.id,
          name: a.name,
          email: a.email,
          role: a.role,
          status: 'pending' as const,
        })),
      status: 'pending',
    }
    setCurrentApproval(newApproval)
    console.log('[v0] Approval request sent:', newApproval)
  }

  const toggleActivityRow = (id: string) => {
    setSelectedActivityRows(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAllActivityRows = (rows: typeof activityData) => {
    if (rows.every(a => selectedActivityRows.has(a.id))) {
      setSelectedActivityRows(new Set())
    } else {
      setSelectedActivityRows(new Set(rows.map(a => a.id)))
    }
  }

  const hasChanges = () => {
    return (
      editableRFPData.name !== tenderData.name ||
      editableRFPData.description !== tenderData.description ||
      editableRFPData.category !== tenderData.category ||
      editableRFPData.internalContact !== tenderData.owner ||
      editableRFPData.budget !== tenderData.budget ||
      editableRFPData.deadline !== tenderData.deadline
    )
  }

  const handleCancelEdit = () => {
    if (hasChanges()) {
      setShowCancelConfirmation(true)
    } else {
      setIsEditingRFP(false)
    }
  }

  const confirmCancel = () => {
    setIsEditingRFP(false)
    setShowCancelConfirmation(false)
    setValidationErrors([])
    setEditableRFPData({
      name: tenderData.name,
      description: tenderData.description,
      category: tenderData.category,
      internalContact: tenderData.owner,
      budget: tenderData.budget,
      deadline: tenderData.deadline,
    })
  }

  const handleSaveRFPEdit = () => {
    const errors: string[] = []
    
    if (!editableRFPData.name.trim()) errors.push("Title is required")
    if (!editableRFPData.description.trim()) errors.push("Description is required")
    if (!editableRFPData.budget || editableRFPData.budget <= 0) errors.push("Budget must be greater than 0")
    if (!editableRFPData.deadline) errors.push("Deadline is required")
    
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }
    
    setValidationErrors([])
    setIsEditingRFP(false)
    setShowSaveNotification(true)
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => setShowSaveNotification(false), 3000)
    
    // In production, this would call an API to save the changes
  }

  const exportActivitiesToCSV = (activities: typeof activityData, filename: string) => {
    const headers = ["Type", "Action", "Details", "Person", "Date", "Time"]
    const rows = activities.map(a => {
      const typeLabel = activityTypes.find(t => t.key === a.type)?.label ?? a.type
      return [typeLabel, a.action, a.detail, a.person, formatActivityDate(a.date), a.time]
    })
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  // Q&A state
  const [qaThreads, setQaThreads] = useState<QaThread[]>(qaThreadsData as QaThread[])
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [qaSearch, setQaSearch] = useState("")
  const [qaVisibilityFilter, setQaVisibilityFilter] = useState<"all" | "private" | "public" | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [composeSubject, setComposeSubject] = useState("")
  const [composeMessage, setComposeMessage] = useState("")
  const [composeRecipients, setComposeRecipients] = useState<string[]>([])
  const [composeVisibility, setComposeVisibility] = useState<"all" | "private">("private")
  const [composeAttachments, setComposeAttachments] = useState<{ name: string; size: string }[]>([])
  const [replyMessage, setReplyMessage] = useState("")
  const [replyAttachments, setReplyAttachments] = useState<{ name: string; size: string }[]>([])
  const [showGlobalSuppliers, setShowGlobalSuppliers] = useState(false)
  
  // Submission detail modal
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<typeof submissionsData[0] | null>(null)
  const [submissionModalTab, setSubmissionModalTab] = useState<'overview' | 'documents' | 'questionnaire' | 'scores'>('overview')
  
  const handleOpenSubmission = (submission: typeof submissionsData[0]) => {
    setSelectedSubmission(submission)
    setSubmissionModalTab('overview')
    setSubmissionModalOpen(true)
  }

  // RFP Lifecycle phases configuration
  const lifecyclePhases = [
    { key: 'draft', label: 'Preparation', icon: Pencil },
    { key: 'accepting_bids', label: 'Accepting Bids', icon: FileText },
    { key: 'under_review', label: 'Evaluation', icon: Scale },
    { key: 'completed', label: 'Award', icon: Trophy },
    { key: 'closed', label: 'Closed', icon: CheckCircle2 },
  ] as const;

  // Get current phase index based on RFP status
  const currentPhaseIndex = lifecyclePhases.findIndex(p => p.key === tenderData.status) >= 0 
    ? lifecyclePhases.findIndex(p => p.key === tenderData.status) 
    : 0;

  // Q&A helpers
  const selectedThread = qaThreads.find(t => t.id === selectedThreadId)
  
  const filteredThreads = qaThreads
    .filter(thread => {
      if (qaSearch && !thread.subject.toLowerCase().includes(qaSearch.toLowerCase())) {
        return false
      }
      if (qaVisibilityFilter === "public" && thread.visibility !== "all") {
        return false
      }
      if (qaVisibilityFilter === "private" && thread.visibility !== "private") {
        return false
      }
      return true
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const formatQaDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return date.toLocaleDateString("en-GB", { weekday: "short" })
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  }

  const handleSendMessage = () => {
    if (!composeSubject.trim() || !composeMessage.trim()) return
    const newThread = {
      id: `t${Date.now()}`,
      subject: composeSubject,
      visibility: composeVisibility,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participants: composeRecipients,
      messages: [{
        id: `m${Date.now()}`,
        threadId: `t${Date.now()}`,
        senderId: "buyer",
        senderName: tenderData.owner,
        senderType: "buyer" as const,
        content: composeMessage,
        attachments: composeAttachments.map(a => ({ ...a, url: "#" })),
        timestamp: new Date().toISOString(),
      }],
    }
    setQaThreads(prev => [newThread, ...prev])
    setComposeOpen(false)
    setComposeSubject("")
    setComposeMessage("")
    setComposeRecipients([])
    setComposeVisibility("private")
    setComposeAttachments([])
    setSelectedThreadId(newThread.id)
  }

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedThreadId) return
    setQaThreads(prev => prev.map(thread => {
      if (thread.id !== selectedThreadId) return thread
      return {
        ...thread,
        updatedAt: new Date().toISOString(),
        messages: [...thread.messages, {
          id: `m${Date.now()}`,
          threadId: selectedThreadId,
          senderId: "buyer",
          senderName: tenderData.owner,
          senderType: "buyer" as const,
          content: replyMessage,
          attachments: replyAttachments.map(a => ({ ...a, url: "#" })),
          timestamp: new Date().toISOString(),
        }],
      }
    }))
    setReplyMessage("")
    setReplyAttachments([])
  }

  const handleMakePublic = (threadId: string) => {
    setQaThreads(prev => prev.map(thread => 
      thread.id === threadId ? { ...thread, visibility: "all" as const } : thread
    ))
  }

  const getSupplierById = (id: string) => submissionsData.find(s => s.id === id)

  // Get unique people from activity data
  const activityPeople = [...new Set(activityData.map(a => a.person))]
  
  // Filter and sort activities
  const filteredActivities = activityData
    .filter(activity => {
      // Search filter
      if (activitySearch && !activity.action.toLowerCase().includes(activitySearch.toLowerCase()) && 
          !activity.detail.toLowerCase().includes(activitySearch.toLowerCase()) &&
          !activity.person.toLowerCase().includes(activitySearch.toLowerCase())) {
        return false
      }
      // Type filter
      if (activityTypeFilter.length > 0 && !activityTypeFilter.includes(activity.type)) {
        return false
      }
      // Person filter
      if (activityPersonFilter.length > 0 && !activityPersonFilter.includes(activity.person)) {
        return false
      }
      // Date range filter
      if (activityDateFrom && activity.date < activityDateFrom) {
        return false
      }
      if (activityDateTo && activity.date > activityDateTo) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      const dateA = new Date(a.date + " " + a.time)
      const dateB = new Date(b.date + " " + b.time)
      return activitySortOrder === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    })
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "submission": return <Send className="size-4" />
      case "evaluation": return <ClipboardList className="size-4" />
      case "document": return <FileText className="size-4" />
      case "team": return <Users className="size-4" />
      case "tender": return <FileText className="size-4" />
      case "comment": return <MessageSquare className="size-4" />
      default: return <Clock className="size-4" />
    }
  }
  
  const getActivityTypeStyle = (type: string) => {
    const typeInfo = activityTypes.find(t => t.key === type)
    return typeInfo?.color || "bg-gray-100 text-gray-700"
  }
  
  const formatActivityDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }
  
  const clearActivityFilters = () => {
    setActivitySearch("")
    setActivityTypeFilter([])
    setActivityPersonFilter([])
    setActivityDateFrom("")
    setActivityDateTo("")
  }
  
  const hasActiveFilters = activitySearch || activityTypeFilter.length > 0 || activityPersonFilter.length > 0 || activityDateFrom || activityDateTo

  const addExistingMember = (member: typeof companyMembersData[0]) => {
    const newTeamMember = {
      id: `t${teamMembers.length + 1}`,
      name: member.name,
      email: member.email,
      phone: "",
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
      phone: "",
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

  const startEditMember = (member: typeof teamMembersData[0]) => {
    setEditingMember({ ...member })
    setEditMemberOpen(true)
  }

  const saveEditMember = () => {
    if (!editingMember) return
    setTeamMembers(prev => prev.map(m => 
      m.id === editingMember.id ? editingMember : m
    ))
    setEditMemberOpen(false)
    setEditingMember(null)
  }

  const makeLead = (id: string) => {
    setTeamMembers(prev => prev.map(m => ({
      ...m,
      isLead: m.id === id,
      projectRole: m.id === id ? "Lead" : (m.isLead ? "Team Member" : m.projectRole)
    })))
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
        ? { ...c, subcategories: [...c.subcategories, { name: "", description: "", saved: false }] }
        : c
    ))
  }

  const updateSubcategoryName = (criteriaIndex: number, subIndex: number, name: string) => {
    setEditableCriteria(prev => prev.map((c, i) => 
      i === criteriaIndex 
        ? { ...c, subcategories: c.subcategories.map((s, si) => si === subIndex ? { ...s, name, saved: false } : s) }
        : c
    ))
  }

  const updateSubcategoryDescription = (criteriaIndex: number, subIndex: number, description: string) => {
    setEditableCriteria(prev => prev.map((c, i) => 
      i === criteriaIndex 
        ? { ...c, subcategories: c.subcategories.map((s, si) => si === subIndex ? { ...s, description, saved: false } : s) }
        : c
    ))
  }

  const saveSubcategory = (criteriaIndex: number, subIndex: number) => {
    setEditableCriteria(prev => prev.map((c, i) => 
      i === criteriaIndex 
        ? { ...c, subcategories: c.subcategories.map((s, si) => si === subIndex ? { ...s, saved: true } : s) }
        : c
    ))
  }

  const generateAiDescription = (criteriaIndex: number, subIndex: number) => {
    // Simulate AI generating a description based on the subcategory name and parent criteria
    const criteria = editableCriteria[criteriaIndex]
    const subcategory = criteria.subcategories[subIndex]
    
    // In production, this would call an AI API
    const aiDescriptions: Record<string, string> = {
      default: `Evaluate the ${subcategory.name.toLowerCase()} aspect within the context of ${criteria.name.toLowerCase()}. Consider relevant documentation, evidence, and alignment with RFP requirements.`
    }
    
    const description = aiDescriptions.default
    
    setEditableCriteria(prev => prev.map((c, i) => 
      i === criteriaIndex 
        ? { ...c, subcategories: c.subcategories.map((s, si) => si === subIndex ? { ...s, description, saved: false } : s) }
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
      i === index ? { ...c, instructions, instructionsSaved: false } : c
    ))
  }

  const saveCriteriaInstructions = (index: number) => {
    setEditableCriteria(prev => prev.map((c, i) => 
      i === index ? { ...c, instructionsSaved: true } : c
    ))
  }

  const generateAiInstructions = (index: number) => {
    const criteria = editableCriteria[index]
    // In production, this would call an AI API
    const aiInstruction = `Evaluate submissions based on ${criteria.name.toLowerCase()} criteria. Consider all subcategories including ${criteria.subcategories.map(s => s.name).join(", ")}. Score based on evidence provided, compliance with requirements, and overall quality of response.`
    
    setEditableCriteria(prev => prev.map((c, i) => 
      i === index ? { ...c, instructions: aiInstruction, instructionsSaved: false } : c
    ))
  }

  const [generatingFromRfp, setGeneratingFromRfp] = useState(false)
  
  const generateCriteriaFromRfp = async () => {
    setGeneratingFromRfp(true)
    // Simulate AI processing the RFP documents and requirements
    // In production, this would analyze uploaded RFP documents and requirements
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate criteria based on RFP content (simulated AI response)
    const generatedCriteria = [
      { 
        name: "Content", 
        weight: 10,
        instructions: "Assess whether the supplier has provided all required documentation as specified in Section 3 of the RFP. Verify adherence to submission format, deadline compliance, and completeness of all mandatory sections.",
        instructionsSaved: false,
        subcategories: [
          { name: "Documentation completeness", description: "Verify submission includes company profile, technical proposal, pricing schedule, certifications, and all appendices listed in RFP Section 3.2.", saved: false },
          { name: "Format compliance", description: "Check adherence to specified document formats, page limits, and naming conventions per RFP Section 2.4.", saved: false },
          { name: "Mandatory requirements", description: "Confirm all mandatory requirements from RFP Appendix A are addressed with supporting evidence.", saved: false }
        ]
      },
      { 
        name: "Technical Quality", 
        weight: 25,
        instructions: "Evaluate the technical merit of proposed products/services against specifications in RFP Section 4. Assess quality certifications, product standards, and quality management systems.",
        instructionsSaved: false,
        subcategories: [
          { name: "Product specifications", description: "Assess alignment with technical specifications outlined in RFP Section 4.1, including material composition and performance standards.", saved: false },
          { name: "Quality certifications", description: "Verify ISO 9001, ISO 14001, EU Ecolabel, and other certifications required per RFP Section 4.3.", saved: false },
          { name: "Quality assurance processes", description: "Evaluate documented QMS, testing procedures, and defect management as per RFP requirements.", saved: false }
        ]
      },
      { 
        name: "Supplier Capability", 
        weight: 15,
        instructions: "Review supplier's technical expertise, relevant experience, and capacity to deliver as outlined in RFP Section 5. Consider past performance on similar contracts.",
        instructionsSaved: false,
        subcategories: [
          { name: "Relevant experience", description: "Assess experience with similar contracts in scope and complexity, minimum 3 references as per RFP Section 5.2.", saved: false },
          { name: "Technical expertise", description: "Evaluate team qualifications, certifications, and specialized knowledge relevant to sustainable procurement.", saved: false },
          { name: "Delivery capacity", description: "Assess infrastructure, logistics capabilities, and scalability to meet volume requirements in RFP Section 5.4.", saved: false }
        ]
      },
      { 
        name: "Sustainability & ESG", 
        weight: 25,
        instructions: "Assess environmental credentials, carbon footprint, ethical sourcing, and social responsibility against ESG requirements in RFP Section 7.",
        instructionsSaved: false,
        subcategories: [
          { name: "Environmental certifications", description: "Verify environmental certifications, carbon neutrality claims, and alignment with RFP Section 7.1 sustainability targets.", saved: false },
          { name: "Carbon footprint", description: "Assess Scope 1, 2, and 3 emissions data, reduction commitments, and climate action plans per RFP Section 7.2.", saved: false },
          { name: "Ethical supply chain", description: "Evaluate supply chain transparency, fair trade practices, and labor standards as per RFP Section 7.3.", saved: false },
          { name: "Circular economy", description: "Assess recycled content, recyclability, and end-of-life disposal programs aligned with RFP Section 7.4.", saved: false }
        ]
      },
      { 
        name: "Risk Management", 
        weight: 5,
        instructions: "Evaluate supplier risk profile including financial stability, supply chain reliability, and business continuity as per RFP Section 8.",
        instructionsSaved: false,
        subcategories: [
          { name: "Financial stability", description: "Assess credit rating, financial statements, and profitability trends as per RFP Section 8.1 requirements.", saved: false },
          { name: "Supply chain resilience", description: "Evaluate supplier diversification, geographic risk, and contingency plans per RFP Section 8.2.", saved: false },
          { name: "Business continuity", description: "Review BCP documentation, insurance coverage, and disaster recovery capabilities per RFP Section 8.3.", saved: false }
        ]
      },
      { 
        name: "Commercial", 
        weight: 20,
        instructions: "Analyze pricing competitiveness, total cost of ownership, and commercial terms against budget parameters in RFP Section 6.",
        instructionsSaved: false,
        subcategories: [
          { name: "Pricing competitiveness", description: "Compare unit pricing and volume discounts against market benchmarks and budget allocation in RFP Section 6.1.", saved: false },
          { name: "Total cost of ownership", description: "Calculate all costs including delivery, installation, maintenance, and disposal as per TCO model in RFP Appendix C.", saved: false },
          { name: "Payment and contract terms", description: "Evaluate payment schedules, warranty terms, and contract flexibility per RFP Section 6.3 requirements.", saved: false }
        ]
      },
    ]
    
    setEditableCriteria(generatedCriteria)
    setGeneratingFromRfp(false)
  }

  const toggleEvalCriteriaExpand = (name: string) => {
    setExpandedEvalCriteria(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
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
    published: { label: "Published", className: "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20" },
    accepting_bids: { label: "Accepting Bids", className: "bg-blue-50 text-blue-700 border-blue-200" },
    evaluating: { label: "Evaluating", className: "bg-amber-50 text-amber-700 border-amber-200" },
    closed: { label: "Closed", className: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]" },
  }

  const { label: statusLabel, className: statusClassName } = statusConfig[tenderData.status]

  const formatBudget = (value: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
  }

  return (
    <div className="space-y-6 p-5">
        {/* Back Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#6B7280] hover:text-[#111827]"
            onClick={() => router.push("/buyer/tenders")}
          >
            <ArrowLeft className="size-4 mr-1" />
            Back to RFPs
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
            {isEditingRFP ? (
              <>
                <Button
                  variant="outline"
                  className="border-[#E5E7EB]"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
            <Button
              className="bg-[#16A34A] hover:bg-[#15803D]"
              onClick={() => {
                if (!currentApproval) {
                  setShowApprovalModal(true)
                }
              }}
              disabled={currentApproval?.status === 'pending'}
            >
              <Zap className="size-4 mr-2" />
              {currentApproval?.status === 'pending' ? 'Awaiting Approvals' : 'Send for Approval'}
            </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-[#E5E7EB]"
                  onClick={() => setIsEditingRFP(true)}
                >
                  <Pencil className="size-4 mr-2" />
                  Edit
                </Button>
                <Link href={`/buyer/tenders/${params.id}/manage`}>
                  <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white">
                    <ClipboardList className="size-4 mr-2" />
                    Manage RFP
                  </Button>
                </Link>
              </>
            )}
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
                  Duplicate RFP
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="size-4 mr-2" />
                  Export Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Archive className="size-4 mr-2" />
                  Archive RFP
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* RFP Lifecycle Progress Indicator */}
        <RFPProgressBar phases={lifecyclePhases} currentIndex={currentPhaseIndex} />

        {/* Save Notification */}
        {showSaveNotification && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800">RFP changes saved successfully!</p>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex gap-2 items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  {validationErrors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        <Dialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Discard Changes?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-[#6B7280]">You have unsaved changes. Are you sure you want to discard them?</p>
            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirmation(false)}
              >
                Keep Editing
              </Button>
              <Button
                variant="destructive"
                onClick={confirmCancel}
              >
                Discard Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
        <div className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
          <nav className="flex gap-1" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "text-[#16A34A] border-[#16A34A] bg-white"
                    : "text-[#6B7280] hover:text-[#111827] border-transparent hover:border-[#D1D5DB]"
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="text-xs font-semibold text-[#6B7280] group-hover:text-[#111827]">
                      {tab.count}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Title - Editable */}
              {isEditingRFP && (
                <Card className="border-[#E5E7EB] bg-white">
                  <CardHeader>
                    <CardTitle className="text-base">RFP Title</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={editableRFPData.name}
                      onChange={(e) =>
                        setEditableRFPData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Enter RFP title..."
                      className="text-lg font-semibold"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Additional Fields - Editable */}
              {isEditingRFP && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category */}
                  <Card className="border-[#E5E7EB] bg-white">
                    <CardHeader>
                      <CardTitle className="text-base">Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <select
                        value={editableRFPData.category}
                        onChange={(e) =>
                          setEditableRFPData((prev) => ({ ...prev, category: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-md border border-[#E5E7EB] text-sm text-[#111827] bg-white"
                      >
                        <option value="Procurement">Procurement</option>
                        <option value="Services">Services</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Development">Development</option>
                      </select>
                    </CardContent>
                  </Card>

                  {/* Budget */}
                  <Card className="border-[#E5E7EB] bg-white">
                    <CardHeader>
                      <CardTitle className="text-base">Budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        type="number"
                        value={editableRFPData.budget}
                        onChange={(e) =>
                          setEditableRFPData((prev) => ({ ...prev, budget: Number(e.target.value) }))
                        }
                        placeholder="Enter budget..."
                        className="text-sm"
                      />
                    </CardContent>
                  </Card>

                  {/* Deadline */}
                  <Card className="border-[#E5E7EB] bg-white">
                    <CardHeader>
                      <CardTitle className="text-base">Deadline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        type="date"
                        value={editableRFPData.deadline}
                        onChange={(e) =>
                          setEditableRFPData((prev) => ({ ...prev, deadline: e.target.value }))
                        }
                        className="text-sm"
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Description */}
              <Card className="border-[#E5E7EB] bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-lg">RFP Description</CardTitle>
                  {!isEditingRFP && (
                    <div className="flex items-center gap-1">
                      {!descriptionEdit.saved && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-[#6B7280] hover:text-[#16A34A]"
                            onClick={() => {
                              // In production, call AI API
                              setDescriptionEdit(prev => ({ 
                                ...prev, 
                                text: "This RFP seeks qualified suppliers for sustainable office supplies to support our organization's environmental commitments. We require eco-friendly products that meet strict sustainability criteria while maintaining quality and cost-effectiveness.",
                                saved: false 
                              }))
                            }}
                          >
                            <Sparkles className="size-3 mr-1" />
                            Complete with AI
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-[#16A34A]"
                            onClick={() => setDescriptionEdit(prev => ({ ...prev, saved: true }))}
                          >
                            <Save className="size-3 mr-1" />
                            Save
                          </Button>
                        </>
                      )}
                      {descriptionEdit.saved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-[#6B7280]"
                          onClick={() => setDescriptionEdit(prev => ({ ...prev, saved: false }))}
                        >
                          <Pencil className="size-3 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditingRFP ? (
                    <Textarea
                      value={editableRFPData.description}
                      onChange={(e) =>
                        setEditableRFPData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className="min-h-[100px] text-sm text-[#6B7280]"
                      placeholder="Enter RFP description..."
                    />
                  ) : (
                    <>
                      {descriptionEdit.saved ? (
                        <p className="text-[#111827] leading-relaxed">{descriptionEdit.text}</p>
                      ) : (
                        <Textarea
                          value={descriptionEdit.text}
                          onChange={(e) => setDescriptionEdit(prev => ({ ...prev, text: e.target.value }))}
                          className="min-h-[100px] text-sm text-[#6B7280]"
                          placeholder="Enter RFP description..."
                        />
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="border-[#E5E7EB] bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-lg">RFP Requirements</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-[#6B7280] hover:text-[#16A34A]"
                    onClick={() => setRequirementsEdit(prev => [...prev, { text: "", editing: true, saved: false }])}
                  >
                    <Plus className="size-3 mr-1" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {requirementsEdit.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="size-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                        {req.saved ? (
                          <div className="flex-1 flex items-center justify-between gap-2">
                            <span className="text-[#111827]">{req.text}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-1 text-[#6B7280]"
                              onClick={() => setRequirementsEdit(prev => prev.map((r, i) => 
                                i === index ? { ...r, saved: false } : r
                              ))}
                            >
                              <Pencil className="size-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              value={req.text}
                              onChange={(e) => setRequirementsEdit(prev => prev.map((r, i) => 
                                i === index ? { ...r, text: e.target.value } : r
                              ))}
                              placeholder="Enter requirement..."
                              className="flex-1 h-8 text-sm text-[#6B7280]"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-[#6B7280] hover:text-[#16A34A]"
                              onClick={() => {
                                // In production, call AI API
                                setRequirementsEdit(prev => prev.map((r, i) => 
                                  i === index ? { ...r, text: "Products must meet industry sustainability standards and certifications.", saved: false } : r
                                ))
                              }}
                            >
                              <Sparkles className="size-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-[#16A34A]"
                              onClick={() => setRequirementsEdit(prev => prev.map((r, i) => 
                                i === index ? { ...r, saved: true } : r
                              ))}
                              disabled={!req.text}
                            >
                              <Save className="size-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-[#6B7280] hover:text-red-600"
                              onClick={() => setRequirementsEdit(prev => prev.filter((_, i) => i !== index))}
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Internal Contact */}
              <Card className="border-[#E5E7EB] bg-white">
                <CardHeader>
                  <CardTitle className="text-base">Internal Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isEditingRFP ? (
                    <div className="space-y-2">
                      <Label className="text-xs text-[#6B7280]">Primary Contact</Label>
                      <select
                        value={editableRFPData.internalContact}
                        onChange={(e) =>
                          setEditableRFPData((prev) => ({
                            ...prev,
                            internalContact: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-md border border-[#E5E7EB] text-sm text-[#111827] bg-white"
                      >
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.name}>
                            {member.name} - {member.projectRole}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-2">Primary Contact</p>
                        <p className="text-sm font-medium text-[#111827]">
                          {editableRFPData.internalContact}
                        </p>
                      </div>
                      {teamMembers.find(m => m.name === editableRFPData.internalContact) && (
                        <>
                          <div>
                            <p className="text-xs text-[#6B7280] mb-1">Email</p>
                            <p className="text-sm text-[#111827]">
                              {teamMembers.find(m => m.name === editableRFPData.internalContact)?.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6B7280] mb-1">Phone</p>
                            <p className="text-sm text-[#111827]">
                              {teamMembers.find(m => m.name === editableRFPData.internalContact)?.phone || 'N/A'}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
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
                                  <div className="flex items-center gap-1 flex-1">
                                    <span className={`text-sm ${sub.saved ? 'text-[#111827]' : 'text-[#6B7280]'}`}>
                                      {sub.name || "New subcategory"}
                                    </span>
                                    {!sub.description && (
                                      <span className="text-xs text-amber-600">(needs description)</span>
                                    )}
                                  </div>
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
                                {sub.name}
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
                <p className="text-sm text-[#6B7280]">{teamMembers.length} people assigned to this RFP</p>
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

            <Card className="border-[#E5E7EB] bg-white overflow-hidden pt-0">
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#6B7280]">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => startEditMember(member)}>
                                  <Pencil className="size-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {!member.isLead && (
                                  <DropdownMenuItem onClick={() => makeLead(member.id)}>
                                    <Star className="size-4 mr-2" />
                                    Make Lead
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => removeTeamMember(member.id)}
                                  className="text-red-600 focus:text-red-600"
                                  disabled={member.isLead}
                                >
                                  <Trash2 className="size-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Edit Member Dialog */}
            <Dialog open={editMemberOpen} onOpenChange={setEditMemberOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Team Member</DialogTitle>
                </DialogHeader>
                {editingMember && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input 
                        value={editingMember.name}
                        onChange={(e) => setEditingMember(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input 
                        type="email"
                        value={editingMember.email}
                        onChange={(e) => setEditingMember(prev => prev ? { ...prev, email: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Title</Label>
                      <Input 
                        value={editingMember.companyTitle}
                        onChange={(e) => setEditingMember(prev => prev ? { ...prev, companyTitle: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Project Role</Label>
                      <Input 
                        value={editingMember.projectRole}
                        onChange={(e) => setEditingMember(prev => prev ? { ...prev, projectRole: e.target.value } : null)}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditMemberOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={saveEditMember}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {activeTab === "submissions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">
                {tenderData.submissions} proposals received from {tenderData.invitedSuppliers} invited suppliers
              </p>
              <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white">
                <Send className="size-4 mr-2" />
                Invite More Suppliers
              </Button>
            </div>

            <Card className="border-[#E5E7EB] bg-white overflow-hidden pt-0">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Supplier Name</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Status</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Weighted Score</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wide">Price</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Docs</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Contact</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wide">Open</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {submissionsData.map(submission => (
                      <tr 
                        key={submission.id} 
                        className="hover:bg-[#F3F4F6] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback className="bg-[#F0FDF4] text-[#16A34A] text-xs font-medium">
                                {submission.supplierName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium text-[#111827]">{submission.supplierName}</span>
                              <p className="text-xs text-[#9CA3AF]">{submission.submittedDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <SubmissionStatusBadge status={submission.status} />
                        </td>
                        <td className="px-3 py-3 text-center">
                          {submission.weightedScore ? (
                            <span className="font-semibold text-[#111827]">{submission.weightedScore}</span>
                          ) : (
                            <span className="text-[#D1D5DB]">-</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-right">
                          {submission.proposedValue ? (
                            <span className="font-medium text-[#111827]">${submission.proposedValue.toLocaleString()}</span>
                          ) : (
                            <span className="text-[#D1D5DB]">-</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Dialog>
                            <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
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
                        <td className="px-3 py-3">
                          <div>
                            <span className="text-sm text-[#111827]">{submission.keyContact}</span>
                            <p className="text-xs text-[#6B7280]">{submission.keyContactEmail}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-3 text-xs border-[#E5E7EB]"
                            onClick={() => handleOpenSubmission(submission)}
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
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Evaluation Criteria</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs border-[#E5E7EB] text-[#6B7280] hover:text-[#16A34A] hover:border-[#16A34A]"
                      onClick={generateCriteriaFromRfp}
                      disabled={generatingFromRfp}
                    >
                      {generatingFromRfp ? (
                        <>
                          <Loader2 className="size-3 mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="size-3 mr-1" />
                          Generate from RFP
                        </>
                      )}
                    </Button>
                  </div>
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
                          {/* Evaluation Instructions */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium text-[#111827]">Evaluation Instructions</Label>
                              <div className="flex items-center gap-1">
                                {!criteria.instructionsSaved && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs text-[#6B7280] hover:text-[#16A34A]"
                                      onClick={() => generateAiInstructions(criteriaIndex)}
                                    >
                                      <Sparkles className="size-3 mr-1" />
                                      Complete with AI
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs text-[#16A34A]"
                                      onClick={() => saveCriteriaInstructions(criteriaIndex)}
                                    >
                                      <Save className="size-3 mr-1" />
                                      Save
                                    </Button>
                                  </>
                                )}
                                {criteria.instructionsSaved && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-[#6B7280]"
                                    onClick={() => setEditableCriteria(prev => prev.map((c, i) => 
                                      i === criteriaIndex ? { ...c, instructionsSaved: false } : c
                                    ))}
                                  >
                                    <Pencil className="size-3 mr-1" />
                                    Edit
                                  </Button>
                                )}
                              </div>
                            </div>
                            <Textarea
                              value={criteria.instructions}
                              onChange={(e) => updateCriteriaInstructions(criteriaIndex, e.target.value)}
                              placeholder="Describe what evaluators should look for when assessing this criteria..."
                              className={`min-h-[80px] text-sm ${criteria.instructionsSaved ? 'text-[#111827] bg-[#F9FAFB]' : 'text-[#6B7280]'}`}
                              disabled={criteria.instructionsSaved}
                            />
                          </div>
                          
                          {/* Subcategories */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-[#111827]">Subcategories</Label>
                            <div className="space-y-3">
                              {criteria.subcategories.map((sub, subIndex) => (
                                <div key={subIndex} className="border border-[#E5E7EB] rounded-lg p-3 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={sub.name}
                                      onChange={(e) => updateSubcategoryName(criteriaIndex, subIndex, e.target.value)}
                                      placeholder="Subcategory name"
                                      className={`flex-1 h-9 text-sm font-medium ${sub.saved ? 'text-[#111827] bg-[#F9FAFB]' : 'text-[#6B7280]'}`}
                                      disabled={sub.saved}
                                    />
                                    <div className="flex items-center gap-1">
                                      {!sub.saved && (
                                        <>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-xs text-[#6B7280] hover:text-[#16A34A]"
                                            onClick={() => generateAiDescription(criteriaIndex, subIndex)}
                                            disabled={!sub.name}
                                          >
                                            <Sparkles className="size-3 mr-1" />
                                            AI
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-xs text-[#16A34A]"
                                            onClick={() => saveSubcategory(criteriaIndex, subIndex)}
                                            disabled={!sub.name || !sub.description}
                                          >
                                            <Save className="size-3" />
                                          </Button>
                                        </>
                                      )}
                                      {sub.saved && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 px-2 text-xs text-[#6B7280]"
                                          onClick={() => setEditableCriteria(prev => prev.map((c, i) => 
                                            i === criteriaIndex 
                                              ? { ...c, subcategories: c.subcategories.map((s, si) => si === subIndex ? { ...s, saved: false } : s) }
                                              : c
                                          ))}
                                        >
                                          <Pencil className="size-3" />
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-[#6B7280] hover:text-red-600"
                                        onClick={() => removeSubcategory(criteriaIndex, subIndex)}
                                      >
                                        <X className="size-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs text-[#6B7280]">Description (used by AI for assessment)</Label>
                                    <Textarea
                                      value={sub.description}
                                      onChange={(e) => updateSubcategoryDescription(criteriaIndex, subIndex, e.target.value)}
                                      placeholder="Describe what to evaluate for this subcategory..."
                                      className={`min-h-[60px] text-sm ${sub.saved ? 'text-[#111827] bg-[#F9FAFB]' : 'text-[#6B7280]'}`}
                                      disabled={sub.saved}
                                    />
                                  </div>
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
        {activeTab === "results" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">Evaluation Results</h3>
                <p className="text-sm text-[#6B7280]">
                  {submissionsData.filter(s => s.weightedScore).length} of {submissionsData.length} submissions evaluated
                </p>
              </div>
            </div>

            <Card className="border-[#E5E7EB] bg-white overflow-hidden pt-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Supplier</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Content</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Quality</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Capability</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Sustainability</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Risk</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Price</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Weighted</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Action</th>
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
                              <span className="font-medium text-[#111827]">{submission.scores.content}</span>
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
                            {submission.scores ? (
                              <span className="font-medium text-[#111827]">{submission.scores.price}</span>
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
                          <td className="px-4 py-3 text-center">
                            {submission.weightedScore ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs border-[#E5E7EB]"
                                onClick={() => router.push(`/buyer/tenders/${params.id}/submissions/${submission.id}?tab=results`)}
                              >
                                <Pencil className="size-3 mr-1" />
                                Edit
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

        {activeTab === "documents" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">{documentsData.length} documents attached</p>
              <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white">
                <Upload className="size-4 mr-2" />
                Upload Document
              </Button>
            </div>

            <Card className="border-[#E5E7EB] bg-white overflow-hidden pt-0">
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

        {/* Q&A Tab */}
        {activeTab === "qa" && (
          <div className="flex h-[calc(100vh-280px)] min-h-[500px] border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
            {/* Left Thread List */}
            <div className="w-[360px] border-r border-[#E5E7EB] flex flex-col shrink-0">
              {/* List Header */}
              <div className="px-3 py-2 border-b border-[#E5E7EB] bg-[#FAFAFA]">
                <div className="flex items-center gap-2 mb-2">
                  <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-[#16A34A] hover:bg-[#15803D] text-white">
                        <Plus className="size-4 mr-1" />
                        New Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>New Message</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {/* Subject */}
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            placeholder="Enter message subject..."
                            value={composeSubject}
                            onChange={(e) => setComposeSubject(e.target.value)}
                          />
                        </div>

                        {/* Visibility */}
                        <div className="space-y-2">
                          <Label>Visibility</Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={composeVisibility === "all" ? "default" : "outline"}
                              size="sm"
                              className={composeVisibility === "all" ? "bg-[#16A34A] hover:bg-[#15803D]" : ""}
                              onClick={() => {
                                setComposeVisibility("all")
                                setComposeRecipients(submissionsData.map(s => s.id))
                              }}
                            >
                              <Globe className="size-4 mr-1" />
                              All Suppliers
                            </Button>
                            <Button
                              type="button"
                              variant={composeVisibility === "private" ? "default" : "outline"}
                              size="sm"
                              className={composeVisibility === "private" ? "bg-[#16A34A] hover:bg-[#15803D]" : ""}
                              onClick={() => setComposeVisibility("private")}
                            >
                              <Lock className="size-4 mr-1" />
                              Private
                            </Button>
                          </div>
                        </div>

                        {/* Recipients (only for private) */}
                        {composeVisibility === "private" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Recipients</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-[#16A34A] hover:text-[#15803D]"
                                onClick={() => setShowGlobalSuppliers(!showGlobalSuppliers)}
                              >
                                <Globe className="size-3 mr-1" />
                                {showGlobalSuppliers ? "Show registered" : "Add from global database"}
                              </Button>
                            </div>
                            <div className="border border-[#E5E7EB] rounded-lg max-h-40 overflow-y-auto">
                              {!showGlobalSuppliers ? (
                                submissionsData.map(supplier => (
                                  <label
                                    key={supplier.id}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-[#F9FAFB] cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
                                  >
                                    <Checkbox
                                      checked={composeRecipients.includes(supplier.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setComposeRecipients(prev => [...prev, supplier.id])
                                        } else {
                                          setComposeRecipients(prev => prev.filter(id => id !== supplier.id))
                                        }
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-[#111827] truncate">{supplier.supplierName}</p>
                                      <p className="text-xs text-[#6B7280] truncate">{supplier.keyContact}</p>
                                    </div>
                                  </label>
                                ))
                              ) : (
                                globalSuppliersData.map(supplier => (
                                  <label
                                    key={supplier.id}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-[#F9FAFB] cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
                                  >
                                    <Checkbox
                                      checked={composeRecipients.includes(supplier.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setComposeRecipients(prev => [...prev, supplier.id])
                                        } else {
                                          setComposeRecipients(prev => prev.filter(id => id !== supplier.id))
                                        }
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-[#111827] truncate">{supplier.name}</p>
                                      <p className="text-xs text-[#6B7280] truncate">{supplier.contact} &middot; {supplier.email}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 shrink-0">
                                      Global
                                    </Badge>
                                  </label>
                                ))
                              )}
                            </div>
                            {composeRecipients.length > 0 && (
                              <p className="text-xs text-[#6B7280]">{composeRecipients.length} recipient{composeRecipients.length !== 1 ? "s" : ""} selected</p>
                            )}
                          </div>
                        )}

                        {/* Message */}
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Type your message..."
                            value={composeMessage}
                            onChange={(e) => setComposeMessage(e.target.value)}
                            rows={5}
                          />
                        </div>

                        {/* Attachments */}
                        <div className="space-y-2">
                          <Label>Attachments</Label>
                          <div className="flex flex-wrap gap-2">
                            {composeAttachments.map((file, idx) => (
                              <Badge key={idx} variant="outline" className="bg-[#F3F4F6] text-[#6B7280] pr-1">
                                <Paperclip className="size-3 mr-1" />
                                {file.name}
                                <button
                                  type="button"
                                  className="ml-1 hover:text-red-600"
                                  onClick={() => setComposeAttachments(prev => prev.filter((_, i) => i !== idx))}
                                >
                                  <X className="size-3" />
                                </button>
                              </Badge>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => {
                                // Mock file upload
                                setComposeAttachments(prev => [...prev, { name: `Document_${prev.length + 1}.pdf`, size: "256 KB" }])
                              }}
                            >
                              <Paperclip className="size-3 mr-1" />
                              Add file
                            </Button>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setComposeOpen(false)}>Cancel</Button>
                        <Button
                          className="bg-[#16A34A] hover:bg-[#15803D] text-white"
                          onClick={handleSendMessage}
                          disabled={!composeSubject.trim() || !composeMessage.trim() || (composeVisibility === "private" && composeRecipients.length === 0)}
                        >
                          <Send className="size-4 mr-1" />
                          Send Message
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {/* Search bar */}
                <div className="relative mt-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF]" />
                  <Input
                    placeholder="Search messages..."
                    value={qaSearch}
                    onChange={(e) => setQaSearch(e.target.value)}
                    className="pl-8 h-8 text-sm bg-[#F3F4F6] border-0 focus-visible:bg-white focus-visible:ring-1"
                  />
                </div>
                {/* Visibility filter pills */}
                <div className="flex items-center gap-1 mt-2 bg-[#F3F4F6] rounded-md p-0.5 w-fit">
                  {[
                    { key: null, label: "All" },
                    { key: "public", label: "Public" },
                    { key: "private", label: "Private" },
                  ].map(opt => (
                    <button
                      key={String(opt.key)}
                      onClick={() => setQaVisibilityFilter(opt.key as typeof qaVisibilityFilter)}
                      className={`px-3 py-0.5 rounded text-xs font-medium transition-colors ${
                        qaVisibilityFilter === opt.key
                          ? "bg-white text-[#111827] shadow-sm"
                          : "text-[#6B7280] hover:text-[#111827]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Thread rows */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#E5E7EB]">
                {filteredThreads.length === 0 ? (
                  <div className="p-6 text-center text-[#6B7280]">
                    <MessageCircle className="size-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No messages found</p>
                  </div>
                ) : filteredThreads.map(thread => {
                  const lastMessage = thread.messages[thread.messages.length - 1]
                  const isSelected = selectedThreadId === thread.id
                  const hasUnread = thread.messages.some(m => m.senderType === "supplier")
                  return (
                    <button
                      key={thread.id}
                      className={`w-full text-left px-4 py-3 hover:bg-[#F9FAFB] transition-colors group ${isSelected ? "bg-[#F0FDF4] border-l-2 border-l-[#16A34A]" : ""}`}
                      onClick={() => setSelectedThreadId(thread.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {hasUnread && !isSelected && (
                          <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                        <p className={`text-sm flex-1 truncate ${hasUnread && !isSelected ? "font-semibold text-[#111827]" : "text-[#374151]"}`}>
                          {thread.subject}
                        </p>
                        <span className="text-xs text-[#9CA3AF] shrink-0">{formatQaDate(thread.updatedAt)}</span>
                      </div>
                      <p className="text-xs text-[#6B7280] line-clamp-1 mb-1.5 pl-4">{lastMessage.content}</p>
                      <div className="flex items-center gap-1.5 pl-4">
                        <Badge
                          variant="outline"
                          className={`text-xs px-1.5 py-0 ${thread.visibility === "all" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                        >
                          {thread.visibility === "all" ? <><Globe className="size-3 mr-1" />Public</> : <><Lock className="size-3 mr-1" />Private</>}
                        </Badge>
                        {lastMessage.attachments.length > 0 && <Paperclip className="size-3 text-[#9CA3AF]" />}
                        <span className="text-xs text-[#9CA3AF]">{thread.messages.length} msg{thread.messages.length !== 1 ? "s" : ""}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right - Thread Detail */}
            <div className="flex-1 flex flex-col min-w-0">
              {selectedThread ? (
                <>
                  {/* Detail header */}
                  <div className="px-6 py-3 border-b border-[#E5E7EB] bg-[#FAFAFA]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-[#111827] truncate">{selectedThread.subject}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs px-1.5 ${selectedThread.visibility === "all" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                          >
                            {selectedThread.visibility === "all" ? <><Globe className="size-3 mr-1" />All Suppliers</> : <><Lock className="size-3 mr-1" />Private</>}
                          </Badge>
                          <span className="text-xs text-[#9CA3AF]">
                            Started {new Date(selectedThread.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                      {selectedThread.visibility === "private" && (
                        <Button variant="outline" size="sm" className="shrink-0 h-8" onClick={() => handleMakePublic(selectedThread.id)}>
                          <Globe className="size-4 mr-1" />
                          Make Public
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedThread.messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.senderType === "buyer" ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar className="size-8 shrink-0">
                          <AvatarFallback className={`text-xs ${message.senderType === "buyer" ? "bg-[#16A34A] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                            {message.senderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 max-w-[75%] ${message.senderType === "buyer" ? "text-right" : ""}`}>
                          <div className={`inline-block text-left rounded-lg px-4 py-2.5 ${message.senderType === "buyer" ? "bg-[#16A34A] text-white" : "bg-[#F3F4F6] text-[#111827]"}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium ${message.senderType === "buyer" ? "text-green-100" : "text-[#6B7280]"}`}>
                                {message.senderName}
                                {message.senderType === "supplier" && message.senderCompany && ` · ${message.senderCompany}`}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            {message.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {message.attachments.map((att, idx) => (
                                  <a
                                    key={idx}
                                    href={att.url}
                                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${message.senderType === "buyer" ? "bg-brand-green hover:bg-brand-green-dark text-white" : "bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#6B7280]"}`}
                                  >
                                    <Paperclip className="size-3" />
                                    {att.name}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className={`text-xs text-[#9CA3AF] mt-1 ${message.senderType === "buyer" ? "text-right" : ""}`}>
                            {new Date(message.timestamp).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Reply Composer */}
                  <div className="border-t border-[#E5E7EB] p-4">
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          rows={2}
                          className="resize-none"
                        />
                        {replyAttachments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {replyAttachments.map((file, idx) => (
                              <Badge key={idx} variant="outline" className="bg-[#F3F4F6] text-[#6B7280] pr-1">
                                <Paperclip className="size-3 mr-1" />
                                {file.name}
                                <button
                                  type="button"
                                  className="ml-1 hover:text-red-600"
                                  onClick={() => setReplyAttachments(prev => prev.filter((_, i) => i !== idx))}
                                >
                                  <X className="size-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => setReplyAttachments(prev => [...prev, { name: `Attachment_${prev.length + 1}.pdf`, size: "128 KB" }])}
                        >
                          <Paperclip className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-9 w-9 bg-[#16A34A] hover:bg-[#15803D] text-white"
                          onClick={handleSendReply}
                          disabled={!replyMessage.trim()}
                        >
                          <Send className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[#6B7280] h-full">
                  <div className="text-center">
                    <MessageCircle className="size-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Select a conversation</p>
                    <p className="text-sm text-[#9CA3AF] mt-1">Choose a thread from the list to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            {/* Filters */}
            <Card className="border-[#E5E7EB] bg-white">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF]" />
                    <Input
                      placeholder="Search activities..."
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                  
                  {/* Type Filter */}
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
                  
                  {/* Person Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 border-[#E5E7EB]">
                        <Users className="size-4 mr-2" />
                        Person
                        {activityPersonFilter.length > 0 && (
                          <Badge className="ml-2 bg-[#16A34A] text-white text-xs px-1.5">{activityPersonFilter.length}</Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 max-h-64 overflow-y-auto">
                      {activityPeople.map(person => (
                        <DropdownMenuItem
                          key={person}
                          onClick={() => setActivityPersonFilter(prev => 
                            prev.includes(person) ? prev.filter(p => p !== person) : [...prev, person]
                          )}
                          className="flex items-center justify-between"
                        >
                          <span className="truncate">{person}</span>
                          {activityPersonFilter.includes(person) && <CheckCircle className="size-4 text-[#16A34A] flex-shrink-0" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {/* Date Range */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={activityDateFrom}
                      onChange={(e) => setActivityDateFrom(e.target.value)}
                      className="h-9 text-sm w-36"
                      placeholder="From"
                    />
                    <span className="text-[#6B7280]">to</span>
                    <Input
                      type="date"
                      value={activityDateTo}
                      onChange={(e) => setActivityDateTo(e.target.value)}
                      className="h-9 text-sm w-36"
                      placeholder="To"
                    />
                  </div>
                  
                  {/* Clear Filters */}
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
              </CardContent>
            </Card>
            
            {/* Results count + sort + download */}
            <div className="flex items-center justify-between text-sm text-[#6B7280]">
              <div className="flex items-center gap-3">
                <span>
                  Showing {filteredActivities.length} of {activityData.length} activities
                </span>
                {selectedActivityRows.size > 0 && (
                  <span className="text-[#16A34A] font-medium">
                    {selectedActivityRows.size} row{selectedActivityRows.size !== 1 ? "s" : ""} selected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setActivitySortOrder(prev => prev === "desc" ? "asc" : "desc")}
                >
                  <ArrowUpDown className="size-3 mr-1" />
                  {activitySortOrder === "desc" ? "Newest first" : "Oldest first"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-[#E5E7EB]"
                  disabled={selectedActivityRows.size === 0}
                  onClick={() => {
                    const selected = activityData.filter(a => selectedActivityRows.has(a.id))
                    exportActivitiesToCSV(selected, "rfp_activity_selection.csv")
                  }}
                >
                  <Download className="size-4 mr-2" />
                  Download Selection
                  {selectedActivityRows.size > 0 && (
                    <Badge className="ml-2 bg-[#16A34A] text-white text-xs px-1.5">{selectedActivityRows.size}</Badge>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-[#E5E7EB]"
                  onClick={() => exportActivitiesToCSV(activityData, "rfp_activity_all.csv")}
                >
                  <Download className="size-4 mr-2" />
                  Download All
                </Button>
              </div>
            </div>

            {/* Activity Table */}
            <Card className="border-[#E5E7EB] bg-white overflow-hidden pt-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                        <th className="px-4 py-3 w-10">
                          <Checkbox
                            checked={filteredActivities.length > 0 && filteredActivities.every(a => selectedActivityRows.has(a.id))}
                            onCheckedChange={() => toggleAllActivityRows(filteredActivities)}
                            aria-label="Select all activities"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide w-28">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Action</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Details</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide w-40">Person</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide w-36">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {filteredActivities.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-[#6B7280]">
                            No activities match your filters
                          </td>
                        </tr>
                      ) : (
                        filteredActivities.map(activity => {
                          const isSelected = selectedActivityRows.has(activity.id)
                          return (
                            <tr
                              key={activity.id}
                              className={`transition-colors ${isSelected ? "bg-[#F0FDF4]" : "hover:bg-[#F9FAFB]"}`}
                            >
                              <td className="px-4 py-3">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleActivityRow(activity.id)}
                                  aria-label={`Select ${activity.action}`}
                                />
                              </td>
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
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Avatar className="size-6">
                                    <AvatarFallback className="bg-[#F3F4F6] text-[#6B7280] text-xs">
                                      {activity.person.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-[#111827] truncate">{activity.person}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-[#6B7280]">
                                <div>
                                  <p>{formatActivityDate(activity.date)}</p>
                                  <p className="text-xs text-[#9CA3AF]">{activity.time}</p>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Approval Status */}
        {currentApproval && (
          <div className="mt-8">
            <ApprovalStatus approval={currentApproval} compact={false} />
          </div>
        )}

      {/* Approval Modal */}
      <ApprovalRequestModal
        open={showApprovalModal}
        onOpenChange={setShowApprovalModal}
        title="Send RFP for Approval"
        description="Select internal approvers to review and approve this RFP before publication. They will receive emails with a direct link to review."
        type="rfp_publication"
        itemId={tenderData.id}
        itemTitle={tenderData.name}
        availableApprovers={availableApproversForBuyer}
        onSubmit={handleSendForApproval}
      />
    </div>
  );
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
