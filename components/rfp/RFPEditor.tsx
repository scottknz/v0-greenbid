'use client';

import { useState, useCallback, useRef } from 'react';
import { SectionNavigator } from './SectionNavigator';
import { SectionEditor } from './SectionEditor';
import { RFPCopilot } from './RFPCopilot';
import { RFPPreview } from './RFPPreview';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  X,
  Save,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
} from 'lucide-react';
import type { RFPDocument, RFPSectionContent } from '@/types/rfp';

interface RFPEditorProps {
  rfp: RFPDocument;
  onUpdate: (updates: Partial<RFPDocument>) => void;
  onSave: () => void;
  onPublish?: () => void;
  isPublishing?: boolean;
}

export function RFPEditor({ rfp, onUpdate, onSave, onPublish, isPublishing }: RFPEditorProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    rfp.sections[0]?.id || null
  );
  const [unsavedSections, setUnsavedSections] = useState<Set<string>>(new Set());
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const activeSection = rfp.sections.find((s) => s.id === activeSectionId) || null;

  const handleSelectSection = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
  }, []);

  const handleReorderSections = useCallback((newSections: RFPSectionContent[]) => {
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      number: String(index + 1),
    }));
    onUpdate({ sections: updatedSections });
  }, [onUpdate]);

  const handleUpdateSectionTitle = useCallback((sectionId: string, newTitle: string) => {
    const updatedSections = rfp.sections.map((section) =>
      section.id === sectionId ? { ...section, title: newTitle } : section
    );
    onUpdate({ sections: updatedSections });
  }, [rfp.sections, onUpdate]);

  const handleUpdateSectionContent = useCallback((content: string) => {
    if (!activeSectionId) return;

    const updatedSections = rfp.sections.map((section) =>
      section.id === activeSectionId
        ? { 
            ...section, 
            content,
            lastEditedAt: new Date().toISOString(),
            lastEditedBy: 'user' as const,
          }
        : section
    );
    onUpdate({ sections: updatedSections });
    setUnsavedSections((prev) => new Set(prev).add(activeSectionId));
  }, [activeSectionId, rfp.sections, onUpdate]);

  const handleSaveSection = useCallback(() => {
    if (!activeSectionId) return;

    const updatedSections = rfp.sections.map((section) =>
      section.id === activeSectionId
        ? { ...section, aiTextStatus: 'accepted' as const }
        : section
    );
    onUpdate({ sections: updatedSections });
    setUnsavedSections((prev) => {
      const next = new Set(prev);
      next.delete(activeSectionId);
      return next;
    });
    onSave();
  }, [activeSectionId, rfp.sections, onUpdate, onSave]);

  const handleAddSection = useCallback((type: 'text' | 'image') => {
    const newSection: RFPSectionContent = {
      id: `section-${Date.now()}`,
      type: 'appendices',
      title: type === 'image' ? 'Image Block' : 'New Section',
      number: String(rfp.sections.length + 1),
      content: type === 'image' 
        ? '<p>[Click to add an image]</p>' 
        : '<p>Enter content here...</p>',
      aiGenerated: false,
      aiTextStatus: 'pending',
      lastEditedBy: 'user',
      lastEditedAt: new Date().toISOString(),
      isHighlighted: false,
    };

    onUpdate({ sections: [...rfp.sections, newSection] });
    setActiveSectionId(newSection.id);
  }, [rfp.sections, onUpdate]);

  const handleCopilotMessage = useCallback((message: string) => {
    // Handle copilot messages - in production, this would interact with AI
  }, []);

  // Generate PDF via browser print (simulating Puppeteer behavior)
  const handleGeneratePDF = useCallback(async () => {
    setIsGeneratingPDF(true);
    
    // Open preview dialog first
    setIsPreviewOpen(true);
    
    // Wait for preview to render, then trigger print
    setTimeout(() => {
      window.print();
      setIsGeneratingPDF(false);
    }, 500);
  }, []);

  return (
    <div className="flex h-full bg-background">
      {/* Section Navigator - Left Sidebar */}
      <div
        className={cn(
          'border-r border-border bg-white transition-all duration-200 flex flex-col print:hidden',
          isNavCollapsed ? 'w-12' : 'w-64'
        )}
      >
        {isNavCollapsed ? (
          <div className="flex flex-col items-center py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNavCollapsed(false)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-end p-2 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsNavCollapsed(true)}
                className="h-6 w-6 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            <SectionNavigator
              sections={rfp.sections}
              activeSectionId={activeSectionId}
              onSelectSection={handleSelectSection}
              onReorderSections={handleReorderSections}
              onUpdateSectionTitle={handleUpdateSectionTitle}
              onAddSection={handleAddSection}
            />
          </>
        )}
      </div>

      {/* Main Editor Area - Distraction-free centered layout */}
      <div className="flex-1 flex flex-col min-w-0 print:hidden">
        {/* Top Toolbar */}
        <div className="px-6 py-3 border-b border-border bg-white">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-text-primary truncate">
                {rfp.title}
              </h1>
              <p className="text-xs text-text-muted">
                Reference: {rfp.referenceId} | Version {rfp.currentVersion}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(true)}
                className="gap-2 text-text-secondary"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview as HTML</span>
                <span className="sm:hidden">Preview</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="gap-2 text-text-secondary"
              >
                {isGeneratingPDF ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Generate PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
              <Button
                variant="outline"
                onClick={onSave}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              {onPublish && (
                <Button
                  onClick={onPublish}
                  disabled={isPublishing}
                  className="gap-2 bg-brand-green hover:bg-brand-green/90 text-white"
                >
                  {isPublishing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isPublishing ? 'Publishing...' : 'Publish RFP'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Section Editor - A4 scale, centered on screen */}
        <div className="flex-1 overflow-hidden bg-[#f0f0f0] flex items-start justify-center">
          {activeSection ? (
            <div className="h-full overflow-y-auto w-full">
              {/* A4 page: 794px at 96dpi, centered horizontally, white page background */}
              <div className="w-[794px] min-h-full bg-white shadow-sm">
                <SectionEditor
                  section={activeSection}
                  onUpdateContent={handleUpdateSectionContent}
                  onSaveSection={handleSaveSection}
                  isUnsaved={unsavedSections.has(activeSectionId || '')}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a section to begin editing</p>
                <p className="text-sm mt-1">Choose a section from the left sidebar</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Copilot Toggle Button */}
      {!isCopilotOpen && (
        <Button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed right-4 bottom-4 h-12 w-12 rounded-full bg-brand-green hover:bg-brand-green/90 text-white shadow-lg print:hidden"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      )}

      {/* Copilot Panel */}
      {isCopilotOpen && (
        <div className="w-80 border-l border-border bg-white flex flex-col print:hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-green" />
              <h3 className="text-sm font-semibold text-text-primary">
                AI Copilot
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCopilotOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <RFPCopilot
              rfp={rfp}
              onSendMessage={handleCopilotMessage}
            />
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border bg-white">
            <DialogTitle className="flex items-center justify-between">
              <span>RFP Preview</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="gap-2"
                >
                  {isGeneratingPDF ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  Generate PDF
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto bg-surface">
            <RFPPreview ref={previewRef} rfp={rfp} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
