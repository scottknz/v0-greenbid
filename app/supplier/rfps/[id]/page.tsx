'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock RFP detail data
const mockRFPDetail = {
  id: 'rfp-001',
  title: 'Comprehensive Scope 3 Value Chain Emissions Analysis',
  buyerCompany: 'Thistle Company',
  buyerContact: {
    name: 'Emma Thompson',
    email: 'emma@thistle.com',
    phone: '+44 207 123 4567',
  },
  status: 'in_progress',
  submissionStatus: 'draft',
  registeredAt: '2026-03-15',
  deadline: '2026-04-30',
  budget: '$150,000 - $200,000',
  estimatedValue: 175000,
  category: 'Sustainability',
  completionPercent: 65,
  description:
    'We are seeking a sustainability consultant to conduct a comprehensive Scope 3 emissions analysis across our entire value chain. This includes supplier emissions, transportation, waste, and end-of-life product analysis.',
  requirements: [
    'Deep expertise in Scope 3 emissions methodology',
    'Experience with supply chain carbon accounting',
    'Knowledge of GHG Protocol standards',
    'Ability to conduct supplier engagement and data collection',
    'Experience with carbon accounting software (e.g., Catena-X, Sphera)',
  ],
  deliverables: [
    'Baseline Scope 3 emissions inventory',
    'Category-wise breakdown and analysis',
    'Hotspot identification report',
    'Recommendations for reduction strategies',
    'Executive summary for stakeholders',
  ],
  documents: [
    { name: 'RFP_Scope3_Analysis_2026.pdf', size: '2.4 MB', uploadedAt: '2026-03-15' },
    { name: 'Company_Background.docx', size: '1.2 MB', uploadedAt: '2026-03-15' },
    { name: 'Technical_Specifications.xlsx', size: '850 KB', uploadedAt: '2026-03-16' },
  ],
  timeline: [
    { phase: 'Proposal Submission', date: '2026-04-30' },
    { phase: 'Vendor Shortlisting', date: '2026-05-15' },
    { phase: 'Interviews', date: '2026-05-20' },
    { phase: 'Contract Negotiation', date: '2026-06-01' },
    { phase: 'Project Start', date: '2026-06-15' },
  ],
}

const STATUS_CONFIG = {
  invited: { label: 'Invited', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-800', icon: Clock },
  submitted: { label: 'Submitted', color: 'bg-purple-100 text-purple-800', icon: FileText },
  awarded: { label: 'Awarded', color: 'bg-[#F0FDF4] text-[#16A34A]', icon: CheckCircle },
  rejected: { label: 'Not Selected', color: 'bg-grey-100 text-grey-600', icon: AlertCircle },
}

const SUBMISSION_STATUS_CONFIG = {
  not_started: { label: 'Not Started', color: 'bg-grey-100 text-grey-700' },
  draft: { label: 'Draft', color: 'bg-amber-100 text-amber-700' },
  submitted: { label: 'Submitted', color: 'bg-[#F0FDF4] text-[#16A34A]' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  awarded: { label: 'Awarded', color: 'bg-green-100 text-green-700' },
}

export default function RFPDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [responseText, setResponseText] = useState('')

  const rfp = mockRFPDetail
  const statusConfig = STATUS_CONFIG[rfp.status as keyof typeof STATUS_CONFIG]
  const submissionConfig = SUBMISSION_STATUS_CONFIG[rfp.submissionStatus as keyof typeof SUBMISSION_STATUS_CONFIG]
  const StatusIcon = statusConfig.icon

  return (
    <div className="space-y-6 p-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{rfp.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Building2 className="h-4 w-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">{rfp.buyerCompany}</span>
          </div>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge className={cn('text-sm font-medium gap-1.5', statusConfig.color)}>
          <StatusIcon className="h-3.5 w-3.5" />
          {statusConfig.label}
        </Badge>
        <Badge className={cn('text-sm font-medium', submissionConfig.color)}>
          Submission: {submissionConfig.label}
        </Badge>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-text-secondary">Submission Deadline</p>
                    <p className="text-sm font-medium text-text-primary">
                      {new Date(rfp.deadline).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-text-secondary">Budget Range</p>
                    <p className="text-sm font-medium text-text-primary">{rfp.budget}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-2 border-t border-border">
                <FileText className="h-4 w-4 text-text-secondary mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-text-secondary">Category</p>
                  <p className="text-sm font-medium text-text-primary">{rfp.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About This RFP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-primary leading-relaxed">{rfp.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {rfp.requirements.map((req, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-text-primary">
                    <span className="text-[#16A34A] font-bold">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {rfp.deliverables.map((deliverable, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-text-primary">
                    <span className="text-[#16A34A] font-bold">•</span>
                    {deliverable}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rfp.timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-[#16A34A]" />
                      {idx !== rfp.timeline.length - 1 && (
                        <div className="h-8 w-0.5 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <p className="text-sm font-medium text-text-primary">{item.phase}</p>
                      <p className="text-xs text-text-secondary">
                        {new Date(item.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">RFP Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {rfp.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-background transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 text-text-secondary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{doc.name}</p>
                      <p className="text-xs text-text-secondary">{doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Internal Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Internal Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-text-secondary mb-1">Name</p>
                <p className="text-sm font-medium text-text-primary">{rfp.buyerContact.name}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Email</p>
                <button
                  onClick={() => {
                    router.push(`/supplier/messages?compose=true&to=${encodeURIComponent(rfp.buyerContact.name)}&email=${encodeURIComponent(rfp.buyerContact.email)}`)
                  }}
                  className="text-sm text-[#16A34A] hover:underline"
                >
                  {rfp.buyerContact.email}
                </button>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Phone</p>
                <a href={`tel:${rfp.buyerContact.phone}`} className="text-sm font-medium text-text-primary">
                  {rfp.buyerContact.phone}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Submission Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                  <span>Completion</span>
                  <span className="font-semibold">{rfp.completionPercent}%</span>
                </div>
                <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] rounded-full transition-all"
                    style={{ width: `${rfp.completionPercent}%` }}
                  />
                </div>
              </div>
              {rfp.submissionStatus === 'draft' && (
                <Button className="w-full bg-[#16A34A] hover:bg-[#15803D]" size="sm">
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Continue Response
                </Button>
              )}
              {rfp.submissionStatus === 'submitted' && (
                <Button variant="outline" className="w-full" size="sm" disabled>
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  Response Submitted
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download RFP
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Share
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
