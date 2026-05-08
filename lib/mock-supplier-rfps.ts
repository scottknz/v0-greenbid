import type { RFPTeamMember, RFPTeamRole } from '@/types/rfp'

// ============================================================================
// Supplier RFP Phase Types and Configuration
// ============================================================================

export type SupplierRFPPhase = 
  | 'new_rfp' 
  | 'in_progress' 
  | 'under_final_review' 
  | 'submitted' 
  | 'client_reviewing' 
  | 'awarded' 
  | 'rejected' 
  | 'declined'

export interface SupplierRFPPhaseTransition {
  phase: SupplierRFPPhase
  timestamp: string
  user: string
  notes?: string
}

export interface SupplierProposalNote {
  id: string
  timestamp: string
  user: string
  text: string
}

export interface BuyerQuestion {
  id: string
  question: string
  type: 'text' | 'textarea' | 'select'
  required: boolean
  options?: string[]
}

export interface RFPDocument {
  name: string
  size: string
  uploadedAt: string
}

export interface RFPTimelinePhase {
  phase: string
  date: string
}

export interface BuyerContact {
  name: string
  email: string
  phone: string
}

// Phase configuration with styling
export const SUPPLIER_PHASE_CONFIG = {
  new_rfp: { 
    label: 'New RFP', 
    color: 'bg-blue-100 text-blue-800', 
    bgColor: 'bg-blue-50', 
    borderColor: 'border-blue-200', 
    progressPercent: 14 
  },
  in_progress: { 
    label: 'In Progress', 
    color: 'bg-amber-100 text-amber-800', 
    bgColor: 'bg-amber-50', 
    borderColor: 'border-amber-200', 
    progressPercent: 43 
  },
  under_final_review: { 
    label: 'Under Final Review', 
    color: 'bg-orange-100 text-orange-800', 
    bgColor: 'bg-orange-50', 
    borderColor: 'border-orange-200', 
    progressPercent: 57 
  },
  submitted: { 
    label: 'Submitted', 
    color: 'bg-purple-100 text-purple-800', 
    bgColor: 'bg-purple-50', 
    borderColor: 'border-purple-200', 
    progressPercent: 71 
  },
  client_reviewing: { 
    label: 'Client Reviewing', 
    color: 'bg-indigo-100 text-indigo-800', 
    bgColor: 'bg-indigo-50', 
    borderColor: 'border-indigo-200', 
    progressPercent: 86 
  },
  awarded: { 
    label: 'Awarded', 
    color: 'bg-green-100 text-green-800', 
    bgColor: 'bg-green-50', 
    borderColor: 'border-green-200', 
    progressPercent: 100 
  },
  rejected: { 
    label: 'Not Successful', 
    color: 'bg-red-100 text-red-800', 
    bgColor: 'bg-red-50', 
    borderColor: 'border-red-200', 
    progressPercent: 100 
  },
  declined: { 
    label: 'Decline to Submit', 
    color: 'bg-gray-100 text-gray-800', 
    bgColor: 'bg-gray-50', 
    borderColor: 'border-gray-200', 
    progressPercent: 0 
  },
} as const

// Ordered phases for progress indicator (excluding terminal states)
export const SUPPLIER_PHASE_ORDER: SupplierRFPPhase[] = [
  'new_rfp', 
  'in_progress', 
  'under_final_review', 
  'submitted', 
  'client_reviewing', 
  'awarded'
]

// ============================================================================
// Supplier RFP List Data
// ============================================================================

export interface SupplierRFPListItem {
  id: string
  title: string
  buyerCompany: string
  currentPhase: SupplierRFPPhase
  phaseHistory: SupplierRFPPhaseTransition[]
  proposalNotes: { timestamp: string; user: string; text: string }[]
  registeredAt: string
  deadline: string
  budget: string
  category: string
  submissionStatus: 'not_started' | 'draft' | 'submitted' | 'awarded' | 'rejected'
  completionPercent: number
  submittedAt?: string
  awardedAt?: string
  rejectedAt?: string
}

