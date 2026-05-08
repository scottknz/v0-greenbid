export type MarketplaceCategory =
  | 'all'
  | 'carbon-climate'
  | 'supply-chain'
  | 'energy-renewables'
  | 'circular-economy'
  | 'esg-compliance'
  | 'consulting-advisory'

export type MarketplaceRegion =
  | 'all'
  | 'europe'
  | 'north-america'
  | 'asia-pacific'
  | 'latin-america'
  | 'middle-east-africa'

export const MARKETPLACE_CATEGORIES: { id: MarketplaceCategory; label: string }[] = [
  { id: 'all', label: 'All Opportunities' },
  { id: 'carbon-climate', label: 'Carbon & Climate' },
  { id: 'supply-chain', label: 'Supply Chain' },
  { id: 'energy-renewables', label: 'Energy & Renewables' },
  { id: 'circular-economy', label: 'Circular Economy' },
  { id: 'esg-compliance', label: 'ESG & Compliance' },
  { id: 'consulting-advisory', label: 'Consulting & Advisory' },
]

export const MARKETPLACE_REGIONS: { id: MarketplaceRegion; label: string }[] = [
  { id: 'all', label: 'All Regions' },
  { id: 'europe', label: 'Europe' },
  { id: 'north-america', label: 'North America' },
  { id: 'asia-pacific', label: 'Asia Pacific' },
  { id: 'latin-america', label: 'Latin America' },
  { id: 'middle-east-africa', label: 'Middle East & Africa' },
]

export interface BuyerCredentials {
  bCorp: boolean
  ecoVadisScore?: number       // 0–100
  emissionsIntensity?: 'Low' | 'Medium' | 'High'
  sector: string
  previousRFPsAwarded: number
  rating: number
  reviewCount: number
  iso14001?: boolean
  scienceBasedTarget?: boolean
}

export interface MarketplaceRFP {
  id: string
  title: string
  summary: string
  buyerCompany: string
  buyerInitials: string
  buyerColor: string           // tailwind bg class for avatar fallback
  category: MarketplaceCategory
  region: MarketplaceRegion
  country: string
  deadline: string
  budget?: string
  estimatedValue?: number
  keyRequirements: string[]
  tags: string[]
  publishedAt: string
  questionsDeadline?: string
  questionsOpen: boolean
  registeredSuppliers: number
  buyerCredentials: BuyerCredentials
  status: 'open' | 'closing-soon' | 'closed'
  featured?: boolean
}

