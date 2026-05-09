import type { DirectorySupplier } from '@/types/supplier'

export const mockDirectorySuppliers: DirectorySupplier[] = [
  {
    id: 'dir-001',
    name: 'EcoMetrics Advisory',
    description: 'Leading sustainability consultancy specializing in Scope 3 emissions accounting and science-based target setting.',
    category: ['Scope 3', 'SBTi', 'Carbon Accounting'],
    region: 'Europe',
    country: 'UK',
    companySize: 'mid-market',
    sector: ['FMCG', 'Retail', 'Manufacturing'],
    languages: ['English', 'French', 'German'],
    verified: true,
    platformActive: '2026-04-08T16:30:00Z',
    responseRate: 94,
    avgResponseDays: 1.2,
    rfpsCompleted: 156,
    rating: 4.8,
    reviewCount: 42,
    sustainabilityCredentials: {
      ecovadisScore: 78,
      ecovadisRating: 'gold',
      bCorp: true,
      sbtiStatus: 'validated',
      iso14001: true,
      carbonNeutral: true,
      emissionsIntensity: 8,
      emissionsIntensityLabel: 'low',
      netZeroYear: 2030,
    },
    website: 'ecometrics.com',
  },
  {
    id: 'dir-002',
    name: 'Patagonia Consulting',
    description: 'Expert advisors on circular economy strategy, product sustainability, and supply chain transformation.',
    category: ['Circular Economy', 'Product Sustainability', 'Supply Chain'],
    region: 'North America',
    country: 'Canada',
    companySize: 'enterprise',
    sector: ['Apparel', 'Retail', 'FMCG'],
    languages: ['English', 'Spanish'],
    verified: true,
    platformActive: '2026-04-09T10:15:00Z',
    responseRate: 88,
    avgResponseDays: 1.8,
    rfpsCompleted: 203,
    rating: 4.7,
    reviewCount: 58,
    sustainabilityCredentials: {
      ecovadisScore: 82,
      ecovadisRating: 'gold',
      bCorp: true,
      sbtiStatus: 'validated',
      iso14001: true,
      emissionsIntensity: 6,
      emissionsIntensityLabel: 'low',
      netZeroYear: 2025,
    },
  },
  {
    id: 'dir-003',
    name: 'GreenPath Solutions',
    description: 'Boutique firm focused on CSRD reporting, double materiality assessment, and EU sustainability regulations.',
    category: ['CSRD', 'Double Materiality', 'EU Compliance'],
    region: 'Europe',
    country: 'Netherlands',
    companySize: 'sme',
    sector: ['Finance', 'Manufacturing', 'Energy'],
    languages: ['English', 'Dutch'],
    verified: true,
    platformActive: '2026-04-07T14:45:00Z',
    responseRate: 92,
    avgResponseDays: 0.9,
    rfpsCompleted: 89,
    rating: 4.9,
    reviewCount: 28,
    sustainabilityCredentials: {
      ecovadisScore: 71,
      ecovadisRating: 'silver',
      sbtiStatus: 'committed',
      iso14001: true,
      emissionsIntensity: 12,
      emissionsIntensityLabel: 'medium',
      netZeroYear: 2035,
    },
  },
  {
    id: 'dir-004',
    name: 'Carbon Trust Ltd',
    description: 'Independent energy and carbon specialists providing LCA, renewable energy advisory, and emissions reduction strategies.',
    category: ['LCA', 'Renewable Energy', 'Carbon Reduction'],
    region: 'Europe',
    country: 'UK',
    companySize: 'enterprise',
    sector: ['Energy', 'Manufacturing', 'Finance'],
    languages: ['English'],
    verified: true,
    platformActive: '2026-04-09T09:00:00Z',
    responseRate: 85,
    avgResponseDays: 2.1,
    rfpsCompleted: 312,
    rating: 4.6,
    reviewCount: 67,
    sustainabilityCredentials: {
      ecovadisScore: 75,
      ecovadisRating: 'gold',
      bCorp: false,
      sbtiStatus: 'validated',
      iso14001: true,
      carbonNeutral: true,
      emissionsIntensity: 9,
      emissionsIntensityLabel: 'low',
      netZeroYear: 2030,
    },
  },
  {
    id: 'dir-005',
    name: 'Sustainable Supply Solutions',
    description: 'Supply chain experts delivering supplier engagement, risk assessment, and sustainability mapping across complex networks.',
    category: ['Supply Chain', 'Supplier Engagement', 'Risk Assessment'],
    region: 'Asia Pacific',
    country: 'Singapore',
    companySize: 'mid-market',
    sector: ['FMCG', 'Manufacturing', 'Electronics'],
    languages: ['English', 'Mandarin', 'Japanese'],
    verified: true,
    platformActive: '2026-04-08T11:30:00Z',
    responseRate: 79,
    avgResponseDays: 2.5,
    rfpsCompleted: 134,
    rating: 4.5,
    reviewCount: 35,
    sustainabilityCredentials: {
      ecovadisScore: 63,
      ecovadisRating: 'silver',
      sbtiStatus: 'committed',
      emissionsIntensity: 15,
      emissionsIntensityLabel: 'medium',
      netZeroYear: 2040,
    },
  },
  {
    id: 'dir-006',
    name: 'ESG Innovations',
    description: 'Technology-enabled ESG reporting, data collection, and performance tracking platform specialists.',
    category: ['ESG Reporting', 'Data Technology', 'Performance Tracking'],
    region: 'North America',
    country: 'USA',
    companySize: 'mid-market',
    sector: ['Technology', 'Finance', 'Corporate Services'],
    languages: ['English'],
    verified: true,
    platformActive: '2026-04-09T15:00:00Z',
    responseRate: 91,
    avgResponseDays: 1.3,
    rfpsCompleted: 98,
    rating: 4.7,
    reviewCount: 22,
    sustainabilityCredentials: {
      ecovadisScore: 68,
      ecovadisRating: 'silver',
      bCorp: true,
      iso14001: false,
      emissionsIntensity: 18,
      emissionsIntensityLabel: 'medium',
      netZeroYear: 2045,
    },
  },
  {
    id: 'dir-007',
    name: 'Nature-Based Solutions Group',
    description: 'Specialists in nature-based climate solutions, biodiversity offsetting, and regenerative agriculture transition.',
    category: ['Nature-Based Solutions', 'Biodiversity', 'Climate Mitigation'],
    region: 'South America',
    country: 'Brazil',
    companySize: 'sme',
    sector: ['Agriculture', 'Food & Beverage', 'Real Estate'],
    languages: ['Portuguese', 'English', 'Spanish'],
    verified: true,
    platformActive: '2026-04-06T08:20:00Z',
    responseRate: 76,
    avgResponseDays: 3.2,
    rfpsCompleted: 54,
    rating: 4.4,
    reviewCount: 12,
    sustainabilityCredentials: {
      ecovadisScore: 48,
      ecovadisRating: 'bronze',
      sbtiStatus: 'committed',
      emissionsIntensity: 22,
      emissionsIntensityLabel: 'high',
      netZeroYear: 2050,
    },
  },
  {
    id: 'dir-008',
    name: 'ClimateMetrics Pro',
    description: 'Advanced carbon accounting platform and advisory for complex multi-entity, multi-jurisdictional organizations.',
    category: ['Carbon Accounting', 'Multi-Entity Reporting', 'Scope 3'],
    region: 'Europe',
    country: 'Germany',
    companySize: 'mid-market',
    sector: ['Energy', 'Manufacturing', 'Transportation'],
    languages: ['English', 'German', 'French'],
    verified: true,
    platformActive: '2026-04-09T12:00:00Z',
    responseRate: 87,
    avgResponseDays: 1.6,
    rfpsCompleted: 167,
    rating: 4.6,
    reviewCount: 44,
    sustainabilityCredentials: {
      ecovadisScore: 74,
      ecovadisRating: 'gold',
      bCorp: false,
      sbtiStatus: 'validated',
      iso14001: true,
      emissionsIntensity: 7,
      emissionsIntensityLabel: 'low',
      netZeroYear: 2035,
    },
  },
]

