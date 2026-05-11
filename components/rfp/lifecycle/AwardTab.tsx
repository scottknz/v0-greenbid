'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Award,
  Trophy,
  Send,
  MessageSquare,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  ChevronRight,
  Star,
  PartyPopper,
  ArrowRight,
  Pencil,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  RFPResponse,
  SupplierRanking,
  RFPAward,
  PostAwardCommunication,
} from '@/types/rfp';

interface AwardTabProps {
  rfpId: string;
  rfpTitle?: string;
  rankings: SupplierRanking[];
  responses: RFPResponse[];
  award?: RFPAward;
  communications: PostAwardCommunication[];
  onSelectWinner: (responseId: string, contractValue: number) => void;
  onSendNotification: (notification: Partial<PostAwardCommunication>) => void;
  onAddNextStep: (step: { title: string; description: string; dueDate?: string }) => void;
}

// Step 1 — confirm the winner
// Step 2 — compose messages to winner + unsuccessful suppliers
type AwardStep = 'confirm' | 'compose';

function buildAwardMessage(supplierName: string, rfpTitle: string) {
  return `Dear ${supplierName},

We are pleased to inform you that your proposal for "${rfpTitle}" has been selected.

Your submission stood out for its comprehensive approach and strong alignment with our requirements. We look forward to working with you on this project.

Next steps:
- Our team will reach out shortly to schedule a kickoff meeting
- Please review any attached contract documents
- Confirm your acceptance by replying to this message

If you have any questions, please don't hesitate to get in touch.

Kind regards,
Procurement Team`;
}

function buildRejectionMessage(supplierName: string, rfpTitle: string) {
  return `Dear ${supplierName},

Thank you for submitting your proposal for "${rfpTitle}". After careful evaluation of all submissions, we regret to inform you that your proposal was not selected on this occasion.

We received a number of strong submissions and the decision was not easy. We genuinely appreciate the time and effort you invested.

We value our relationship with your organisation and encourage you to participate in future opportunities.

Kind regards,
Procurement Team`;
}

// Persist new message threads to localStorage so the message centre picks them up
function saveThreadsToLocalStorage(newThreads: object[]) {
  try {
    const existing = JSON.parse(localStorage.getItem('gb_injected_threads') || '[]');
    localStorage.setItem('gb_injected_threads', JSON.stringify([...existing, ...newThreads]));
  } catch {
    // silently fail if localStorage is unavailable
  }
}

