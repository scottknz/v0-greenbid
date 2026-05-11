'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  FileText,
  Users,
  Scale,
  Trophy,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RFPProgressBar } from '@/components/rfp/RFPProgressBar';

// Import lifecycle components
import { ResponsesTab } from '@/components/rfp/lifecycle/ResponsesTab';
import { InterviewsTab } from '@/components/rfp/lifecycle/InterviewsTab';
import { EvaluationTab } from '@/components/rfp/lifecycle/EvaluationTab';
import { AwardTab } from '@/components/rfp/lifecycle/AwardTab';

// Import mock data
import {
  mockResponses,
  mockInterviews,
  mockEvaluationCriteria,
  mockEvaluations,
  mockRankings,
  mockLifecycleStats,
  getResponsesByRfpId,
  getInterviewsByRfpId,
} from '@/lib/mock-rfp-lifecycle';

import type {
  RFPResponse,
  RFPInterview,
  InterviewNote,
  RFPPhase,
  PostAwardCommunication,
  RFPAward,
} from '@/types/rfp';

// Mock tender data
const tenderData = {
  id: '1',
  name: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
  referenceId: 'TND-2026-001',
  status: 'accepting_bids' as const,
  deadline: 'Apr 15, 2026',
  budget: 125000,
};

// RFP Lifecycle phases configuration
const lifecyclePhases = [
  { key: 'responses', label: 'Responses', icon: FileText },
  { key: 'interviews', label: 'Interviews', icon: Users },
  { key: 'evaluation', label: 'Evaluation', icon: Scale },
  { key: 'award', label: 'Award', icon: Trophy },
  { key: 'closed', label: 'Closed', icon: CheckCircle2 },
] as const;

type LifecycleTab = 'responses' | 'interviews' | 'evaluation' | 'award';

const phaseToTab: Record<RFPPhase, LifecycleTab> = {
  draft: 'responses',
  published: 'responses',
  accepting_responses: 'responses',
  response_review: 'responses',
  interviews_in_progress: 'interviews',
  evaluation: 'evaluation',
  final_selection: 'evaluation',
  award_pending: 'award',
  awarded: 'award',
  closed: 'award',
};

