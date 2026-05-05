'use client'

import { useState, useMemo } from 'react'
import { LibraryDocument, DOCUMENT_CATEGORIES } from '@/types/library'
import { DocumentCard } from './DocumentCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Grid3x3, List } from 'lucide-react'

interface LibraryListProps {
  documents: LibraryDocument[]
  onDownload?: (id: string) => void
  onDelete?: (id: string) => void
}

export function LibraryList({ documents, onDownload, onDelete }: LibraryListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search documents by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus:ring-0 flex-1"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Documents
            </button>
            {DOCUMENT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category} {categoryStats[category] > 0 && `(${categoryStats[category]})`}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="w-8 h-8 p-0"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="w-8 h-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredDocuments.length} of {documents.length} documents
      </div>

      {/* Documents Grid/List */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No documents found matching your search.</p>
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
            />
          ))}
        </div>
      )}
    </div>
  )
}
