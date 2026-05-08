'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  Award,
  TrendingUp,
  FileText,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Globe,
  Building2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { mockMarketplaceRFPs } from '@/lib/mock-marketplace'
import { AddToRFPsModal } from '@/components/marketplace/AddToRFPsModal'

function getDaysUntil(deadline: string) {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
}

function CredentialBadge({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: 'green' | 'blue' | 'amber' | 'red' | 'neutral' }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium rounded-lg px-2.5 py-1 border',
      variant === 'green' && 'bg-[#F0FDF4] text-[#166534] border-[#16A34A]/20',
      variant === 'blue' && 'bg-blue-50 text-blue-800 border-blue-200',
      variant === 'amber' && 'bg-amber-50 text-amber-800 border-amber-200',
      variant === 'red' && 'bg-red-50 text-red-800 border-red-200',
      variant === 'neutral' && 'bg-gray-50 text-text-secondary border-border',
    )}>
      {children}
    </span>
  )
}

export default function MarketplaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const rfp = mockMarketplaceRFPs.find(r => r.id === id)

  const [saved, setSaved] = useState(false)
  const [showModal, setShowModal] = useState(false)

  if (!rfp) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-sm text-text-muted">Opportunity not found.</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>
      </div>
    )
  }

  const days = getDaysUntil(rfp.deadline)
  const critical = days <= 7
  const urgent = days <= 14

  const handleSaveClick = () => {
    if (saved) {
      setSaved(false)
    } else {
      setShowModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Link
            href="/marketplace"
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveClick}
              className={cn(saved && 'border-[#16A34A] text-[#16A34A] bg-[#F0FDF4]')}
            >
              {saved ? <BookmarkCheck className="h-4 w-4 mr-1.5" /> : <Bookmark className="h-4 w-4 mr-1.5" />}
              {saved ? 'Saved to Pipeline' : 'Add to My RFP Pipeline'}
            </Button>
            <Button
              size="sm"
              className="bg-[#16A34A] hover:bg-[#15803D]"
              onClick={() => { if (!saved) setShowModal(true) }}
            >
              Register Interest
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              {/* Buyer */}
              <div className="flex items-center gap-3">
                <div className={cn('h-12 w-12 rounded-xl shrink-0 flex items-center justify-center text-white text-sm font-bold', rfp.buyerColor)}>
                  {rfp.buyerInitials}
                </div>
                <div>
                  <p className="font-bold text-base text-text-primary">{rfp.buyerCompany}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <MapPin className="h-3 w-3" />
                      {rfp.country}
                    </span>
                    <span className="text-xs text-text-muted">{rfp.buyerCredentials.sector}</span>
                  </div>
                </div>
                <Badge className={cn(
                  'ml-auto text-xs font-medium border shrink-0',
                  rfp.status === 'open' ? 'bg-[#F0FDF4] text-[#166534] border-[#16A34A]/20' :
                  rfp.status === 'closing-soon' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-gray-100 text-text-muted border-border'
                )}>
                  {rfp.status === 'open' ? 'Open' : rfp.status === 'closing-soon' ? 'Closing Soon' : 'Closed'}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-text-primary leading-snug">{rfp.title}</h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {rfp.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-text-secondary border-0">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Summary */}
              <p className="text-sm text-text-secondary leading-relaxed">{rfp.summary}</p>

              {/* Key stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-text-muted uppercase tracking-wide">Budget</p>
                  <p className="text-sm font-semibold text-text-primary">{rfp.budget ?? 'Undisclosed'}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-text-muted uppercase tracking-wide">Deadline</p>
                  <p className={cn('text-sm font-semibold', critical ? 'text-red-600' : urgent ? 'text-amber-600' : 'text-text-primary')}>
                    {new Date(rfp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    <span className="text-xs font-normal ml-1 text-text-muted">({days}d)</span>
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-text-muted uppercase tracking-wide">Published</p>
                  <p className="text-sm font-semibold text-text-primary">
                    {new Date(rfp.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-text-muted uppercase tracking-wide">Registered</p>
                  <p className="text-sm font-semibold text-text-primary">{rfp.registeredSuppliers} suppliers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Requirements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#16A34A]" />
                Key Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2.5">
                {rfp.keyRequirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Q&A */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#16A34A]" />
                Clarification Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {rfp.questionsOpen ? (
                <div className="rounded-lg bg-[#F0FDF4] border border-[#16A34A]/20 p-3 flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-[#166534]">Questions are open</p>
                    {rfp.questionsDeadline && (
                      <p className="text-xs text-[#166534]/80 mt-0.5">
                        Submit by {new Date(rfp.questionsDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 border border-border p-3">
                  <p className="text-xs text-text-muted">The clarification period for this RFP has closed.</p>
                </div>
              )}
              {rfp.questionsOpen && (
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Submit a Clarification Question
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Add to pipeline CTA */}
          <Card className={cn('border', saved ? 'border-[#16A34A]/40' : 'border-border')}>
            <CardContent className="p-4 space-y-3">
              <p className="text-xs font-semibold text-text-primary">
                {saved ? 'Added to your RFP Pipeline' : 'Interested in this opportunity?'}
              </p>
              <p className="text-[11px] text-text-muted leading-relaxed">
                {saved
                  ? 'Your team has been notified. View this in your RFP dashboard to manage your response.'
                  : 'Add this to your internal RFP pipeline to start tracking it, add notes, and share with your team.'}
              </p>
              <Button
                size="sm"
                onClick={handleSaveClick}
                className={cn('w-full text-xs', saved ? 'bg-[#15803D] hover:bg-[#166534]' : 'bg-[#16A34A] hover:bg-[#15803D]')}
              >
                {saved ? <BookmarkCheck className="h-3.5 w-3.5 mr-1.5" /> : <Bookmark className="h-3.5 w-3.5 mr-1.5" />}
                {saved ? 'View in My RFP Pipeline' : 'Add to My RFP Pipeline'}
              </Button>
            </CardContent>
          </Card>

          {/* Buyer credentials */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#16A34A]" />
                Buyer Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center gap-2">
                <div className={cn('h-10 w-10 rounded-lg shrink-0 flex items-center justify-center text-white text-xs font-bold', rfp.buyerColor)}>
                  {rfp.buyerInitials}
                </div>
                <div>
                  <p className="font-bold text-sm text-text-primary">{rfp.buyerCompany}</p>
                  <p className="text-[11px] text-text-muted">{rfp.buyerCredentials.sector}</p>
                </div>
              </div>

              {/* Star rating */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Supplier Rating</span>
                <span className="flex items-center gap-1 font-medium">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {rfp.buyerCredentials.rating.toFixed(1)}
                  <span className="text-text-muted font-normal">({rfp.buyerCredentials.reviewCount})</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Previous RFPs</span>
                <span className="font-medium text-text-primary">{rfp.buyerCredentials.previousRFPsAwarded} awarded</span>
              </div>

              {rfp.buyerCredentials.ecoVadisScore !== undefined && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">EcoVadis Score</span>
                  <span className={cn('font-semibold', rfp.buyerCredentials.ecoVadisScore >= 75 ? 'text-[#16A34A]' : rfp.buyerCredentials.ecoVadisScore >= 55 ? 'text-amber-600' : 'text-orange-600')}>
                    {rfp.buyerCredentials.ecoVadisScore}/100
                  </span>
                </div>
              )}

              {rfp.buyerCredentials.emissionsIntensity && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Emissions Intensity</span>
                  <span className={cn('font-medium',
                    rfp.buyerCredentials.emissionsIntensity === 'Low' ? 'text-[#16A34A]' :
                    rfp.buyerCredentials.emissionsIntensity === 'Medium' ? 'text-amber-600' : 'text-red-600'
                  )}>
                    {rfp.buyerCredentials.emissionsIntensity}
                  </span>
                </div>
              )}

              {/* Credential badges */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border">
                {rfp.buyerCredentials.bCorp && (
                  <CredentialBadge variant="blue">
                    <Award className="h-3 w-3" />
                    B Corp Certified
                  </CredentialBadge>
                )}
                {rfp.buyerCredentials.scienceBasedTarget && (
                  <CredentialBadge variant="green">
                    <CheckCircle className="h-3 w-3" />
                    SBTi Committed
                  </CredentialBadge>
                )}
                {rfp.buyerCredentials.iso14001 && (
                  <CredentialBadge variant="neutral">
                    ISO 14001
                  </CredentialBadge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <p className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-[#16A34A]" />
                Location
              </p>
              <p className="text-sm text-text-secondary">{rfp.country}</p>
              <p className="text-xs text-text-muted capitalize">{rfp.region.replace(/-/g, ' ')}</p>
            </CardContent>
          </Card>

          {/* Back to similar */}
          <Link
            href={`/marketplace?category=${rfp.category}`}
            className="flex items-center gap-1.5 text-xs text-[#16A34A] hover:text-[#15803D] transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View similar opportunities
          </Link>
        </div>
      </div>

      {/* Add to pipeline modal */}
      {showModal && (
        <AddToRFPsModal
          open={showModal}
          rfp={rfp}
          onOpenChange={(open) => { if (!open) setShowModal(false) }}
          onConfirm={() => {
            setSaved(true)
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}
