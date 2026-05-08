// RFP Document Types and Interfaces

// Import supplier types (RFPInterest is defined in supplier.ts)
export type { RFPInterest } from './supplier'

export type RFPStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'closed';

// Team member role on an RFP
export type RFPTeamRole = 'Lead' | 'Reviewer' | 'Approver' | 'Observer';

export interface RFPTeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle: string;
  department: string;
  avatarInitials: string;
  role: RFPTeamRole;
  isLead: boolean;
}

export type RFPSectionType = 
  | 'cover'
  | 'toc'
  | 'executive_summary'
  | 'company_background'
  | 'scope_of_work'
  | 'technical_requirements'
  | 'submission_requirements'
  | 'evaluation_criteria'
  | 'timeline_milestones'
  | 'terms_conditions'
  | 'appendices';

export type DocumentCategory = 
  | 'Legal'
  | 'Template'
  | 'Examples'
  | 'General'
  | 'Data'
  | 'Guidelines'
  | 'Forms'
  | 'Policies';

export type AITextStatus = 'pending' | 'accepted' | 'rejected' | 'edited';

// Section content with AI tracking
export interface RFPSectionContent {
  id: string;
  type: RFPSectionType;
  title: string;
  number: string; // e.g., "1", "1.1", "2.3.1"
  content: string; // HTML content from TipTap
  aiGenerated: boolean;
  aiTextStatus: AITextStatus;
  lastEditedBy: 'user' | 'ai';
  lastEditedAt: string;
  isHighlighted: boolean; // For AI working indicator
}

// Full RFP Document
export interface RFPDocument {
  id: string;
  title: string;
  referenceId: string;
  status: RFPStatus;
  templateId: string;
  
  // Project setup info
  projectInfo: RFPProjectInfo;
  
  // Document sections
  sections: RFPSectionContent[];
  
  // Team members assigned to this RFP (at least one Lead required)
  assignedTeamMemberIds: string[];
  
  // Supplier registrations (registered interest in responding to this RFP)
  registeredSuppliers: RFPInterest[];
  
  // AI context/summary for continuity
  aiSummary: string;
  
  // Version control
  currentVersion: number;
  versions: RFPVersion[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Approval workflow
  approvalRequired: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
  approvedBy: string | null;
  approvedAt: string | null;
}

// Project setup information
export interface RFPProjectInfo {
  projectName: string;
  category: string;
  description: string;
  
  // Budget
  expectedBudget: number;
  budgetCurrency: string;
  budgetFlexibility: 'fixed' | 'flexible' | 'negotiable';
  
  // Timeline
  submissionDeadline: string;
  qaStartDate: string;
  qaEndDate: string;
  expectedStartDate: string;
  expectedCompletionDate: string;
  
  // Milestones
  milestones: RFPMilestone[];
  
  // Contact
  primaryContact: string;
  primaryContactEmail: string;
  department: string;
}

export interface RFPMilestone {
  id: string;
  name: string;
  dueDate: string;
  description: string;
}

// Version history
export interface RFPVersion {
  version: number;
  savedAt: string;
  savedBy: string;
  changesSummary: string;
  sections: RFPSectionContent[];
}

// RFP Template
export interface RFPTemplate {
  id: string;
  name: string;
  description: string;
  sections: RFPTemplateSection[];
  isDefault: boolean;
}

export interface RFPTemplateSection {
  type: RFPSectionType;
  title: string;
  defaultContent: string;
  required: boolean;
  order: number;
  aiPromptHint: string; // Hint for AI when generating content
}

// Company branding settings
export interface CompanyBranding {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
  headerText: string;
}

// Tone and voice settings
export interface ToneVoiceSettings {
  toneFile: string | null; // Uploaded file content
  formality: 'formal' | 'professional' | 'casual';
  industry: string;
  customInstructions: string;
}

// AI Chat message for RFP copilot
export interface RFPChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  relatedSectionId?: string;
  suggestedContent?: string;
}

// Section numbering helper
export const SECTION_ORDER: RFPSectionType[] = [
  'cover',
  'toc',
  'executive_summary',
  'company_background',
  'scope_of_work',
  'technical_requirements',
  'submission_requirements',
  'evaluation_criteria',
  'timeline_milestones',
  'terms_conditions',
  'appendices',
];

export const SECTION_TITLES: Record<RFPSectionType, string> = {
  cover: 'Cover Page',
  toc: 'Table of Contents',
  executive_summary: 'Executive Summary',
  company_background: 'Company Background',
  scope_of_work: 'Scope of Work',
  technical_requirements: 'Technical Requirements',
  submission_requirements: 'Submission Requirements',
  evaluation_criteria: 'Evaluation Criteria',
  timeline_milestones: 'Timeline & Milestones',
  terms_conditions: 'Terms & Conditions',
  appendices: 'Appendices',
};
