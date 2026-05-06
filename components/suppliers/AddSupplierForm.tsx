'use client'

import React, { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { Supplier, TeamMember, ALL_EXPERTISE } from '@/types/supplier'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AddSupplierFormProps {
  supplier?: Supplier | null
  onSubmit: (supplier: Supplier) => void
  onCancel: () => void
}

export function AddSupplierForm({
  supplier,
  onSubmit,
  onCancel,
}: AddSupplierFormProps) {
  const [name, setName] = useState(supplier?.name || '')
  const [tier, setTier] = useState<'preferred' | 'standard' | 'new'>(
    supplier?.tier || 'standard'
  )
  const [email, setEmail] = useState(supplier?.companyContact.email || '')
  const [phone, setPhone] = useState(supplier?.companyContact.phone || '')
  const [address, setAddress] = useState(supplier?.companyContact.address || '')
  const [selectedExpertise, setSelectedExpertise] = useState<Set<string>>(
    new Set(supplier?.expertise || [])
  )
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    supplier?.teamMembers || []
  )
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberTitle, setNewMemberTitle] = useState('')
  const [newMemberFunction, setNewMemberFunction] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberPhone, setNewMemberPhone] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const toggleExpertise = (expertise: string) => {
    const newExpertise = new Set(selectedExpertise)
    if (newExpertise.has(expertise)) {
      newExpertise.delete(expertise)
    } else {
      newExpertise.add(expertise)
    }
    setSelectedExpertise(newExpertise)
  }

  const addTeamMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      setErrors({
        ...errors,
        teamMember: 'Name and email are required',
      })
      return
    }

    const member: TeamMember = {
      id: `tm-${Date.now()}`,
      name: newMemberName,
      title: newMemberTitle,
      function: newMemberFunction,
      email: newMemberEmail,
      phone: newMemberPhone,
      proposalsWon: 0,
      proposalsLost: 0,
      relatedRFPs: [],
    }

    setTeamMembers([...teamMembers, member])
    setNewMemberName('')
    setNewMemberTitle('')
    setNewMemberFunction('')
    setNewMemberEmail('')
    setNewMemberPhone('')
    setErrors({ ...errors, teamMember: '' })
  }

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id))
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'Company name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    if (!phone.trim()) newErrors.phone = 'Phone is required'
    if (!address.trim()) newErrors.address = 'Address is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newSupplier: Supplier = {
      id: supplier?.id || `sup-${Date.now()}`,
      name,
      tier,
      expertise: Array.from(selectedExpertise),
      totalContractValue: supplier?.totalContractValue || 0,
      contractsWon: supplier?.contractsWon || 0,
      contractsLost: supplier?.contractsLost || 0,
      lastContacted: supplier?.lastContacted || null,
      companyContact: {
        email,
        phone,
        address,
      },
      teamMembers,
      engagementHistory: supplier?.engagementHistory || [],
      createdAt: supplier?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSubmit(newSupplier)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-text-primary">
          {supplier ? 'Edit Supplier' : 'Add New Supplier'}
        </h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={onCancel}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Company Info */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
            Company Information
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Company Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter company name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Supplier Tier
              </label>
              <div className="flex gap-2">
                {(['preferred', 'standard', 'new'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      tier === t
                        ? 'bg-brand-green text-white'
                        : 'bg-surface text-text-secondary hover:bg-surface-hover'
                    )}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
            Contact Information
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="company@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Phone
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-xs text-destructive mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Address
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State ZIP"
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && (
                <p className="text-xs text-destructive mt-1">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Expertise */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
            Expertise Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {ALL_EXPERTISE.map((exp) => (
              <Badge
                key={exp}
                variant={
                  selectedExpertise.has(exp) ? 'default' : 'outline'
                }
                onClick={() => toggleExpertise(exp)}
                className={cn(
                  'cursor-pointer',
                  selectedExpertise.has(exp) &&
                    'bg-brand-green text-white hover:bg-brand-green-mid'
                )}
              >
                {exp}
              </Badge>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
            Team Members
          </h3>

          {/* Existing team members */}
          {teamMembers.length > 0 && (
            <div className="space-y-2 mb-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border bg-surface"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {member.title} • {member.function}
                    </p>
                  </div>
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    className="text-destructive hover:text-destructive/80 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add team member form */}
          <div className="p-4 border border-border rounded-lg bg-surface space-y-2">
            <Input
              placeholder="Name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              size={10}
            />
            <Input
              placeholder="Title"
              value={newMemberTitle}
              onChange={(e) => setNewMemberTitle(e.target.value)}
              size={10}
            />
            <Input
              placeholder="Function"
              value={newMemberFunction}
              onChange={(e) => setNewMemberFunction(e.target.value)}
              size={10}
            />
            <Input
              placeholder="Email"
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              size={10}
            />
            <Input
              placeholder="Phone"
              value={newMemberPhone}
              onChange={(e) => setNewMemberPhone(e.target.value)}
              size={10}
            />
            {errors.teamMember && (
              <p className="text-xs text-destructive">{errors.teamMember}</p>
            )}
            <Button
              onClick={addTeamMember}
              variant="outline"
              size="sm"
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Team Member
            </Button>
          </div>
        </div>
      </div>

      {/* Footer with actions */}
      <div className="flex gap-3 p-6 border-t border-border bg-surface">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-brand-green hover:bg-brand-green-mid text-white"
        >
          {supplier ? 'Update Supplier' : 'Add Supplier'}
        </Button>
      </div>
    </div>
  )
}