export type DirectoryFilters = {
  search?: string
  category?: string
  region?: string
  companySize?: string
  // sustainability
  certifications?: Set<string>
  emissionsIntensity?: string
  netZeroOnly?: boolean
}

function certMatchesDirectory(supplier: DirectorySupplier, cert: string): boolean {
  const c = supplier.sustainabilityCredentials
  switch (cert) {
    case 'bcorp':          return !!c.bCorp
    case 'sbti-val':       return c.sbtiStatus === 'validated'
    case 'sbti-com':       return c.sbtiStatus === 'committed'
    case 'iso14001':       return !!c.iso14001
    case 'carbonneutral':  return !!c.carbonNeutral
    case 'ecovadis-gold':  return c.ecovadisRating === 'gold'
    case 'ecovadis-silver':return c.ecovadisRating === 'silver'
    case 'ecovadis-bronze':return c.ecovadisRating === 'bronze'
    default:               return false
  }
}

export function filterDirectorySuppliers(
  suppliers: DirectorySupplier[],
  filters: DirectoryFilters
): DirectorySupplier[] {
  return suppliers.filter(supplier => {
    if (filters.search) {
      const search = filters.search.toLowerCase()
      if (!supplier.name.toLowerCase().includes(search) && !supplier.description.toLowerCase().includes(search)) {
        return false
      }
    }

    if (filters.category && !supplier.category.includes(filters.category)) {
      return false
    }

    if (filters.region && supplier.region !== filters.region) {
      return false
    }

    if (filters.companySize && supplier.companySize !== filters.companySize) {
      return false
    }

    if (filters.certifications && filters.certifications.size > 0) {
      const allMatch = [...filters.certifications].every(cert => certMatchesDirectory(supplier, cert))
      if (!allMatch) return false
    }

    if (filters.emissionsIntensity && supplier.sustainabilityCredentials.emissionsIntensityLabel !== filters.emissionsIntensity) {
      return false
    }

    if (filters.netZeroOnly && !supplier.sustainabilityCredentials.netZeroYear) {
      return false
    }

    return true
  })
}

export const DIRECTORY_CATEGORIES = [
  'Scope 3',
  'SBTi',
  'Carbon Accounting',
  'Circular Economy',
  'CSRD',
  'LCA',
  'Renewable Energy',
  'Supply Chain',
  'ESG Reporting',
  'Biodiversity',
]

export const DIRECTORY_REGIONS = [
  'Europe',
  'North America',
  'Asia Pacific',
  'South America',
  'Africa',
]

export const DIRECTORY_COMPANY_SIZES = [
  { value: 'sme', label: 'SME (< 250 employees)' },
  { value: 'mid-market', label: 'Mid-market (250-2,000)' },
  { value: 'enterprise', label: 'Enterprise (> 2,000)' },
]

export const DIRECTORY_ECOVADIS_RATINGS = [
  { value: 'gold', label: 'Gold (73+)' },
  { value: 'silver', label: 'Silver (58+)' },
  { value: 'bronze', label: 'Bronze (45+)' },
]

export const EMISSIONS_INTENSITY_LEVELS = [
  { value: 'low', label: 'Low (< 10 tCO2e/£M)' },
  { value: 'medium', label: 'Medium (10-20)' },
  { value: 'high', label: 'High (> 20)' },
]