export const mockSupplierRFPs: SupplierRFPListItem[] = [
  {
    id: 'rfp-001',
    title: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    buyerCompany: 'Thistle Company',
    currentPhase: 'in_progress',
    phaseHistory: [
      { phase: 'new_rfp', timestamp: '2026-03-15T10:00:00Z', user: 'Sarah Chen', notes: 'RFP received and reviewed' },
      { phase: 'in_progress', timestamp: '2026-03-18T14:30:00Z', user: 'James Wilson', notes: 'Started proposal development' }
    ],
    proposalNotes: [
      { timestamp: '2026-03-20T09:00:00Z', user: 'Sarah Chen', text: 'Need to gather additional data from clients' },
      { timestamp: '2026-03-22T15:00:00Z', user: 'James Wilson', text: 'Received all supporting documentation' }
    ],
    registeredAt: '2026-03-15',
    deadline: '2026-04-30',
    budget: '$150,000 - $200,000',
    category: 'Sustainability',
    submissionStatus: 'draft',
    completionPercent: 65,
  },
  {
    id: 'rfp-002',
    title: 'SBTi Target Setting & Validation Support',
    buyerCompany: 'GreenCorp Industries',
    currentPhase: 'client_reviewing',
    phaseHistory: [
      { phase: 'new_rfp', timestamp: '2026-03-10T10:00:00Z', user: 'Sarah Chen', notes: 'RFP reviewed' },
      { phase: 'in_progress', timestamp: '2026-03-11T09:00:00Z', user: 'Michael Park', notes: 'Proposal development started' },
      { phase: 'under_final_review', timestamp: '2026-04-08T16:00:00Z', user: 'Sarah Chen', notes: 'Final review completed' },
      { phase: 'submitted', timestamp: '2026-04-10T12:00:00Z', user: 'James Wilson', notes: 'Proposal submitted to buyer' },
      { phase: 'client_reviewing', timestamp: '2026-04-11T08:00:00Z', user: 'System', notes: 'Automatically marked as under review' }
    ],
    proposalNotes: [
      { timestamp: '2026-03-15T10:00:00Z', user: 'Sarah Chen', text: 'Completed SBTi documentation review' },
      { timestamp: '2026-04-08T14:00:00Z', user: 'Michael Park', text: 'Final proposal polish complete' }
    ],
    registeredAt: '2026-03-10',
    deadline: '2026-04-15',
    budget: '$80,000 - $120,000',
    category: 'Climate',
    submissionStatus: 'submitted',
    submittedAt: '2026-04-10',
    completionPercent: 100,
  },
  {
    id: 'rfp-003',
    title: 'Embodied Carbon Life Cycle Assessment (LCA)',
    buyerCompany: 'EcoBuilders Ltd',
    currentPhase: 'awarded',
    phaseHistory: [
      { phase: 'new_rfp', timestamp: '2026-02-20T10:00:00Z', user: 'Sarah Chen', notes: 'RFP reviewed' },
      { phase: 'in_progress', timestamp: '2026-02-21T09:00:00Z', user: 'Emily Rodriguez', notes: 'Proposal development started' },
      { phase: 'under_final_review', timestamp: '2026-03-25T16:00:00Z', user: 'Sarah Chen', notes: 'Final review completed' },
      { phase: 'submitted', timestamp: '2026-03-29T14:00:00Z', user: 'James Wilson', notes: 'Proposal submitted' },
      { phase: 'client_reviewing', timestamp: '2026-03-30T09:00:00Z', user: 'System', notes: 'Under buyer review' },
      { phase: 'awarded', timestamp: '2026-04-05T11:00:00Z', user: 'System', notes: 'Won the contract' }
    ],
    proposalNotes: [
      { timestamp: '2026-03-20T10:00:00Z', user: 'Emily Rodriguez', text: 'LCA assessment finalized' }
    ],
    registeredAt: '2026-02-20',
    deadline: '2026-03-31',
    budget: '$200,000 - $280,000',
    category: 'Construction',
    submissionStatus: 'awarded',
    awardedAt: '2026-04-05',
    completionPercent: 100,
  },
  {
    id: 'rfp-004',
    title: 'ISSB (IFRS S1 & S2) Integration & Reporting',
    buyerCompany: 'Financial Services Corp',
    currentPhase: 'new_rfp',
    phaseHistory: [
      { phase: 'new_rfp', timestamp: '2026-04-01T10:00:00Z', user: 'Sarah Chen', notes: 'RFP received and reviewed' }
    ],
    proposalNotes: [],
    registeredAt: '2026-04-01',
    deadline: '2026-05-15',
    budget: '$100,000 - $150,000',
    category: 'Reporting',
    submissionStatus: 'not_started',
    completionPercent: 0,
  },
  {
    id: 'rfp-005',
    title: 'Renewable Energy Procurement Strategy',
    buyerCompany: 'Manufacturing Plus',
    currentPhase: 'rejected',
    phaseHistory: [
      { phase: 'new_rfp', timestamp: '2026-02-01T10:00:00Z', user: 'Sarah Chen', notes: 'RFP reviewed' },
      { phase: 'in_progress', timestamp: '2026-02-02T09:00:00Z', user: 'Alex Kumar', notes: 'Proposal development started' },
      { phase: 'under_final_review', timestamp: '2026-03-10T16:00:00Z', user: 'Sarah Chen', notes: 'Final review completed' },
      { phase: 'submitted', timestamp: '2026-03-14T12:00:00Z', user: 'James Wilson', notes: 'Proposal submitted' },
      { phase: 'client_reviewing', timestamp: '2026-03-15T09:00:00Z', user: 'System', notes: 'Under buyer review' },
      { phase: 'rejected', timestamp: '2026-03-20T10:00:00Z', user: 'System', notes: 'Proposal not selected' }
    ],
    proposalNotes: [
      { timestamp: '2026-03-10T14:00:00Z', user: 'Alex Kumar', text: 'Proposal finalized' }
    ],
    registeredAt: '2026-02-01',
    deadline: '2026-03-15',
    budget: '$50,000 - $75,000',
    category: 'Energy',
    submissionStatus: 'rejected',
    rejectedAt: '2026-03-20',
    completionPercent: 100,
  },
]

