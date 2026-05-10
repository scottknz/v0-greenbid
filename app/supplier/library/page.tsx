'use client'

import { useState } from 'react'
import { jsPDF } from 'jspdf'
import { LibraryList } from '@/components/library/LibraryList'
import type { LibraryDocument } from '@/types/library'
import { DocumentUploadForm } from '@/components/library/DocumentUploadForm'
import { DocumentDetailsModal } from '@/components/library/DocumentDetailsModal'
import { PageHeader } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { mockLibraryDocuments } from '@/lib/mock-library'
import { Plus } from 'lucide-react'

export default function LibraryPage() {
  const [documents, setDocuments] = useState(mockLibraryDocuments)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<LibraryDocument | null>(null)

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
      const pdf = new jsPDF()
      pdf.setFontSize(14)
      pdf.text(doc.name, 20, 20)
      pdf.setFontSize(10)
      pdf.text(`Document: ${doc.name}`, 20, 35)
      pdf.text(`Category: ${doc.category}`, 20, 45)
      pdf.text(`Version: ${doc.version || 'N/A'}`, 20, 55)
      pdf.save(`${doc.name}.pdf`)
    }
  }

  const handleEdit = (document: LibraryDocument) => {
    setSelectedDocument(document)
  }

  const handleSaveDocument = (updatedDocument: LibraryDocument) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === updatedDocument.id ? updatedDocument : doc))
    )
    setSelectedDocument(null)
  }

  return (
    <div className="flex flex-col min-h-full bg-background p-6 space-y-6">
      <PageHeader
        title="Document Library"
        description="Manage company documents for RFP proposals"
        actions={
          <Button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-brand-green hover:bg-brand-green-mid text-white gap-2"
          >
            <Plus className="h-4 w-4" />
            Upload Document
          </Button>
        }
      />

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

      {/* Document Details Modal */}
      {selectedDocument && (
        <DocumentDetailsModal
          document={selectedDocument}
          isOpen={true}
          onClose={() => setSelectedDocument(null)}
          onSave={handleSaveDocument}
          onDownload={handleDownload}
        />
      )}

      {/* Documents List */}
      <div className="flex-1">
        <LibraryList
          documents={documents}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  )
}
