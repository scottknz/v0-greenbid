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
import { Calendar, DollarSign, Users, Clock, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { rfpCategories } from '@/lib/mock-rfp';
import type { RFPDocument, RFPMilestone } from '@/types/rfp';

interface ProjectSetupFormProps {
  projectInfo: Partial<RFPDocument['projectInfo']>;
  onUpdateProjectInfo: (info: Partial<RFPDocument['projectInfo']>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ProjectSetupForm({ 
  projectInfo, 
  onUpdateProjectInfo, 
  onBack, 
  onNext 
}: ProjectSetupFormProps) {
  const [milestones, setMilestones] = useState<RFPMilestone[]>(
    projectInfo.milestones || []
  );

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
                placeholder="e.g., Sustainable Office Supplies 2026"
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
              <Label htmlFor="primaryContact" className="text-text-primary">
                Primary Contact
              </Label>
              <Input
                id="primaryContact"
                placeholder="e.g., Sarah Chen"
                value={projectInfo.primaryContact || ''}
                onChange={(e) => handleChange('primaryContact', e.target.value)}
                className="border-border"
              />
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

      {/* Actions */}
      <div className="flex justify-between pt-4">
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
