'use client'

import { useState } from 'react'
import { LibraryDocument, DocumentAction } from '@/types/library'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X, Save, Upload, Trash2, File } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface DocumentDetailsModalProps {
  document: LibraryDocument
  isOpen: boolean
  onClose: () => void
  onSave: (document: LibraryDocument) => void
}

export function DocumentDetailsModal({
  document,
  isOpen,
  onClose,
  onSave,
}: DocumentDetailsModalProps) {
  const [formData, setFormData] = useState<LibraryDocument>(document)
  const [isSaving, setIsSaving] = useState(false)
  const [newFile, setNewFile] = useState<File | null>(null)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    
    // Create action log entries for changes
    const actions: DocumentAction[] = formData.actionLog || []
    
    if (newFile) {
      actions.push({
        id: `action-${Date.now()}`,
        type: formData.attachment ? 'file_replaced' : 'file_added',
        description: `${formData.attachment ? 'Replaced' : 'Added'} file: ${newFile.name}`,
        timestamp: new Date().toISOString(),
        performedBy: 'Current User',
      })
      
      setFormData(prev => ({
        ...prev,
        attachment: {
          name: newFile.name,
          size: newFile.size,
          type: newFile.type,
          uploadedAt: new Date().toISOString(),
        },
        actionLog: actions,
      }))
    }
    
    if (isRemoving && formData.attachment) {
      actions.push({
        id: `action-${Date.now()}`,
        type: 'file_deleted',
        description: `Deleted file: ${formData.attachment.name}`,
        timestamp: new Date().toISOString(),
        performedBy: 'Current User',
      })
      
      setFormData(prev => ({
        ...prev,
        attachment: undefined,
        actionLog: actions,
      }))
    }
    
    // Record general edits
    if (formData.name !== document.name || formData.description !== document.description || formData.version !== document.version) {
      const changes = []
      if (formData.name !== document.name) changes.push(`name updated to "${formData.name}"`)
      if (formData.description !== document.description) changes.push('description updated')
      if (formData.version !== document.version) changes.push(`version updated to ${formData.version}`)
      
      actions.push({
        id: `action-${Date.now()}`,
        type: 'edited',
        description: `Document edited: ${changes.join(', ')}`,
        timestamp: new Date().toISOString(),
        performedBy: 'Current User',
      })
    }
    
    const finalData = { ...formData, actionLog: actions }
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500))
    onSave(finalData)
    setIsSaving(false)
    setNewFile(null)
    setIsRemoving(false)
    onClose()
  }

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }))
        e.currentTarget.value = ''
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background">
          <h2 className="text-xl font-semibold text-foreground">Document Details</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Document Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter document name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter document description"
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Category
            </label>
            <div className="text-sm text-muted-foreground bg-muted rounded px-3 py-2">
              {formData.category}
            </div>
          </div>

          {/* File Info */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                File Type
              </label>
              <div className="text-sm text-foreground bg-muted rounded px-3 py-2">
                {formData.fileType}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Version
              </label>
              <Input
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                placeholder="1.0"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Uploaded By
              </label>
              <div className="text-sm text-foreground bg-muted rounded px-3 py-2">
                {formData.uploadedBy}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Tags
            </label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive/10"
                    onClick={() => handleTagRemove(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Type a tag and press Enter"
                onKeyDown={handleAddTag}
                className="text-sm"
              />
            </div>
          </div>

          {/* File Attachment */}
          <div className="border-t border-border pt-6">
            <label className="text-sm font-medium text-foreground block mb-3">
              File Attachment
            </label>
            {formData.attachment && !isRemoving ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <File className="h-5 w-5 text-[#16A34A]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {formData.attachment.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(formData.attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRemoving(true)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Uploaded {new Date(formData.attachment.uploadedAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <label className="text-center cursor-pointer">
                      <span className="text-sm text-muted-foreground">
                        {isRemoving && formData.attachment ? 'Upload new file' : 'Choose a file to upload'}
                      </span>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setNewFile(file)
                            setIsRemoving(false)
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                {newFile && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                    <File className="h-4 w-4 text-[#16A34A]" />
                    <span className="text-sm text-[#16A34A]">{newFile.name}</span>
                    <button
                      onClick={() => setNewFile(null)}
                      className="ml-auto text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Log */}
          {formData.actionLog && formData.actionLog.length > 0 && (
            <div className="border-t border-border pt-6">
              <label className="text-sm font-medium text-foreground block mb-3">
                Edit History
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {[...formData.actionLog].reverse().map((action) => (
                  <div key={action.id} className="p-2 bg-muted rounded text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-foreground font-medium">{action.description}</p>
                        <p className="text-muted-foreground mt-0.5">
                          by {action.performedBy}
                        </p>
                      </div>
                      <span className="text-muted-foreground shrink-0 ml-2">
                        {new Date(action.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Date */}
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Uploaded
            </label>
            <div className="text-sm text-muted-foreground">
              {new Date(formData.uploadedAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border bg-background sticky bottom-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#16A34A] hover:bg-[#15803D]"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
