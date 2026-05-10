import { 
  FileText, 
  CheckCircle2, 
  Mail, 
  Award,
  type LucideIcon
} from 'lucide-react'
import type { TenderState } from '@/config/site'

// ============================================================================
// Dashboard Tender Row Data
// ============================================================================

export interface DashboardTenderRow {
  id: string
  name: string
  status: TenderState
  deadline: string
  suppliers: number
  score: string | null
  isNearingDeadline?: boolean
}

export const mockDashboardTenders: DashboardTenderRow[] = [
  { 
    id: '1', 
    name: 'Comprehensive Scope 3 Value Chain Emissions Analysis', 
    status: 'under_review', 
    deadline: '2026-05-15', 
    suppliers: 5, 
    score: 'Pending' 
  },
  { 
    id: '2', 
    name: 'SBTi Target Setting & Validation Support', 
    status: 'open_for_proposals', 
    deadline: '2026-04-28', 
    suppliers: 12, 
    score: null, 
    isNearingDeadline: true 
  },
  { 
    id: '3', 
    name: 'Embodied Carbon Life Cycle Assessment (LCA)', 
    status: 'draft', 
    deadline: '2026-06-01', 
    suppliers: 0, 
    score: null 
  },
  { 
    id: '4', 
    name: 'ISSB (IFRS S1 & S2) Integration & Reporting', 
    status: 'awarded', 
    deadline: '2026-03-31', 
    suppliers: 8, 
    score: '92/100' 
  },
]

// ============================================================================
// Dashboard Activity Feed Data
// ============================================================================

export interface DashboardActivityItem {
  id: string
  icon: LucideIcon
  action: string
  target?: string
  timestamp: string
  isUnread?: boolean
}

export const mockDashboardActivities: DashboardActivityItem[] = [
  { 
    id: '1', 
    icon: CheckCircle2, 
    action: 'Score confirmed for', 
    target: 'SBTi Target Setting & Validation Support', 
    timestamp: '2 hours ago', 
    isUnread: true 
  },
  { 
    id: '2', 
    icon: Mail, 
    action: 'Submission received from EcoMetrics Advisory', 
    timestamp: '5 hours ago', 
    isUnread: true 
  },
  { 
    id: '3', 
    icon: FileText, 
    action: 'RFP published:', 
    target: 'Comprehensive Scope 3 Value Chain Emissions Analysis', 
    timestamp: '1 day ago' 
  },
  { 
    id: '4', 
    icon: Award, 
    action: 'Contract awarded for', 
    target: 'ISSB (IFRS S1 & S2) Integration & Reporting', 
    timestamp: '2 days ago' 
  },
]

// ============================================================================
// Dashboard Statistics
// ============================================================================

export interface DashboardStats {
  activeRFPs: number
  awaitingReview: number
  suppliersInvited: number
  awardedYTD: number
  awaitingReviewChange: number
}

export const mockDashboardStats: DashboardStats = {
  activeRFPs: 12,
  awaitingReview: 4,
  suppliersInvited: 38,
  awardedYTD: 24,
  awaitingReviewChange: 2,
}

// ============================================================================
// Shared Project Data (used across team and contact modals)
// ============================================================================

export interface SharedProject {
  id: string
  name: string
  status: 'active' | 'completed' | 'pending'
  role: string
  startDate: string
  endDate?: string
}

export const mockSharedProjects: SharedProject[] = [
  {
    id: 'rfp-001',
    name: 'Scope 3 Value Chain Emissions Analysis',
    status: 'active',
    role: 'Lead',
    startDate: '2026-03-15',
  },
  {
    id: 'rfp-002',
    name: 'SBTi Target Setting & Validation',
    status: 'completed',
    role: 'Approver',
    startDate: '2026-01-10',
    endDate: '2026-03-01',
  },
  {
    id: 'rfp-003',
    name: 'Embodied Carbon LCA',
    status: 'pending',
    role: 'Reviewer',
    startDate: '2026-04-01',
  },
  {
    id: 'rfp-004',
    name: 'ISSB Integration Project',
    status: 'active',
    role: 'Observer',
    startDate: '2026-02-15',
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getUnreadActivityCount(activities: DashboardActivityItem[]): number {
  return activities.filter(a => a.isUnread).length
}

export function getTendersByStatus(
  tenders: DashboardTenderRow[], 
  status: TenderState
): DashboardTenderRow[] {
  return tenders.filter(t => t.status === status)
}

export function getNearingDeadlineTenders(
  tenders: DashboardTenderRow[]
): DashboardTenderRow[] {
  return tenders.filter(t => t.isNearingDeadline)
}
