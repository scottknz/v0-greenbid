// ============================================================================
// Supplier RFP Detail Page Mock Data
// This file contains mock data for the supplier RFP detail page
// ============================================================================

import type { MessageThread } from './mock-messages'

// ============================================================================
// Types
// ============================================================================

export interface RelatedRfp {
  id: string
  title: string
  status: 'submitted' | 'in_progress' | 'awarded' | 'draft'
  deadline: string
}

export interface ProposalDocument {
  id: string
  name: string
  size: string
  uploadedAt: string
  version: number
  status: 'active' | 'archived'
}

export interface RfpActivity {
  id: string
  type: 'phase_change' | 'document_upload' | 'team_added' | 'note_added' | 'message_received' | 'approval_requested' | 'approval_granted' | 'interest_registered'
  description: string
  user: string
  date: string
}

// ============================================================================
// Related RFPs Data
// ============================================================================

export const relatedRfps: RelatedRfp[] = [
  { id: 'rfp-002', title: 'Q3 Sustainable Packaging Supply', status: 'submitted', deadline: '2026-05-15' },
  { id: 'rfp-003', title: 'Carbon Neutral Logistics RFP', status: 'in_progress', deadline: '2026-06-01' },
]

// ============================================================================
// Proposal Documents Data
// ============================================================================

export const proposalDocuments: ProposalDocument[] = [
  { id: 'pd-1', name: 'Technical Proposal v2.pdf', size: '4.2 MB', uploadedAt: '2026-05-08', version: 2, status: 'active' },
  { id: 'pd-2', name: 'Pricing Schedule.xlsx', size: '156 KB', uploadedAt: '2026-05-07', version: 1, status: 'active' },
  { id: 'pd-3', name: 'Company Certifications.pdf', size: '2.1 MB', uploadedAt: '2026-05-06', version: 1, status: 'active' },
  { id: 'pd-4', name: 'Technical Proposal v1.pdf', size: '3.8 MB', uploadedAt: '2026-05-05', version: 1, status: 'archived' },
]

// ============================================================================
// Message Threads Data (for supplier RFP page)
// ============================================================================

