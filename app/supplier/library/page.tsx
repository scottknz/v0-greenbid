'use client'

import { useState } from 'react'
import { LibraryList } from '@/components/library/LibraryList'
import { DocumentUploadForm } from '@/components/library/DocumentUploadForm'
import { Button } from '@/components/ui/button'
import { mockLibraryDocuments } from '@/lib/mock-library'
import { Plus } from 'lucide-react'

export default function LibraryPage() {
  const [documents, setDocuments] = useState(mockLibraryDocuments)
  const [showUploadForm, setShowUploadForm] = useState(false)

  const handleUpload = (formData: any) => {
    const newDocument = {
      id: `doc-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      fileType: formData.file.name.split('.').pop().toUpperCase(),
      fileSize: formData.file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
      tags: formData.tags,
      usedInRFPs: [],
      version: '1.0',
    }

    setDocuments((prev) => [newDocument, ...prev])
    setShowUploadForm(false)
  }

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const handleDownload = (id: string) => {
    const doc = documents.find((d) => d.id === id)
    if (doc) {
      // In a real app, this would trigger the actual download
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Document Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage company documents for RFP proposals
          </p>
        </div>
        <Button
          onClick={() => setShowUploadForm(!showUploadForm)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
            <DocumentUploadForm
              onSubmit={handleUpload}
              onCancel={() => setShowUploadForm(false)}
            />
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-6">
        <LibraryList
          documents={documents}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
