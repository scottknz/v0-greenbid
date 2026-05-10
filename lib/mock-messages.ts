// ============================================================================
// Message System Mock Data
// This file contains all messaging-related mock data for both buyer and supplier
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export interface MessageAttachment {
  name: string
  size: string
  url: string
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderCompany?: string
  senderType: 'buyer' | 'supplier'
  content: string
  attachments: MessageAttachment[]
  timestamp: string
}

export interface MessageThread {
  id: string
  rfpId?: string
  rfpTitle?: string
  subject: string
  visibility: 'all' | 'private' | 'public'
  status: 'open' | 'awaiting' | 'action' | 'resolved'
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
  lastSender: string
  lastSenderType: 'buyer' | 'supplier'
  lastSenderCompany?: string
  participants: string[]
  messages: Message[]
}

export interface RfpReference {
  id: string
  title: string
  status: string
}

export interface TeamMemberReference {
  id: string
  name: string
  role: string
}

export interface SupplierReference {
  id: string
  name: string
  contact: string
  email?: string
}

export interface ThreadStatus {
  key: string
  label: string
  color: string
}

export interface FolderDefinition {
  key: string
  label: string
}

// ============================================================================
// Buyer Messages Data
// ============================================================================

export const buyerRfpsData: RfpReference[] = [
  { id: "rfp1", title: "Comprehensive Scope 3 Value Chain Emissions Analysis", status: "published" },
  { id: "rfp2", title: "SBTi Target Setting & Validation Support", status: "published" },
  { id: "rfp3", title: "Embodied Carbon Life Cycle Assessment (LCA)", status: "closed" },
  { id: "rfp4", title: "ISSB (IFRS S1 & S2) Integration & Reporting", status: "evaluating" },
]

export const buyerTeamMembersData: TeamMemberReference[] = [
  { id: "b1", name: "Emma Thompson", role: "Sustainability Lead" },
  { id: "b2", name: "David Kumar", role: "Carbon Analyst" },
  { id: "b3", name: "Lisa Martinez", role: "ESG Manager" },
]

export const buyerSuppliersData: SupplierReference[] = [
  { id: "s1", name: "EcoMetrics Advisory", contact: "Dr. Sarah Chen" },
  { id: "s2", name: "CarbonClear Solutions", contact: "Emily Rodriguez" },
  { id: "s3", name: "Transition Risk Partners", contact: "Robert Williams" },
  { id: "s4", name: "SustainSustain", contact: "David Park" },
  { id: "s5", name: "Lifecycle Data Labs", contact: "Dr. Patricia Smith" },
]

export const globalSuppliersData: SupplierReference[] = [
  { id: "g1", name: "PCAF Analytics Group", contact: "James Mitchell", email: "james@pcafgroup.com" },
  { id: "g2", name: "GridShift Energy Advisors", contact: "Nina Patel", email: "nina@gridshift.com" },
  { id: "g3", name: "Apex Environmental Consulting", contact: "Tom Wilson", email: "tom@apexenv.com" },
]

export const threadStatuses: ThreadStatus[] = [
  { key: "awaiting", label: "Awaiting Response", color: "bg-amber-100 text-amber-800" },
  { key: "action", label: "Action Required", color: "bg-red-100 text-red-800" },
  { key: "open", label: "Open", color: "bg-blue-100 text-blue-800" },
  { key: "resolved", label: "Resolved", color: "bg-brand-green-light text-brand-green" },
]

export const messageFolders: FolderDefinition[] = [
  { key: "inbox", label: "Inbox" },
  { key: "starred", label: "Starred" },
  { key: "awaiting", label: "Awaiting Response" },
  { key: "action", label: "Action Required" },
  { key: "sent", label: "Sent" },
  { key: "all", label: "All Messages" },
  { key: "archived", label: "Archived" },
]

