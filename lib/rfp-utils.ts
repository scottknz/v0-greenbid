// Generate auto-formatted Reference ID
// Format: First 4 letters of company name + Year + Sequential number
// Example: GREE2026001 for "Greenbid" in 2026, first RFP

export function generateReferenceId(companyName: string, sequenceNumber: number = 1): string {
  const companyPrefix = companyName
    .substring(0, 4)
    .toUpperCase()
    .replace(/[^A-Z]/g, ''); // Remove non-letters, keep only first 4

  const year = new Date().getFullYear();
  const sequence = String(sequenceNumber).padStart(3, '0'); // Pad to 3 digits

  return `${companyPrefix}${year}${sequence}`;
}

// For mock/demo purposes - get company branding info
// In production, this would fetch from user's settings/context
export function getCompanyName(): string {
  // TODO: Replace with actual company settings from context/session
  return 'Greenbid';
}

export function getNextRFPSequenceNumber(): number {
  // TODO: Replace with actual lookup from database
  // For now, increment based on existing RFPs in session
  return 1;
}
