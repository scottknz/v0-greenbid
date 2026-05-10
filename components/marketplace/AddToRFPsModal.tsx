'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Bookmark, MapPin, Calendar, Users, X } from 'lucide-react'
import type { MarketplaceRFP } from '@/lib/mock-marketplace'

// Stub team members — in production these come from the authenticated supplier's team
const TEAM_MEMBERS = [
  { id: 'tm-1', name: 'Alex Thompson', role: 'Lead' },
  { id: 'tm-2', name: 'Rachel Kim', role: 'Reviewer' },
  { id: 'tm-3', name: 'David Osei', role: 'Editor' },
  { id: 'tm-4', name: 'Sophie Martin', role: 'Approver' },
]

function getDaysUntil(deadline: string) {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
}

interface AddToRFPsModalProps {
  open: boolean
  rfp: MarketplaceRFP
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function AddToRFPsModal({ open, rfp, onOpenChange, onConfirm }: AddToRFPsModalProps) {
  const [note, setNote] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<Set<string>>(new Set())

  const days = getDaysUntil(rfp.deadline)

  const toggleMember = (id: string) => {
    setSelectedTeam(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  const handleConfirm = () => {
    onConfirm()
    setNote('')
    setSelectedTeam(new Set())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Bookmark className="h-4 w-4 text-[#16A34A]" />
            Add to My RFP Pipeline
          </DialogTitle>
          <DialogDescription className="text-xs">
            Save this opportunity to your RFP dashboard and optionally share with team members to review.
          </DialogDescription>
        </DialogHeader>

        {/* RFP snapshot */}
        <div className="rounded-lg border border-border bg-gray-50 p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className={cn('h-7 w-7 rounded-md shrink-0 flex items-center justify-center text-white text-[10px] font-bold', rfp.buyerColor)}>
              {rfp.buyerInitials}
            </div>
            <span className="font-bold text-xs text-text-primary">{rfp.buyerCompany}</span>
          </div>
          <p className="text-xs font-medium text-text-primary line-clamp-2 leading-snug">{rfp.title}</p>
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {rfp.country}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {days > 0 ? `${days} days left` : 'Deadline passed'}
            </span>
          </div>
        </div>

        {/* Internal note */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-text-primary">Internal note (optional)</Label>
          <Textarea
            placeholder="Add context for your team — why this is a good fit, what to focus on..."
            value={note}
            onChange={e => setNote(e.target.value)}
            className="text-xs resize-none h-20"
          />
        </div>

        {/* Share with team */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-text-primary flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Share with team members (optional)
          </Label>
          <div className="flex flex-wrap gap-2">
            {TEAM_MEMBERS.map(member => {
              const selected = selectedTeam.has(member.id)
              return (
                <button
                  key={member.id}
                  onClick={() => toggleMember(member.id)}
                  className={cn(
                    'flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition-colors',
                    selected
                      ? 'bg-[#16A34A] text-white border-[#16A34A]'
                      : 'bg-white text-text-secondary border-border hover:border-[#16A34A]/40 hover:text-[#16A34A]'
                  )}
                >
                  <span className={cn('h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0', selected ? 'bg-white/20' : 'bg-gray-100')}>
                    {member.name[0]}
                  </span>
                  {member.name.split(' ')[0]}
                  <Badge className={cn('text-[9px] h-3.5 px-1 ml-0.5', selected ? 'bg-white/20 text-white border-0' : 'bg-gray-100 text-text-muted border-0')}>
                    {member.role}
                  </Badge>
                </button>
              )
            })}
          </div>
          {selectedTeam.size > 0 && (
            <p className="text-[11px] text-text-muted">
              {selectedTeam.size} team member{selectedTeam.size > 1 ? 's' : ''} will be notified and can review this RFP.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            className="bg-[#16A34A] hover:bg-[#15803D]"
          >
            <Bookmark className="h-3.5 w-3.5 mr-1.5" />
            Add to My RFP Pipeline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
