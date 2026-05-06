export type RoleType = 'Viewer' | 'Editor' | 'Approver' | 'Lead'
export type Department = 'Procurement' | 'Sustainability' | 'Finance' | 'Legal' | 'Operations' | 'Other'
export type ActivityType = 'created' | 'edited' | 'viewed_rfp' | 'approved_rfp' | 'commented' | 'submitted' | 'assigned_to_rfp' | 'removed_from_rfp'

export interface TeamMemberActivity {
  id: string
  type: ActivityType
  description: string
  rfpId?: string
  rfpTitle?: string
  timestamp: string
  details?: Record<string, any>
}

export interface TeamMember {
  id: string
  name: string
  email: string
  phone?: string
  jobTitle: string
  department: Department
  roleType: RoleType
  status: 'active' | 'inactive'
  assignedRFPs: string[] // Array of RFP IDs
  internalNotes?: string
  dateAdded: string
  lastActivity?: string
  deletedAt?: string // Soft delete timestamp
  activity: TeamMemberActivity[] // Auto-logged activities
  avatar?: string
}