export const supplierRfpMessageThreads: MessageThread[] = [
  {
    id: 't1',
    subject: 'Clarification on delivery timeline',
    visibility: 'public',
    status: 'awaiting',
    isRead: false,
    isStarred: true,
    isArchived: false,
    createdAt: '2026-05-06T09:30:00Z',
    updatedAt: '2026-05-08T14:20:00Z',
    lastSender: 'Jane Smith',
    lastSenderType: 'buyer',
    participants: ['b1'],
    messages: [
      {
        id: 'm1',
        senderId: 'buyer',
        senderName: 'Jane Smith',
        senderType: 'buyer',
        content: 'Could you please clarify the expected delivery timeline for the initial pilot phase? We need to ensure alignment with our internal deadlines.',
        attachments: [{ name: 'Project_Timeline.pdf', size: '245 KB', url: '#' }],
        timestamp: '2026-05-06T09:30:00Z',
      },
      {
        id: 'm2',
        senderId: 'supplier',
        senderName: 'John Smith',
        senderType: 'supplier',
        content: 'Thank you for reaching out. We can deliver the pilot phase within 6-8 weeks from contract signing. I have attached our proposed timeline for your review.',
        attachments: [{ name: 'Proposed_Delivery_Schedule.pdf', size: '312 KB', url: '#' }],
        timestamp: '2026-05-07T11:15:00Z',
      },
      {
        id: 'm3',
        senderId: 'buyer',
        senderName: 'Jane Smith',
        senderType: 'buyer',
        content: 'Thanks for the quick response. Can you confirm if the 6-8 week timeline includes the testing phase, or is that additional?',
        attachments: [],
        timestamp: '2026-05-08T14:20:00Z',
      },
    ],
  },
  {
    id: 't2',
    subject: 'Pricing adjustments discussion',
    visibility: 'private',
    status: 'resolved',
    isRead: true,
    isStarred: false,
    isArchived: false,
    createdAt: '2026-05-05T10:00:00Z',
    updatedAt: '2026-05-07T16:45:00Z',
    lastSender: 'Jane Smith',
    lastSenderType: 'buyer',
    participants: ['b1'],
    messages: [
      {
        id: 'm4',
        senderId: 'supplier',
        senderName: 'John Smith',
        senderType: 'supplier',
        content: 'We wanted to discuss pricing adjustments privately. Based on the volume requirements, we can offer a 12% discount on the per-unit pricing.',
        attachments: [{ name: 'Volume_Discount_Proposal.xlsx', size: '128 KB', url: '#' }],
        timestamp: '2026-05-05T10:00:00Z',
      },
      {
        id: 'm5',
        senderId: 'buyer',
        senderName: 'Jane Smith',
        senderType: 'buyer',
        content: 'Thank you for the proposal. The discount is acceptable. Please include this in your final submission.',
        attachments: [],
        timestamp: '2026-05-07T16:45:00Z',
      },
    ],
  },
  {
    id: 't3',
    subject: 'Updated specifications - please review',
    visibility: 'public',
    status: 'open',
    isRead: true,
    isStarred: false,
    isArchived: false,
    createdAt: '2026-05-05T08:00:00Z',
    updatedAt: '2026-05-05T08:00:00Z',
    lastSender: 'Jane Smith',
    lastSenderType: 'buyer',
    participants: ['b1'],
    messages: [
      {
        id: 'm6',
        senderId: 'buyer',
        senderName: 'Jane Smith',
        senderType: 'buyer',
        content: 'We have updated the technical specifications document. Please review the changes highlighted in Section 3.2 regarding environmental compliance requirements.',
        attachments: [
          { name: 'Technical_Specs_v2.pdf', size: '1.2 MB', url: '#' },
          { name: 'Change_Log.docx', size: '45 KB', url: '#' },
        ],
        timestamp: '2026-05-05T08:00:00Z',
      },
    ],
  },
]

// ============================================================================
// Activity Data
// ============================================================================

export const rfpActivityData: RfpActivity[] = [
  { id: 'a-1', type: 'phase_change', description: 'Phase changed to Preparation', user: 'John Smith', date: '2026-05-08T14:30:00Z' },
  { id: 'a-2', type: 'document_upload', description: 'Uploaded Technical Proposal v2.pdf', user: 'John Smith', date: '2026-05-08T11:15:00Z' },
  { id: 'a-3', type: 'team_added', description: 'Added Sarah Johnson to team', user: 'John Smith', date: '2026-05-07T16:45:00Z' },
  { id: 'a-4', type: 'note_added', description: 'Added internal note', user: 'Emily Chen', date: '2026-05-07T10:20:00Z' },
  { id: 'a-5', type: 'message_received', description: 'New message from buyer', user: 'System', date: '2026-05-06T09:00:00Z' },
  { id: 'a-6', type: 'approval_requested', description: 'Requested approval for pricing', user: 'John Smith', date: '2026-05-05T14:00:00Z' },
  { id: 'a-7', type: 'approval_granted', description: 'Approved pricing proposal', user: 'Michael Chen', date: '2026-05-05T16:30:00Z' },
  { id: 'a-8', type: 'interest_registered', description: 'Registered interest in RFP', user: 'John Smith', date: '2026-05-05T08:30:00Z' },
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getLegacyMessageFormat(threads: MessageThread[]) {
  return threads.map(t => ({
    id: t.id,
    type: t.visibility,
    subject: t.subject,
    sender: t.messages[t.messages.length - 1].senderType === 'buyer' 
      ? t.messages[t.messages.length - 1].senderName + ' (Buyer)'
      : 'You',
    date: new Date(t.updatedAt).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    unread: !t.isRead,
  }))
}
