export type DocumentCategory = 'Legal' | 'Template' | 'Examples' | 'General' | 'Data' | 'Guidelines' | 'Forms' | 'Policies'

export interface FileAttachment {
  name: string
  size: number
  type: string
  uploadedAt: string
}

export interface DocumentAction {
  id: string
  type: 'created' | 'edited' | 'file_added' | 'file_deleted' | 'file_replaced'
  description: string
  timestamp: string
  performedBy: string
}

export interface LibraryDocument {
  id: string
  name: string
  description: string
  category: DocumentCategory
  fileType: string
  fileSize: number
  uploadedAt: string
  uploadedBy: string
  tags: string[]
  usedInRFPs: string[]
  version?: string
  attachment?: FileAttachment
  actionLog?: DocumentAction[]
}

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'Legal',
  'Template',
  'Examples',
  'General',
  'Data',
  'Guidelines',
  'Forms',
  'Policies',
]

export const CATEGORY_DESCRIPTIONS: Record<DocumentCategory, string> = {
  Legal: 'Legal documents, contracts, and compliance materials',
  Template: 'Word templates and document templates for suppliers to fill out',
  Examples: 'Example documents and reference materials',
  General: 'General documentation and resources',
  Data: 'Data sheets, specifications, and technical information',
  Guidelines: 'Guidelines, best practices, and procedures',
  Forms: 'Forms and questionnaires for suppliers',
  Policies: 'Company policies and requirements',
}

export const CATEGORY_COLORS: Record<DocumentCategory, string> = {
  Legal: 'bg-red-100 text-red-800',
  Template: 'bg-blue-100 text-blue-800',
  Examples: 'bg-green-100 text-green-800',
  General: 'bg-gray-100 text-gray-800',
  Data: 'bg-purple-100 text-purple-800',
  Guidelines: 'bg-yellow-100 text-yellow-800',
  Forms: 'bg-pink-100 text-pink-800',
  Policies: 'bg-indigo-100 text-indigo-800',
}
