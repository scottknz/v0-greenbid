'use client';

import { useState } from 'react';
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
import { Calendar, DollarSign, Clock, Plus, Trash2, ArrowLeft, FileText } from 'lucide-react';
import { rfpCategories } from '@/lib/mock-rfp';
import { TeamCard } from '@/components/rfp/TeamCard';
import type { RFPDocument, RFPMilestone, RFPTeamMember } from '@/types/rfp';

interface ProjectSetupFormProps {
  projectInfo: Partial<RFPDocument['projectInfo']>;
  onUpdateProjectInfo: (info: Partial<RFPDocument['projectInfo']>) => void;
  onBack: () => void;
  onNext: () => void;
}

const CONTRACT_TYPES = ['Fixed Price', 'Time & Materials', 'Framework Agreement', 'Retainer'];
const CONFIDENTIALITY = ['Public', 'Restricted', 'Confidential'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'NZD', 'CAD', 'SGD', 'JPY'];
const LANGUAGES = ['English', 'French', 'Spanish', 'German', 'Mandarin', 'Other'];

export function ProjectSetupForm({
  projectInfo,
  onUpdateProjectInfo,
  onBack,
  onNext,
}: ProjectSetupFormProps) {
  const [milestones, setMilestones] = useState<RFPMilestone[]>(
    projectInfo.milestones || []
  );
  const [team, setTeam] = useState<RFPTeamMember[]>(projectInfo.team || []);

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
    const updated = milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m));
    setMilestones(updated);
    onUpdateProjectInfo({ ...projectInfo, milestones: updated });
  };

  const handleChange = (field: string, value: string | number) => {
    onUpdateProjectInfo({ ...projectInfo, [field]: value });
  };

  const handleTeamChange = (updatedTeam: RFPTeamMember[]) => {
    setTeam(updatedTeam);
    const lead = updatedTeam.find((m) => m.isLead);
    onUpdateProjectInfo({
      ...projectInfo,
      team: updatedTeam,
      // Keep legacy fields in sync with lead
      primaryContact: lead?.name ?? projectInfo.primaryContact ?? '',
      primaryContactEmail: lead?.email ?? projectInfo.primaryContactEmail ?? '',
    });
  };

  const isValid = projectInfo.projectName && projectInfo.category && projectInfo.submissionDeadline;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-text-primary">Project Details</h2>
        <p className="text-sm text-text-secondary">
          Provide the key information about your procurement project. Fields marked with * are required.
        </p>
      </div>

      {/* Basic Information */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium text-text-primary flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-green" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Project Name & Category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-text-primary text-sm">
                Project Name <span className="text-destructive">*</span>
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
              <Label htmlFor="category" className="text-text-primary text-sm">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={projectInfo.category || ''}
                onValueChange={(v) => handleChange('category', v)}
              >
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {rfpCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-text-primary text-sm">
              Project Description
            </Label>
            <Textarea
              id="description"
              placeholder="Briefly describe the procurement need, context, and intended outcome..."
              value={projectInfo.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="border-border min-h-[90px] resize-none"
            />
          </div>

          {/* Department & Reference ID */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-text-primary text-sm">
                Issuing Department
              </Label>
              <Input
                id="department"
                placeholder="e.g., Sustainability"
                value={projectInfo.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referenceId" className="text-text-primary text-sm">
                Internal Reference ID
              </Label>
              <Input
                id="referenceId"
                placeholder="e.g., TND-2026-009"
                value={projectInfo.referenceId || ''}
                onChange={(e) => handleChange('referenceId', e.target.value)}
                className="border-border"
              />
            </div>
          </div>

          {/* Contract Type / Confidentiality / Language */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="contractType" className="text-text-primary text-sm">
                Contract Type
              </Label>
              <Select
                value={projectInfo.contractType || ''}
                onValueChange={(v) => handleChange('contractType', v)}
              >
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CONTRACT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidentiality" className="text-text-primary text-sm">
                Confidentiality Level
              </Label>
              <Select
                value={projectInfo.confidentiality || ''}
                onValueChange={(v) => handleChange('confidentiality', v)}
              >
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {CONFIDENTIALITY.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="submissionLanguage" className="text-text-primary text-sm">
                Submission Language
              </Label>
              <Select
                value={projectInfo.submissionLanguage || 'English'}
                onValueChange={(v) => handleChange('submissionLanguage', v)}
              >
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Team Card */}
      <TeamCard team={team} onChange={handleTeamChange} />

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
              <Label htmlFor="expectedBudget" className="text-text-primary text-sm">
                Expected Budget
              </Label>
              <Input
                id="expectedBudget"
                type="number"
                placeholder="e.g., 450000"
                value={projectInfo.expectedBudget || ''}
                onChange={(e) => handleChange('expectedBudget', Number(e.target.value))}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetCurrency" className="text-text-primary text-sm">
                Currency
              </Label>
              <Select
                value={projectInfo.budgetCurrency || 'USD'}
                onValueChange={(v) => handleChange('budgetCurrency', v)}
              >
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetFlexibility" className="text-text-primary text-sm">
                Budget Flexibility
              </Label>
              <Select
                value={projectInfo.budgetFlexibility || 'flexible'}
                onValueChange={(v) => handleChange('budgetFlexibility', v)}
              >
                <SelectTrigger className="border-border">
                  <SelectValue />
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
              <Label htmlFor="submissionDeadline" className="text-text-primary text-sm">
                Submission Deadline <span className="text-destructive">*</span>
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
              <Label htmlFor="expectedStartDate" className="text-text-primary text-sm">
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
            <div className="space-y-2">
              <Label htmlFor="qaStartDate" className="text-text-primary text-sm">
                Q&amp;A Period Start
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
              <Label htmlFor="qaEndDate" className="text-text-primary text-sm">
                Q&amp;A Period End
              </Label>
              <Input
                id="qaEndDate"
                type="date"
                value={projectInfo.qaEndDate || ''}
                onChange={(e) => handleChange('qaEndDate', e.target.value)}
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
              className="border-border text-text-secondary h-8 text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Milestone
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {milestones.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-6 border border-dashed border-border rounded-lg">
              No milestones added yet. Click &quot;Add Milestone&quot; to create one.
            </p>
          ) : (
            <div className="space-y-2">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="flex gap-3 items-start p-3 rounded-lg border border-border bg-surface"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-brand-green text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid gap-2 sm:grid-cols-3">
                    <Input
                      placeholder="Milestone name"
                      value={milestone.name}
                      onChange={(e) => handleMilestoneChange(milestone.id, 'name', e.target.value)}
                      className="border-border text-sm"
                    />
                    <Input
                      type="date"
                      value={milestone.dueDate}
                      onChange={(e) => handleMilestoneChange(milestone.id, 'dueDate', e.target.value)}
                      className="border-border text-sm"
                    />
                    <Input
                      placeholder="Description"
                      value={milestone.description}
                      onChange={(e) => handleMilestoneChange(milestone.id, 'description', e.target.value)}
                      className="border-border text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMilestone(milestone.id)}
                    className="h-8 w-8 p-0 text-text-muted hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} className="border-border">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="bg-brand-green hover:bg-brand-green-mid text-white"
        >
          Continue to Editor
        </Button>
      </div>
    </div>
  );
}
