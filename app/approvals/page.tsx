'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getUserPendingApprovals, getUserApprovalHistory } from '@/lib/mock-approvals'
import type { ApprovalRequest, ApprovalStatus as ApprovalStatusType } from '@/types/approval'

const CURRENT_USER_ID = 'user-emily' // Mock current user

export default function MyApprovalsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [approvalAction, setApprovalAction] = useState<'approve' | 'changes' | null>(null)
  const [actionComment, setActionComment] = useState('')

  const pendingApprovals = getUserPendingApprovals(CURRENT_USER_ID)
  const approvalHistory = getUserApprovalHistory(CURRENT_USER_ID)

  const filteredPending = pendingApprovals.filter((a) =>
    a.itemTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredHistory = approvalHistory.filter((a) =>
    a.itemTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenDetail = (approval: ApprovalRequest) => {
    setSelectedApproval(approval)
    setShowDetailDialog(true)
    setApprovalAction(null)
    setActionComment('')
  }

  const handleApproveClick = () => {
    setApprovalAction('approve')
  }

  const handleChangesClick = () => {
    setApprovalAction('changes')
  }

  const handleSubmitAction = () => {
    if (!selectedApproval || !approvalAction) return

    console.log('[v0] Approval action:', {
      approvalId: selectedApproval.id,
      action: approvalAction,
      comment: actionComment,
    })

    // In a real app, this would call an API
    setShowDetailDialog(false)
    setSelectedApproval(null)
    setApprovalAction(null)
    setActionComment('')
  }

  const typeLabel = (approval: ApprovalRequest) => {
    return approval.type === 'rfp_publication' ? 'RFP Publication' : 'Proposal Submission'
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">My Approvals</h1>
          <p className="text-text-secondary">
            Manage pending approval requests and view your approval history
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <Input
              placeholder="Search approvals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#E5E7EB]"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">
              Pending ({filteredPending.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({filteredHistory.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Approvals */}
          <TabsContent value="pending" className="space-y-4">
            {filteredPending.length === 0 ? (
              <Card className="border-[#E5E7EB] bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-[#16A34A] mb-3" />
                  <h3 className="text-lg font-medium text-text-primary mb-1">All Caught Up!</h3>
                  <p className="text-sm text-text-secondary">
                    You have no pending approvals right now.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPending.map((approval) => (
                <Card
                  key={approval.id}
                  className="border-[#E5E7EB] hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleOpenDetail(approval)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-medium text-text-primary truncate">
                            {approval.itemTitle}
                          </h3>
                          <Badge variant="secondary" className="text-[10px]">
                            {typeLabel(approval)}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-secondary mb-2">
                          Requested by {approval.requestedByName} •{' '}
                          {new Date(approval.requestedAt).toLocaleDateString()}
                        </p>
                        {approval.message && (
                          <p className="text-xs text-text-secondary italic line-clamp-2 mb-2">
                            "{approval.message}"
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px]">
                            <Clock className="h-2.5 w-2.5 mr-1" />
                            Awaiting Your Response
                          </Badge>
                          <span className="text-[10px] text-text-secondary">
                            Mode: {approval.approvalMode === 'any' ? 'Any' : 'All'} approvers
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-text-secondary shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Approval History */}
          <TabsContent value="history" className="space-y-4">
            {filteredHistory.length === 0 ? (
              <Card className="border-[#E5E7EB] bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-text-secondary mb-3" />
                  <h3 className="text-lg font-medium text-text-primary mb-1">
                    No Approval History
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Your approved and rejected requests will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredHistory.map((approval) => {
                const userResponse = approval.approvers.find(
                  (a) => a.userId === CURRENT_USER_ID
                )
                return (
                  <Card
                    key={approval.id}
                    className="border-[#E5E7EB] hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleOpenDetail(approval)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-medium text-text-primary truncate">
                              {approval.itemTitle}
                            </h3>
                            <Badge variant="secondary" className="text-[10px]">
                              {typeLabel(approval)}
                            </Badge>
                          </div>
                          <p className="text-xs text-text-secondary mb-2">
                            Requested by {approval.requestedByName} •{' '}
                            {new Date(approval.requestedAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {userResponse?.status === 'approved' && (
                              <Badge className="bg-[#F0FDF4] text-[#166534] border border-[#16A34A] text-[10px]">
                                <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                                Approved
                              </Badge>
                            )}
                            {userResponse?.status === 'changes_requested' && (
                              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px]">
                                <AlertCircle className="h-2.5 w-2.5 mr-1" />
                                Changes Requested
                              </Badge>
                            )}
                            {userResponse?.respondedAt && (
                              <span className="text-[10px] text-text-secondary">
                                {new Date(userResponse.respondedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-text-secondary shrink-0 mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Approval Detail Dialog */}
      {selectedApproval && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedApproval.itemTitle}</DialogTitle>
              <DialogDescription>
                {typeLabel(selectedApproval)} • ID: {selectedApproval.itemId}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Item Info */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                  Request Details
                </p>
                <div className="rounded-lg border border-[#E5E7EB] bg-gray-50 p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Requested by:</span>
                    <span className="font-medium text-text-primary">{selectedApproval.requestedByName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Date:</span>
                    <span className="font-medium text-text-primary">
                      {new Date(selectedApproval.requestedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Approval Mode:</span>
                    <span className="font-medium text-text-primary">
                      {selectedApproval.approvalMode === 'any' ? 'Any approver' : 'All approvers'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedApproval.message && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Message from Requester
                  </p>
                  <div className="rounded-lg border border-[#E5E7EB] bg-blue-50 p-3">
                    <p className="text-sm text-text-secondary italic">{selectedApproval.message}</p>
                  </div>
                </div>
              )}

              {/* Approvers */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                  Approvers
                </p>
                <div className="space-y-2">
                  {selectedApproval.approvers.map((approver) => (
                    <div
                      key={approver.userId}
                      className="flex items-center justify-between rounded-lg border border-[#E5E7EB] p-3 bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-text-primary">{approver.name}</p>
                        <p className="text-xs text-text-secondary">{approver.email}</p>
                      </div>
                      {approver.status === 'approved' && (
                        <CheckCircle2 className="h-5 w-5 text-[#16A34A]" />
                      )}
                      {approver.status === 'pending' && (
                        <Clock className="h-5 w-5 text-amber-600" />
                      )}
                      {approver.status === 'changes_requested' && (
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Selection */}
              {selectedApproval.approvers.some(
                (a) => a.userId === CURRENT_USER_ID && a.status === 'pending'
              ) && !approvalAction && (
                <div className="space-y-2 pt-4 border-t border-[#E5E7EB]">
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Your Action
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={handleApproveClick}
                      className="border-[#16A34A] text-[#16A34A] hover:bg-[#F0FDF4]"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleChangesClick}
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Request Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* Comment Input */}
              {approvalAction && (
                <div className="space-y-2 bg-gray-50 rounded-lg border border-[#E5E7EB] p-3">
                  <p className="text-xs font-medium text-text-secondary">
                    {approvalAction === 'approve'
                      ? 'Add Optional Comment'
                      : 'Please provide details about the changes needed'}
                  </p>
                  <Textarea
                    placeholder={
                      approvalAction === 'approve'
                        ? 'e.g., "Looks good, no issues found."'
                        : 'e.g., "Please clarify the budget breakdown and adjust timeline by 2 weeks."'
                    }
                    value={actionComment}
                    onChange={(e) => setActionComment(e.target.value)}
                    className="min-h-24 border-[#E5E7EB] resize-none"
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              {!approvalAction ? (
                <Button
                  variant="outline"
                  onClick={() => setShowDetailDialog(false)}
                  className="border-[#E5E7EB]"
                >
                  Close
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setApprovalAction(null)}
                    className="border-[#E5E7EB]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitAction}
                    className={cn(
                      'text-white',
                      approvalAction === 'approve'
                        ? 'bg-[#16A34A] hover:bg-[#15803D]'
                        : 'bg-blue-600 hover:bg-blue-700'
                    )}
                  >
                    {approvalAction === 'approve' ? 'Approve' : 'Request Changes'}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
