'use client'

import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { LibraryList } from '@/components/library/LibraryList'
import { DocumentUploadForm } from '@/components/library/DocumentUploadForm'
import { Button } from '@/components/ui/button'
import { mockLibraryDocuments } from '@/lib/mock-library'
import { Upload, Plus } from 'lucide-react'

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
      console.log('[v0] Downloading document:', doc.name)
      // In a real app, this would trigger the actual download
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Library</h1>
            <p className="text-gray-600 mt-1">
              Manage company documents that can be included in RFP proposals
            </p>
          </div>
          <Button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <DocumentUploadForm
            onSubmit={handleUpload}
            onCancel={() => setShowUploadForm(false)}
          />
        )}

        {/* Documents List */}
        <LibraryList
          documents={documents}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </div>
    </DashboardShell>
  )
}
