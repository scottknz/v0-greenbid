'use client'

import { LibraryDocument, CATEGORY_COLORS } from '@/types/library'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { FileText, Download, Trash2, MoreVertical, Pencil } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface DocumentCardProps {
  document: LibraryDocument
  onDownload?: (id: string) => void
  onDelete?: (id: string) => void
  onEdit?: (document: LibraryDocument) => void
}

export function DocumentCard({ document, onDownload, onDelete, onEdit }: DocumentCardProps) {
  const uploadDate = new Date(document.uploadedAt)
  const timeAgo = formatDistanceToNow(uploadDate, { addSuffix: true })

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-background hover:shadow-md transition-shadow">
      {/* Header with icon and title */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-1">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">{document.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{document.description}</p>
          </div>
        </div>
        <button className="ml-2 text-muted-foreground hover:text-foreground">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit?.(document)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDownload?.(document.id)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete?.(document.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </button>
      </div>

      {/* Category badge and file status */}
      <div className="mb-3 flex items-center gap-2">
        <Badge className={`${CATEGORY_COLORS[document.category]} text-xs`}>
          {document.category}
        </Badge>
        {!document.attachment && (
          <Badge className="bg-red-100 text-red-700 border border-red-300 text-xs">
            File not available
          </Badge>
        )}
      </div>

      {/* Tags */}
      {document.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {document.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
              {tag}
            </span>
          ))}
          {document.tags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
              +{document.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pb-3 border-b border-border">
        <div className="flex gap-4">
          <span>{document.fileType}</span>
          <span>{formatFileSize(document.fileSize)}</span>
          <span>{timeAgo}</span>
        </div>
        {document.version && <span className="text-muted-foreground">v{document.version}</span>}
      </div>

      {/* Usage stats */}
      <div className="mb-4">
        <div className="text-xs text-muted-foreground">
          Used in <span className="font-medium text-foreground">{document.usedInRFPs?.length || 0} RFPs</span>
        </div>
      </div>
    </div>
  )
}
