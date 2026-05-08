'use client'

import { useState } from 'react'
import { 
  Search, Filter, Star, Download, Eye, ArrowUpRight, 
  Building2, FileText, Leaf, Award, TrendingUp, Users,
  Package, CheckCircle2, Clock, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock marketplace data
const marketplaceCategories = [
  { id: 'all', label: 'All', count: 48, icon: Package },
  { id: 'templates', label: 'RFP Templates', count: 12, icon: FileText },
  { id: 'suppliers', label: 'Certified Suppliers', count: 18, icon: Building2 },
  { id: 'sustainability', label: 'Sustainability', count: 8, icon: Leaf },
  { id: 'resources', label: 'Resources', count: 10, icon: Award },
]

const mockListings = [
  {
    id: '1',
    title: 'Sustainability RFP Template Bundle',
    description: 'Comprehensive RFP templates for sustainability-focused procurement including carbon reporting, ESG compliance, and green supply chain requirements.',
    category: 'templates',
    type: 'Template Pack',
    price: 'Free',
    rating: 4.8,
    reviews: 124,
    downloads: 2340,
    author: 'GreenBid Team',
    authorVerified: true,
    featured: true,
    tags: ['ESG', 'Carbon Neutral', 'Compliance'],
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'EcoTech Solutions',
    description: 'Certified B-Corp specializing in renewable energy consulting and sustainable infrastructure development. ISO 14001 certified.',
    category: 'suppliers',
    type: 'Certified Supplier',
    price: null,
    rating: 4.9,
    reviews: 87,
    downloads: null,
    author: 'Verified Supplier',
    authorVerified: true,
    featured: true,
    tags: ['Renewable Energy', 'B-Corp', 'ISO 14001'],
    updatedAt: '2024-01-20',
  },
  {
    id: '3',
    title: 'Carbon Accounting Framework',
    description: 'Step-by-step guide and templates for implementing Scope 1, 2, and 3 carbon accounting in your procurement process.',
    category: 'sustainability',
    type: 'Resource Guide',
    price: 'Premium',
    rating: 4.7,
    reviews: 56,
    downloads: 890,
    author: 'Climate Action Partners',
    authorVerified: true,
    featured: false,
    tags: ['Carbon Accounting', 'Scope 3', 'Reporting'],
    updatedAt: '2024-01-18',
  },
  {
    id: '4',
    title: 'IT Services RFP Template',
    description: 'Modern IT services procurement template with cloud infrastructure, cybersecurity requirements, and SLA frameworks.',
    category: 'templates',
    type: 'Template',
    price: 'Free',
    rating: 4.5,
    reviews: 203,
    downloads: 4521,
    author: 'GreenBid Team',
    authorVerified: true,
    featured: false,
    tags: ['IT', 'Cloud', 'Cybersecurity'],
    updatedAt: '2024-01-10',
  },
  {
    id: '5',
    title: 'Verde Packaging Co.',
    description: 'Sustainable packaging manufacturer offering 100% recyclable and compostable solutions. Carbon neutral since 2021.',
    category: 'suppliers',
    type: 'Certified Supplier',
    price: null,
    rating: 4.6,
    reviews: 42,
    downloads: null,
    author: 'Verified Supplier',
    authorVerified: true,
    featured: false,
    tags: ['Packaging', 'Carbon Neutral', 'Recyclable'],
    updatedAt: '2024-01-22',
  },
  {
    id: '6',
    title: 'Supplier Diversity Program Guide',
    description: 'Best practices for building and managing a diverse supplier network including certification tracking and reporting templates.',
    category: 'resources',
    type: 'Resource Guide',
    price: 'Free',
    rating: 4.4,
    reviews: 78,
    downloads: 1230,
    author: 'Procurement Excellence',
    authorVerified: false,
    featured: false,
    tags: ['Diversity', 'Inclusion', 'Best Practices'],
    updatedAt: '2024-01-08',
  },
  {
    id: '7',
    title: 'CleanTransit Logistics',
    description: 'Electric vehicle fleet logistics provider with real-time carbon tracking. Serving major metropolitan areas.',
    category: 'suppliers',
    type: 'Certified Supplier',
    price: null,
    rating: 4.8,
    reviews: 63,
    downloads: null,
    author: 'Verified Supplier',
    authorVerified: true,
    featured: true,
    tags: ['Logistics', 'EV Fleet', 'Carbon Tracking'],
    updatedAt: '2024-01-19',
  },
  {
    id: '8',
    title: 'ESG Compliance Checklist',
    description: 'Comprehensive checklist for ensuring supplier ESG compliance including environmental, social, and governance criteria.',
    category: 'sustainability',
    type: 'Checklist',
    price: 'Free',
    rating: 4.6,
    reviews: 145,
    downloads: 3200,
    author: 'GreenBid Team',
    authorVerified: true,
    featured: false,
    tags: ['ESG', 'Compliance', 'Checklist'],
    updatedAt: '2024-01-12',
  },
]

function ListingCard({ listing }: { listing: typeof mockListings[0] }) {
  const isSupplier = listing.category === 'suppliers'
  
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-white p-5 transition-all hover:border-[#16A34A]/40 hover:shadow-md">
      {listing.featured && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-[#16A34A] text-white text-[10px] font-semibold px-2 py-0.5">
            Featured
          </Badge>
        </div>
      )}
      
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            isSupplier ? "bg-blue-50 text-blue-600" : "bg-[#F0FDF4] text-[#16A34A]"
          )}>
            {isSupplier ? <Building2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
          </div>
          <div>
            <Badge variant="outline" className="text-[10px] font-medium mb-1">
              {listing.type}
            </Badge>
          </div>
        </div>
        {listing.price && (
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-medium shrink-0",
              listing.price === 'Free' 
                ? "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/30" 
                : "bg-amber-50 text-amber-700 border-amber-200"
            )}
          >
            {listing.price}
          </Badge>
        )}
      </div>

      <h3 className="font-semibold text-text-primary mb-1.5 group-hover:text-[#16A34A] transition-colors">
        {listing.title}
      </h3>
      
      <p className="text-sm text-text-secondary line-clamp-2 mb-3 flex-1">
        {listing.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {listing.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-[10px] bg-gray-100 text-gray-600">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            {listing.rating}
          </span>
          <span>({listing.reviews} reviews)</span>
          {listing.downloads && (
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {listing.downloads.toLocaleString()}
            </span>
          )}
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-[#16A34A] hover:text-[#15803D] hover:bg-[#F0FDF4] h-8 px-3"
        >
          {isSupplier ? 'View Profile' : 'Preview'}
          <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border text-xs text-text-muted">
        <span>By {listing.author}</span>
        {listing.authorVerified && (
          <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
        )}
      </div>
    </div>
  )
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular')

  const filteredListings = mockListings.filter((listing) => {
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'popular') return b.downloads || 0 - (a.downloads || 0)
    if (sortBy === 'rating') return b.rating - a.rating
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const featuredListings = sortedListings.filter(l => l.featured)
  const regularListings = sortedListings.filter(l => !l.featured)

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Internal Marketplace</h1>
            <p className="text-sm text-text-secondary mt-1">
              Discover templates, certified suppliers, and sustainability resources
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <TrendingUp className="h-4 w-4 text-[#16A34A]" />
              <span>{mockListings.length} listings available</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3 mt-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search templates, suppliers, resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-2">
                <Filter className="h-4 w-4" />
                Sort: {sortBy === 'popular' ? 'Most Popular' : sortBy === 'recent' ? 'Most Recent' : 'Highest Rated'}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('popular')}>
                Most Popular
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('recent')}>
                Most Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('rating')}>
                Highest Rated
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {marketplaceCategories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  selectedCategory === cat.id
                    ? "bg-[#16A34A] text-white"
                    : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                )}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  selectedCategory === cat.id ? "bg-white/20" : "bg-gray-200"
                )}>
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Featured Section */}
        {featuredListings.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400" />
              Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* All Listings */}
        <div>
          {(featuredListings.length > 0 && selectedCategory === 'all' && !searchQuery) && (
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-4">
              All Listings
            </h2>
          )}
          
          {sortedListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(searchQuery || selectedCategory !== 'all' ? sortedListings : regularListings).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="h-12 w-12 mx-auto text-text-muted mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No listings found</h3>
              <p className="text-sm text-text-secondary">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
