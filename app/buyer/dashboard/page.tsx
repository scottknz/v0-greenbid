"use client";

import React from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { DataTable } from '@/components/dashboard/DataTable';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
  FileText, AlertCircle, Users, Award, Clock,
  MoreHorizontal, Plus
} from 'lucide-react';
import { 
  mockDashboardTenders, 
  mockDashboardActivities, 
  mockDashboardStats,
  type DashboardTenderRow 
} from '@/lib/mock-dashboard';

const tenderColumns = [
  {
    key: 'name',
    header: 'RFP Name',
    cell: (row: DashboardTenderRow) => (
      <Link href={`/buyer/tenders/${row.id}`} className="font-medium text-text-primary hover:text-brand-green hover:underline">
        {row.name}
      </Link>
    ),
    className: 'w-[40%]',
  },
  {
    key: 'status',
    header: 'Status',
    cell: (row: DashboardTenderRow) => <StatusBadge status={row.status} />,
  },
  {
    key: 'deadline',
    header: 'Deadline',
    cell: (row: DashboardTenderRow) => (
      <span className={row.isNearingDeadline ? 'text-warning font-medium flex items-center gap-1.5' : ''}>
        {row.isNearingDeadline && <Clock className="h-3 w-3" />}
        {row.deadline}
      </span>
    ),
  },
  {
    key: 'suppliers',
    header: 'Suppliers',
    cell: (row: DashboardTenderRow) => row.suppliers.toString(),
  },
  {
    key: 'score',
    header: 'Score',
    cell: (row: DashboardTenderRow) => (
      row.score ? <span className="text-text-secondary">{row.score}</span> : <span className="text-text-muted">-</span>
    ),
  },
  {
    key: 'actions',
    header: '',
    cell: () => (
      <button className="rounded hover:bg-surface-hover p-1 text-text-muted transition-colors" aria-label="More actions">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    ),
    className: 'text-right',
  },
];

export default function BuyerDashboardPage() {
  return (
    <div className="flex flex-col min-h-full p-6 space-y-6">
      <PageHeader
        title="Dashboard"
        actions={
          <Link href="/buyer/rfp/create">
            <Button className="bg-brand-green hover:bg-brand-green-mid text-white gap-2">
              <Plus className="h-4 w-4" />
              Create RFP
            </Button>
          </Link>
        }
      />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active RFPs" value={mockDashboardStats.activeRFPs} icon={FileText} valueColor="text-brand-green" />
          <StatCard title="Awaiting Review" value={mockDashboardStats.awaitingReview} icon={AlertCircle} valueColor="text-warning" trend="up" trendValue={`+${mockDashboardStats.awaitingReviewChange}`} trendLabel="since yesterday" />
          <StatCard title="Suppliers Invited" value={mockDashboardStats.suppliersInvited} icon={Users} valueColor="text-info" />
          <StatCard title="Awarded YTD" value={mockDashboardStats.awardedYTD} icon={Award} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-text-primary">Active RFPs</h2>
              <DataTable
                data={mockDashboardTenders}
                columns={tenderColumns}
                keyExtractor={(row) => row.id}
              />
            </div>
          </div>

          <div className="space-y-6">
            <ActivityFeed
              title="Recent Activity"
              items={mockDashboardActivities}
            />
            
            <div className="rounded-lg border border-border bg-background p-5 shadow-card">
              <h2 className="text-sm font-semibold text-text-primary mb-4">Upcoming Deadlines</h2>
              <ul className="space-y-4">
                <li className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-medium text-text-primary leading-tight">Scope 3 Emissions Audit</p>
                    <p className="text-xs text-warning mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 2 days remaining
                    </p>
                  </div>
                  <StatusBadge status="open_for_proposals" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
