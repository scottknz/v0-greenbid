'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Mail, User, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ApprovalRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  type: 'rfp_publication' | 'rfp_submission'
  itemId: string
  itemTitle: string
  availableApprovers: Array<{
    id: string
    name: string
    email: string
    role: string
  }>
  onSubmit: (data: {
    approverIds: string[]
    message: string
    approvalMode: 'any' | 'all'
  }) => void
}

export function ApprovalRequestModal({
  open,
  onOpenChange,
  title,
  description,
  type,
  itemId,
  itemTitle,
  availableApprovers,
  onSubmit,
}: ApprovalRequestModalProps) {
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [approvalMode, setApprovalMode] = useState<'any' | 'all'>('all')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggleApprover = (approverId: string) => {
    setSelectedApprovers((prev) =>
      prev.includes(approverId)
        ? prev.filter((id) => id !== approverId)
        : [...prev, approverId]
    )
  }

  const handleSubmit = () => {
    if (selectedApprovers.length === 0) return
    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit({
        approverIds: selectedApprovers,
        message,
        approvalMode,
      })
      setIsSubmitting(false)
      onOpenChange(false)
      // Reset form
      setSelectedApprovers([])
      setMessage('')
      setApprovalMode('all')
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item being approved */}
          <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-gray-50 px-3 py-2">
            <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0" />
            <span className="text-sm font-medium text-text-primary truncate">{itemTitle}</span>
            <span className="text-xs text-text-secondary ml-auto shrink-0">ID: {itemId}</span>
          </div>

          {/* Approval mode */}
          <div className="space-y-1.5">
            <Label htmlFor="approval-mode" className="text-sm font-medium">Approval Required From</Label>
            <Select value={approvalMode} onValueChange={(v) => setApprovalMode(v as 'any' | 'all')}>
              <SelectTrigger id="approval-mode" className="border-[#E5E7EB]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any approver (first to approve)</SelectItem>
                <SelectItem value="all">All approvers (everyone must approve)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Approver list */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Select Approvers</Label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {availableApprovers.length === 0 ? (
                <div className="flex items-center justify-center py-6 rounded-lg border border-dashed border-[#E5E7EB]">
                  <p className="text-sm text-text-secondary">No approvers available</p>
                </div>
              ) : (
                availableApprovers.map((approver) => (
                  <label
                    key={approver.id}
                    className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedApprovers.includes(approver.id)}
                      onCheckedChange={() => handleToggleApprover(approver.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text-primary truncate">{approver.name}</p>
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 shrink-0">{approver.role}</Badge>
                      </div>
                      <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3" />{approver.email}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
            {selectedApprovers.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-[#F0FDF4] border border-[#16A34A]/20 px-2.5 py-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                <p className="text-xs text-[#166534]">
                  {selectedApprovers.length} {selectedApprovers.length === 1 ? 'approver' : 'approvers'} selected
                </p>
              </div>
            )}
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm font-medium">
              Message <span className="font-normal text-text-muted">(Optional)</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Add context or notes for the approvers..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-20 border-[#E5E7EB] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#E5E7EB]"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedApprovers.length === 0 || isSubmitting}
            className="bg-[#16A34A] hover:bg-[#15803D]"
          >
            {isSubmitting ? 'Sending...' : 'Send for Approval'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
