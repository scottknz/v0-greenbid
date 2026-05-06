'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getRFPById } from '@/lib/mock-rfp';
import { RFP } from '@/types/rfp';
import { RFPPreview } from '@/components/rfp/RFPPreview';
import { Button } from '@/components/ui/button';
import { X, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RFPPreviewPage() {
  const params = useParams();
  const rfpId = params.id as string;
  const [rfp, setRfp] = useState<RFP | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRFP = async () => {
      try {
        const data = getRFPById(rfpId);
        setRfp(data);
      } catch (error) {
        console.error('Failed to load RFP:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRFP();
  }, [rfpId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-lg font-medium text-text-primary">Loading preview...</div>
      </div>
    );
  }

  if (!rfp) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-lg font-medium text-text-primary">RFP not found</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href={`/rfp/${rfpId}/edit`} className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => window.print()}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex justify-center py-8 px-4 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ width: '8.5in' }}>
          <RFPPreview rfp={rfp} />
        </div>
      </div>
    </div>
  );
}
