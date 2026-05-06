'use client'

import React, { useState, useMemo } from 'react'
import { X, Search, Filter, Check } from 'lucide-react'
import { Supplier, ALL_EXPERTISE } from '@/types/supplier'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SupplierSelectionModalProps {
  suppliers: Supplier[]
  onSelectSuppliers: (selected: Supplier[]) => void
  onCancel: () => void
  title?: string
  description?: string
}

export function SupplierSelectionModal({
  suppliers,
  onSelectSuppliers,
  onCancel,
  title = 'Select Suppliers to Invite',
  description = 'Choose which suppliers you&apos;d like to invite to submit a proposal for this RFP',
}: SupplierSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<Set<string>>(
    new Set()
  )
  const [selectedTiers, setSelectedTiers] = useState<Set<string>>(new Set())
  const [selectedExpertise, setSelectedExpertise] = useState<Set<string>>(
    new Set()
  )
  const [showFilters, setShowFilters] = useState(false)

  const toggleSupplier = (supplierId: string) => {
    const newSelected = new Set(selectedSupplierIds)
    if (newSelected.has(supplierId)) {
      newSelected.delete(supplierId)
    } else {
      newSelected.add(supplierId)
    }
    setSelectedSupplierIds(newSelected)
  }

  const toggleTier = (tier: string) => {
    const newTiers = new Set(selectedTiers)
    if (newTiers.has(tier)) {
      newTiers.delete(tier)
    } else {
      newTiers.add(tier)
    }
    setSelectedTiers(newTiers)
  }

  const toggleExpertise = (expertise: string) => {
    const newExpertise = new Set(selectedExpertise)
    if (newExpertise.has(expertise)) {
      newExpertise.delete(expertise)
    } else {
      newExpertise.add(expertise)
    }
    setSelectedExpertise(newExpertise)
  }

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.companyContact.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesTier =
        selectedTiers.size === 0 || selectedTiers.has(supplier.tier)

      const matchesExpertise =
        selectedExpertise.size === 0 ||
        supplier.expertise.some((exp) => selectedExpertise.has(exp))

      return matchesSearch && matchesTier && matchesExpertise
    })
  }, [searchTerm, selectedTiers, selectedExpertise, suppliers])

  const sortedSuppliers = useMemo(() => {
    const tierOrder = { preferred: 0, standard: 1, new: 2 }
    return [...filteredSuppliers].sort(
      (a, b) => tierOrder[a.tier] - tierOrder[b.tier]
    )
  }, [filteredSuppliers])

  const selectedSuppliers = Array.from(selectedSupplierIds)
    .map((id) => suppliers.find((s) => s.id === id))
    .filter((s): s is Supplier => s !== undefined)

  const handleInvite = () => {
    onSelectSuppliers(selectedSuppliers)
  }

  const tierColors = {
    preferred: 'bg-brand-green-light text-brand-green border-brand-green/30',
    standard: 'bg-surface text-text-secondary border-border',
    new: 'bg-info-light text-info border-info/30',
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-6 border-b border-border">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onCancel}
          className="h-8 w-8 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Search and filters */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted pointer-events-none" />
            <Input
              placeholder="Search suppliers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="space-y-3 pt-3 border-t border-border">
            {/* Tier filter */}
            <div>
              <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
                Supplier Tier
              </p>
              <div className="flex gap-2 flex-wrap">
                {['preferred', 'standard', 'new'].map((tier) => (
                  <Badge
                    key={tier}
                    variant={
                      selectedTiers.has(tier) ? 'default' : 'outline'
                    }
                    onClick={() => toggleTier(tier)}
                    className={cn(
                      'cursor-pointer',
                      selectedTiers.has(tier) &&
                        'bg-brand-green text-white hover:bg-brand-green-mid'
                    )}
                  >
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Expertise filter */}
            <div>
              <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
                Expertise
              </p>
              <div className="flex gap-2 flex-wrap max-h-20 overflow-y-auto">
                {ALL_EXPERTISE.map((expertise) => (
                  <Badge
                    key={expertise}
                    variant={
                      selectedExpertise.has(expertise)
                        ? 'default'
                        : 'outline'
                    }
                    onClick={() => toggleExpertise(expertise)}
                    className={cn(
                      'cursor-pointer text-xs',
                      selectedExpertise.has(expertise) &&
                        'bg-brand-green text-white hover:bg-brand-green-mid'
                    )}
                  >
                    {expertise}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Clear filters button */}
            {(selectedTiers.size > 0 || selectedExpertise.size > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTiers(new Set())
                  setSelectedExpertise(new Set())
                }}
                className="text-text-secondary"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Suppliers list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {sortedSuppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-text-secondary">
            <p className="text-sm">No suppliers found</p>
            {(searchTerm || selectedTiers.size > 0 || selectedExpertise.size > 0) && (
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedTiers(new Set())
                  setSelectedExpertise(new Set())
                }}
              >
                Clear filters and search
              </Button>
            )}
          </div>
        ) : (
          sortedSuppliers.map((supplier) => (
            <button
              key={supplier.id}
              onClick={() => toggleSupplier(supplier.id)}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors text-left',
                selectedSupplierIds.has(supplier.id)
                  ? 'border-brand-green bg-brand-green-light/50'
                  : 'border-border hover:border-border-strong bg-surface-hover/50 hover:bg-surface-hover'
              )}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  'h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                  selectedSupplierIds.has(supplier.id)
                    ? 'bg-brand-green border-brand-green'
                    : 'border-border'
                )}
              >
                {selectedSupplierIds.has(supplier.id) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>

              {/* Company info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">
                  {supplier.name}
                </p>
                <p className="text-sm text-text-secondary truncate">
                  {supplier.companyContact.email}
                </p>
              </div>

              {/* Tier badge */}
              <Badge
                className={cn('shrink-0', tierColors[supplier.tier])}
              >
                {supplier.tier.charAt(0).toUpperCase() + supplier.tier.slice(1)}
              </Badge>

              {/* Win rate */}
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-sm font-medium text-text-primary">
                  {supplier.contractsWon + supplier.contractsLost > 0
                    ? Math.round(
                        (supplier.contractsWon /
                          (supplier.contractsWon + supplier.contractsLost)) *
                          100
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-text-muted">Win Rate</p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer with actions and count */}
      <div className="border-t border-border bg-surface px-6 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">
              {selectedSupplierIds.size}
            </span>{' '}
            supplier{selectedSupplierIds.size !== 1 ? 's' : ''} selected
          </p>
          {selectedSupplierIds.size > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setSelectedSupplierIds(new Set())}
              className="text-text-secondary"
            >
              Clear selection
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={selectedSupplierIds.size === 0}
            className="flex-1 bg-brand-green hover:bg-brand-green-mid text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Invite {selectedSupplierIds.size > 0 ? selectedSupplierIds.size : ''}{' '}
            Supplier{selectedSupplierIds.size !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </div>
  )
}
