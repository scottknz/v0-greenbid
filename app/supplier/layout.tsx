import { DashboardShell } from '@/components/shell/DashboardShell'

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell variant="supplier">
      {children}
    </DashboardShell>
  )
}

