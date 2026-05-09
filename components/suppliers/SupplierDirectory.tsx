import React, { useState, useMemo } from 'react'
import { DirectorySupplier } from '@/types/supplier'
import { filterDirectorySuppliers, DIRECTORY_CATEGORIES, DIRECTORY_REGIONS, DIRECTORY_COMPANY_SIZES } from '@/lib/mock-directory-suppliers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Star, Award, CheckCircle, TrendingUp, Plus, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SupplierDirectoryProps {
  suppliers: DirectorySupplier[]
  onAddToSuppliers: (supplier: DirectorySupplier) => void
}

export function SupplierDirectory({ suppliers, onAddToSuppliers }: SupplierDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set())
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set())
  const [selectedCerts, setSelectedCerts] = useState<Set<string>>(new Set())
  const [selectedEmissions, setSelectedEmissions] = useState('')
  const [netZeroOnly, setNetZeroOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [addedSuppliers, setAddedSuppliers] = useState<Set<string>>(new Set())

  const toggleSet = (set: Set<string>, setter: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => {
    const next = new Set(set)
    next.has(value) ? next.delete(value) : next.add(value)
    setter(next)
  }

  const hasActiveFilters =
    selectedCategories.size > 0 ||
    selectedRegions.size > 0 ||
    selectedSizes.size > 0 ||
    selectedCerts.size > 0 ||
    selectedEmissions !== '' ||
    netZeroOnly

  const activeFilterCount =
    selectedCategories.size + selectedRegions.size + selectedSizes.size +
    selectedCerts.size + (selectedEmissions ? 1 : 0) + (netZeroOnly ? 1 : 0)

  const clearAll = () => {
    setSelectedCategories(new Set())
    setSelectedRegions(new Set())
    setSelectedSizes(new Set())
    setSelectedCerts(new Set())
    setSelectedEmissions('')
    setNetZeroOnly(false)
  }

  const filteredSuppliers = useMemo(() => filterDirectorySuppliers(suppliers, {
    search: searchTerm,
    category: selectedCategories.size === 1 ? [...selectedCategories][0] : undefined,
    region: selectedRegions.size === 1 ? [...selectedRegions][0] : undefined,
    companySize: selectedSizes.size === 1 ? [...selectedSizes][0] : undefined,
    certifications: selectedCerts,
    emissionsIntensity: selectedEmissions || undefined,
    netZeroOnly,
  }), [searchTerm, selectedCategories, selectedRegions, selectedSizes, selectedCerts, selectedEmissions, netZeroOnly, suppliers])

  const handleAddToSuppliers = (supplier: DirectorySupplier) => {
    onAddToSuppliers(supplier)
    setAddedSuppliers(prev => new Set([...prev, supplier.id]))
  }

  const getEcoVadisColor = (rating?: string) => {
    switch (rating) {
      case 'gold':
        return 'bg-amber-100 text-amber-900 border-amber-300'
      case 'silver':
        return 'bg-slate-100 text-slate-900 border-slate-300'
      case 'bronze':
        return 'bg-orange-100 text-orange-900 border-orange-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header / Filter Panel */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex flex-col gap-4">

          {/* Search row */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
              <Input
                placeholder="Search suppliers by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn('gap-2 shrink-0', showFilters && 'bg-[#16A34A] hover:bg-[#15803D] border-[#16A34A]')}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className={cn(
                  'inline-flex items-center justify-center h-4 w-4 rounded-full text-[10px] font-bold',
                  showFilters ? 'bg-white text-[#16A34A]' : 'bg-[#16A34A] text-white'
                )}>
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Collapsible filter panel */}
          {showFilters && (
            <div className="space-y-5 pt-4 border-t border-border">

              {/* Category */}
              <div>
                <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">Category</p>
                <div className="flex gap-2 flex-wrap">
                  {DIRECTORY_CATEGORIES.map((cat) => (
                    <Badge
                      key={cat}
                      variant={selectedCategories.has(cat) ? 'default' : 'outline'}
                      onClick={() => toggleSet(selectedCategories, setSelectedCategories, cat)}
                      className={cn(
                        'cursor-pointer select-none',
                        selectedCategories.has(cat) && 'bg-brand-green text-white hover:bg-brand-green-mid'
                      )}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Region */}
              <div>
                <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">Region</p>
                <div className="flex gap-2 flex-wrap">
                  {DIRECTORY_REGIONS.map((region) => (
                    <Badge
                      key={region}
                      variant={selectedRegions.has(region) ? 'default' : 'outline'}
                      onClick={() => toggleSet(selectedRegions, setSelectedRegions, region)}
                      className={cn(
                        'cursor-pointer select-none',
                        selectedRegions.has(region) && 'bg-brand-green text-white hover:bg-brand-green-mid'
                      )}
                    >
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Company Size */}
              <div>
                <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">Company Size</p>
                <div className="flex gap-2 flex-wrap">
                  {DIRECTORY_COMPANY_SIZES.map(({ value, label }) => (
                    <Badge
                      key={value}
                      variant={selectedSizes.has(value) ? 'default' : 'outline'}
                      onClick={() => toggleSet(selectedSizes, setSelectedSizes, value)}
                      className={cn(
                        'cursor-pointer select-none',
                        selectedSizes.has(value) && 'bg-brand-green text-white hover:bg-brand-green-mid'
                      )}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sustainability section */}
              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wide">Sustainability</p>

                {/* EcoVadis */}
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
                        onClick={() => toggleSet(selectedCerts, setSelectedCerts, value)}
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
                      { value: 'bcorp',         label: 'B Corp',          activeCls: 'bg-green-100 text-green-800 border-green-300' },
                      { value: 'sbti-val',      label: 'SBTi Validated',  activeCls: 'bg-blue-100 text-blue-800 border-blue-300' },
                      { value: 'sbti-com',      label: 'SBTi Committed',  activeCls: 'bg-blue-50 text-blue-700 border-blue-200' },
                      { value: 'iso14001',      label: 'ISO 14001',       activeCls: 'bg-gray-200 text-gray-800 border-gray-400' },
                      { value: 'carbonneutral', label: 'Carbon Neutral',  activeCls: 'bg-green-100 text-green-800 border-green-300' },
                    ].map(({ value, label, activeCls }) => (
                      <Badge
                        key={value}
                        onClick={() => toggleSet(selectedCerts, setSelectedCerts, value)}
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
                    <span className={cn(
                      'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform',
                      netZeroOnly ? 'translate-x-4' : 'translate-x-0'
                    )} />
                  </button>
                  <span className="text-xs font-medium text-text-secondary">Has Net Zero target</span>
                </div>
              </div>

              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearAll} className="text-text-secondary">
                  Clear All Filters
                </Button>
              )}
            </div>
          )}

          <p className="text-xs text-text-muted">
            {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSuppliers.map(supplier => (
            <Card key={supplier.id} className="flex flex-col overflow-hidden group hover:shadow-lg hover:border-[#16A34A]/30 transition-all duration-200">
              {/* Header */}
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold text-text-primary truncate">{supplier.name}</CardTitle>
                    <p className="text-xs text-text-muted mt-1.5">{supplier.country} · {supplier.companySize}</p>
                  </div>
                  {supplier.verified && (
                    <Badge className="bg-[#F0FDF4] text-[#166534] border border-[#16A34A]/20 text-[11px] shrink-0 font-medium">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>

              {/* Main Content */}
              <CardContent className="flex-1 flex flex-col gap-4 py-4">
                {/* Description */}
                <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">{supplier.description}</p>

                {/* Credentials Strip - Increased font size and padding */}
                <div className="flex flex-wrap gap-2">
                  {supplier.sustainabilityCredentials.ecovadisRating && (
                    <Badge className={cn('text-[11px] py-1 px-2 border font-medium', getEcoVadisColor(supplier.sustainabilityCredentials.ecovadisRating))}>
                      <Award className="h-3 w-3 mr-1" />
                      EcoVadis {supplier.sustainabilityCredentials.ecovadisRating}
                    </Badge>
                  )}
                  {supplier.sustainabilityCredentials.bCorp && (
                    <Badge className="bg-brand-green-light text-brand-green border border-brand-green/30 text-[11px] py-1 px-2 font-medium">
                      B Corp
                    </Badge>
                  )}
                  {supplier.sustainabilityCredentials.sbtiStatus && (
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] py-1 px-2 font-medium">
                      SBTi {supplier.sustainabilityCredentials.sbtiStatus === 'validated' ? 'Validated' : 'Committed'}
                    </Badge>
                  )}
                  {supplier.sustainabilityCredentials.iso14001 && (
                    <Badge className="bg-gray-100 text-gray-700 border border-gray-300 text-[11px] py-1 px-2 font-medium">
                      ISO 14001
                    </Badge>
                  )}
                  {supplier.sustainabilityCredentials.carbonNeutral && (
                    <Badge className="bg-green-50 text-green-700 border border-green-200 text-[11px] py-1 px-2 font-medium">
                      Carbon Neutral
                    </Badge>
                  )}
                </div>

                {/* Emissions & Performance row */}
                <div className="grid grid-cols-2 gap-3 bg-surface-hover/50 rounded-lg p-3">
                  {supplier.sustainabilityCredentials.emissionsIntensity && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className={cn('h-4 w-4', getEmissionsColor(supplier.sustainabilityCredentials.emissionsIntensityLabel))} />
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wide font-medium">Emissions</p>
                        <p className={cn('text-sm font-semibold', getEmissionsColor(supplier.sustainabilityCredentials.emissionsIntensityLabel))}>
                          {supplier.sustainabilityCredentials.emissionsIntensity} tCO2e/£M
                        </p>
                      </div>
                    </div>
                  )}
                  {supplier.sustainabilityCredentials.netZeroYear && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wide font-medium">Target</p>
                        <p className="text-sm font-semibold text-green-700">Net Zero {supplier.sustainabilityCredentials.netZeroYear}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats - improved layout with icon-led design */}
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-surface rounded border border-border/50">
                    <Star className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Rating</p>
                      <p className="font-bold text-text-primary">{supplier.rating.toFixed(1)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-surface rounded border border-border/50">
                    <CheckCircle className="h-3.5 w-3.5 text-[#16A34A] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">RFPs</p>
                      <p className="font-bold text-text-primary">{supplier.rfpsCompleted}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-surface rounded border border-border/50">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Response</p>
                      <p className="font-bold text-text-primary">{supplier.responseRate}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Action Footer */}
              <div className="px-4 py-3 border-t border-border bg-background flex gap-2 group-hover:bg-green-50/30 transition-colors">
                <Button
                  onClick={() => handleAddToSuppliers(supplier)}
                  disabled={addedSuppliers.has(supplier.id)}
                  className={cn(
                    'flex-1 text-sm font-semibold gap-2 transition-all',
                    addedSuppliers.has(supplier.id)
                      ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                      : 'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-sm hover:shadow-md'
                  )}
                >
                  <Plus className="h-4 w-4" />
                  {addedSuppliers.has(supplier.id) ? 'Added' : 'Add to Our Suppliers'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-sm font-semibold gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  title="Invite to RFP - functionality coming soon"
                >
                  <Send className="h-4 w-4" />
                  Invite
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="flex items-center justify-center h-full min-h-48">
            <div className="text-center space-y-2">
              <p className="text-sm text-text-secondary">No suppliers found matching your criteria.</p>
              {(searchTerm || hasActiveFilters) && (
                <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); clearAll() }}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
