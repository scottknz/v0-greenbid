'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  DollarSign,
  Lock,
  Type,
  Hash,
  Calendar,
} from 'lucide-react';
import type { SubmissionQuestionsConfig, SubmissionQuestion, PriceLineItem, SubmissionFieldType } from '@/types/rfp';
import { cn } from '@/lib/utils';

interface SubmissionQuestionsStepProps {
  config: SubmissionQuestionsConfig;
  onUpdateConfig: (config: SubmissionQuestionsConfig) => void;
  onBack: () => void;
  onComplete: (config: SubmissionQuestionsConfig) => void;
}

const fieldTypeIcons: Record<SubmissionFieldType, React.ReactNode> = {
  text: <Type className="h-3.5 w-3.5" />,
  number: <Hash className="h-3.5 w-3.5" />,
  date: <Calendar className="h-3.5 w-3.5" />,
};

const fieldTypeLabels: Record<SubmissionFieldType, string> = {
  text: 'Text',
  number: 'Number',
  date: 'Date',
};

export function SubmissionQuestionsStep({
  config,
  onUpdateConfig,
  onBack,
  onComplete,
}: SubmissionQuestionsStepProps) {
  // Local state for editing
  const [priceItems, setPriceItems] = useState<PriceLineItem[]>(config.priceLineItems);
  const [customQuestions, setCustomQuestions] = useState<SubmissionQuestion[]>(config.customQuestions);

  // Price line item handlers
  const handleAddPriceItem = () => {
    const newItem: PriceLineItem = {
      id: `price-${Date.now()}`,
      label: '',
      description: '',
      order: priceItems.length,
    };
    setPriceItems([...priceItems, newItem]);
  };

  const handleRemovePriceItem = (id: string) => {
    // Don't allow removing the last price item
    if (priceItems.length > 1) {
      setPriceItems(priceItems.filter((p) => p.id !== id));
    }
  };

  const handlePriceItemChange = (id: string, field: keyof PriceLineItem, value: string) => {
    setPriceItems(
      priceItems.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Custom question handlers
  const handleAddQuestion = () => {
    const newQuestion: SubmissionQuestion = {
      id: `question-${Date.now()}`,
      label: '',
      description: '',
      fieldType: 'text',
      required: false,
      isMandatory: false,
      order: customQuestions.length,
    };
    setCustomQuestions([...customQuestions, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    setCustomQuestions(customQuestions.filter((q) => q.id !== id));
  };

  const handleQuestionChange = (
    id: string,
    field: keyof SubmissionQuestion,
    value: string | boolean | SubmissionFieldType
  ) => {
    setCustomQuestions(
      customQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleComplete = () => {
    const finalConfig: SubmissionQuestionsConfig = {
      includeCustomQuestions: true,
      priceLineItems: priceItems,
      customQuestions: customQuestions,
    };
    onUpdateConfig(finalConfig);
    onComplete(finalConfig);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">Submission Questions</h2>
        <p className="text-sm text-text-secondary">
          Configure the questions suppliers must answer when submitting their proposal.
          Mandatory fields are always required and appear at the top of the form.
        </p>
      </div>

      {/* Mandatory Fields Section */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-text-muted" />
            <CardTitle className="text-base font-medium text-text-primary">
              Mandatory Fields
            </CardTitle>
            <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] font-medium">
              Required
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            These fields are always required and cannot be removed
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Price Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-brand-green" />
                <Label className="text-sm font-medium text-text-primary">
                  Price <span className="text-red-500">*</span>
                </Label>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPriceItem}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Price Line
              </Button>
            </div>

            <div className="space-y-2">
              {priceItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-3 items-start p-3 rounded-lg border border-border bg-surface"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-brand-green text-xs font-medium mt-1">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-text-muted">Label</Label>
                      <Input
                        placeholder="e.g., Total Price, Year 1 Cost"
                        value={item.label}
                        onChange={(e) =>
                          handlePriceItemChange(item.id, 'label', e.target.value)
                        }
                        className="border-border"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-text-muted">Description (optional)</Label>
                      <Input
                        placeholder="Guidance for suppliers"
                        value={item.description || ''}
                        onChange={(e) =>
                          handlePriceItemChange(item.id, 'description', e.target.value)
                        }
                        className="border-border"
                      />
                    </div>
                  </div>
                  {priceItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePriceItem(item.id)}
                      className="text-text-muted hover:text-red-500 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Questions Section */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium text-text-primary">
                Custom Questions
              </CardTitle>
              <p className="text-xs text-text-muted mt-1">
                Add additional questions for suppliers to answer
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddQuestion}
              className="border-border"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {customQuestions.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <p className="text-sm text-text-muted">
                No custom questions added yet
              </p>
              <p className="text-xs text-text-muted mt-1">
                Click &quot;Add Question&quot; to create your first question
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {customQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 rounded-lg border border-border bg-surface hover:border-brand-green/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 shrink-0 pt-2">
                      <GripVertical className="h-4 w-4 text-text-muted cursor-grab" />
                      <span className="text-xs font-medium text-text-muted">
                        Q{index + 1}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Question Label */}
                      <div className="space-y-1">
                        <Label className="text-xs text-text-muted">Question</Label>
                        <Input
                          placeholder="Enter your question"
                          value={question.label}
                          onChange={(e) =>
                            handleQuestionChange(question.id, 'label', e.target.value)
                          }
                          className="border-border"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <Label className="text-xs text-text-muted">
                          Description / Guidance (optional)
                        </Label>
                        <Textarea
                          placeholder="Help suppliers understand what you're looking for"
                          value={question.description || ''}
                          onChange={(e) =>
                            handleQuestionChange(question.id, 'description', e.target.value)
                          }
                          className="border-border min-h-[60px]"
                        />
                      </div>

                      {/* Field Type & Required Toggle */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-text-muted">Response Type:</Label>
                          <Select
                            value={question.fieldType}
                            onValueChange={(value: SubmissionFieldType) =>
                              handleQuestionChange(question.id, 'fieldType', value)
                            }
                          >
                            <SelectTrigger className="w-28 h-8 text-xs border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(['text', 'number', 'date'] as SubmissionFieldType[]).map(
                                (type) => (
                                  <SelectItem key={type} value={type}>
                                    <div className="flex items-center gap-2">
                                      {fieldTypeIcons[type]}
                                      {fieldTypeLabels[type]}
                                    </div>
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={question.required}
                            onClick={() =>
                              handleQuestionChange(
                                question.id,
                                'required',
                                !question.required
                              )
                            }
                            className={cn(
                              'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus-visible:outline-none',
                              question.required
                                ? 'bg-[#16A34A] border-[#16A34A]'
                                : 'bg-gray-200 border-gray-200'
                            )}
                          >
                            <span
                              className={cn(
                                'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform',
                                question.required ? 'translate-x-4' : 'translate-x-0'
                              )}
                            />
                          </button>
                          <Label className="text-xs text-text-muted">Required</Label>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="text-text-muted hover:text-red-500 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview hint */}
      <div className="p-4 rounded-lg bg-surface border border-border">
        <p className="text-sm text-text-secondary">
          <strong className="text-text-primary">Preview:</strong> Suppliers will see the
          mandatory price field{priceItems.length > 1 ? 's' : ''} at the top of their submission
          form, followed by your{' '}
          {customQuestions.length > 0 ? (
            <>
              {customQuestions.length} custom question
              {customQuestions.length !== 1 ? 's' : ''}
            </>
          ) : (
            'custom questions (none added yet)'
          )}
          . Required fields are marked with an asterisk (*).
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-border">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleComplete}
          className="bg-brand-green hover:bg-brand-green-mid text-white"
        >
          Continue to Editor
        </Button>
      </div>
    </div>
  );
}
