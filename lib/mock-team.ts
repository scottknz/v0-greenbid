import { TeamMember, ActivityType } from '@/types/team'

// In-memory store for team members
const teamStore: Map<string, TeamMember> = new Map()

// Initialize with sample team members
const sampleTeamMembers: TeamMember[] = [
  {
    id: 'tm-001',
    name: 'Emma Thompson',
    email: 'emma.thompson@thistle.com',
    phone: '+1-555-0101',
    jobTitle: 'Procurement Lead',
    department: 'Procurement',
    roleType: 'Lead',
    status: 'active',
    assignedRFPs: ['rfp-sample-001', 'rfp-sample-002'],
    internalNotes: 'Lead contact for all sustainability RFPs',
    dateAdded: '2026-01-15T10:00:00Z',
    lastActivity: '2026-05-06T14:30:00Z',
    activity: [
      {
        id: 'act-001',
        type: 'created',
        description: 'Created Scope 3 Emissions RFP',
        rfpId: 'rfp-sample-001',
        rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
        timestamp: '2026-03-01T10:00:00Z',
      },
      {
        id: 'act-002',
        type: 'approved_rfp',
        description: 'Approved SBTi Target Setting RFP for submission',
        rfpId: 'rfp-sample-002',
        rfpTitle: 'SBTi Target Setting & Validation Support',
        timestamp: '2026-04-28T16:00:00Z',
      },
    ],
  },
  {
    id: 'tm-002',
    name: 'James Wilson',
    email: 'james.wilson@thistle.com',
    phone: '+1-555-0102',
    jobTitle: 'Sustainability Manager',
    department: 'Sustainability',
    roleType: 'Editor',
    status: 'active',
    assignedRFPs: ['rfp-sample-001', 'rfp-sample-003'],
    internalNotes: 'Expert in GHG accounting and SBTi',
    dateAdded: '2026-02-01T09:00:00Z',
    lastActivity: '2026-05-04T11:20:00Z',
    activity: [
      {
        id: 'act-003',
        type: 'edited',
        description: 'Updated Scope 3 requirements in RFP',
        rfpId: 'rfp-sample-001',
        rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
        timestamp: '2026-04-15T13:45:00Z',
      },
    ],
  },
  {
    id: 'tm-003',
    name: 'Maria Garcia',
    email: 'maria.garcia@thistle.com',
    phone: '+1-555-0103',
    jobTitle: 'Finance Analyst',
    department: 'Finance',
    roleType: 'Viewer',
    status: 'active',
    assignedRFPs: ['rfp-sample-001'],
    internalNotes: 'Reviews budget allocations for RFPs',
    dateAdded: '2026-03-10T14:00:00Z',
    lastActivity: '2026-05-02T09:15:00Z',
    activity: [
      {
        id: 'act-004',
        type: 'viewed_rfp',
        description: 'Viewed Scope 3 RFP budget section',
        rfpId: 'rfp-sample-001',
        rfpTitle: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
        timestamp: '2026-05-02T09:15:00Z',
      },
    ],
  },
  {
    id: 'tm-004',
    name: 'David Chen',
    email: 'david.chen@thistle.com',
    phone: '+1-555-0104',
    jobTitle: 'Legal Counsel',
    department: 'Legal',
    roleType: 'Approver',
    status: 'active',
    assignedRFPs: [],
    internalNotes: 'Reviews all contracts and legal terms',
    dateAdded: '2026-01-20T10:30:00Z',
    lastActivity: '2026-04-30T16:45:00Z',
    activity: [],
  },
  {
    id: 'tm-005',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@thistle.com',
    phone: '+1-555-0105',
    jobTitle: 'Operations Director',
    department: 'Operations',
    roleType: 'Editor',
    status: 'inactive',
    assignedRFPs: [],
    internalNotes: 'On leave until June 2026',
    dateAdded: '2026-02-15T11:00:00Z',
    lastActivity: '2026-04-20T13:00:00Z',
    deletedAt: '2026-04-20T13:00:00Z',
    activity: [],
  },
]

// Initialize store
sampleTeamMembers.forEach(member => {
  teamStore.set(member.id, member)
})

/**
 * Get all team members (including soft-deleted)
 */
export function getAllTeamMembers(): TeamMember[] {
  return Array.from(teamStore.values())
}

/**
 * Get active team members only
 */
export function getActiveTeamMembers(): TeamMember[] {
  return Array.from(teamStore.values()).filter(member => !member.deletedAt)
}

/**
 * Get a single team member by ID
 */
export function getTeamMemberById(id: string): TeamMember | null {
  return teamStore.get(id) || null
}

/**
 * Create a new team member
 */
export function createTeamMember(member: Omit<TeamMember, 'id' | 'dateAdded' | 'activity'>): TeamMember {
  const id = `tm-${Date.now()}`
  const newMember: TeamMember = {
    ...member,
    id,
    dateAdded: new Date().toISOString(),
    activity: [],
  }
  teamStore.set(id, newMember)
  return newMember
}

/**
 * Update a team member
 */
export function updateTeamMember(id: string, updates: Partial<TeamMember>): TeamMember | null {
  const existing = teamStore.get(id)
  if (!existing) return null

  const updated: TeamMember = {
    ...existing,
    ...updates,
    id: existing.id,
    dateAdded: existing.dateAdded,
  }
  teamStore.set(id, updated)
  return updated
}

/**
 * Soft delete a team member (keep history)
 */
export function deleteTeamMember(id: string): TeamMember | null {
  const existing = teamStore.get(id)
  if (!existing) return null

  const deleted: TeamMember = {
    ...existing,
    deletedAt: new Date().toISOString(),
    status: 'inactive',
  }
  teamStore.set(id, deleted)
  return deleted
}

/**
 * Log activity for a team member (auto-logged)
 */
export function logTeamMemberActivity(
  memberId: string,
  type: ActivityType,
  description: string,
  options?: {
    rfpId?: string
    rfpTitle?: string
    details?: Record<string, any>
  }
): TeamMember | null {
  const member = teamStore.get(memberId)
  if (!member) return null

  const activity = {
    id: `act-${Date.now()}`,
    type,
    description,
    rfpId: options?.rfpId,
    rfpTitle: options?.rfpTitle,
    timestamp: new Date().toISOString(),
    details: options?.details,
  }

  const updated: TeamMember = {
    ...member,
    activity: [...(member.activity || []), activity],
    lastActivity: new Date().toISOString(),
  }
  teamStore.set(memberId, updated)
  return updated
}

/**
 * Assign team member to an RFP
 */
export function assignTeamMemberToRFP(memberId: string, rfpId: string): TeamMember | null {
  const member = teamStore.get(memberId)
  if (!member) return null

  if (!member.assignedRFPs.includes(rfpId)) {
    const updated = updateTeamMember(memberId, {
      assignedRFPs: [...member.assignedRFPs, rfpId],
    })
    logTeamMemberActivity(memberId, 'assigned_to_rfp', `Assigned to RFP ${rfpId}`, { rfpId })
    return updated
  }
  return member
}

/**
 * Remove team member from an RFP
 */
export function removeTeamMemberFromRFP(memberId: string, rfpId: string): TeamMember | null {
  const member = teamStore.get(memberId)
  if (!member) return null

  const updated = updateTeamMember(memberId, {
    assignedRFPs: member.assignedRFPs.filter(id => id !== rfpId),
  })
  logTeamMemberActivity(memberId, 'removed_from_rfp', `Removed from RFP ${rfpId}`, { rfpId })
  return updated
}
