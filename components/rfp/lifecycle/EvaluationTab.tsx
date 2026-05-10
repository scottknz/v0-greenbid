'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  Save,
  Star,
  Trophy,
  Users,
  ChevronRight,
  ChevronDown,
  Scale,
  BarChart3,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  RFPResponse,
  EvaluationCriteria,
  ProposalEvaluation,
  ProposalScore,
  SupplierRanking,
  RFPInterview,
} from '@/types/rfp';
import { RESPONSE_STATUS_LABELS } from '@/types/rfp';

interface EvaluationTabProps {
  rfpId: string;
  responses: RFPResponse[];
  criteria: EvaluationCriteria[];
  evaluations: ProposalEvaluation[];
  rankings: SupplierRanking[];
  interviews: RFPInterview[];
  onSaveScore: (responseId: string, criteriaId: string, score: number, comment: string) => void;
  onFinalizeEvaluation: (responseId: string) => void;
  onUpdateRanking: (rankings: SupplierRanking[]) => void;
}

export function EvaluationTab({
  rfpId,
  responses,
  criteria,
  evaluations,
  rankings,
  interviews,
  onSaveScore,
  onFinalizeEvaluation,
  onUpdateRanking,
}: EvaluationTabProps) {
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(
    responses.find(r => r.status === 'shortlisted' || r.status === 'evaluated')?.id || null
  );
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(new Set());
  const [scoreDrafts, setScoreDrafts] = useState<Record<string, { score: number; comment: string }>>({});
  const [activeView, setActiveView] = useState<'evaluate' | 'compare'>('evaluate');
  const [compareSelection, setCompareSelection] = useState<string[]>([]);
  const [selectedCompareId, setSelectedCompareId] = useState<string | null>(null);

  const evaluatableResponses = responses.filter(
    r => r.status === 'shortlisted' || r.status === 'evaluated' || r.status === 'finalist'
  );

  const selectedResponse = responses.find(r => r.id === selectedResponseId);
  const selectedEvaluation = evaluations.find(e => e.responseId === selectedResponseId);
  const responseInterviews = interviews.filter(i => i.responseId === selectedResponseId);

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

  const toggleCriteria = (criteriaId: string) => {
    const newExpanded = new Set(expandedCriteria);
    if (newExpanded.has(criteriaId)) {
      newExpanded.delete(criteriaId);
    } else {
      newExpanded.add(criteriaId);
    }
    setExpandedCriteria(newExpanded);
  };

  const getScoreForCriteria = (criteriaId: string): ProposalScore | undefined => {
    return selectedEvaluation?.scores.find(s => s.criteriaId === criteriaId);
  };

  const getDraftScore = (criteriaId: string) => {
    const key = `${selectedResponseId}-${criteriaId}`;
    const existing = getScoreForCriteria(criteriaId);
    return scoreDrafts[key] || { score: existing?.score || 0, comment: existing?.comment || '' };
  };

  const updateDraftScore = (criteriaId: string, updates: Partial<{ score: number; comment: string }>) => {
    const key = `${selectedResponseId}-${criteriaId}`;
    setScoreDrafts(prev => ({
      ...prev,
      [key]: { ...getDraftScore(criteriaId), ...updates },
    }));
  };

  const handleSaveScore = (criteriaId: string) => {
    if (!selectedResponseId) return;
    const draft = getDraftScore(criteriaId);
    onSaveScore(selectedResponseId, criteriaId, draft.score, draft.comment);
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Calculate overall progress
  const totalCriteria = criteria.length;
  const scoredCriteria = selectedEvaluation?.scores.filter(s => s.isFinalized).length || 0;
  const evaluationProgress = (scoredCriteria / totalCriteria) * 100;

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={activeView === 'evaluate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('evaluate')}
            className={activeView === 'evaluate' ? 'bg-brand-green hover:bg-brand-green-mid text-white' : 'border-border'}
          >
            <Scale className="h-4 w-4 mr-2" />
            Evaluate
          </Button>
          <Button
            variant={activeView === 'compare' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('compare')}
            className={activeView === 'compare' ? 'bg-brand-green hover:bg-brand-green-mid text-white' : 'border-border'}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare & Rank
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Target className="h-4 w-4" />
          <span>{evaluatableResponses.length} suppliers to evaluate</span>
        </div>
      </div>

      {activeView === 'evaluate' ? (
        <div className="flex gap-6">
          {/* Supplier List */}
          <div className="w-72 shrink-0 space-y-2">
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
              Suppliers
            </h4>
            {evaluatableResponses.map((response) => {
              const evaluation = evaluations.find(e => e.responseId === response.id);
              const isSelected = response.id === selectedResponseId;
              
              return (
                <Card
                  key={response.id}
                  className={cn(
                    'cursor-pointer transition-all border-border bg-background',
                    isSelected && 'ring-2 ring-brand-green border-brand-green'
                  )}
                  onClick={() => setSelectedResponseId(response.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarFallback className="bg-surface text-sm">
                          {getInitials(response.supplierName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary truncate">
                          {response.supplierName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {evaluation?.status === 'finalized' ? (
                            <Badge variant="outline" className="text-xs bg-brand-green-light text-brand-green border-brand-green/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {evaluation.percentageScore}%
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                              <Clock className="h-3 w-3 mr-1" />
                              In Progress
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Evaluation Panel */}
          <div className="flex-1 space-y-6">
            {selectedResponse && (
              <>
                {/* Response Header */}
                <Card className="border-border bg-background">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-border">
                          <AvatarFallback className="text-lg bg-surface">
                            {getInitials(selectedResponse.supplierName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">
                            {selectedResponse.supplierName}
                          </h3>
                          <p className="text-sm text-text-muted">
                            Submitted {new Date(selectedResponse.submittedAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 text-sm">
                              <FileText className="h-4 w-4 text-text-muted" />
                              <span className="text-text-secondary">
                                {selectedResponse.attachments.length} documents
                              </span>
                            </div>
                            {responseInterviews.length > 0 && (
                              <div className="flex items-center gap-1 text-sm">
                                <Users className="h-4 w-4 text-text-muted" />
                                <span className="text-text-secondary">
                                  {responseInterviews.length} interview{responseInterviews.length !== 1 && 's'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text-muted">Total Price</p>
                        <p className="text-xl font-bold text-text-primary">
                          {formatCurrency(
                            selectedResponse.priceAnswers?.reduce((sum, p) => sum + p.value, 0) || 0
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text-secondary">
                          Evaluation Progress
                        </span>
                        <span className="text-sm text-text-muted">
                          {scoredCriteria} of {totalCriteria} criteria scored
                        </span>
                      </div>
                      <Progress value={evaluationProgress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Criteria Scoring */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                    Evaluation Criteria
                  </h4>
                  
                  {criteria.map((criterion) => {
                    const existingScore = getScoreForCriteria(criterion.id);
                    const draft = getDraftScore(criterion.id);
                    const isExpanded = expandedCriteria.has(criterion.id);

                    return (
                      <Card key={criterion.id} className="border-border bg-background">
                        <CardContent className="p-0">
                          {/* Criteria Header */}
                          <div
                            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-surface-hover transition-colors"
                            onClick={() => toggleCriteria(criterion.id)}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium text-text-primary">
                                  {criterion.name}
                                </h5>
                                <Badge variant="outline" className="text-xs border-border">
                                  {criterion.weight}% weight
                                </Badge>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <HelpCircle className="h-4 w-4 text-text-muted" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p className="text-sm">{criterion.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <p className="text-sm text-text-muted mt-1">
                                {criterion.description}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              {existingScore?.isFinalized && (
                                <div className="text-right">
                                  <span className={cn('text-2xl font-bold', getScoreColor(existingScore.score, criterion.maxScore))}>
                                    {existingScore.score}
                                  </span>
                                  <span className="text-text-muted">/{criterion.maxScore}</span>
                                </div>
                              )}
                              {isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-text-muted" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-text-muted" />
                              )}
                            </div>
                          </div>

                          {/* Expanded Scoring Panel */}
                          {isExpanded && (
                            <div className="p-4 pt-0 border-t border-border mt-0">
                              {/* Rubric */}
                              <div className="mb-4 p-3 bg-surface rounded-lg">
                                <p className="text-xs font-semibold text-text-secondary uppercase mb-2">
                                  Scoring Guide
                                </p>
                                <p className="text-sm text-text-muted whitespace-pre-line">
                                  {criterion.rubric}
                                </p>
                              </div>

                              {/* Score Slider */}
                              <div className="space-y-4">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-text-secondary">
                                      Score
                                    </span>
                                    <span className={cn('text-lg font-bold', getScoreColor(draft.score, criterion.maxScore))}>
                                      {draft.score}/{criterion.maxScore}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[draft.score]}
                                    onValueChange={([value]) => updateDraftScore(criterion.id, { score: value })}
                                    max={criterion.maxScore}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="flex justify-between mt-1 text-xs text-text-muted">
                                    <span>0</span>
                                    <span>{criterion.maxScore}</span>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-text-secondary mb-2 block">
                                    Comments
                                  </label>
                                  <Textarea
                                    value={draft.comment}
                                    onChange={(e) => updateDraftScore(criterion.id, { comment: e.target.value })}
                                    placeholder="Add your evaluation comments..."
                                    className="min-h-[80px] bg-background border-border"
                                  />
                                </div>

                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveScore(criterion.id)}
                                    className="bg-brand-green hover:bg-brand-green-mid text-white"
                                  >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Score
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Finalize Button */}
                {evaluationProgress === 100 && selectedEvaluation?.status !== 'finalized' && (
                  <Card className="border-brand-green bg-brand-green-light/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text-primary">
                            Evaluation Complete
                          </p>
                          <p className="text-sm text-text-muted">
                            All criteria have been scored. Finalize to lock in your evaluation.
                          </p>
                        </div>
                        <Button
                          onClick={() => onFinalizeEvaluation(selectedResponseId!)}
                          className="bg-brand-green hover:bg-brand-green-mid text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Finalize Evaluation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        /* Compare & Rank View */
        <div className="space-y-6">
          {/* Rankings Table */}
          <Card className="border-border bg-background">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg">Supplier Rankings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                      Supplier
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide">
                      Score
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wide">
                      Price
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide">
                      Interviews
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide">
                      Recommendation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rankings.map((ranking, index) => {
                    const isSelectedRow = selectedCompareId === ranking.responseId;
                    return (
                    <tr
                      key={ranking.responseId}
                      onClick={() => setSelectedCompareId(isSelectedRow ? null : ranking.responseId)}
                      className={cn(
                        'cursor-pointer transition-colors',
                        isSelectedRow
                          ? 'bg-brand-green-light ring-2 ring-inset ring-brand-green'
                          : 'hover:bg-surface-hover'
                      )}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {index === 0 ? (
                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <Trophy className="h-4 w-4 text-amber-600" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-surface flex items-center justify-center">
                              <span className="font-semibold text-text-secondary">{ranking.rank}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className={cn('h-9 w-9 border', isSelectedRow ? 'border-brand-green' : 'border-border')}>
                            <AvatarFallback className={cn('text-sm', isSelectedRow ? 'bg-brand-green-light text-brand-green' : 'bg-surface')}>
                              {getInitials(ranking.supplierName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium text-text-primary">
                              {ranking.supplierName}
                            </span>
                            {isSelectedRow && (
                              <p className="text-xs text-brand-green font-medium">Score breakdown shown below</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full', getProgressColor(ranking.percentageScore, 100))}
                              style={{ width: `${ranking.percentageScore}%` }}
                            />
                          </div>
                          <span className={cn('font-semibold', getScoreColor(ranking.percentageScore, 100))}>
                            {ranking.percentageScore}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-medium text-text-primary tabular-nums">
                          {formatCurrency(ranking.priceTotal)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-text-secondary">{ranking.interviewsCompleted}</span>
                          {ranking.interviewRating && (
                            <div className="flex items-center ml-2">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm text-text-secondary ml-1">
                                {ranking.interviewRating}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            ranking.recommendation === 'highly_recommended' && 'bg-green-100 text-green-700 border-green-200',
                            ranking.recommendation === 'recommended' && 'bg-blue-100 text-blue-700 border-blue-200',
                            ranking.recommendation === 'neutral' && 'bg-gray-100 text-gray-700 border-gray-200',
                            ranking.recommendation === 'not_recommended' && 'bg-red-100 text-red-700 border-red-200'
                          )}
                        >
                          {ranking.recommendation.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Criteria Breakdown — updates when a supplier row is selected above */}
          {(() => {
            const selectedRanking = selectedCompareId
              ? rankings.find(r => r.responseId === selectedCompareId)
              : null;
            const selectedBreakdownEval = selectedCompareId
              ? evaluations.find(e => e.responseId === selectedCompareId)
              : null;

            return (
              <Card className="border-border bg-background">
                <CardHeader className="border-b border-border pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Score Breakdown by Criteria</CardTitle>
                      {selectedRanking ? (
                        <p className="text-sm text-text-muted mt-0.5">
                          Showing scores for{' '}
                          <span className="font-semibold text-brand-green">
                            {selectedRanking.supplierName}
                          </span>
                          {' '}— click a different row above to switch, or click again to deselect.
                        </p>
                      ) : (
                        <p className="text-sm text-text-muted mt-0.5">
                          Click a supplier row above to see their detailed score breakdown.
                        </p>
                      )}
                    </div>
                    {selectedRanking && (
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-bold text-text-primary">
                          {selectedRanking.percentageScore}%
                        </p>
                        <p className="text-xs text-text-muted">Overall score</p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {!selectedRanking ? (
                    <div className="flex flex-col items-center justify-center py-14 gap-3">
                      <div className="h-12 w-12 rounded-full bg-surface flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-text-muted" />
                      </div>
                      <p className="text-sm font-medium text-text-secondary">No supplier selected</p>
                      <p className="text-xs text-text-muted">
                        Click a supplier in the rankings table above to view their score breakdown.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-surface">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                            Criteria
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide">
                            Weight
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide">
                            Score
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide">
                            Weighted
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                            Breakdown
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                            Comment
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {criteria.map((criterion) => {
                          const score = selectedBreakdownEval?.scores.find(
                            s => s.criteriaId === criterion.id
                          );
                          const rawScore = score?.score ?? null;
                          const weightedScore =
                            rawScore !== null
                              ? ((rawScore / criterion.maxScore) * criterion.weight).toFixed(1)
                              : null;
                          const barPct =
                            rawScore !== null ? (rawScore / criterion.maxScore) * 100 : 0;

                          return (
                            <tr key={criterion.id} className="hover:bg-surface-hover transition-colors">
                              <td className="px-4 py-3">
                                <p className="font-medium text-text-primary">{criterion.name}</p>
                                <p className="text-xs text-text-muted mt-0.5">{criterion.description}</p>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Badge variant="outline" className="text-xs border-border">
                                  {criterion.weight}%
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {rawScore !== null ? (
                                  <span className={cn('text-base font-bold', getScoreColor(rawScore, criterion.maxScore))}>
                                    {rawScore}
                                    <span className="text-xs font-normal text-text-muted">
                                      /{criterion.maxScore}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="text-text-muted text-sm">Not scored</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {weightedScore !== null ? (
                                  <span className="font-semibold text-text-primary">
                                    {weightedScore}
                                  </span>
                                ) : (
                                  <span className="text-text-muted">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 w-40">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                                    <div
                                      className={cn(
                                        'h-full rounded-full transition-all',
                                        getProgressColor(barPct, 100)
                                      )}
                                      style={{ width: `${barPct}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-text-muted w-8 text-right tabular-nums">
                                    {Math.round(barPct)}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 max-w-xs">
                                {score?.comment ? (
                                  <p className="text-sm text-text-secondary line-clamp-2">
                                    {score.comment}
                                  </p>
                                ) : (
                                  <span className="text-xs text-text-muted italic">No comment</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      {/* Footer totals */}
                      <tfoot>
                        <tr className="border-t-2 border-border bg-surface">
                          <td className="px-4 py-3 font-semibold text-text-primary">Total</td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className="text-xs border-border">100%</Badge>
                          </td>
                          <td className="px-4 py-3 text-center">—</td>
                          <td className="px-4 py-3 text-center">
                            <span className={cn('text-base font-bold', getScoreColor(selectedRanking.percentageScore, 100))}>
                              {selectedRanking.percentageScore}%
                            </span>
                          </td>
                          <td colSpan={2} className="px-4 py-3" />
                        </tr>
                      </tfoot>
                    </table>
                  )}
                </CardContent>
              </Card>
            );
          })()}

        </div>
      )}
    </div>
  );
}
