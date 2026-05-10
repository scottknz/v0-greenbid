// ============================================================================
// Notifications Mock Data
// This file contains all notification-related mock data
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type NotificationType = 
  | 'qa' 
  | 'approval' 
  | 'response' 
  | 'deadline' 
  | 'award' 
  | 'message' 
  | 'document' 
  | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string
  read: boolean
  href: string
  rfpId?: string
  rfpTitle?: string
}

export interface NotificationBellItem {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string
  read: boolean
  href: string
}

// ============================================================================
// Buyer Notifications Data
// ============================================================================

export const buyerNotifications: NotificationBellItem[] = [
  {
    id: '1',
    type: 'qa',
    title: 'Pending Q&A',
    description: 'Sustainable Office Furniture: 3 unanswered questions',
    timestamp: '2 hours ago',
    read: false,
    href: '/buyer/tenders/1/manage?tab=q-a',
  },
  {
    id: '2',
    type: 'approval',
    title: 'Approval Needed',
    description: 'Green Energy Consulting proposal awaiting approval',
    timestamp: '5 hours ago',
    read: false,
    href: '/buyer/tenders/2/manage?tab=approvals',
  },
  {
    id: '3',
    type: 'response',
    title: 'New Response',
    description: 'Electric Vehicle Fleet: Response from EcoTransit Solutions',
    timestamp: '1 day ago',
    read: true,
    href: '/buyer/tenders/3/manage?tab=responses',
  },
]

// ============================================================================
// Supplier Notifications Data
// ============================================================================

export const supplierNotifications: NotificationBellItem[] = [
  {
    id: '1',
    type: 'qa',
    title: 'Question from Buyer',
    description: 'Sustainable Office Furniture: Buyer requested clarification',
    timestamp: '2 hours ago',
    read: false,
    href: '/supplier/rfps/1?tab=messages',
  },
  {
    id: '2',
    type: 'approval',
    title: 'Internal Approval Required',
    description: 'Green Energy Consulting proposal needs your approval',
    timestamp: '5 hours ago',
    read: false,
    href: '/supplier/rfps/2',
  },
  {
    id: '3',
    type: 'deadline',
    title: 'Deadline Approaching',
    description: 'Electric Vehicle Fleet: Submission due in 3 days',
    timestamp: '1 day ago',
    read: true,
    href: '/supplier/rfps/3',
  },
]

// ============================================================================
// Full Notifications Page Data
// ============================================================================

export interface PageNotification {
  id: string
  type: 'qa' | 'approval' | 'response' | 'deadline' | 'team'
  title: string
  description: string
  timestamp: string
  read: boolean
  href?: string
}

export const fullNotifications: PageNotification[] = [
  {
    id: '1',
    type: 'qa',
    title: 'Pending Q&A',
    description: 'Sustainable Office Furniture: 3 unanswered questions from suppliers',
    timestamp: '2 hours ago',
    read: false,
    href: '/buyer/tenders/1?tab=qa',
  },
  {
    id: '2',
    type: 'approval',
    title: 'Approval Needed',
    description: 'Green Energy Consulting proposal awaiting your approval',
    timestamp: '5 hours ago',
    read: false,
    href: '/approvals',
  },
  {
    id: '3',
    type: 'response',
    title: 'New Response',
    description: 'Electric Vehicle Fleet: Response from EcoTransit Solutions',
    timestamp: '1 day ago',
    read: false,
    href: '/buyer/tenders/3',
  },
  {
    id: '4',
    type: 'deadline',
    title: 'Deadline Approaching',
    description: 'IT Hardware Refresh: Submission deadline in 3 days',
    timestamp: '1 day ago',
    read: true,
    href: '/buyer/tenders/4',
  },
  {
    id: '5',
    type: 'team',
    title: 'Team Update',
    description: 'Sarah Chen added you to Sustainable Office Furniture RFP',
    timestamp: '2 days ago',
    read: true,
    href: '/buyer/tenders/1',
  },
  {
    id: '6',
    type: 'qa',
    title: 'Q&A Response',
    description: 'Your question about delivery timeline has been answered',
    timestamp: '3 days ago',
    read: true,
    href: '/supplier/rfps/1',
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getUnreadCount(notifications: NotificationBellItem[]): number {
  return notifications.filter(n => !n.read).length
}

export function markAsRead(notifications: NotificationBellItem[], id: string): NotificationBellItem[] {
  return notifications.map(n => n.id === id ? { ...n, read: true } : n)
}

export function markAllAsRead(notifications: NotificationBellItem[]): NotificationBellItem[] {
  return notifications.map(n => ({ ...n, read: true }))
}
