'use client'

import React, { useState, useEffect } from 'react'
import { TeamMember } from '@/types/team'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const DEPARTMENTS = ['Procurement', 'Sustainability', 'Finance', 'Legal', 'Operations', 'Other']
const ROLE_TYPES = ['Lead', 'Editor', 'Approver', 'Viewer']

interface TeamMemberModalProps {
  isOpen: boolean
  member?: TeamMember
  onClose: () => void
  onSave: (member: Omit<TeamMember, 'id' | 'dateAdded' | 'activity'>) => void
}

export function TeamMemberModal({ isOpen, member, onClose, onSave }: TeamMemberModalProps) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    jobTitle: member?.jobTitle || '',
    department: member?.department || ('Procurement' as const),
    roleType: member?.roleType || ('Editor' as const),
    status: member?.status || ('active' as const),
    internalNotes: member?.internalNotes || '',
    assignedRFPs: member?.assignedRFPs || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sync form data whenever the modal opens or the member prop changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: member?.name || '',
        email: member?.email || '',
        phone: member?.phone || '',
        jobTitle: member?.jobTitle || '',
        department: member?.department || 'Procurement',
        roleType: member?.roleType || 'Editor',
        status: member?.status || 'active',
        internalNotes: member?.internalNotes || '',
        assignedRFPs: member?.assignedRFPs || [],
      })
      setErrors({})
    }
  }, [isOpen, member])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({
        ...formData,
        status: formData.status as 'active' | 'inactive',
        department: formData.department,
        roleType: formData.roleType,
      })
      setFormData({
        name: '',
        email: '',
        phone: '',
        jobTitle: '',
        department: 'Procurement',
        roleType: 'Editor',
        status: 'active',
        internalNotes: '',
        assignedRFPs: [],
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-text-primary">
            {member ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Full Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Phone & Job Title */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Phone (Optional)
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Job Title *
              </label>
              <Input
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="e.g., Procurement Manager"
                className={errors.jobTitle ? 'border-red-500' : ''}
              />
              {errors.jobTitle && <p className="text-xs text-red-600 mt-1">{errors.jobTitle}</p>}
            </div>
          </div>

          {/* Department & Role Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Department
              </label>
              <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Role Type
              </label>
              <Select value={formData.roleType} onValueChange={(value) => setFormData({ ...formData, roleType: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_TYPES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Internal Notes (Optional)
            </label>
            <Textarea
              value={formData.internalNotes}
              onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
              placeholder="Add any internal notes about this team member..."
              className="h-20"
            />
          </div>

          {/* Status */}
          {member && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-green hover:bg-brand-green/90 text-white">
              {member ? 'Update Member' : 'Add Member'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
