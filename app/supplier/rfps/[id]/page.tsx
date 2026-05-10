'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  XCircle,
  Upload,
  Plus,
  History,
  StickyNote,
  ChevronRight,
  ChevronDown,
  Users,
  MoreHorizontal,
  Crown,
  Trash2,
  Mail,
  Phone,
  Star,
  Tag,
  TrendingUp,
  MessageSquare,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { internalTeamMembers } from '@/lib/mock-rfp'
import { 
  mockRFPDetail, 
  mockApprovers, 
  SUPPLIER_PHASE_CONFIG,
  SUPPLIER_PHASE_ORDER,
  type SupplierRFPPhase,
  type SupplierRFPPhaseTransition,
  type SupplierProposalNote 
} from '@/lib/mock-supplier-rfps'
import type { RFPTeamMember, RFPTeamRole } from '@/types/rfp'
import { ApprovalRequestModal } from '@/components/approval/ApprovalRequestModal'
import { ApprovalStatus } from '@/components/approval/ApprovalStatus'
import { SupplierCopilot } from '@/components/proposal/SupplierCopilot'
import { mockSupplierApprovalRequests } from '@/lib/mock-approvals'
import type { ApprovalRequest } from '@/types/approval'

const ROLE_OPTIONS: RFPTeamRole[] = ['Lead', 'Reviewer', 'Approver', 'Observer']

