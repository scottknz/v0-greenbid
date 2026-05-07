'use client'

import React from 'react'
import { TeamMember } from '@/types/team'
import { Button } from '@/components/ui/button'
import { X, Mail, Phone, Pencil, Activity, Briefcase, Award, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const ROLE_COLORS = {
  Lead: 'bg-[#16A34A] text-white',
  Editor: 'bg-blue-100 text-blue-900',
  Approver: 'bg-purple-100 text-purple-900',
  Viewer: 'bg-grey-100 text-grey-900',
}

function getRoleColor(role: string) {
  return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || 'bg-grey-100 text-grey-900'
}

// Mock project data for team members
const mockProjects = [
  { id: 'rfp-001', title: 'Cloud Infrastructure Upgrade', status: 'Active', role: 'Lead', value: '$450,000' },
  { id: 'rfp-002', title: 'Office Supplies Contract', status: 'Completed', role: 'Reviewer', value: '$85,000' },
  { id: 'rfp-003', title: 'IT Security Services', status: 'Active', role: 'Lead', value: '$320,000' },
  { id: 'rfp-004', title: 'Marketing Agency Selection', status: 'Completed', role: 'Contributor', value: '$150,000' },
]

interface TeamMemberProfileProps {
  isOpen: boolean
  member: TeamMember | null
  onClose: () => void
  onEdit?: (member: TeamMember) => void
}

export function TeamMemberProfile({ isOpen, member, onClose, onEdit }: TeamMemberProfileProps) {
  if (!isOpen || !member) return null

  // Get projects for this member based on assigned RFPs
  const memberProjects = mockProjects.slice(0, Math.max(1, member.assignedRFPs.length))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-text-primary">Team Member Details</h2>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                onClick={() => onEdit(member)}
                variant="outline"
                size="sm"
                className="text-[#16A34A] hover:bg-[#F0FDF4]"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 shrink-0 rounded-full bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center text-white text-3xl font-semibold">
              {member.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-semibold text-text-primary">{member.name}</h3>
              <p className="text-text-secondary text-lg">{member.jobTitle}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className={cn('text-xs font-medium', getRoleColor(member.roleType))}>
                  {member.roleType}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {member.department}
                </Badge>
                {member.deletedAt && (
                  <Badge variant="destructive" className="text-xs">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-border pt-6">
            <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F9FAFB] rounded-lg p-4">
                <p className="text-xs text-text-secondary mb-1">Email</p>
                <p className="text-sm font-medium text-text-primary">{member.email}</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-4">
                <p className="text-xs text-text-secondary mb-1">Phone</p>
                <p className="text-sm font-medium text-text-primary">{member.phone || 'Not provided'}</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-4">
                <p className="text-xs text-text-secondary mb-1">Department</p>
                <p className="text-sm font-medium text-text-primary">{member.department}</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-4">
                <p className="text-xs text-text-secondary mb-1">Role Type</p>
                <p className="text-sm font-medium text-text-primary">{member.roleType}</p>
              </div>
            </div>
          </div>

          {/* Projects Worked On */}
          <div className="border-t border-border pt-6">
            <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Projects Worked On
            </h4>
            {memberProjects.length > 0 ? (
              <div className="space-y-3">
                {memberProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-border hover:border-[#16A34A]/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-text-primary">{project.title}</p>
                        {project.role === 'Lead' && (
                          <Badge className="bg-[#16A34A] text-white text-[10px]">
                            <Award className="h-3 w-3 mr-1" />
                            Project Lead
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-text-secondary">Role: {project.role}</span>
                        <span className="text-xs text-text-secondary">Value: {project.value}</span>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-xs shrink-0',
                        project.status === 'Active' 
                          ? 'bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/30' 
                          : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {project.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">No projects assigned yet</p>
            )}
          </div>

          {/* Summary Stats */}
          <div className="border-t border-border pt-6">
            <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Summary
            </h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[#F0FDF4] rounded-lg">
                <p className="text-2xl font-bold text-[#16A34A]">{member.assignedRFPs.length}</p>
                <p className="text-xs text-text-secondary mt-1">Total RFPs</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{memberProjects.filter(p => p.role === 'Lead').length}</p>
                <p className="text-xs text-text-secondary mt-1">As Lead</p>
              </div>
              <div className="text-center p-4 bg-[#F9FAFB] rounded-lg">
                <p className="text-2xl font-bold text-text-primary">{memberProjects.filter(p => p.status === 'Active').length}</p>
                <p className="text-xs text-text-secondary mt-1">Active</p>
              </div>
              <div className="text-center p-4 bg-[#F9FAFB] rounded-lg">
                <p className="text-2xl font-bold text-text-primary">{memberProjects.filter(p => p.status === 'Completed').length}</p>
                <p className="text-xs text-text-secondary mt-1">Completed</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#F9FAFB] rounded-lg p-4">
                <p className="text-xs text-text-secondary mb-1">Date Added</p>
                <p className="text-sm font-medium text-text-primary">
                  {new Date(member.dateAdded).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-4">
                <p className="text-xs text-text-secondary mb-1">Last Activity</p>
                <p className="text-sm font-medium text-text-primary">
                  {member.lastActivity ? new Date(member.lastActivity).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          {member.internalNotes && (
            <div className="border-t border-border pt-6">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Internal Notes</h4>
              <p className="text-sm text-text-secondary bg-background p-3 rounded-md">
                {member.internalNotes}
              </p>
            </div>
          )}

          {/* Activity History */}
          {member.activity && member.activity.length > 0 && (
            <div className="border-t border-border pt-6">
              <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity History
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {member.activity.map((activity) => (
                  <div key={activity.id} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-green mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">{activity.description}</p>
                      <p className="text-xs text-text-secondary">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                      {activity.rfpTitle && (
                        <p className="text-xs text-text-secondary mt-1">
                          RFP: {activity.rfpTitle}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
