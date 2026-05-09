import React, { useState } from 'react'
import { DirectorySupplier } from '@/types/supplier'
import { filterDirectorySuppliers, DIRECTORY_CATEGORIES, DIRECTORY_REGIONS, DIRECTORY_COMPANY_SIZES, DIRECTORY_ECOVADIS_RATINGS, EMISSIONS_INTENSITY_LEVELS } from '@/lib/mock-directory-suppliers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Star, Award, CheckCircle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SupplierDirectoryProps {
  suppliers: DirectorySupplier[]
  onAddToSuppliers: (supplier: DirectorySupplier) => void
}

export function SupplierDirectory({ suppliers, onAddToSuppliers }: SupplierDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedCompanySize, setSelectedCompanySize] = useState('')
  const [selectedEcoVadis, setSelectedEcoVadis] = useState('')
  const [selectedEmissions, setSelectedEmissions] = useState('')
  const [addedSuppliers, setAddedSuppliers] = useState<Set<string>>(new Set())

  const filteredSuppliers = filterDirectorySuppliers(suppliers, {
    search: searchTerm,
    category: selectedCategory || undefined,
    region: selectedRegion || undefined,
    companySize: selectedCompanySize || undefined,
    ecovadisRating: selectedEcoVadis || undefined,
    emissionsIntensity: selectedEmissions || undefined,
  })

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
      {/* Filter Panel */}
      <div className="bg-white border-b border-border p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search suppliers by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-md border border-border bg-background text-sm text-text-primary hover:bg-gray-50"
          >
            <option value="">All Categories</option>
            {DIRECTORY_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 rounded-md border border-border bg-background text-sm text-text-primary hover:bg-gray-50"
          >
            <option value="">All Regions</option>
            {DIRECTORY_REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          <select
            value={selectedCompanySize}
            onChange={(e) => setSelectedCompanySize(e.target.value)}
            className="px-3 py-2 rounded-md border border-border bg-background text-sm text-text-primary hover:bg-gray-50"
          >
            <option value="">All Sizes</option>
            {DIRECTORY_COMPANY_SIZES.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>

          <select
            value={selectedEcoVadis}
            onChange={(e) => setSelectedEcoVadis(e.target.value)}
            className="px-3 py-2 rounded-md border border-border bg-background text-sm text-text-primary hover:bg-gray-50"
          >
            <option value="">All EcoVadis</option>
            {DIRECTORY_ECOVADIS_RATINGS.map(rating => (
              <option key={rating.value} value={rating.value}>{rating.label}</option>
            ))}
          </select>

          <select
            value={selectedEmissions}
            onChange={(e) => setSelectedEmissions(e.target.value)}
            className="px-3 py-2 rounded-md border border-border bg-background text-sm text-text-primary hover:bg-gray-50"
          >
            <option value="">All Emissions</option>
            {EMISSIONS_INTENSITY_LEVELS.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('')
              setSelectedRegion('')
              setSelectedCompanySize('')
              setSelectedEcoVadis('')
              setSelectedEmissions('')
            }}
            className="text-xs"
          >
            Clear Filters
          </Button>
        </div>

        <p className="text-xs text-text-muted">{filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''} found</p>
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
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <p className="text-sm text-text-secondary">No suppliers found matching your criteria.</p>
              <Button variant="outline" size="sm" onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
                setSelectedRegion('')
                setSelectedCompanySize('')
                setSelectedEcoVadis('')
                setSelectedEmissions('')
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
