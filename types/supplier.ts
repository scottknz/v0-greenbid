export type SupplierTier = 'preferred' | 'standard' | 'new'

export interface CompanyContact {
  email: string
  phone: string
  address: string
}

export interface TeamMember {
  id: string
  name: string
  title: string
  function: string
  email: string
  phone: string
  proposalsWon: number
  proposalsLost: number
  relatedRFPs: string[]
}

export interface EngagementRecord {
  id: string
  date: string
  type: 'email' | 'call' | 'meeting' | 'rfp_invitation' | 'note'
  notes: string
  relatedRFP?: string
  createdBy?: string
}

export interface Supplier {
  id: string
  name: string
  tier: SupplierTier
  expertise: string[]
  totalContractValue: number
  contractsWon: number
  contractsLost: number
  lastContacted: string | null
  companyContact: CompanyContact
  teamMembers: TeamMember[]
  engagementHistory: EngagementRecord[]
  createdAt: string
  updatedAt: string
}

export const EXPERTISE_KEYWORDS = {
  industry: [
    'Cloud Infrastructure',
    'Sustainability Consulting',
    'Renewable Energy',
    'Supply Chain Management',
    'Logistics & Transportation',
    'Manufacturing',
    'Packaging Solutions',
    'Environmental Compliance',
    'Waste Management',
    'Energy Efficiency',
  ],
  services: [
    'Auditing',
    'Consulting',
    'Product Manufacturing',
    'Software/SaaS',
    'Professional Services',
    'Staffing/HR',
    'Facility Management',
    'Construction Services',
    'Legal Services',
    'Training & Development',
  ],
  technical: [
    'Data Analytics',
    'AI/Machine Learning',
    'Renewable Technology',
    'Carbon Accounting',
    'ESG Reporting',
    'IT Solutions',
    'IoT/Sensors',
    'Blockchain',
    'Cybersecurity',
    'Quality Assurance',
  ],
}

export const ALL_EXPERTISE = [
  ...EXPERTISE_KEYWORDS.industry,
  ...EXPERTISE_KEYWORDS.services,
  ...EXPERTISE_KEYWORDS.technical,
]
