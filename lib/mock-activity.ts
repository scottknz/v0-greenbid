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
