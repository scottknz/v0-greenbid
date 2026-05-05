'use client'

import React, { useState } from 'react'
import { X, Upload, AlertCircle } from 'lucide-react'
import { Supplier, TeamMember } from '@/types/supplier'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CSVImportDialogProps {
  onImport: (suppliers: Supplier[]) => void
  onCancel: () => void
}

export function CSVImportDialog({ onImport, onCancel }: CSVImportDialogProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewData, setPreviewData] = useState<Supplier[] | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const parseCSV = (csvText: string): Supplier[] => {
    const lines = csvText.split('\n').filter((line) => line.trim())
    if (lines.length < 2) {
      throw new Error('CSV file must contain headers and at least one row')
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
    const suppliers: Supplier[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim())
      const row: Record<string, string> = {}

      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })

      // Required fields
      if (!row['name'] || !row['email']) {
        throw new Error(
          `Row ${i + 1}: Company name and email are required`
        )
      }

      const supplier: Supplier = {
        id: `sup-${Date.now()}-${i}`,
        name: row['name'],
        tier: (row['tier'] || 'standard') as
          | 'preferred'
          | 'standard'
          | 'new',
        expertise: row['expertise']
          ? row['expertise'].split(';').map((e) => e.trim())
          : [],
        totalContractValue: parseInt(row['contract_value'] || '0', 10),
        contractsWon: parseInt(row['contracts_won'] || '0', 10),
        contractsLost: parseInt(row['contracts_lost'] || '0', 10),
        lastContacted: row['last_contacted'] || null,
        companyContact: {
          email: row['email'],
          phone: row['phone'] || '',
          address: row['address'] || '',
        },
        teamMembers:
          row['team_members'] && row['team_members'].length > 0
            ? [
                {
                  id: `tm-${Date.now()}-1`,
                  name: row['team_members'].split(';')[0] || '',
                  title: '',
                  function: '',
                  email: row['email'],
                  phone: row['phone'] || '',
                  proposalsWon: 0,
                  proposalsLost: 0,
                  relatedRFPs: [],
                },
              ]
            : [],
        engagementHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      suppliers.push(supplier)
    }

    return suppliers
  }

  const handleDrag = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
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
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setErrors(['Please upload a CSV file'])
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string
        const suppliers = parseCSV(csvText)
        setPreviewData(suppliers)
        setErrors([])
      } catch (error) {
        setErrors([
          error instanceof Error ? error.message : 'Failed to parse CSV',
        ])
        setPreviewData(null)
      }
    }
    reader.readAsText(file)
  }

  const handleImport = () => {
    if (previewData && previewData.length > 0) {
      onImport(previewData)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-text-primary">
          Import Suppliers
        </h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={onCancel}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!previewData ? (
          <div className="space-y-4">
            {/* Upload area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                'flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors',
                dragActive
                  ? 'border-brand-green bg-brand-green-light'
                  : 'border-border bg-surface-hover'
              )}
            >
              <Upload className="h-8 w-8 text-text-secondary" />
              <div className="text-center">
                <p className="text-sm font-medium text-text-primary">
                  Drag and drop your CSV file here
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  or click to browse
                </p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                id="csv-upload"
              />
              <Button
                onClick={() => document.getElementById('csv-upload')?.click()}
                variant="outline"
                size="sm"
              >
                Browse Files
              </Button>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="p-4 rounded-lg bg-destructive-light border border-destructive/30 space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                ))}
              </div>
            )}

            {/* CSV template info */}
            <div className="p-4 rounded-lg bg-info-light border border-info/30">
              <p className="text-sm font-medium text-info mb-2">
                CSV Template
              </p>
              <p className="text-xs text-info/80 font-mono">
                name, email, phone, address, tier, expertise, last_contacted
              </p>
              <p className="text-xs text-info/80 mt-2">
                Required fields: name, email
                <br />
                Tier values: preferred, standard, new (default: standard)
                <br />
                Expertise: separate multiple with semicolons (;)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview table */}
            <div>
              <p className="text-sm font-medium text-text-primary mb-3">
                Preview ({previewData.length} suppliers)
              </p>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-hover border-b border-border">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-text-primary">
                          Company Name
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-text-primary">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-text-primary">
                          Tier
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-text-primary">
                          Expertise Count
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {previewData.map((supplier) => (
                        <tr
                          key={supplier.id}
                          className="hover:bg-surface-hover transition-colors"
                        >
                          <td className="px-4 py-2 text-text-primary">
                            {supplier.name}
                          </td>
                          <td className="px-4 py-2 text-text-secondary">
                            {supplier.companyContact.email}
                          </td>
                          <td className="px-4 py-2">
                            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-surface text-text-secondary">
                              {supplier.tier}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-text-secondary">
                            {supplier.expertise.length}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setPreviewData(null)
                  setErrors([])
                }}
                className="flex-1"
              >
                Choose Different File
              </Button>
              <Button
                onClick={handleImport}
                className="flex-1 bg-brand-green hover:bg-brand-green-mid text-white"
              >
                Import {previewData.length} Supplier
                {previewData.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border bg-surface">
        <Button variant="outline" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  )
}