export default function TenderManagePage() {
  const params = useParams();
  const router = useRouter();
  const rfpId = params.id as string;

  // State
  const [activeTab, setActiveTab] = useState<LifecycleTab>('responses');
  const [currentPhase, setCurrentPhase] = useState<'responses' | 'interviews' | 'evaluation' | 'award' | 'closed'>('responses');
  const [responses, setResponses] = useState<RFPResponse[]>(mockResponses);
  const [interviews, setInterviews] = useState<RFPInterview[]>(mockInterviews);
  const [selectedResponse, setSelectedResponse] = useState<RFPResponse | null>(null);
  const [award, setAward] = useState<RFPAward | undefined>(undefined);
  const [communications, setCommunications] = useState<PostAwardCommunication[]>([]);

  // Stats from mock data
  const stats = mockLifecycleStats;

  // Handlers
  const handleViewResponse = (response: RFPResponse) => {
    setSelectedResponse(response);
    // Navigate to the submission detail page
    router.push(`/buyer/tenders/${rfpId}/submissions/${response.id}`);
  };

  const handleShortlist = (responseIds: string[]) => {
    setResponses(prev =>
      prev.map(r =>
        responseIds.includes(r.id)
          ? { ...r, status: 'shortlisted' as const, shortlistedAt: new Date().toISOString() }
          : r
      )
    );
    console.log('[v0] Shortlisted responses:', responseIds);
  };

  const handleRequestClarification = (responseId: string) => {
    setResponses(prev =>
      prev.map(r =>
        r.id === responseId
          ? { ...r, status: 'clarifications_requested' as const }
          : r
      )
    );
    console.log('[v0] Requested clarification for:', responseId);
  };

  const handleScheduleInterview = (interview: Partial<RFPInterview>) => {
    const newInterview: RFPInterview = {
      id: `int-${Date.now()}`,
      rfpId,
      responseId: interview.responseId || '',
      supplierId: interview.supplierId || '',
      supplierName: interview.supplierName || '',
      scheduledDate: interview.scheduledDate || '',
      scheduledTime: interview.scheduledTime || '',
      duration: interview.duration || 60,
      timezone: 'America/New_York',
      interviewType: interview.interviewType || 'discovery',
      status: 'scheduled',
      title: interview.title || 'Interview',
      agenda: interview.agenda,
      meetingLink: interview.meetingLink,
      buyerAttendees: [],
      supplierAttendees: [],
      notes: [],
      createdAt: new Date().toISOString(),
      createdBy: 'current-user',
      lastUpdatedAt: new Date().toISOString(),
    };
    setInterviews(prev => [...prev, newInterview]);
    console.log('[v0] Scheduled interview:', newInterview);
  };

  const handleUpdateInterview = (id: string, updates: Partial<RFPInterview>) => {
    setInterviews(prev =>
      prev.map(i => (i.id === id ? { ...i, ...updates, lastUpdatedAt: new Date().toISOString() } : i))
    );
    console.log('[v0] Updated interview:', id, updates);
  };

  const handleAddNote = (interviewId: string, note: Partial<InterviewNote>) => {
    setInterviews(prev =>
      prev.map(i => {
        if (i.id === interviewId) {
          const newNote: InterviewNote = {
            id: `note-${Date.now()}`,
            author: note.author || 'Current User',
            authorId: note.authorId || 'user-1',
            timestamp: new Date().toISOString(),
            content: note.content || '',
            category: note.category || 'general',
            isPrivate: note.isPrivate || false,
          };
          return { ...i, notes: [...i.notes, newNote], lastUpdatedAt: new Date().toISOString() };
        }
        return i;
      })
    );
    console.log('[v0] Added note to interview:', interviewId);
  };

  const handleCancelInterview = (id: string) => {
    setInterviews(prev => prev.filter(i => i.id !== id));
    console.log('[v0] Cancelled interview:', id);
  };

  const handleTriageResponse = (responseId: string, action: 'consider' | 'reject' | 'follow_up') => {
    const response = responses.find(r => r.id === responseId);
    if (!response) return;

    let newStatus: typeof response.status;
    if (action === 'consider') {
      newStatus = 'shortlisted';
    } else if (action === 'reject') {
      newStatus = 'rejected';
    } else {
      // follow_up - keep as is but could track this in a separate field
      newStatus = response.status;
    }

    setResponses(prev =>
      prev.map(r => (r.id === responseId ? { ...r, status: newStatus } : r))
    );
    console.log('[v0] Triaged response:', responseId, 'action:', action, 'new status:', newStatus);
  };

  const handleSaveScore = (responseId: string, criteriaId: string, score: number, comment: string) => {
    console.log('[v0] Saved score:', { responseId, criteriaId, score, comment });
    // In real implementation, this would update the evaluation
  };

  const handleFinalizeEvaluation = (responseId: string) => {
    console.log('[v0] Finalized evaluation for:', responseId);
    setResponses(prev =>
      prev.map(r =>
        r.id === responseId
          ? { ...r, status: 'evaluated' as const, evaluationStatus: 'complete' as const, evaluatedAt: new Date().toISOString() }
          : r
      )
    );
  };

  const handleUpdateRanking = (rankings: typeof mockRankings) => {
    console.log('[v0] Updated rankings:', rankings);
  };

  const handleSelectWinner = (responseId: string, contractValue: number) => {
    const response = responses.find(r => r.id === responseId);
    if (!response) return;

    const newAward: RFPAward = {
      id: `award-${Date.now()}`,
      rfpId,
      awardedResponseId: responseId,
      awardedSupplierId: response.supplierId,
      awardedSupplierName: response.supplierName,
      status: 'pending',
      awardedAt: new Date().toISOString(),
      awardedBy: 'current-user',
      awardedByName: 'Current User',
      contractValue,
      contractCurrency: 'USD',
      awardMessageSent: false,
      rejectionMessagesSent: false,
      nextSteps: [
        {
          id: 'step-1',
          title: 'Send award notification',
          description: 'Notify the winning supplier of their selection',
          status: 'pending',
        },
        {
          id: 'step-2',
          title: 'Send rejection notices',
          description: 'Notify unsuccessful suppliers',
          status: 'pending',
        },
        {
          id: 'step-3',
          title: 'Schedule kickoff meeting',
          description: 'Arrange initial meeting with awarded supplier',
          status: 'pending',
        },
      ],
    };

    setAward(newAward);
    setResponses(prev =>
      prev.map(r =>
        r.id === responseId
          ? { ...r, status: 'awarded' as const }
          : { ...r, status: 'rejected' as const }
      )
    );
    setCurrentPhase('award');
    setActiveTab('award');
    console.log('[v0] Contract awarded:', newAward);
  };

  const handleSendNotification = (notification: Partial<PostAwardCommunication>) => {
    const newComm: PostAwardCommunication = {
      id: `comm-${Date.now()}`,
      rfpId,
      responseId: notification.responseId || '',
      supplierId: notification.supplierId || '',
      supplierName: notification.supplierName || '',
      notificationType: notification.notificationType || 'general',
      subject: notification.subject || '',
      message: notification.message || '',
      status: 'sent',
      sentAt: new Date().toISOString(),
      sentBy: notification.sentBy || 'current-user',
      sentByName: notification.sentByName || 'Current User',
      attachments: [],
    };

    setCommunications(prev => [...prev, newComm]);

    // Update award status based on notification type
    let updatedAward = award;
    if (notification.notificationType === 'award_notification' && award) {
      updatedAward = { ...award, awardMessageSent: true, awardMessageSentAt: new Date().toISOString() };
      setAward(updatedAward);
    } else if (notification.notificationType === 'rejection_notification' && award) {
      updatedAward = { ...award, rejectionMessagesSent: true, rejectionMessagesSentAt: new Date().toISOString() };
      setAward(updatedAward);
    }

    // Advance to 'closed' when both award and rejection notifications have been sent
    if (updatedAward?.awardMessageSent && updatedAward?.rejectionMessagesSent) {
      setCurrentPhase('closed');
    }

    console.log('[v0] Sent notification:', newComm);
  };

  const handleUpdateAwardStatus = (status: RFPAward['status']) => {
    if (!award) return;
    setAward({ ...award, status });
    // When supplier agrees to contract, update the awarded response status too
    if (status === 'contract_agreed') {
      setResponses(prev =>
        prev.map(r =>
          r.id === award.awardedResponseId
            ? { ...r, status: 'contract_agreed' as const }
            : r
        )
      );
    }
  };

  const handleAddNextStep = (step: { title: string; description: string; dueDate?: string }) => {
    if (!award) return;

    const newStep = {
      id: `step-${Date.now()}`,
      title: step.title,
      description: step.description,
      dueDate: step.dueDate,
      status: 'pending' as const,
    };

    setAward({
      ...award,
      nextSteps: [...(award.nextSteps || []), newStep],
    });
    console.log('[v0] Added next step:', newStep);
  };

  const tabs = [
    {
      key: 'responses' as const,
      label: 'Responses',
      icon: FileText,
      count: responses.length,
      description: 'Review supplier submissions',
    },
    {
      key: 'interviews' as const,
      label: 'Interviews',
      icon: Users,
      count: interviews.filter(i => i.status === 'scheduled' || i.status === 'confirmed').length,
      description: 'Schedule and manage interviews',
    },
    {
      key: 'evaluation' as const,
      label: 'Evaluation',
      icon: Scale,
      count: responses.filter(r => r.evaluationStatus === 'complete').length,
      description: 'Score and rank proposals',
    },
    {
      key: 'award' as const,
      label: 'Award',
      icon: Trophy,
      count: award ? 1 : 0,
      description: 'Award contract and communicate',
    },
  ];

  // Progress calculation
  const progressSteps = [
    { phase: 'responses', complete: responses.length > 0 },
    { phase: 'interviews', complete: interviews.some(i => i.status === 'completed') },
    { phase: 'evaluation', complete: responses.some(r => r.evaluationStatus === 'complete') },
    { phase: 'award', complete: !!award },
  ];
  const completedSteps = progressSteps.filter(s => s.complete).length;
  const progress = (completedSteps / progressSteps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-text-secondary"
                onClick={() => router.push(`/buyer/tenders/${rfpId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to RFP
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-lg font-semibold text-text-primary leading-tight">
                  Manage RFP
                </h1>
                <p className="text-xs text-text-muted leading-tight">
                  {tenderData.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-text-muted">Reference</p>
                <p className="text-sm font-medium text-text-primary">{tenderData.referenceId}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-right">
                <p className="text-xs text-text-muted">Deadline</p>
                <p className="text-sm font-medium text-text-primary">{tenderData.deadline}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-right">
                <p className="text-xs text-text-muted">Budget</p>
                <p className="text-sm font-medium text-text-primary">
                  ${tenderData.budget.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RFP Lifecycle Progress Indicator */}
      <RFPProgressBar
        phases={lifecyclePhases}
        currentIndex={lifecyclePhases.findIndex(p => p.key === currentPhase)}
      />

      {/* Tab Navigation */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex gap-6">
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-2 py-3 border-b-2 transition-colors',
                    isActive
                      ? 'border-brand-green text-brand-green'
                      : 'border-transparent text-text-muted hover:text-text-secondary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className={cn(
                        'px-1.5 py-0.5 text-xs rounded-full',
                        isActive ? 'bg-brand-green/10 text-brand-green' : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>



      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'responses' && (
          <ResponsesTab
            rfpId={rfpId}
            responses={responses}
            onViewResponse={handleViewResponse}
            onShortlist={handleShortlist}
            onRequestClarification={handleRequestClarification}
            onScheduleInterview={(responseId) => {
              setActiveTab('interviews');
              // Pre-select the response for interview scheduling
            }}
            onTriageResponse={handleTriageResponse}
          />
        )}

        {activeTab === 'interviews' && (
          <InterviewsTab
            rfpId={rfpId}
            interviews={interviews}
            responses={responses}
            onScheduleInterview={handleScheduleInterview}
            onUpdateInterview={handleUpdateInterview}
            onAddNote={handleAddNote}
            onCancelInterview={handleCancelInterview}
          />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationTab
            rfpId={rfpId}
            responses={responses.filter(r => r.status === 'shortlisted' || r.status === 'evaluated' || r.status === 'finalist')}
            criteria={mockEvaluationCriteria}
            evaluations={mockEvaluations}
            rankings={mockRankings}
            interviews={interviews}
            onSaveScore={handleSaveScore}
            onFinalizeEvaluation={handleFinalizeEvaluation}
            onUpdateRanking={handleUpdateRanking}
          />
        )}

        {activeTab === 'award' && (
          <AwardTab
            rfpId={rfpId}
            rankings={mockRankings}
            responses={responses}
            award={award}
            communications={communications}
            onSelectWinner={handleSelectWinner}
            onSendNotification={handleSendNotification}
            onAddNextStep={handleAddNextStep}
            onUpdateAwardStatus={handleUpdateAwardStatus}
          />
        )}
      </div>
    </div>
  );
}
