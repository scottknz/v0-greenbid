import type { 
  RFPTemplate, 
  RFPDocument, 
  RFPVersion,
  RFPTeamMember,
  RFPTeamRole,
  CompanyBranding, 
  ToneVoiceSettings,
  RFPSectionContent 
} from '@/types/rfp';

// Internal team members available to assign to proposals
export const internalTeamMembers: RFPTeamMember[] = [
  {
    id: 'itm-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    phone: '+44 207 123 4567',
    jobTitle: 'Senior Procurement Manager',
    department: 'Procurement',
    avatarInitials: 'SC',
    role: 'Lead',
    isLead: true,
  },
  {
    id: 'itm-2',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    phone: '+44 207 123 4568',
    jobTitle: 'Finance Analyst',
    department: 'Finance',
    avatarInitials: 'JW',
    role: 'Reviewer',
    isLead: false,
  },
  {
    id: 'itm-3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: '+44 207 123 4569',
    jobTitle: 'Sustainability Officer',
    department: 'Sustainability',
    avatarInitials: 'ER',
    role: 'Approver',
    isLead: false,
  },
  {
    id: 'itm-4',
    name: 'Michael Park',
    email: 'michael.park@company.com',
    phone: '+44 207 123 4570',
    jobTitle: 'Legal Counsel',
    department: 'Legal',
    avatarInitials: 'MP',
    role: 'Reviewer',
    isLead: false,
  },
  {
    id: 'itm-5',
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    jobTitle: 'Operations Manager',
    department: 'Operations',
    avatarInitials: 'LW',
    role: 'Observer',
    isLead: false,
  },
  {
    id: 'itm-6',
    name: 'David Thompson',
    email: 'david.thompson@company.com',
    jobTitle: 'IT Director',
    department: 'Technology',
    avatarInitials: 'DT',
    role: 'Observer',
    isLead: false,
  },
];

// Generic RFP Template
export const genericTemplate: RFPTemplate = {
  id: 'template-generic',
  name: 'Generic RFP Template',
  description: 'A comprehensive template suitable for most procurement needs',
  isDefault: true,
  sections: [
    {
      type: 'cover',
      title: 'Cover Page',
      defaultContent: '',
      required: true,
      order: 1,
      aiPromptHint: 'Generate a professional cover page with the RFP title, reference number, issuing organization, and date.',
    },
    {
      type: 'toc',
      title: 'Table of Contents',
      defaultContent: '',
      required: true,
      order: 2,
      aiPromptHint: 'Auto-generate table of contents from document headings.',
    },
    {
      type: 'executive_summary',
      title: 'Executive Summary',
      defaultContent: '<h2>1. Executive Summary</h2><p>Provide a brief overview of the procurement need and objectives.</p>',
      required: true,
      order: 3,
      aiPromptHint: 'Write a concise executive summary covering the purpose of this RFP, key requirements, and expected outcomes. Keep it to 2-3 paragraphs.',
    },
    {
      type: 'company_background',
      title: 'Company Background',
      defaultContent: '<h2>2. Company Background</h2><p>Information about the issuing organization.</p>',
      required: true,
      order: 4,
      aiPromptHint: 'Describe the company background, mission, size, and relevant context for this procurement.',
    },
    {
      type: 'scope_of_work',
      title: 'Scope of Work',
      defaultContent: '<h2>3. Scope of Work</h2><p>Detailed description of the work to be performed.</p>',
      required: true,
      order: 5,
      aiPromptHint: 'Detail the specific deliverables, services, or products required. Include objectives, expected outcomes, and any constraints.',
    },
    {
      type: 'technical_requirements',
      title: 'Technical Requirements',
      defaultContent: '<h2>4. Technical Requirements</h2><p>Specifications and standards that must be met.</p>',
      required: true,
      order: 6,
      aiPromptHint: 'List all technical specifications, standards, certifications, and compliance requirements.',
    },
    {
      type: 'submission_requirements',
      title: 'Submission Requirements',
      defaultContent: '<h2>5. Submission Requirements</h2><p>What suppliers must include in their proposals.</p>',
      required: true,
      order: 7,
      aiPromptHint: 'Specify what documents, formats, and information suppliers must include in their proposal submission.',
    },
    {
      type: 'evaluation_criteria',
      title: 'Evaluation Criteria',
      defaultContent: '<h2>6. Evaluation Criteria</h2><p>How proposals will be assessed and scored.</p>',
      required: true,
      order: 8,
      aiPromptHint: 'Define the evaluation criteria, weightings, and scoring methodology for assessing proposals.',
    },
    {
      type: 'timeline_milestones',
      title: 'Timeline & Milestones',
      defaultContent: '<h2>7. Timeline & Milestones</h2><p>Key dates and project milestones.</p>',
      required: true,
      order: 9,
      aiPromptHint: 'Include all key dates: submission deadline, Q&A period, evaluation timeline, award date, and project milestones.',
    },
    {
      type: 'terms_conditions',
      title: 'Terms & Conditions',
      defaultContent: '<h2>8. Terms & Conditions</h2><p>Legal and contractual requirements.</p>',
      required: true,
      order: 10,
      aiPromptHint: 'Include standard terms and conditions, payment terms, confidentiality requirements, and legal provisions.',
    },
    {
      type: 'appendices',
      title: 'Appendices',
      defaultContent: '<h2>9. Appendices</h2><p>Supporting documents and additional information.</p>',
      required: false,
      order: 11,
      aiPromptHint: 'Reference any attached documents, forms, or additional materials.',
    },
  ],
};

