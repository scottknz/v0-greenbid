'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardShell } from '@/components/shell/DashboardShell';
import { RFPEditor } from '@/components/rfp/RFPEditor';
import { getRFPById, updateRFP, createRFPVersion, saveRFP } from '@/lib/mock-rfp';
import { RFPDocument } from '@/types/rfp';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RFPEditPage() {
  const params = useParams();
  const rfpId = params.id as string;
  const [rfp, setRfp] = useState<RFPDocument | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-green mx-auto mb-4" />
            <div className="text-lg font-medium text-text-primary">Loading RFP...</div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!rfp) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-lg font-medium text-text-primary mb-4">RFP not found</div>
            <Link href="/tenders">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to RFPs
              </Button>
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="h-full">
        <RFPEditor 
          rfp={rfp} 
          onUpdate={handleUpdate}
          onSave={handleSave}
        />
      </div>
    </DashboardShell>
  );
}
