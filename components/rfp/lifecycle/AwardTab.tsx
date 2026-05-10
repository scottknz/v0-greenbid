'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Award,
  Trophy,
  Send,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Mail,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Star,
  PartyPopper,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  RFPResponse,
  SupplierRanking,
  RFPAward,
  PostAwardCommunication,
  NotificationType,
} from '@/types/rfp';

interface AwardTabProps {
  rfpId: string;
  rankings: SupplierRanking[];
  responses: RFPResponse[];
  award?: RFPAward;
  communications: PostAwardCommunication[];
  onSelectWinner: (responseId: string, contractValue: number) => void;
  onSendNotification: (notification: Partial<PostAwardCommunication>) => void;
  onAddNextStep: (step: { title: string; description: string; dueDate?: string }) => void;
}

const notificationTemplates = {
  award_notification: {
    subject: 'Congratulations - You have been awarded the contract',
    message: `Dear {supplierName},

We are pleased to inform you that your proposal for {rfpTitle} has been selected.

Your proposal stood out for its comprehensive approach and alignment with our requirements. We look forward to working with you on this project.

Next Steps:
- Our team will reach out to schedule a kickoff meeting
- Please review the attached contract documents
- Confirm your acceptance by responding to this notification

If you have any questions, please don't hesitate to contact us.

Best regards,
{buyerName}`,
  },
  rejection_notification: {
    subject: 'RFP Decision - Thank you for your participation',
    message: `Dear {supplierName},

Thank you for submitting your proposal for {rfpTitle}. After careful evaluation of all submissions, we regret to inform you that your proposal was not selected on this occasion.

We received many strong proposals and the decision was not easy. We appreciate the time and effort you invested in your submission.

We encourage you to participate in future opportunities and value our relationship with your organization.

Best regards,
{buyerName}`,
  },
  feedback_request: {
    subject: 'Request for Feedback on RFP Process',
    message: `Dear {supplierName},

We value your participation in our recent RFP process for {rfpTitle}. Your feedback would help us improve our procurement processes.

Please take a few minutes to share your experience:
- How clear were the RFP requirements?
- Was the evaluation process transparent?
- Any suggestions for improvement?

Your feedback is confidential and will be used to enhance future RFP processes.

Thank you for your time.

Best regards,
{buyerName}`,
  },
};