// Available templates
export const rfpTemplates: RFPTemplate[] = [
  genericTemplate,
  {
    id: 'template-carbon-accounting',
    name: 'Carbon Accounting RFP',
    description: 'Specialized template for sourcing carbon accounting, emissions inventory, and Scope 1, 2, and 3 quantification services. Ideal for organizations establishing or validating their greenhouse gas emissions baseline.',
    isDefault: false,
    sections: [
      {
        type: 'cover',
        title: 'Cover Page',
        defaultContent: '',
        required: true,
        order: 1,
        aiPromptHint: 'Generate a professional cover page with the RFP title, reference number, issuing organization, and date.',
      },
      {
        type: 'toc',
        title: 'Table of Contents',
        defaultContent: '',
        required: true,
        order: 2,
        aiPromptHint: 'Auto-generate table of contents from document headings.',
      },
      {
        type: 'executive_summary',
        title: 'Executive Summary',
        defaultContent: '<h2>1. Executive Summary</h2><p>Describe the organization\'s carbon accounting objectives, including scope (Scope 1, 2, and/or 3 emissions), geographic boundaries, organizational boundaries, and baseline year. Clarify whether this is initial quantification, third-party assurance, or ongoing inventory management.</p>',
        required: true,
        order: 3,
        aiPromptHint: 'Write a concise executive summary of the carbon accounting engagement, including which emission scopes will be calculated and the intended use (compliance, voluntary commitment, SBTi validation).',
      },
      {
        type: 'company_background',
        title: 'Company Background & Sustainability Context',
        defaultContent: '<h2>2. Company Background</h2><p>Provide company overview, industry sector, size, operational footprint, existing sustainability initiatives, and any prior emissions quantifications. Explain current state of carbon data collection and management systems.</p>',
        required: true,
        order: 4,
        aiPromptHint: 'Describe the company\'s industry, operations, and existing carbon management maturity to help suppliers understand the engagement context.',
      },
      {
        type: 'scope_of_work',
        title: 'Scope of Work: Emissions Quantification',
        defaultContent: '<h2>3. Scope of Work</h2><p>Detail which emission scopes must be calculated (Scope 1: Direct emissions; Scope 2: Purchased electricity/steam; Scope 3: Value chain). Specify boundary-setting approach (equity share, financial control, operational control). Include activities like energy consumption mapping, transportation emissions, waste, business travel, and supply chain assessment.</p>',
        required: true,
        order: 5,
        aiPromptHint: 'Outline which emission categories and scopes must be included, data collection methods (spend-based, activity-based, etc.), and any exclusions or assumptions.',
      },
      {
        type: 'technical_requirements',
        title: 'Technical Requirements & Methodology',
        defaultContent: '<h2>4. Technical Requirements</h2><p>Specify required methodologies (GHG Protocol Corporate Standard, ISO 14064, Bilan Carbone, etc.). Define acceptable emission factors (IPCC AR5, national databases, etc.), data collection and documentation standards, assurance level (limited vs. reasonable), and output format. Specify precision requirements and uncertainty handling.</p>',
        required: true,
        order: 6,
        aiPromptHint: 'List technical standards, emission factor databases, quality assurance requirements, and reporting standards (ISO 14064-3 assurance, GHG Protocol verification).',
      },
      {
        type: 'data_requirements',
        title: 'Data Requirements & Supplier Responsibilities',
        defaultContent: '<h2>5. Data Requirements</h2><p>Specify the data to be provided by the organization (energy bills, fuel consumption, transportation logs, waste manifests, employee headcount for business travel, supplier spend data by category). Define data quality expectations, lag time for historical data, and ongoing data collection responsibilities.',
        required: true,
        order: 7,
        aiPromptHint: 'Detail what primary data the organization will provide versus what the supplier must source or estimate.',
      },
      {
        type: 'deliverables',
        title: 'Deliverables & Documentation',
        defaultContent: '<h2>6. Deliverables</h2><p>Define expected outputs: detailed emissions inventory spreadsheet with emission calculations by scope/category, methodology documentation, assumptions and exclusions list, sensitivity analysis for key assumptions, GHG verification/assurance report (if applicable), and recommendations for emissions reduction.</p>',
        required: true,
        order: 8,
        aiPromptHint: 'Specify all deliverables, formats (Excel, PDF, custom software), documentation level, and post-delivery support.',
      },
      {
        type: 'evaluation_criteria',
        title: 'Evaluation Criteria',
        defaultContent: '<h2>7. Evaluation Criteria</h2><p>Evaluate proposals on: relevant experience with similar organizations/industries, team expertise in carbon accounting and GHG Protocol, proposed methodology and quality assurance approach, data management and cybersecurity protocols, pricing and timeline, and references from prior engagements.</p>',
        required: true,
        order: 9,
        aiPromptHint: 'Define scoring criteria for carbon accounting expertise, methodological rigor, cost efficiency, and ability to deliver on timeline.',
      },
      {
        type: 'timeline_milestones',
        title: 'Timeline & Key Milestones',
        defaultContent: '<h2>8. Timeline</h2><p>Include submission deadline, Q&A period closure, evaluation period, award date, data kickoff, data collection completion, initial findings presentation, final reporting, and project completion.</p>',
        required: true,
        order: 10,
        aiPromptHint: 'Establish key dates including data collection periods, interim reviews, and final delivery of the carbon inventory.',
      },
      {
        type: 'terms_conditions',
        title: 'Terms, Conditions & Compliance',
        defaultContent: '<h2>9. Terms & Conditions</h2><p>Include confidentiality and data security requirements, intellectual property ownership of methodologies and reports, insurance and liability provisions, contract duration and renewal options, and compliance with relevant regulations (GDPR for EU organizations, data residency requirements).</p>',
        required: true,
        order: 11,
        aiPromptHint: 'Define payment terms, confidentiality obligations, data handling protocols, and insurance requirements.',
      },
    ],
  },
  {
    id: 'template-climate-risk',
    name: 'Climate Risk Assessment RFP',
    description: 'Tailored template for climate risk and resilience evaluations. Designed for organizations assessing physical and transition climate risks, implementing adaptation strategies, and integrating climate considerations into business planning.',
    isDefault: false,
    sections: [
      {
        type: 'cover',
        title: 'Cover Page',
        defaultContent: '',
        required: true,
        order: 1,
        aiPromptHint: 'Generate a professional cover page with the RFP title, reference number, issuing organization, and date.',
      },
      {
        type: 'toc',
        title: 'Table of Contents',
        defaultContent: '',
        required: true,
        order: 2,
        aiPromptHint: 'Auto-generate table of contents from document headings.',
      },
      {
        type: 'executive_summary',
        title: 'Executive Summary',
        defaultContent: '<h2>1. Executive Summary</h2><p>Describe the organization\'s climate risk assessment objectives, including identification of critical facilities/operations, supply chain vulnerabilities, and climate scenarios to be analyzed (1.5°C, 2°C, 3°C warming scenarios). Specify geographic focus and relevant time horizons (near-term, mid-century).</p>',
        required: true,
        order: 3,
        aiPromptHint: 'Summarize the organization\'s climate risk priorities, including which physical and transition risks are most material to the business.',
      },
      {
        type: 'company_background',
        title: 'Company Background & Operational Context',
        defaultContent: '<h2>2. Company Background</h2><p>Provide overview of company sector, geographic operations, supply chain structure, key facilities, and critical assets. Describe existing climate risk management practices and any prior climate scenario analyses.</p>',
        required: true,
        order: 4,
        aiPromptHint: 'Describe the organization\'s geographic footprint, operational dependencies, and existing climate risk awareness.',
      },
      {
        type: 'scope_of_work',
        title: 'Scope of Work: Climate Risk Assessment',
        defaultContent: '<h2>3. Scope of Work</h2><p>Define assessment scope: physical risks (acute hazards like flooding, hurricanes; chronic hazards like drought, heat stress), transition risks (policy/regulation, market shifts, technology disruption), and financial impact quantification. Include geographic focus areas, critical facilities, supply chain tier depth, and time horizons (2030, 2050).</p>',
        required: true,
        order: 5,
        aiPromptHint: 'Specify which physical and transition climate risks should be assessed, geographic focus, and financial impact modeling expectations.',
      },
      {
        type: 'technical_requirements',
        title: 'Technical Requirements & Methodology',
        defaultContent: '<h2>4. Technical Requirements</h2><p>Specify methodologies (TCFD framework, ISO 14090 risk management, UN Global Compact, science-based scenarios from IPCC). Define climate scenarios to model (RCP 4.5, RCP 8.5, SSP scenarios). Specify data sources for climate projections, exposure mapping tools, and financial impact quantification methods. Define output formats and confidence levels.</p>',
        required: true,
        order: 6,
        aiPromptHint: 'Define climate risk framework, scenario analysis approaches, and financial impact measurement methodologies.',
      },
      {
        type: 'risk_analysis',
        title: 'Risk Analysis Depth & Deliverables',
        defaultContent: '<h2>5. Risk Analysis & Deliverables</h2><p>Specify depth of analysis for each facility/business unit: hazard mapping, exposure assessment, vulnerability analysis, and consequence modeling. Define required deliverables: risk heatmaps, business impact analysis by climate scenario, facility-level risk rankings, and recommended adaptation/mitigation strategies with implementation roadmap.</p>',
        required: true,
        order: 7,
        aiPromptHint: 'Detail the risk assessment process, geospatial analysis requirements, and expected output including risk matrices and adaptation recommendations.',
      },
      {
        type: 'adaptation_strategy',
        title: 'Adaptation & Resilience Recommendations',
        defaultContent: '<h2>6. Adaptation Strategy</h2><p>Require assessment of adaptation options and resilience-building measures. Include cost-benefit analysis of adaptation investments, timeline for implementation, co-benefits (e.g., energy efficiency improving heat resilience), and integration with existing capital planning processes.</p>',
        required: true,
        order: 8,
        aiPromptHint: 'Specify expectations for recommending adaptation measures, investment requirements, and quantifying resilience benefits.',
      },
      {
        type: 'evaluation_criteria',
        title: 'Evaluation Criteria',
        defaultContent: '<h2>7. Evaluation Criteria</h2><p>Evaluate on: climate science expertise and track record with similar industries, technical tools and data sources (climate model access, geospatial capabilities), experience with TCFD/science-based scenario analysis, ability to integrate into business strategy/capital planning, cost efficiency, and timeline feasibility.</p>',
        required: true,
        order: 9,
        aiPromptHint: 'Define scoring criteria for climate science expertise, technical capability, business integration skills, and cost.',
      },
      {
        type: 'timeline_milestones',
        title: 'Timeline & Milestones',
        defaultContent: '<h2>8. Timeline</h2><p>Include submission deadline, Q&A closure, selection, project kickoff, data collection completion, interim findings review, scenario modeling completion, final assessment report, and implementation roadmap development.</p>',
        required: true,
        order: 10,
        aiPromptHint: 'Establish key dates for data gathering, scenario modeling, interim reviews, and final reporting.',
      },
      {
        type: 'terms_conditions',
        title: 'Terms & Conditions',
        defaultContent: '<h2>9. Terms & Conditions</h2><p>Include confidentiality of risk findings, data security and climate projections access, intellectual property for methodologies, liability and insurance provisions, and contract term with potential renewal for scenario updates as climate science evolves.</p>',
        required: true,
        order: 11,
        aiPromptHint: 'Define confidentiality, data handling, liability, and contract terms for ongoing scenario updates.',
      },
    ],
  },
  {
    id: 'template-financial-compliance',
    name: 'Financial Compliance RFP',
    description: 'Specialized template for ESG/sustainability financial reporting, SEC disclosure compliance, and investor relations services. Applicable for organizations navigating ISSB (IFRS S1 & S2), SEC rules, and other financial disclosure frameworks.',
    isDefault: false,
    sections: [
      {
        type: 'cover',
        title: 'Cover Page',
        defaultContent: '',
        required: true,
        order: 1,
        aiPromptHint: 'Generate a professional cover page with the RFP title, reference number, issuing organization, and date.',
      },
      {
        type: 'toc',
        title: 'Table of Contents',
        defaultContent: '',
        required: true,
        order: 2,
        aiPromptHint: 'Auto-generate table of contents from document headings.',
      },
      {
        type: 'executive_summary',
        title: 'Executive Summary',
        defaultContent: '<h2>1. Executive Summary</h2><p>Describe the organization\'s need for ESG/sustainability financial reporting support, including applicable regulatory frameworks (SEC climate disclosure rules, ISSB standards, CSRD in EU, California SB 253/261). Specify whether this is for initial compliance, ongoing reporting, assurance engagement, or investor relations support.</p>',
        required: true,
        order: 3,
        aiPromptHint: 'Summarize the compliance frameworks the organization must navigate and the level of support required.',
      },
      {
        type: 'company_background',
        title: 'Company Background & Regulatory Context',
        defaultContent: '<h2>2. Company Background</h2><p>Provide company overview, sector, market cap (if public), headquarters location, reporting jurisdiction, and stock exchange listing. Describe existing sustainability disclosure practices, previous audits or assurance engagements, and current internal ESG/sustainability team structure.</p>',
        required: true,
        order: 4,
        aiPromptHint: 'Describe the organization\'s size, jurisdictions, regulatory obligations, and existing sustainability reporting maturity.',
      },
      {
        type: 'scope_of_work',
        title: 'Scope of Work: Financial Compliance & Reporting',
        defaultContent: '<h2>3. Scope of Work</h2><p>Define compliance frameworks to address: SEC climate disclosure rules (if US-listed), ISSB standards (IFRS S1 General, IFRS S2 Climate), CSRD (if EU entity), California disclosure rules (if material). Specify whether services include gap assessment, policy development, data architecture design, content drafting, internal controls design, external assurance coordination, and investor relations support.</p>',
        required: true,
        order: 5,
        aiPromptHint: 'Outline which regulatory frameworks must be addressed and what implementation support is required.',
      },
      {
        type: 'technical_requirements',
        title: 'Technical Requirements & Frameworks',
        defaultContent: '<h2>4. Technical Requirements</h2><p>Specify required expertise: ISSB standard interpretation, SEC rules compliance, CSRD implementation, double materiality assessment methodology, financial impact quantification, climate scenario financial impact (TCFD), supply chain scope 3 accounting, and data architecture for governance and reporting systems. Define internal control framework requirements (COSO, specific assurance standards).</p>',
        required: true,
        order: 6,
        aiPromptHint: 'Define which standards and frameworks require expert interpretation, and what level of internal controls documentation is needed.',
      },
      {
        type: 'materiality_assessment',
        title: 'Materiality & Risk Assessment',
        defaultContent: '<h2>5. Materiality & Risk Assessment</h2><p>Require comprehensive double materiality assessment (financial materiality to investors + impact materiality to stakeholders). Identify ESG topics material to financial reporting. Include impact assessment of climate risks, transition risks, governance risks on financial performance. Define materiality thresholds and determine financial disclosure obligations for each risk area.</p>',
        required: true,
        order: 7,
        aiPromptHint: 'Specify how double materiality should be assessed and integrated into financial disclosure planning.',
      },
      {
        type: 'reporting_disclosure',
        title: 'Disclosure Development & Documentation',
        defaultContent: '<h2>6. Disclosure Development</h2><p>Services should include: drafting climate-related financial disclosures (TCFD format for SEC/ISSB), governance and risk management descriptions, strategy alignment with financial plans, quantitative financial impact metrics, policy and internal control documentation, management discussion & analysis (MD&A) climate sections, and investor deck materials.</p>',
        required: true,
        order: 8,
        aiPromptHint: 'Define what disclosures must be drafted and what supporting documentation is required.',
      },
      {
        type: 'assurance_readiness',
        title: 'Assurance Readiness & Internal Controls',
        defaultContent: '<h2>7. Assurance Readiness</h2><p>Design internal controls for ESG data collection, reporting processes, and financial statement linkage. Document control procedures and implement systems to ensure year-over-year data consistency and audit trail. Coordinate with external auditors and assurance providers to prepare for third-party verification of disclosed metrics and climate financial impacts.</p>',
        required: true,
        order: 9,
        aiPromptHint: 'Outline the internal controls framework and readiness for external assurance of ESG financial disclosures.',
      },
      {
        type: 'evaluation_criteria',
        title: 'Evaluation Criteria',
        defaultContent: '<h2>8. Evaluation Criteria</h2><p>Evaluate on: deep expertise in applicable frameworks (ISSB, SEC, CSRD), track record with companies in similar sectors/sizes, ability to integrate with external audit and investor relations teams, understanding of internal control design and assurance requirements, pricing and resource availability, and client references from recent successful engagements.</p>',
        required: true,
        order: 10,
        aiPromptHint: 'Define scoring criteria for regulatory expertise, sector experience, internal control design skills, and cross-functional collaboration ability.',
      },
      {
        type: 'timeline_milestones',
        title: 'Timeline & Key Milestones',
        defaultContent: '<h2>9. Timeline</h2><p>Include submission deadline, Q&A closure, selection, gap assessment completion, materiality assessment, control design, disclosure drafting phases, internal review cycles, external audit coordination, and final disclosure publication timeline aligned with regulatory filing deadlines.</p>',
        required: true,
        order: 11,
        aiPromptHint: 'Establish key dates tied to regulatory filing deadlines and internal review cycles.',
      },
      {
        type: 'terms_conditions',
        title: 'Terms & Conditions',
        defaultContent: '<h2>10. Terms & Conditions</h2><p>Include strict confidentiality for material non-public information (MNPI), data security and restricted access protocols, audit committee coordination requirements, insurance and liability provisions (E&O insurance minimums), contract term with provisions for updated guidance interpretations, and availability for Q&A from auditors and investors.</p>',
        required: true,
        order: 12,
        aiPromptHint: 'Define confidentiality obligations for sensitive financial information, audit coordination, and liability coverage.',
      },
    ],
  },
];

