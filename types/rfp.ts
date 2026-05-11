// RFP Document Types and Interfaces

// Import supplier types (RFPInterest is defined in supplier.ts)
import type { RFPInterest } from './supplier'
export type { RFPInterest }

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
  | 'appendices'
  | 'data_requirements'
  | 'deliverables'
  | 'risk_analysis'
  | 'adaptation_strategy'
  | 'materiality_assessment'
  | 'reporting_disclosure'
  | 'assurance_readiness';

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
  
  // Branding & settings (optional)
  brandColor?: string;
  footerText?: string;
  toneSettings?: ToneVoiceSettings;
  requiresApproval?: boolean;
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
  
  // Classification
  contractType?: string;
  confidentiality?: string;
  submissionLanguage?: string;
}

export interface RFPMilestone {
  id: string;
  name: string;
  dueDate: string;
  description: string;
}

// Version history
export interface RFPVersion {
  id: string;
  version: number;
  savedAt: string;
  savedBy: string;
  changesSummary: string;
  sections: RFPSectionContent[];
}

// Submission Questions (Custom Questions for Suppliers)
export type SubmissionFieldType = 'text' | 'number' | 'date';

export interface SubmissionQuestion {
  id: string;
  label: string;
  description?: string;
  fieldType: SubmissionFieldType;
  required: boolean;
  isMandatory: boolean; // System-required fields (cannot be deleted)
  order: number;
}

export interface PriceLineItem {
  id: string;
  label: string;
  description?: string;
  order: number;
}

export interface SubmissionQuestionsConfig {
  includeCustomQuestions: boolean;
  priceLineItems: PriceLineItem[];
  customQuestions: SubmissionQuestion[];
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
  tone?: string; // Legacy tone field
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
  data_requirements: 'Data Requirements',
  deliverables: 'Deliverables',
  risk_analysis: 'Risk Analysis',
  adaptation_strategy: 'Adaptation Strategy',
  materiality_assessment: 'Materiality Assessment',
  reporting_disclosure: 'Reporting & Disclosure',
  assurance_readiness: 'Assurance Readiness',
};

// =====================================================
// RFP LIFECYCLE MANAGEMENT TYPES
// =====================================================

// Response Status - tracks supplier submission journey
export type ResponseStatus = 
  | 'submitted'
  | 'clarifications_requested'
  | 'clarifications_provided'
  | 'withdrawn'
  | 'shortlisted'
  | 'evaluated'
  | 'finalist'
  | 'awarded'
  | 'contract_agreed'
  | 'rejected';

// Supplier Response to an RFP
export interface RFPResponse {
  id: string;
  rfpId: string;
  supplierId: string;
  supplierName: string;
  supplierLogo?: string;
  submittedAt: string;
  submittedBy: string;
  status: ResponseStatus;
  
  // Submission answers
  priceAnswers: PriceAnswer[];
  questionAnswers: QuestionAnswer[];
  
  // Documents
  attachments: ResponseAttachment[];
  
  // Evaluation
  totalScore?: number;
  rank?: number;
  evaluationStatus: 'pending' | 'in_progress' | 'complete';
  
  // Timestamps
  lastUpdatedAt: string;
  shortlistedAt?: string;
  evaluatedAt?: string;
}

export interface PriceAnswer {
  priceLineItemId: string;
  label: string;
  value: number;
  currency: string;
  notes?: string;
}

export interface QuestionAnswer {
  questionId: string;
  label: string;
  value: string | number | Date;
  fieldType: SubmissionFieldType;
}

export interface ResponseAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url: string;
}

// =====================================================
// INTERVIEW MANAGEMENT
// =====================================================

export type InterviewType = 'discovery' | 'technical' | 'commercial' | 'final' | 'presentation';
export type InterviewStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';

export interface RFPInterview {
  id: string;
  rfpId: string;
  responseId: string;
  supplierId: string;
  supplierName: string;
  
  // Scheduling
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // minutes
  timezone: string;
  
  // Details
  interviewType: InterviewType;
  status: InterviewStatus;
  title: string;
  agenda?: string;
  meetingLink?: string;
  location?: string;
  
  // Attendees
  buyerAttendees: InterviewAttendee[];
  supplierAttendees: InterviewAttendee[];
  
  // Notes and outcomes
  notes: InterviewNote[];
  overallRating?: number; // 1-5 stars
  recommendation?: 'proceed' | 'needs_follow_up' | 'do_not_proceed';
  
  // Timestamps
  createdAt: string;
  createdBy: string;
  completedAt?: string;
  lastUpdatedAt: string;
}

export interface InterviewAttendee {
  id: string;
  name: string;
  email: string;
  role: string;
  isRequired: boolean;
  rsvpStatus: 'pending' | 'accepted' | 'declined' | 'tentative';
}

export interface InterviewNote {
  id: string;
  author: string;
  authorId: string;
  timestamp: string;
  content: string;
  category: 'general' | 'strength' | 'concern' | 'question' | 'action_item';
  relatedCriteriaId?: string;
  isPrivate: boolean;
}

// =====================================================
// EVALUATION & SCORING
// =====================================================

export interface EvaluationCriteria {
  id: string;
  rfpId: string;
  name: string;
  description: string;
  weight: number; // Percentage, should sum to 100
  maxScore: number; // e.g., 10
  rubric: string; // Detailed scoring guide
  order: number;
  isRequired: boolean;
  subcriteria?: EvaluationSubcriteria[];
}

export interface EvaluationSubcriteria {
  id: string;
  criteriaId: string;
  name: string;
  description: string;
  weight: number; // Percentage within parent criteria
  order: number;
}

