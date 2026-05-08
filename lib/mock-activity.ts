import { 
  FileText, 
  MessageSquare, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Send, 
  UserPlus, 
  UserMinus, 
  Edit, 
  Eye, 
  AlertCircle,
  type LucideIcon
} from 'lucide-react'

// ============================================================================
// Activity Types and Configuration
// ============================================================================

export type SupplierActivityType = 
  | 'rfp_registered'
  | 'rfp_approved'
  | 'rfp_rejected'
  | 'submission_draft_saved'
  | 'submission_submitted'
  | 'submission_release_requested'
  | 'submission_released'
  | 'question_submitted'
  | 'question_answered'
  | 'document_uploaded'
  | 'document_deleted'
  | 'message_sent'
  | 'message_received'
  | 'team_member_added'
  | 'team_member_removed'
  | 'profile_updated'
  | 'rfp_viewed'

export interface ActivityTypeConfig {
  label: string
  icon: LucideIcon
  color: string
}

export const SUPPLIER_ACTIVITY_TYPES: Record<SupplierActivityType, ActivityTypeConfig> = {
  rfp_registered: { label: 'Registered Interest', icon: FileText, color: 'text-blue-600 bg-blue-100' },
  rfp_approved: { label: 'Registration Approved', icon: CheckCircle, color: 'text-brand-green bg-brand-green-light' },
  rfp_rejected: { label: 'Registration Rejected', icon: XCircle, color: 'text-red-600 bg-red-100' },
  submission_draft_saved: { label: 'Draft Saved', icon: Edit, color: 'text-grey-600 bg-grey-100' },
  submission_submitted: { label: 'Proposal Submitted', icon: Send, color: 'text-purple-600 bg-purple-100' },
  submission_release_requested: { label: 'Release Requested', icon: AlertCircle, color: 'text-amber-600 bg-amber-100' },
  submission_released: { label: 'Submission Released', icon: CheckCircle, color: 'text-brand-green bg-brand-green-light' },
  question_submitted: { label: 'Question Submitted', icon: MessageSquare, color: 'text-blue-600 bg-blue-100' },
  question_answered: { label: 'Question Answered', icon: MessageSquare, color: 'text-brand-green bg-brand-green-light' },
  document_uploaded: { label: 'Document Uploaded', icon: Upload, color: 'text-indigo-600 bg-indigo-100' },
  document_deleted: { label: 'Document Deleted', icon: XCircle, color: 'text-red-600 bg-red-100' },
  message_sent: { label: 'Message Sent', icon: Send, color: 'text-blue-600 bg-blue-100' },
  message_received: { label: 'Message Received', icon: MessageSquare, color: 'text-brand-green bg-brand-green-light' },
  team_member_added: { label: 'Team Member Added', icon: UserPlus, color: 'text-brand-green bg-brand-green-light' },
  team_member_removed: { label: 'Team Member Removed', icon: UserMinus, color: 'text-red-600 bg-red-100' },
  profile_updated: { label: 'Profile Updated', icon: Edit, color: 'text-grey-600 bg-grey-100' },
  rfp_viewed: { label: 'RFP Viewed', icon: Eye, color: 'text-grey-600 bg-grey-100' },
}

// ============================================================================
// Activity Log Entries
// ============================================================================

export interface SupplierActivityLogItem {
  id: string
  type: SupplierActivityType
  description: string
  rfpId: string | null
  rfpTitle: string | null
  createdAt: string
}