export const mockMarketplaceRFPs: MarketplaceRFP[] = [
  {
    id: 'mkt-001',
    title: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    summary: 'We are seeking a specialist partner to conduct a full Scope 3 emissions inventory across our 14-country supply chain, covering all 15 GHG Protocol categories. The engagement will culminate in a verified emissions report and reduction roadmap.',
    buyerCompany: 'Unilever PLC',
    buyerInitials: 'UL',
    buyerColor: 'bg-blue-600',
    category: 'carbon-climate',
    region: 'europe',
    country: 'United Kingdom',
    deadline: '2026-06-15',
    budget: '£180,000 – £240,000',
    estimatedValue: 210000,
    keyRequirements: [
      'GHG Protocol Scope 3 Standard expertise',
      'Experience with FMCG supply chains',
      'ISO 14064 verification capability',
      'Data platform integration (SAP Ariba)',
    ],
    tags: ['Scope 3', 'GHG Protocol', 'Supply Chain', 'ISO 14064'],
    publishedAt: '2026-04-01',
    questionsDeadline: '2026-05-15',
    questionsOpen: true,
    registeredSuppliers: 12,
    buyerCredentials: {
      bCorp: false,
      ecoVadisScore: 78,
      emissionsIntensity: 'Medium',
      sector: 'Consumer Goods',
      previousRFPsAwarded: 34,
      rating: 4.6,
      reviewCount: 28,
      iso14001: true,
      scienceBasedTarget: true,
    },
    status: 'open',
    featured: true,
  },
  {
    id: 'mkt-002',
    title: 'SBTi Near-Term Target Setting & Validation Programme',
    summary: 'Patagonia requires a consultancy to guide our Science Based Targets initiative (SBTi) near-term target development, covering both Scope 1/2 and Scope 3 reduction pathways aligned to 1.5°C.',
    buyerCompany: 'Patagonia Inc.',
    buyerInitials: 'PA',
    buyerColor: 'bg-amber-700',
    category: 'consulting-advisory',
    region: 'north-america',
    country: 'United States',
    deadline: '2026-05-30',
    budget: '$95,000 – $130,000',
    estimatedValue: 112500,
    keyRequirements: [
      'Certified SBTi validator experience',
      'Apparel or outdoor retail sector knowledge',
      'Stakeholder engagement capability',
      'Previous SBTi submission track record',
    ],
    tags: ['SBTi', '1.5°C', 'Net Zero', 'Scope 1/2/3'],
    publishedAt: '2026-04-05',
    questionsDeadline: '2026-05-01',
    questionsOpen: true,
    registeredSuppliers: 8,
    buyerCredentials: {
      bCorp: true,
      ecoVadisScore: 91,
      emissionsIntensity: 'Low',
      sector: 'Apparel & Outdoor',
      previousRFPsAwarded: 18,
      rating: 4.9,
      reviewCount: 15,
      iso14001: true,
      scienceBasedTarget: true,
    },
    status: 'closing-soon',
    featured: true,
  },
  {
    id: 'mkt-003',
    title: 'Solar PPA Procurement & Due Diligence Advisory',
    summary: 'We are procuring advisory services for a 50MW solar Power Purchase Agreement across our Australian manufacturing sites. The partner will manage site assessment, grid connection, and contract negotiation.',
    buyerCompany: 'BlueScope Steel',
    buyerInitials: 'BS',
    buyerColor: 'bg-slate-700',
    category: 'energy-renewables',
    region: 'asia-pacific',
    country: 'Australia',
    deadline: '2026-07-01',
    budget: 'AUD 75,000 – 110,000',
    estimatedValue: 92000,
    keyRequirements: [
      'Australian energy market (AEMO) expertise',
      'Solar PPA contract negotiation experience',
      'Grid connection due diligence capability',
      'Heavy industry decarbonisation background',
    ],
    tags: ['Solar PPA', 'Renewable Energy', 'AEMO', 'Decarbonisation'],
    publishedAt: '2026-04-10',
    questionsOpen: false,
    registeredSuppliers: 6,
    buyerCredentials: {
      bCorp: false,
      ecoVadisScore: 62,
      emissionsIntensity: 'High',
      sector: 'Steel & Manufacturing',
      previousRFPsAwarded: 9,
      rating: 4.1,
      reviewCount: 7,
      iso14001: true,
      scienceBasedTarget: false,
    },
    status: 'open',
  },
  {
    id: 'mkt-004',
    title: 'Circular Economy Strategy & Packaging Redesign',
    summary: 'Innocent Drinks is seeking a partner to develop our circular economy strategy, focused on eliminating single-use plastics and designing for recyclability across our full packaging portfolio by 2028.',
    buyerCompany: 'Innocent Drinks',
    buyerInitials: 'ID',
    buyerColor: 'bg-green-600',
    category: 'circular-economy',
    region: 'europe',
    country: 'Netherlands',
    deadline: '2026-06-01',
    budget: '€120,000 – €160,000',
    estimatedValue: 140000,
    keyRequirements: [
      'Circular design methodology expertise',
      'FMCG packaging lifecycle assessment',
      'EU Packaging & Packaging Waste Regulation knowledge',
      'Supplier engagement programme design',
    ],
    tags: ['Circular Economy', 'Packaging', 'LCA', 'Plastics'],
    publishedAt: '2026-04-08',
    questionsDeadline: '2026-05-10',
    questionsOpen: true,
    registeredSuppliers: 15,
    buyerCredentials: {
      bCorp: true,
      ecoVadisScore: 85,
      emissionsIntensity: 'Low',
      sector: 'Food & Beverage',
      previousRFPsAwarded: 22,
      rating: 4.8,
      reviewCount: 19,
      iso14001: false,
      scienceBasedTarget: true,
    },
    status: 'open',
    featured: true,
  },
  {
    id: 'mkt-005',
    title: 'ESG Materiality Assessment & Double Materiality CSRD',
    summary: 'We require a specialist to conduct a double materiality assessment aligned to CSRD requirements, covering impact materiality and financial materiality across our operations in Brazil and Mexico.',
    buyerCompany: 'Natura &Co',
    buyerInitials: 'NC',
    buyerColor: 'bg-rose-600',
    category: 'esg-compliance',
    region: 'latin-america',
    country: 'Brazil',
    deadline: '2026-05-20',
    budget: 'R$ 450,000 – 600,000',
    estimatedValue: 85000,
    keyRequirements: [
      'CSRD double materiality methodology',
      'ESRS standards knowledge',
      'Stakeholder engagement in Portuguese and Spanish',
      'LATAM regulatory context experience',
    ],
    tags: ['CSRD', 'Double Materiality', 'ESRS', 'ESG Reporting'],
    publishedAt: '2026-04-03',
    questionsDeadline: '2026-05-01',
    questionsOpen: true,
    registeredSuppliers: 9,
    buyerCredentials: {
      bCorp: true,
      ecoVadisScore: 80,
      emissionsIntensity: 'Medium',
      sector: 'Beauty & Personal Care',
      previousRFPsAwarded: 27,
      rating: 4.7,
      reviewCount: 22,
      iso14001: true,
      scienceBasedTarget: true,
    },
    status: 'closing-soon',
  },
  {
    id: 'mkt-006',
    title: 'Sustainable Supply Chain Risk Assessment – Tier 2 & 3',
    summary: 'Ikea is seeking a partner to map and risk-assess our Tier 2 and 3 supply chain across Southeast Asia, covering deforestation, labour rights, and water stress exposure for 200+ supplier sites.',
    buyerCompany: 'IKEA Group',
    buyerInitials: 'IK',
    buyerColor: 'bg-yellow-500',
    category: 'supply-chain',
    region: 'asia-pacific',
    country: 'Singapore',
    deadline: '2026-08-01',
    budget: '€200,000 – €280,000',
    estimatedValue: 240000,
    keyRequirements: [
      'Tier 2/3 supply chain mapping capability',
      'ESG risk scoring methodology',
      'Southeast Asia supplier audit experience',
      'Deforestation and water risk tools (e.g., Global Forest Watch)',
    ],
    tags: ['Supply Chain Risk', 'Deforestation', 'Water Stress', 'Due Diligence'],
    publishedAt: '2026-04-12',
    questionsDeadline: '2026-06-15',
    questionsOpen: true,
    registeredSuppliers: 20,
    buyerCredentials: {
      bCorp: false,
      ecoVadisScore: 74,
      emissionsIntensity: 'Medium',
      sector: 'Retail & Furniture',
      previousRFPsAwarded: 41,
      rating: 4.4,
      reviewCount: 33,
      iso14001: true,
      scienceBasedTarget: true,
    },
    status: 'open',
  },
  {
    id: 'mkt-007',
    title: 'Carbon Credit Portfolio Strategy & Retirement Plan',
    summary: 'Aramco is seeking advisory on building a voluntary carbon credit portfolio aligned to CORSIA and Article 6.4 mechanisms, to offset residual emissions post-2030 across refinery operations.',
    buyerCompany: 'Saudi Aramco',
    buyerInitials: 'SA',
    buyerColor: 'bg-teal-700',
    category: 'carbon-climate',
    region: 'middle-east-africa',
    country: 'Saudi Arabia',
    deadline: '2026-07-15',
    budget: '$250,000 – $350,000',
    estimatedValue: 300000,
    keyRequirements: [
      'Voluntary Carbon Market expertise (VCS, Gold Standard)',
      'Article 6.4 Paris Agreement mechanism knowledge',
      'CORSIA eligibility assessment capability',
      'Oil & gas sector decarbonisation experience',
    ],
    tags: ['Carbon Credits', 'CORSIA', 'Article 6.4', 'VCM'],
    publishedAt: '2026-04-14',
    questionsOpen: false,
    registeredSuppliers: 11,
    buyerCredentials: {
      bCorp: false,
      ecoVadisScore: 48,
      emissionsIntensity: 'High',
      sector: 'Oil & Gas',
      previousRFPsAwarded: 6,
      rating: 3.8,
      reviewCount: 5,
      iso14001: false,
      scienceBasedTarget: false,
    },
    status: 'open',
  },
  {
    id: 'mkt-008',
    title: 'Green Building Certification & Retrofit Roadmap',
    summary: 'Westpac Banking Corporation is seeking a sustainability consultant to develop a NABERS and Green Star certification strategy across our 85 office buildings in Australia and New Zealand.',
    buyerCompany: 'Westpac Banking Corp',
    buyerInitials: 'WB',
    buyerColor: 'bg-red-700',
    category: 'esg-compliance',
    region: 'asia-pacific',
    country: 'Australia',
    deadline: '2026-06-30',
    budget: 'AUD 180,000 – 220,000',
    estimatedValue: 200000,
    keyRequirements: [
      'NABERS and Green Star accreditation experience',
      'Commercial property retrofit assessment',
      'Financial services sector sustainability context',
      'Portfolio-level certification roadmap capability',
    ],
    tags: ['Green Building', 'NABERS', 'Green Star', 'Real Estate'],
    publishedAt: '2026-04-07',
    questionsDeadline: '2026-05-30',
    questionsOpen: true,
    registeredSuppliers: 13,
    buyerCredentials: {
      bCorp: false,
      ecoVadisScore: 71,
      emissionsIntensity: 'Low',
      sector: 'Financial Services',
      previousRFPsAwarded: 14,
      rating: 4.3,
      reviewCount: 11,
      iso14001: false,
      scienceBasedTarget: true,
    },
    status: 'open',
  },
]
