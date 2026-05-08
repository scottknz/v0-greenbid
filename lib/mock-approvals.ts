import type { ApprovalRequest, ApproverStatus } from '@/types/approval';

// Mock approval requests for buyer side (pre-publication)
export const mockBuyerApprovalRequests: ApprovalRequest[] = [
  {
    id: 'apr-001',
    type: 'rfp_publication',
    itemId: 'rfp-tender-001',
    itemTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    requestedBy: 'user-sarah',
    requestedByName: 'Sarah Chen',
    requestedAt: '2026-04-15T09:30:00Z',
    message: 'Ready for publication. Please review and approve to move forward with vendor outreach.',
    approvalMode: 'all',
    approvers: [
      {
        userId: 'user-emily',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        role: 'VP Sustainability',
        status: 'approved',
        respondedAt: '2026-04-15T10:15:00Z',
        comment: 'Scope looks comprehensive. Budget aligns with our targets.',
      },
      {
        userId: 'user-james',
        name: 'James Wilson',
        email: 'james.wilson@company.com',
        role: 'Finance Director',
        status: 'pending',
        respondedAt: undefined,
      },
      {
        userId: 'user-michael',
        name: 'Michael Park',
        email: 'michael.park@company.com',
        role: 'Legal Counsel',
        status: 'pending',
        respondedAt: undefined,
      },
    ],
    status: 'pending',
  },
  {
    id: 'apr-002',
    type: 'rfp_publication',
    itemId: 'rfp-tender-002',
    itemTitle: 'SBTi Target Setting & Validation Support',
    requestedBy: 'user-sarah',
    requestedByName: 'Sarah Chen',
    requestedAt: '2026-04-10T14:00:00Z',
    message: 'All edits completed. Ready to publish.',
    approvalMode: 'all',
    approvers: [
      {
        userId: 'user-emily',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        role: 'VP Sustainability',
        status: 'approved',
        respondedAt: '2026-04-10T14:45:00Z',
        comment: 'Looks good to publish.',
      },
      {
        userId: 'user-james',
        name: 'James Wilson',
        email: 'james.wilson@company.com',
        role: 'Finance Director',
        status: 'approved',
        respondedAt: '2026-04-10T16:20:00Z',
      },
      {
        userId: 'user-michael',
        name: 'Michael Park',
        email: 'michael.park@company.com',
        role: 'Legal Counsel',
        status: 'approved',
        respondedAt: '2026-04-10T17:00:00Z',
      },
    ],
    status: 'approved',
    completedAt: '2026-04-10T17:00:00Z',
    completedBy: 'user-michael',
  },
];

// Mock approval requests for supplier side (pre-submission)
export const mockSupplierApprovalRequests: ApprovalRequest[] = [
  {
    id: 'apr-101',
    type: 'rfp_submission',
    itemId: 'rfp-001',
    itemTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
    requestedBy: 'user-john',
    requestedByName: 'John Smith',
    requestedAt: '2026-04-18T13:45:00Z',
    message: 'Proposal ready for final review. All sections completed and technical details verified.',
    approvalMode: 'all',
    approvers: [
      {
        userId: 'user-sarah',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        role: 'Senior Manager',
        status: 'approved',
        respondedAt: '2026-04-18T14:30:00Z',
        comment: 'Excellent work. Proposal is compelling and well-structured.',
      },
      {
        userId: 'user-james',
        name: 'James Wilson',
        email: 'james.wilson@company.com',
        role: 'Director',
        status: 'changes_requested',
        respondedAt: '2026-04-18T15:00:00Z',
        comment: 'Please revise the pricing section. Need more detail on cost breakdown.',
      },
      {
        userId: 'user-emily',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        role: 'VP Operations',
        status: 'pending',
        respondedAt: undefined,
      },
    ],
    status: 'changes_requested',
  },
  {
    id: 'apr-102',
    type: 'rfp_submission',
    itemId: 'rfp-002',
    itemTitle: 'SBTi Target Setting & Validation Support',
    requestedBy: 'user-john',
    requestedByName: 'John Smith',
    requestedAt: '2026-04-12T10:20:00Z',
    message: 'Proposal complete and ready to submit.',
    approvalMode: 'any',
    approvers: [
      {
        userId: 'user-sarah',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        role: 'Senior Manager',
        status: 'approved',
        respondedAt: '2026-04-12T11:00:00Z',
      },
      {
        userId: 'user-james',
        name: 'James Wilson',
        email: 'james.wilson@company.com',
        role: 'Director',
        status: 'pending',
        respondedAt: undefined,
      },
    ],
    status: 'approved',
    completedAt: '2026-04-12T11:00:00Z',
    completedBy: 'user-sarah',
  },
];

// Helper to get approvals for a specific user (for "My Approvals" page)
export const getUserPendingApprovals = (userId: string): ApprovalRequest[] => {
  const allRequests = [...mockBuyerApprovalRequests, ...mockSupplierApprovalRequests];
  return allRequests.filter(
    (req) =>
      req.status === 'pending' &&
      req.approvers.some(
        (approver) => approver.userId === userId && approver.status === 'pending'
      )
  );
};

// Helper to get approval history for a specific user
export const getUserApprovalHistory = (userId: string): ApprovalRequest[] => {
  const allRequests = [...mockBuyerApprovalRequests, ...mockSupplierApprovalRequests];
  return allRequests.filter((req) =>
    req.approvers.some(
      (approver) =>
        approver.userId === userId &&
        (approver.status === 'approved' ||
          approver.status === 'changes_requested' ||
          approver.status === 'rejected')
    )
  );
};
