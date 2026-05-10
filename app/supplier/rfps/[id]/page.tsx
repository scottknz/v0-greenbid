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
  Globe,
  Lock,
  Paperclip,
  Reply,
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
import {
  relatedRfps,
  proposalDocuments,
  supplierRfpMessageThreads,
  rfpActivityData,
  getLegacyMessageFormat,
} from '@/lib/mock-supplier-rfp-detail'
import type { MessageThread } from '@/lib/mock-messages'

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

// Data imported from lib/mock-supplier-rfp-detail.ts
const relatedRFPs = relatedRfps
const mockProposalDocuments = proposalDocuments
const initialMessageThreads = supplierRfpMessageThreads
const mockMessages = getLegacyMessageFormat(supplierRfpMessageThreads)
const mockRFPActivity = rfpActivityData

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
  const [newNotePriority, setNewNotePriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newNoteFiles, setNewNoteFiles] = useState<{ name: string; size: string; url: string }[]>([])
  const [questionResponses, setQuestionResponses] = useState<Record<string, string>>({})
  const [submissionAttachments, setSubmissionAttachments] = useState<File[]>([])
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([])

  // Filter states for Activity tab
  const [activitySearch, setActivitySearch] = useState('')
  const [activityTypeFilter, setActivityTypeFilter] = useState('all')
  
  // Notes expansion state
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())

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

  // Messaging state
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(initialMessageThreads)
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [composeSubject, setComposeSubject] = useState('')
  const [composeMessage, setComposeMessage] = useState('')
  const [composeVisibility, setComposeVisibility] = useState<'public' | 'private'>('private')

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
  
  // Selected message thread
  const selectedThread = messageThreads.find(t => t.id === selectedThreadId)
  const unreadCount = messageThreads.filter(t => !t.isRead).length
  
  // Message formatting
  const formatMessageDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    if (diffDays < 7) return date.toLocaleDateString('en-GB', { weekday: 'short' })
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }
  
  const handleSelectThread = (id: string) => {
    setSelectedThreadId(id)
    // Mark as read
    setMessageThreads(prev => prev.map(t => t.id === id ? { ...t, isRead: true } : t))
  }
  
  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedThreadId) return
    setMessageThreads(prev => prev.map(thread => {
      if (thread.id !== selectedThreadId) return thread
      return {
        ...thread,
        updatedAt: new Date().toISOString(),
        status: 'awaiting' as const,
        messages: [...thread.messages, {
          id: `m${Date.now()}`,
          senderId: 'supplier',
          senderName: 'John Smith',
          senderType: 'supplier' as const,
          content: replyMessage,
          attachments: [],
          timestamp: new Date().toISOString(),
        }],
      }
    }))
    setReplyMessage('')
  }
  
  const handleSendNewMessage = () => {
    if (!composeSubject.trim() || !composeMessage.trim()) return
    const newThread: MessageThread = {
      id: `t${Date.now()}`,
      subject: composeSubject,
      visibility: composeVisibility,
      status: 'awaiting',
      isRead: true,
      isStarred: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSender: 'John Smith',
      lastSenderType: 'supplier',
      participants: ['b1'],
      messages: [{
        id: `m${Date.now()}`,
        senderId: 'supplier',
        senderName: 'John Smith',
        senderType: 'supplier',
        content: composeMessage,
        attachments: [],
        timestamp: new Date().toISOString(),
      }],
    }
    setMessageThreads(prev => [newThread, ...prev])
    setShowComposeModal(false)
    setComposeSubject('')
    setComposeMessage('')
    setComposeVisibility('private')
    setSelectedThreadId(newThread.id)
  }
  
  const toggleThreadStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setMessageThreads(prev => prev.map(t => t.id === id ? { ...t, isStarred: !t.isStarred } : t))
  }
  
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
      user: 'John Smith',
      userRole: 'Account Manager',
      userEmail: 'john.smith@company.com',
      text: newNoteText,
      priority: newNotePriority,
      attachments: newNoteFiles,
    }
    setProposalNotes([...proposalNotes, newNote])
    setNewNoteText('')
    setNewNotePriority('medium')
    setNewNoteFiles([])
    setShowAddNoteModal(false)
  }

  const handleNoteFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const mapped = files.map(f => ({
      name: f.name,
      size: f.size > 1024 * 1024
        ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(f.size / 1024)} KB`,
      url: URL.createObjectURL(f),
    }))
    setNewNoteFiles(prev => [...prev, ...mapped])
    e.target.value = ''
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
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">

      {/* Top bar — breadcrumb + actions, matches buyer style */}
      <div className="border-b border-[#E5E7EB] bg-white sticky top-0 z-20">
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 shrink-0 text-[#6B7280]">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <nav className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Link href="/supplier" className="hover:text-[#111827]">Supplier Portal</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/supplier/rfps" className="hover:text-[#111827]">RFPs</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#111827] font-medium truncate max-w-[260px]">{rfp.title}</span>
            </nav>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handlePrintProposal} className="gap-1.5 text-xs h-8">
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="border-b border-[#E5E7EB] bg-white">
        <div className="px-6 py-2.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-[#6B7280]" />
                <span className="text-xs text-[#6B7280]">Category:</span>
                <span className="text-xs font-medium text-[#111827]">{rfp.category}</span>
              </div>
              <div className="h-3.5 w-px bg-[#E5E7EB]" />
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#6B7280]" />
                <span className="text-xs text-[#6B7280]">Budget:</span>
                <span className="text-xs font-medium text-[#111827]">{rfp.budget}</span>
              </div>
              <div className="h-3.5 w-px bg-[#E5E7EB]" />
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-[#6B7280]" />
                <span className="text-xs text-[#6B7280]">Est. Value:</span>
                <span className="text-xs font-medium text-[#111827]">${rfp.estimatedValue.toLocaleString()}</span>
              </div>
              <div className="h-3.5 w-px bg-[#E5E7EB]" />
              <div className="flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5 text-[#6B7280]" />
                <span className="text-xs text-[#6B7280]">Completion:</span>
                <span className="text-xs font-medium text-[#111827]">{completionPercent}%</span>
                <div className="w-14 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div className="h-full bg-[#16A34A] rounded-full" style={{ width: `${completionPercent}%` }} />
                </div>
              </div>
            </div>
            <div className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium',
              isOverdue ? 'bg-red-50 text-red-700' : isDeadlineSoon ? 'bg-amber-50 text-amber-700' : 'bg-[#F3F4F6] text-[#6B7280]'
            )}>
              <Clock className="h-3.5 w-3.5" />
              {isOverdue
                ? `Deadline passed (${Math.abs(daysDue)}d ago)`
                : daysDue === 0
                ? `Due today (${hoursDue}h remaining)`
                : `${daysDue} day${daysDue !== 1 ? 's' : ''} remaining · ${new Date(rfp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b border-[#E5E7EB] bg-white">
        <div className="px-6 py-5">
          {currentPhase === 'declined' && (
            <div className="flex items-center justify-between mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-700 font-medium">You have declined to submit this proposal.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 border-[#16A34A] text-[#16A34A] hover:bg-[#F0FDF4] shrink-0"
                onClick={handleReinstateSubmission}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reinstate Submission
              </Button>
            </div>
          )}
          {/* Steps */}
          <nav className="flex items-start justify-center gap-0">
            {SUPPLIER_PHASE_ORDER.map((phase, idx) => {
              const isFinalOutcomeSlot = idx === SUPPLIER_PHASE_ORDER.length - 1
              const isCompleted = currentPhaseIndex > idx && !['declined'].includes(currentPhase)
              const isCurrent = currentPhase === phase || (isFinalOutcomeSlot && (currentPhase === 'awarded' || currentPhase === 'rejected'))
              const isDeclined = currentPhase === 'declined'
              const config = SUPPLIER_PHASE_CONFIG[phase]
              const label = isFinalOutcomeSlot
                ? currentPhase === 'awarded' ? 'Awarded' : currentPhase === 'rejected' ? 'Not Successful' : 'Final Outcome'
                : config.label
              return (
                <div key={phase} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full transition-all',
                      isCompleted ? 'bg-[#16A34A] text-white'
                      : isCurrent && currentPhase === 'awarded' ? 'bg-[#16A34A] text-white'
                      : isCurrent && currentPhase === 'rejected' ? 'bg-[#6B7280] text-white'
                      : isCurrent && !isDeclined ? 'bg-[#DCFCE7] text-[#16A34A] ring-2 ring-[#16A34A] ring-offset-2'
                      : 'bg-[#F3F4F6] text-[#9CA3AF]'
                    )}>
                      {isCompleted ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <PhaseIcon
                          phase={isFinalOutcomeSlot
                            ? (currentPhase === 'awarded' ? 'awarded' : currentPhase === 'rejected' ? 'rejected' : phase)
                            : phase}
                          className="h-4 w-4"
                        />
                      )}
                    </div>
                    <p className={cn(
                      'text-xs font-medium text-center w-[80px] leading-tight',
                      (isCompleted || isCurrent) && !isDeclined ? 'text-[#111827]' : 'text-[#9CA3AF]'
                    )}>
                      {label}
                    </p>
                  </div>
                  {idx < SUPPLIER_PHASE_ORDER.length - 1 && (
                    <div className={cn(
                      'mx-3 h-px w-10 sm:w-14 mb-4 transition-colors',
                      isCompleted ? 'bg-[#16A34A]' : 'bg-[#E5E7EB]'
                    )} />
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Horizontal action bar — full width, sits between progress bar and tabs */}
      <div className="border-b border-[#E5E7EB] bg-white px-6 py-3">
        <div className="flex items-center gap-3">

          {/* Left: primary actions */}
          {!isTerminalPhase && currentPhase !== 'submitted' && currentPhase !== 'client_reviewing' && currentPhase !== 'declined' ? (
            <>
              {/* Progress Proposal — primary green button */}
              <Button
                onClick={handleProgressProposal}
                disabled={getProgressButtonDisabled()}
                className="bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 gap-2 h-8 text-sm shrink-0"
              >
                <ChevronRight className="h-4 w-4" />
                {getProgressButtonLabel()}
              </Button>

              {/* Decline to Submit — grey button immediately after */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeclineConfirmModal(true)}
                className="h-8 text-sm text-[#6B7280] border-[#D1D5DB] bg-[#F9FAFB] hover:bg-[#F3F4F6] hover:text-[#374151] shrink-0"
              >
                Decline to Submit
              </Button>

              {/* Register Interest (new_rfp only, before interest registered) */}
              {currentPhase === 'new_rfp' && !interestRegistered && (
                <Button
                  onClick={handleRegisterInterest}
                  variant="outline"
                  size="sm"
                  className="h-8 text-sm gap-1.5 shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                  Register Interest
                </Button>
              )}
            </>
          ) : (
            /* Status indicator for terminal/passive phases */
            <div className="flex items-center h-8 shrink-0">
              {currentPhase === 'submitted' && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-[#16A34A]">
                  <CheckCircle className="h-4 w-4" />
                  Submitted — awaiting client review
                </span>
              )}
              {currentPhase === 'client_reviewing' && (
                <span className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                  <Clock className="h-4 w-4" />
                  Client is evaluating your proposal
                </span>
              )}
              {currentPhase === 'awarded' && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-[#16A34A]">
                  <Trophy className="h-4 w-4" />
                  Awarded — congratulations!
                </span>
              )}
              {currentPhase === 'rejected' && (
                <span className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                  <XCircle className="h-4 w-4" />
                  Not successful
                </span>
              )}
              {currentPhase === 'declined' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-sm border-[#16A34A] text-[#16A34A] hover:bg-[#F0FDF4] gap-1.5"
                  onClick={handleReinstateSubmission}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reinstate Submission
                </Button>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="h-5 w-px bg-[#E5E7EB] mx-1" />

          {/* Right: meta items — Current Phase, Deadline, Reference displayed horizontally */}
          <div className="flex items-center gap-5 min-w-0">

            {/* Current Phase */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#6B7280] uppercase tracking-wide font-medium whitespace-nowrap">Current Phase</span>
              <Badge className={cn('text-xs', SUPPLIER_PHASE_CONFIG[currentPhase].color)}>
                {SUPPLIER_PHASE_CONFIG[currentPhase].label}
              </Badge>
            </div>

            <div className="h-3.5 w-px bg-[#E5E7EB]" />

            {/* Deadline */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#6B7280] uppercase tracking-wide font-medium whitespace-nowrap">Deadline</span>
              <span className="text-xs font-medium text-[#111827] whitespace-nowrap">
                {new Date(rfp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className={cn('text-xs whitespace-nowrap', isOverdue ? 'text-red-500' : isDeadlineSoon ? 'text-amber-600' : 'text-[#6B7280]')}>
                ({isOverdue ? `${Math.abs(daysDue)}d overdue` : daysDue === 0 ? 'today' : `${daysDue}d remaining`})
              </span>
            </div>

            <div className="h-3.5 w-px bg-[#E5E7EB]" />

            {/* Reference */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#6B7280] uppercase tracking-wide font-medium whitespace-nowrap">Reference</span>
              <span className="text-xs font-mono text-[#111827]">{rfp.id}</span>
            </div>

            {/* Interest registered */}
            {interestRegistered && (
              <>
                <div className="h-3.5 w-px bg-[#E5E7EB]" />
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-[#16A34A]" />
                  <span className="text-xs text-[#16A34A] font-medium whitespace-nowrap">Interest Registered</span>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Full-width content area */}
      <div className="flex-1 min-w-0">

        {/* Tab bar — full width, matches buyer border-bottom style */}
        <div className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
          <nav className="flex gap-0 px-6" aria-label="RFP tabs">
              {[
                { key: 'overview', label: 'Overview', icon: Eye },
                { key: 'team', label: 'Team', icon: Users },
                { key: 'documents', label: 'Documents', icon: Folder },
                { key: 'questionnaire', label: 'Questionnaire', icon: HelpCircle },
                { key: 'messages', label: 'Messages', icon: MessageSquare, badge: mockMessages.some(m => m.unread) },
                { key: 'notes', label: 'Notes', icon: StickyNote },
                { key: 'activity', label: 'Activity', icon: Activity },
              ].map(({ key, label, icon: Icon, badge }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap',
                    activeTab === key
                      ? 'text-[#16A34A] border-[#16A34A] bg-white'
                      : 'text-[#6B7280] border-transparent hover:text-[#111827] hover:border-[#D1D5DB]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {badge && <span className="h-2 w-2 rounded-full bg-red-500 ml-0.5" />}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'overview' && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">

                {/* Summary Card — replaces the old header */}
                <Card className="border-[#E5E7EB] bg-white">
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h1 className="text-lg font-semibold text-[#111827] leading-snug">{rfp.title}</h1>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[#6B7280]">
                          <span className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5" />
                            {rfp.buyerCompany}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Tag className="h-3.5 w-3.5" />
                            {rfp.category}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Deadline {new Date(rfp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {rfp.onlineRFPUrl && (
                            <a
                              href={rfp.onlineRFPUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#16A34A] hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              View Online RFP
                            </a>
                          )}
                        </div>
                      </div>
                      <Badge className={cn('shrink-0 text-xs', SUPPLIER_PHASE_CONFIG[currentPhase].color)}>
                        {SUPPLIER_PHASE_CONFIG[currentPhase].label}
                      </Badge>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                      <p className="text-sm text-[#374151] leading-relaxed">{rfp.description}</p>
                    </div>
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
          )}

          {activeTab === 'documents' && (
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
          )}

          {activeTab === 'questionnaire' && (
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
          )}

          {activeTab === 'messages' && (
            <div className="flex gap-4 h-[600px]">
              {/* Thread List (left panel) */}
              <Card className="w-80 shrink-0 flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">Messages</CardTitle>
                    {unreadCount > 0 && (
                      <Badge className="bg-[#16A34A] text-white text-xs h-5 px-1.5">{unreadCount}</Badge>
                    )}
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => setShowComposeModal(true)}
                    className="bg-[#16A34A] hover:bg-[#15803D] gap-1.5 h-8"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0">
                  <div className="divide-y divide-border">
                    {messageThreads
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .map((thread) => (
                      <div
                        key={thread.id}
                        onClick={() => handleSelectThread(thread.id)}
                        className={cn(
                          "flex items-start gap-3 p-3 cursor-pointer transition-colors",
                          selectedThreadId === thread.id 
                            ? "bg-[#F0FDF4] border-l-2 border-l-[#16A34A]" 
                            : "hover:bg-surface",
                          !thread.isRead && "bg-blue-50/50"
                        )}
                      >
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full shrink-0 text-xs font-medium mt-0.5",
                          thread.visibility === 'public' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                        )}>
                          {thread.visibility === 'public' ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className={cn(
                              "text-sm truncate",
                              !thread.isRead ? "font-semibold text-text-primary" : "font-medium text-text-primary"
                            )}>
                              {thread.subject}
                            </p>
                            {!thread.isRead && <span className="h-2 w-2 rounded-full bg-[#16A34A] shrink-0" />}
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5 truncate">
                            {thread.messages[thread.messages.length - 1].senderType === 'buyer' 
                              ? thread.messages[thread.messages.length - 1].senderName 
                              : 'You'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-text-muted">{formatMessageDate(thread.updatedAt)}</span>
                            <Badge variant="outline" className={cn(
                              "text-[10px] h-4 px-1",
                              thread.status === 'awaiting' && "border-amber-300 text-amber-700",
                              thread.status === 'resolved' && "border-green-300 text-green-700",
                              thread.status === 'open' && "border-blue-300 text-blue-700"
                            )}>
                              {thread.status === 'awaiting' ? 'Awaiting' : thread.status === 'resolved' ? 'Resolved' : 'Open'}
                            </Badge>
                          </div>
                        </div>
                        <button
                          onClick={(e) => toggleThreadStar(thread.id, e)}
                          className="shrink-0 p-1 hover:bg-surface rounded"
                        >
                          <Star className={cn(
                            "h-3.5 w-3.5",
                            thread.isStarred ? "fill-amber-400 text-amber-400" : "text-text-muted"
                          )} />
                        </button>
                      </div>
                    ))}
                    {messageThreads.length === 0 && (
                      <div className="p-6 text-center">
                        <MessageSquare className="h-8 w-8 text-text-muted mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">No messages yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Message Detail (right panel) */}
              <Card className="flex-1 flex flex-col min-w-0">
                {selectedThread ? (
                  <>
                    {/* Thread Header */}
                    <CardHeader className="border-b border-border pb-3 shrink-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base truncate">{selectedThread.subject}</CardTitle>
                            <Badge variant="outline" className={cn(
                              "text-xs shrink-0",
                              selectedThread.visibility === 'public' ? "border-blue-300 text-blue-700" : "border-gray-300 text-gray-600"
                            )}>
                              {selectedThread.visibility === 'public' ? (
                                <><Globe className="h-3 w-3 mr-1" />Public</>
                              ) : (
                                <><Lock className="h-3 w-3 mr-1" />Private</>
                              )}
                            </Badge>
                          </div>
                          <p className="text-xs text-text-secondary mt-1">
                            {selectedThread.messages.length} message{selectedThread.messages.length !== 1 && 's'} • 
                            Started {new Date(selectedThread.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <Badge className={cn(
                          "text-xs shrink-0",
                          selectedThread.status === 'awaiting' && "bg-amber-100 text-amber-800",
                          selectedThread.status === 'resolved' && "bg-green-100 text-green-800",
                          selectedThread.status === 'open' && "bg-blue-100 text-blue-800"
                        )}>
                          {selectedThread.status === 'awaiting' ? 'Awaiting Response' : selectedThread.status === 'resolved' ? 'Resolved' : 'Open'}
                        </Badge>
                      </div>
                    </CardHeader>

                    {/* Messages */}
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                      {selectedThread.messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3",
                            message.senderType === 'supplier' && "flex-row-reverse"
                          )}
                        >
                          <div className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full shrink-0 text-xs font-semibold",
                            message.senderType === 'buyer' ? "bg-blue-100 text-blue-700" : "bg-[#16A34A] text-white"
                          )}>
                            {message.senderName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className={cn(
                            "flex-1 max-w-[75%]",
                            message.senderType === 'supplier' && "flex flex-col items-end"
                          )}>
                            <div className={cn(
                              "rounded-lg p-3",
                              message.senderType === 'buyer' ? "bg-surface border border-border" : "bg-[#F0FDF4] border border-[#16A34A]/20"
                            )}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-text-primary">
                                  {message.senderType === 'buyer' ? `${message.senderName} (Buyer)` : 'You'}
                                </span>
                                <span className="text-[10px] text-text-muted">
                                  {new Date(message.timestamp).toLocaleString('en-GB', { 
                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-text-primary whitespace-pre-wrap">{message.content}</p>
                              {message.attachments.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
                                  {message.attachments.map((att, idx) => (
                                    <a
                                      key={idx}
                                      href={att.url}
                                      className="flex items-center gap-2 text-xs text-[#16A34A] hover:underline"
                                    >
                                      <Paperclip className="h-3 w-3" />
                                      {att.name} ({att.size})
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>

                    {/* Reply Box */}
                    <div className="border-t border-border p-4 shrink-0">
                      <div className="flex gap-3">
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          className="flex-1 min-h-[80px] resize-none"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                          <Paperclip className="h-3.5 w-3.5" />
                          Attach
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSendReply}
                          disabled={!replyMessage.trim()}
                          className="bg-[#16A34A] hover:bg-[#15803D] gap-1.5"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-text-muted mx-auto mb-3" />
                      <p className="text-sm text-text-secondary">Select a conversation to view</p>
                      <p className="text-xs text-text-muted mt-1">Or start a new message to the buyer</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Compose Message Modal */}
          <Dialog open={showComposeModal} onOpenChange={setShowComposeModal}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>New Message to Buyer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    placeholder="Enter message subject..."
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <Select value={composeVisibility} onValueChange={(v) => setComposeVisibility(v as 'public' | 'private')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">
                        <span className="flex items-center gap-2">
                          <Lock className="h-3.5 w-3.5" />
                          Private — Only visible to you and the buyer
                        </span>
                      </SelectItem>
                      <SelectItem value="public">
                        <span className="flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5" />
                          Public — Visible to all suppliers
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Type your message..."
                    value={composeMessage}
                    onChange={(e) => setComposeMessage(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowComposeModal(false)}>Cancel</Button>
                <Button
                  onClick={handleSendNewMessage}
                  disabled={!composeSubject.trim() || !composeMessage.trim()}
                  className="bg-[#16A34A] hover:bg-[#15803D] gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {activeTab === 'team' && (
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
          )}

          {activeTab === 'notes' && (
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
              <CardContent className="space-y-3">
                {proposalNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-lg">
                    <StickyNote className="h-10 w-10 text-text-secondary mb-3" />
                    <p className="text-sm font-medium text-text-secondary">No notes yet</p>
                    <p className="text-xs text-text-muted mt-1">Add internal notes to keep your team aligned</p>
                  </div>
                ) : (
                  proposalNotes.slice().reverse().map((note) => {
                    const isExpanded = expandedNotes.has(note.id)
                    const toggleExpand = () => {
                      setExpandedNotes(prev => {
                        const next = new Set(prev)
                        if (next.has(note.id)) next.delete(note.id)
                        else next.add(note.id)
                        return next
                      })
                    }

                    return (
                      <div
                        key={note.id}
                        className={cn(
                          "rounded-lg border border-border overflow-hidden transition-all",
                          isExpanded ? "bg-white shadow-sm" : "bg-surface hover:bg-white"
                        )}
                      >
                        {/* Always-visible header row */}
                        <button
                          onClick={toggleExpand}
                          className="w-full px-4 py-3 text-left flex items-center gap-3"
                        >
                          {/* Priority bar */}
                          <div className={cn(
                            "w-1 self-stretch min-h-[36px] rounded-full shrink-0",
                            note.priority === 'high' ? "bg-red-400" :
                            note.priority === 'medium' ? "bg-amber-400" : "bg-gray-300"
                          )} />

                          <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
                            {/* Author */}
                            <span className="text-sm font-medium text-text-primary">{note.user}</span>
                            {note.userRole && (
                              <span className="text-xs text-text-muted">({note.userRole})</span>
                            )}
                            <span className="text-text-muted text-xs">•</span>
                            {/* Date & time */}
                            <span className="text-xs text-text-secondary">
                              {new Date(note.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              {' '}
                              {new Date(note.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {/* Priority badge */}
                            <Badge className={cn(
                              "text-[10px] h-5 px-1.5 capitalize font-medium",
                              note.priority === 'high' && "bg-red-100 text-red-700",
                              note.priority === 'medium' && "bg-amber-100 text-amber-700",
                              note.priority === 'low' && "bg-gray-100 text-gray-600"
                            )}>
                              {note.priority}
                            </Badge>
                            {/* Attachment count */}
                            {note.attachments.length > 0 && (
                              <span className="flex items-center gap-1 text-[10px] text-text-muted">
                                <Paperclip className="h-3 w-3" />
                                {note.attachments.length} file{note.attachments.length !== 1 && 's'}
                              </span>
                            )}
                          </div>

                          <ChevronDown className={cn(
                            "h-4 w-4 text-text-muted shrink-0 transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )} />
                        </button>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-border space-y-4">
                            {/* Note text */}
                            <p className="pt-4 text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{note.text}</p>

                            {/* Metadata row */}
                            <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <p className="text-[10px] uppercase tracking-wide text-text-muted font-medium mb-1">Author</p>
                                <p className="text-sm font-medium text-text-primary">{note.user}</p>
                                {note.userRole && <p className="text-xs text-text-secondary">{note.userRole}</p>}
                                {note.userEmail && (
                                  <a
                                    href={`mailto:${note.userEmail}`}
                                    onClick={e => e.stopPropagation()}
                                    className="text-xs text-[#16A34A] hover:underline"
                                  >
                                    {note.userEmail}
                                  </a>
                                )}
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wide text-text-muted font-medium mb-1">Created</p>
                                <p className="text-sm text-text-primary">
                                  {new Date(note.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                                <p className="text-xs text-text-secondary">
                                  {new Date(note.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wide text-text-muted font-medium mb-1">Priority</p>
                                <Badge className={cn(
                                  "text-xs capitalize",
                                  note.priority === 'high' && "bg-red-100 text-red-700",
                                  note.priority === 'medium' && "bg-amber-100 text-amber-700",
                                  note.priority === 'low' && "bg-gray-100 text-gray-600"
                                )}>
                                  {note.priority}
                                </Badge>
                              </div>
                            </div>

                            {/* Attachments */}
                            {note.attachments.length > 0 && (
                              <div className="pt-4 border-t border-border">
                                <p className="text-[10px] uppercase tracking-wide text-text-muted font-medium mb-2">Attachments</p>
                                <div className="flex flex-wrap gap-2">
                                  {note.attachments.map((att, idx) => (
                                    <a
                                      key={idx}
                                      href={att.url}
                                      onClick={e => e.stopPropagation()}
                                      className="flex items-center gap-2 px-3 py-2 bg-surface rounded-md border border-border text-sm text-text-primary hover:border-[#16A34A] hover:text-[#16A34A] transition-colors"
                                    >
                                      <FileText className="h-3.5 w-3.5 shrink-0" />
                                      <span>{att.name}</span>
                                      <span className="text-xs text-text-muted">({att.size})</span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'activity' && (
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

                {/* Activity Table */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface border-b border-border">
                        <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wide px-4 py-3">Description</th>
                        <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wide px-4 py-3 w-40">Person</th>
                        <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wide px-4 py-3 w-44">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredActivity.map((activity) => (
                        <tr key={activity.id} className="hover:bg-surface/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                                activity.type === 'phase_change' ? "bg-[#DCFCE7] text-[#16A34A]" :
                                activity.type === 'document_upload' ? "bg-blue-100 text-blue-600" :
                                activity.type === 'team_added' ? "bg-purple-100 text-purple-600" :
                                activity.type === 'note_added' ? "bg-amber-100 text-amber-600" :
                                activity.type === 'approval_requested' ? "bg-orange-100 text-orange-600" :
                                activity.type === 'approval_granted' ? "bg-green-100 text-green-600" :
                                "bg-gray-100 text-gray-600"
                              )}>
                                {activity.type === 'phase_change' && <ChevronRight className="h-3.5 w-3.5" />}
                                {activity.type === 'document_upload' && <Upload className="h-3.5 w-3.5" />}
                                {activity.type === 'team_added' && <Users className="h-3.5 w-3.5" />}
                                {activity.type === 'note_added' && <StickyNote className="h-3.5 w-3.5" />}
                                {activity.type === 'message_received' && <MessageSquare className="h-3.5 w-3.5" />}
                                {activity.type === 'interest_registered' && <Send className="h-3.5 w-3.5" />}
                                {activity.type === 'approval_requested' && <Clock className="h-3.5 w-3.5" />}
                                {activity.type === 'approval_granted' && <CheckCircle className="h-3.5 w-3.5" />}
                              </div>
                              <span className="text-sm text-text-primary">{activity.description}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary">{activity.user}</td>
                          <td className="px-4 py-3 text-sm text-text-secondary">
                            {new Date(activity.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                            <span className="text-text-muted ml-2">
                              {new Date(activity.date).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredActivity.length === 0 && (
                    <div className="p-8 text-center text-sm text-text-muted">
                      No activities match your search criteria.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          </div>{/* /tab content */}
      </div>{/* /full-width content */}

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
      <Dialog open={showAddNoteModal} onOpenChange={(open) => {
        if (!open) {
          setNewNoteText('')
          setNewNotePriority('medium')
          setNewNoteFiles([])
        }
        setShowAddNoteModal(open)
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Internal Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">

            {/* Author (read-only) */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16A34A] text-white text-xs font-semibold shrink-0">
                JS
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">John Smith</p>
                <p className="text-xs text-text-secondary">Account Manager · john.smith@company.com</p>
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewNotePriority(p)}
                    className={cn(
                      "flex-1 py-1.5 rounded-md border text-xs font-medium capitalize transition-colors",
                      newNotePriority === p
                        ? p === 'high' ? "bg-red-100 border-red-300 text-red-700"
                          : p === 'medium' ? "bg-amber-100 border-amber-300 text-amber-700"
                          : "bg-gray-100 border-gray-300 text-gray-600"
                        : "border-border text-text-secondary hover:bg-surface"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Note text */}
            <div className="space-y-1.5">
              <Label htmlFor="new-note">Note</Label>
              <Textarea
                id="new-note"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add a note about this proposal..."
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* File upload */}
            <div className="space-y-1.5">
              <Label>Attachments</Label>
              <div className="space-y-2">
                {newNoteFiles.length > 0 && (
                  <div className="space-y-1">
                    {newNoteFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface border border-border">
                        <FileText className="h-3.5 w-3.5 text-text-secondary shrink-0" />
                        <span className="text-xs text-text-primary flex-1 truncate">{f.name}</span>
                        <span className="text-xs text-text-muted shrink-0">{f.size}</span>
                        <button
                          type="button"
                          onClick={() => setNewNoteFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="text-text-muted hover:text-red-500 transition-colors ml-1"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleNoteFileInput}
                  />
                  <span className="flex items-center gap-1.5 text-xs text-text-secondary border border-dashed border-border rounded-md px-3 py-2 w-full hover:border-[#16A34A] hover:text-[#16A34A] transition-colors">
                    <Paperclip className="h-3.5 w-3.5" />
                    Click to attach files
                  </span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
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
