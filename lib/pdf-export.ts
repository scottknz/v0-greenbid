import { RFP } from '@/types/rfp';

/**
 * Generate PDF from RFP using print-to-PDF or external service
 * For now, this provides helper functions for PDF generation
 */

export async function downloadRFPAsPDF(rfp: RFP, filename?: string) {
  const name = filename || `${rfp.title.replace(/\s+/g, '-')}-${rfp.id}.pdf`;
  
  try {
    // Method 1: Client-side using print dialog
    if (typeof window !== 'undefined') {
      // Create a new window with the RFP content
      const printWindow = window.open(`/rfp/${rfp.id}/preview`, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

/**
 * Generate PDF using server-side rendering if needed
 * This would be called from a server action or API route
 */
export async function generateRFPPDFServer(rfpId: string) {
  try {
    // This would be implemented server-side using puppeteer, wkhtmltopdf, or similar
    // For now, return a placeholder
    const response = await fetch(`/api/rfp/${rfpId}/pdf`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Failed to generate PDF on server:', error);
    throw error;
  }
}

/**
 * Helper to format RFP content for PDF
 */
export function formatRFPForPDF(rfp: RFP): string {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${rfp.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20mm;
        }
        h1 { 
          font-size: 28px; 
          color: #16a34a;
          margin-bottom: 20px;
        }
        h2 { 
          font-size: 20px; 
          color: #16a34a;
          border-bottom: 2px solid #16a34a;
          padding-bottom: 10px;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        h3 { 
          font-size: 16px; 
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .cover-page {
          text-align: center;
          padding: 60px 0;
          page-break-after: always;
        }
        .toc {
          page-break-after: always;
        }
        .section {
          margin-bottom: 30px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ccc;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        @page {
          margin: 20mm;
          size: A4;
        }
        @media print {
          body { margin: 0; padding: 0; }
        }
      </style>
    </head>
    <body>
  `;

  // Cover page
  html += `
    <div class="cover-page">
      <h1>${rfp.title}</h1>
      <p style="font-size: 18px; margin: 30px 0;">${rfp.companyName}</p>
      <p style="color: #666; margin: 20px 0;">${rfp.projectDescription}</p>
      <div style="margin-top: 60px; color: #999; font-size: 12px;">
        <p>Issued: ${new Date(rfp.createdAt).toLocaleDateString()}</p>
        <p>Submission Deadline: ${new Date(rfp.submissionDeadline).toLocaleDateString()}</p>
      </div>
    </div>
  `;

  // Table of Contents
  html += `
    <div class="toc">
      <h2>Table of Contents</h2>
      <ol>
  `;
  rfp.sections.forEach((section) => {
    html += `<li>${section.title}</li>`;
  });
  html += `</ol></div>`;

  // Content sections
  rfp.sections.forEach((section, index) => {
    html += `
      <div class="section">
        <h2>${index + 1}. ${section.title}</h2>
        <div>${section.content || ''}</div>
    `;

    if (section.subsections && section.subsections.length > 0) {
      section.subsections.forEach((subsection, subIndex) => {
        html += `
          <h3>${index + 1}.${subIndex + 1} ${subsection.title}</h3>
          <div>${subsection.content}</div>
        `;
      });
    }

    html += `</div>`;
  });

  // Footer
  html += `
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${rfp.companyName}. All rights reserved.</p>
      <p>This is a confidential document.</p>
    </div>
  `;

  html += `
    </body>
    </html>
  `;

  return html;
}
