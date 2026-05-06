'use client'

import { usePathname } from 'next/navigation'
import { DashboardShell } from './DashboardShell'

export function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Determine variant based on pathname
  const variant = pathname.startsWith('/supplier') ? 'supplier' : 'buyer'
  
  return (
    <DashboardShell variant={variant}>
      {children}
    </DashboardShell>
  )
}
