import type { 
  RFPTemplate, 
  RFPDocument, 
  CompanyBranding, 
  ToneVoiceSettings,
  RFPSectionContent 
} from '@/types/rfp';

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
    id: 'template-it-services',
    name: 'IT Services RFP',
    description: 'Specialized template for IT and technology procurement',
    isDefault: false,
    sections: genericTemplate.sections, // Use same sections for now
  },
  {
    id: 'template-construction',
    name: 'Construction RFP',
    description: 'Template for construction and infrastructure projects',
    isDefault: false,
    sections: genericTemplate.sections,
  },
  {
    id: 'template-professional-services',
    name: 'Professional Services RFP',
    description: 'Template for consulting and professional services',
    isDefault: false,
    sections: genericTemplate.sections,
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
  projectName: 'Sustainable Office Supplies 2026',
  category: 'Office Supplies',
  description: 'Procurement of sustainable and eco-friendly office supplies',
  expectedBudget: 125000,
  budgetCurrency: 'USD',
  budgetFlexibility: 'flexible',
  submissionDeadline: '2026-04-15',
  qaStartDate: '2026-03-15',
  qaEndDate: '2026-03-31',
  expectedStartDate: '2026-05-01',
  expectedCompletionDate: '2026-12-31',
  primaryContact: 'Sarah Chen',
  primaryContactEmail: 'sarah.chen@company.com',
  department: 'Procurement',
  milestones: [
    { id: 'm1', name: 'RFP Published', dueDate: '2026-03-01', description: 'RFP published to suppliers' },
    { id: 'm2', name: 'Q&A Period Ends', dueDate: '2026-03-31', description: 'End of supplier questions' },
    { id: 'm3', name: 'Submission Deadline', dueDate: '2026-04-15', description: 'Final deadline for proposals' },
    { id: 'm4', name: 'Evaluation Complete', dueDate: '2026-04-30', description: 'Evaluation and scoring complete' },
    { id: 'm5', name: 'Contract Award', dueDate: '2026-05-01', description: 'Contract awarded to selected supplier' },
  ],
});

// Categories for RFP projects
export const rfpCategories = [
  'Office Supplies',
  'IT Equipment',
  'Logistics',
  'Energy',
  'Packaging',
  'Services',
  'Transportation',
  'Construction',
  'Consulting',
  'Marketing',
  'Facilities',
  'Manufacturing',
];
