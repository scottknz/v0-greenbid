'use client'

import React, { useState } from 'react'
import { mockSuppliers } from '@/lib/mock-suppliers'
import { Supplier } from '@/types/supplier'
import { SuppliersList } from '@/components/suppliers/SuppliersList'
import { SupplierDetailPanel } from '@/components/suppliers/SupplierDetailPanel'
import { AddSupplierForm } from '@/components/suppliers/AddSupplierForm'
import { CSVImportDialog } from '@/components/suppliers/CSVImportDialog'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  const handleAddSupplier = (newSupplier: Supplier) => {
    setSuppliers([...suppliers, newSupplier])
    setShowAddForm(false)
  }

  const handleUpdateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(
      suppliers.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s))
    )
    setEditingSupplier(null)
    setSelectedSupplier(updatedSupplier)
  }

  const handleImportSuppliers = (importedSuppliers: Supplier[]) => {
    setSuppliers([...suppliers, ...importedSuppliers])
    setShowImportDialog(false)
  }

  return (
    <div className="flex h-full bg-background">
      {/* Main list view */}
      <div className="flex-1 flex flex-col border-r border-border">
        <SuppliersList
          suppliers={suppliers}
          onAddSupplier={() => {
            setEditingSupplier(null)
            setShowAddForm(true)
          }}
          onImportCSV={() => setShowImportDialog(true)}
          onViewDetails={setSelectedSupplier}
          onEdit={(supplier) => {
            setEditingSupplier(supplier)
            setShowAddForm(true)
          }}
        />
      </div>

      {/* Side panel for details */}
      {selectedSupplier && !showAddForm && !editingSupplier && (
        <div className="w-96 border-l border-border bg-background overflow-y-auto">
          <SupplierDetailPanel
            supplier={selectedSupplier}
            onEdit={(supplier) => {
              setEditingSupplier(supplier)
              setShowAddForm(true)
            }}
            onClose={() => setSelectedSupplier(null)}
            onUpdate={handleUpdateSupplier}
          />
        </div>
      )}

      {/* Add/Edit form modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg border border-border shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AddSupplierForm
              supplier={editingSupplier}
              onSubmit={
                editingSupplier ? handleUpdateSupplier : handleAddSupplier
              }
              onCancel={() => {
                setShowAddForm(false)
                setEditingSupplier(null)
              }}
            />
          </div>
        </div>
      )}

      {/* CSV Import dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg border border-border shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CSVImportDialog
              onImport={handleImportSuppliers}
              onCancel={() => setShowImportDialog(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
