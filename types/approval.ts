// Approval Request Types and Interfaces

export type ApprovalType = 'rfp_publication' | 'rfp_submission';
export type ApprovalStatus = 'pending' | 'approved' | 'changes_requested' | 'rejected' | 'delegated';
export type ApprovalMode = 'any' | 'all'; // 'any' = first approval wins, 'all' = all must approve

export interface ApprovalRequest {
  id: string;
  type: ApprovalType; // 'rfp_publication' for buyer, 'rfp_submission' for supplier
  itemId: string; // RFP ID
  itemTitle: string; // RFP/Tender title
  requestedBy: string; // User ID
  requestedByName: string;
  requestedAt: string; // ISO timestamp
  message?: string; // Optional message to approvers
  approvalMode: ApprovalMode; // 'any' or 'all'
  approvers: ApproverStatus[];
  status: ApprovalStatus; // Overall status
  completedAt?: string;
  completedBy?: string;
}

export interface ApproverStatus {
  userId: string;
  name: string;
  email: string;
  role: string; // e.g., 'Director', 'VP Finance'
  status: ApprovalStatus;
  respondedAt?: string;
  comment?: string;
  delegatedTo?: string; // User ID if delegated
  delegatedToName?: string;
}

export interface ApprovalNotification {
  id: string;
  approvalRequestId: string;
  userId: string;
  type: 'request' | 'reminder' | 'decision';
  isRead: boolean;
  createdAt: string;
}
