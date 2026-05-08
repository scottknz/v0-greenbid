'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle, Clock, AlertCircle, ChevronDown, Mail, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ApprovalRequest } from '@/types/approval'
import { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

export interface ApprovalStatusProps {
  approval: ApprovalRequest
  onRetry?: () => void
  compact?: boolean // Show compact view instead of full card
}

const statusConfig = {
  pending: { label: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  approved: { label: 'Approved', color: 'text-[#166534]', bgColor: 'bg-[#F0FDF4]', borderColor: 'border-[#16A34A]' },
  changes_requested: { label: 'Changes Requested', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  delegated: { label: 'Delegated', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
};

export function ApprovalStatus({ approval, onRetry, compact = false }: ApprovalStatusProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = statusConfig[approval.status];
  const approvedCount = approval.approvers.filter((a) => a.status === 'approved').length;
  const totalCount = approval.approvers.length;
  const progressPercent = (approvedCount / totalCount) * 100;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 text-sm', config.color)}>
        {approval.status === 'pending' && <Clock className="h-4 w-4 shrink-0" />}
        {approval.status === 'approved' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
        {approval.status === 'changes_requested' && <AlertCircle className="h-4 w-4 shrink-0" />}
        {approval.status === 'rejected' && <XCircle className="h-4 w-4 shrink-0" />}
        <span>{statusConfig[approval.status].label}</span>
      </div>
    );
  }

  return (
    <Card className={cn('border', config.borderColor)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base flex items-center gap-2">
              {approval.status === 'pending' && <Clock className="h-4 w-4 text-amber-600" />}
              {approval.status === 'approved' && <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />}
              {approval.status === 'changes_requested' && <AlertCircle className="h-4 w-4 text-blue-600" />}
              {approval.status === 'rejected' && <XCircle className="h-4 w-4 text-red-600" />}
              Approval Status
            </CardTitle>
            <p className="text-xs text-text-secondary mt-1">
              Requested by {approval.requestedByName} on {new Date(approval.requestedAt).toLocaleDateString()}
            </p>
          </div>
          <Badge className={cn('text-xs', config.bgColor, config.color)}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Approval Progress</span>
            <span className="font-medium text-text-primary">
              {approvedCount} of {totalCount}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Message */}
        {approval.message && (
          <div className="rounded-lg border border-[#E5E7EB] bg-gray-50 p-3">
            <p className="text-xs font-medium text-text-primary mb-1">Message from Requester</p>
            <p className="text-xs text-text-secondary">{approval.message}</p>
          </div>
        )}

        {/* Approval Mode */}
        <div className="text-xs bg-gray-50 border border-[#E5E7EB] rounded-lg p-2.5">
          <span className="text-text-secondary">Approval Mode: </span>
          <span className="font-medium text-text-primary">
            {approval.approvalMode === 'any' ? 'Any approver can approve' : 'All approvers must approve'}
          </span>
        </div>

        {/* Approvers list - collapsible */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary w-full py-1">
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')} />
            <span>Approvers ({approval.approvers.length})</span>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-2 pt-2">
            {approval.approvers.map((approver) => (
              <div key={approver.userId} className="flex items-start gap-3 rounded-lg border border-[#E5E7EB] p-2.5 bg-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-medium text-text-primary">{approver.name}</p>
                    <Badge variant="secondary" className="text-[9px] h-4 px-1">
                      {approver.role}
                    </Badge>
                    {approver.status === 'approved' && (
                      <CheckCircle2 className="h-3 w-3 text-[#16A34A]" />
                    )}
                    {approver.status === 'changes_requested' && (
                      <AlertCircle className="h-3 w-3 text-blue-600" />
                    )}
                    {approver.status === 'pending' && (
                      <Clock className="h-3 w-3 text-amber-600" />
                    )}
                    {approver.status === 'rejected' && (
                      <XCircle className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                  <p className="text-[10px] text-text-secondary mt-0.5">{approver.email}</p>

                  {approver.comment && (
                    <div className="mt-1.5 text-[10px] bg-white rounded border border-[#E5E7EB] p-1.5">
                      <p className="text-text-secondary font-medium flex items-center gap-1 mb-0.5">
                        <MessageSquare className="h-3 w-3" />
                        Comment
                      </p>
                      <p className="text-text-secondary">{approver.comment}</p>
                    </div>
                  )}

                  {approver.respondedAt && (
                    <p className="text-[10px] text-text-secondary mt-1">
                      {new Date(approver.respondedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Approval summary */}
        {approval.status === 'approved' && approval.completedAt && (
          <div className="flex items-start gap-2 rounded-lg bg-[#F0FDF4] border border-[#16A34A]/30 p-2.5">
            <CheckCircle2 className="h-4 w-4 text-[#16A34A] mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-medium text-[#166534]">Approved</p>
              <p className="text-[#166534]/70">
                Approved by {approval.completedBy} on {new Date(approval.completedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {approval.status === 'changes_requested' && (
          <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 p-2.5">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-medium text-blue-900">Changes Requested</p>
              <p className="text-blue-800">Address the feedback and resubmit for approval</p>
            </div>
          </div>
        )}

        {/* Retry button for pending */}
        {approval.status === 'pending' && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="w-full text-xs border-[#E5E7EB]"
          >
            <Mail className="h-3 w-3 mr-1.5" />
            Resend Approval Requests
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
