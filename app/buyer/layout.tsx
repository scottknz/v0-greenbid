import { DashboardShell } from '@/components/shell/DashboardShell'

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell variant="buyer">
      {children}
    </DashboardShell>
  )
}