export const mockSupplierActivityLog: SupplierActivityLogItem[] = [
  {
    id: 'act-001',
    type: 'submission_submitted',
    description: 'Submitted proposal for "SBTi Target Setting & Validation Support"',
    rfpId: 'rfp-002',
    rfpTitle: 'SBTi Target Setting & Validation Support',
    createdAt: '2026-04-10T14:30:00Z',
  },
  {
    id: 'act-002',
    type: 'message_received',
    description: 'Received message from Thistle Company regarding clarification questions',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    createdAt: '2026-04-09T10:15:00Z',
  },
  {
    id: 'act-003',
    type: 'document_uploaded',
    description: 'Uploaded "ISO 14001 Certificate" to Library',
    rfpId: null,
    rfpTitle: null,
    createdAt: '2026-04-08T16:45:00Z',
  },
  {
    id: 'act-004',
    type: 'rfp_approved',
    description: 'Registration approved for "Comprehensive Scope 3 Value Chain Emissions Analysis"',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    createdAt: '2026-04-07T09:00:00Z',
  },
  {
    id: 'act-005',
    type: 'submission_draft_saved',
    description: 'Saved draft response for "Comprehensive Scope 3 Value Chain Emissions Analysis"',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    createdAt: '2026-04-06T17:30:00Z',
  },
  {
    id: 'act-006',
    type: 'question_submitted',
    description: 'Submitted question about timeline requirements',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    createdAt: '2026-04-05T11:20:00Z',
  },
  {
    id: 'act-007',
    type: 'rfp_registered',
    description: 'Registered interest in "ISSB (IFRS S1 & S2) Integration & Reporting"',
    rfpId: 'rfp-004',
    rfpTitle: 'ISSB (IFRS S1 & S2) Integration & Reporting',
    createdAt: '2026-04-01T08:45:00Z',
  },
  {
    id: 'act-008',
    type: 'team_member_added',
    description: 'Added Sarah Johnson as Editor',
    rfpId: null,
    rfpTitle: null,
    createdAt: '2026-03-28T14:00:00Z',
  },
  {
    id: 'act-009',
    type: 'rfp_rejected',
    description: 'Not selected for "Renewable Energy Procurement Strategy"',
    rfpId: 'rfp-005',
    rfpTitle: 'Renewable Energy Procurement Strategy',
    createdAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'act-010',
    type: 'submission_submitted',
    description: 'Submitted proposal for "Renewable Energy Procurement Strategy"',
    rfpId: 'rfp-005',
    rfpTitle: 'Renewable Energy Procurement Strategy',
    createdAt: '2026-03-14T16:55:00Z',
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getActivityConfig(type: SupplierActivityType): ActivityTypeConfig {
  return SUPPLIER_ACTIVITY_TYPES[type]
}

export function filterActivitiesByType(
  activities: SupplierActivityLogItem[], 
  type: SupplierActivityType
): SupplierActivityLogItem[] {
  return activities.filter(a => a.type === type)
}

export function filterActivitiesByRFP(
  activities: SupplierActivityLogItem[], 
  rfpId: string
): SupplierActivityLogItem[] {
  return activities.filter(a => a.rfpId === rfpId)
}

export function getRecentActivities(
  activities: SupplierActivityLogItem[], 
  limit: number = 10
): SupplierActivityLogItem[] {
  return [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

// ============================================================================
// BUYER Activity Types and Configuration
// ============================================================================

export type BuyerActivityType = 
  | 'rfp_created'
  | 'rfp_published'
  | 'rfp_updated'
  | 'rfp_closed'
  | 'rfp_cancelled'
  | 'rfp_sent_for_approval'
  | 'rfp_approved'
  | 'rfp_changes_requested'
  | 'supplier_invited'
  | 'supplier_registered'
  | 'supplier_approved'
  | 'supplier_rejected'
  | 'submission_received'
  | 'submission_reviewed'
  | 'submission_shortlisted'
  | 'submission_awarded'
  | 'question_received'
  | 'question_answered'
  | 'clarification_published'
  | 'document_uploaded'
  | 'document_deleted'
  | 'message_sent'
  | 'message_received'
  | 'team_member_added'
  | 'team_member_removed'
  | 'deadline_extended'
  | 'evaluation_started'
  | 'evaluation_completed'

export const BUYER_ACTIVITY_TYPES: Record<BuyerActivityType, ActivityTypeConfig> = {
  rfp_created: { label: 'RFP Created', icon: FileText, color: 'text-blue-600 bg-blue-100' },
  rfp_published: { label: 'RFP Published', icon: Send, color: 'text-brand-green bg-brand-green-light' },
  rfp_updated: { label: 'RFP Updated', icon: Edit, color: 'text-grey-600 bg-grey-100' },
  rfp_closed: { label: 'RFP Closed', icon: CheckCircle, color: 'text-brand-green bg-brand-green-light' },
  rfp_cancelled: { label: 'RFP Cancelled', icon: XCircle, color: 'text-red-600 bg-red-100' },
  rfp_sent_for_approval: { label: 'Sent for Approval', icon: Send, color: 'text-purple-600 bg-purple-100' },
  rfp_approved: { label: 'RFP Approved', icon: CheckCircle, color: 'text-brand-green bg-brand-green-light' },
  rfp_changes_requested: { label: 'Changes Requested', icon: AlertCircle, color: 'text-amber-600 bg-amber-100' },
  supplier_invited: { label: 'Supplier Invited', icon: UserPlus, color: 'text-blue-600 bg-blue-100' },
  supplier_registered: { label: 'Supplier Registered', icon: UserPlus, color: 'text-indigo-600 bg-indigo-100' },
  supplier_approved: { label: 'Supplier Approved', icon: CheckCircle, color: 'text-brand-green bg-brand-green-light' },
  supplier_rejected: { label: 'Supplier Rejected', icon: XCircle, color: 'text-red-600 bg-red-100' },
  submission_received: { label: 'Submission Received', icon: Upload, color: 'text-indigo-600 bg-indigo-100' },
  submission_reviewed: { label: 'Submission Reviewed', icon: Eye, color: 'text-purple-600 bg-purple-100' },
  submission_shortlisted: { label: 'Shortlisted', icon: CheckCircle, color: 'text-brand-green bg-brand-green-light' },
  submission_awarded: { label: 'Contract Awarded', icon: CheckCircle, color: 'text-brand-green bg-brand-green-light' },
  question_received: { label: 'Question Received', icon: MessageSquare, color: 'text-blue-600 bg-blue-100' },
  question_answered: { label: 'Question Answered', icon: MessageSquare, color: 'text-brand-green bg-brand-green-light' },
  clarification_published: { label: 'Clarification Published', icon: MessageSquare, color: 'text-indigo-600 bg-indigo-100' },
  document_uploaded: { label: 'Document Uploaded', icon: Upload, color: 'text-indigo-600 bg-indigo-100' },
  document_deleted: { label: 'Document Deleted', icon: XCircle, color: 'text-red-600 bg-red-100' },
  message_sent: { label: 'Message Sent', icon: Send, color: 'text-blue-600 bg-blue-100' },
  message_received: { label: 'Message Received', icon: MessageSquare, color: 'text-brand-green bg-brand-green-light' },
  team_member_added: { label: 'Team Member Added', icon: UserPlus, color: 'text-brand-green bg-brand-green-light' },
  team_member_removed: { label: 'Team Member Removed', icon: UserMinus, color: 'text-red-600 bg-red-100' },
  deadline_extended: { label: 'Deadline Extended', icon: AlertCircle, color: 'text-amber-600 bg-amber-100' },
  evaluation_started: { label: 'Evaluation Started', icon: Eye, color: 'text-purple-600 bg-purple-100' },
  evaluation_completed: { label: 'Evaluation Completed', icon: CheckCircle, color: 'text-brand-green bg-brand-green-light' },
}

// ============================================================================
// Buyer Activity Log Entries
// ============================================================================

export interface BuyerActivityLogItem {
  id: string
  type: BuyerActivityType
  description: string
  rfpId: string | null
  rfpTitle: string | null
  supplierId?: string | null
  supplierName?: string | null
  createdAt: string
  userId: string
  userName: string
}

export const mockBuyerActivityLog: BuyerActivityLogItem[] = [
  {
    id: 'bact-001',
    type: 'submission_received',
    description: 'Received proposal submission from EcoMetrics Consulting',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    supplierId: 'sup-001',
    supplierName: 'EcoMetrics Consulting',
    createdAt: '2026-04-10T14:30:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-002',
    type: 'rfp_sent_for_approval',
    description: 'Sent RFP for internal approval before publication',
    rfpId: 'rfp-002',
    rfpTitle: 'SBTi Target Setting & Validation Support',
    createdAt: '2026-04-09T10:15:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-003',
    type: 'rfp_approved',
    description: 'RFP approved by Emily Rodriguez (VP Sustainability)',
    rfpId: 'rfp-002',
    rfpTitle: 'SBTi Target Setting & Validation Support',
    createdAt: '2026-04-09T11:30:00Z',
    userId: 'user-emily',
    userName: 'Emily Rodriguez',
  },
  {
    id: 'bact-004',
    type: 'rfp_published',
    description: 'Published RFP to supplier marketplace',
    rfpId: 'rfp-002',
    rfpTitle: 'SBTi Target Setting & Validation Support',
    createdAt: '2026-04-09T12:00:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-005',
    type: 'supplier_registered',
    description: 'GreenPath Solutions registered interest in RFP',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    supplierId: 'sup-002',
    supplierName: 'GreenPath Solutions',
    createdAt: '2026-04-08T16:45:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-006',
    type: 'supplier_approved',
    description: 'Approved GreenPath Solutions to participate in RFP',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    supplierId: 'sup-002',
    supplierName: 'GreenPath Solutions',
    createdAt: '2026-04-08T17:00:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-007',
    type: 'question_received',
    description: 'Received clarification question from Carbon Trust Ltd',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    supplierId: 'sup-003',
    supplierName: 'Carbon Trust Ltd',
    createdAt: '2026-04-07T09:00:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-008',
    type: 'question_answered',
    description: 'Published answer to clarification question',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    createdAt: '2026-04-07T14:30:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-009',
    type: 'rfp_created',
    description: 'Created new RFP draft',
    rfpId: 'rfp-003',
    rfpTitle: 'Circular Economy Strategy Development',
    createdAt: '2026-04-06T11:20:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-010',
    type: 'team_member_added',
    description: 'Added James Wilson (Finance Director) as approver',
    rfpId: 'rfp-002',
    rfpTitle: 'SBTi Target Setting & Validation Support',
    createdAt: '2026-04-05T08:45:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-011',
    type: 'document_uploaded',
    description: 'Uploaded "Evaluation Criteria Template" to RFP',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    createdAt: '2026-04-04T14:00:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-012',
    type: 'submission_reviewed',
    description: 'Completed initial review of EcoMetrics Consulting submission',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    supplierId: 'sup-001',
    supplierName: 'EcoMetrics Consulting',
    createdAt: '2026-04-03T10:00:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-013',
    type: 'submission_shortlisted',
    description: 'Shortlisted EcoMetrics Consulting for final evaluation',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    supplierId: 'sup-001',
    supplierName: 'EcoMetrics Consulting',
    createdAt: '2026-04-02T16:55:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-014',
    type: 'evaluation_started',
    description: 'Started formal evaluation process',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    createdAt: '2026-04-01T09:00:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
  {
    id: 'bact-015',
    type: 'message_sent',
    description: 'Sent message to EcoMetrics Consulting regarding timeline',
    rfpId: 'rfp-001',
    rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    supplierId: 'sup-001',
    supplierName: 'EcoMetrics Consulting',
    createdAt: '2026-03-28T11:30:00Z',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
  },
]

// ============================================================================
// Buyer Helper Functions
// ============================================================================

export function getBuyerActivityConfig(type: BuyerActivityType): ActivityTypeConfig {
  return BUYER_ACTIVITY_TYPES[type]
}

export function filterBuyerActivitiesByType(
  activities: BuyerActivityLogItem[], 
  type: BuyerActivityType
): BuyerActivityLogItem[] {
  return activities.filter(a => a.type === type)
}

export function filterBuyerActivitiesByRFP(
  activities: BuyerActivityLogItem[], 
  rfpId: string
): BuyerActivityLogItem[] {
  return activities.filter(a => a.rfpId === rfpId)
}

export function getRecentBuyerActivities(
  activities: BuyerActivityLogItem[], 
  limit: number = 10
): BuyerActivityLogItem[] {
  return [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}
