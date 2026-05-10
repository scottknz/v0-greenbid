'use client'

import { useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Eye,
  Pencil,
  Trophy,
  Ban,
  Printer,
  Archive,
  RotateCcw,
  Filter,
  Search,
  CheckCircle2,
  Circle,
  Folder,
  HelpCircle,
  Activity,
  FileCheck,
  Link2,
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
import { mockSupplierApprovalRequests } from '@/lib/mock-approvals'
import type { ApprovalRequest } from '@/types/approval'

const ROLE_OPTIONS: RFPTeamRole[] = ['Lead', 'Reviewer', 'Approver', 'Observer']

const roleStyles: Record<RFPTeamRole, string> = {
  Lead:     'bg-[#DCFCE7] text-[#15803D] border-[#16A34A]/20',
  Approver: 'bg-blue-50 text-blue-700 border-blue-200',
  Reviewer: 'bg-amber-50 text-amber-700 border-amber-200',
  Observer: 'bg-gray-100 text-gray-600 border-gray-200',
}

// Phase icon mapping
const PhaseIcon = ({ phase, className }: { phase: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    new_rfp: <Eye className={className} />,
    in_progress: <Pencil className={className} />,
    under_final_review: <Users className={className} />,
    submitted: <Send className={className} />,
    client_reviewing: <Clock className={className} />,
    awarded: <Trophy className={className} />,
    rejected: <XCircle className={className} />,
    declined: <Ban className={className} />,
  }
  return icons[phase] || <Circle className={className} />
}

// Mock related RFPs
const relatedRFPs = [
  { id: 'rfp-002', title: 'Q3 Sustainable Packaging Supply', status: 'submitted', deadline: '2026-05-15' },
  { id: 'rfp-003', title: 'Carbon Neutral Logistics RFP', status: 'in_progress', deadline: '2026-06-01' },
]

// Mock proposal documents (supplier uploads)
const mockProposalDocuments = [
  { id: 'pd-1', name: 'Technical Proposal v2.pdf', size: '4.2 MB', uploadedAt: '2026-05-08', version: 2, status: 'active' },
  { id: 'pd-2', name: 'Pricing Schedule.xlsx', size: '156 KB', uploadedAt: '2026-05-07', version: 1, status: 'active' },
  { id: 'pd-3', name: 'Company Certifications.pdf', size: '2.1 MB', uploadedAt: '2026-05-06', version: 1, status: 'active' },
  { id: 'pd-4', name: 'Technical Proposal v1.pdf', size: '3.8 MB', uploadedAt: '2026-05-05', version: 1, status: 'archived' },
]

// Mock messages/comms
const mockMessages = [
  { id: 'm-1', type: 'public', subject: 'Clarification on delivery timeline', sender: 'Jane Smith (Buyer)', date: '2026-05-08', unread: true },
  { id: 'm-2', type: 'private', subject: 'Re: Pricing adjustments', sender: 'You', date: '2026-05-07', unread: false },
  { id: 'm-3', type: 'public', subject: 'Updated specifications', sender: 'Jane Smith (Buyer)', date: '2026-05-05', unread: false },
]

// Mock activity for the RFP
const mockRFPActivity = [
  { id: 'a-1', type: 'phase_change', description: 'Phase changed to Preparation', user: 'John Smith', date: '2026-05-08T14:30:00Z' },
  { id: 'a-2', type: 'document_upload', description: 'Uploaded Technical Proposal v2.pdf', user: 'John Smith', date: '2026-05-08T11:15:00Z' },
  { id: 'a-3', type: 'team_added', description: 'Added Sarah Johnson to team', user: 'John Smith', date: '2026-05-07T16:45:00Z' },
  { id: 'a-4', type: 'note_added', description: 'Added internal note', user: 'Emily Chen', date: '2026-05-07T10:20:00Z' },
  { id: 'a-5', type: 'message_received', description: 'New message from buyer', user: 'System', date: '2026-05-06T09:00:00Z' },
  { id: 'a-6', type: 'interest_registered', description: 'Registered interest in RFP', user: 'John Smith', date: '2026-05-05T08:30:00Z' },
]

export default function RFPDetailPage() {
  const router = useRouter()
  const params = useParams()
  
  // Tab state
  const [activeTab, setActiveTab] = useState('overview')
  
  // Phase and submission state
  const [currentPhase, setCurrentPhase] = useState<SupplierRFPPhase>(mockRFPDetail.currentPhase)
  const [phaseHistory, setPhaseHistory] = useState<SupplierRFPPhaseTransition[]>(mockRFPDetail.phaseHistory)
  const [proposalNotes, setProposalNotes] = useState<SupplierProposalNote[]>(mockRFPDetail.proposalNotes)
  const [phaseBeforeDecline, setPhaseBeforeDecline] = useState<SupplierRFPPhase | null>(mockRFPDetail.phaseBeforeDecline)
  
  // Modal states
  const [showDeclineConfirmModal, setShowDeclineConfirmModal] = useState(false)
  const [showInitialReviewModal, setShowInitialReviewModal] = useState(false)
  const [showPhaseHistoryModal, setShowPhaseHistoryModal] = useState(false)
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  
  // Form states
  const [transitionNotes, setTransitionNotes] = useState('')
  const [newNoteText, setNewNoteText] = useState('')
  const [questionResponses, setQuestionResponses] = useState<Record<string, string>>({})
  const [submissionAttachments, setSubmissionAttachments] = useState<File[]>([])
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([])

  // Filter states for Activity tab
  const [activitySearch, setActivitySearch] = useState('')
  const [activityTypeFilter, setActivityTypeFilter] = useState('all')

  // Internal team state
  const [team, setTeam] = useState<RFPTeamMember[]>([
    { ...internalTeamMembers[0], role: 'Lead', isLead: true },
    { ...internalTeamMembers[1], role: 'Reviewer', isLead: false },
  ])
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false)
  const [addingTeamMember, setAddingTeamMember] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [selectedRole, setSelectedRole] = useState<RFPTeamRole>('Reviewer')

  const [interestRegistered, setInterestRegistered] = useState(false)

  // Approval workflow states
  const [currentApproval, setCurrentApproval] = useState<ApprovalRequest | null>(
    mockSupplierApprovalRequests.find(a => a.itemId === mockRFPDetail.id) || null
  )

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
    setShowApprovalModal(false)
  }
  
  // Calculate days until deadline
  const daysDue = Math.ceil((new Date(rfp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const hoursDue = Math.ceil((new Date(rfp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60))
  const isDeadlineSoon = daysDue <= 7 && daysDue > 0
  const isOverdue = daysDue < 0
  
  // Get phase index for progress indicator
  const currentPhaseIndex = SUPPLIER_PHASE_ORDER.indexOf(currentPhase)
  const isTerminalPhase = ['awarded', 'rejected', 'declined'].includes(currentPhase)
  
  // Calculate requirements completion
  const totalRequirements = rfp.requirements.length + rfp.deliverables.length + rfp.buyerQuestions.length
  const completedRequirements = Object.keys(questionResponses).length + mockProposalDocuments.filter(d => d.status === 'active').length
  const completionPercent = Math.min(100, Math.round((completedRequirements / totalRequirements) * 100))
  
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
  
  const handleProgressProposal = () => {
    if (currentPhase === 'new_rfp') {
      setShowInitialReviewModal(true)
    } else if (currentPhase === 'in_progress') {
      setActiveTab('questionnaire')
    } else if (currentPhase === 'under_final_review') {
      if (!currentApproval) {
        setShowApprovalModal(true)
      }
    }
  }
  
  const handleConfirmProceed = () => {
    setShowInitialReviewModal(false)
    handleMoveForward()
  }
  
  const getProgressButtonLabel = () => {
    switch (currentPhase) {
      case 'new_rfp': return 'Progress Proposal'
      case 'in_progress': return 'Progress Proposal'
      case 'under_final_review': 
        if (currentApproval?.status === 'pending') return 'Awaiting Approval'
        if (currentApproval?.status === 'approved') return 'Submit to Client'
        return 'Progress Proposal'
      default: return 'View Status'
    }
  }

  const getProgressButtonDisabled = () => {
    if (currentPhase === 'under_final_review' && currentApproval?.status === 'pending') {
      return true
    }
    if (isTerminalPhase || currentPhase === 'submitted' || currentPhase === 'client_reviewing') {
      return true
    }
    return false
  }

  const handleRegisterInterest = () => {
    setInterestRegistered(true)
  }

  const handleExportActivity = () => {
    const headers = ['Date', 'Type', 'Description', 'User']
    const rows = mockRFPActivity.map((a) => [
      new Date(a.date).toLocaleString('en-GB'),
      a.type,
      a.description,
      a.user,
    ])
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `rfp-activity-${rfp.id}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handlePrintProposal = () => {
    window.print()
  }

  const filteredActivity = useMemo(() => {
    return mockRFPActivity.filter((activity) => {
      const matchesSearch = activity.description.toLowerCase().includes(activitySearch.toLowerCase()) ||
        activity.user.toLowerCase().includes(activitySearch.toLowerCase())
      const matchesType = activityTypeFilter === 'all' || activity.type === activityTypeFilter
      return matchesSearch && matchesType
    })
  }, [activitySearch, activityTypeFilter])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Breadcrumb and Header */}
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="px-6 py-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-text-secondary mb-3">
            <Link href="/supplier" className="hover:text-text-primary">Supplier Portal</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/supplier/rfps" className="hover:text-text-primary">RFPs</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-text-primary font-medium truncate max-w-[200px]">{rfp.title}</span>
          </nav>
          
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-9 w-9 shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-text-primary truncate">{rfp.title}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {rfp.buyerCompany}
                  </span>
                  {rfp.onlineRFPUrl && (
                    <a
                      href={rfp.onlineRFPUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#16A34A] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Online RFP
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handlePrintProposal} className="gap-1.5">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="border-b border-border bg-surface">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-text-secondary" />
                <span className="text-xs text-text-secondary">Category:</span>
                <span className="text-xs font-medium">{rfp.category}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-text-secondary" />
                <span className="text-xs text-text-secondary">Budget:</span>
                <span className="text-xs font-medium">{rfp.budget}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-text-secondary" />
                <span className="text-xs text-text-secondary">Est. Value:</span>
                <span className="text-xs font-medium">${rfp.estimatedValue.toLocaleString()}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-text-secondary" />
                <span className="text-xs text-text-secondary">Completion:</span>
                <span className="text-xs font-medium">{completionPercent}%</span>
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#16A34A] rounded-full" style={{ width: `${completionPercent}%` }} />
                </div>
              </div>
            </div>
            
            {/* Deadline Countdown */}
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg',
              isOverdue ? 'bg-red-50 text-red-700' : isDeadlineSoon ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-text-secondary'
            )}>
              <Clock className="h-4 w-4" />
              {isOverdue ? (
                <span className="text-xs font-medium">Deadline passed ({Math.abs(daysDue)} days ago)</span>
              ) : daysDue === 0 ? (
                <span className="text-xs font-medium">Due today ({hoursDue}h remaining)</span>
              ) : (
                <span className="text-xs font-medium">
                  {daysDue} day{daysDue !== 1 ? 's' : ''} remaining
                  <span className="text-text-muted font-normal ml-1">
                    ({new Date(rfp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar - New Design with Icons */}
      <div className="border-b border-border bg-white">
        <div className="px-6 py-5">
          {/* Declined banner */}
          {currentPhase === 'declined' && (
            <div className="flex items-center justify-between mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-700 font-medium">You have declined to submit this proposal.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 border-[#16A34A] text-[#16A34A] hover:bg-green-50 shrink-0"
                onClick={handleReinstateSubmission}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reinstate Submission
              </Button>
            </div>
          )}

          {/* Progress Steps with Icons */}
          <div className="flex items-start justify-between">
            {SUPPLIER_PHASE_ORDER.map((phase, idx) => {
              const isFinalOutcomeSlot = idx === SUPPLIER_PHASE_ORDER.length - 1
              const isCompleted = currentPhaseIndex > idx && !['declined'].includes(currentPhase)
              const isCurrent = currentPhase === phase || (isFinalOutcomeSlot && (currentPhase === 'awarded' || currentPhase === 'rejected'))
              const isDeclined = currentPhase === 'declined'
              
              const config = SUPPLIER_PHASE_CONFIG[phase]
              const label = isFinalOutcomeSlot
                ? currentPhase === 'awarded'
                  ? 'Awarded'
                  : currentPhase === 'rejected'
                  ? 'Not Successful'
                  : 'Final Outcome'
                : config.label

              return (
                <div key={phase} className="flex flex-col items-center flex-1 relative">
                  {/* Connector line */}
                  {idx < SUPPLIER_PHASE_ORDER.length - 1 && (
                    <div
                      className={cn(
                        'absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5',
                        isCompleted ? 'bg-[#16A34A]' : 'bg-gray-200'
                      )}
                    />
                  )}
                  
                  {/* Icon Circle */}
                  <div
                    className={cn(
                      'relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all',
                      isCompleted && 'bg-[#16A34A] text-white',
                      isCurrent && !isCompleted && !isDeclined && 'bg-[#DCFCE7] text-[#16A34A] ring-2 ring-[#16A34A] ring-offset-2',
                      isCurrent && currentPhase === 'awarded' && 'bg-[#16A34A] text-white',
                      isCurrent && currentPhase === 'rejected' && 'bg-gray-400 text-white',
                      !isCurrent && !isCompleted && !isDeclined && 'bg-gray-100 text-gray-400',
                      isDeclined && 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <PhaseIcon phase={isFinalOutcomeSlot ? (currentPhase === 'awarded' ? 'awarded' : currentPhase === 'rejected' ? 'rejected' : phase) : phase} className="h-5 w-5" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <p className={cn(
                    'mt-2 text-xs font-medium text-center max-w-[80px]',
                    (isCompleted || isCurrent) && !isDeclined ? 'text-text-primary' : 'text-text-secondary'
                  )}>
                    {label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sticky Progress Button */}
      {!isTerminalPhase && currentPhase !== 'submitted' && currentPhase !== 'client_reviewing' && currentPhase !== 'declined' && (
        <div className="border-b border-border bg-white px-6 py-3 flex items-center justify-between sticky top-[108px] z-10">
          <div className="flex items-center gap-3">
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
              <Badge className="bg-[#F0FDF4] text-[#166534] border border-[#16A34A]/20 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Interest Registered
              </Badge>
            )}
            
            {/* Decline link */}
            <button
              onClick={() => setShowDeclineConfirmModal(true)}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2"
            >
              Decline to Submit
            </button>
          </div>
          
          <Button
            onClick={handleProgressProposal}
            disabled={getProgressButtonDisabled()}
            className="bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 gap-2"
          >
            <ChevronRight className="h-4 w-4" />
            {getProgressButtonLabel()}
          </Button>
        </div>
      )}

      {/* Status messages for terminal/submitted phases */}
      {(currentPhase === 'submitted' || currentPhase === 'client_reviewing' || isTerminalPhase) && currentPhase !== 'declined' && (
        <div className="border-b border-border bg-white px-6 py-3">
          {currentPhase === 'submitted' && (
            <p className="text-sm text-[#16A34A] font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Proposal submitted — awaiting client review.
            </p>
          )}
          {currentPhase === 'client_reviewing' && (
            <p className="text-sm text-text-secondary flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Client is currently reviewing your proposal.
            </p>
          )}
          {currentPhase === 'awarded' && (
            <p className="text-sm text-[#16A34A] font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Congratulations — your proposal has been awarded!
            </p>
          )}
          {currentPhase === 'rejected' && (
            <p className="text-sm text-text-secondary flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              This proposal was not successful.
            </p>
          )}
        </div>
      )}

      {/* Main Content with Tabs */}
      <div className="flex-1 px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-surface border border-border p-1 h-auto">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-white">
              <Eye className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2 data-[state=active]:bg-white">
              <Folder className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="questionnaire" className="gap-2 data-[state=active]:bg-white">
              <HelpCircle className="h-4 w-4" />
              Questionnaire
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2 data-[state=active]:bg-white">
              <MessageSquare className="h-4 w-4" />
              Message Centre
              {mockMessages.some(m => m.unread) && (
                <span className="ml-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2 data-[state=active]:bg-white">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2 data-[state=active]:bg-white">
              <StickyNote className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2 data-[state=active]:bg-white">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">About This RFP</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-primary leading-relaxed">{rfp.description}</p>
                  </CardContent>
                </Card>

                {/* Requirements Checklist */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Requirements Checklist</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {completedRequirements}/{totalRequirements} complete
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {rfp.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className={cn("h-4 w-4 mt-0.5 shrink-0", idx < 2 ? "text-[#16A34A]" : "text-gray-300")} />
                          <span className={cn(idx < 2 ? "text-text-primary" : "text-text-secondary")}>{req}</span>
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
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Approval Status */}
                {currentApproval && (
                  <Card className={cn('border', currentApproval.status === 'pending' ? 'border-amber-200' : currentApproval.status === 'approved' ? 'border-[#16A34A]/40' : 'border-blue-200')}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        {currentApproval.status === 'pending' && <Clock className="h-4 w-4 text-amber-500" />}
                        {currentApproval.status === 'approved' && <CheckCircle className="h-4 w-4 text-[#16A34A]" />}
                        {currentApproval.status === 'changes_requested' && <AlertCircle className="h-4 w-4 text-blue-500" />}
                        Approval Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ApprovalStatus approval={currentApproval} compact={true} />
                    </CardContent>
                  </Card>
                )}

                {/* Related RFPs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Related RFPs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {relatedRFPs.length === 0 ? (
                      <p className="text-sm text-text-secondary">No related RFPs</p>
                    ) : (
                      relatedRFPs.map((related) => (
                        <Link
                          key={related.id}
                          href={`/supplier/rfps/${related.id}`}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-surface transition-colors"
                        >
                          <Link2 className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{related.title}</p>
                            <p className="text-xs text-text-secondary">
                              Due {new Date(related.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </Link>
                      ))
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

                {/* Buyer Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Buyer Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-text-secondary" />
                      <span>{rfp.buyerContact?.email || 'contact@buyer.com'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-text-secondary" />
                      <span>{rfp.buyerContact?.phone || '+1 (555) 123-4567'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6 mt-0">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* RFP Documents (Buyer's) */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">RFP Documents</CardTitle>
                  <Badge variant="outline" className="text-xs">From Buyer</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  {rfp.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface transition-colors">
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

              {/* Proposal Documents (Supplier's) */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Proposal Documents</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUploadModal(true)}
                    className="gap-1.5"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockProposalDocuments.filter(d => d.status === 'active').map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-4 w-4 text-[#16A34A] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{doc.name}</p>
                          <p className="text-xs text-text-secondary">{doc.size} • v{doc.version} • {new Date(doc.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Download className="h-4 w-4 mr-2" />Download</DropdownMenuItem>
                          <DropdownMenuItem><History className="h-4 w-4 mr-2" />Version History</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem><Archive className="h-4 w-4 mr-2" />Archive</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}

                  {/* Archived Documents */}
                  {mockProposalDocuments.some(d => d.status === 'archived') && (
                    <Collapsible className="mt-4">
                      <CollapsibleTrigger className="flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary w-full py-2">
                        <ChevronDown className="h-3 w-3" />
                        <span>Archived documents ({mockProposalDocuments.filter(d => d.status === 'archived').length})</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 pt-2">
                        {mockProposalDocuments.filter(d => d.status === 'archived').map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-dashed border-border bg-surface/50">
                            <div className="flex items-center gap-3 min-w-0">
                              <Archive className="h-4 w-4 text-text-secondary shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm text-text-secondary truncate">{doc.name}</p>
                                <p className="text-xs text-text-muted">{doc.size} • v{doc.version}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs">Restore</Button>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Questionnaire Tab */}
          <TabsContent value="questionnaire" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Buyer Questionnaire</CardTitle>
                  <p className="text-sm text-text-secondary mt-1">Complete all required questions to proceed with your submission.</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {Object.keys(questionResponses).length}/{rfp.buyerQuestions.length} answered
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                {rfp.buyerQuestions.map((q, idx) => (
                  <div key={q.id} className="space-y-2">
                    <Label htmlFor={q.id} className="flex items-center gap-2">
                      <span className="text-text-secondary text-sm">{idx + 1}.</span>
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

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline">Save Draft</Button>
                  <Button className="bg-[#16A34A] hover:bg-[#15803D]">
                    Save & Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Message Centre Tab */}
          <TabsContent value="messages" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Message Centre</CardTitle>
                <Button className="bg-[#16A34A] hover:bg-[#15803D] gap-1.5">
                  <Plus className="h-4 w-4" />
                  New Message
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer",
                      msg.unread ? "bg-[#F0FDF4] border-[#16A34A]/20" : "border-border hover:bg-surface"
                    )}
                  >
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full shrink-0 text-xs font-medium",
                      msg.type === 'public' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    )}>
                      {msg.type === 'public' ? 'P' : 'PR'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text-primary truncate">{msg.subject}</p>
                        {msg.unread && <span className="h-2 w-2 rounded-full bg-[#16A34A]" />}
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">{msg.sender} • {msg.date}</p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {msg.type === 'public' ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Internal Team</CardTitle>
                  <p className="text-sm text-text-secondary mt-1">Manage team members working on this proposal.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setAddingTeamMember(true)}
                  disabled={availableTeamMembers.length === 0}
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add member form */}
                {addingTeamMember && (
                  <div className="flex flex-col gap-3 rounded-lg border border-dashed border-[#16A34A]/40 bg-[#F0FDF4]/50 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                        <SelectTrigger className="border-[#E5E7EB]">
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
                      <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as RFPTeamRole)}>
                        <SelectTrigger className="border-[#E5E7EB]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setAddingTeamMember(false); setSelectedMemberId('') }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleTeamAddMember}
                        disabled={!selectedMemberId}
                        className="bg-[#16A34A] hover:bg-[#15803D]"
                      >
                        Add to Team
                      </Button>
                    </div>
                  </div>
                )}

                {/* Team members list */}
                <div className="space-y-3">
                  {team.map((member) => (
                    <div
                      key={member.id}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-lg border",
                        member.isLead ? "border-[#16A34A]/25 bg-[#F0FDF4]/40" : "border-border"
                      )}
                    >
                      <div className="relative shrink-0">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
                          member.isLead ? "bg-[#16A34A] text-white" : "bg-gray-100 text-gray-600"
                        )}>
                          {member.avatarInitials}
                        </div>
                        {member.isLead && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400">
                            <Crown className="h-2.5 w-2.5 text-white" />
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-text-primary">{member.name}</span>
                          <Badge className={cn('text-[10px] h-5 px-2 border', roleStyles[member.role])}>
                            {member.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5">{member.jobTitle} • {member.department}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                          <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                            <Mail className="h-3 w-3" />{member.email}
                          </span>
                          {member.phone && (
                            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                              <Phone className="h-3 w-3" />{member.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {!member.isLead && (
                            <DropdownMenuItem onClick={() => handleTeamChangeRole(member.id, 'Lead')}>
                              <Crown className="h-4 w-4 mr-2 text-amber-400" />
                              Set as Lead
                            </DropdownMenuItem>
                          )}
                          {ROLE_OPTIONS.filter((r) => r !== member.role).map((role) => (
                            <DropdownMenuItem key={role} onClick={() => handleTeamChangeRole(member.id, role)}>
                              Change role to {role}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleTeamRemove(member.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove from Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>

                {team.length === 0 && !addingTeamMember && (
                  <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-lg">
                    <Users className="h-10 w-10 text-text-secondary mb-3" />
                    <p className="text-sm font-medium text-text-secondary">No team members assigned</p>
                    <p className="text-xs text-text-muted mt-1">Add a Lead to get started</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingTeamMember(true)}
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-1.5" />
                      Add Team Member
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Internal Notes</CardTitle>
                  <p className="text-sm text-text-secondary mt-1">Private notes visible only to your team.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowAddNoteModal(true)}
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Note
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {proposalNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-lg">
                    <StickyNote className="h-10 w-10 text-text-secondary mb-3" />
                    <p className="text-sm font-medium text-text-secondary">No notes yet</p>
                    <p className="text-xs text-text-muted mt-1">Add internal notes to keep your team aligned</p>
                  </div>
                ) : (
                  proposalNotes.slice().reverse().map((note) => (
                    <div key={note.id} className="p-4 bg-surface rounded-lg border border-border">
                      <p className="text-sm text-text-primary whitespace-pre-wrap">{note.text}</p>
                      <p className="text-xs text-text-secondary mt-3 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(note.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        <span className="text-text-muted">•</span>
                        {note.user}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Activity Log</CardTitle>
                <Button onClick={handleExportActivity} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-surface rounded-lg border border-border">
                  <div className="flex flex-1 items-center gap-2 bg-background rounded-md border border-border px-3 py-2">
                    <Search className="h-4 w-4 text-text-secondary" />
                    <Input
                      placeholder="Search activities..."
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      className="border-0 bg-transparent focus-visible:ring-0 h-auto p-0"
                    />
                  </div>
                  <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="phase_change">Phase Changes</SelectItem>
                      <SelectItem value="document_upload">Documents</SelectItem>
                      <SelectItem value="team_added">Team</SelectItem>
                      <SelectItem value="note_added">Notes</SelectItem>
                      <SelectItem value="message_received">Messages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Activity List */}
                <div className="space-y-4">
                  {filteredActivity.map((activity, idx) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                          activity.type === 'phase_change' ? "bg-[#DCFCE7] text-[#16A34A]" :
                          activity.type === 'document_upload' ? "bg-blue-100 text-blue-600" :
                          activity.type === 'team_added' ? "bg-purple-100 text-purple-600" :
                          activity.type === 'note_added' ? "bg-amber-100 text-amber-600" :
                          "bg-gray-100 text-gray-600"
                        )}>
                          {activity.type === 'phase_change' && <ChevronRight className="h-4 w-4" />}
                          {activity.type === 'document_upload' && <Upload className="h-4 w-4" />}
                          {activity.type === 'team_added' && <Users className="h-4 w-4" />}
                          {activity.type === 'note_added' && <StickyNote className="h-4 w-4" />}
                          {activity.type === 'message_received' && <MessageSquare className="h-4 w-4" />}
                          {activity.type === 'interest_registered' && <Send className="h-4 w-4" />}
                        </div>
                        {idx < filteredActivity.length - 1 && (
                          <div className="w-0.5 flex-1 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="text-sm font-medium text-text-primary">{activity.description}</p>
                        <p className="text-xs text-text-secondary mt-1">
                          {new Date(activity.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          <span className="mx-1.5">•</span>
                          {activity.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      
      {/* Initial Review Modal */}
      <Dialog open={showInitialReviewModal} onOpenChange={setShowInitialReviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Begin Proposal Preparation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Are you ready to proceed with preparing a proposal for this RFP? By confirming, you are committing to working on this submission.
            </p>
            <div className="bg-surface p-4 rounded-lg border border-border">
              <p className="text-sm font-medium text-text-primary">{rfp.title}</p>
              <p className="text-xs text-text-secondary mt-1">{rfp.buyerCompany} • Budget: {rfp.budget}</p>
              <p className="text-xs text-text-secondary mt-1">
                Deadline: {new Date(rfp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <p className="text-xs text-text-muted">
              If you are not able to submit a proposal, you can decline this RFP at any time.
            </p>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowInitialReviewModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmProceed}
              className="bg-[#16A34A] hover:bg-[#15803D]"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm & Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Decline Confirmation Modal */}
      <Dialog open={showDeclineConfirmModal} onOpenChange={setShowDeclineConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Decline to Submit</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-text-secondary mb-4">
            Are you sure you want to decline this RFP? This will pause all work on this proposal. You can reinstate it at any time if you change your mind.
          </p>
          <div className="space-y-3">
            <Label htmlFor="decline-reason">Reason for declining (optional)</Label>
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

      {/* Approval Modal */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send for Internal Review</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-text-secondary mb-4">
            Select team members who need to approve this proposal before it can be submitted to the client.
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
              onClick={() => handleSendForApproval({ approverIds: selectedApprovers, message: '', approvalMode: 'any' })}
              disabled={selectedApprovers.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Send for Review
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
            <DialogTitle>Add Internal Note</DialogTitle>
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
              disabled={!newNoteText.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Proposal Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
              <div className="flex flex-col items-center gap-3 text-center">
                <Upload className="h-10 w-10 text-gray-400" />
                <div>
                  <p className="text-sm text-text-primary font-medium">Drag and drop files here</p>
                  <p className="text-xs text-text-secondary mt-1">or click to browse</p>
                </div>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="proposal-upload"
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById('proposal-upload')?.click()}>
                  Choose Files
                </Button>
              </div>
            </div>
            <p className="text-xs text-text-muted">
              Supported formats: PDF, DOCX, XLSX, PPT. Maximum file size: 50MB.
            </p>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button className="bg-[#16A34A] hover:bg-[#15803D]">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
