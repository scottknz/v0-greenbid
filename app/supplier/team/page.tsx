'use client'

import React, { useState, useMemo } from 'react'
import { getAllTeamMembers, deleteTeamMember, logTeamMemberActivity, createTeamMember, updateTeamMember } from '@/lib/mock-team'
import { TeamMember } from '@/types/team'
import { TeamMemberModal } from '@/components/team/TeamMemberModal'
import { TeamMemberProfile } from '@/components/team/TeamMemberProfile'
import { PageHeader } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Pencil, Trash2, Search, Users, Plus } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const DEPARTMENTS = ['Procurement', 'Sustainability', 'Finance', 'Legal', 'Operations', 'Other']
const ROLE_COLORS = {
  Lead: 'bg-brand-green text-white',
  Editor: 'bg-blue-100 text-blue-900',
  Approver: 'bg-purple-100 text-purple-900',
  Viewer: 'bg-grey-100 text-grey-900',
  Inactive: 'bg-red-100 text-red-700',
}

function getRoleColor(role: string) {
  return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || 'bg-grey-100 text-grey-900'
}

export default function SupplierTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getAllTeamMembers())
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('active')
  const [showModal, setShowModal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const handleSaveTeamMember = (memberData: Omit<TeamMember, 'id' | 'dateAdded' | 'activity'>) => {
    if (selectedMember) {
      const updated = updateTeamMember(selectedMember.id, memberData)
      if (updated) {
        logTeamMemberActivity(selectedMember.id, 'edited', 'Team member details updated')
        setTeamMembers(getAllTeamMembers())
      }
    } else {
      const created = createTeamMember(memberData)
      if (created) {
        logTeamMemberActivity(created.id, 'created', 'New team member added')
        setTeamMembers(getAllTeamMembers())
      }
    }
    setShowModal(false)
    setSelectedMember(null)
  }

  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter
      const matchesStatus =
        statusFilter === 'active' ? !member.deletedAt : statusFilter === 'inactive' ? member.deletedAt : true

      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [teamMembers, searchTerm, departmentFilter, statusFilter])

  const handleDeleteMember = (memberId: string) => {
    const result = deleteTeamMember(memberId)
    if (result) {
      setTeamMembers(getAllTeamMembers())
      logTeamMemberActivity(memberId, 'edited', 'Member status changed to inactive')
    }
  }

  const activeCount = teamMembers.filter(m => !m.deletedAt).length

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Team Members"
        description={`Manage internal team members and their RFP assignments (${activeCount} active)`}
        actions={
          <Button 
            onClick={() => {
              setSelectedMember(null)
              setShowModal(true)
            }}
            className="bg-brand-green hover:bg-brand-green-mid text-white gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Team Member
          </Button>
        }
      />

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4 bg-surface p-4 rounded-lg border border-border">
        <div className="flex flex-1 items-center gap-2 bg-background rounded-md border border-border px-3 py-2">
          <Search className="h-4 w-4 text-text-secondary" />
          <Input
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0"
          />
        </div>

        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map(dept => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* Team Members Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-background">
        <table className="w-full table-fixed">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="w-[220px] px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Name
              </th>
              <th className="w-[200px] px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Contact
              </th>
              <th className="w-[120px] px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Department
              </th>
              <th className="w-[100px] px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Role
              </th>
              <th className="w-[80px] px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                RFPs
              </th>
              <th className="w-[120px] px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Last Activity
              </th>
              <th className="w-[100px] px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredMembers.map((member) => (
              <tr
                key={member.id}
                onClick={() => {
                  setSelectedMember(member)
                  setShowProfile(true)
                }}
                className={cn(
                  'hover:bg-surface-hover transition-colors cursor-pointer',
                  member.deletedAt && 'opacity-60'
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-brand-green to-brand-green-dark flex items-center justify-center text-white text-sm font-semibold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-text-primary truncate">{member.name}</p>
                      <p className="text-xs text-text-secondary truncate">{member.jobTitle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="min-w-0">
                    <p className="text-text-primary truncate">{member.email}</p>
                    {member.phone && <p className="text-xs text-text-secondary truncate">{member.phone}</p>}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-primary">
                  {member.department}
                </td>
                <td className="px-6 py-4">
                  <Badge className={cn('text-xs font-medium', getRoleColor(member.roleType))}>
                    {member.roleType}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-text-primary">
                  <Badge variant="outline">{member.assignedRFPs.length}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {member.lastActivity
                    ? new Date(member.lastActivity).toLocaleDateString()
                    : 'Never'}
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedMember(member)
                        setShowModal(true)
                      }}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {!member.deletedAt && (
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No team members found</p>
          </div>
        )}
      </div>

      {/* Team Member Modal */}
      <TeamMemberModal
        isOpen={showModal}
        member={selectedMember || undefined}
        onClose={() => {
          setShowModal(false)
          setSelectedMember(null)
        }}
        onSave={handleSaveTeamMember}
      />

      {/* Team Member Profile */}
      <TeamMemberProfile
        isOpen={showProfile}
        member={selectedMember}
        onClose={() => {
          setShowProfile(false)
          setSelectedMember(null)
        }}
        onEdit={(member) => {
          setSelectedMember(member)
          setShowProfile(false)
          setShowModal(true)
        }}
        variant="supplier"
      />
    </div>
  )
}
