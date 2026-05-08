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
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Phase types and configuration
export type RFPPhase = 'new_rfp' | 'in_progress' | 'under_final_review' | 'submitted' | 'client_reviewing' | 'awarded' | 'rejected' | 'declined'

const PHASE_ORDER: RFPPhase[] = ['new_rfp', 'in_progress', 'under_final_review', 'submitted', 'client_reviewing', 'awarded']

const PHASE_CONFIG = {
  new_rfp: { label: 'New RFP' },
  in_progress: { label: 'In Progress' },
  under_final_review: { label: 'Under Final Review' },
  submitted: { label: 'Submitted' },
  client_reviewing: { label: 'Client Reviewing' },
  awarded: { label: 'Awarded' },
  rejected: { label: 'Not Successful' },
  declined: { label: 'Decline to Submit' },
}

interface PhaseTransition {
  phase: RFPPhase
  timestamp: string
  user: string
  notes?: string
}

interface ProposalNote {
  id: string
  timestamp: string
  user: string
  text: string
}

// Mock approvers list
const mockApprovers = [
  { id: 'a1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Senior Manager' },
  { id: 'a2', name: 'James Wilson', email: 'james.wilson@company.com', role: 'Director' },
  { id: 'a3', name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', role: 'VP Operations' },
  { id: 'a4', name: 'Michael Park', email: 'michael.park@company.com', role: 'Legal Counsel' },
]

// Mock RFP detail data
const mockRFPDetail = {
  id: 'rfp-001',
  title: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
  buyerCompany: 'Thistle Company',
  buyerContact: {
    name: 'Emma Thompson',
    email: 'emma@thistle.com',
    phone: '+44 207 123 4567',
  },
  onlineRFPUrl: 'https://thistle.greenbid.com/rfp/scope3-analysis-2026',
  currentPhase: 'in_progress' as RFPPhase,
  phaseHistory: [
    { phase: 'new_rfp' as RFPPhase, timestamp: '2026-03-15T10:00:00Z', user: 'Sarah Chen', notes: 'RFP received and reviewed. Good fit for our capabilities.' },
    { phase: 'in_progress' as RFPPhase, timestamp: '2026-03-18T14:30:00Z', user: 'James Wilson', notes: 'Started proposal development' }
  ] as PhaseTransition[],
  phaseBeforeDecline: null as RFPPhase | null,
  proposalNotes: [
    { id: 'note-1', timestamp: '2026-03-20T09:00:00Z', user: 'Sarah Chen', text: 'Need to gather additional emissions data from last 3 years' },
    { id: 'note-2', timestamp: '2026-03-22T15:00:00Z', user: 'James Wilson', text: 'Received all supporting documentation from operations team' }
  ] as ProposalNote[],
  registeredAt: '2026-03-15',
  deadline: '2026-04-30',
  budget: '$150,000 - $200,000',
  estimatedValue: 175000,
  category: 'Sustainability',
  description:
    'We are seeking a sustainability consultant to conduct a comprehensive Scope 3 emissions analysis across our entire value chain. This includes supplier emissions, transportation, waste, and end-of-life product analysis.',
  requirements: [
    'Deep expertise in Scope 3 emissions methodology',
    'Experience with supply chain carbon accounting',
    'Knowledge of GHG Protocol standards',
    'Ability to conduct supplier engagement and data collection',
    'Experience with carbon accounting software (e.g., Catena-X, Sphera)',
  ],
  deliverables: [
    'Baseline Scope 3 emissions inventory',
    'Category-wise breakdown and analysis',
    'Hotspot identification report',
    'Recommendations for reduction strategies',
    'Executive summary for stakeholders',
  ],
  documents: [
    { name: 'RFP_Scope3_Analysis_2026.pdf', size: '2.4 MB', uploadedAt: '2026-03-15' },
    { name: 'Company_Background.docx', size: '1.2 MB', uploadedAt: '2026-03-15' },
    { name: 'Technical_Specifications.xlsx', size: '850 KB', uploadedAt: '2026-03-16' },
  ],
  timeline: [
    { phase: 'Proposal Submission', date: '2026-04-30' },
    { phase: 'Vendor Shortlisting', date: '2026-05-15' },
    { phase: 'Interviews', date: '2026-05-20' },
    { phase: 'Contract Negotiation', date: '2026-06-01' },
    { phase: 'Project Start', date: '2026-06-15' },
  ],
  buyerQuestions: [
    { id: 'q1', question: 'Describe your experience with Scope 3 emissions analysis', type: 'text', required: true },
    { id: 'q2', question: 'List your relevant certifications and methodologies used', type: 'text', required: true },
    { id: 'q3', question: 'Provide a high-level project timeline with milestones', type: 'text', required: true },
    { id: 'q4', question: 'What is your proposed pricing structure?', type: 'text', required: true },
    { id: 'q5', question: 'Describe your team composition and key personnel', type: 'text', required: false },
    { id: 'q6', question: 'Provide case studies of similar past projects', type: 'text', required: false },
  ],
}

export default function RFPDetailPage() {
  const router = useRouter()
  const params = useParams()
  
  // Phase and submission state
  const [currentPhase, setCurrentPhase] = useState<RFPPhase>(mockRFPDetail.currentPhase)
  const [phaseHistory, setPhaseHistory] = useState<PhaseTransition[]>(mockRFPDetail.phaseHistory)
  const [proposalNotes, setProposalNotes] = useState<ProposalNote[]>(mockRFPDetail.proposalNotes)
  const [phaseBeforeDecline, setPhaseBeforeDecline] = useState<RFPPhase | null>(mockRFPDetail.phaseBeforeDecline)
  
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
  
  const rfp = mockRFPDetail
  
  // Calculate days until deadline
  const daysDue = Math.ceil((new Date(rfp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isDeadlineSoon = daysDue <= 7 && daysDue > 0
  const isOverdue = daysDue < 0
  
  // Get phase index for progress indicator
  const currentPhaseIndex = PHASE_ORDER.indexOf(currentPhase)
  const isTerminalPhase = ['awarded', 'rejected', 'declined'].includes(currentPhase)
  
  // Phase transition handlers
  const handleMoveForward = () => {
    const newTransition: PhaseTransition = {
      phase: currentPhase,
      timestamp: new Date().toISOString(),
      user: 'Current User',
      notes: transitionNotes || undefined,
    }
    
    const nextPhaseIndex = currentPhaseIndex + 1
    if (nextPhaseIndex < PHASE_ORDER.length) {
      const nextPhase = PHASE_ORDER[nextPhaseIndex]
      setPhaseHistory([...phaseHistory, { ...newTransition, phase: nextPhase }])
      setCurrentPhase(nextPhase)
    }
    setTransitionNotes('')
    setShowInitialReviewModal(false)
  }
  
  const handleDeclineToSubmit = () => {
    setPhaseBeforeDecline(currentPhase)
    const declineTransition: PhaseTransition = {
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
      const reinstateTransition: PhaseTransition = {
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
  
  const handleSendForApproval = () => {
    if (selectedApprovers.length === 0) return
    
    // In production, this would send emails to selected approvers
    const approvalTransition: PhaseTransition = {
      phase: currentPhase,
      timestamp: new Date().toISOString(),
      user: 'Current User',
      notes: `Sent for approval to: ${selectedApprovers.map(id => mockApprovers.find(a => a.id === id)?.name).join(', ')}`,
    }
    setPhaseHistory([...phaseHistory, approvalTransition])
    setSelectedApprovers([])
    setShowApprovalModal(false)
  }
  
  const handleSubmitProposal = () => {
    const submitTransition: PhaseTransition = {
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
    const newNote: ProposalNote = {
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
      setShowApprovalModal(true)
    }
  }
  
  const getPhaseButtonLabel = () => {
    switch (currentPhase) {
      case 'new_rfp': return 'Start Working on Response'
      case 'in_progress': return 'Continue Submission'
      case 'under_final_review': return 'Send for Approval'
      default: return 'View Status'
    }
  }

  return (
    <div className="space-y-6 p-6">
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
            {PHASE_ORDER.map((phase, idx) => {
              const isFinalOutcomeSlot = idx === PHASE_ORDER.length - 1
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
                : PHASE_CONFIG[phase].label

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
                  {idx < PHASE_ORDER.length - 1 && (
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
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              {!isTerminalPhase && currentPhase !== 'submitted' && currentPhase !== 'client_reviewing' && currentPhase !== 'declined' && (
                <Button
                  onClick={handleContinueResponse}
                  className="bg-[#16A34A] hover:bg-[#15803D]"
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

            {/* Decline to Submit — single understated link-style button, hidden once terminal */}
            {!isTerminalPhase && currentPhase !== 'declined' && (
              <button
                onClick={() => setShowDeclineConfirmModal(true)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2 ml-4"
              >
                Decline to Submit
              </button>
            )}
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

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-text-secondary">Submission Deadline</p>
                    <p className="text-sm font-medium text-text-primary">
                      {new Date(rfp.deadline).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-text-secondary">Budget Range</p>
                    <p className="text-sm font-medium text-text-primary">{rfp.budget}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-2 border-t border-border">
                <FileText className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-text-secondary">Category</p>
                  <p className="text-sm font-medium text-text-primary">{rfp.category}</p>
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
          {/* Internal Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Internal Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-text-secondary mb-1">Name</p>
                <p className="text-sm font-medium text-text-primary">{rfp.buyerContact.name}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Email</p>
                <button
                  onClick={() => {
                    router.push(`/supplier/messages?compose=true&to=${encodeURIComponent(rfp.buyerContact.name)}&email=${encodeURIComponent(rfp.buyerContact.email)}`)
                  }}
                  className="text-sm text-[#16A34A] hover:underline"
                >
                  {rfp.buyerContact.email}
                </button>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Phone</p>
                <a href={`tel:${rfp.buyerContact.phone}`} className="text-sm font-medium text-text-primary">
                  {rfp.buyerContact.phone}
                </a>
              </div>
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
                    <p className="font-medium text-text-primary">{PHASE_CONFIG[transition.phase].label}</p>
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
                  <p className="font-medium text-text-primary">{PHASE_CONFIG[transition.phase].label}</p>
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
    </div>
  )
}