// ============================================================================
// Supplier RFP Detail Data
// ============================================================================

export interface SupplierRFPDetail {
  id: string
  title: string
  buyerCompany: string
  buyerContact: BuyerContact
  onlineRFPUrl: string
  currentPhase: SupplierRFPPhase
  phaseHistory: SupplierRFPPhaseTransition[]
  phaseBeforeDecline: SupplierRFPPhase | null
  proposalNotes: SupplierProposalNote[]
  registeredAt: string
  deadline: string
  budget: string
  estimatedValue: number
  category: string
  description: string
  requirements: string[]
  deliverables: string[]
  documents: RFPDocument[]
  timeline: RFPTimelinePhase[]
  buyerQuestions: BuyerQuestion[]
}

export const mockRFPDetail: SupplierRFPDetail = {
  id: 'rfp-001',
  title: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
  buyerCompany: 'Thistle Company',
  buyerContact: {
    name: 'Emma Thompson',
    email: 'emma@thistle.com',
    phone: '+44 207 123 4567',
  },
  onlineRFPUrl: 'https://thistle.greenbid.com/rfp/scope3-analysis-2026',
  currentPhase: 'in_progress',
  phaseHistory: [
    { phase: 'new_rfp', timestamp: '2026-03-15T10:00:00Z', user: 'Sarah Chen', notes: 'RFP received and reviewed. Good fit for our capabilities.' },
    { phase: 'in_progress', timestamp: '2026-03-18T14:30:00Z', user: 'James Wilson', notes: 'Started proposal development' }
  ],
  phaseBeforeDecline: null,
  proposalNotes: [
    { id: 'note-1', timestamp: '2026-03-20T09:00:00Z', user: 'Sarah Chen', text: 'Need to gather additional emissions data from last 3 years' },
    { id: 'note-2', timestamp: '2026-03-22T15:00:00Z', user: 'James Wilson', text: 'Received all supporting documentation from operations team' }
  ],
  registeredAt: '2026-03-15',
  deadline: '2026-04-30',
  budget: '$150,000 - $200,000',
  estimatedValue: 175000,
  category: 'Sustainability',
  description:
    'We are seeking a sustainability consultant to conduct a comprehensive Scope 3 emissions analysis across our entire value chain. This includes supplier emissions, transportation, waste, and end-of-life product analysis.',
  requirements: [
    'Deep expertise in Scope 3 emissions methodology',
    'Experience with supply chain carbon accounting',
    'Knowledge of GHG Protocol standards',
    'Ability to conduct supplier engagement and data collection',
    'Experience with carbon accounting software (e.g., Catena-X, Sphera)',
  ],
  deliverables: [
    'Baseline Scope 3 emissions inventory',
    'Category-wise breakdown and analysis',
    'Hotspot identification report',
    'Recommendations for reduction strategies',
    'Executive summary for stakeholders',
  ],
  documents: [
    { name: 'RFP_Scope3_Analysis_2026.pdf', size: '2.4 MB', uploadedAt: '2026-03-15' },
    { name: 'Company_Background.docx', size: '1.2 MB', uploadedAt: '2026-03-15' },
    { name: 'Technical_Specifications.xlsx', size: '850 KB', uploadedAt: '2026-03-16' },
  ],
  timeline: [
    { phase: 'Proposal Submission', date: '2026-04-30' },
    { phase: 'Vendor Shortlisting', date: '2026-05-15' },
    { phase: 'Interviews', date: '2026-05-20' },
    { phase: 'Contract Negotiation', date: '2026-06-01' },
    { phase: 'Project Start', date: '2026-06-15' },
  ],
  buyerQuestions: [
    { id: 'q1', question: 'Describe your experience with Scope 3 emissions analysis', type: 'text', required: true },
    { id: 'q2', question: 'List your relevant certifications and methodologies used', type: 'text', required: true },
    { id: 'q3', question: 'Provide a high-level project timeline with milestones', type: 'text', required: true },
    { id: 'q4', question: 'What is your proposed pricing structure?', type: 'text', required: true },
    { id: 'q5', question: 'Describe your team composition and key personnel', type: 'text', required: false },
    { id: 'q6', question: 'Provide case studies of similar past projects', type: 'text', required: false },
  ],
}

// ============================================================================
// Approvers Data (used in approval workflow)
// ============================================================================

export interface Approver {
  id: string
  name: string
  email: string
  role: string
}

export const mockApprovers: Approver[] = [
  { id: 'a1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Senior Manager' },
  { id: 'a2', name: 'James Wilson', email: 'james.wilson@company.com', role: 'Director' },
  { id: 'a3', name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', role: 'VP Operations' },
  { id: 'a4', name: 'Michael Park', email: 'michael.park@company.com', role: 'Legal Counsel' },
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getRFPById(id: string): SupplierRFPListItem | undefined {
  return mockSupplierRFPs.find(rfp => rfp.id === id)
}

export function getRFPDetailById(id: string): SupplierRFPDetail | null {
  // In production, this would fetch from API based on ID
  // For now, return the mock detail if ID matches
  if (id === mockRFPDetail.id) {
    return mockRFPDetail
  }
  return null
}

export function getPhaseConfig(phase: SupplierRFPPhase) {
  return SUPPLIER_PHASE_CONFIG[phase]
}

export function isTerminalPhase(phase: SupplierRFPPhase): boolean {
  return ['awarded', 'rejected', 'declined'].includes(phase)
}
