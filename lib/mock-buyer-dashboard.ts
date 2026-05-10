// ============================================================================
// Buyer Dashboard Mock Data
// This file contains all buyer dashboard-related mock data
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export interface BuyerAction {
  id: number
  type: 'review' | 'approve' | 'finalize' | 'respond'
  title: string
  rfpName: string
  dueDate: string
  rfpId: string
  urgency: 'high' | 'medium' | 'low'
}

export interface BuyerRfp {
  id: number
  name: string
  status: 'draft' | 'accepting_bids' | 'evaluating' | 'awarded' | 'closed'
  submissions: number
  pendingQA: number
  deadline: string
  budget: number
}

export interface BuyerMetrics {
  activeRFPs: number
  pendingQA: number
  inEvaluation: number
  unreadMessages: number
}

// ============================================================================
// Action Items Data
// ============================================================================

export const buyerActions: BuyerAction[] = [
  {
    id: 1,
    type: 'review',
    title: 'Review supplier submissions',
    rfpName: 'Scope 3 Analysis',
    dueDate: '2026-05-08',
    rfpId: '1',
    urgency: 'high'
  },
  {
    id: 2,
    type: 'approve',
    title: 'Approve evaluation criteria',
    rfpName: 'Office Supplies 2026',
    dueDate: '2026-05-10',
    rfpId: '2',
    urgency: 'medium'
  },
  {
    id: 3,
    type: 'finalize',
    title: 'Finalize contract terms',
    rfpName: 'Carbon-Neutral Logistics',
    dueDate: '2026-05-12',
    rfpId: '3',
    urgency: 'medium'
  },
]

// ============================================================================
// RFPs Data
// ============================================================================

export const buyerRfps: BuyerRfp[] = [
  {
    id: 1,
    name: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    status: 'accepting_bids',
    submissions: 8,
    pendingQA: 2,
    deadline: '2026-05-15',
    budget: 450000,
  },
  {
    id: 2,
    name: 'SBTi Target Setting & Validation Support',
    status: 'evaluating',
    submissions: 12,
    pendingQA: 0,
    deadline: '2026-04-28',
    budget: 320000,
  },
  {
    id: 3,
    name: 'Embodied Carbon Life Cycle Assessment (LCA)',
    status: 'draft',
    submissions: 0,
    pendingQA: 0,
    deadline: '2026-06-01',
    budget: 280000,
  },
]

// ============================================================================
// Metrics Data
// ============================================================================

export const buyerMetrics: BuyerMetrics = {
  activeRFPs: 12,
  pendingQA: 5,
  inEvaluation: 8,
  unreadMessages: 3,
}

// ============================================================================
// Helper Functions
// ============================================================================

export function getDaysUntilDeadline(dateStr: string, referenceDate: string = '2026-05-10'): number {
  const today = new Date(referenceDate)
  const deadline = new Date(dateStr)
  const days = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return days
}

export function getUrgencyColor(days: number): string {
  if (days < 0) return 'text-red-700 bg-red-50'
  if (days <= 3) return 'text-red-600 bg-red-50'
  if (days <= 7) return 'text-amber-600 bg-amber-50'
  return 'text-green-600 bg-green-50'
}

export function getUrgencyLabel(days: number): string {
  if (days < 0) return 'Overdue'
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days} days`
}