export const buyerMessageThreads: MessageThread[] = [
  {
    id: "t1",
    rfpId: "rfp1",
    rfpTitle: "Sustainable Office Supplies 2026",
    subject: "Clarification on recycled content requirements",
    visibility: "all",
    status: "awaiting",
    isRead: false,
    isStarred: true,
    isArchived: false,
    createdAt: "2026-03-10T09:30:00Z",
    updatedAt: "2026-03-12T14:20:00Z",
    lastSender: "John Smith",
    lastSenderType: "supplier",
    lastSenderCompany: "EcoSupply Co.",
    participants: ["s1", "s2", "s3"],
    messages: [
      {
        id: "m1",
        senderId: "buyer",
        senderName: "Sarah Chen",
        senderType: "buyer",
        content: "Please note that all paper products must contain a minimum of 80% post-consumer recycled content. This is a mandatory requirement.",
        attachments: [{ name: "Recycling_Standards.pdf", size: "245 KB", url: "#" }],
        timestamp: "2026-03-10T09:30:00Z",
      },
      {
        id: "m2",
        senderId: "s1",
        senderName: "John Smith",
        senderCompany: "EcoSupply Co.",
        senderType: "supplier",
        content: "Thank you for the clarification. Can you confirm if this applies to all paper products or just A4 copy paper?",
        attachments: [],
        timestamp: "2026-03-12T14:20:00Z",
      },
    ],
  },
  {
    id: "t2",
    rfpId: "rfp1",
    rfpTitle: "Sustainable Office Supplies 2026",
    subject: "Delivery schedule flexibility",
    visibility: "private",
    status: "resolved",
    isRead: true,
    isStarred: false,
    isArchived: false,
    createdAt: "2026-03-11T10:00:00Z",
    updatedAt: "2026-03-11T16:45:00Z",
    lastSender: "David Thompson",
    lastSenderType: "buyer",
    lastSenderCompany: undefined,
    participants: ["s2"],
    messages: [
      {
        id: "m3",
        senderId: "s2",
        senderName: "Emma Davis",
        senderCompany: "GreenOffice Ltd",
        senderType: "supplier",
        content: "We wanted to discuss the delivery schedule privately. Our logistics partner has capacity constraints in June.",
        attachments: [{ name: "Delivery_Capacity_Analysis.xlsx", size: "128 KB", url: "#" }],
        timestamp: "2026-03-11T10:00:00Z",
      },
      {
        id: "m4",
        senderId: "buyer",
        senderName: "David Thompson",
        senderType: "buyer",
        content: "Thank you for flagging this early. We have some flexibility on timing. Please include your preferred delivery schedule in your proposal.",
        attachments: [],
        timestamp: "2026-03-11T16:45:00Z",
      },
    ],
  },
  {
    id: "t3",
    rfpId: "rfp2",
    rfpTitle: "IT Infrastructure Renewal",
    subject: "ISO 14001 certification timeline",
    visibility: "all",
    status: "action",
    isRead: false,
    isStarred: false,
    isArchived: false,
    createdAt: "2026-03-13T08:00:00Z",
    updatedAt: "2026-03-14T10:30:00Z",
    lastSender: "Michael Brown",
    lastSenderType: "supplier",
    lastSenderCompany: "Sustainable Solutions Inc",
    participants: ["s1", "s2", "s3", "s4", "s5"],
    messages: [
      {
        id: "m5",
        senderId: "buyer",
        senderName: "Lisa Wang",
        senderType: "buyer",
        content: "We require all bidders to hold current ISO 14001 certification. Please confirm your certification status.",
        attachments: [],
        timestamp: "2026-03-13T08:00:00Z",
      },
      {
        id: "m6",
        senderId: "s4",
        senderName: "Michael Brown",
        senderCompany: "Sustainable Solutions Inc",
        senderType: "supplier",
        content: "Our ISO 14001 certification expires in April. We are in the process of renewal. Can we submit our renewal application as proof?",
        attachments: [],
        timestamp: "2026-03-14T10:30:00Z",
      },
    ],
  },
  {
    id: "t4",
    rfpId: "rfp3",
    rfpTitle: "Carbon Offset Program",
    subject: "Verification methodology questions",
    visibility: "all",
    status: "open",
    isRead: true,
    isStarred: false,
    isArchived: false,
    createdAt: "2026-03-08T11:00:00Z",
    updatedAt: "2026-03-09T15:00:00Z",
    lastSender: "Patricia Lee",
    lastSenderType: "supplier",
    lastSenderCompany: "VerifyGreen",
    participants: ["s1", "s3"],
    messages: [
      {
        id: "m7",
        senderId: "s1",
        senderName: "Patricia Lee",
        senderCompany: "VerifyGreen",
        senderType: "supplier",
        content: "Could you clarify which verification standards are acceptable? We use both Gold Standard and VCS methodologies.",
        attachments: [],
        timestamp: "2026-03-08T11:00:00Z",
      },
      {
        id: "m8",
        senderId: "buyer",
        senderName: "James Wong",
        senderType: "buyer",
        content: "Both Gold Standard and VCS are acceptable. We also accept CAR and ACR certifications.",
        attachments: [{ name: "Accepted_Standards.pdf", size: "156 KB", url: "#" }],
        timestamp: "2026-03-09T15:00:00Z",
      },
    ],
  },
  {
    id: "t5",
    rfpId: "rfp1",
    rfpTitle: "Sustainable Office Supplies 2026",
    subject: "Archived: Initial requirements discussion",
    visibility: "all",
    status: "resolved",
    isRead: true,
    isStarred: false,
    isArchived: true,
    createdAt: "2026-02-20T09:00:00Z",
    updatedAt: "2026-02-25T14:00:00Z",
    lastSender: "Sarah Chen",
    lastSenderType: "buyer",
    lastSenderCompany: undefined,
    participants: ["s1", "s2"],
    messages: [
      {
        id: "m9",
        senderId: "buyer",
        senderName: "Sarah Chen",
        senderType: "buyer",
        content: "This thread has been archived as the initial requirements phase is complete.",
        attachments: [],
        timestamp: "2026-02-25T14:00:00Z",
      },
    ],
  },
]

