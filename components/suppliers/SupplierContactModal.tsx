'use client'

import React from 'react'
import { X, Mail, Phone, MapPin, Building2, Award, Trophy, XCircle, Briefcase, Star, StickyNote, Plus, Trash2 } from 'lucide-react'
import { Supplier, TeamMember } from '@/types/supplier'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Note {
  id: string
  text: string
  createdAt: string
}

interface SupplierContactModalProps {
  supplier: Supplier
  member: TeamMember
  onClose: () => void
}

// Mock project data - in a real app this would come from the backend
const mockProjects = [
  { id: 'rfp-001', name: 'Scope 3 Value Chain Emissions Analysis', status: 'won', isProjectLead: true, value: 150000 },
  { id: 'rfp-002', name: 'SBTi Target Setting & Validation', status: 'won', isProjectLead: false, value: 95000 },
  { id: 'rfp-003', name: 'Carbon Footprint Assessment', status: 'won', isProjectLead: true, value: 120000 },
  { id: 'rfp-004', name: 'ISSB Compliance Reporting', status: 'lost', isProjectLead: false, value: 0 },
  { id: 'rfp-005', name: 'Renewable Energy Strategy', status: 'bid', isProjectLead: true, value: 0 },
  { id: 'rfp-006', name: 'ESG Data Management Platform', status: 'lost', isProjectLead: false, value: 0 },
]

export function SupplierContactModal({
  supplier,
  member,
  onClose,
}: SupplierContactModalProps) {
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')

  const handleAddNote = () => {
    const text = newNote.trim()
    if (!text) return
    setNotes(prev => [
      { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() },
      ...prev,
    ])
    setNewNote('')
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  // Filter projects based on member's relatedRFPs
  const memberProjects = mockProjects.filter(p => 
    member.relatedRFPs.includes(p.id) || 
    // For demo, show some projects if relatedRFPs is empty
    (member.relatedRFPs.length === 0 && mockProjects.slice(0, 2).some(mp => mp.id === p.id))
  )

  // If no related projects, generate some based on win/loss counts
  const displayProjects = memberProjects.length > 0 ? memberProjects : mockProjects.slice(0, member.proposalsWon + member.proposalsLost)

  const wonProjects = displayProjects.filter(p => p.status === 'won')
  const lostProjects = displayProjects.filter(p => p.status === 'lost')
  const bidProjects = displayProjects.filter(p => p.status === 'bid')

  const totalValue = wonProjects.reduce((sum, p) => sum + p.value, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg border border-border shadow-modal max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-text-primary">{member.name}</h2>
            <p className="text-sm text-text-secondary mt-1">{member.title}</p>
            <div className="flex items-center gap-2 mt-2">
              <Building2 className="h-4 w-4 text-text-muted" />
              <span className="text-sm text-text-secondary">{supplier.name}</span>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Contact Details */}
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">
              Contact Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-text-secondary shrink-0" />
                <a
                  href={`mailto:${member.email}`}
                  className="text-sm text-[#16A34A] hover:underline"
                >
                  {member.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-text-secondary shrink-0" />
                <a
                  href={`tel:${member.phone}`}
                  className="text-sm text-text-primary hover:text-[#16A34A]"
                >
                  {member.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-text-secondary shrink-0" />
                <span className="text-sm text-text-primary">{member.function}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-text-secondary shrink-0 mt-0.5" />
                <span className="text-sm text-text-primary">{supplier.companyContact.address}</span>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">
              Performance Summary
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-surface text-center">
                <p className="text-2xl font-semibold text-text-primary">
                  {member.proposalsWon + member.proposalsLost}
                </p>
                <p className="text-xs text-text-secondary mt-1">Total Bids</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F0FDF4] text-center">
                <p className="text-2xl font-semibold text-[#16A34A]">
                  {member.proposalsWon}
                </p>
                <p className="text-xs text-text-secondary mt-1">Won</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 text-center">
                <p className="text-2xl font-semibold text-destructive">
                  {member.proposalsLost}
                </p>
                <p className="text-xs text-text-secondary mt-1">Lost</p>
              </div>
              <div className="p-3 rounded-lg bg-surface text-center">
                <p className="text-2xl font-semibold text-text-primary">
                  {member.proposalsWon + member.proposalsLost > 0
                    ? Math.round((member.proposalsWon / (member.proposalsWon + member.proposalsLost)) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-text-secondary mt-1">Win Rate</p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-[#F0FDF4]">
              <p className="text-xs text-text-secondary">Total Contract Value (Won)</p>
              <p className="text-xl font-semibold text-[#16A34A]">{formatCurrency(totalValue)}</p>
            </div>
          </div>

          {/* Projects Won */}
          {wonProjects.length > 0 && (
            <div className="p-6 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide flex items-center gap-2">
                <Trophy className="h-4 w-4 text-[#16A34A]" />
                Projects Won ({wonProjects.length})
              </h3>
              <div className="space-y-2">
                {wonProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {formatCurrency(project.value)}
                        </p>
                      </div>
                    </div>
                    {project.isProjectLead && (
                      <Badge className="bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/30 shrink-0 ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        Project Lead
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Lost */}
          {lostProjects.length > 0 && (
            <div className="p-6 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                Projects Lost ({lostProjects.length})
              </h3>
              <div className="space-y-2">
                {lostProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {project.name}
                        </p>
                      </div>
                    </div>
                    {project.isProjectLead && (
                      <Badge variant="outline" className="shrink-0 ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        Project Lead
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Bids */}
          {bidProjects.length > 0 && (
            <div className="p-6 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-amber-500" />
                Active Bids ({bidProjects.length})
              </h3>
              <div className="space-y-2">
                {bidProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-amber-600">In Progress</p>
                      </div>
                    </div>
                    {project.isProjectLead && (
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200 shrink-0 ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        Project Lead
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Expertise */}
          {supplier.expertise.length > 0 && (
            <div className="p-6 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
                Company Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {supplier.expertise.map((exp) => (
                  <Badge
                    key={exp}
                    variant="outline"
                    className="bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/30"
                  >
                    {exp}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              Notes
            </h3>
            <div className="space-y-2 mb-4">
              <Textarea
                placeholder={`Add a note about ${member.name}...`}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddNote()
                }}
                rows={3}
                className="resize-none text-sm"
              />
              <Button
                size="sm"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white"
                onClick={handleAddNote}
                disabled={!newNote.trim()}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Note
              </Button>
            </div>
            {notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="group flex gap-3 p-3 rounded-lg bg-surface border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary whitespace-pre-wrap">{note.text}</p>
                      <p className="text-xs text-text-muted mt-1.5">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-text-muted hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      aria-label="Delete note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted italic">No notes yet.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border bg-surface">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            className="bg-[#16A34A] hover:bg-[#15803D]"
            onClick={() => {
              onClose()
              router.push(`/buyer/messages?compose=true&to=${encodeURIComponent(member.name)}&email=${encodeURIComponent(member.email)}`)
            }}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>
    </div>
  )
}
