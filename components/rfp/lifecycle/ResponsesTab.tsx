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
  Search,
  MoreHorizontal,
  Eye,
  Star,
  MessageSquare,
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RFPResponse, ResponseStatus } from '@/types/rfp';
import { RESPONSE_STATUS_LABELS } from '@/types/rfp';

interface ResponsesTabProps {
  rfpId: string;
  responses: RFPResponse[];
  onViewResponse: (response: RFPResponse) => void;
  onShortlist: (responseIds: string[]) => void;
  onRequestClarification: (responseId: string) => void;
  onScheduleInterview: (responseId: string) => void;
  onTriageResponse?: (responseId: string, action: 'consider' | 'reject' | 'follow_up') => void;
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
  rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

export function ResponsesTab({
  rfpId,
  responses,
  onViewResponse,
  onShortlist,
  onRequestClarification,
  onScheduleInterview,
  onTriageResponse,
}: ResponsesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResponses, setSelectedResponses] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<ResponseStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'score'>('date');

  const filteredResponses = responses
    .filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return r.supplierName.toLowerCase().includes(query);
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
    if (selectedResponses.size === filteredResponses.length) {
      setSelectedResponses(new Set());
    } else {
      setSelectedResponses(new Set(filteredResponses.map(r => r.id)));
    }
  };

  const handleSelectResponse = (id: string) => {
    const newSelected = new Set(selectedResponses);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedResponses(newSelected);
  };

  const handleBulkShortlist = () => {
    onShortlist(Array.from(selectedResponses));
    setSelectedResponses(new Set());
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
    total: responses.length,
    shortlisted: responses.filter(r => r.status === 'shortlisted' || r.status === 'finalist').length,
    evaluated: responses.filter(r => r.evaluationStatus === 'complete').length,
    pending: responses.filter(r => r.status === 'submitted' || r.status === 'clarifications_provided').length,
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
  const pillFilteredResponses = activePill === 'evaluated'
    ? responses.filter(r => r.evaluationStatus === 'complete')
    : responses;

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
          {selectedResponses.size > 0 && (
            <>
              <span className="text-sm text-text-secondary">
                {selectedResponses.size} selected
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

      {/* Responses List */}
      <div className="border border-border rounded-lg overflow-hidden bg-background">
        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-3 bg-surface border-b border-border">
          <div className="w-8">
            <Checkbox
              checked={selectedResponses.size === filteredResponses.length && filteredResponses.length > 0}
              onCheckedChange={handleSelectAll}
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Supplier
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
          <div className="w-10" />
        </div>

        {/* Responses */}
        <div className="divide-y divide-border">
          {filteredResponses.map((response) => {
            const StatusIcon = statusConfig[response.status]?.icon || FileText;
            const totalPrice = response.priceAnswers?.reduce((sum, p) => sum + p.value, 0) || 0;

            return (
              <div
                key={response.id}
                className={cn(
                  'flex items-center gap-4 px-4 py-4 hover:bg-surface-hover transition-colors cursor-pointer',
                  selectedResponses.has(response.id) && 'bg-brand-green-light/30'
                )}
                onClick={() => onViewResponse(response)}
              >
                <div className="w-8" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedResponses.has(response.id)}
                    onCheckedChange={() => handleSelectResponse(response.id)}
                  />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="bg-surface text-text-primary text-sm font-medium">
                      {getInitials(response.supplierName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary truncate">
                      {response.supplierName}
                    </p>
                    <p className="text-sm text-text-muted truncate">
                      {response.attachments.length} attachment{response.attachments.length !== 1 && 's'}
                    </p>
                  </div>
                </div>
                <div className="w-32 text-center">
                  <Badge
                    variant="outline"
                    className={cn('gap-1', statusConfig[response.status]?.color)}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {RESPONSE_STATUS_LABELS[response.status]}
                  </Badge>
                </div>
                <div className="w-32 text-right">
                  <p className="font-medium text-text-primary tabular-nums">
                    {formatCurrency(totalPrice)}
                  </p>
                </div>
                <div className="w-24 text-center">
                  {response.totalScore !== undefined ? (
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-semibold text-text-primary">
                        {response.totalScore}
                      </span>
                      <span className="text-text-muted">/100</span>
                    </div>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </div>
                <div className="w-36">
                  <p className="text-sm text-text-secondary">
                    {formatDate(response.submittedAt)}
                  </p>
                </div>
                <div className="w-10" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewResponse(response)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onScheduleInterview(response.id)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Interview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRequestClarification(response.id)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Request Clarification
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onShortlist([response.id])}>
                        <Star className="h-4 w-4 mr-2" />
                        Add to Shortlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Triage Quick Actions */}
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => onTriageResponse?.(response.id, 'consider')}
                    title="Move to consideration"
                  >
                    Consider
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                    onClick={() => onTriageResponse?.(response.id, 'follow_up')}
                    title="Follow up with supplier"
                  >
                    Follow Up
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => onTriageResponse?.(response.id, 'reject')}
                    title="Reject response"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredResponses.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="h-12 w-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No responses found</p>
            <p className="text-sm text-text-muted mt-1">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Responses will appear here once suppliers submit'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