export function AwardTab({
  rfpId,
  rankings,
  responses,
  award,
  communications,
  onSelectWinner,
  onSendNotification,
  onAddNextStep,
}: AwardTabProps) {
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
  const [contractValue, setContractValue] = useState('');
  const [notificationType, setNotificationType] = useState<NotificationType>('award_notification');
  const [notificationRecipients, setNotificationRecipients] = useState<string[]>([]);
  const [notificationSubject, setNotificationSubject] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [sendToAll, setSendToAll] = useState(false);

  // Next step form
  const [showNextStepModal, setShowNextStepModal] = useState(false);
  const [nextStepTitle, setNextStepTitle] = useState('');
  const [nextStepDescription, setNextStepDescription] = useState('');
  const [nextStepDueDate, setNextStepDueDate] = useState('');

  const topRanking = rankings[0];
  const awardedResponse = award ? responses.find(r => r.id === award.awardedResponseId) : null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleOpenAwardModal = (responseId: string) => {
    const ranking = rankings.find(r => r.responseId === responseId);
    setSelectedWinnerId(responseId);
    setContractValue(ranking?.priceTotal.toString() || '');
    setShowAwardModal(true);
  };

  const handleConfirmAward = () => {
    if (!selectedWinnerId) return;
    onSelectWinner(selectedWinnerId, parseFloat(contractValue) || 0);
    setShowAwardModal(false);
  };

  const handleOpenNotificationModal = (type: NotificationType, recipients?: string[]) => {
    setNotificationType(type);
    setNotificationSubject(notificationTemplates[type as keyof typeof notificationTemplates]?.subject || '');
    setNotificationMessage(notificationTemplates[type as keyof typeof notificationTemplates]?.message || '');
    
    if (recipients) {
      setNotificationRecipients(recipients);
      setSendToAll(false);
    } else {
      setSendToAll(true);
      setNotificationRecipients(responses.filter(r => r.id !== award?.awardedResponseId).map(r => r.id));
    }
    
    setShowNotificationModal(true);
  };

  const handleSendNotification = () => {
    notificationRecipients.forEach(responseId => {
      const response = responses.find(r => r.id === responseId);
      if (response) {
        onSendNotification({
          rfpId,
          responseId,
          supplierId: response.supplierId,
          supplierName: response.supplierName,
          notificationType,
          subject: notificationSubject,
          message: notificationMessage,
          status: 'sent',
          sentAt: new Date().toISOString(),
          sentBy: 'current-user',
          sentByName: 'Current User',
          attachments: [],
        });
      }
    });
    setShowNotificationModal(false);
  };

  const handleAddNextStep = () => {
    onAddNextStep({
      title: nextStepTitle,
      description: nextStepDescription,
      dueDate: nextStepDueDate || undefined,
    });
    setShowNextStepModal(false);
    setNextStepTitle('');
    setNextStepDescription('');
    setNextStepDueDate('');
  };

  // Not yet awarded state
  if (!award) {
    return (
      <div className="space-y-6">
        {/* Award Prompt */}
        <Card className="border-brand-green bg-brand-green-light/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-brand-green/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-brand-green" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary">
                  Ready to Award Contract
                </h3>
                <p className="text-text-secondary mt-1">
                  Based on evaluation scores and interviews, select a supplier to award the contract.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Candidates */}
        <div>
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
            Top Candidates
          </h4>
          <div className="space-y-3">
            {rankings.slice(0, 3).map((ranking, index) => (
              <Card key={ranking.responseId} className="border-border bg-background">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center',
                      index === 0 ? 'bg-amber-100' : 'bg-surface'
                    )}>
                      {index === 0 ? (
                        <Trophy className="h-5 w-5 text-amber-600" />
                      ) : (
                        <span className="font-semibold text-text-secondary">{index + 1}</span>
                      )}
                    </div>
                    
                    <Avatar className="h-12 w-12 border-2 border-border">
                      <AvatarFallback className="bg-surface">
                        {getInitials(ranking.supplierName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h5 className="font-medium text-text-primary">
                        {ranking.supplierName}
                      </h5>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-text-muted">
                          <Star className="h-4 w-4" />
                          <span>{ranking.percentageScore}% score</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-text-muted">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatCurrency(ranking.priceTotal)}</span>
                        </div>
                        {ranking.interviewRating && (
                          <div className="flex items-center gap-1 text-sm text-text-muted">
                            <Users className="h-4 w-4" />
                            <span>{ranking.interviewRating}/5 interview</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        ranking.recommendation === 'highly_recommended' && 'bg-green-100 text-green-700 border-green-200',
                        ranking.recommendation === 'recommended' && 'bg-blue-100 text-blue-700 border-blue-200',
                        ranking.recommendation === 'neutral' && 'bg-gray-100 text-gray-700 border-gray-200'
                      )}
                    >
                      {ranking.recommendation.replace(/_/g, ' ')}
                    </Badge>

                    <Button
                      onClick={() => handleOpenAwardModal(ranking.responseId)}
                      className="bg-brand-green hover:bg-brand-green-mid text-white"
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

        {/* Award Confirmation Modal */}
        <Dialog open={showAwardModal} onOpenChange={setShowAwardModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-brand-green" />
                Confirm Award
              </DialogTitle>
              <DialogDescription>
                You are about to award the contract to the selected supplier.
              </DialogDescription>
            </DialogHeader>

            {selectedWinnerId && (
              <div className="py-4 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-surface rounded-lg">
                  <Avatar className="h-12 w-12 border-2 border-brand-green">
                    <AvatarFallback className="bg-brand-green-light text-brand-green">
                      {getInitials(rankings.find(r => r.responseId === selectedWinnerId)?.supplierName || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-text-primary">
                      {rankings.find(r => r.responseId === selectedWinnerId)?.supplierName}
                    </p>
                    <p className="text-sm text-text-muted">
                      Rank #{rankings.find(r => r.responseId === selectedWinnerId)?.rank} - {rankings.find(r => r.responseId === selectedWinnerId)?.percentageScore}% score
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Contract Value</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <Input
                      type="number"
                      value={contractValue}
                      onChange={(e) => setContractValue(e.target.value)}
                      className="pl-10 bg-background border-border"
                      placeholder="Enter contract value"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-800">This action cannot be undone</p>
                      <p className="text-amber-700 mt-1">
                        Once awarded, the supplier will be notified and other participants will be marked as unsuccessful.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAwardModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAward}
                className="bg-brand-green hover:bg-brand-green-mid text-white"
              >
                Confirm Award
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Awarded state
  return (
    <div className="space-y-6">
      {/* Award Banner */}
      <Card className="border-brand-green bg-gradient-to-r from-brand-green-light to-green-50 overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 opacity-10">
            <PartyPopper className="h-32 w-32 text-brand-green" />
          </div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="h-14 w-14 rounded-full bg-brand-green flex items-center justify-center">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <Badge className="bg-brand-green text-white mb-2">Contract Awarded</Badge>
              <h3 className="text-xl font-semibold text-text-primary">
                {awardedResponse?.supplierName}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">{formatCurrency(award.contractValue)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Awarded {new Date(award.awardedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                'text-sm',
                award.status === 'accepted' && 'bg-green-100 text-green-700 border-green-200',
                award.status === 'pending' && 'bg-amber-100 text-amber-700 border-amber-200',
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
        {/* Communication Section */}
        <Card className="border-border bg-background">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Communications
            </CardTitle>
            <CardDescription>
              Notify suppliers about the award decision
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Communication Actions */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3 border-border"
                onClick={() => handleOpenNotificationModal('award_notification', [award.awardedResponseId])}
                disabled={award.awardMessageSent}
              >
                <div className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center',
                  award.awardMessageSent ? 'bg-green-100' : 'bg-brand-green-light'
                )}>
                  {award.awardMessageSent ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Trophy className="h-4 w-4 text-brand-green" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-text-primary">
                    {award.awardMessageSent ? 'Award Notification Sent' : 'Send Award Notification'}
                  </p>
                  <p className="text-sm text-text-muted">
                    Notify the winning supplier
                  </p>
                </div>
                {!award.awardMessageSent && <ChevronRight className="h-5 w-5 text-text-muted" />}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3 border-border"
                onClick={() => handleOpenNotificationModal('rejection_notification')}
                disabled={award.rejectionMessagesSent}
              >
                <div className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center',
                  award.rejectionMessagesSent ? 'bg-green-100' : 'bg-gray-100'
                )}>
                  {award.rejectionMessagesSent ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <MessageSquare className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-text-primary">
                    {award.rejectionMessagesSent ? 'Rejection Notices Sent' : 'Send Rejection Notices'}
                  </p>
                  <p className="text-sm text-text-muted">
                    Notify unsuccessful suppliers
                  </p>
                </div>
                {!award.rejectionMessagesSent && <ChevronRight className="h-5 w-5 text-text-muted" />}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3 border-border"
                onClick={() => handleOpenNotificationModal('feedback_request')}
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-text-primary">Request Feedback</p>
                  <p className="text-sm text-text-muted">
                    Gather feedback from participants
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-text-muted" />
              </Button>
            </div>

            {/* Communication History */}
            {communications.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h5 className="text-sm font-semibold text-text-secondary mb-3">Recent Communications</h5>
                <div className="space-y-2">
                  {communications.slice(0, 3).map((comm) => (
                    <div key={comm.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors">
                      <div className="h-8 w-8 rounded-full bg-surface flex items-center justify-center">
                        <Mail className="h-4 w-4 text-text-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {comm.supplierName}
                        </p>
                        <p className="text-xs text-text-muted">
                          {comm.subject} - {comm.status}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs border-border">
                        {comm.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps Section */}
        <Card className="border-border bg-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Next Steps
                </CardTitle>
                <CardDescription>
                  Track post-award activities
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNextStepModal(true)}
                className="border-border"
              >
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
                    {step.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <span className="text-xs font-medium text-text-secondary">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-medium',
                      step.status === 'completed' ? 'text-green-800 line-through' : 'text-text-primary'
                    )}>
                      {step.title}
                    </p>
                    <p className="text-sm text-text-muted mt-0.5">{step.description}</p>
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
                <div className="text-center py-6 text-text-muted">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No next steps added yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Modal */}
      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>
              {notificationType === 'award_notification' && 'Notify the winning supplier about their selection.'}
              {notificationType === 'rejection_notification' && 'Notify unsuccessful suppliers about the decision.'}
              {notificationType === 'feedback_request' && 'Request feedback from participants.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="p-3 bg-surface rounded-lg border border-border">
                {sendToAll ? (
                  <p className="text-sm text-text-secondary">
                    All unsuccessful suppliers ({notificationRecipients.length})
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {notificationRecipients.map(id => {
                      const response = responses.find(r => r.id === id);
                      return response ? (
                        <Badge key={id} variant="outline" className="border-border">
                          {response.supplierName}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={notificationSubject}
                onChange={(e) => setNotificationSubject(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                className="min-h-[200px] bg-background border-border"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotificationModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendNotification}
              className="bg-brand-green hover:bg-brand-green-mid text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Next Step Modal */}
      <Dialog open={showNextStepModal} onOpenChange={setShowNextStepModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Next Step</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={nextStepTitle}
                onChange={(e) => setNextStepTitle(e.target.value)}
                placeholder="e.g., Schedule kickoff meeting"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={nextStepDescription}
                onChange={(e) => setNextStepDescription(e.target.value)}
                placeholder="Details about this step..."
                className="min-h-[80px] bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Due Date (optional)</Label>
              <Input
                type="date"
                value={nextStepDueDate}
                onChange={(e) => setNextStepDueDate(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNextStepModal(false)}>
              Cancel
            </Button>
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
