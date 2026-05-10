// ============================================================================
// Supplier Dashboard Mock Data
// This file contains all supplier dashboard-related mock data
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export interface SupplierActiveRfp {
  id: string
  name: string
  buyer: string
  category: string
  status: 'drafting' | 'submitted' | 'under_review' | 'awarded' | 'rejected'
  deadline: string
  daysLeft: number
  pendingQA: number
  completion: number
}

export interface SupplierAttentionItem {
  id: string
  type: 'question' | 'deadline' | 'approval' | 'document'
  title: string
  detail: string
  rfpName: string
  rfpId: string
  urgency: 'overdue' | 'soon' | 'normal'
}

export interface SupplierOpportunity {
  id: string
  name: string
  buyer: string
  category: string
  industry: string
  deadline: string
  daysLeft: number
  budget: string
  budgetNum: number
  location: string
  suppliers: number
}

// ============================================================================
// Active RFPs Data
// ============================================================================

export const supplierActiveRfps: SupplierActiveRfp[] = [
  { 
    id: '1', 
    name: 'Sustainable Packaging RFP', 
    buyer: 'EcoRetail Inc', 
    category: 'Packaging', 
    status: 'drafting', 
    deadline: '2026-05-12', 
    daysLeft: 2, 
    pendingQA: 1, 
    completion: 65 
  },
  { 
    id: '2', 
    name: 'Supply Chain Audit Services', 
    buyer: 'GreenLogistics Ltd', 
    category: 'Consulting', 
    status: 'submitted', 
    deadline: '2026-05-15', 
    daysLeft: 5, 
    pendingQA: 0, 
    completion: 100 
  },
  { 
    id: '3', 
    name: 'Carbon Reporting Tools', 
    buyer: 'NetZero Corp', 
    category: 'Software', 
    status: 'under_review', 
    deadline: '2026-05-20', 
    daysLeft: 10, 
    pendingQA: 0, 
    completion: 100 
  },
  { 
    id: '4', 
    name: 'ESG Compliance Audit', 
    buyer: 'CleanTech Corp', 
    category: 'Consulting', 
    status: 'drafting', 
    deadline: '2026-05-24', 
    daysLeft: 14, 
    pendingQA: 0, 
    completion: 30 
  },
  { 
    id: '5', 
    name: 'Renewable Energy Assessment', 
    buyer: 'GreenPower Inc', 
    category: 'Energy', 
    status: 'drafting', 
    deadline: '2026-05-28', 
    daysLeft: 18, 
    pendingQA: 2, 
    completion: 20 
  },
]

// ============================================================================
// Attention Items Data
// ============================================================================

export const supplierAttentionItems: SupplierAttentionItem[] = [
  { 
    id: '1', 
    type: 'question', 
    title: 'Answer buyer question', 
    detail: 'ISO certifications query', 
    rfpName: 'Sustainable Packaging RFP', 
    rfpId: '1', 
    urgency: 'overdue' 
  },
  { 
    id: '2', 
    type: 'deadline', 
    title: 'Submit proposal', 
    detail: 'Deadline in 2 days', 
    rfpName: 'Sustainable Packaging RFP', 
    rfpId: '1', 
    urgency: 'soon' 
  },
  { 
    id: '3', 
    type: 'approval', 
    title: 'Internal approval needed', 
    detail: 'Pending team sign-off', 
    rfpName: 'Carbon Reporting Tools', 
    rfpId: '3', 
    urgency: 'normal' 
  },
]

// ============================================================================
// New Opportunities Data
// ============================================================================

export const supplierOpportunities: SupplierOpportunity[] = [
  { 
    id: '10', 
    name: 'ESG Data Platform Implementation', 
    buyer: 'CleanTech Corp', 
    category: 'Software', 
    industry: 'Energy & Utilities', 
    deadline: '2026-05-25', 
    daysLeft: 15, 
    budget: '$150K – $250K', 
    budgetNum: 150, 
    location: 'Auckland, NZ', 
    suppliers: 4 
  },
  { 
    id: '11', 
    name: 'Renewable Energy Audit & Certification', 
    buyer: 'GreenPower Inc', 
    category: 'Consulting', 
    industry: 'Renewables', 
    deadline: '2026-05-28', 
    daysLeft: 18, 
    budget: '$75K – $120K', 
    budgetNum: 75, 
    location: 'Wellington, NZ', 
    suppliers: 7 
  },
  { 
    id: '12', 
    name: 'Circular Economy Strategy Report', 
    buyer: 'EcoManufacturing Ltd', 
    category: 'Strategy', 
    industry: 'Manufacturing', 
    deadline: '2026-06-01', 
    daysLeft: 22, 
    budget: '$50K – $80K', 
    budgetNum: 50, 
    location: 'Christchurch, NZ', 
    suppliers: 2 
  },
  { 
    id: '13', 
    name: 'Carbon Offset Verification & Reporting', 
    buyer: 'NetZero Partners', 
    category: 'Verification', 
    industry: 'Finance', 
    deadline: '2026-06-05', 
    daysLeft: 26, 
    budget: '$30K – $60K', 
    budgetNum: 30, 
    location: 'Remote', 
    suppliers: 9 
  },
  { 
    id: '14', 
    name: 'Supply Chain Decarbonisation Plan', 
    buyer: 'Global Retail Group', 
    category: 'Strategy', 
    industry: 'Retail', 
    deadline: '2026-06-10', 
    daysLeft: 31, 
    budget: '$90K – $140K', 
    budgetNum: 90, 
    location: 'Auckland, NZ', 
    suppliers: 3 
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getProposalsDueThisWeek(rfps: SupplierActiveRfp[]): number {
  return rfps.filter(r => r.daysLeft <= 7).length
}

export function getUnansweredQACount(rfps: SupplierActiveRfp[]): number {
  return rfps.reduce((sum, r) => sum + r.pendingQA, 0)
}

export function getUrgencyOrder(urgency: 'overdue' | 'soon' | 'normal'): number {
  const order = { overdue: 0, soon: 1, normal: 2 }
  return order[urgency]
}
