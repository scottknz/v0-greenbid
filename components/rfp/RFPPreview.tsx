'use client';

import { RFP } from '@/types/rfp';
import { format } from 'date-fns';

interface RFPPreviewProps {
  rfp: RFP;
}

export function RFPPreview({ rfp }: RFPPreviewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-12 bg-white text-black print:p-0">
      {/* Cover Page */}
      <div className="flex flex-col items-center justify-center min-h-screen mb-12 border-b-4 border-primary pb-12">
        <div className="text-center space-y-8">
          {/* Company Logo Placeholder */}
          <div className="w-24 h-24 mx-auto bg-gray-200 rounded flex items-center justify-center text-gray-400">
            Logo
          </div>
          
          <h1 className="text-5xl font-bold text-primary">{rfp.title}</h1>
          
          <div className="space-y-2 text-gray-700">
            <p className="text-lg">{rfp.companyName}</p>
            <p className="text-sm">{rfp.projectDescription}</p>
          </div>

          <div className="space-y-1 text-sm text-gray-600 pt-8">
            <p>Document Reference: {rfp.id}</p>
            <p>Issued: {format(new Date(rfp.createdAt), 'MMMM d, yyyy')}</p>
            <p>Submission Deadline: {format(new Date(rfp.submissionDeadline), 'MMMM d, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="mb-12 page-break">
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-primary pb-3">Table of Contents</h2>
        <ul className="space-y-2 text-sm">
          {rfp.sections.map((section, index) => (
            <li key={section.id} className="flex justify-between">
              <span>{index + 1}. {section.title}</span>
              <span className="text-gray-400">{index + 2}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Sections */}
      {rfp.sections.map((section, sectionIndex) => (
        <div key={section.id} className="mb-12 page-break">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary pb-2">
            {sectionIndex + 1}. {section.title}
          </h2>
          
          <div className="space-y-4 text-gray-800 leading-relaxed">
            {section.content && (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            )}
          </div>

          {section.subsections && section.subsections.length > 0 && (
            <div className="mt-6 space-y-4">
              {section.subsections.map((subsection, subIndex) => (
                <div key={subsection.id}>
                  <h3 className="text-lg font-semibold mb-2">
                    {sectionIndex + 1}.{subIndex + 1} {subsection.title}
                  </h3>
                  <div 
                    className="text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: subsection.content }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-300 text-center text-xs text-gray-600 page-break">
        <p>This is a confidential document and is intended solely for the use of the named recipient.</p>
        <p className="mt-2">© {new Date().getFullYear()} {rfp.companyName}. All rights reserved.</p>
        <p className="mt-4 text-gray-400">Page: <span className="page-number">1</span></p>
      </div>

      <style>{`
        @media print {
          .page-break {
            page-break-after: always;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
