'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateSelector } from '@/components/rfp/TemplateSelector';
import { ProjectSetupForm } from '@/components/rfp/ProjectSetupForm';
import { RFPInterview } from '@/components/rfp/RFPInterview';
import { SubmissionQuestionsStep } from '@/components/rfp/SubmissionQuestionsStep';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Settings, MessageSquare, ClipboardList, Edit3 } from 'lucide-react';
import { rfpTemplates, createRFPFromTemplate, saveRFP } from '@/lib/mock-rfp';
import type { RFPTemplate, RFPDocument, SubmissionQuestionsConfig } from '@/types/rfp';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Step = 'template' | 'setup' | 'interview' | 'questions';

const steps = [
  { id: 'template', label: 'Select Template', icon: FileText },
  { id: 'setup', label: 'Project Details', icon: Settings },
  { id: 'interview', label: 'AI Interview', icon: MessageSquare },
  { id: 'questions', label: 'Submission Questions', icon: ClipboardList },
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
  const [interviewData, setInterviewData] = useState<Record<string, string>>({});
  const [uploadedRFPFile, setUploadedRFPFile] = useState<File | null>(null);
  const [includeCustomQuestions, setIncludeCustomQuestions] = useState(false);
  const [submissionConfig, setSubmissionConfig] = useState<SubmissionQuestionsConfig>({
    includeCustomQuestions: false,
    priceLineItems: [{ id: 'price-1', label: 'Total Price', description: '', order: 0 }],
    customQuestions: [],
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

  const handleNextFromSetup = (skipToEditor?: boolean) => {
    if (projectInfo.projectName) {
      if (skipToEditor) {
        // User uploaded a pre-prepared RFP - skip interview and questions
        createAndNavigateToEditor({});
      } else {
        setCurrentStep('interview');
      }
    }
  };

  const handleBackToSetup = () => {
    setCurrentStep('setup');
  };

  const handleInterviewComplete = (data: Record<string, string>) => {
    setInterviewData(data);
    if (includeCustomQuestions) {
      setCurrentStep('questions');
    } else {
      createAndNavigateToEditor(data);
    }
  };

  const handleSkipInterview = () => {
    if (includeCustomQuestions) {
      setCurrentStep('questions');
    } else {
      createAndNavigateToEditor({});
    }
  };

  const handleBackToInterview = () => {
    setCurrentStep('interview');
  };

  const handleQuestionsComplete = (config: SubmissionQuestionsConfig) => {
    setSubmissionConfig(config);
    createAndNavigateToEditor(interviewData);
  };

  const createAndNavigateToEditor = (interviewAnswers: Record<string, string>) => {
    if (selectedTemplate && projectInfo.projectName) {
      // Create the RFP document with interview data
      const rfpDocument = createRFPFromTemplate(selectedTemplate, projectInfo);
      
      // Store interview answers in the document's AI summary for context
      if (Object.keys(interviewAnswers).length > 0) {
        rfpDocument.aiSummary = JSON.stringify(interviewAnswers);
      }

      // Save to the in-memory store
      saveRFP(rfpDocument);
      
      // Also store in sessionStorage for immediate access
      sessionStorage.setItem('draft-rfp', JSON.stringify(rfpDocument));
      sessionStorage.setItem('interview-data', JSON.stringify(interviewAnswers));
      
      // Navigate to the editor
      router.push(`/buyer/rfp/${rfpDocument.id}/edit`);
    }
  };

  const getStepIndex = () => {
    switch (currentStep) {
      case 'template': return 0;
      case 'setup': return 1;
      case 'interview': return 2;
      case 'questions': return 3;
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/buyer/tenders">
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
          <nav className="flex items-center justify-center gap-6">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-center gap-2">
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
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium hidden sm:block',
                      isActive ? 'text-text-primary' : 'text-text-muted'
                    )}
                  >
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'ml-2 h-px w-8 sm:w-12',
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
            onNext={handleNextFromSetup}
            includeCustomQuestions={includeCustomQuestions}
            onIncludeCustomQuestionsChange={setIncludeCustomQuestions}
            uploadedFile={uploadedRFPFile}
            onFileUpload={setUploadedRFPFile}
          />
        )}

        {currentStep === 'interview' && selectedTemplate && (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">
                    AI Interview
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Answer a few questions to help generate a comprehensive RFP document
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToSetup}
                  className="text-text-secondary"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
            </div>
            <RFPInterview
              template={selectedTemplate}
              projectInfo={projectInfo}
              onComplete={handleInterviewComplete}
              onSkip={handleSkipInterview}
            />
          </div>
        )}

        {currentStep === 'questions' && (
          <SubmissionQuestionsStep
            config={submissionConfig}
            onUpdateConfig={setSubmissionConfig}
            onBack={handleBackToInterview}
            onComplete={handleQuestionsComplete}
          />
        )}
      </div>
    </div>
  );
}
