'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  MapPin,
  Calendar,
  Globe,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Award,
  Star,
  ChevronDown,
  Building2,
  FileText,
  MessageSquare,
  Users,
  Settings,
  ExternalLink,
  Clock,
} from 'lucide-react'
import {
  mockMarketplaceRFPs,
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_REGIONS,
  type MarketplaceRFP,
  type MarketplaceCategory,
  type MarketplaceRegion,
} from '@/lib/mock-marketplace'
import { AddToRFPsModal } from '@/components/marketplace/AddToRFPsModal'

function getDaysUntil(deadline: string) {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="flex items-center gap-1">
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      <span className="text-xs font-medium text-text-primary">{rating.toFixed(1)}</span>
      <span className="text-xs text-text-muted">({count})</span>
    </span>
  )
}

function MarketplaceCard({
  rfp,
  saved,
  onSave,
}: {
  rfp: MarketplaceRFP
  saved: boolean
  onSave: (rfp: MarketplaceRFP) => void
}) {
  const days = getDaysUntil(rfp.deadline)
  const urgent = days <= 14
  const critical = days <= 7

  return (
    <div className="group relative bg-white border border-border rounded-xl flex flex-col hover:shadow-md transition-shadow overflow-hidden">
      {rfp.featured && (
        <div className="absolute top-0 left-0 bg-[#16A34A] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-br-lg z-10">
          Featured
        </div>
      )}

      {/* Clickable body */}
      <Link href={`/marketplace/${rfp.id}`} className="flex-1 flex flex-col p-5 gap-3 pt-6">
        {/* Buyer + status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={cn('h-9 w-9 rounded-lg shrink-0 flex items-center justify-center text-white text-xs font-bold', rfp.buyerColor)}>
              {rfp.buyerInitials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-text-primary leading-tight truncate">{rfp.buyerCompany}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-text-muted shrink-0" />
                <span className="text-[11px] text-text-muted truncate">{rfp.country}</span>
              </div>
            </div>
          </div>
          <Badge className={cn(
            'text-[10px] font-medium shrink-0 border',
            rfp.status === 'open' ? 'bg-[#F0FDF4] text-[#166534] border-[#16A34A]/20' :
            rfp.status === 'closing-soon' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-grey-100 text-text-muted border-border'
          )}>
            {rfp.status === 'open' ? 'Open' : rfp.status === 'closing-soon' ? 'Closing Soon' : 'Closed'}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 group-hover:text-[#16A34A] transition-colors">
          {rfp.title}
        </h3>

        {/* Summary */}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 flex-1">
          {rfp.summary}
        </p>

        {/* Key requirements */}
        <ul className="space-y-1">
          {rfp.keyRequirements.slice(0, 3).map((req, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-[#16A34A] shrink-0" />
              <span className="text-[11px] text-text-secondary leading-relaxed">{req}</span>
            </li>
          ))}
          {rfp.keyRequirements.length > 3 && (
            <li className="text-[11px] text-text-muted pl-3">+{rfp.keyRequirements.length - 3} more</li>
          )}
        </ul>

        {/* Budget + Deadline */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          {rfp.budget ? (
            <div className="flex items-center gap-1 min-w-0">
              <TrendingUp className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
              <span className="text-xs font-medium text-text-primary truncate">{rfp.budget}</span>
            </div>
          ) : (
            <span className="text-xs text-text-muted italic">Budget undisclosed</span>
          )}
          <div className="ml-auto flex items-center gap-1 shrink-0">
            <Calendar className="h-3.5 w-3.5 text-text-muted" />
            <span className={cn(
              'text-xs font-medium',
              critical ? 'text-red-600' : urgent ? 'text-amber-600' : 'text-text-secondary'
            )}>
              {days > 0 ? `${days}d left` : 'Closed'}
            </span>
          </div>
        </div>
      </Link>

      {/* Footer: credentials + save button */}
      <div className="border-t border-border px-5 py-3 flex items-center justify-between gap-2 bg-gray-50/70">
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 min-w-0">
          <StarRating rating={rfp.buyerCredentials.rating} count={rfp.buyerCredentials.reviewCount} />

          {rfp.buyerCredentials.bCorp && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 shrink-0">
              <Award className="h-2.5 w-2.5" />
              B Corp
            </span>
          )}

          {rfp.buyerCredentials.ecoVadisScore !== undefined && (
            <span className="text-[10px] text-text-muted shrink-0">
              EcoVadis{' '}
              <span className={cn(
                'font-semibold',
                rfp.buyerCredentials.ecoVadisScore >= 75 ? 'text-[#16A34A]' :
                rfp.buyerCredentials.ecoVadisScore >= 55 ? 'text-amber-600' : 'text-orange-600'
              )}>
                {rfp.buyerCredentials.ecoVadisScore}
              </span>
              /100
            </span>
          )}

          {rfp.buyerCredentials.scienceBasedTarget && (
            <span className="text-[10px] font-medium text-[#16A34A] bg-[#F0FDF4] border border-[#16A34A]/20 rounded px-1.5 py-0.5 shrink-0">
              SBTi
            </span>
          )}

          {rfp.buyerCredentials.emissionsIntensity && (
            <span className={cn(
              'text-[10px] font-medium rounded px-1.5 py-0.5 border shrink-0',
              rfp.buyerCredentials.emissionsIntensity === 'Low' ? 'text-[#16A34A] bg-[#F0FDF4] border-[#16A34A]/20' :
              rfp.buyerCredentials.emissionsIntensity === 'Medium' ? 'text-amber-700 bg-amber-50 border-amber-200' :
              'text-red-700 bg-red-50 border-red-200'
            )}>
              {rfp.buyerCredentials.emissionsIntensity} Intensity
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); onSave(rfp) }}
          className={cn(
            'shrink-0 p-1.5 rounded-md transition-colors',
            saved
              ? 'text-[#16A34A] bg-[#F0FDF4]'
              : 'text-text-muted hover:text-[#16A34A] hover:bg-[#F0FDF4]'
          )}
          aria-label={saved ? 'Remove from My RFPs' : 'Add to My RFPs'}
        >
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

// Internal RFPs - buyer's own submitted RFPs
interface InternalRFP {
  id: string;
  referenceId: string;
  title: string;
  summary: string;
  status: 'accepting_bids' | 'published' | 'evaluation' | 'draft';
  deadline: string;
  budget: number;
  submissions: number;
  pendingQA: number;
  publishedAt: string;
  category: string;
}

const internalRFPs: InternalRFP[] = [
  {
    id: '1',
    referenceId: 'RFP-2026-001',
    title: 'Sustainable Office Furniture Supply',
    summary: 'Seeking suppliers for eco-friendly office furniture for our new headquarters.',
    status: 'accepting_bids',
    deadline: '2026-06-15',
    budget: 250000,
    submissions: 8,
    pendingQA: 3,
    publishedAt: '2026-05-01',
    category: 'Office Supplies',
  },
  {
    id: '2',
    referenceId: 'RFP-2026-002',
    title: 'Green Energy Consulting Services',
    summary: 'Professional consulting for transitioning to 100% renewable energy sources.',
    status: 'published',
    deadline: '2026-07-01',
    budget: 175000,
    submissions: 5,
    pendingQA: 1,
    publishedAt: '2026-05-10',
    category: 'Consulting',
  },
  {
    id: '3',
    referenceId: 'RFP-2026-003',
    title: 'Electric Vehicle Fleet Procurement',
    summary: 'Procurement of 50 electric vehicles for company fleet replacement program.',
    status: 'accepting_bids',
    deadline: '2026-06-30',
    budget: 2500000,
    submissions: 12,
    pendingQA: 5,
    publishedAt: '2026-04-20',
    category: 'Transportation',
  },
  {
    id: '4',
    referenceId: 'RFP-2026-004',
    title: 'Waste Management & Recycling Services',
    summary: 'Comprehensive waste management and recycling services for all office locations.',
    status: 'evaluation',
    deadline: '2026-05-30',
    budget: 120000,
    submissions: 6,
    pendingQA: 0,
    publishedAt: '2026-04-01',
    category: 'Facilities',
  },
]

export default function MarketplacePage() {
  const [marketView, setMarketView] = useState<'internal' | 'public'>('internal')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<MarketplaceCategory>('all')
  const [activeRegion, setActiveRegion] = useState<MarketplaceRegion>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'budget'>('newest')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [addTarget, setAddTarget] = useState<MarketplaceRFP | null>(null)

  const handleSave = (rfp: MarketplaceRFP) => {
    if (savedIds.has(rfp.id)) {
      setSavedIds(prev => { const s = new Set(prev); s.delete(rfp.id); return s })
    } else {
      setAddTarget(rfp)
    }
  }

  const filtered = useMemo(() => {
    let list = [...mockMarketplaceRFPs]
    if (activeCategory !== 'all') list = list.filter(r => r.category === activeCategory)
    if (activeRegion !== 'all') list = list.filter(r => r.region === activeRegion)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.buyerCompany.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    if (sortBy === 'newest') list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    else if (sortBy === 'deadline') list.sort((a, b) => a.deadline.localeCompare(b.deadline))
    else if (sortBy === 'budget') list.sort((a, b) => (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0))
    return list
  }, [activeCategory, activeRegion, search, sortBy])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="px-6 py-4 space-y-3">
          {/* Title + toggle + sort */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-text-primary">RFP Marketplace</h1>
                <p className="text-xs text-text-muted mt-0.5">
                  {marketView === 'internal' 
                    ? `${internalRFPs.length} internal RFP${internalRFPs.length === 1 ? '' : 's'}`
                    : `${filtered.length} open opportunit${filtered.length === 1 ? 'y' : 'ies'}`
                  }
                </p>
              </div>
              
              {/* Internal / Public toggle */}
              <div className="flex items-center bg-surface border border-border rounded-lg p-1 gap-1">
                <button
                  onClick={() => setMarketView('internal')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    marketView === 'internal'
                      ? 'bg-[#16A34A] text-white shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  )}
                >
                  <FileText className="h-4 w-4" />
                  Internal RFPs
                  {internalRFPs.length > 0 && (
                    <span className={cn(
                      'inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-semibold',
                      marketView === 'internal' ? 'bg-white/20 text-white' : 'bg-[#F0FDF4] text-[#16A34A]'
                    )}>
                      {internalRFPs.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setMarketView('public')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    marketView === 'public'
                      ? 'bg-[#16A34A] text-white shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  )}
                >
                  <Globe className="h-4 w-4" />
                  Public Marketplace
                </button>
              </div>
            </div>
            
            {marketView === 'public' && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-text-muted hidden sm:block">Sort:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="text-xs bg-white border border-border rounded-lg pl-3 pr-8 py-2 text-text-primary appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30"
                  >
                    <option value="newest">Newest First</option>
                    <option value="deadline">Deadline (Soonest)</option>
                    <option value="budget">Budget (Highest)</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 h-3 w-3 text-text-muted pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Search - public view only */}
          {marketView === 'public' && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  placeholder="Search by title, company, or keyword..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 bg-gray-50 border-border text-sm"
                />
              </div>

              {/* Category filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {MARKETPLACE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors whitespace-nowrap',
                      activeCategory === cat.id
                        ? 'bg-[#16A34A] text-white border-[#16A34A]'
                        : 'bg-white text-text-secondary border-border hover:border-[#16A34A]/40 hover:text-[#16A34A]'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Region filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                <Globe className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <div className="flex items-center gap-1.5">
                  {MARKETPLACE_REGIONS.map(reg => (
                    <button
                      key={reg.id}
                      onClick={() => setActiveRegion(reg.id)}
                      className={cn(
                        'shrink-0 text-[11px] font-medium px-3 py-1 rounded-full border transition-colors whitespace-nowrap',
                        activeRegion === reg.id
                          ? 'bg-text-primary text-white border-text-primary'
                          : 'bg-white text-text-secondary border-border hover:border-text-secondary hover:text-text-primary'
                      )}
                    >
                      {reg.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Public Marketplace Grid */}
      {marketView === 'public' && (
        <div className="px-6 py-8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
              <Search className="h-10 w-10 text-text-muted" />
              <p className="text-sm font-medium text-text-primary">No opportunities found</p>
              <p className="text-xs text-text-muted">Try adjusting your filters or search term</p>
              <Button variant="outline" size="sm" onClick={() => { setSearch(''); setActiveCategory('all'); setActiveRegion('all') }}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(rfp => (
                <MarketplaceCard
                  key={rfp.id}
                  rfp={rfp}
                  saved={savedIds.has(rfp.id)}
                  onSave={handleSave}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Internal RFPs View */}
      {marketView === 'internal' && (
        <div className="px-6 py-8">
          {internalRFPs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
              <FileText className="h-10 w-10 text-text-muted" />
              <p className="text-sm font-medium text-text-primary">No internal RFPs</p>
              <p className="text-xs text-text-muted">You haven&apos;t created any RFPs yet</p>
              <Link href="/buyer/rfp/create">
                <Button size="sm" className="bg-[#16A34A] hover:bg-[#15803d] text-white mt-2">
                  Create New RFP
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {internalRFPs.map(rfp => {
                const days = Math.ceil((new Date(rfp.deadline).getTime() - Date.now()) / 86400000)
                const urgent = days <= 14
                const critical = days <= 7
                
                return (
                  <div
                    key={rfp.id}
                    className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Header with reference and status */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs text-text-muted font-medium">{rfp.referenceId}</p>
                            <Link href={`/buyer/tenders/${rfp.id}`}>
                              <h3 className="font-semibold text-text-primary hover:text-[#16A34A] transition-colors">
                                {rfp.title}
                              </h3>
                            </Link>
                          </div>
                          <Badge className={cn(
                            'text-[10px] border shrink-0',
                            rfp.status === 'accepting_bids' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            rfp.status === 'published' ? 'bg-[#F0FDF4] text-[#166534] border-[#16A34A]/20' :
                            rfp.status === 'evaluation' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-gray-100 text-text-muted border-border'
                          )}>
                            {rfp.status === 'accepting_bids' ? 'Accepting Bids' : 
                             rfp.status === 'published' ? 'Published' :
                             rfp.status === 'evaluation' ? 'In Evaluation' : rfp.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-text-secondary">{rfp.summary}</p>
                        
                        {/* Stats row */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-[#16A34A]" />
                            <span className="font-medium text-text-primary">{rfp.submissions}</span> responses
                          </span>
                          {rfp.pendingQA > 0 && (
                            <Link 
                              href={`/buyer/tenders/${rfp.id}/manage?tab=responses`}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
                              <span className="font-medium text-amber-700">{rfp.pendingQA} pending Q&A</span>
                            </Link>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className={cn(critical ? 'text-red-600 font-medium' : urgent ? 'text-amber-600 font-medium' : '')}>
                              {days > 0 ? `${days} days left` : 'Deadline passed'}
                            </span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <TrendingUp className="h-3.5 w-3.5 text-[#16A34A]" />
                            <span className="font-medium text-text-primary">
                              {rfp.budget >= 1000000 
                                ? `$${(rfp.budget / 1000000).toFixed(1)}M` 
                                : `$${(rfp.budget / 1000).toFixed(0)}K`}
                            </span>
                          </span>
                          <span className="text-text-muted">{rfp.category}</span>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          <Link href={`/buyer/tenders/${rfp.id}/manage`}>
                            <Button size="sm" className="bg-[#16A34A] hover:bg-[#15803d] text-white gap-1.5">
                              <Settings className="h-3.5 w-3.5" />
                              RFP Manager
                            </Button>
                          </Link>
                          <Link href={`/buyer/tenders/${rfp.id}`}>
                            <Button size="sm" variant="outline" className="gap-1.5">
                              <ExternalLink className="h-3.5 w-3.5" />
                              View Details
                            </Button>
                          </Link>
                          {rfp.submissions > 0 && (
                            <Link href={`/buyer/tenders/${rfp.id}/manage?tab=responses`}>
                              <Button size="sm" variant="outline" className="gap-1.5">
                                <Users className="h-3.5 w-3.5" />
                                View Responses
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Add to My RFPs modal */}
      {addTarget && (
        <AddToRFPsModal
          open
          rfp={addTarget}
          onOpenChange={(open) => { if (!open) setAddTarget(null) }}
          onConfirm={() => {
            setSavedIds(prev => new Set(prev).add(addTarget!.id))
            setAddTarget(null)
          }}
        />
      )}
    </div>
  )
}
