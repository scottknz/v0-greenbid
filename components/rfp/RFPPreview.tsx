'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { RFPDocument } from '@/types/rfp';

interface RFPPreviewProps {
  rfp: RFPDocument;
  className?: string;
}

/**
 * RFP Preview Component
 * 
 * Renders the RFP document using Tailwind Typography (prose classes)
 * for consistent styling that matches PDF output via Puppeteer/Headless Chrome.
 * 
 * This component is used for:
 * 1. "Preview as HTML" viewing mode
 * 2. Supplier-facing RFP viewer
 * 3. PDF generation (printed via Puppeteer)
 */
export const RFPPreview = forwardRef<HTMLDivElement, RFPPreviewProps>(
  function RFPPreview({ rfp, className }, ref) {
    const submissionDeadline = rfp.projectInfo?.submissionDeadline;
    
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white min-h-screen print:bg-white',
          className
        )}
      >
        {/* PDF-ready document container */}
        <article className="max-w-3xl mx-auto px-8 py-12 print:px-12 print:py-8">
          {/* Document Header */}
          <header className="mb-12 pb-8 border-b-2 border-brand-green">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm text-text-muted uppercase tracking-widest mb-2 font-medium">
                  Request for Proposal
                </p>
                <h1 className="text-3xl font-bold text-text-primary leading-tight">
                  {rfp.title}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted uppercase tracking-wide">Reference</p>
                <p className="text-lg font-semibold text-text-primary">
                  {rfp.referenceId}
                </p>
              </div>
            </div>

            {/* Document Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mt-8">
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Category</p>
                <p className="font-medium text-text-primary">
                  {rfp.projectInfo?.category || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Submission Deadline</p>
                <p className="font-medium text-text-primary">
                  {submissionDeadline
                    ? new Date(submissionDeadline).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'To Be Determined'}
                </p>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Status</p>
                <p className="font-medium text-text-primary capitalize">
                  {rfp.status}
                </p>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Version</p>
                <p className="font-medium text-text-primary">
                  v{rfp.currentVersion}
                </p>
              </div>
            </div>
          </header>

          {/* Table of Contents */}
          <nav className="mb-12 print:break-after-page">
            <h2 className="text-xl font-bold text-text-primary mb-4 pb-2 border-b border-border">
              Table of Contents
            </h2>
            <ol className="space-y-2 text-sm">
              {rfp.sections.map((section, index) => (
                <li key={section.id} className="flex items-baseline">
                  <span className="w-8 text-brand-green font-semibold">
                    {section.number || index + 1}.
                  </span>
                  <a
                    href={`#section-${section.id}`}
                    className="text-text-primary hover:text-brand-green transition-colors"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Document Sections - rendered with Tailwind Typography */}
          <div className="space-y-10">
            {rfp.sections.map((section, index) => (
              <section
                key={section.id}
                id={`section-${section.id}`}
                className="scroll-mt-8 print:break-inside-avoid"
              >
                {/* Section Header */}
                <div className="flex items-baseline gap-3 mb-4 pb-2 border-b border-border">
                  <span className="text-xl font-bold text-brand-green">
                    {section.number || index + 1}.
                  </span>
                  <h2 className="text-xl font-bold text-text-primary">
                    {section.title}
                  </h2>
                </div>

                {/* Section Content - Tailwind Typography styling */}
                <div
                  className="prose prose-slate max-w-none 
                    prose-headings:text-text-primary prose-headings:font-semibold
                    prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                    prose-p:text-text-primary prose-p:leading-7 prose-p:my-4
                    prose-li:text-text-primary prose-li:leading-7
                    prose-strong:text-text-primary prose-strong:font-semibold
                    prose-a:text-brand-green prose-a:no-underline hover:prose-a:underline
                    prose-ul:my-4 prose-ol:my-4
                    prose-blockquote:border-l-brand-green prose-blockquote:text-text-secondary
                    prose-code:text-brand-green prose-code:bg-surface prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-hr:border-border"
                  dangerouslySetInnerHTML={{ 
                    __html: section.content || '<p class="text-text-muted italic">No content yet.</p>' 
                  }}
                />
              </section>
            ))}
          </div>

          {/* Document Footer */}
          <footer className="mt-16 pt-8 border-t-2 border-brand-green text-sm text-text-muted print:mt-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-text-primary">Generated by Greenbid</p>
                <p className="mt-1">
                  Last updated: {new Date(rfp.updatedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="text-right">
                <p>Document ID: {rfp.id}</p>
                <p>Version: {rfp.currentVersion}</p>
              </div>
            </div>
            <p className="mt-6 text-xs text-center text-text-muted">
              This document is confidential and intended solely for the named recipient.
            </p>
          </footer>
        </article>

        {/* Print styles */}
        <style>{`
          @media print {
            @page {
              margin: 1in;
              size: letter;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}</style>
      </div>
    );
  }
);