// Default company branding (to be overridden from settings)
export const defaultBranding: CompanyBranding = {
  companyName: 'Your Company Name',
  logoUrl: null,
  primaryColor: '#16A34A',
  secondaryColor: '#111827',
  footerText: 'Confidential - For Authorized Use Only',
  headerText: 'Request for Proposal',
};

// Default tone/voice settings
export const defaultToneVoice: ToneVoiceSettings = {
  toneFile: null,
  formality: 'professional',
  industry: 'General',
  customInstructions: '',
};

// Helper to create empty RFP document from template
export function createRFPFromTemplate(
  template: RFPTemplate,
  projectInfo: Partial<RFPDocument['projectInfo']>
): RFPDocument {
  const now = new Date().toISOString();
  const sections: RFPSectionContent[] = template.sections.map((section, index) => ({
    id: `section-${section.type}`,
    type: section.type,
    title: section.title,
    number: `${index + 1}`,
    content: section.defaultContent,
    aiGenerated: false,
    aiTextStatus: 'pending',
    lastEditedBy: 'user',
    lastEditedAt: now,
    isHighlighted: false,
  }));

  return {
    id: `rfp-${Date.now()}`,
    title: projectInfo.projectName || 'Untitled RFP',
    referenceId: `RFP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    status: 'draft',
    templateId: template.id,
    projectInfo: {
      projectName: '',
      category: '',
      description: '',
      expectedBudget: 0,
      budgetCurrency: 'USD',
      budgetFlexibility: 'flexible',
      submissionDeadline: '',
      qaStartDate: '',
      qaEndDate: '',
      expectedStartDate: '',
      expectedCompletionDate: '',
      milestones: [],
      primaryContact: '',
      primaryContactEmail: '',
      department: '',
      ...projectInfo,
    },
    sections,
    aiSummary: '',
    currentVersion: 1,
    versions: [],
    createdAt: now,
    updatedAt: now,
    createdBy: 'Current User',
    approvalRequired: true,
    approvalStatus: null,
    approvedBy: null,
    approvedAt: null,
  };
}

// Sample draft RFP for testing
export const sampleDraftRFP: RFPDocument = createRFPFromTemplate(genericTemplate, {
  projectName: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
  category: 'Carbon & Emissions',
  description: 'Seeking a data consultancy to map, calculate, and assure all 15 categories of our Scope 3 emissions for FY25 using spend-based and average-data methodologies.',
  expectedBudget: 450000,
  budgetCurrency: 'USD',
  budgetFlexibility: 'flexible',
  submissionDeadline: '2026-05-15',
  qaStartDate: '2026-04-15',
  qaEndDate: '2026-04-30',
  expectedStartDate: '2026-06-01',
  expectedCompletionDate: '2026-12-31',
  primaryContact: 'Emma Thompson',
  primaryContactEmail: 'emma.thompson@company.com',
  department: 'Sustainability',
  milestones: [
    { id: 'm1', name: 'Data Collection Complete', dueDate: '2026-07-15', description: 'All spend data and operational data collected' },
    { id: 'm2', name: 'Preliminary Analysis', dueDate: '2026-08-30', description: 'Initial emissions calculations completed' },
    { id: 'm3', name: 'Assurance Review', dueDate: '2026-10-15', description: 'Third-party verification and assurance' },
    { id: 'm4', name: 'Final Report Delivery', dueDate: '2026-12-01', description: 'Final emissions report with recommendations' },
    { id: 'm5', name: 'Stakeholder Presentation', dueDate: '2026-12-31', description: 'Results presented to executive team' },
  ],
});

// Categories for RFP projects aligned with sustainability
export const rfpCategories = [
  'Scope 3 / Value Chain',
  'Target Setting (SBTi)',
  'Regulatory Reporting (ISSB/CSRD)',
  'California Disclosures (SB253/261)',
  'Life Cycle Assessment (LCA)',
  'Financed Emissions (PCAF/SFDR)',
  'Renewable Energy (PPA/VPPA)',
  'Certifications (ISO/LEED)',
  'Environmental Impact (EIA)',
];

// In-memory store for RFPs (mock database)
const rfpStore: Map<string, RFPDocument> = new Map();

// Initialize with sample RFP
rfpStore.set(sampleDraftRFP.id, sampleDraftRFP);

/**
 * Get an RFP by ID
 */
export function getRFPById(id: string): RFPDocument | null {
  return rfpStore.get(id) || null;
}

/**
 * Update an existing RFP (or save if not exists)
 */
export function updateRFP(id: string, updates: Partial<RFPDocument>): RFPDocument | null {
  const existing = rfpStore.get(id);
  
  // If the RFP doesn't exist in the store, save the updates as a new RFP
  if (!existing) {
    if (updates.id && updates.title) {
      const newRfp = updates as RFPDocument;
      rfpStore.set(newRfp.id, newRfp);
      return newRfp;
    }
    return null;
  }
  
  const updated: RFPDocument = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  rfpStore.set(id, updated);
  return updated;
}

/**
 * Create a new version of an RFP
 * @param id - The RFP ID
 * @param rfpOrSummary - Either the full RFP document or a changes summary string
 */
export function createRFPVersion(id: string, rfpOrSummary: RFPDocument | string): RFPDocument | null {
  // Handle both calling conventions: (id, rfpDocument) and (id, summaryString)
  let existing = rfpStore.get(id);
  let changesSummary = 'Version saved';
  
  if (typeof rfpOrSummary === 'object') {
    // Called with (id, rfpDocument) - save the RFP first if not in store
    if (!existing) {
      rfpStore.set(id, rfpOrSummary);
      existing = rfpOrSummary;
    }
    changesSummary = `Version ${existing.currentVersion} saved`;
  } else {
    changesSummary = rfpOrSummary;
  }
  
  if (!existing) return null;
  
  const newVersion: RFPVersion = {
    version: existing.currentVersion,
    savedAt: new Date().toISOString(),
    savedBy: 'Current User',
    changesSummary,
    sections: [...existing.sections],
  };
  
  const updated: RFPDocument = {
    ...existing,
    currentVersion: existing.currentVersion + 1,
    versions: [...(existing.versions || []), newVersion],
    updatedAt: new Date().toISOString(),
  };
  
  rfpStore.set(id, updated);
  return updated;
}

/**
 * Save a new RFP to the store
 */
export function saveRFP(rfp: RFPDocument): RFPDocument {
  rfpStore.set(rfp.id, rfp);
  return rfp;
}
