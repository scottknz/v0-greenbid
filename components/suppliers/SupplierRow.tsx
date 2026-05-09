'use client'

import React, { useState } from 'react'
import { ChevronDown, MoreHorizontal, Mail, Phone, MapPin, Edit, Trash2, Award, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Supplier, TeamMember } from '@/types/supplier'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SupplierRowProps {
  supplier: Supplier
  isExpanded: boolean
  onToggleExpand: () => void
  onViewDetails: (supplier: Supplier) => void
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
  onContactClick?: (supplier: Supplier, member: TeamMember) => void
}

export function SupplierRow({
  supplier,
  isExpanded,
  onToggleExpand,
  onViewDetails,
  onEdit,
  onDelete,
  onContactClick,
}: SupplierRowProps) {
  const tierColors = {
    preferred: 'bg-brand-green-light text-brand-green',
    standard: 'bg-surface text-text-secondary',
    new: 'bg-info-light text-info',
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const lastContactedDays =
    supplier.lastContacted
      ? Math.floor(
          (Date.now() - new Date(supplier.lastContacted).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null

  const getEcoVadisColor = (rating?: string) => {
    switch (rating) {
      case 'gold':
        return 'bg-amber-100 text-amber-900 border-amber-300'
      case 'silver':
        return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'bronze':
        return 'bg-orange-100 text-orange-900 border-orange-300'
      default:
        return ''
    }
  }

  const getEmissionsColor = (intensity?: string) => {
    switch (intensity) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-amber-600'
      case 'high':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const credentials = supplier.sustainabilityCredentials

  return (
    <>
      <div
        className={cn(
          'border-b border-border transition-colors',
          'hover:bg-surface-hover cursor-pointer'
        )}
      >
        <div className="flex items-center gap-4 px-6 py-4">
          {/* Expand button */}
          <button
            onClick={onToggleExpand}
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-surface transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <ChevronDown
              className={cn('h-5 w-5 text-text-secondary transition-transform', {
                'rotate-180': isExpanded,
              })}
            />
          </button>

          {/* Company info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-text-primary truncate">
                {supplier.name}
              </h3>
              {supplier.tier === 'preferred' && (
                <Badge className="bg-brand-green-light text-brand-green text-[10px]">Preferred</Badge>
              )}
            </div>
            <p className="text-sm text-text-secondary truncate mb-2">
              {supplier.companyContact.email}
            </p>

            {/* Credentials Strip */}
            {credentials && (
              <div className="flex flex-wrap gap-1">
                {credentials.ecovadisRating && (
                  <Badge className={cn('text-[10px] py-0.5 px-1 border', getEcoVadisColor(credentials.ecovadisRating))}>
                    <Award className="h-2.5 w-2.5 mr-0.5" />
                    EcoVadis {credentials.ecovadisRating}
                  </Badge>
                )}
                {credentials.bCorp && (
                  <Badge className="bg-green-50 text-green-700 border border-green-200 text-[10px] py-0.5 px-1">
                    B Corp
                  </Badge>
                )}
                {credentials.sbtiStatus && (
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] py-0.5 px-1">
                    SBTi {credentials.sbtiStatus === 'validated' ? 'Validated' : 'Committed'}
                  </Badge>
                )}
                {credentials.iso14001 && (
                  <Badge className="bg-gray-100 text-gray-700 border border-gray-300 text-[10px] py-0.5 px-1">
                    ISO 14001
                  </Badge>
                )}
                {credentials.carbonNeutral && (
                  <Badge className="bg-green-50 text-green-700 border border-green-200 text-[10px] py-0.5 px-1">
                    Carbon Neutral
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Emissions & Net Zero */}
          {credentials && (credentials.emissionsIntensity || credentials.netZeroYear) && (
            <div className="hidden lg:flex flex-col gap-1 shrink-0 text-xs w-40">
              {credentials.emissionsIntensity && (
                <div className={cn('font-medium', getEmissionsColor(credentials.emissionsIntensityLabel))}>
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {credentials.emissionsIntensity} tCO2e/£M
                </div>
              )}
              {credentials.netZeroYear && (
                <div className="text-text-secondary font-medium">
                  Net Zero {credentials.netZeroYear}
                </div>
              )}
            </div>
          )}

          {/* Metrics */}
          <div className="hidden sm:flex items-center gap-6 shrink-0">
            <div className="text-center">
              <p className="text-sm font-medium text-text-primary">
                {supplier.contractsWon}
              </p>
              <p className="text-xs text-text-muted">Won</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-text-primary">
                {supplier.contractsLost}
              </p>
              <p className="text-xs text-text-muted">Lost</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">
                {formatCurrency(supplier.totalContractValue)}
              </p>
              <p className="text-xs text-text-muted">Value</p>
            </div>
          </div>

          {/* Last contacted */}
          <div className="hidden md:block text-right shrink-0 w-24">
            {lastContactedDays !== null ? (
              <>
                <p className="text-sm font-medium text-text-primary">
                  {lastContactedDays}d ago
                </p>
                <p className="text-xs text-text-muted">Last contacted</p>
              </>
            ) : (
              <p className="text-xs text-text-muted">Never contacted</p>
            )}
          </div>

          {/* Action menu */}
          <div className="shrink-0 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(supplier)}
              className="text-text-secondary hover:text-text-primary"
            >
              Details
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(supplier)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(supplier)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Team members - expandable section */}
        {isExpanded && supplier.teamMembers.length > 0 && (
          <div className="bg-surface-hover/50 border-t border-border px-6 py-3">
            <p className="text-xs font-medium text-text-secondary mb-3 uppercase tracking-wide">
              Team Members
            </p>
            <div className="space-y-2">
              {supplier.teamMembers.map((member) => (
                <TeamMemberRow 
                  key={member.id} 
                  member={member} 
                  onClick={() => onContactClick?.(supplier, member)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function TeamMemberRow({ member, onClick }: { member: TeamMember; onClick?: () => void }) {
  return (
    <div 
      className="flex items-center gap-4 py-2 px-4 rounded bg-background border border-border/50 cursor-pointer hover:bg-surface-hover hover:border-[#16A34A]/30 transition-colors"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate hover:text-[#16A34A]">
          {member.name}
        </p>
        <p className="text-xs text-text-secondary truncate">
          {member.title} • {member.function}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-3 shrink-0 text-xs">
        <div className="flex items-center gap-1 text-text-secondary">
          <Mail className="h-3 w-3" />
          <span className="truncate">{member.email}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-center">
          <p className="text-xs font-medium text-text-primary">
            {member.proposalsWon}
          </p>
          <p className="text-[10px] text-text-muted">Won</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-text-primary">
            {member.proposalsLost}
          </p>
          <p className="text-[10px] text-text-muted">Lost</p>
        </div>
      </div>
    </div>
  )
}
