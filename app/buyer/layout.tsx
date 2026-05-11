/**
 * Buyer Layout
 * 
 * Root layout for all buyer routes (/buyer/*)
 * 
 * Wraps all buyer pages with:
 * - DashboardShell: Navigation sidebar, chat panel, settings modal
 * - Role-specific navigation (shows only buyer-relevant menu items)
 * - Chat and messaging UI
 * 
 * Authentication Note:
 * This route currently has no auth protection. Add middleware in the future to:
 * - Redirect unauthenticated users to /login
 * - Verify user role is 'buyer'
 * 
 * See /app/middleware.ts for auth implementation (when ready)
 */

import { DashboardShell } from '@/components/shell/DashboardShell'

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell variant="buyer">
      {children}
    </DashboardShell>
  )
}

