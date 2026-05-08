import { DashboardShell } from '@/components/shell/DashboardShell'

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell variant="supplier">
      {children}
    </DashboardShell>
  )
}