export function AwardTab({
  rfpId,
  rfpTitle = 'This RFP',
  rankings,
  responses,
  award,
  communications,
  onSelectWinner,
  onSendNotification,
  onAddNextStep,
}: AwardTabProps) {
  const router = useRouter();

  // Award + compose modal state
  const [showAwardFlow, setShowAwardFlow] = useState(false);
  const [awardStep, setAwardStep] = useState<AwardStep>('confirm');
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
  const [contractValue, setContractValue] = useState('');

  // Compose step state
  const [winnerSubject, setWinnerSubject] = useState('');
  const [winnerMessage, setWinnerMessage] = useState('');
  const [rejectionSubject, setRejectionSubject] = useState('');
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [sendRejections, setSendRejections] = useState(true);
  const [messagesSent, setMessagesSent] = useState(false);

  // Next step modal state
  const [showNextStepModal, setShowNextStepModal] = useState(false);
  const [nextStepTitle, setNextStepTitle] = useState('');
  const [nextStepDescription, setNextStepDescription] = useState('');
  const [nextStepDueDate, setNextStepDueDate] = useState('');

  // Notification modals for awarded state
  const [showWinnerNotifyModal, setShowWinnerNotifyModal] = useState(false);
  const [showUnsuccessfulNotifyModal, setShowUnsuccessfulNotifyModal] = useState(false);
  const [winnerNotifySubject, setWinnerNotifySubject] = useState('');
  const [winnerNotifyMessage, setWinnerNotifyMessage] = useState('');
  const [winnerNotifySent, setWinnerNotifySent] = useState(false);
  const [unsuccessfulNotifySubject, setUnsuccessfulNotifySubject] = useState('');
  const [unsuccessfulNotifyMessage, setUnsuccessfulNotifyMessage] = useState('');
  const [unsuccessfulRecipientMode, setUnsuccessfulRecipientMode] = useState<'all' | 'individual'>('all');
  const [selectedUnsuccessfulId, setSelectedUnsuccessfulId] = useState<string>('');
  const [notifiedUnsuccessfulIds, setNotifiedUnsuccessfulIds] = useState<Set<string>>(new Set());

  const awardedResponse = award ? responses.find(r => r.id === award.awardedResponseId) : null;
  const unsuccessfulResponses = award
    ? responses.filter(r => r.id !== award.awardedResponseId)
    : [];

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const formatCurrency = (value: number, currency = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(value);

  // Open Step 1 — confirm winner
  const handleOpenAwardModal = (responseId: string) => {
    const ranking = rankings.find(r => r.responseId === responseId);
    const winnerResponse = responses.find(r => r.id === responseId);
    setSelectedWinnerId(responseId);
    setContractValue(ranking?.priceTotal.toString() || '');
    setAwardStep('confirm');
    setMessagesSent(false);
    // Pre-fill messages with templates
    const supplierName = winnerResponse?.supplierName || 'Supplier';
    setWinnerSubject(`Congratulations — Contract Awarded: ${rfpTitle}`);
    setWinnerMessage(buildAwardMessage(supplierName, rfpTitle));
    setRejectionSubject(`RFP Decision — Thank you for your participation`);
    setRejectionMessage(buildRejectionMessage('{supplierName}', rfpTitle));
    setShowAwardFlow(true);
  };

  // Step 1 → Step 2
  const handleConfirmAndCompose = () => {
    if (!selectedWinnerId) return;
    onSelectWinner(selectedWinnerId, parseFloat(contractValue) || 0);
    setAwardStep('compose');
  };

  // Step 2 — send messages and push to message centre
  const handleSendMessages = () => {
    const winnerResponse = responses.find(r => r.id === selectedWinnerId);
    const now = new Date().toISOString();
    const threadsToSave: object[] = [];

    // Award notification
    if (winnerResponse) {
      onSendNotification({
        rfpId,
        responseId: winnerResponse.id,
        supplierId: winnerResponse.supplierId,
        supplierName: winnerResponse.supplierName,
        notificationType: 'award_notification',
        subject: winnerSubject,
        message: winnerMessage,
        status: 'sent',
        sentAt: now,
        sentBy: 'current-user',
        sentByName: 'Procurement Team',
        attachments: [],
      });

      threadsToSave.push({
        id: `award-${rfpId}-${winnerResponse.id}-${Date.now()}`,
        rfpId,
        rfpTitle,
        subject: winnerSubject,
        visibility: 'private',
        status: 'awaiting',
        isRead: true,
        isStarred: false,
        isArchived: false,
        tag: 'award',
        createdAt: now,
        updatedAt: now,
        lastSender: 'Procurement Team',
        lastSenderType: 'buyer',
        participants: [winnerResponse.supplierId],
        messages: [
          {
            id: `msg-award-${Date.now()}`,
            senderId: 'buyer',
            senderName: 'Procurement Team',
            senderType: 'buyer',
            content: winnerMessage,
            attachments: [],
            timestamp: now,
          },
        ],
      });
    }

    // Rejection notifications
    if (sendRejections) {
      unsuccessfulResponses.forEach(resp => {
        const personalised = rejectionMessage.replace('{supplierName}', resp.supplierName);
        onSendNotification({
          rfpId,
          responseId: resp.id,
          supplierId: resp.supplierId,
          supplierName: resp.supplierName,
          notificationType: 'rejection_notification',
          subject: rejectionSubject,
          message: personalised,
          status: 'sent',
          sentAt: now,
          sentBy: 'current-user',
          sentByName: 'Procurement Team',
          attachments: [],
        });

        threadsToSave.push({
          id: `reject-${rfpId}-${resp.id}-${Date.now()}-${Math.random()}`,
          rfpId,
          rfpTitle,
          subject: rejectionSubject,
          visibility: 'private',
          status: 'awaiting',
          isRead: true,
          isStarred: false,
          isArchived: false,
          tag: 'rejection',
          createdAt: now,
          updatedAt: now,
          lastSender: 'Procurement Team',
          lastSenderType: 'buyer',
          participants: [resp.supplierId],
          messages: [
            {
              id: `msg-reject-${resp.id}-${Date.now()}`,
              senderId: 'buyer',
              senderName: 'Procurement Team',
              senderType: 'buyer',
              content: personalised,
              attachments: [],
              timestamp: now,
            },
          ],
        });
      });
    }

    saveThreadsToLocalStorage(threadsToSave);
    setMessagesSent(true);
  };

  const handleCloseFlow = () => {
    setShowAwardFlow(false);
    setAwardStep('confirm');
    setMessagesSent(false);
  };

  const handleAddNextStep = () => {
    onAddNextStep({ title: nextStepTitle, description: nextStepDescription, dueDate: nextStepDueDate || undefined });
    setShowNextStepModal(false);
    setNextStepTitle('');
    setNextStepDescription('');
    setNextStepDueDate('');
  };

  const selectedWinnerRanking = rankings.find(r => r.responseId === selectedWinnerId);
  const selectedWinnerResponse = responses.find(r => r.id === selectedWinnerId);

  // ─── Not yet awarded ────────────────────────────────────────────────────────
  if (!award) {
    return (
      <div className="space-y-6">
        {/* Prompt */}
        <Card className="border-brand-green bg-brand-green-light/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0">
                <Trophy className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Ready to Award Contract</h3>
                <p className="text-sm text-text-secondary mt-1">
                  Based on evaluation scores and interviews, select a supplier to award the contract. You will be guided through notifying all participants.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Candidates */}
        <div>
          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Top Candidates
          </h4>
          <div className="space-y-3">
            {rankings.slice(0, 3).map((ranking, index) => (
              <Card key={ranking.responseId} className="border-border bg-background">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
                      index === 0 ? 'bg-amber-100' : 'bg-surface'
                    )}>
                      {index === 0
                        ? <Trophy className="h-5 w-5 text-amber-600" />
                        : <span className="font-semibold text-text-secondary">{index + 1}</span>
                      }
                    </div>
                    <Avatar className="h-11 w-11 border-2 border-border">
                      <AvatarFallback className="bg-surface text-sm">
                        {getInitials(ranking.supplierName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary">{ranking.supplierName}</p>
                      <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-sm text-text-muted">
                          <Star className="h-3.5 w-3.5" />
                          {ranking.percentageScore}% score
                        </span>
                        <span className="flex items-center gap-1 text-sm text-text-muted">
                          <DollarSign className="h-3.5 w-3.5" />
                          {formatCurrency(ranking.priceTotal)}
                        </span>
                        {ranking.interviewRating && (
                          <span className="flex items-center gap-1 text-sm text-text-muted">
                            <Users className="h-3.5 w-3.5" />
                            {ranking.interviewRating}/5 interview
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs hidden sm:inline-flex',
                        ranking.recommendation === 'highly_recommended' && 'bg-green-50 text-green-700 border-green-200',
                        ranking.recommendation === 'recommended' && 'bg-blue-50 text-blue-700 border-blue-200',
                        ranking.recommendation === 'neutral' && 'bg-surface text-text-secondary border-border'
                      )}
                    >
                      {ranking.recommendation.replace(/_/g, ' ')}
                    </Badge>
                    <Button
                      onClick={() => handleOpenAwardModal(ranking.responseId)}
                      className="bg-brand-green hover:bg-brand-green-mid text-white shrink-0"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Award Contract
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Award Flow Modal */}
        <Dialog open={showAwardFlow} onOpenChange={handleCloseFlow}>
          <DialogContent className="sm:max-w-[620px] flex flex-col max-h-[85vh] p-0 gap-0">

            {/* ── Step 1: Confirm Winner ── */}
            {awardStep === 'confirm' && (
              <>
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                  <DialogTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-brand-green" />
                    Confirm Award
                  </DialogTitle>
                  <DialogDescription>
                    Review the selected supplier and contract value before proceeding. You will compose messages to all participants in the next step.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                  {selectedWinnerRanking && (
                    <>
                      {/* Winner card */}
                      <div className="flex items-center gap-3 p-3 bg-brand-green-light/30 rounded-lg border border-brand-green/20">
                        <Avatar className="h-11 w-11 border-2 border-brand-green shrink-0">
                          <AvatarFallback className="bg-brand-green-light text-brand-green font-semibold text-sm">
                            {getInitials(selectedWinnerRanking.supplierName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-primary">
                            {selectedWinnerRanking.supplierName}
                          </p>
                          <p className="text-xs text-text-muted">
                            Rank #{selectedWinnerRanking.rank} &middot; {selectedWinnerRanking.percentageScore}% overall score
                          </p>
                        </div>
                        <Badge className="bg-brand-green text-white shrink-0">Selected Winner</Badge>
                      </div>

                      {/* Contract value */}
                      <div className="space-y-1.5">
                        <Label className="text-sm">Contract Value</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                          <Input
                            type="number"
                            value={contractValue}
                            onChange={e => setContractValue(e.target.value)}
                            className="pl-9 bg-background border-border"
                            placeholder="Enter contract value"
                          />
                        </div>
                      </div>

                      {/* Unsuccessful count */}
                      <div className="p-3 bg-surface rounded-lg border border-border flex items-center gap-2">
                        <Users className="h-4 w-4 text-text-muted shrink-0" />
                        <p className="text-sm text-text-secondary">
                          <span className="font-medium">{responses.length - 1} other supplier{responses.length - 1 !== 1 ? 's' : ''}</span> will be notified as unsuccessful in the next step.
                        </p>
                      </div>

                      {/* Warning */}
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-800">This action cannot be undone</p>
                          <p className="text-amber-700 mt-0.5 text-xs">
                            Once confirmed, the RFP will be marked as awarded. You will then compose notification messages to all suppliers.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <DialogFooter className="px-6 py-4 border-t border-border shrink-0">
                  <Button variant="outline" onClick={handleCloseFlow}>Cancel</Button>
                  <Button
                    onClick={handleConfirmAndCompose}
                    className="bg-brand-green hover:bg-brand-green-mid text-white"
                  >
                    Confirm &amp; Compose Messages
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </DialogFooter>
              </>
            )}

            {/* ── Step 2: Compose Messages ── */}
            {awardStep === 'compose' && !messagesSent && (
              <>
                <DialogHeader className="px-6 pt-5 pb-4 border-b border-border shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-6 rounded-full bg-brand-green flex items-center justify-center">
                      <CheckCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <Badge className="bg-brand-green text-white text-xs">Contract Awarded</Badge>
                  </div>
                  <DialogTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-text-primary" />
                    Notify Suppliers
                  </DialogTitle>
                  <DialogDescription className="text-xs leading-relaxed">
                    Compose your messages below. Both go to the Message Centre when you click Send. Use <code className="bg-surface px-1 rounded">{'{supplierName}'}</code> in the unsuccessful message to personalise automatically.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

                  {/* ── Winner message ── */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <Trophy className="h-3 w-3 text-amber-600" />
                      </div>
                      <h4 className="font-semibold text-text-primary text-sm">
                        Winner — {selectedWinnerResponse?.supplierName}
                      </h4>
                    </div>
                    <div className="rounded-lg border border-brand-green/30 bg-brand-green-light/10 p-3 space-y-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-text-secondary">Subject</Label>
                        <Input
                          value={winnerSubject}
                          onChange={e => setWinnerSubject(e.target.value)}
                          className="bg-background border-border text-sm h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-text-secondary">Message</Label>
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <Pencil className="h-3 w-3" /> Editable
                          </span>
                        </div>
                        <Textarea
                          value={winnerMessage}
                          onChange={e => setWinnerMessage(e.target.value)}
                          className="min-h-[100px] bg-background border-border text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-3 text-xs text-text-muted">Unsuccessful suppliers</span>
                    </div>
                  </div>

                  {/* ── Rejection message ── */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
                          <Mail className="h-3 w-3 text-text-muted" />
                        </div>
                        <h4 className="font-semibold text-text-primary text-sm">
                          {unsuccessfulResponses.length} unsuccessful supplier{unsuccessfulResponses.length !== 1 ? 's' : ''}
                        </h4>
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={sendRejections}
                          onChange={e => setSendRejections(e.target.checked)}
                          className="accent-brand-green h-3.5 w-3.5"
                        />
                        <span className="text-xs text-text-secondary">Send message</span>
                      </label>
                    </div>

                    <div className={cn(
                      'rounded-lg border p-3 space-y-2 transition-opacity',
                      sendRejections ? 'border-border bg-background' : 'border-border bg-surface opacity-50 pointer-events-none'
                    )}>
                      {/* Recipient pills */}
                      <div className="flex flex-wrap gap-1">
                        {unsuccessfulResponses.map(resp => (
                          <span key={resp.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-border text-xs text-text-secondary">
                            <Avatar className="h-3.5 w-3.5">
                              <AvatarFallback className="text-[8px]">{getInitials(resp.supplierName)}</AvatarFallback>
                            </Avatar>
                            {resp.supplierName}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-text-secondary">Subject</Label>
                        <Input
                          value={rejectionSubject}
                          onChange={e => setRejectionSubject(e.target.value)}
                          className="bg-background border-border text-sm h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-text-secondary">Message</Label>
                          <span className="text-xs text-text-muted">
                            Use <code className="bg-surface px-1 rounded">{'{supplierName}'}</code>
                          </span>
                        </div>
                        <Textarea
                          value={rejectionMessage}
                          onChange={e => setRejectionMessage(e.target.value)}
                          className="min-h-[100px] bg-background border-border text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t border-border shrink-0 gap-2">
                  <Button variant="outline" onClick={handleCloseFlow}>Cancel</Button>
                  <Button
                    onClick={handleSendMessages}
                    className="bg-brand-green hover:bg-brand-green-mid text-white"
                    disabled={!winnerSubject.trim() || !winnerMessage.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Messages
                  </Button>
                </DialogFooter>
              </>
            )}

            {/* ── Sent confirmation ── */}
            {awardStep === 'compose' && messagesSent && (
              <>
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                  <DialogTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-brand-green" />
                    Messages Sent
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center gap-4 text-center">
                  <div className="h-14 w-14 rounded-full bg-brand-green-light flex items-center justify-center">
                    <Send className="h-7 w-7 text-brand-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-lg">All notifications sent</p>
                    <p className="text-sm text-text-secondary mt-1">
                      Your messages have been delivered and are available in the Message Centre.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-brand-green-light/30 border border-brand-green/20">
                      <Trophy className="h-4 w-4 text-amber-600 shrink-0" />
                      <span className="text-sm text-text-secondary text-left">
                        Award notification sent to{' '}
                        <span className="font-medium text-text-primary">{selectedWinnerResponse?.supplierName}</span>
                      </span>
                    </div>
                    {sendRejections && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-surface border border-border">
                        <Mail className="h-4 w-4 text-text-muted shrink-0" />
                        <span className="text-sm text-text-secondary text-left">
                          Decline notices sent to{' '}
                          <span className="font-medium text-text-primary">{unsuccessfulResponses.length} supplier{unsuccessfulResponses.length !== 1 ? 's' : ''}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter className="px-6 py-4 border-t border-border shrink-0 gap-2">
                  <Button variant="outline" onClick={handleCloseFlow}>Close</Button>
                  <Button
                    onClick={() => router.push('/buyer/messages')}
                    className="bg-brand-green hover:bg-brand-green-mid text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Go to Message Centre
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ─── Awarded state ───────────────────────────────────────────────────────────

  // Open "Notify Successful Bidder" modal
  const handleOpenWinnerNotify = () => {
    const winnerName = awardedResponse?.supplierName || 'Supplier';
    setWinnerNotifySubject(`Congratulations — Contract Awarded: ${rfpTitle}`);
    setWinnerNotifyMessage(buildAwardMessage(winnerName, rfpTitle));
    setWinnerNotifySent(false);
    setShowWinnerNotifyModal(true);
  };

  // Send winner notification
  const handleSendWinnerNotify = () => {
    if (!awardedResponse) return;
    const now = new Date().toISOString();

    onSendNotification({
      rfpId,
      responseId: awardedResponse.id,
      supplierId: awardedResponse.supplierId,
      supplierName: awardedResponse.supplierName,
      notificationType: 'award_notification',
      subject: winnerNotifySubject,
      message: winnerNotifyMessage,
      status: 'sent',
      sentAt: now,
      sentBy: 'current-user',
      sentByName: 'Procurement Team',
      attachments: [],
    });

    saveThreadsToLocalStorage([{
      id: `winner-notify-${rfpId}-${awardedResponse.id}-${Date.now()}`,
      rfpId,
      rfpTitle,
      subject: winnerNotifySubject,
      visibility: 'private',
      status: 'awaiting',
      isRead: true,
      isStarred: false,
      isArchived: false,
      tag: 'award',
      createdAt: now,
      updatedAt: now,
      lastSender: 'Procurement Team',
      lastSenderType: 'buyer',
      participants: [awardedResponse.supplierId],
      messages: [{
        id: `winner-msg-${awardedResponse.id}-${Date.now()}`,
        senderId: 'buyer',
        senderName: 'Procurement Team',
        senderType: 'buyer',
        content: winnerNotifyMessage,
        attachments: [],
        timestamp: now,
      }],
    }]);

    setWinnerNotifySent(true);
  };

  // Open "Notify Unsuccessful Bidders" modal
  const handleOpenUnsuccessfulNotify = () => {
    setUnsuccessfulNotifySubject(`RFP Decision — Thank you for your participation`);
    setUnsuccessfulNotifyMessage(buildRejectionMessage('{supplierName}', rfpTitle));
    setUnsuccessfulRecipientMode('all');
    setSelectedUnsuccessfulId('');
    setShowUnsuccessfulNotifyModal(true);
  };

  // Send unsuccessful notifications
  const handleSendUnsuccessfulNotify = () => {
    const now = new Date().toISOString();
    const recipients = unsuccessfulRecipientMode === 'all'
      ? unsuccessfulResponses
      : unsuccessfulResponses.filter(r => r.id === selectedUnsuccessfulId);

    const threadsToSave: object[] = [];
    const newNotifiedIds = new Set(notifiedUnsuccessfulIds);

    recipients.forEach(resp => {
      const personalizedMessage = unsuccessfulNotifyMessage.replace(/{supplierName}/g, resp.supplierName);

      onSendNotification({
        rfpId,
        responseId: resp.id,
        supplierId: resp.supplierId,
        supplierName: resp.supplierName,
        notificationType: 'rejection_notification',
        subject: unsuccessfulNotifySubject,
        message: personalizedMessage,
        status: 'sent',
        sentAt: now,
        sentBy: 'current-user',
        sentByName: 'Procurement Team',
        attachments: [],
      });

      threadsToSave.push({
        id: `reject-notify-${rfpId}-${resp.id}-${Date.now()}`,
        rfpId,
        rfpTitle,
        subject: unsuccessfulNotifySubject,
        visibility: 'private',
        status: 'awaiting',
        isRead: true,
        isStarred: false,
        isArchived: false,
        tag: 'rejection',
        createdAt: now,
        updatedAt: now,
        lastSender: 'Procurement Team',
        lastSenderType: 'buyer',
        participants: [resp.supplierId],
        messages: [{
          id: `reject-msg-${resp.id}-${Date.now()}`,
          senderId: 'buyer',
          senderName: 'Procurement Team',
          senderType: 'buyer',
          content: personalizedMessage,
          attachments: [],
          timestamp: now,
        }],
      });

      newNotifiedIds.add(resp.id);
    });

    saveThreadsToLocalStorage(threadsToSave);
    setNotifiedUnsuccessfulIds(newNotifiedIds);
    setShowUnsuccessfulNotifyModal(false);
  };

  // Compute notification status for unsuccessful bidders
  const allUnsuccessfulNotified = unsuccessfulResponses.length > 0 &&
    unsuccessfulResponses.every(r => notifiedUnsuccessfulIds.has(r.id));
  const someUnsuccessfulNotified = notifiedUnsuccessfulIds.size > 0 && !allUnsuccessfulNotified;

  return (
    <div className="space-y-6">
      {/* Award Banner */}
      <Card className="border-brand-green bg-brand-green-light/20 overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute -right-4 -top-4 opacity-10">
            <PartyPopper className="h-32 w-32 text-brand-green" />
          </div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="h-14 w-14 rounded-full bg-brand-green flex items-center justify-center shrink-0">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <Badge className="bg-brand-green text-white mb-2">Contract Awarded</Badge>
              <h3 className="text-xl font-semibold text-text-primary">{awardedResponse?.supplierName}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary flex-wrap">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">{formatCurrency(award.contractValue)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Awarded {new Date(award.awardedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                'text-sm shrink-0',
                award.status === 'accepted' && 'bg-green-50 text-green-700 border-green-200',
                award.status === 'pending' && 'bg-amber-50 text-amber-700 border-amber-200',
                award.status === 'finalized' && 'bg-brand-green-light text-brand-green border-brand-green/20'
              )}
            >
              {award.status === 'accepted' && <CheckCircle className="h-4 w-4 mr-1" />}
              {award.status === 'pending' && <Clock className="h-4 w-4 mr-1" />}
              {award.status.charAt(0).toUpperCase() + award.status.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Communications */}
        <Card className="border-border bg-background">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Communications
            </CardTitle>
            <CardDescription>Supplier notifications sent for this RFP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Notification action cards */}
            <div className="grid grid-cols-1 gap-3">
              {/* Notify Successful Bidder */}
              <button
                onClick={handleOpenWinnerNotify}
                disabled={award.awardMessageSent}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-lg border text-left transition-all w-full',
                  award.awardMessageSent
                    ? 'bg-green-50 border-green-300 cursor-default'
                    : 'bg-surface border-border hover:border-brand-green hover:shadow-sm cursor-pointer'
                )}
              >
                <div className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
                  award.awardMessageSent ? 'bg-green-500' : 'bg-brand-green-light'
                )}>
                  {award.awardMessageSent
                    ? <CheckCircle className="h-5 w-5 text-white" />
                    : <Trophy className="h-5 w-5 text-brand-green" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">
                    {award.awardMessageSent ? 'Successful Bidder Notified' : 'Notify Successful Bidder'}
                  </p>
                  <p className="text-xs text-text-muted">
                    {award.awardMessageSent
                      ? `Sent to ${awardedResponse?.supplierName}`
                      : `Send award notification to ${awardedResponse?.supplierName}`}
                  </p>
                </div>
                {!award.awardMessageSent && (
                  <ChevronRight className="h-5 w-5 text-text-muted shrink-0" />
                )}
              </button>

              {/* Notify Unsuccessful Bidders */}
              <button
                onClick={handleOpenUnsuccessfulNotify}
                disabled={allUnsuccessfulNotified}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-lg border text-left transition-all w-full',
                  allUnsuccessfulNotified
                    ? 'bg-green-50 border-green-300 cursor-default'
                    : someUnsuccessfulNotified
                    ? 'bg-amber-50 border-amber-300 hover:border-amber-400 hover:shadow-sm cursor-pointer'
                    : 'bg-surface border-border hover:border-brand-green hover:shadow-sm cursor-pointer'
                )}
              >
                <div className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
                  allUnsuccessfulNotified
                    ? 'bg-green-500'
                    : someUnsuccessfulNotified
                    ? 'bg-amber-500'
                    : 'bg-surface border border-border'
                )}>
                  {allUnsuccessfulNotified
                    ? <CheckCircle className="h-5 w-5 text-white" />
                    : someUnsuccessfulNotified
                    ? <MessageSquare className="h-5 w-5 text-white" />
                    : <MessageSquare className="h-5 w-5 text-text-muted" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">
                    {allUnsuccessfulNotified
                      ? 'All Unsuccessful Bidders Notified'
                      : 'Notify Unsuccessful Bidders'}
                  </p>
                  <p className="text-xs text-text-muted">
                    {allUnsuccessfulNotified
                      ? `Sent to ${unsuccessfulResponses.length} supplier${unsuccessfulResponses.length !== 1 ? 's' : ''}`
                      : someUnsuccessfulNotified
                      ? `${notifiedUnsuccessfulIds.size} of ${unsuccessfulResponses.length} notified`
                      : `Send decline notice to ${unsuccessfulResponses.length} supplier${unsuccessfulResponses.length !== 1 ? 's' : ''}`}
                  </p>
                </div>
                {!allUnsuccessfulNotified && (
                  <ChevronRight className="h-5 w-5 text-text-muted shrink-0" />
                )}
              </button>
            </div>

            {/* View in message centre */}
            <Button
              variant="outline"
              className="w-full justify-between border-border"
              onClick={() => router.push('/buyer/messages')}
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View in Message Centre
              </span>
              <ChevronRight className="h-4 w-4 text-text-muted" />
            </Button>

            {/* Communication history */}
            {communications.length > 0 && (
              <div className="pt-3 border-t border-border space-y-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Recent</p>
                {communications.slice(0, 4).map(comm => (
                  <div key={comm.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors">
                    <div className="h-8 w-8 rounded-full bg-surface flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{comm.supplierName}</p>
                      <p className="text-xs text-text-muted truncate">{comm.subject}</p>
                    </div>
                    <Badge variant="outline" className={cn(
                      'text-xs shrink-0',
                      comm.status === 'sent' && 'border-blue-200 text-blue-700 bg-blue-50',
                      comm.status === 'read' && 'border-green-200 text-green-700 bg-green-50',
                    )}>
                      {comm.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-border bg-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Next Steps
                </CardTitle>
                <CardDescription>Track post-award activities</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowNextStepModal(true)} className="border-border">
                Add Step
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {award.nextSteps?.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                    step.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-background border-border'
                  )}
                >
                  <div className={cn(
                    'h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    step.status === 'completed' ? 'bg-green-500' : 'bg-surface border border-border'
                  )}>
                    {step.status === 'completed'
                      ? <CheckCircle className="h-4 w-4 text-white" />
                      : <span className="text-xs font-medium text-text-secondary">{index + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-medium text-sm',
                      step.status === 'completed' ? 'text-green-800 line-through' : 'text-text-primary'
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{step.description}</p>
                    {step.dueDate && (
                      <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(step.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {(!award.nextSteps || award.nextSteps.length === 0) && (
                <div className="text-center py-8 text-text-muted">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No next steps added yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notify Successful Bidder Modal */}
      <Dialog open={showWinnerNotifyModal} onOpenChange={open => { setShowWinnerNotifyModal(open); if (!open) setWinnerNotifySent(false); }}>
        <DialogContent className="sm:max-w-[540px] flex flex-col max-h-[85vh] p-0 gap-0">
          {!winnerNotifySent ? (
            <>
              <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-brand-green" />
                  Notify Successful Bidder
                </DialogTitle>
                <DialogDescription>
                  Send the award notification to {awardedResponse?.supplierName}. This will be saved to the Message Centre.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-green-300">
                      <AvatarFallback className="bg-green-100 text-green-700 text-sm font-semibold">
                        {getInitials(awardedResponse?.supplierName || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-green-800">{awardedResponse?.supplierName}</p>
                      <p className="text-xs text-green-600">Awarded Supplier</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Subject</Label>
                  <Input
                    value={winnerNotifySubject}
                    onChange={e => setWinnerNotifySubject(e.target.value)}
                    placeholder="Enter subject"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Message</Label>
                  <Textarea
                    value={winnerNotifyMessage}
                    onChange={e => setWinnerNotifyMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="min-h-[180px] bg-background border-border resize-none"
                  />
                </div>
              </div>
              <DialogFooter className="px-6 py-4 border-t border-border shrink-0 gap-2">
                <Button variant="outline" onClick={() => setShowWinnerNotifyModal(false)}>Cancel</Button>
                <Button
                  onClick={handleSendWinnerNotify}
                  disabled={!winnerNotifySubject.trim() || !winnerNotifyMessage.trim()}
                  className="bg-brand-green hover:bg-brand-green-mid text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-brand-green" />
                  Notification Sent
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 px-6 py-8 flex flex-col items-center gap-4 text-center">
                <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                  <Trophy className="h-7 w-7 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-lg">Award notification sent</p>
                  <p className="text-sm text-text-secondary mt-1">
                    {awardedResponse?.supplierName} has been notified of the contract award.
                  </p>
                </div>
              </div>
              <DialogFooter className="px-6 py-4 border-t border-border shrink-0 gap-2">
                <Button variant="outline" onClick={() => setShowWinnerNotifyModal(false)}>Close</Button>
                <Button
                  onClick={() => router.push('/buyer/messages')}
                  className="bg-brand-green hover:bg-brand-green-mid text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in Message Centre
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Notify Unsuccessful Bidders Modal */}
      <Dialog open={showUnsuccessfulNotifyModal} onOpenChange={setShowUnsuccessfulNotifyModal}>
        <DialogContent className="sm:max-w-[540px] flex flex-col max-h-[85vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-text-primary" />
              Notify Unsuccessful Bidders
            </DialogTitle>
            <DialogDescription>
              Send decline notifications. Messages will be saved to the Message Centre.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Recipient selection */}
            <div className="space-y-2">
              <Label className="text-sm">Send to</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={unsuccessfulRecipientMode === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUnsuccessfulRecipientMode('all')}
                  className={cn(
                    unsuccessfulRecipientMode === 'all'
                      ? 'bg-brand-green hover:bg-brand-green-mid text-white'
                      : 'border-border'
                  )}
                >
                  All Unsuccessful ({unsuccessfulResponses.length})
                </Button>
                <Button
                  type="button"
                  variant={unsuccessfulRecipientMode === 'individual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUnsuccessfulRecipientMode('individual')}
                  className={cn(
                    unsuccessfulRecipientMode === 'individual'
                      ? 'bg-brand-green hover:bg-brand-green-mid text-white'
                      : 'border-border'
                  )}
                >
                  Individual
                </Button>
              </div>
            </div>

            {/* Individual supplier selector */}
            {unsuccessfulRecipientMode === 'individual' && (
              <div className="space-y-2">
                <Label className="text-sm">Select Supplier</Label>
                <select
                  value={selectedUnsuccessfulId}
                  onChange={e => setSelectedUnsuccessfulId(e.target.value)}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                >
                  <option value="">Choose a supplier...</option>
                  {unsuccessfulResponses.map(r => (
                    <option key={r.id} value={r.id} disabled={notifiedUnsuccessfulIds.has(r.id)}>
                      {r.supplierName} {notifiedUnsuccessfulIds.has(r.id) ? '(already notified)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Recipients preview */}
            {unsuccessfulRecipientMode === 'all' && (
              <div className="p-3 rounded-lg bg-surface border border-border">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Recipients</p>
                <div className="flex flex-wrap gap-2">
                  {unsuccessfulResponses.map(r => (
                    <div
                      key={r.id}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs',
                        notifiedUnsuccessfulIds.has(r.id)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-surface-hover text-text-secondary'
                      )}
                    >
                      {notifiedUnsuccessfulIds.has(r.id) && <CheckCircle className="h-3 w-3" />}
                      {r.supplierName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm">Subject</Label>
              <Input
                value={unsuccessfulNotifySubject}
                onChange={e => setUnsuccessfulNotifySubject(e.target.value)}
                placeholder="Enter subject"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Message</Label>
              <p className="text-xs text-text-muted">Use {'{supplierName}'} to personalize each message.</p>
              <Textarea
                value={unsuccessfulNotifyMessage}
                onChange={e => setUnsuccessfulNotifyMessage(e.target.value)}
                placeholder="Write your message here..."
                className="min-h-[140px] bg-background border-border resize-none"
              />
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-border shrink-0 gap-2">
            <Button variant="outline" onClick={() => setShowUnsuccessfulNotifyModal(false)}>Cancel</Button>
            <Button
              onClick={handleSendUnsuccessfulNotify}
              disabled={
                !unsuccessfulNotifySubject.trim() ||
                !unsuccessfulNotifyMessage.trim() ||
                (unsuccessfulRecipientMode === 'individual' && !selectedUnsuccessfulId)
              }
              className="bg-brand-green hover:bg-brand-green-mid text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              {unsuccessfulRecipientMode === 'all'
                ? `Send to ${unsuccessfulResponses.filter(r => !notifiedUnsuccessfulIds.has(r.id)).length} Suppliers`
                : 'Send Notification'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Next Step Modal */}
      <Dialog open={showNextStepModal} onOpenChange={setShowNextStepModal}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Add Next Step</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={nextStepTitle}
                onChange={e => setNextStepTitle(e.target.value)}
                placeholder="e.g. Schedule kickoff meeting"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={nextStepDescription}
                onChange={e => setNextStepDescription(e.target.value)}
                placeholder="Details about this step..."
                className="min-h-[80px] bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date (optional)</Label>
              <Input
                type="date"
                value={nextStepDueDate}
                onChange={e => setNextStepDueDate(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNextStepModal(false)}>Cancel</Button>
            <Button
              onClick={handleAddNextStep}
              disabled={!nextStepTitle.trim()}
              className="bg-brand-green hover:bg-brand-green-mid text-white"
            >
              Add Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
