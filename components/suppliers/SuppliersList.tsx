'use client'

import React, { useState, useMemo } from 'react'
import { Search, Filter, Plus, Upload } from 'lucide-react'
import { Supplier, TeamMember, ALL_EXPERTISE } from '@/types/supplier'
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
  onDelete: (supplier: Supplier) => void
  onContactClick?: (supplier: Supplier, member: TeamMember) => void
}

export function SuppliersList({
  suppliers,
  onAddSupplier,
  onImportCSV,
  onViewDetails,
  onEdit,
  onDelete,
  onContactClick,
}: SuppliersListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSuppliers, setExpandedSuppliers] = useState<Set<string>>(
    new Set()
  )
  const [selectedTiers, setSelectedTiers] = useState<Set<string>>(new Set())
  const [selectedExpertise, setSelectedExpertise] = useState<Set<string>>(
    new Set()
  )
  const [selectedCerts, setSelectedCerts] = useState<Set<string>>(new Set())
  const [selectedEmissions, setSelectedEmissions] = useState<string>('')
  const [netZeroOnly, setNetZeroOnly] = useState(false)
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

  const toggleCert = (cert: string) => {
    const next = new Set(selectedCerts)
    if (next.has(cert)) {
      next.delete(cert)
    } else {
      next.add(cert)
    }
    setSelectedCerts(next)
  }

  const certMatches = (supplier: Supplier, cert: string): boolean => {
    const c = supplier.sustainabilityCredentials
    if (!c) return false
    switch (cert) {
      case 'bcorp':       return !!c.bCorp
      case 'sbti-val':    return c.sbtiStatus === 'validated'
      case 'sbti-com':    return c.sbtiStatus === 'committed'
      case 'iso14001':    return !!c.iso14001
      case 'carbonneutral': return !!c.carbonNeutral
      case 'ecovadis-gold':   return c.ecovadisRating === 'gold'
      case 'ecovadis-silver': return c.ecovadisRating === 'silver'
      case 'ecovadis-bronze': return c.ecovadisRating === 'bronze'
      default: return false
    }
  }

  const hasActiveFilters =
    selectedTiers.size > 0 ||
    selectedExpertise.size > 0 ||
    selectedCerts.size > 0 ||
    selectedEmissions !== '' ||
    netZeroOnly

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

      const matchesCerts =
        selectedCerts.size === 0 ||
        [...selectedCerts].every((cert) => certMatches(supplier, cert))

      const matchesEmissions =
        selectedEmissions === '' ||
        supplier.sustainabilityCredentials?.emissionsIntensityLabel === selectedEmissions

      const matchesNetZero =
        !netZeroOnly || !!supplier.sustainabilityCredentials?.netZeroYear

      return matchesSearch && matchesTier && matchesExpertise && matchesCerts && matchesEmissions && matchesNetZero
    })
  }, [searchTerm, selectedTiers, selectedExpertise, selectedCerts, selectedEmissions, netZeroOnly, suppliers])

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
              className={cn('gap-2', showFilters && 'bg-[#16A34A] hover:bg-[#15803D] border-[#16A34A]')}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className={cn(
                  'inline-flex items-center justify-center h-4 w-4 rounded-full text-[10px] font-bold',
                  showFilters ? 'bg-white text-[#16A34A]' : 'bg-[#16A34A] text-white'
                )}>
                  {selectedTiers.size + selectedExpertise.size + selectedCerts.size + (selectedEmissions ? 1 : 0) + (netZeroOnly ? 1 : 0)}
                </span>
              )}
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
            <div className="space-y-5 pt-4 border-t border-border">

              {/* Tier filter */}
              <div>
                <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">Supplier Tier</p>
                <div className="flex gap-2 flex-wrap">
                  {['preferred', 'standard', 'new'].map((tier) => (
                    <Badge
                      key={tier}
                      variant={selectedTiers.has(tier) ? 'default' : 'outline'}
                      onClick={() => toggleTier(tier)}
                      className={cn(
                        'cursor-pointer select-none',
                        selectedTiers.has(tier) && 'bg-brand-green text-white hover:bg-brand-green-mid'
                      )}
                    >
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Expertise filter */}
              <div>
                <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">Expertise</p>
                <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                  {ALL_EXPERTISE.map((expertise) => (
                    <Badge
                      key={expertise}
                      variant={selectedExpertise.has(expertise) ? 'default' : 'outline'}
                      onClick={() => toggleExpertise(expertise)}
                      className={cn(
                        'cursor-pointer select-none',
                        selectedExpertise.has(expertise) && 'bg-brand-green text-white hover:bg-brand-green-mid'
                      )}
                    >
                      {expertise}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sustainability separator */}
              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wide">Sustainability</p>

                {/* EcoVadis Tier */}
                <div>
                  <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">EcoVadis Rating</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { value: 'ecovadis-gold',   label: 'Gold',   cls: 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200' },
                      { value: 'ecovadis-silver', label: 'Silver', cls: 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200' },
                      { value: 'ecovadis-bronze', label: 'Bronze', cls: 'bg-orange-100 text-orange-900 border-orange-300 hover:bg-orange-200' },
                    ].map(({ value, label, cls }) => (
                      <Badge
                        key={value}
                        onClick={() => toggleCert(value)}
                        className={cn(
                          'cursor-pointer select-none border text-xs py-1 px-2',
                          selectedCerts.has(value) ? cls + ' ring-1 ring-offset-1 ring-current' : 'bg-background text-text-secondary border-border hover:bg-gray-50'
                        )}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">Certifications</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { value: 'bcorp',        label: 'B Corp',         activeCls: 'bg-green-100 text-green-800 border-green-300' },
                      { value: 'sbti-val',     label: 'SBTi Validated', activeCls: 'bg-blue-100 text-blue-800 border-blue-300' },
                      { value: 'sbti-com',     label: 'SBTi Committed', activeCls: 'bg-blue-50 text-blue-700 border-blue-200' },
                      { value: 'iso14001',     label: 'ISO 14001',      activeCls: 'bg-gray-200 text-gray-800 border-gray-400' },
                      { value: 'carbonneutral',label: 'Carbon Neutral',  activeCls: 'bg-green-100 text-green-800 border-green-300' },
                    ].map(({ value, label, activeCls }) => (
                      <Badge
                        key={value}
                        onClick={() => toggleCert(value)}
                        className={cn(
                          'cursor-pointer select-none border text-xs py-1 px-2',
                          selectedCerts.has(value)
                            ? activeCls + ' ring-1 ring-offset-1 ring-current'
                            : 'bg-background text-text-secondary border-border hover:bg-gray-50'
                        )}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Emissions Intensity */}
                <div>
                  <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">Emissions Intensity</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { value: 'low',    label: 'Low',    activeCls: 'bg-green-100 text-green-800 border-green-400' },
                      { value: 'medium', label: 'Medium', activeCls: 'bg-amber-100 text-amber-800 border-amber-400' },
                      { value: 'high',   label: 'High',   activeCls: 'bg-red-100 text-red-800 border-red-400' },
                    ].map(({ value, label, activeCls }) => (
                      <Badge
                        key={value}
                        onClick={() => setSelectedEmissions(selectedEmissions === value ? '' : value)}
                        className={cn(
                          'cursor-pointer select-none border text-xs py-1 px-2',
                          selectedEmissions === value
                            ? activeCls + ' ring-1 ring-offset-1 ring-current'
                            : 'bg-background text-text-secondary border-border hover:bg-gray-50'
                        )}
                      >
                        {label} Emissions
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Net Zero toggle */}
                <div className="flex items-center gap-3">
                  <button
                    role="switch"
                    aria-checked={netZeroOnly}
                    onClick={() => setNetZeroOnly(!netZeroOnly)}
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus-visible:outline-none',
                      netZeroOnly ? 'bg-[#16A34A] border-[#16A34A]' : 'bg-gray-200 border-gray-200'
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform',
                        netZeroOnly ? 'translate-x-4' : 'translate-x-0'
                      )}
                    />
                  </button>
                  <span className="text-xs font-medium text-text-secondary">Has Net Zero target</span>
                </div>
              </div>

              {/* Clear filters button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTiers(new Set())
                    setSelectedExpertise(new Set())
                    setSelectedCerts(new Set())
                    setSelectedEmissions('')
                    setNetZeroOnly(false)
                  }}
                  className="text-text-secondary"
                >
                  Clear All Filters
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
            {(searchTerm || hasActiveFilters) && (
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedTiers(new Set())
                  setSelectedExpertise(new Set())
                  setSelectedCerts(new Set())
                  setSelectedEmissions('')
                  setNetZeroOnly(false)
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
                onDelete={onDelete}
                onContactClick={onContactClick}
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
