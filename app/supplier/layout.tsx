/**
 * Supplier Layout
 * 
 * Root layout for all supplier routes (/supplier/*)
 * 
 * Wraps all supplier pages with:
 * - DashboardShell: Navigation sidebar, chat panel, settings modal
 * - Role-specific navigation (shows only supplier-relevant menu items)
 * - Chat and messaging UI
 * 
 * Separate Routes from Buyer:
 * - /supplier/rfps - Browse available RFPs
 * - /supplier/marketplace - View procurement opportunities
 * - /supplier/messages, /supplier/team, /supplier/library - Shared features
 * 
 * Authentication Note:
 * This route currently has no auth protection. Add middleware in the future to:
 * - Redirect unauthenticated users to /login
 * - Verify user role is 'supplier'
 * 
 * See /app/middleware.ts for auth implementation (when ready)
 */

import { DashboardShell } from '@/components/shell/DashboardShell'

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell variant="supplier">
      {children}
    </DashboardShell>
  )
}

