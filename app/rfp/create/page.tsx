'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/shell/DashboardShell';
import { TemplateSelector } from '@/components/rfp/TemplateSelector';
import { ProjectSetupForm } from '@/components/rfp/ProjectSetupForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Settings, Edit3 } from 'lucide-react';
import { rfpTemplates, createRFPFromTemplate } from '@/lib/mock-rfp';
import type { RFPTemplate, RFPDocument } from '@/types/rfp';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Step = 'template' | 'setup';

const steps = [
  { id: 'template', label: 'Select Template', icon: FileText },
  { id: 'setup', label: 'Project Details', icon: Settings },
  { id: 'editor', label: 'Edit Document', icon: Edit3 },
];

export default function CreateRFPPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<RFPTemplate | null>(
    rfpTemplates.find((t) => t.isDefault) || null
  );
  const [projectInfo, setProjectInfo] = useState<Partial<RFPDocument['projectInfo']>>({
    budgetCurrency: 'USD',
    budgetFlexibility: 'flexible',
    milestones: [],
  });

  const handleSelectTemplate = (template: RFPTemplate) => {
    setSelectedTemplate(template);
  };

  const handleNextFromTemplate = () => {
    if (selectedTemplate) {
      setCurrentStep('setup');
    }
  };

  const handleBackToTemplate = () => {
    setCurrentStep('template');
  };

  const handleCreateRFP = () => {
    if (selectedTemplate && projectInfo.projectName) {
      // Create the RFP document
      const rfpDocument = createRFPFromTemplate(selectedTemplate, projectInfo);
      
      // In production, save to database here
      // For now, store in sessionStorage and navigate to editor
      sessionStorage.setItem('draft-rfp', JSON.stringify(rfpDocument));
      
      // Navigate to the editor
      router.push(`/rfp/${rfpDocument.id}/edit`);
    }
  };

  const currentStepIndex = currentStep === 'template' ? 0 : 1;

  return (
    <DashboardShell>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-white">
          <div className="mx-auto max-w-4xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/tenders">
                  <Button variant="ghost" size="sm" className="text-text-secondary">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to RFPs
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
                <h1 className="text-lg font-semibold text-text-primary">Create New RFP</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-4xl px-6 py-4">
            <nav className="flex items-center justify-center gap-8">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.id} className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-brand-green text-white'
                          : isCompleted
                          ? 'bg-brand-green-light text-brand-green'
                          : 'bg-surface-hover text-text-muted'
                      )}
                    >
                      {isCompleted ? (
                        <svg className="h-4 w-4\" fill="none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">
                          <path strokeLinecap="round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M5 13l4 4L19 7\" />
                        </svg>
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isActive ? 'text-text-primary' : 'text-text-muted'
                      )}
                    >
                      {step.label}
                    </span>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          'ml-4 h-px w-16',
                          isCompleted ? 'bg-brand-green' : 'bg-border'
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-6 py-8">
          {currentStep === 'template' && (
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleSelectTemplate}
              onNext={handleNextFromTemplate}
            />
          )}

          {currentStep === 'setup' && (
            <ProjectSetupForm
              projectInfo={projectInfo}
              onUpdateProjectInfo={setProjectInfo}
              onBack={handleBackToTemplate}
              onNext={handleCreateRFP}
            />
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
