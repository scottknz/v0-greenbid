'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RFPEditor } from '@/components/rfp/RFPEditor';
import { getRFPById, updateRFP, createRFPVersion, saveRFP } from '@/lib/mock-rfp';
import { RFPDocument } from '@/types/rfp';
import { Loader2, FileText, Settings, MessageSquare, ClipboardList, Edit3, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'template', label: 'Select Template', icon: FileText },
  { id: 'setup', label: 'Project Details', icon: Settings },
  { id: 'interview', label: 'AI Interview', icon: MessageSquare },
  { id: 'questions', label: 'Submission Questions', icon: ClipboardList },
  { id: 'editor', label: 'Edit Document', icon: Edit3 },
];

export default function RFPEditPage() {
  const params = useParams();
  const router = useRouter();
  const rfpId = params.id as string;
  const [rfp, setRfp] = useState<RFPDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  // Current step index - editor is step 4 (index 4)
  const currentStepIndex = 4;

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

  const handleUpdate = (updates: Partial<RFPDocument>) => {
    if (!rfp) return;
    const updated = { ...rfp, ...updates };
    setRfp(updated);
    // Update in store
    updateRFP(rfp.id, updated);
  };

  const handleSave = () => {
    if (!rfp) return;
    // Create a new version
    const updated = createRFPVersion(rfp.id, rfp);
    if (updated) {
      setRfp(updated);
    }
  };

  const handlePublish = async () => {
    if (!rfp) return;
    setIsPublishing(true);
    
    // Update status to published
    const updated = { 
      ...rfp, 
      status: 'published' as const,
      updatedAt: new Date().toISOString(),
    };
    updateRFP(rfp.id, updated);
    
    // Navigate to the RFP detail page or tenders list
    setTimeout(() => {
      router.push('/buyer/tenders');
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green mx-auto mb-4" />
          <div className="text-lg font-medium text-text-primary">Loading RFP...</div>
        </div>
      </div>
    );
  }

  if (!rfp) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="text-lg font-medium text-text-primary mb-4">RFP not found</div>
          <Link href="/buyer/tenders">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to RFPs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Progress Steps - Fixed at top */}
      <div className="border-b border-border bg-surface shrink-0">
        <div className="mx-auto max-w-5xl px-6 py-3">
          <nav className="flex items-center justify-center gap-4">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-brand-green text-white'
                        : isCompleted
                        ? 'bg-brand-green-light text-brand-green'
                        : 'bg-surface-hover text-text-muted'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium hidden md:block',
                      isActive ? 'text-text-primary' : 'text-text-muted'
                    )}
                  >
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'ml-2 h-px w-6 lg:w-10',
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

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <RFPEditor 
          rfp={rfp} 
          onUpdate={handleUpdate}
          onSave={handleSave}
          onPublish={handlePublish}
          isPublishing={isPublishing}
        />
      </div>
    </div>
  );
}
