import React, { useState, useMemo } from 'react'
import { DirectorySupplier } from '@/types/supplier'
import { filterDirectorySuppliers, DIRECTORY_CATEGORIES, DIRECTORY_REGIONS, DIRECTORY_COMPANY_SIZES } from '@/lib/mock-directory-suppliers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Star, Award, CheckCircle, TrendingUp } from 'lucide-react'
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
            <Card key={supplier.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold text-text-primary truncate">{supplier.name}</CardTitle>
                    <p className="text-xs text-text-muted mt-1">{supplier.country} · {supplier.companySize}</p>
                  </div>
                  {supplier.verified && (
                    <Badge className="bg-[#F0FDF4] text-[#166534] border border-[#16A34A]/20 text-[10px] shrink-0">
                      <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-3 pb-3">
                {/* Description */}
                <p className="text-xs text-text-secondary line-clamp-2">{supplier.description}</p>

                {/* Credentials Strip */}
                <div className="flex flex-wrap gap-1.5">
                  {supplier.sustainabilityCredentials.ecovadisRating && (
                    <Badge className={cn('text-[10px] py-0.5 px-1.5 border', getEcoVadisColor(supplier.sustainabilityCredentials.ecovadisRating))}>
                      <Award className="h-2.5 w-2.5 mr-0.5" />
                      EcoVadis {supplier.sustainabilityCredentials.ecovadisRating}
                    </Badge>
                  )}
                  {supplier.sustainabilityCredentials.bCorp && (
                    <Badge className="bg-brand-green-light text-brand-green border border-brand-green/30 text-[10px] py-0.5 px-1.5">
                      B Corp
                    </Badge>
                  )}
                  {supplier.sustainabilityCredentials.sbtiStatus && (
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] py-0.5 px-1.5">
                      SBTi {supplier.sustainabilityCredentials.sbtiStatus === 'validated' ? 'Validated' : 'Committed'}
                    </Badge>
                  )}
                  {supplier.sustainabilityCredentials.iso14001 && (
                    <Badge className="bg-gray-100 text-gray-700 border border-gray-300 text-[10px] py-0.5 px-1.5">
                      ISO 14001
                    </Badge>
                  )}
                  {supplier.sustainabilityCredentials.carbonNeutral && (
                    <Badge className="bg-green-50 text-green-700 border border-green-200 text-[10px] py-0.5 px-1.5">
                      Carbon Neutral
                    </Badge>
                  )}
                </div>

                {/* Emissions & Performance */}
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  {supplier.sustainabilityCredentials.emissionsIntensity && (
                    <span className={cn('font-medium', getEmissionsColor(supplier.sustainabilityCredentials.emissionsIntensityLabel))}>
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      {supplier.sustainabilityCredentials.emissionsIntensity} tCO2e/£M
                    </span>
                  )}
                  {supplier.sustainabilityCredentials.netZeroYear && (
                    <span className="font-medium">Net Zero {supplier.sustainabilityCredentials.netZeroYear}</span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 text-xs border-t border-border pt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-500" />
                    <span className="font-medium">{supplier.rating.toFixed(1)}</span>
                    <span className="text-text-muted">({supplier.reviewCount} reviews)</span>
                  </div>
                  <span className="text-text-muted">·</span>
                  <span className="text-text-muted">{supplier.rfpsCompleted} RFPs</span>
                  <span className="text-text-muted">·</span>
                  <span className="text-text-muted">{supplier.responseRate}% response</span>
                </div>
              </CardContent>

              {/* Action Buttons */}
              <div className="flex gap-2 border-t border-border pt-3">
                <Button
                  size="sm"
                  onClick={() => handleAddToSuppliers(supplier)}
                  disabled={addedSuppliers.has(supplier.id)}
                  className={cn(
                    'flex-1 text-xs',
                    addedSuppliers.has(supplier.id)
                      ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                      : 'bg-brand-green hover:bg-brand-green/90'
                  )}
                >
                  {addedSuppliers.has(supplier.id) ? 'Added' : 'Add to Suppliers'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  title="Invite to RFP - functionality coming soon"
                >
                  Invite to RFP
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
