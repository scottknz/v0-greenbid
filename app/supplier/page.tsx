'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared'
import { TrendingUp, FileText, Clock, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function SupplierDashboard() {
  // Mock data
  const stats = {
    activeRFPs: 5,
    pendingSubmissions: 2,
    upcomingDeadline: '3 days',
    submittedProposals: 12,
    awardedContracts: 3,
    winRate: '25%',
  }

  const upcomingDeadlines = [
    { id: 1, title: 'Sustainable Packaging RFP', buyer: 'EcoRetail Inc', deadline: '2 days', rfpId: '1' },
    { id: 2, title: 'Supply Chain Audit Services', buyer: 'GreenLogistics Ltd', deadline: '5 days', rfpId: '2' },
    { id: 3, title: 'Carbon Reporting Tools', buyer: 'NetZero Corp', deadline: '10 days', rfpId: '3' },
  ]

  const recentActivity = [
    { id: 1, type: 'submitted', title: 'Proposal submitted for "Sustainable Packaging RFP"', time: '2 hours ago' },
    { id: 2, type: 'approved', title: 'Registration approved for "Supply Chain Audit Services"', time: '1 day ago' },
    { id: 3, type: 'message', title: 'New message from EcoRetail Inc', time: '2 days ago' },
    { id: 4, type: 'question', title: 'Question answered: Technical specifications clarified', time: '3 days ago' },
  ]

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's your RFP overview."
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-background border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-green" />
              Active RFPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text-primary">{stats.activeRFPs}</div>
            <p className="text-xs text-text-muted mt-2">Currently responding to</p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Pending Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text-primary">{stats.pendingSubmissions}</div>
            <p className="text-xs text-text-muted mt-2">Awaiting deadline</p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Urgent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text-primary">{stats.upcomingDeadline}</div>
            <p className="text-xs text-text-muted mt-2">Next deadline</p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-green" />
              Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text-primary">{stats.submittedProposals}</div>
            <p className="text-xs text-text-muted mt-2">Total proposals</p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-green" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text-primary">{stats.winRate}</div>
            <p className="text-xs text-text-muted mt-2">{stats.awardedContracts} contracts awarded</p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text-primary">3</div>
            <p className="text-xs text-text-muted mt-2">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <div className="lg:col-span-2">
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>RFPs with approaching submission dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-surface-hover transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary">{item.title}</h4>
                      <p className="text-sm text-text-muted mt-1">{item.buyer}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-medium text-orange-600">{item.deadline}</p>
                      <Link href={`/supplier/rfps/${item.rfpId}`}>
                        <Button size="sm" variant="outline" className="mt-2">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/supplier/rfps" className="block">
                <Button className="w-full bg-brand-green hover:bg-brand-green/90 text-white">
                  View All RFPs
                </Button>
              </Link>
              <Link href="/marketplace" className="block">
                <Button variant="outline" className="w-full">
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/supplier/library" className="block">
                <Button variant="outline" className="w-full">
                  My Library
                </Button>
              </Link>
              <Link href="/supplier/messages" className="block">
                <Button variant="outline" className="w-full">
                  Messages
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest platform actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="mt-1">
                  {activity.type === 'submitted' && <CheckCircle2 className="h-5 w-5 text-brand-green" />}
                  {activity.type === 'approved' && <CheckCircle2 className="h-5 w-5 text-brand-green" />}
                  {activity.type === 'message' && <MessageSquare className="h-5 w-5 text-blue-500" />}
                  {activity.type === 'question' && <AlertCircle className="h-5 w-5 text-orange-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{activity.title}</p>
                  <p className="text-xs text-text-muted mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