// ============================================================================
// Supplier Messages Data
// ============================================================================

export const supplierRfpsData: RfpReference[] = [
  { id: "rfp1", title: "Sustainable Packaging RFP", status: "in_progress" },
  { id: "rfp2", title: "Supply Chain Audit Services", status: "submitted" },
  { id: "rfp3", title: "Carbon Reporting Tools", status: "under_review" },
  { id: "rfp4", title: "ESG Compliance Audit", status: "in_progress" },
]

export const supplierBuyersData: TeamMemberReference[] = [
  { id: "b1", name: "Jane Smith", role: "Procurement Lead" },
  { id: "b2", name: "Robert Chen", role: "Sustainability Director" },
  { id: "b3", name: "Sarah Williams", role: "Category Manager" },
]

export const supplierTeamMembersData: TeamMemberReference[] = [
  { id: "t1", name: "John Smith", role: "Account Manager" },
  { id: "t2", name: "Emily Chen", role: "Technical Lead" },
  { id: "t3", name: "David Park", role: "Solutions Architect" },
]

export const supplierMessageThreads: MessageThread[] = [
  {
    id: "t1",
    rfpId: "rfp1",
    rfpTitle: "Sustainable Packaging RFP",
    subject: "Clarification on delivery timeline",
    visibility: "public",
    status: "awaiting",
    isRead: false,
    isStarred: true,
    isArchived: false,
    createdAt: "2026-05-06T09:30:00Z",
    updatedAt: "2026-05-08T14:20:00Z",
    lastSender: "Jane Smith",
    lastSenderType: "buyer",
    lastSenderCompany: undefined,
    participants: ["b1"],
    messages: [
      {
        id: "m1",
        senderId: "buyer",
        senderName: "Jane Smith",
        senderType: "buyer",
        content: "Could you please clarify the expected delivery timeline for the initial pilot phase? We need to ensure alignment with our internal deadlines.",
        attachments: [{ name: "Project_Timeline.pdf", size: "245 KB", url: "#" }],
        timestamp: "2026-05-06T09:30:00Z",
      },
      {
        id: "m2",
        senderId: "supplier",
        senderName: "John Smith",
        senderType: "supplier",
        content: "Thank you for reaching out. We can deliver the pilot phase within 6-8 weeks from contract signing. I have attached our proposed timeline for your review.",
        attachments: [{ name: "Proposed_Delivery_Schedule.pdf", size: "312 KB", url: "#" }],
        timestamp: "2026-05-07T11:15:00Z",
      },
      {
        id: "m3",
        senderId: "buyer",
        senderName: "Jane Smith",
        senderType: "buyer",
        content: "Thanks for the quick response. Can you confirm if the 6-8 week timeline includes the testing phase, or is that additional?",
        attachments: [],
        timestamp: "2026-05-08T14:20:00Z",
      },
    ],
  },
  {
    id: "t2",
    rfpId: "rfp1",
    rfpTitle: "Sustainable Packaging RFP",
    subject: "Pricing adjustments discussion",
    visibility: "private",
    status: "resolved",
    isRead: true,
    isStarred: false,
    isArchived: false,
    createdAt: "2026-05-05T10:00:00Z",
    updatedAt: "2026-05-07T16:45:00Z",
    lastSender: "Jane Smith",
    lastSenderType: "buyer",
    lastSenderCompany: undefined,
    participants: ["b1"],
    messages: [
      {
        id: "m4",
        senderId: "supplier",
        senderName: "John Smith",
        senderType: "supplier",
        content: "We wanted to discuss pricing adjustments privately. Based on the volume requirements, we can offer a 12% discount on the per-unit pricing.",
        attachments: [{ name: "Volume_Discount_Proposal.xlsx", size: "128 KB", url: "#" }],
        timestamp: "2026-05-05T10:00:00Z",
      },
      {
        id: "m5",
        senderId: "buyer",
        senderName: "Jane Smith",
        senderType: "buyer",
        content: "Thank you for the proposal. The discount is acceptable. Please include this in your final submission.",
        attachments: [],
        timestamp: "2026-05-07T16:45:00Z",
      },
    ],
  },
  {
    id: "t3",
    rfpId: "rfp1",
    rfpTitle: "Sustainable Packaging RFP",
    subject: "Updated specifications - please review",
    visibility: "public",
    status: "open",
    isRead: true,
    isStarred: false,
    isArchived: false,
    createdAt: "2026-05-05T08:00:00Z",
    updatedAt: "2026-05-05T08:00:00Z",
    lastSender: "Jane Smith",
    lastSenderType: "buyer",
    lastSenderCompany: undefined,
    participants: ["b1"],
    messages: [
      {
        id: "m6",
        senderId: "buyer",
        senderName: "Jane Smith",
        senderType: "buyer",
        content: "We have updated the technical specifications document. Please review the changes highlighted in Section 3.2 regarding environmental compliance requirements.",
        attachments: [
          { name: "Technical_Specs_v2.pdf", size: "1.2 MB", url: "#" },
          { name: "Change_Log.docx", size: "45 KB", url: "#" },
        ],
        timestamp: "2026-05-05T08:00:00Z",
      },
    ],
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getUnreadThreadCount(threads: MessageThread[]): number {
  return threads.filter(t => !t.isRead && !t.isArchived).length
}

export function getThreadsByFolder(threads: MessageThread[], folder: string): MessageThread[] {
  switch (folder) {
    case 'inbox':
      return threads.filter(t => !t.isArchived)
    case 'starred':
      return threads.filter(t => t.isStarred && !t.isArchived)
    case 'awaiting':
      return threads.filter(t => t.status === 'awaiting' && !t.isArchived)
    case 'action':
      return threads.filter(t => t.status === 'action' && !t.isArchived)
    case 'sent':
      return threads.filter(t => t.lastSenderType === 'buyer' && !t.isArchived)
    case 'all':
      return threads.filter(t => !t.isArchived)
    case 'archived':
      return threads.filter(t => t.isArchived)
    default:
      return threads
  }
}

export function formatMessageTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays < 7) {
    return date.toLocaleDateString('en-GB', { weekday: 'short' })
  }
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
