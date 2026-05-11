'use client';

import { useState } from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  MoreHorizontal,
  Eye,
  Star,
  FileText,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowUpDown,
  Download,
  Users,
  Calendar,
  Mail,
  Phone,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RFPResponse, ResponseStatus } from '@/types/rfp';
import { RESPONSE_STATUS_LABELS } from '@/types/rfp';

interface SubmissionsTabProps {
  rfpId: string;
  submissions: RFPResponse[];
  onShortlist: (submissionIds: string[]) => void;
  onRequestClarification: (submissionId: string) => void;
  onScheduleInterview: (submissionId: string) => void;
  onTriageSubmission?: (submissionId: string, action: 'consider' | 'reject' | 'follow_up') => void;
}

const statusConfig: Record<ResponseStatus, { color: string; icon: React.ElementType }> = {
  submitted: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FileText },
  clarifications_requested: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle },
  clarifications_provided: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
  withdrawn: { color: 'bg-gray-100 text-gray-500 border-gray-200', icon: XCircle },
  shortlisted: { color: 'bg-brand-green-light text-brand-green border-brand-green/20', icon: Star },
  evaluated: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: CheckCircle },
  finalist: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Star },
  awarded: { color: 'bg-brand-green-light text-brand-green border-brand-green/20', icon: CheckCircle },
  contract_agreed: { color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle },
  rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

