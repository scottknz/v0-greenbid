'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Check, Sparkles } from 'lucide-react';
import { rfpTemplates } from '@/lib/mock-rfp';
import type { RFPTemplate } from '@/types/rfp';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  selectedTemplate: RFPTemplate | null;
  onSelectTemplate: (template: RFPTemplate) => void;
  onNext: () => void;
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate, onNext }: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">Select a Template</h2>
        <p className="text-sm text-text-secondary">
          Choose a template that best fits your procurement needs. The AI Copilot will help you customize it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {rfpTemplates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              'relative cursor-pointer transition-all hover:border-brand-green hover:shadow-md',
              selectedTemplate?.id === template.id
                ? 'border-brand-green ring-2 ring-brand-green/20'
                : 'border-border'
            )}
            onClick={() => onSelectTemplate(template)}
          >
            {selectedTemplate?.id === template.id && (
              <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-white">
                <Check className="h-4 w-4" />
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-base font-medium text-text-primary">
                    {template.name}
                  </CardTitle>
                  {template.isDefault && (
                    <Badge variant="secondary" className="text-xs bg-brand-green-light text-brand-green border-0">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Recommended
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-text-secondary">
                {template.description}
              </CardDescription>
              <p className="mt-2 text-xs text-text-muted">
                {template.sections.length} sections included
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          disabled={!selectedTemplate}
          className="bg-brand-green hover:bg-brand-green-mid text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
