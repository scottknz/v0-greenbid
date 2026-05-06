'use client'

import React, { useState, useMemo } from 'react'
import { Search, Filter, Plus, Upload } from 'lucide-react'
import { Supplier, ALL_EXPERTISE } from '@/types/supplier'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SupplierRow } from './SupplierRow'
import { cn } from '@/lib/utils'

interface SuppliersListProps {
  suppliers: Supplier[]
  onAddSupplier: () => void
  onImportCSV: () => void
  onViewDetails: (supplier: Supplier) => void
  onEdit: (supplier: Supplier) => void
}

export function SuppliersList({
  suppliers,
  onAddSupplier,
  onImportCSV,
  onViewDetails,
  onEdit,
}: SuppliersListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSuppliers, setExpandedSuppliers] = useState<Set<string>>(
    new Set()
  )
  const [selectedTiers, setSelectedTiers] = useState<Set<string>>(new Set())
  const [selectedExpertise, setSelectedExpertise] = useState<Set<string>>(
    new Set()
  )
  const [showFilters, setShowFilters] = useState(false)

  const toggleExpand = (supplierId: string) => {
    const newExpanded = new Set(expandedSuppliers)
    if (newExpanded.has(supplierId)) {
      newExpanded.delete(supplierId)
    } else {
      newExpanded.add(supplierId)
    }
    setExpandedSuppliers(newExpanded)
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
          .includes(searchTerm.toLowerCase()) ||
        supplier.teamMembers.some(
          (member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        )

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

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with search and actions */}
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted pointer-events-none" />
              <Input
                placeholder="Search suppliers by name, email, or contact..."
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
              Filters
            </Button>

            <Button
              size="sm"
              onClick={onImportCSV}
              variant="outline"
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>

            <Button
              size="sm"
              onClick={onAddSupplier}
              className="gap-2 bg-brand-green hover:bg-brand-green-mid"
            >
              <Plus className="h-4 w-4" />
              Add Supplier
            </Button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="space-y-4 pt-4 border-t border-border">
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
                <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
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
                        'cursor-pointer',
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
      </div>

      {/* Suppliers list */}
      <div className="flex-1 overflow-y-auto">
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
          <div className="border-t border-border">
            {sortedSuppliers.map((supplier) => (
              <SupplierRow
                key={supplier.id}
                supplier={supplier}
                isExpanded={expandedSuppliers.has(supplier.id)}
                onToggleExpand={() => toggleExpand(supplier.id)}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer with summary */}
      {sortedSuppliers.length > 0 && (
        <div className="border-t border-border bg-surface px-6 py-3">
          <p className="text-sm text-text-secondary">
            Showing <span className="font-medium">{sortedSuppliers.length}</span>{' '}
            of <span className="font-medium">{suppliers.length}</span> suppliers
          </p>
        </div>
      )}
    </div>
  )
}
