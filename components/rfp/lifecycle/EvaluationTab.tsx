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
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [scoreDrafts, setScoreDrafts] = useState<Record<string, { score: number; comment: string }>>({});
  const [activeView, setActiveView] = useState<'evaluate' | 'compare'>('evaluate');
  const [compareSelection, setCompareSelection] = useState<string[]>([]);
  const [selectedCompareId, setSelectedCompareId] = useState<string | null>(null);
  const [supplierHeaderExpanded, setSupplierHeaderExpanded] = useState(false);

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
    if (newExpanded.has(criteriaId)) newExpanded.delete(criteriaId);
    else newExpanded.add(criteriaId);
    setExpandedCriteria(newExpanded);
  };

  const toggleComment = (criteriaId: string) => {
    const next = new Set(expandedComments);
    if (next.has(criteriaId)) next.delete(criteriaId);
    else next.add(criteriaId);
    setExpandedComments(next);
  };

  // Weighted overall score for a given response (0–100)
  const getWeightedScore = (responseId: string): number | null => {
    const evaluation = evaluations.find(e => e.responseId === responseId);
    if (!evaluation || evaluation.scores.length === 0) return null;
    let totalWeight = 0;
    let weightedSum = 0;
    criteria.forEach(c => {
      const score = evaluation.scores.find(s => s.criteriaId === c.id && s.isFinalized);
      if (score) {
        weightedSum += (score.score / score.maxScore) * c.weight;
        totalWeight += c.weight;
      }
    });
    if (totalWeight === 0) return null;
    return Math.round((weightedSum / totalWeight) * 100);
  };

  const handleSelectSupplier = (responseId: string) => {
    setSelectedResponseId(responseId);
    setSupplierHeaderExpanded(false);
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
        <div className="space-y-4">
          {/* Expandable Supplier Header */}
          <div className={cn('border border-border rounded-lg bg-background overflow-hidden transition-all')}>
            {/* Collapsed header — shows selected supplier as main heading */}
            <button
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors"
              onClick={() => setSupplierHeaderExpanded(v => !v)}
            >
              <div className="flex items-center gap-3 min-w-0">
                {selectedResponse ? (
                  <>
                    <Avatar className="h-9 w-9 border border-border shrink-0">
                      <AvatarFallback className="bg-surface text-sm font-semibold">
                        {getInitials(selectedResponse.supplierName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-text-primary leading-tight">{selectedResponse.supplierName}</p>
                      <p className="text-xs text-text-muted">
                        Submitted {new Date(selectedResponse.submittedAt).toLocaleDateString()}
                        {' · '}{selectedResponse.attachments.length} docs
                        {' · '}{scoredCriteria}/{totalCriteria} criteria scored
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="font-semibold text-text-secondary">Select a supplier to evaluate</p>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                {selectedResponse && (() => {
                  const ws = getWeightedScore(selectedResponseId!);
                  return ws !== null ? (
                    <span className={cn('text-sm font-bold', getScoreColor(ws, 100))}>
                      {ws}% overall
                    </span>
                  ) : null;
                })()}
                <div className="flex items-center gap-1.5 text-sm text-text-muted">
                  <span>{evaluatableResponses.length} supplier{evaluatableResponses.length !== 1 ? 's' : ''}</span>
                  {supplierHeaderExpanded
                    ? <ChevronDown className="h-4 w-4" />
                    : <ChevronRight className="h-4 w-4" />}
                </div>
              </div>
            </button>

            {/* Expanded list — all suppliers scrollable */}
            {supplierHeaderExpanded && (
              <div className="border-t border-border max-h-64 overflow-y-auto">
                {evaluatableResponses.map((response) => {
                  const evaluation = evaluations.find(e => e.responseId === response.id);
                  const evalScoredCount = evaluation?.scores.filter(s => s.isFinalized).length || 0;
                  const isComplete = evalScoredCount === criteria.length;
                  const isSelected = response.id === selectedResponseId;
                  const ws = getWeightedScore(response.id);

                  return (
                    <button
                      key={response.id}
                      onClick={() => handleSelectSupplier(response.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 transition-colors text-left border-b border-border last:border-0',
                        isSelected
                          ? 'bg-brand-green-light'
                          : 'hover:bg-surface-hover'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-8 w-8 border border-border shrink-0">
                          <AvatarFallback className={cn('text-xs font-semibold', isSelected ? 'bg-brand-green text-white' : 'bg-surface')}>
                            {getInitials(response.supplierName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className={cn('font-medium text-sm leading-tight', isSelected ? 'text-brand-green' : 'text-text-primary')}>
                            {response.supplierName}
                          </p>
                          <p className="text-xs text-text-muted">
                            {evalScoredCount}/{criteria.length} scored
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        {ws !== null && (
                          <span className={cn('text-sm font-bold', getScoreColor(ws, 100))}>
                            {ws}%
                          </span>
                        )}
                        {isComplete ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-green rounded-full transition-all"
                              style={{ width: `${(evalScoredCount / criteria.length) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedResponse && (
            <>

              {/* Table-Based Scoring Form */}
              <Card className="border-border bg-background">
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-surface">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide w-[200px]">
                          Criteria
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide w-[80px]">
                          Weight
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide w-[200px]">
                          Score
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                          Comment
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide w-[80px]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {criteria.map((criterion) => {
                        const existingScore = getScoreForCriteria(criterion.id);
                        const draft = getDraftScore(criterion.id);
                        const isSaved = existingScore?.isFinalized;
                        const isCommentExpanded = expandedComments.has(criterion.id);

                        return (
                          <tr key={criterion.id} className="hover:bg-surface-hover transition-colors align-top">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-text-primary">{criterion.name}</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-3.5 w-3.5 text-text-muted cursor-help shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right" align="center" className="max-w-xs">
                                      <p className="text-sm font-medium mb-1">{criterion.description}</p>
                                      <p className="text-xs text-text-muted whitespace-pre-line">{criterion.rubric}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Badge variant="outline" className="text-xs border-border">
                                {criterion.weight}%
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Slider
                                  value={[draft.score]}
                                  onValueChange={([value]) => updateDraftScore(criterion.id, { score: value })}
                                  max={criterion.maxScore}
                                  step={1}
                                  className="flex-1"
                                />
                                <span className={cn('w-12 text-center font-bold text-sm shrink-0', getScoreColor(draft.score, criterion.maxScore))}>
                                  {draft.score}/{criterion.maxScore}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <button
                                  type="button"
                                  onClick={() => toggleComment(criterion.id)}
                                  className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
                                >
                                  {isCommentExpanded
                                    ? <ChevronDown className="h-3.5 w-3.5" />
                                    : <ChevronRight className="h-3.5 w-3.5" />}
                                  {draft.comment
                                    ? <span className="truncate max-w-[200px] text-text-secondary">{draft.comment}</span>
                                    : <span className="text-text-muted italic">Add comment...</span>}
                                </button>
                                {isCommentExpanded && (
                                  <Textarea
                                    value={draft.comment}
                                    onChange={(e) => updateDraftScore(criterion.id, { comment: e.target.value })}
                                    onBlur={() => handleSaveScore(criterion.id)}
                                    placeholder="Add your evaluation notes..."
                                    className="mt-1 min-h-[80px] text-sm bg-background border-border resize-none focus:ring-brand-green/30"
                                    autoFocus
                                  />
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {isSaved ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSaveScore(criterion.id)}
                                  className="h-7 px-2 text-xs"
                                >
                                  <Save className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* Finalize Button */}
              {evaluationProgress === 100 && selectedEvaluation?.status !== 'finalized' && (
                <div className="flex items-center justify-between p-4 bg-brand-green-light/30 border border-brand-green rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">Evaluation Complete</p>
                    <p className="text-sm text-text-muted">All criteria scored. Finalize to lock in your evaluation.</p>
                  </div>
                  <Button
                    onClick={() => onFinalizeEvaluation(selectedResponseId!)}
                    className="bg-brand-green hover:bg-brand-green-mid text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalize Evaluation
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* Compare & Rank View */
        <div className="space-y-6">
          {/* Enhanced Evaluation Matrix with Rank, Criteria, Price, Recommendation */}
          <Card className="border-border bg-background">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg">Supplier Comparison Matrix</CardTitle>
              <p className="text-sm text-text-muted mt-1">Click a supplier row to view detailed score breakdown below</p>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="sticky left-0 z-10 px-3 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide bg-surface w-[60px]">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide min-w-[160px]">
                      Supplier
                    </th>
                    {criteria.map((criterion) => (
                      <th
                        key={criterion.id}
                        className="px-3 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide whitespace-nowrap"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex flex-col items-center gap-0.5">
                              <span className="line-clamp-1 text-xs">{criterion.name}</span>
                              <span className="text-xs font-normal opacity-70">{criterion.weight}%</span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm font-medium">{criterion.name}</p>
                              <p className="text-xs text-text-muted mt-1">{criterion.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide">
                      Overall
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wide">
                      Price
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rankings.map((ranking, index) => {
                    const response = evaluatableResponses.find(r => r.id === ranking.responseId);
                    const evaluation = evaluations.find(e => e.responseId === ranking.responseId);
                    const isSelectedRow = selectedCompareId === ranking.responseId;

                    // Find best score for each criterion to highlight
                    const getBestScore = (criteriaId: string) => {
                      let best = 0;
                      evaluations.forEach(eval_ => {
                        const s = eval_.scores.find(sc => sc.criteriaId === criteriaId);
                        if (s && s.score > best) best = s.score;
                      });
                      return best;
                    };

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
                        <td className="sticky left-0 z-10 px-3 py-3 text-center bg-inherit">
                          {index === 0 ? (
                            <div className="h-7 w-7 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
                              <Trophy className="h-3.5 w-3.5 text-amber-600" />
                            </div>
                          ) : (
                            <span className="font-semibold text-text-secondary">{ranking.rank}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-text-primary">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 border border-border">
                              <AvatarFallback className="text-xs bg-surface">
                                {getInitials(ranking.supplierName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate">{ranking.supplierName}</span>
                          </div>
                        </td>
                        {criteria.map((criterion) => {
                          const score = evaluation?.scores.find(s => s.criteriaId === criterion.id);
                          const rawScore = score?.score ?? null;
                          const bestScore = getBestScore(criterion.id);
                          const isBest = rawScore !== null && rawScore === bestScore && bestScore > 0;

                          return (
                            <td
                              key={`${ranking.responseId}-${criterion.id}`}
                              className={cn(
                                'px-3 py-3 text-center text-sm font-medium whitespace-nowrap',
                                isBest && 'bg-green-50'
                              )}
                            >
                              {rawScore !== null ? (
                                <span className={cn('font-bold', isBest ? 'text-green-600' : getScoreColor(rawScore, criterion.maxScore))}>
                                  {rawScore}
                                  <span className="text-xs font-normal text-text-muted">/{criterion.maxScore}</span>
                                </span>
                              ) : (
                                <span className="text-text-muted text-xs">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={cn('h-full rounded-full', getProgressColor(ranking.percentageScore, 100))}
                                style={{ width: `${ranking.percentageScore}%` }}
                              />
                            </div>
                            <span className={cn('font-bold text-sm', getScoreColor(ranking.percentageScore, 100))}>
                              {ranking.percentageScore}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-medium text-text-primary tabular-nums text-sm">
                            {formatCurrency(ranking.priceTotal)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
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
