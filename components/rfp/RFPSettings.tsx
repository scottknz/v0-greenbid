'use client';

import type { RFPDocument } from '@/types/rfp';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface RFPSettingsProps {
  rfp: RFPDocument;
  onUpdate: (updates: Partial<RFPDocument>) => void;
}

export function RFPSettings({ rfp, onUpdate }: RFPSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(rfp);

  const handleSave = () => {
    onUpdate(formData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>RFP Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Branding Section */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 text-text-primary">Branding</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company-logo" className="text-sm text-text-primary">
                  Company Logo
                </Label>
                <Input
                  id="company-logo"
                  type="file"
                  accept="image/*"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="brand-color" className="text-sm text-text-primary">
                  Brand Color (Hex)
                </Label>
                <Input
                  id="brand-color"
                  type="color"
                  value={formData.brandColor || '#16a34a'}
                  onChange={(e) =>
                    setFormData({ ...formData, brandColor: e.target.value })
                  }
                  className="mt-2 h-10"
                />
              </div>

              <div>
                <Label htmlFor="footer-text" className="text-sm text-text-primary">
                  Footer Text
                </Label>
                <Input
                  id="footer-text"
                  value={formData.footerText || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, footerText: e.target.value })
                  }
                  placeholder="e.g., Confidential - Company Name"
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Tone & Voice Section */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 text-text-primary">AI Tone & Voice</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tone" className="text-sm text-text-primary">
                  Tone Setting
                </Label>
                <select
                  id="tone"
                  value={formData.toneSettings?.tone || 'professional'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      toneSettings: {
                        toneFile: formData.toneSettings?.toneFile || null,
                        formality: formData.toneSettings?.formality || 'professional',
                        industry: formData.toneSettings?.industry || '',
                        customInstructions: formData.toneSettings?.customInstructions || '',
                        tone: e.target.value,
                      },
                    })
                  }
                  className="w-full mt-2 p-2 border border-border rounded-md bg-background text-text-primary"
                >
                  <option value="formal">Formal</option>
                  <option value="professional">Professional</option>
                  <option value="conversational">Conversational</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              <div>
                <Label htmlFor="voice-file" className="text-sm text-text-primary">
                  Upload Tone & Voice Guide (PDF)
                </Label>
                <Input
                  id="voice-file"
                  type="file"
                  accept=".pdf"
                  className="mt-2"
                />
                <p className="text-xs text-text-muted-foreground mt-2">
                  Upload your company&apos;s tone and voice guidelines for AI to follow
                </p>
              </div>
            </div>
          </Card>

          {/* Approval Workflow Section */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 text-text-primary flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Approval Workflow
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-approval" className="text-sm text-text-primary">
                    Require Approval Before Publishing
                  </Label>
                  <p className="text-xs text-text-muted-foreground mt-1">
                    RFP must be approved before sending to suppliers
                  </p>
                </div>
                <Switch
                  id="require-approval"
                  checked={formData.requiresApproval !== false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, requiresApproval: checked })
                  }
                />
              </div>

              {formData.requiresApproval !== false && (
                <div>
                  <Label htmlFor="approver-email" className="text-sm text-text-primary">
                    Approver Email(s)
                  </Label>
                  <Input
                    id="approver-email"
                    type="email"
                    placeholder="approver@company.com"
                    className="mt-2"
                  />
                  <p className="text-xs text-text-muted-foreground mt-2">
                    Comma-separated for multiple approvers
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* AI Context Section */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 text-text-primary">AI Context & Memory</h3>
            <div className="space-y-2 text-sm text-text-muted-foreground">
              <p>The AI maintains context across all sections:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Section summaries are auto-updated</li>
                <li>Previous decisions inform new section generation</li>
                <li>You can edit AI suggestions and change tone settings</li>
              </ul>
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
