'use client'

import React, { useState } from 'react'
import { mockSuppliers } from '@/lib/mock-suppliers'
import { mockDirectorySuppliers } from '@/lib/mock-directory-suppliers'
import { Supplier, DirectorySupplier, TeamMember } from '@/types/supplier'
import { SuppliersList } from '@/components/suppliers/SuppliersList'
import { SupplierDetailPanel } from '@/components/suppliers/SupplierDetailPanel'
import { AddSupplierForm } from '@/components/suppliers/AddSupplierForm'
import { CSVImportDialog } from '@/components/suppliers/CSVImportDialog'
import { SupplierContactModal } from '@/components/suppliers/SupplierContactModal'
import { SupplierDirectory } from '@/components/suppliers/SupplierDirectory'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Library } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [directorySuppliers] = useState<DirectorySupplier[]>(mockDirectorySuppliers)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null)
  const [contactModalData, setContactModalData] = useState<{ supplier: Supplier; member: TeamMember } | null>(null)
  const [activeTab, setActiveTab] = useState('our-suppliers')

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

  const handleDeleteSupplier = (supplier: Supplier) => {
    setDeletingSupplier(supplier)
  }

  const confirmDeleteSupplier = () => {
    if (deletingSupplier) {
      setSuppliers(suppliers.filter((s) => s.id !== deletingSupplier.id))
      if (selectedSupplier?.id === deletingSupplier.id) {
        setSelectedSupplier(null)
      }
      setDeletingSupplier(null)
    }
  }

  const handleAddToSuppliers = (dirSupplier: DirectorySupplier) => {
    // Convert DirectorySupplier to Supplier and add to our suppliers
    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: dirSupplier.name,
      tier: 'standard',
      expertise: dirSupplier.category,
      totalContractValue: 0,
      contractsWon: 0,
      contractsLost: 0,
      lastContacted: null,
      companyContact: {
        email: '',
        phone: '',
        address: '',
      },
      teamMembers: [],
      engagementHistory: [],
      sustainabilityCredentials: dirSupplier.sustainabilityCredentials,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setSuppliers([...suppliers, newSupplier])
  }

  return (
    <div className="flex h-full bg-background flex-col">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex items-center gap-1 mx-6 mt-6 mb-0 p-1 bg-gray-100 rounded-lg w-fit border border-border">
          <button
            onClick={() => setActiveTab('our-suppliers')}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150',
              activeTab === 'our-suppliers'
                ? 'bg-[#16A34A] text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/60'
            )}
          >
            Our Suppliers
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150',
              activeTab === 'directory'
                ? 'bg-[#16A34A] text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/60'
            )}
          >
            <Library className={cn('h-3.5 w-3.5 shrink-0', activeTab === 'directory' ? 'text-white' : 'text-text-muted')} />
            Supplier Directory
          </button>
        </div>

        {/* Our Suppliers Tab */}
        <TabsContent value="our-suppliers" className="flex-1 flex flex-col m-0">
          <div className="flex-1 flex flex-col">
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
              onDelete={handleDeleteSupplier}
              onContactClick={(supplier, member) => setContactModalData({ supplier, member })}
            />
          </div>
        </TabsContent>

        {/* Supplier Directory Tab */}
        <TabsContent value="directory" className="flex-1 flex flex-col m-0 overflow-hidden">
          <SupplierDirectory
            suppliers={directorySuppliers}
            onAddToSuppliers={handleAddToSuppliers}
          />
        </TabsContent>
      </Tabs>

      {/* Details modal */}
      {selectedSupplier && !showAddForm && !editingSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg border border-border shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <SupplierDetailPanel
              supplier={selectedSupplier}
              onEdit={(supplier) => {
                setSelectedSupplier(null)
                setEditingSupplier(supplier)
                setShowAddForm(true)
              }}
              onClose={() => setSelectedSupplier(null)}
              onUpdate={handleUpdateSupplier}
            />
          </div>
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

      {/* Delete confirmation dialog */}
      {deletingSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg border border-border shadow-modal max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Delete Supplier</h3>
            <p className="text-sm text-text-secondary mb-6">
              Are you sure you want to delete <strong>{deletingSupplier.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeletingSupplier(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteSupplier}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Contact detail modal */}
      {contactModalData && (
        <SupplierContactModal
          supplier={contactModalData.supplier}
          member={contactModalData.member}
          onClose={() => setContactModalData(null)}
        />
      )}
    </div>
  )
}
