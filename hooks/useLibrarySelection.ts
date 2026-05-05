'use client'

import { useState, useCallback } from 'react'
import { LibraryDocument } from '@/types/library'

interface UseLibrarySelectionReturn {
  selectedDocuments: LibraryDocument[]
  isSelected: (id: string) => boolean
  toggleSelection: (document: LibraryDocument) => void
  toggleCategory: (category: string, documents: LibraryDocument[]) => void
  clearSelection: () => void
  getSelectedIds: () => string[]
}

export function useLibrarySelection(): UseLibrarySelectionReturn {
  const [selectedDocuments, setSelectedDocuments] = useState<LibraryDocument[]>([])

  const isSelected = useCallback(
    (id: string) => selectedDocuments.some((doc) => doc.id === id),
    [selectedDocuments],
  )

  const toggleSelection = useCallback((document: LibraryDocument) => {
    setSelectedDocuments((prev) => {
      const isAlreadySelected = prev.some((doc) => doc.id === document.id)
      if (isAlreadySelected) {
        return prev.filter((doc) => doc.id !== document.id)
      } else {
        return [...prev, document]
      }
    })
  }, [])

  const toggleCategory = useCallback((category: string, documents: LibraryDocument[]) => {
    const categoryDocs = documents.filter((doc) => doc.category === category)
    const allCategoryDocsSelected = categoryDocs.every((doc) => isSelected(doc.id))

    if (allCategoryDocsSelected) {
      // Deselect all in category
      setSelectedDocuments((prev) => prev.filter((doc) => !categoryDocs.some((cd) => cd.id === doc.id)))
    } else {
      // Select all in category
      setSelectedDocuments((prev) => {
        const newSelected = [...prev]
        categoryDocs.forEach((doc) => {
          if (!newSelected.some((d) => d.id === doc.id)) {
            newSelected.push(doc)
          }
        })
        return newSelected
      })
    }
  }, [isSelected])

  const clearSelection = useCallback(() => {
    setSelectedDocuments([])
  }, [])

  const getSelectedIds = useCallback(() => {
    return selectedDocuments.map((doc) => doc.id)
  }, [selectedDocuments])

  return {
    selectedDocuments,
    isSelected,
    toggleSelection,
    toggleCategory,
    clearSelection,
    getSelectedIds,
  }
}