export function SubmissionsTab({
  rfpId,
  submissions,
  onShortlist,
  onRequestClarification,
  onScheduleInterview,
  onTriageSubmission,
}: SubmissionsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<ResponseStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'score'>('date');
  
  // Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<RFPResponse | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'questionnaire' | 'documents' | 'scores'>('overview');
  const [submissionStatuses, setSubmissionStatuses] = useState<Record<string, string>>({});

  const getSubmissionStatus = (submission: RFPResponse) =>
    submissionStatuses[submission.id] ?? submission.status;

  const handleSubmissionStatusChange = (submissionId: string, newStatus: string) => {
    setSubmissionStatuses(prev => ({ ...prev, [submissionId]: newStatus }));
  };

  const handleViewDetails = (submission: RFPResponse) => {
    setSelectedSubmission(submission);
    setModalTab('overview');
    setDetailModalOpen(true);
  };

  const filteredSubmissions = submissions
    .filter(s => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return s.supplierName.toLowerCase().includes(query);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
      if (sortBy === 'price') {
        const priceA = a.priceAnswers?.[0]?.value || 0;
        const priceB = b.priceAnswers?.[0]?.value || 0;
        return priceA - priceB;
      }
      if (sortBy === 'score') {
        return (b.totalScore || 0) - (a.totalScore || 0);
      }
      return 0;
    });

  const handleSelectAll = () => {
    if (selectedSubmissions.size === filteredSubmissions.length) {
      setSelectedSubmissions(new Set());
    } else {
      setSelectedSubmissions(new Set(filteredSubmissions.map(s => s.id)));
    }
  };

  const handleSelectSubmission = (id: string) => {
    const newSelected = new Set(selectedSubmissions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSubmissions(newSelected);
  };

  const handleBulkShortlist = () => {
    onShortlist(Array.from(selectedSubmissions));
    setSelectedSubmissions(new Set());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Stats
  const stats = {
    total: submissions.length,
    shortlisted: submissions.filter(s => s.status === 'shortlisted' || s.status === 'finalist').length,
    evaluated: submissions.filter(s => s.evaluationStatus === 'complete').length,
    pending: submissions.filter(s => s.status === 'submitted' || s.status === 'clarifications_provided').length,
  };

  // Filter pills config — mirrors the old summary cards
  const filterPills = [
    { key: 'all',         label: 'All',            count: stats.total },
    { key: 'shortlisted', label: 'Shortlisted',     count: stats.shortlisted },
    { key: 'evaluated',   label: 'Evaluated',       count: stats.evaluated },
    { key: 'pending',     label: 'Pending Review',  count: stats.pending },
  ] as const;

  // Map pill keys to the statusFilter values used by the existing filter logic
  const pillToFilter: Record<string, ResponseStatus | 'all'> = {
    all:         'all',
    shortlisted: 'shortlisted',
    evaluated:   'all',   // evaluated spans multiple statuses — handled below
    pending:     'submitted',
  };

  const [activePill, setActivePill] = useState<'all' | 'shortlisted' | 'evaluated' | 'pending'>('all');

  const handlePillClick = (pill: typeof activePill) => {
    setActivePill(pill);
    if (pill === 'evaluated') {
      setStatusFilter('all');
    } else {
      setStatusFilter(pillToFilter[pill] as ResponseStatus | 'all');
    }
  };

  // Extra filter for 'evaluated' pill
  const pillFilteredSubmissions = activePill === 'evaluated'
    ? submissions.filter(s => s.evaluationStatus === 'complete')
    : submissions;

  return (
    <div className="space-y-4">
      {/* Filter Pills + Search Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterPills.map(pill => (
            <button
              key={pill.key}
              onClick={() => handlePillClick(pill.key as typeof activePill)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors border',
                activePill === pill.key
                  ? 'bg-brand-green text-white border-brand-green'
                  : 'bg-background text-text-secondary border-border hover:border-brand-green hover:text-brand-green'
              )}
            >
              {pill.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs font-semibold',
                  activePill === pill.key
                    ? 'bg-white/20 text-white'
                    : 'bg-surface text-text-muted'
                )}
              >
                {pill.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Sort (right side) */}
        <div className="flex items-center gap-3 flex-1 sm:flex-none justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-border">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                By Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('price')}>
                By Price (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('score')}>
                By Score (High to Low)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedSubmissions.size > 0 && (
            <>
              <span className="text-sm text-text-secondary">
                {selectedSubmissions.size} selected
              </span>
              <Button
                size="sm"
                onClick={handleBulkShortlist}
                className="bg-brand-green hover:bg-brand-green-mid text-white gap-2"
              >
                <Star className="h-4 w-4" />
                Shortlist
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" className="gap-2 border-border">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="border border-border rounded-lg overflow-hidden bg-background">
        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-3 bg-surface border-b border-border">
          <div className="w-8">
            <Checkbox
              checked={selectedSubmissions.size === filteredSubmissions.length && filteredSubmissions.length > 0}
              onCheckedChange={handleSelectAll}
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Supplier Name
            </span>
          </div>
          <div className="w-32 text-center">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Status
            </span>
          </div>
          <div className="w-32 text-right">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Price
            </span>
          </div>
          <div className="w-24 text-center">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Score
            </span>
          </div>
          <div className="w-36">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Submitted
            </span>
          </div>
          <div className="w-48 text-center">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Quick Action
            </span>
          </div>
          <div className="w-10 text-center">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Details
            </span>
          </div>
        </div>

        {/* Submissions */}
        <div className="divide-y divide-border">
          {filteredSubmissions.map((submission) => {
            const StatusIcon = statusConfig[submission.status]?.icon || FileText;
            const totalPrice = submission.priceAnswers?.reduce((sum, p) => sum + p.value, 0) || 0;

            return (
              <div
                key={submission.id}
                className={cn(
                  'flex items-center gap-4 px-4 py-4 hover:bg-surface-hover transition-colors cursor-pointer',
                  selectedSubmissions.has(submission.id) && 'bg-brand-green-light/30'
                )}
                onClick={() => handleViewDetails(submission)}
              >
                <div className="w-8" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedSubmissions.has(submission.id)}
                    onCheckedChange={() => handleSelectSubmission(submission.id)}
                  />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="bg-surface text-text-primary text-sm font-medium">
                      {getInitials(submission.supplierName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary truncate">
                      {submission.supplierName}
                    </p>
                    <p className="text-sm text-text-muted truncate">
                      {submission.attachments.length} attachment{submission.attachments.length !== 1 && 's'}
                    </p>
                  </div>
                </div>
                <div className="w-32 text-center">
                  <Badge
                    variant="outline"
                    className={cn('gap-1', statusConfig[submission.status]?.color)}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {RESPONSE_STATUS_LABELS[submission.status]}
                  </Badge>
                </div>
                <div className="w-32 text-right">
                  <p className="font-medium text-text-primary tabular-nums">
                    {formatCurrency(totalPrice)}
                  </p>
                </div>
                <div className="w-24 text-center">
                  {submission.totalScore !== undefined ? (
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-semibold text-text-primary">
                        {submission.totalScore}
                      </span>
                      <span className="text-text-muted">/100</span>
                    </div>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </div>
                <div className="w-36">
                  <p className="text-sm text-text-secondary">
                    {formatDate(submission.submittedAt)}
                  </p>
                </div>
                {/* Quick Action triage buttons */}
                <div className="w-48 flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => onTriageSubmission?.(submission.id, 'consider')}
                    title="Move to consideration"
                  >
                    Consider
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                    onClick={() => onTriageSubmission?.(submission.id, 'follow_up')}
                    title="Follow up with supplier"
                  >
                    Follow Up
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => onTriageSubmission?.(submission.id, 'reject')}
                    title="Reject submission"
                  >
                    Reject
                  </Button>
                </div>

                {/* Details three-dots menu */}
                <div className="w-10 flex justify-center" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(submission)}>
                        <Eye className="size-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onScheduleInterview(submission.id)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Interview
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onShortlist([submission.id])}>
                        <Star className="h-4 w-4 mr-2" />
                        Add to Shortlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="h-12 w-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No submissions found</p>
            <p className="text-sm text-text-muted mt-1">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Submissions will appear here once suppliers submit'}
            </p>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent 
          className="flex flex-col p-0 gap-0"
          style={{ width: '1000px', maxWidth: '95vw', maxHeight: '85vh' }}
        >
          {selectedSubmission && (
            <>
              <DialogHeader className="px-6 pt-5 pb-4 border-b border-border pr-14">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-xl leading-snug">{selectedSubmission.supplierName}</DialogTitle>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <DialogDescription className="text-sm">
                        Submitted {new Date(selectedSubmission.submittedAt).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                      </DialogDescription>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          statusConfig[getSubmissionStatus(selectedSubmission) as ResponseStatus]?.color
                        )}
                      >
                        {RESPONSE_STATUS_LABELS[getSubmissionStatus(selectedSubmission) as ResponseStatus]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Tabs */}
              <div className="border-b border-border px-6">
                <div className="flex gap-8">
                  {(['overview', 'questionnaire', 'documents', 'scores'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setModalTab(tab)}
                      className={cn(
                        'py-3 px-1 text-sm font-medium border-b-2 transition-colors',
                        modalTab === tab
                          ? 'border-brand-green text-brand-green'
                          : 'border-transparent text-text-secondary hover:text-text-primary'
                      )}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* Overview Tab */}
                {modalTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Contact Information</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-text-muted">Name</p>
                            <p className="font-medium text-text-primary">{selectedSubmission.contactName || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-text-muted">Email</p>
                            <p className="font-medium text-text-primary">{selectedSubmission.contactEmail || 'Not provided'}</p>
                          </div>
                          {selectedSubmission.contactPhone && (
                            <div>
                              <p className="text-xs text-text-muted">Phone</p>
                              <p className="font-medium text-text-primary">{selectedSubmission.contactPhone}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Proposal Details</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-text-muted">Proposed Value</p>
                            <p className="font-medium text-text-primary">
                              ${(selectedSubmission.priceItems?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0).toLocaleString()}
                            </p>
                          </div>
                          {selectedSubmission.totalScore !== undefined && (
                            <div>
                              <p className="text-xs text-text-muted">Overall Score</p>
                              <p className="font-medium text-text-primary">{selectedSubmission.totalScore}/100</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-text-muted">Attachments</p>
                            <p className="font-medium text-text-primary">{selectedSubmission.attachments?.length || 0} files</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Questionnaire Tab */}
                {modalTab === 'questionnaire' && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <p className="text-sm text-text-muted mb-4">Responses to evaluation questions:</p>
                    </div>
                    {selectedSubmission.questionResponses && selectedSubmission.questionResponses.length > 0 ? (
                      selectedSubmission.questionResponses.map((qr, idx) => (
                        <div key={idx} className="border border-border rounded-lg p-4">
                          <p className="text-sm font-semibold text-text-primary mb-2">
                            Q{idx + 1}: {qr.questionId || `Question ${idx + 1}`}
                          </p>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {qr.answer}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-text-muted text-center py-8">No questionnaire responses submitted</p>
                    )}
                  </div>
                )}

                {/* Documents Tab */}
                {modalTab === 'documents' && (
                  <div className="space-y-3">
                    {selectedSubmission.attachments && selectedSubmission.attachments.length > 0 ? (
                      selectedSubmission.attachments.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-surface rounded border border-border hover:bg-surface-hover transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-text-muted" />
                            <div>
                              <p className="text-sm font-medium text-text-primary">{doc.fileName}</p>
                              <p className="text-xs text-text-muted">{doc.fileSize ? `${Math.round(doc.fileSize / 1024)} KB` : 'Unknown size'}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-text-muted text-center py-8">No documents submitted</p>
                    )}
                  </div>
                )}

                {/* Scores Tab */}
                {modalTab === 'scores' && (
                  <div className="space-y-4">
                    {selectedSubmission.totalScore !== undefined ? (
                      <>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-text-primary">Overall Score</p>
                            <p className="text-sm font-semibold text-brand-green">{selectedSubmission.totalScore}/100</p>
                          </div>
                          <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-brand-green h-full transition-all"
                              style={{ width: `${selectedSubmission.totalScore}%` }}
                            />
                          </div>
                        </div>
                        {selectedSubmission.priceItems && selectedSubmission.priceItems.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-border">
                            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Price Breakdown</h4>
                            <div className="border border-border rounded-lg overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-surface">
                                  <tr className="border-b border-border">
                                    <th className="px-4 py-2 text-left font-medium text-text-secondary">Item</th>
                                    <th className="px-4 py-2 text-right font-medium text-text-secondary">Qty</th>
                                    <th className="px-4 py-2 text-right font-medium text-text-secondary">Unit Price</th>
                                    <th className="px-4 py-2 text-right font-medium text-text-secondary">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                  {selectedSubmission.priceItems.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-surface-hover">
                                      <td className="px-4 py-2 text-text-primary">{item.description || `Item ${idx + 1}`}</td>
                                      <td className="px-4 py-2 text-right text-text-secondary">{item.quantity || 1}</td>
                                      <td className="px-4 py-2 text-right text-text-secondary">${(item.unitPrice || 0).toLocaleString()}</td>
                                      <td className="px-4 py-2 text-right font-medium text-text-primary">${(item.totalPrice || 0).toLocaleString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-text-muted text-center py-8">No scores available</p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border bg-surface space-y-3">
                {/* Status actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-text-muted mr-1">Change status:</span>
                  {(
                    [
                      { status: 'under_review', label: 'Under Review', className: 'border-amber-300 text-amber-700 hover:bg-amber-50' },
                      { status: 'shortlisted',  label: 'Shortlist',     className: 'border-brand-green text-brand-green hover:bg-brand-green/10' },
                      { status: 'evaluated',    label: 'Evaluated',     className: 'border-emerald-400 text-emerald-700 hover:bg-emerald-50' },
                      { status: 'rejected',     label: 'Reject',        className: 'border-red-300 text-red-600 hover:bg-red-50' },
                      { status: 'awarded',      label: 'Award',         className: 'border-brand-green text-brand-green hover:bg-brand-green/10' },
                    ] as const
                  ).map(({ status, label, className }) => {
                    const isCurrent = getSubmissionStatus(selectedSubmission) === status
                    return (
                      <Button
                        key={status}
                        variant="outline"
                        size="sm"
                        disabled={isCurrent}
                        className={cn('h-7 px-3 text-xs transition-colors', isCurrent ? 'opacity-40 cursor-not-allowed' : className)}
                        onClick={() => handleSubmissionStatusChange(selectedSubmission.id, status)}
                      >
                        {label}
                      </Button>
                    )
                  })}
                </div>
                {/* Secondary actions */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setDetailModalOpen(false)}
                  >
                    Close
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => onScheduleInterview(selectedSubmission.id)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Interview
                    </Button>
                    <Button
                      className="bg-brand-green hover:bg-brand-green-dark text-white"
                      onClick={() => {
                        onShortlist([selectedSubmission.id]);
                        setDetailModalOpen(false);
                      }}
                    >
                      Add to Shortlist
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