const roleStyles: Record<RFPTeamRole, string> = {
  Lead:     'bg-[#DCFCE7] text-[#15803D] border-[#16A34A]/20',
  Approver: 'bg-blue-50 text-blue-700 border-blue-200',
  Reviewer: 'bg-amber-50 text-amber-700 border-amber-200',
  Observer: 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function RFPDetailPage() {
  const router = useRouter()
  const params = useParams()
  
  // Phase and submission state
  const [currentPhase, setCurrentPhase] = useState<SupplierRFPPhase>(mockRFPDetail.currentPhase)
  const [phaseHistory, setPhaseHistory] = useState<SupplierRFPPhaseTransition[]>(mockRFPDetail.phaseHistory)
  const [proposalNotes, setProposalNotes] = useState<SupplierProposalNote[]>(mockRFPDetail.proposalNotes)
  const [phaseBeforeDecline, setPhaseBeforeDecline] = useState<SupplierRFPPhase | null>(mockRFPDetail.phaseBeforeDecline)
  
  // Modal states
  const [showDeclineConfirmModal, setShowDeclineConfirmModal] = useState(false)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [showFinalReviewModal, setShowFinalReviewModal] = useState(false)
  const [showPhaseHistoryModal, setShowPhaseHistoryModal] = useState(false)
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  
  // Form states
  const [transitionNotes, setTransitionNotes] = useState('')
  const [newNoteText, setNewNoteText] = useState('')
  const [questionResponses, setQuestionResponses] = useState<Record<string, string>>({})
  const [submissionAttachments, setSubmissionAttachments] = useState<File[]>([])
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([])

  // Internal team state
  const [team, setTeam] = useState<RFPTeamMember[]>([
    { ...internalTeamMembers[0], role: 'Lead', isLead: true },
    { ...internalTeamMembers[1], role: 'Reviewer', isLead: false },
  ])
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false)
  const [addingTeamMember, setAddingTeamMember] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [selectedRole, setSelectedRole] = useState<RFPTeamRole>('Reviewer')

  const [approvalCardOpen, setApprovalCardOpen] = useState(true)
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)
  const [interestRegistered, setInterestRegistered] = useState(false)

  // Approval workflow states - use mockRFPDetail directly since rfp is defined later
  const [currentApproval, setCurrentApproval] = useState<ApprovalRequest | null>(
    mockSupplierApprovalRequests.find(a => a.itemId === mockRFPDetail.id) || null
  )

  const internalTeamAsApprovers = team.filter(m => ['Lead', 'Approver'].includes(m.role))
  const availableTeamApprovers = team.map(m => ({
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role,
  }))

  const handleTeamAddMember = () => {
    if (!selectedMemberId) return
    const person = internalTeamMembers.find((m) => m.id === selectedMemberId)
    if (!person) return
    const updatedTeam = selectedRole === 'Lead'
      ? team.map((m) => m.isLead ? { ...m, isLead: false, role: 'Reviewer' as RFPTeamRole } : m)
      : [...team]
    setTeam([...updatedTeam, { ...person, role: selectedRole, isLead: selectedRole === 'Lead' }])
    setSelectedMemberId('')
    setSelectedRole('Reviewer')
    setAddingTeamMember(false)
  }

  const handleTeamRemove = (id: string) => setTeam(team.filter((m) => m.id !== id))

  const handleTeamChangeRole = (id: string, role: RFPTeamRole) => {
    setTeam(team.map((m) => {
      if (m.id === id) return { ...m, role, isLead: role === 'Lead' }
      if (role === 'Lead' && m.isLead) return { ...m, isLead: false, role: 'Reviewer' as RFPTeamRole }
      return m
    }))
  }

  const availableTeamMembers = internalTeamMembers.filter((m) => !team.some((t) => t.id === m.id))

  const rfp = mockRFPDetail

  const handleResubmitForApproval = () => {
    if (!currentApproval) return
    // Reset all approvers to pending and update the approval request
    const updatedApproval: ApprovalRequest = {
      ...currentApproval,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      approvers: currentApproval.approvers.map(a => ({
        ...a,
        status: 'pending' as const,
        comment: undefined,
        respondedAt: undefined,
      })),
    }
    setCurrentApproval(updatedApproval)
  }

  const handleSendForApproval = (data: { approverIds: string[]; message: string; approvalMode: 'any' | 'all' }) => {
    const newApproval: ApprovalRequest = {
      id: `apr-${Date.now()}`,
      type: 'rfp_submission',
      itemId: rfp.id,
      itemTitle: rfp.title,
      requestedBy: 'user-john',
      requestedByName: 'John Smith',
      requestedAt: new Date().toISOString(),
      message: data.message,
      approvalMode: data.approvalMode,
      approvers: availableTeamApprovers
        .filter(a => data.approverIds.includes(a.id))
        .map(a => ({
          userId: a.id,
          name: a.name,
          email: a.email,
          role: a.role,
          status: 'pending' as const,
        })),
      status: 'pending',
    }
    setCurrentApproval(newApproval)
  }
  
  // Calculate days until deadline
  const daysDue = Math.ceil((new Date(rfp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isDeadlineSoon = daysDue <= 7 && daysDue > 0
  const isOverdue = daysDue < 0
  
  // Get phase index for progress indicator
  const currentPhaseIndex = SUPPLIER_PHASE_ORDER.indexOf(currentPhase)
  const isTerminalPhase = ['awarded', 'rejected', 'declined'].includes(currentPhase)
  
  // Phase transition handlers
  const handleMoveForward = () => {
    const newTransition: SupplierRFPPhaseTransition = {
      phase: currentPhase,
      timestamp: new Date().toISOString(),
      user: 'Current User',
      notes: transitionNotes || undefined,
    }
    
    const nextPhaseIndex = currentPhaseIndex + 1
    if (nextPhaseIndex < SUPPLIER_PHASE_ORDER.length) {
      const nextPhase = SUPPLIER_PHASE_ORDER[nextPhaseIndex]
      setPhaseHistory([...phaseHistory, { ...newTransition, phase: nextPhase }])
      setCurrentPhase(nextPhase)
    }
    setTransitionNotes('')
  }
  
  const handleDeclineToSubmit = () => {
    setPhaseBeforeDecline(currentPhase)
    const declineTransition: SupplierRFPPhaseTransition = {
      phase: 'declined',
      timestamp: new Date().toISOString(),
      user: 'Current User',
      notes: transitionNotes || 'Declined to submit proposal',
    }
    setPhaseHistory([...phaseHistory, declineTransition])
    setCurrentPhase('declined')
    setTransitionNotes('')
    setShowDeclineConfirmModal(false)
  }
  
  const handleReinstateSubmission = () => {
    if (phaseBeforeDecline) {
      const reinstateTransition: SupplierRFPPhaseTransition = {
        phase: phaseBeforeDecline,
        timestamp: new Date().toISOString(),
        user: 'Current User',
        notes: 'Reinstated submission',
      }
      setPhaseHistory([...phaseHistory, reinstateTransition])
      setCurrentPhase(phaseBeforeDecline)
      setPhaseBeforeDecline(null)
    }
  }
  
  const handleSubmitProposal = () => {
    const submitTransition: SupplierRFPPhaseTransition = {
      phase: 'submitted',
      timestamp: new Date().toISOString(),
      user: 'Current User',
      notes: 'Proposal submitted to buyer',
    }
    setPhaseHistory([...phaseHistory, submitTransition])
    setCurrentPhase('submitted')
    setShowFinalReviewModal(false)
    setShowSubmissionModal(false)
  }
  
  const handleAddNote = () => {
    if (!newNoteText.trim()) return
    const newNote: SupplierProposalNote = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Current User',
      text: newNoteText,
    }
    setProposalNotes([...proposalNotes, newNote])
    setNewNoteText('')
    setShowAddNoteModal(false)
  }
  
  const handleContinueResponse = () => {
    if (currentPhase === 'new_rfp') {
      handleMoveForward()
    } else if (currentPhase === 'in_progress') {
      setShowSubmissionModal(true)
    } else if (currentPhase === 'under_final_review') {
      // If changes were requested, trigger resubmit; if no approval exists, open modal
      if (currentApproval?.status === 'changes_requested') {
        handleResubmitForApproval()
      } else if (!currentApproval) {
        setShowApprovalModal(true)
      }
      // If pending, button should be disabled (handled in getPhaseButtonDisabled)
    }
  }
  
  const getPhaseButtonLabel = () => {
    switch (currentPhase) {
      case 'new_rfp': return 'Start Working on Response'
      case 'in_progress': return 'Continue Submission'
      case 'under_final_review': 
        if (currentApproval?.status === 'pending') return 'Awaiting Approval'
        if (currentApproval?.status === 'changes_requested') return 'Resubmit for Approval'
        if (currentApproval?.status === 'approved') return 'Approved - Ready to Submit'
        return 'Send for Approval'
      default: return 'View Status'
    }
  }

  const getPhaseButtonDisabled = () => {
    if (currentPhase === 'under_final_review' && currentApproval?.status === 'pending') {
      return true
    }
    return false
  }

  const handleCopilotMessage = (message: string) => {
    // Handle copilot messages - in production, this would interact with AI
    console.log('[v0] Copilot message:', message)
  }

  const handleRegisterInterest = () => {
    setInterestRegistered(true)
    console.log('[v0] Interest registered for RFP:', rfp.id)
  }

  return (
    <div className={cn('flex h-screen bg-background', isCopilotOpen && 'overflow-hidden')}>
      <div className={cn('flex-1 flex flex-col overflow-hidden', isCopilotOpen ? 'mr-80' : '')}>
        <div className="space-y-6 p-6 overflow-y-auto flex-1">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{rfp.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Building2 className="h-4 w-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">{rfp.buyerCompany}</span>
            {rfp.onlineRFPUrl && (
              <>
                <span className="text-text-secondary">•</span>
                <a
                  href={rfp.onlineRFPUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#16A34A] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Online RFP
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Phase Progress Indicator */}
      <Card className="border-[#E5E7EB] bg-white">
        <CardContent className="p-6">

          {/* Declined banner */}
          {currentPhase === 'declined' && (
            <div className="flex items-center justify-between mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-700 font-medium">You have declined to submit this proposal.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 border-[#16A34A] text-[#16A34A] hover:bg-green-50 shrink-0 ml-4"
                onClick={handleReinstateSubmission}
              >
                Reinstate Submission
              </Button>
            </div>
          )}

          {/* Phase labels row */}
          <div className="flex items-center">
            {SUPPLIER_PHASE_ORDER.map((phase, idx) => {
              const isFinalOutcomeSlot = idx === SUPPLIER_PHASE_ORDER.length - 1
              const isCompleted = currentPhaseIndex > idx && !['declined'].includes(currentPhase)
              const isCurrent = currentPhase === phase
              const isRejected = currentPhase === 'rejected' && isFinalOutcomeSlot
              const isDeclined = currentPhase === 'declined'

              // Determine the label for the last slot
              const label = isFinalOutcomeSlot
                ? currentPhase === 'awarded'
                  ? 'Awarded'
                  : currentPhase === 'rejected'
                  ? 'Not Successful'
                  : 'Final Outcome'
                : SUPPLIER_PHASE_CONFIG[phase].label

              return (
                <div key={phase} className="flex items-center flex-1">
                  <div
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all',
                      // Completed (dark green)
                      isCompleted && !isFinalOutcomeSlot && 'bg-[#15803D] text-white',
                      // Current active phase (light green)
                      isCurrent && !isDeclined && !isFinalOutcomeSlot && 'bg-[#DCFCE7] text-[#15803D] ring-1 ring-[#16A34A]',
                      // Awarded final outcome
                      currentPhase === 'awarded' && isFinalOutcomeSlot && 'bg-[#15803D] text-white',
                      // Rejected final outcome
                      isRejected && 'bg-gray-200 text-gray-600',
                      // Future / unknown final outcome
                      ((!isCurrent && !isCompleted && !(currentPhase === 'awarded' && isFinalOutcomeSlot) && !isRejected) || isDeclined) && 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {label}
                  </div>
                  {idx < SUPPLIER_PHASE_ORDER.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-1 min-w-[6px]',
                        isCompleted ? 'bg-[#15803D]' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Action row */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              {!isTerminalPhase && currentPhase !== 'submitted' && currentPhase !== 'client_reviewing' && currentPhase !== 'declined' && (
                <Button
                  onClick={handleContinueResponse}
                  disabled={getPhaseButtonDisabled()}
                  className="bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4 mr-2" />
                  {getPhaseButtonLabel()}
                </Button>
              )}
              {currentPhase === 'submitted' && (
                <p className="text-sm text-[#16A34A] font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Proposal submitted — awaiting client review.
                </p>
              )}
              {currentPhase === 'client_reviewing' && (
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Client is currently reviewing your proposal.
                </p>
              )}
              {currentPhase === 'awarded' && (
                <p className="text-sm text-[#16A34A] font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Congratulations — your proposal has been awarded.
                </p>
              )}
              {currentPhase === 'rejected' && (
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  This proposal was not successful.
                </p>
              )}
            </div>

            {/* Register Interest & Decline buttons */}
            <div className="flex items-center gap-2">
              {/* Register Interest button */}
              {currentPhase === 'new_rfp' && !interestRegistered && (
                <Button
                  onClick={handleRegisterInterest}
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Register Interest
                </Button>
              )}
              {interestRegistered && (
                <Badge className="bg-[#F0FDF4] text-[#166534] border border-[#16A34A]/20 text-[10px]">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Interest Registered
                </Badge>
              )}

              {/* Decline to Submit — single understated link-style button, hidden once terminal */}
              {!isTerminalPhase && currentPhase !== 'declined' && (
                <button
                  onClick={() => setShowDeclineConfirmModal(true)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2"
                >
                  Decline
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Deadline Warning */}
      {(isDeadlineSoon || isOverdue) && !isTerminalPhase && (
        <div className={cn('p-4 rounded-lg flex items-center gap-3', isOverdue ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200')}>
          <AlertCircle className={cn('h-5 w-5', isOverdue ? 'text-red-600' : 'text-amber-600')} />
          <p className={cn('text-sm font-medium', isOverdue ? 'text-red-800' : 'text-amber-800')}>
            {isOverdue ? `Deadline has passed (${Math.abs(daysDue)} days ago)` : `Deadline approaching: ${daysDue} day${daysDue === 1 ? '' : 's'} remaining`}
          </p>
        </div>
      )}

      {/* Approval Status — collapsible, near top */}
      {currentApproval && (
        <Collapsible open={approvalCardOpen} onOpenChange={setApprovalCardOpen}>
          <Card className={cn('border', currentApproval.status === 'pending' ? 'border-amber-200' : currentApproval.status === 'approved' ? 'border-[#16A34A]/40' : 'border-blue-200')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer select-none pb-3 hover:bg-gray-50/50 transition-colors rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {currentApproval.status === 'pending' && <Clock className="h-4 w-4 text-amber-500" />}
                    {currentApproval.status === 'approved' && <CheckCircle className="h-4 w-4 text-[#16A34A]" />}
                    {currentApproval.status === 'changes_requested' && <AlertCircle className="h-4 w-4 text-blue-500" />}
                    Approval Status
                    <Badge className={cn('text-[10px] h-4 px-1.5 ml-1',
                      currentApproval.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      currentApproval.status === 'approved' ? 'bg-[#F0FDF4] text-[#166534] border border-[#16A34A]/20' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    )}>
                      {currentApproval.status === 'pending' ? `${currentApproval.approvers.filter(a => a.status === 'approved').length}/${currentApproval.approvers.length} approved` :
                       currentApproval.status === 'approved' ? 'Approved' : 'Changes Requested'}
                    </Badge>
                  </CardTitle>
                  <ChevronDown className={cn('h-4 w-4 text-text-secondary transition-transform', approvalCardOpen && 'rotate-180')} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <ApprovalStatus 
                  approval={currentApproval} 
                  compact={false} 
                  onResubmit={currentApproval.status === 'changes_requested' ? handleResubmitForApproval : undefined}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Details — single-line pill row */}
          <Card>
            <CardContent className="py-3 px-4">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Building2 className="h-3.5 w-3.5 text-text-secondary" />
                  <span className="text-xs text-text-secondary">Buyer:</span>
                  <span className="text-xs font-medium text-text-primary">{rfp.buyerCompany}</span>
                </div>
                <div className="w-px h-3.5 bg-border hidden sm:block" />
                <div className="flex items-center gap-1.5 shrink-0">
                  <Tag className="h-3.5 w-3.5 text-text-secondary" />
                  <span className="text-xs text-text-secondary">Category:</span>
                  <span className="text-xs font-medium text-text-primary">{rfp.category}</span>
                </div>
                <div className="w-px h-3.5 bg-border hidden sm:block" />
                <div className="flex items-center gap-1.5 shrink-0">
                  <DollarSign className="h-3.5 w-3.5 text-text-secondary" />
                  <span className="text-xs text-text-secondary">Budget:</span>
                  <span className="text-xs font-medium text-text-primary">{rfp.budget}</span>
                </div>
                <div className="w-px h-3.5 bg-border hidden sm:block" />
                <div className="flex items-center gap-1.5 shrink-0">
                  <TrendingUp className="h-3.5 w-3.5 text-text-secondary" />
                  <span className="text-xs text-text-secondary">Est. Value:</span>
                  <span className="text-xs font-medium text-text-primary">${rfp.estimatedValue.toLocaleString()}</span>
                </div>
                <div className="w-px h-3.5 bg-border hidden sm:block" />
                <div className="flex items-center gap-1.5 shrink-0">
                  <Calendar className="h-3.5 w-3.5 text-text-secondary" />
                  <span className="text-xs text-text-secondary">Deadline:</span>
                  <span className={cn('text-xs font-medium', isOverdue ? 'text-red-600' : isDeadlineSoon ? 'text-amber-600' : 'text-text-primary')}>
                    {new Date(rfp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {!isTerminalPhase && !isOverdue && daysDue > 0 && (
                      <span className="ml-1 text-text-secondary font-normal">({daysDue}d)</span>
                    )}
                  </span>
                </div>
                <div className="w-px h-3.5 bg-border hidden sm:block" />
                <div className="flex items-center gap-1.5 shrink-0">
                  <Clock className="h-3.5 w-3.5 text-text-secondary" />
                  <span className="text-xs text-text-secondary">Registered:</span>
                  <span className="text-xs font-medium text-text-primary">
                    {new Date(rfp.registeredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About This RFP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-primary leading-relaxed">{rfp.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {rfp.requirements.map((req, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-text-primary">
                    <span className="text-[#16A34A] font-bold">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {rfp.deliverables.map((deliverable, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-text-primary">
                    <span className="text-[#16A34A] font-bold">•</span>
                    {deliverable}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rfp.timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-[#16A34A]" />
                      {idx !== rfp.timeline.length - 1 && (
                        <div className="h-8 w-0.5 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <p className="text-sm font-medium text-text-primary">{item.phase}</p>
                      <p className="text-xs text-text-secondary">
                        {new Date(item.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">RFP Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {rfp.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-background transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 text-text-secondary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{doc.name}</p>
                      <p className="text-xs text-text-secondary">{doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Internal Team Card */}
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-text-primary flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#16A34A]" />
                  Internal Team
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddingTeamMember(true)}
                  disabled={availableTeamMembers.length === 0}
                  className="border-[#E5E7EB] text-text-secondary h-8 text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Add member row */}
              {addingTeamMember && (
                <div className="flex flex-col gap-2 rounded-lg border border-dashed border-[#16A34A]/40 bg-[#F0FDF4]/50 p-3">
                  <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                    <SelectTrigger className="border-[#E5E7EB] h-8 text-sm">
                      <SelectValue placeholder="Select team member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeamMembers.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <span className="font-medium">{m.name}</span>
                          <span className="ml-2 text-text-secondary text-xs">{m.jobTitle}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as RFPTeamRole)}>
                      <SelectTrigger className="flex-1 border-[#E5E7EB] h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={handleTeamAddMember}
                      disabled={!selectedMemberId}
                      className="h-8 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs px-3"
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setAddingTeamMember(false); setSelectedMemberId('') }}
                      className="h-8 text-xs text-text-secondary"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {team.length === 0 && !addingTeamMember && (
                <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-[#E5E7EB] rounded-lg">
                  <Users className="h-7 w-7 text-text-secondary mb-2" />
                  <p className="text-sm text-text-secondary font-medium">No team members assigned</p>
                  <p className="text-xs text-text-secondary mt-0.5">Add a Lead to get started</p>
                </div>
              )}

              {/* Lead member */}
              {[...team].sort((a, b) => (b.isLead ? 1 : 0) - (a.isLead ? 1 : 0)).slice(0, 1).map((member) => (
                <div
                  key={member.id}
                  className="flex items-start gap-3 rounded-lg border border-[#16A34A]/25 bg-[#F0FDF4]/40 p-3"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16A34A] text-white text-sm font-semibold">
                      {member.avatarInitials}
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400">
                      <Crown className="h-2.5 w-2.5 text-white" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-text-primary truncate">{member.name}</span>
                      <Badge className={cn('text-[10px] h-4 px-1.5 border', roleStyles[member.role])}>
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-secondary truncate">{member.jobTitle} &middot; {member.department}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                        <Mail className="h-3 w-3" />{member.email}
                      </span>
                      {member.phone && (
                        <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                          <Phone className="h-3 w-3" />{member.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-text-secondary hover:text-text-primary shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      {ROLE_OPTIONS.filter((r) => r !== member.role).map((role) => (
                        <DropdownMenuItem key={role} onClick={() => handleTeamChangeRole(member.id, role)} className="text-sm">
                          Change role to {role}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleTeamRemove(member.id)} className="text-sm text-red-600 focus:text-red-600">
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {/* Other members — collapsible */}
              {team.length > 1 && (
                <Collapsible open={teamDropdownOpen} onOpenChange={setTeamDropdownOpen}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary w-full py-1">
                    <ChevronDown className={cn('h-3 w-3 transition-transform', teamDropdownOpen && 'rotate-180')} />
                    <span>{team.length - 1} other team {team.length - 1 === 1 ? 'member' : 'members'}</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 pt-1">
                    {[...team].sort((a, b) => (b.isLead ? 1 : 0) - (a.isLead ? 1 : 0)).slice(1).map((member) => (
                      <div key={member.id} className="flex items-start gap-3 rounded-lg border border-[#E5E7EB] bg-white p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-semibold shrink-0">
                          {member.avatarInitials}
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-text-primary truncate">{member.name}</span>
                            <Badge className={cn('text-[10px] h-4 px-1.5 border', roleStyles[member.role])}>
                              {member.role}
                            </Badge>
                          </div>
                          <p className="text-xs text-text-secondary truncate">{member.jobTitle}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-text-secondary hover:text-text-primary shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => handleTeamChangeRole(member.id, 'Lead')} className="text-sm">
                              <Crown className="h-3.5 w-3.5 mr-2 text-amber-400" />
                              Set as Lead
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {ROLE_OPTIONS.filter((r) => r !== member.role && r !== 'Lead').map((role) => (
                              <DropdownMenuItem key={role} onClick={() => handleTeamChangeRole(member.id, role)} className="text-sm">
                                Change role to {role}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleTeamRemove(member.id)} className="text-sm text-red-600 focus:text-red-600">
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* No lead warning */}
              {team.length > 0 && !team.some((m) => m.isLead) && (
                <p className="text-xs text-amber-600 flex items-center gap-1.5 pt-1">
                  <Star className="h-3.5 w-3.5" />
                  No Lead assigned. Set a Lead to define the primary contact.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Phase History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Phase History</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => setShowPhaseHistoryModal(true)}
              >
                <History className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {phaseHistory.slice(-3).reverse().map((transition, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'h-2 w-2 rounded-full mt-1.5',
                      transition.phase === 'declined' ? 'bg-red-500' : 'bg-[#16A34A]'
                    )} />
                    {idx < Math.min(phaseHistory.length - 1, 2) && (
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="font-medium text-text-primary">{SUPPLIER_PHASE_CONFIG[transition.phase].label}</p>
                    <p className="text-xs text-text-secondary">
                      {new Date(transition.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} by {transition.user}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Proposal Notes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Proposal Notes</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => setShowAddNoteModal(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {proposalNotes.length === 0 ? (
                <p className="text-sm text-text-secondary">No notes yet</p>
              ) : (
                proposalNotes.slice(-3).reverse().map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-text-primary">{note.text}</p>
                    <p className="text-xs text-text-secondary mt-1">
                      {new Date(note.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {note.user}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download RFP
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Share
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Decline Confirmation Modal */}
      <Dialog open={showDeclineConfirmModal} onOpenChange={setShowDeclineConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Decline to Submit</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-text-secondary mb-4">
            Are you sure you want to decline this RFP? This will pause all work on this proposal. You can reinstate it at any time if you change your mind.
          </p>
          <div className="space-y-3">
            <Label htmlFor="decline-reason">Reason for declining</Label>
            <Textarea
              id="decline-reason"
              value={transitionNotes}
              onChange={(e) => setTransitionNotes(e.target.value)}
              placeholder="Enter reason for declining..."
              className="min-h-[80px]"
            />
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeclineConfirmModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeclineToSubmit}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Confirm Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Submission Modal - Questions Page */}
      <Dialog open={showSubmissionModal} onOpenChange={setShowSubmissionModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Develop Proposal Response</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-text-secondary mb-4">
            Complete the following questions from the buyer to develop your proposal. All required fields must be completed before moving to final review.
          </p>
          
          <div className="space-y-6">
            {rfp.buyerQuestions.map((q) => (
              <div key={q.id} className="space-y-2">
                <Label htmlFor={q.id} className="flex items-center gap-2">
                  {q.question}
                  {q.required && <span className="text-red-500">*</span>}
                </Label>
                <Textarea
                  id={q.id}
                  value={questionResponses[q.id] || ''}
                  onChange={(e) => setQuestionResponses({ ...questionResponses, [q.id]: e.target.value })}
                  placeholder="Enter your response..."
                  className="min-h-[100px]"
                />
              </div>
            ))}
            
            {/* Attachment Upload */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <Label>Attachments</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-text-secondary">Drag and drop files or click to upload</p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setSubmissionAttachments([...submissionAttachments, ...Array.from(e.target.files)])
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
                    Choose Files
                  </Button>
                </div>
              </div>
              {submissionAttachments.length > 0 && (
                <div className="space-y-2">
                  {submissionAttachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSubmissionAttachments(submissionAttachments.filter((_, i) => i !== idx))}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowSubmissionModal(false)}>
              Save Draft
            </Button>
            <Button
              className="bg-[#16A34A] hover:bg-[#15803D]"
              onClick={() => {
                setShowSubmissionModal(false)
                handleMoveForward()
              }}
            >
              Continue to Final Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Final Review Modal */}
      <Dialog open={showFinalReviewModal} onOpenChange={setShowFinalReviewModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Final Review & Submit</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-text-secondary mb-4">
            Review your responses before submitting. Once submitted, you cannot make further changes.
          </p>
          
          <div className="space-y-4">
            {rfp.buyerQuestions.map((q) => (
              <div key={q.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-text-primary mb-2">{q.question}</p>
                <p className="text-sm text-text-secondary">
                  {questionResponses[q.id] || <span className="italic">No response provided</span>}
                </p>
              </div>
            ))}
            
            {submissionAttachments.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-text-primary mb-2">Attachments ({submissionAttachments.length})</p>
                <div className="space-y-1">
                  {submissionAttachments.map((file, idx) => (
                    <p key={idx} className="text-sm text-text-secondary">• {file.name}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2 mt-6">
            <Button variant="outline" onClick={() => {
              setShowFinalReviewModal(false)
              setShowSubmissionModal(true)
            }}>
              Edit Responses
            </Button>
            <Button
              className="bg-[#16A34A] hover:bg-[#15803D]"
              onClick={handleSubmitProposal}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Approval Modal */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Proposal for Approval</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-text-secondary mb-4">
            Select the approvers who need to review this proposal before it can be submitted. They will receive an email with the current proposal status, responses, and attachments.
          </p>
          
          <div className="space-y-3">
            <Label>Select Approvers</Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {mockApprovers.map((approver) => (
                <label
                  key={approver.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                    selectedApprovers.includes(approver.id)
                      ? 'border-[#16A34A] bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedApprovers.includes(approver.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedApprovers([...selectedApprovers, approver.id])
                      } else {
                        setSelectedApprovers(selectedApprovers.filter(id => id !== approver.id))
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{approver.name}</p>
                    <p className="text-xs text-text-secondary">{approver.role} • {approver.email}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#16A34A] hover:bg-[#15803D]"
              onClick={handleSendForApproval}
              disabled={selectedApprovers.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Send for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Phase History Modal */}
      <Dialog open={showPhaseHistoryModal} onOpenChange={setShowPhaseHistoryModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Phase History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {phaseHistory.map((transition, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'h-3 w-3 rounded-full',
                    transition.phase === 'declined' ? 'bg-red-500' : 'bg-[#16A34A]'
                  )} />
                  {idx < phaseHistory.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-text-primary">{SUPPLIER_PHASE_CONFIG[transition.phase].label}</p>
                  <p className="text-xs text-text-secondary">
                    {new Date(transition.timestamp).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-text-secondary">by {transition.user}</p>
                  {transition.notes && (
                    <p className="text-sm text-text-primary mt-2 p-2 bg-gray-50 rounded">{transition.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Note Modal */}
      <Dialog open={showAddNoteModal} onOpenChange={setShowAddNoteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Proposal Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="new-note">Note</Label>
            <Textarea
              id="new-note"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Add a note about this proposal..."
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddNoteModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#16A34A] hover:bg-[#15803D]"
              onClick={handleAddNote}
            >
              <StickyNote className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Approval Request Modal */}
      <ApprovalRequestModal
        open={showApprovalModal && !currentApproval}
        onOpenChange={(open) => {
          if (!open) setShowApprovalModal(false)
        }}
        title="Send Proposal for Approval"
        description="Select team members to review and approve this proposal before submission to the buyer. Approvers will receive emails with a direct link to review."
        type="rfp_submission"
        itemId={rfp.id}
        itemTitle={rfp.title}
        availableApprovers={availableTeamApprovers}
        onSubmit={handleSendForApproval}
      />
        </div>
      </div>

      {/* Copilot Toggle Button */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed right-4 bottom-4 h-12 w-12 rounded-full bg-brand-green hover:bg-brand-green/90 text-white shadow-lg flex items-center justify-center transition-colors z-40"
          aria-label="Open AI copilot"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}

      {/* Copilot Panel */}
      {isCopilotOpen && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-border shadow-lg flex flex-col z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-green" />
              <h3 className="text-sm font-semibold text-text-primary">Proposal Copilot</h3>
            </div>
            <button
              onClick={() => setIsCopilotOpen(false)}
              className="rounded-md text-text-muted hover:bg-surface-hover hover:text-text-primary p-1.5 transition-colors"
              aria-label="Close copilot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <SupplierCopilot
              rfpTitle={rfp.title}
              onSendMessage={handleCopilotMessage}
            />
          </div>
        </div>
      )}
    </div>
  )
}
