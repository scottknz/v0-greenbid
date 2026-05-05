'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DOCUMENT_CATEGORIES } from '@/types/library'
import { X, Upload } from 'lucide-react'

interface DocumentUploadFormProps {
  onSubmit?: (data: any) => void
  onCancel?: () => void
}

export function DocumentUploadForm({ onSubmit, onCancel }: DocumentUploadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'General',
    tags: '',
    file: null as File | null,
  })
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (file: File) => {
    setFormData((prev) => ({ ...prev, file }))
    setPreview(file.name)
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileChange(files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.file && formData.name && formData.description) {
      onSubmit?.({
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      })
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Upload Document</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
            dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label htmlFor="file-input" className="flex flex-col items-center justify-center cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-900">
              {preview || 'Click to upload or drag and drop'}
            </span>
            <span className="text-xs text-gray-500 mt-1">PDF, DOCX, XLSX or other formats</span>
          </label>
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          />
        </div>

        {/* Document Name */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Document Name</label>
          <Input
            type="text"
            name="name"
            placeholder="e.g., Master Service Agreement"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
          <textarea
            name="description"
            placeholder="Describe what this document is for and why it's important"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {DOCUMENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Tags (comma-separated)</label>
          <Input
            type="text"
            name="tags"
            placeholder="e.g., contract, legal, msa, standard"
            value={formData.tags}
            onChange={handleInputChange}
          />
          <p className="text-xs text-gray-500 mt-1">Add tags to help organize and search documents</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={!formData.file || !formData.name}>
            Upload Document
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
