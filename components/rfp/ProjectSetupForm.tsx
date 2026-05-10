'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, DollarSign, Users, Clock, Plus, Trash2, ArrowLeft, Lock, Upload, ClipboardList, FileText, X } from 'lucide-react';
import { rfpCategories } from '@/lib/mock-rfp';
import { generateReferenceId, getCompanyName } from '@/lib/rfp-utils';
import type { RFPDocument, RFPMilestone } from '@/types/rfp';
import { cn } from '@/lib/utils';

interface ProjectSetupFormProps {
  projectInfo: Partial<RFPDocument['projectInfo']>;
  onUpdateProjectInfo: (info: Partial<RFPDocument['projectInfo']>) => void;
  onBack: () => void;
  onNext: (skipToEditor?: boolean) => void;
  includeCustomQuestions: boolean;
  onIncludeCustomQuestionsChange: (include: boolean) => void;
  uploadedFile: File | null;
  onFileUpload: (file: File | null) => void;
}

export function ProjectSetupForm({ 
  projectInfo, 
  onUpdateProjectInfo, 
  onBack, 
  onNext,
  includeCustomQuestions,
  onIncludeCustomQuestionsChange,
  uploadedFile,
  onFileUpload,
}: ProjectSetupFormProps) {
  const [milestones, setMilestones] = useState<RFPMilestone[]>(
    projectInfo.milestones || []
  );
  const [generatedRefId, setGeneratedRefId] = useState<string>('');

  // Generate reference ID when component mounts
  useEffect(() => {
    const refId = generateReferenceId(getCompanyName(), 1);
    setGeneratedRefId(refId);
    // Auto-update projectInfo with generated reference ID
    if (!projectInfo.referenceId) {
      onUpdateProjectInfo({ ...projectInfo, referenceId: refId });
    }
  }, []);

  const handleAddMilestone = () => {
    const newMilestone: RFPMilestone = {
      id: `milestone-${Date.now()}`,
      name: '',
      dueDate: '',
      description: '',
    };
    const updated = [...milestones, newMilestone];
    setMilestones(updated);
    onUpdateProjectInfo({ ...projectInfo, milestones: updated });
  };

  const handleRemoveMilestone = (id: string) => {
    const updated = milestones.filter((m) => m.id !== id);
    setMilestones(updated);
    onUpdateProjectInfo({ ...projectInfo, milestones: updated });
  };

  const handleMilestoneChange = (id: string, field: keyof RFPMilestone, value: string) => {
    const updated = milestones.map((m) =>
      m.id === id ? { ...m, [field]: value } : m
    );
    setMilestones(updated);
    onUpdateProjectInfo({ ...projectInfo, milestones: updated });
  };

  const handleChange = (field: string, value: string | number) => {
    onUpdateProjectInfo({ ...projectInfo, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleRemoveFile = () => {
    onFileUpload(null);
  };

  const isValid = projectInfo.projectName && projectInfo.category && projectInfo.submissionDeadline;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">Project Details</h2>
        <p className="text-sm text-text-secondary">
          Provide the key information about your procurement project.
        </p>
      </div>

      {/* Basic Information */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium text-text-primary flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-green" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-text-primary">
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="projectName"
                placeholder="e.g., Comprehensive Scope 3 Value Chain Emissions Analysis"
                value={projectInfo.projectName || ''}
                onChange={(e) => handleChange('projectName', e.target.value)}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-text-primary">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={projectInfo.category || ''}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {rfpCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-text-primary">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of the procurement need..."
              value={projectInfo.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="border-border min-h-[100px]"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-text-primary">
                Department
              </Label>
              <Input
                id="department"
                placeholder="e.g., Procurement"
                value={projectInfo.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referenceId" className="text-text-primary flex items-center gap-2">
                Reference ID <Lock className="h-3 w-3 text-text-muted" />
              </Label>
              <div className="relative">
                <Input
                  id="referenceId"
                  value={generatedRefId || projectInfo.referenceId || ''}
                  disabled
                  className="border-border bg-surface-hover text-text-secondary cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-text-muted">
                  Auto-generated
                </span>
              </div>
            </div>
          </div>

          {/* Classification Section */}
          <div className="border-t border-border pt-4 mt-4">
            <h3 className="text-sm font-medium text-text-primary mb-3">Classification</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="contractType" className="text-text-primary">
                  Contract Type
                </Label>
                <Select
                  value={projectInfo.contractType || ''}
                  onValueChange={(value) => handleChange('contractType', value)}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed Price">Fixed Price</SelectItem>
                    <SelectItem value="Time & Materials">Time & Materials</SelectItem>
                    <SelectItem value="Framework Agreement">Framework Agreement</SelectItem>
                    <SelectItem value="Retainer">Retainer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confidentiality" className="text-text-primary">
                  Confidentiality Level
                </Label>
                <Select
                  value={projectInfo.confidentiality || ''}
                  onValueChange={(value) => handleChange('confidentiality', value)}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Restricted">Restricted</SelectItem>
                    <SelectItem value="Confidential">Confidential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="submissionLanguage" className="text-text-primary">
                  Submission Language
                </Label>
                <Select
                  value={projectInfo.submissionLanguage || ''}
                  onValueChange={(value) => handleChange('submissionLanguage', value)}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Mandarin">Mandarin</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium text-text-primary flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-brand-green" />
            Budget
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="expectedBudget" className="text-text-primary">
                Expected Budget
              </Label>
              <Input
                id="expectedBudget"
                type="number"
                placeholder="e.g., 125000"
                value={projectInfo.expectedBudget || ''}
                onChange={(e) => handleChange('expectedBudget', Number(e.target.value))}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetCurrency" className="text-text-primary">
                Currency
              </Label>
              <Select
                value={projectInfo.budgetCurrency || 'USD'}
                onValueChange={(value) => handleChange('budgetCurrency', value)}
              >
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="NZD">NZD</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetFlexibility" className="text-text-primary">
                Flexibility
              </Label>
              <Select
                value={projectInfo.budgetFlexibility || 'flexible'}
                onValueChange={(value) => handleChange('budgetFlexibility', value)}
              >
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select flexibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                  <SelectItem value="negotiable">Negotiable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium text-text-primary flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand-green" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="submissionDeadline" className="text-text-primary">
                Submission Deadline <span className="text-red-500">*</span>
              </Label>
              <Input
                id="submissionDeadline"
                type="date"
                value={projectInfo.submissionDeadline || ''}
                onChange={(e) => handleChange('submissionDeadline', e.target.value)}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qaStartDate" className="text-text-primary">
                Q&A Period Start
              </Label>
              <Input
                id="qaStartDate"
                type="date"
                value={projectInfo.qaStartDate || ''}
                onChange={(e) => handleChange('qaStartDate', e.target.value)}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qaEndDate" className="text-text-primary">
                Q&A Period End
              </Label>
              <Input
                id="qaEndDate"
                type="date"
                value={projectInfo.qaEndDate || ''}
                onChange={(e) => handleChange('qaEndDate', e.target.value)}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedStartDate" className="text-text-primary">
                Expected Project Start
              </Label>
              <Input
                id="expectedStartDate"
                type="date"
                value={projectInfo.expectedStartDate || ''}
                onChange={(e) => handleChange('expectedStartDate', e.target.value)}
                className="border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium text-text-primary flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-green" />
              Milestones
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddMilestone}
              className="border-border"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Milestone
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {milestones.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">
              No milestones added yet. Click &quot;Add Milestone&quot; to create one.
            </p>
          ) : (
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="flex gap-3 items-start p-3 rounded-lg border border-border bg-surface"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-brand-green text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid gap-3 sm:grid-cols-3">
                    <Input
                      placeholder="Milestone name"
                      value={milestone.name}
                      onChange={(e) =>
                        handleMilestoneChange(milestone.id, 'name', e.target.value)
                      }
                      className="border-border"
                    />
                    <Input
                      type="date"
                      value={milestone.dueDate}
                      onChange={(e) =>
                        handleMilestoneChange(milestone.id, 'dueDate', e.target.value)
                      }
                      className="border-border"
                    />
                    <Input
                      placeholder="Description"
                      value={milestone.description}
                      onChange={(e) =>
                        handleMilestoneChange(milestone.id, 'description', e.target.value)
                      }
                      className="border-border"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMilestone(milestone.id)}
                    className="text-text-muted hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Pre-prepared RFP */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium text-text-primary flex items-center gap-2">
            <Upload className="h-4 w-4 text-brand-green" />
            Upload Pre-prepared RFP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary">
            Already have an RFP document prepared? Upload it here to skip the AI interview and go directly to the editor.
          </p>
          
          {uploadedFile ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-brand-green/30 bg-brand-green-light/30">
              <FileText className="h-5 w-5 text-brand-green shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{uploadedFile.name}</p>
                <p className="text-xs text-text-muted">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="text-text-muted hover:text-red-500 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-green/50 transition-colors">
              <input
                type="file"
                id="rfp-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="rfp-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-text-muted mx-auto mb-2" />
                <p className="text-sm font-medium text-text-primary">Click to upload</p>
                <p className="text-xs text-text-muted mt-1">PDF, DOC, DOCX (max 10MB)</p>
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Submission Questions */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium text-text-primary flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-brand-green" />
            Submission Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary">
            Would you like to ask suppliers custom questions as part of their submission? This allows you to collect specific information beyond the standard requirements.
          </p>
          
          <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-surface">
            <button
              type="button"
              role="switch"
              aria-checked={includeCustomQuestions}
              onClick={() => onIncludeCustomQuestionsChange(!includeCustomQuestions)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus-visible:outline-none',
                includeCustomQuestions ? 'bg-[#16A34A] border-[#16A34A]' : 'bg-gray-200 border-gray-200'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform',
                  includeCustomQuestions ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Include custom questions</p>
              <p className="text-xs text-text-muted">You&apos;ll configure these questions in the next step</p>
            </div>
          </div>

          {includeCustomQuestions && (
            <div className="p-3 rounded-lg bg-brand-green-light/30 border border-brand-green/20">
              <p className="text-xs text-text-secondary">
                <strong className="text-brand-green">Note:</strong> Price is always a mandatory field. You can add multiple price line items and configure additional custom questions for suppliers to complete.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-border">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-3">
          {uploadedFile && (
            <Button
              onClick={() => onNext(true)}
              disabled={!isValid}
              variant="outline"
              className="border-brand-green text-brand-green hover:bg-brand-green-light"
            >
              Skip to Editor
            </Button>
          )}
          <Button
            onClick={() => onNext(false)}
            disabled={!isValid}
            className="bg-brand-green hover:bg-brand-green-mid text-white"
          >
            {includeCustomQuestions ? 'Continue to AI Interview' : 'Continue to AI Interview'}
          </Button>
        </div>
      </div>
    </div>
  );
}