export interface ProposalScore {
  id: string;
  responseId: string;
  evaluatorId: string;
  evaluatorName: string;
  criteriaId: string;
  subcriteriaId?: string;
  score: number;
  maxScore: number;
  comment: string;
  timestamp: string;
  isFinalized: boolean;
}

export interface ProposalEvaluation {
  id: string;
  rfpId: string;
  responseId: string;
  supplierId: string;
  supplierName: string;
  
  // Scoring
  scores: ProposalScore[];
  totalWeightedScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  
  // Status
  status: 'draft' | 'in_progress' | 'submitted' | 'reviewed' | 'finalized';
  
  // Evaluators
  evaluators: EvaluatorAssignment[];
  consensusScore?: number;
  
  // Timestamps
  startedAt: string;
  completedAt?: string;
  lastUpdatedAt: string;
}

export interface EvaluatorAssignment {
  evaluatorId: string;
  evaluatorName: string;
  assignedAt: string;
  status: 'pending' | 'in_progress' | 'submitted';
  submittedAt?: string;
}

// =====================================================
// RANKING & COMPARISON
// =====================================================

export interface SupplierRanking {
  responseId: string;
  supplierId: string;
  supplierName: string;
  rank: number;
  totalScore: number;
  percentageScore: number;
  priceTotal: number;
  interviewsCompleted: number;
  interviewRating?: number;
  recommendation: 'highly_recommended' | 'recommended' | 'neutral' | 'not_recommended';
  notes?: string;
}

export interface ComparisonView {
  rfpId: string;
  responseIds: string[];
  criteria: EvaluationCriteria[];
  rankings: SupplierRanking[];
}

// =====================================================
// AWARD & COMMUNICATION
// =====================================================

// pending: Award sent, awaiting supplier response
// announced: Award publicly announced
// accepted: Supplier has accepted the award
// contract_agreed: Supplier has formally agreed to the contract terms
// declined: Supplier declined the award
// finalized: Contract fully executed
export type AwardStatus = 'pending' | 'announced' | 'accepted' | 'contract_agreed' | 'declined' | 'finalized';

export interface RFPAward {
  id: string;
  rfpId: string;
  awardedResponseId: string;
  awardedSupplierId: string;
  awardedSupplierName: string;
  
  // Award details
  status: AwardStatus;
  awardedAt: string;
  awardedBy: string;
  awardedByName: string;
  
  // Contract info
  contractValue: number;
  contractCurrency: string;
  contractStartDate?: string;
  contractEndDate?: string;
  
  // Communication
  awardMessageSent: boolean;
  awardMessageSentAt?: string;
  rejectionMessagesSent: boolean;
  rejectionMessagesSentAt?: string;
  
  // Acceptance
  supplierAcceptedAt?: string;
  supplierDeclinedAt?: string;
  declineReason?: string;
  
  // Next steps
  nextSteps: AwardNextStep[];
}

export interface AwardNextStep {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  completedAt?: string;
}

export type NotificationType = 
  | 'award_notification'
  | 'rejection_notification'
  | 'feedback_request'
  | 'interview_invitation'
  | 'clarification_request'
  | 'shortlist_notification'
  | 'general';

export interface PostAwardCommunication {
  id: string;
  rfpId: string;
  responseId: string;
  supplierId: string;
  supplierName: string;
  
  // Message details
  notificationType: NotificationType;
  subject: string;
  message: string;
  
  // Status
  status: 'draft' | 'scheduled' | 'sent' | 'delivered' | 'read' | 'acknowledged';
  scheduledFor?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  acknowledgedAt?: string;
  
  // Sender
  sentBy: string;
  sentByName: string;
  
  // Response
  supplierResponse?: string;
  supplierRespondedAt?: string;
  
  // Attachments
  attachments: CommunicationAttachment[];
}

export interface CommunicationAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

// =====================================================
// RFP LIFECYCLE PHASE TRACKING
// =====================================================

export type RFPPhase = 
  | 'draft'
  | 'published'
  | 'accepting_responses'
  | 'response_review'
  | 'interviews_in_progress'
  | 'evaluation'
  | 'final_selection'
  | 'award_pending'
  | 'awarded'
  | 'closed';

export interface RFPPhaseHistory {
  phase: RFPPhase;
  enteredAt: string;
  exitedAt?: string;
  enteredBy: string;
  notes?: string;
}

export interface RFPLifecycleStats {
  rfpId: string;
  totalResponses: number;
  shortlistedCount: number;
  interviewsScheduled: number;
  interviewsCompleted: number;
  evaluationsComplete: number;
  daysToAward?: number;
  currentPhase: RFPPhase;
  phaseHistory: RFPPhaseHistory[];
}

// Interview type labels
export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  discovery: 'Discovery Call',
  technical: 'Technical Review',
  commercial: 'Commercial Discussion',
  final: 'Final Presentation',
  presentation: 'Capability Presentation',
};

// Interview status labels
export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
  no_show: 'No Show',
};

// Response status labels
export const RESPONSE_STATUS_LABELS: Record<ResponseStatus, string> = {
  submitted: 'Submitted',
  clarifications_requested: 'Clarifications Requested',
  clarifications_provided: 'Clarifications Provided',
  withdrawn: 'Withdrawn',
  shortlisted: 'Shortlisted',
  evaluated: 'Evaluated',
  finalist: 'Finalist',
  awarded: 'Awarded',
  contract_agreed: 'Contract Agreed',
  rejected: 'Not Selected',
};
