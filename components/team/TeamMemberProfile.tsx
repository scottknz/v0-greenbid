'use client'

import React from 'react'
import { TeamMember } from '@/types/team'
import { Button } from '@/components/ui/button'
import { X, Mail, Phone, MapPin, Calendar, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const ROLE_COLORS = {
  Lead: 'bg-brand-green text-white',
  Editor: 'bg-blue-100 text-blue-900',
  Approver: 'bg-purple-100 text-purple-900',
  Viewer: 'bg-grey-100 text-grey-900',
}

function getRoleColor(role: string) {
  return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || 'bg-grey-100 text-grey-900'
}

interface TeamMemberProfileProps {
  isOpen: boolean
  member: TeamMember | null
  onClose: () => void
  onEdit?: (member: TeamMember) => void
}

export function TeamMemberProfile({ isOpen, member, onClose, onEdit }: TeamMemberProfileProps) {
  if (!isOpen || !member) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-text-primary">Team Member Profile</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-green to-green-600 flex items-center justify-center text-white text-2xl font-semibold">
                {member.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-text-primary">{member.name}</h3>
                <p className="text-text-secondary">{member.jobTitle}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className={cn('text-xs font-medium', getRoleColor(member.roleType))}>
                    {member.roleType}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {member.department}
                  </Badge>
                  {member.deletedAt && (
                    <Badge variant="destructive" className="text-xs">
                      Deleted
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {onEdit && (
              <Button
                onClick={() => onEdit(member)}
                variant="outline"
                className="text-brand-green hover:bg-green-50"
              >
                Edit Profile
              </Button>
            )}
          </div>

          {/* Contact Information */}
          <div className="border-t border-border pt-6">
            <h4 className="text-sm font-semibold text-text-primary mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-text-secondary" />
                <div>
                  <p className="text-xs text-text-secondary">Email</p>
                  <p className="text-sm text-text-primary">{member.email}</p>
                </div>
              </div>
              {member.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-text-secondary" />
                  <div>
                    <p className="text-xs text-text-secondary">Phone</p>
                    <p className="text-sm text-text-primary">{member.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RFP Assignments */}
          <div className="border-t border-border pt-6">
            <h4 className="text-sm font-semibold text-text-primary mb-4">Assigned RFPs</h4>
            {member.assignedRFPs.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {member.assignedRFPs.map((rfpId) => (
                  <Badge key={rfpId} variant="secondary">
                    {rfpId}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">No RFPs assigned</p>
            )}
          </div>

          {/* Metadata */}
          <div className="border-t border-border pt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-secondary mb-1">Date Added</p>
              <p className="text-sm text-text-primary">
                {new Date(member.dateAdded).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Last Activity</p>
              <p className="text-sm text-text-primary">
                {member.lastActivity ? new Date(member.lastActivity).toLocaleDateString() : 'Never'}
              </p>
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
