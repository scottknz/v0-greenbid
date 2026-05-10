'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Filter,
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-background">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                <p className="text-sm text-text-muted">Total Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-background">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-brand-green-light flex items-center justify-center">
                <Star className="h-5 w-5 text-brand-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stats.shortlisted}</p>
                <p className="text-sm text-text-muted">Shortlisted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-background">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stats.evaluated}</p>
                <p className="text-sm text-text-muted">Evaluated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-background">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stats.pending}</p>
                <p className="text-sm text-text-muted">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-4 rounded-lg border border-border">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
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
                <Filter className="h-4 w-4" />
                {statusFilter === 'all' ? 'All Status' : RESPONSE_STATUS_LABELS[statusFilter]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {Object.entries(RESPONSE_STATUS_LABELS).map(([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setStatusFilter(key as ResponseStatus)}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-border">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
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
        </div>
        <div className="flex items-center gap-2">
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
                Shortlist Selected
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
