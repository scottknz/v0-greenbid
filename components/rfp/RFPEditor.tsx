'use client';

import { useState, useCallback } from 'react';
import { SectionNavigator } from './SectionNavigator';
import { SectionEditor } from './SectionEditor';
import { RFPCopilot } from './RFPCopilot';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  MessageSquare,
  X,
  Save,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import type { RFPDocument, RFPSectionContent } from '@/types/rfp';

interface RFPEditorProps {
  rfp: RFPDocument;
  onUpdate: (updates: Partial<RFPDocument>) => void;
  onSave: () => void;
}

export function RFPEditor({ rfp, onUpdate, onSave }: RFPEditorProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    rfp.sections[0]?.id || null
  );
  const [unsavedSections, setUnsavedSections] = useState<Set<string>>(new Set());
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const activeSection = rfp.sections.find((s) => s.id === activeSectionId) || null;

  const handleSelectSection = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
  }, []);

  const handleReorderSections = useCallback((newSections: RFPSectionContent[]) => {
    // Update section numbers after reorder
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      number: String(index + 1),
    }));
    onUpdate({ sections: updatedSections });
  }, [onUpdate]);

  const handleUpdateSectionTitle = useCallback((sectionId: string, newTitle: string) => {
    const updatedSections = rfp.sections.map((section) =>
      section.id === sectionId
        ? { ...section, title: newTitle }
        : section
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
        ? { 
            ...section, 
            aiTextStatus: 'accepted' as const,
          }
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
      type: 'appendices', // Default type for custom sections
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
    console.log('[v0] Copilot message:', message);
  }, []);

  const handleExportPDF = useCallback(() => {
    // Generate PDF content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${rfp.title}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 40px;
              line-height: 1.6;
            }
            h1 { 
              font-size: 24px; 
              border-bottom: 2px solid #333; 
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            h2 { 
              font-size: 18px; 
              margin-top: 30px;
              color: #222;
            }
            h3 { 
              font-size: 14px; 
              margin-top: 20px;
              color: #333;
            }
            p { margin: 10px 0; }
            ul, ol { margin: 10px 0; padding-left: 30px; }
            img { max-width: 100%; height: auto; margin: 15px 0; }
            .section { margin-bottom: 30px; page-break-inside: avoid; }
            .metadata { 
              color: #666; 
              font-size: 12px; 
              margin-bottom: 30px;
            }
            @media print {
              body { padding: 20px; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>${rfp.title}</h1>
          <div class="metadata">
            <p>Reference: ${rfp.referenceId || 'N/A'}</p>
            <p>Category: ${rfp.category || 'N/A'}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          ${rfp.sections.map(section => `
            <div class="section">
              <h2>${section.number}. ${section.title}</h2>
              ${section.content || '<p><em>No content</em></p>'}
            </div>
          `).join('')}
        </body>
      </html>
    `;

    // Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  }, [rfp]);

  return (
    <div className="flex h-full bg-background">
      {/* Section Navigator - Left Sidebar */}
      <div
        className={cn(
          'border-r border-border bg-white transition-all duration-200 flex flex-col',
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
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-green" />
                <span className="text-sm font-medium text-text-primary">Sections</span>
              </div>
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

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-white">
          <div>
            <h1 className="text-lg font-semibold text-text-primary truncate">
              {rfp.title}
            </h1>
            <p className="text-xs text-text-muted">
              Reference: {rfp.referenceId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-text-secondary"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-text-secondary"
              onClick={handleExportPDF}
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button
              onClick={onSave}
              className="gap-2 bg-brand-green hover:bg-brand-green/90 text-white"
            >
              <Save className="w-4 h-4" />
              Save All
            </Button>
          </div>
        </div>

        {/* Section Editor */}
        <div className="flex-1 overflow-hidden">
          {activeSection ? (
            <SectionEditor
              section={activeSection}
              onUpdateContent={handleUpdateSectionContent}
              onSaveSection={handleSaveSection}
              isUnsaved={unsavedSections.has(activeSectionId || '')}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted">
              <p>Select a section to begin editing</p>
            </div>
          )}
        </div>
      </div>

      {/* Copilot Toggle Button */}
      {!isCopilotOpen && (
        <Button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed right-4 bottom-4 h-12 w-12 rounded-full bg-brand-green hover:bg-brand-green/90 text-white shadow-lg z-50"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      )}

      {/* Copilot Panel */}
      {isCopilotOpen && (
        <div className="w-80 border-l border-border bg-white flex flex-col">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>RFP Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto bg-white p-8 border rounded-lg">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold text-text-primary border-b-2 border-text-primary pb-3 mb-4">
                {rfp.title}
              </h1>
              <div className="text-sm text-text-muted mb-8">
                <p>Reference: {rfp.referenceId || 'N/A'}</p>
                <p>Category: {rfp.category || 'N/A'}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
              </div>
              {rfp.sections.map((section) => (
                <div key={section.id} className="mb-8">
                  <h2 className="text-lg font-semibold text-text-primary mb-3">
                    {section.number}. {section.title}
                  </h2>
                  <div 
                    className="prose prose-sm max-w-none text-text-secondary"
                    dangerouslySetInnerHTML={{ __html: section.content || '<em>No content</em>' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
