'use client'

import { useState, useMemo } from 'react'
import { LibraryDocument, DOCUMENT_CATEGORIES } from '@/types/library'
import { DocumentCard } from './DocumentCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Grid3x3, List, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LibraryListProps {
  documents: LibraryDocument[]
  onDownload?: (id: string) => void
  onDelete?: (id: string) => void
  onEdit?: (document: LibraryDocument) => void
}

export function LibraryList({ documents, onDownload, onDelete, onEdit }: LibraryListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = !selectedCategory || doc.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [documents, searchQuery, selectedCategory])

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {}
    DOCUMENT_CATEGORIES.forEach((cat) => {
      stats[cat] = documents.filter((doc) => doc.category === cat).length
    })
    return stats
  }, [documents])

  return (
    <div className="flex flex-col h-full">
      {/* Search and Controls */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search documents by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* View Mode Toggle */}
          <div className="flex gap-1 border border-border rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-7 w-7 p-0"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-7 w-7 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Category
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    'cursor-pointer',
                    selectedCategory === null && 'bg-brand-green text-white hover:bg-brand-green-mid'
                  )}
                >
                  All
                </Badge>
                {DOCUMENT_CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      'cursor-pointer',
                      selectedCategory === category && 'bg-brand-green text-white hover:bg-brand-green-mid'
                    )}
                  >
                    {category} {categoryStats[category] > 0 && `(${categoryStats[category]})`}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Clear filters button */}
            {selectedCategory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="text-muted-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground mb-4">
        Showing {filteredDocuments.length} of {documents.length} documents
      </div>

      {/* Documents Grid/List */}
      {filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">No documents found matching your search.</p>
          {(searchQuery || selectedCategory) && (
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory(null)
              }}
            >
              Clear filters and search
            </Button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDownload={onDownload}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
