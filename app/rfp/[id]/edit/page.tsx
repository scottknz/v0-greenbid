'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { RFPEditor } from '@/components/rfp/RFPEditor';
import { RFPCopilot } from '@/components/rfp/RFPCopilot';
import { VersionHistory } from '@/components/rfp/VersionHistory';
import { RFPSettings } from '@/components/rfp/RFPSettings';
import { getRFPById, updateRFP, createRFPVersion, saveRFP } from '@/lib/mock-rfp';
import { RFPDocument, RFPVersion } from '@/types/rfp';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Download, Save, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { downloadRFPAsPDF } from '@/lib/pdf-export';

export default function RFPEditPage() {
  const params = useParams();
  const rfpId = params.id as string;
  const [rfp, setRfp] = useState<RFPDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<Array<{ id: string; role: string; content: string }>>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome! I\'m your RFP copilot. I can help you draft sections, improve content, or answer questions about your RFP. Which section would you like to start with?'
    }
  ]);
  const [currentSection, setCurrentSection] = useState<any>(null);

  useEffect(() => {
    const loadRFP = async () => {
      try {
        // First check sessionStorage for draft RFP
        const draftRFP = sessionStorage.getItem('draft-rfp');
        if (draftRFP) {
          try {
            const data = JSON.parse(draftRFP) as RFPDocument;
            // Save to the store immediately for persistence
            saveRFP(data);
            setRfp(data);
            // Clear the draft from sessionStorage after loading
            sessionStorage.removeItem('draft-rfp');
            setLoading(false);
            return;
          } catch (e) {
            console.error('Failed to parse draft RFP:', e);
          }
        }

        // Otherwise try to load from the store
        const data = getRFPById(rfpId);
        if (data) {
          setRfp(data);
        } else {
          // RFP not found in store or sessionStorage
          console.error('RFP not found:', rfpId);
        }
      } catch (error) {
        console.error('Failed to load RFP:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRFP();
  }, [rfpId]);

  const handleSaveDraft = async () => {
    if (!rfp) return;
    setIsSaving(true);
    try {
      const updated = updateRFP(rfp.id, {
        ...rfp,
        status: 'draft',
        updatedAt: new Date().toISOString(),
      });
      setRfp(updated);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveVersion = async () => {
    if (!rfp) return;
    setIsSaving(true);
    try {
      const updated = createRFPVersion(rfp.id, rfp);
      setRfp(updated);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!rfp) return;
    try {
      await downloadRFPAsPDF(rfp);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  const handleRestoreVersion = (version: RFPVersion) => {
    setRfp({
      ...rfp!,
      ...version,
    });
  };

  const handleUpdateSettings = (updates: Partial<RFPDocument>) => {
    if (!rfp) return;
    const updated = updateRFP(rfp.id, { ...rfp, ...updates });
    setRfp(updated);
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-lg font-medium text-text-primary">Loading RFP...</div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!rfp) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-lg font-medium text-text-primary">RFP not found</div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - AI Copilot or Version History */}
      <div className="w-96 border-r border-border bg-background flex flex-col">
        {showVersionHistory ? (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVersionHistory(false)}
                className="mb-2"
              >
                ← Back to AI
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <VersionHistory
                rfp={rfp}
                onRestore={handleRestoreVersion}
              />
            </div>
          </div>
        ) : (
          <RFPCopilot
            messages={copilotMessages}
            onSendMessage={(msg) => {
              setCopilotMessages([...copilotMessages, { id: Date.now().toString(), role: 'user', content: msg }]);
            }}
            onAcceptSuggestion={() => {}}
            onRejectSuggestion={() => {}}
            onRegenerateSuggestion={() => {}}
            isLoading={false}
            currentSection={currentSection}
            onSectionSelect={setCurrentSection}
          />
        )}
      </div>

      {/* Main Editor - Center/Right */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Action Bar */}
        <div className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-text-primary">{rfp.title}</h1>
              <p className="text-sm text-text-muted-foreground">
                {rfp.status === 'draft' ? 'Draft' : 'Published'} • Created {new Date(rfp.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/rfp/${rfpId}/preview`}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <RFPSettings rfp={rfp} onUpdate={handleUpdateSettings} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSaveDraft}>
                  Save Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSaveVersion}>
                  Save as Version
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowVersionHistory(!showVersionHistory)}>
                  Version History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-auto">
          <RFPEditor 
            rfp={rfp} 
            onUpdate={(updated) => setRfp(updated)}
          />
        </div>
      </div>
    </div>
  );
}
