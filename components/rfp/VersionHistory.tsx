'use client';

import { RFPDocument, RFPVersion } from '@/types/rfp';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Clock, RotateCcw, Trash2, ChevronDown } from 'lucide-react';

interface VersionHistoryProps {
  rfp: RFPDocument;
  onRestore: (version: RFPVersion) => void;
}

export function VersionHistory({ rfp, onRestore }: VersionHistoryProps) {
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);

  if (!rfp.versions || rfp.versions.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 text-text-muted-foreground mx-auto mb-2" />
        <p className="text-text-muted-foreground">No version history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-text-primary">
        Version History ({rfp.versions.length} / 3 saved)
      </div>
      
      {rfp.versions.map((version, index) => (
        <Card key={`version-${version.version}`} className="p-4">
          <button
            onClick={() => setExpandedVersion(
              expandedVersion === `v-${version.version}` ? null : `v-${version.version}`
            )}
            className="w-full flex items-center justify-between hover:bg-muted/50 p-2 rounded transition-colors"
          >
            <div className="text-left flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-primary">
                  Version {rfp.versions.length - index}
                </span>
                {index === 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted-foreground mt-1">
                Saved {format(new Date(version.savedAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-text-muted-foreground transition-transform ${
                expandedVersion === `v-${version.version}` ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedVersion === `v-${version.version}` && (
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <div className="text-sm text-text-muted-foreground">
                <p>Sections: {version.sections.length}</p>
                <p>Last updated by: System</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRestore(version)}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}

      <div className="text-xs text-text-muted-foreground pt-2">
        Only the 3 most recent versions are kept
      </div>
    </div>
  );
}
