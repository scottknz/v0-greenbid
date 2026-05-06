'use client'

import React from 'react'
import { X, Edit2, Trash2, Mail, Phone, MapPin, Award } from 'lucide-react'
import { Supplier } from '@/types/supplier'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EngagementTimeline } from './EngagementTimeline'
import { cn } from '@/lib/utils'

interface SupplierDetailPanelProps {
  supplier: Supplier
  onEdit: (supplier: Supplier) => void
  onClose: () => void
  onUpdate: (supplier: Supplier) => void
}

export function SupplierDetailPanel({
  supplier,
  onEdit,
  onClose,
  onUpdate,
}: SupplierDetailPanelProps) {
  const tierColors = {
    preferred: 'bg-brand-green-light text-brand-green border-brand-green/30',
    standard: 'bg-surface text-text-secondary border-border',
    new: 'bg-info-light text-info border-info/30',
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-6 border-b border-border">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-text-primary truncate">
            {supplier.name}
          </h2>
          <Badge
            className={cn('mt-2', tierColors[supplier.tier])}
          >
            {supplier.tier.charAt(0).toUpperCase() + supplier.tier.slice(1)}
          </Badge>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(supplier)}
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Company Metrics */}
        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">
            Performance Metrics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-surface">
              <p className="text-xs text-text-secondary mb-1">Contracts Won</p>
              <p className="text-2xl font-semibold text-brand-green">
                {supplier.contractsWon}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface">
              <p className="text-xs text-text-secondary mb-1">Contracts Lost</p>
              <p className="text-2xl font-semibold text-destructive">
                {supplier.contractsLost}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface">
              <p className="text-xs text-text-secondary mb-1">Win Rate</p>
              <p className="text-2xl font-semibold text-text-primary">
                {supplier.contractsWon + supplier.contractsLost > 0
                  ? Math.round(
                      (supplier.contractsWon /
                        (supplier.contractsWon + supplier.contractsLost)) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-brand-green-light">
            <p className="text-xs text-text-secondary">Total Contract Value</p>
            <p className="text-2xl font-semibold text-brand-green">
              {formatCurrency(supplier.totalContractValue)}
            </p>
          </div>
        </div>

        {/* Company Contact */}
        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">
            Company Contact
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-text-secondary shrink-0" />
              <a
                href={`mailto:${supplier.companyContact.email}`}
                className="text-sm text-brand-green hover:underline truncate"
              >
                {supplier.companyContact.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-text-secondary shrink-0" />
              <a
                href={`tel:${supplier.companyContact.phone}`}
                className="text-sm text-text-primary hover:text-brand-green"
              >
                {supplier.companyContact.phone}
              </a>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-text-secondary shrink-0 mt-0.5" />
              <p className="text-sm text-text-primary">
                {supplier.companyContact.address}
              </p>
            </div>
          </div>
        </div>

        {/* Expertise */}
        {supplier.expertise.length > 0 && (
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
              Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {supplier.expertise.map((exp) => (
                <Badge
                  key={exp}
                  variant="outline"
                  className="bg-brand-green-light text-brand-green border-brand-green/30"
                >
                  {exp}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Team Members */}
        {supplier.teamMembers.length > 0 && (
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">
              Team Members ({supplier.teamMembers.length})
            </h3>
            <div className="space-y-3">
              {supplier.teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">
                        {member.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {member.title} • {member.function}
                      </p>
                      <p className="text-xs text-text-muted mt-1 truncate">
                        {member.email}
                      </p>
                    </div>
                    <div className="text-right shrink-0 text-xs">
                      <div className="font-medium text-text-primary">
                        {member.proposalsWon}W / {member.proposalsLost}L
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Engagement History */}
        {supplier.engagementHistory.length > 0 && (
          <div className="p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">
              Engagement History
            </h3>
            <EngagementTimeline records={supplier.engagementHistory} />
          </div>
        )}
      </div>
    </div>
  )
}
