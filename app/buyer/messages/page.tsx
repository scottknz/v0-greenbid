"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Plus,
  Globe,
  Lock,
  Paperclip,
  Send,
  X,
  CheckCircle,
  Download,
  MailOpen,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  Inbox,
  Star,
  Archive,
  Trash2,
  MoreVertical,
  ChevronDown,
  RefreshCw,
  Tag,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"

// Mock RFPs data
const rfpsData = [
  { id: "rfp1", title: "Comprehensive Scope 3 Value Chain Emissions Analysis", status: "published" },
  { id: "rfp2", title: "SBTi Target Setting & Validation Support", status: "published" },
  { id: "rfp3", title: "Embodied Carbon Life Cycle Assessment (LCA)", status: "closed" },
  { id: "rfp4", title: "ISSB (IFRS S1 & S2) Integration & Reporting", status: "evaluating" },
]

// Mock buyers/team members
const buyersData = [
  { id: "b1", name: "Emma Thompson", role: "Sustainability Lead" },
  { id: "b2", name: "David Kumar", role: "Carbon Analyst" },
  { id: "b3", name: "Lisa Martinez", role: "ESG Manager" },
]

// Mock suppliers
const suppliersData = [
  { id: "s1", name: "EcoMetrics Advisory", contact: "Dr. Sarah Chen" },
  { id: "s2", name: "CarbonClear Solutions", contact: "Emily Rodriguez" },
  { id: "s3", name: "Transition Risk Partners", contact: "Robert Williams" },
  { id: "s4", name: "SustainSustain", contact: "David Park" },
  { id: "s5", name: "Lifecycle Data Labs", contact: "Dr. Patricia Smith" },
]

// Global supplier database
const globalSuppliersData = [
  { id: "g1", name: "PCAF Analytics Group", contact: "James Mitchell", email: "james@pcafgroup.com" },
  { id: "g2", name: "GridShift Energy Advisors", contact: "Nina Patel", email: "nina@gridshift.com" },
  { id: "g3", name: "Apex Environmental Consulting", contact: "Tom Wilson", email: "tom@apexenv.com" },
]

// Thread statuses
const threadStatuses = [
  { key: "awaiting", label: "Awaiting Response", color: "bg-amber-100 text-amber-800", icon: Clock },
  { key: "action", label: "Action Required", color: "bg-red-100 text-red-800", icon: AlertCircle },
  { key: "open", label: "Open", color: "bg-blue-100 text-blue-800", icon: Circle },
  { key: "resolved", label: "Resolved", color: "bg-brand-green-light text-brand-green", icon: CheckCircle2 },
]

// Folder definitions
const folders = [
  { key: "inbox", label: "Inbox", icon: Inbox },
  { key: "starred", label: "Starred", icon: Star },
  { key: "awaiting", label: "Awaiting Response", icon: Clock },
  { key: "action", label: "Action Required", icon: AlertCircle },
  { key: "sent", label: "Sent", icon: Send },
  { key: "all", label: "All Messages", icon: Mail },
  { key: "archived", label: "Archived", icon: Archive },
]

// Mock threads data
const allThreadsData = [
  {
    id: "t1",
    rfpId: "rfp1",
    rfpTitle: "Sustainable Office Supplies 2026",
    subject: "Clarification on recycled content requirements",
    visibility: "all" as const,
    status: "awaiting",
    isRead: false,
    isStarred: true,
    isArchived: false,
    createdAt: "2026-03-10T09:30:00Z",
    updatedAt: "2026-03-12T14:20:00Z",
    lastSender: "John Smith",
    lastSenderType: "supplier" as const,
    lastSenderCompany: "EcoSupply Co.",
    participants: ["s1", "s2", "s3"],
    messages: [
      {
        id: "m1",
        senderId: "buyer",
        senderName: "Sarah Chen",
        senderType: "buyer" as const,
        content: "Please note that all paper products must contain a minimum of 80% post-consumer recycled content. This is a mandatory requirement.",
        attachments: [{ name: "Recycling_Standards.pdf", size: "245 KB", url: "#" }],
        timestamp: "2026-03-10T09:30:00Z",
      },
      {
        id: "m2",
        senderId: "s1",
        senderName: "John Smith",
        senderCompany: "EcoSupply Co.",
        senderType: "supplier" as const,
        content: "Thank you for the clarification. Can you confirm if this applies to all paper products or just A4 copy paper?",
        attachments: [],
        timestamp: "2026-03-12T14:20:00Z",
      },
    ],
  },
  {
    id: "t2",
    rfpId: "rfp1",
    rfpTitle: "Sustainable Office Supplies 2026",
    subject: "Delivery schedule flexibility",
    visibility: "private" as const,
    status: "resolved",
    isRead: true,
    isStarred: false,
    isArchived: false,
    createdAt: "2026-03-11T10:00:00Z",
    updatedAt: "2026-03-11T16:45:00Z",
    lastSender: "David Thompson",
    lastSenderType: "buyer" as const,
    participants: ["s2"],
    messages: [
      {
        id: "m3",
        senderId: "s2",
        senderName: "Emma Davis",
        senderCompany: "GreenOffice Ltd",
        senderType: "supplier" as const,
        content: "We wanted to discuss the delivery schedule privately. Our logistics partner has capacity constraints in June.",
        attachments: [{ name: "Delivery_Capacity_Analysis.xlsx", size: "128 KB", url: "#" }],
        timestamp: "2026-03-11T10:00:00Z",
      },
      {
        id: "m4",
        senderId: "buyer",
        senderName: "David Thompson",
        senderType: "buyer" as const,
        content: "Thank you for flagging this early. We have some flexibility on timing. Please include your preferred delivery schedule in your proposal.",
        attachments: [],
        timestamp: "2026-03-11T16:45:00Z",
      },
    ],
  },
  {
    id: "t3",
    rfpId: "rfp2",
    rfpTitle: "IT Infrastructure Renewal",
    subject: "ISO 14001 certification timeline",
    visibility: "all" as const,
    status: "action",
    isRead: false,
    isStarred: false,
    isArchived: false,
    createdAt: "2026-03-13T08:00:00Z",
    updatedAt: "2026-03-14T10:30:00Z",
    lastSender: "Michael Brown",
    lastSenderType: "supplier" as const,
    lastSenderCompany: "Sustainable Solutions Inc",
    participants: ["s1", "s2", "s3", "s4", "s5"],
    messages: [
      {
        id: "m5",
        senderId: "buyer",
        senderName: "Sarah Chen",
        senderType: "buyer" as const,
        content: "Several suppliers have asked about ISO 14001 certification. Please note: if you are currently in the certification process, please provide documentation.",
        attachments: [{ name: "Certification_Requirements.pdf", size: "312 KB", url: "#" }],
        timestamp: "2026-03-13T08:00:00Z",
      },
      {
        id: "m6",
        senderId: "s3",
        senderName: "Michael Brown",
        senderCompany: "Sustainable Solutions Inc",
        senderType: "supplier" as const,
        content: "We are currently in the final stages of certification. Expected completion date is April 15th. Please see attached status report.",
        attachments: [{ name: "ISO_Status_Report.pdf", size: "156 KB", url: "#" }],
        timestamp: "2026-03-14T10:30:00Z",
      },
    ],
  },
  {
    id: "t4",
    rfpId: "rfp4",
    rfpTitle: "Fleet Management Services",
    subject: "Question about pricing structure",
    visibility: "private" as const,
    status: "open",
    isRead: true,
    isStarred: true,
    isArchived: false,
    createdAt: "2026-03-14T11:30:00Z",
    updatedAt: "2026-03-14T11:30:00Z",
    lastSender: "Lisa Johnson",
    lastSenderType: "supplier" as const,
    lastSenderCompany: "EnviroTech Partners",
    participants: ["s4"],
    messages: [
      {
        id: "m7",
        senderId: "s4",
        senderName: "Lisa Johnson",
        senderCompany: "EnviroTech Partners",
        senderType: "supplier" as const,
        content: "Should we provide volume-based pricing tiers in our submission, or a single fixed price per unit? We can offer significant discounts at higher volumes.",
        attachments: [],
        timestamp: "2026-03-14T11:30:00Z",
      },
    ],
  },
  {
    id: "t5",
    rfpId: "rfp1",
    rfpTitle: "Sustainable Office Supplies 2026",
    subject: "Updated submission deadline",
    visibility: "all" as const,
    status: "resolved",
    isRead: true,
    isStarred: false,
    isArchived: false,
    createdAt: "2026-03-08T14:00:00Z",
    updatedAt: "2026-03-08T14:00:00Z",
    lastSender: "Sarah Chen",
    lastSenderType: "buyer" as const,
    participants: ["s1", "s2", "s3", "s4", "s5"],
    messages: [
      {
        id: "m8",
        senderId: "buyer",
        senderName: "Sarah Chen",
        senderType: "buyer" as const,
        content: "Please note the submission deadline has been extended by one week to April 7th, 2026. This is to allow additional time for certification documentation.",
        attachments: [],
        timestamp: "2026-03-08T14:00:00Z",
      },
    ],
  },
]

export default function MessagesPage() {
  const searchParams = useSearchParams()

  // State — merge any threads injected from the Award flow via localStorage
  const [threads, setThreads] = useState(() => {
    try {
      const injected = JSON.parse(localStorage.getItem('gb_injected_threads') || '[]')
      if (injected.length > 0) {
        // Deduplicate by id, injected threads take precedence
        const existingIds = new Set(allThreadsData.map((t) => t.id))
        const newOnly = injected.filter((t: { id: string }) => !existingIds.has(t.id))
        return [...newOnly, ...allThreadsData]
      }
    } catch {
      // localStorage unavailable
    }
    return allThreadsData
  })
  const [selectedFolder, setSelectedFolder] = useState("inbox")
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [selectedThreadIds, setSelectedThreadIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [rfpFilter, setRfpFilter] = useState<string | null>(null)
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "private" | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  
  // Compose state
  const [composeRfp, setComposeRfp] = useState("")
  const [composeSubject, setComposeSubject] = useState("")
  const [composeMessage, setComposeMessage] = useState("")
  const [composeRecipients, setComposeRecipients] = useState<string[]>([])
  const [composeTo, setComposeTo] = useState<{ name: string; email: string } | null>(null)
  const [composeVisibility, setComposeVisibility] = useState<"all" | "private">("private")
  const [composeAttachments, setComposeAttachments] = useState<{ name: string; size: string }[]>([])
  const [showBroadcastConfirm, setShowBroadcastConfirm] = useState(false)
  
  // Reply state
  const [replyMessage, setReplyMessage] = useState("")
  const [replyAttachments, setReplyAttachments] = useState<{ name: string; size: string }[]>([])
  const [showGlobalSuppliers, setShowGlobalSuppliers] = useState(false)
  const [isFolderSidebarCollapsed, setIsFolderSidebarCollapsed] = useState(false)

  // Auto-open compose when navigated from a contact modal
  useEffect(() => {
    if (searchParams.get("compose") === "true") {
      const toName = searchParams.get("to") || ""
      const toEmail = searchParams.get("email") || ""
      if (toName || toEmail) {
        setComposeTo({ name: toName, email: toEmail })
        setComposeSubject(toName ? `Message to ${toName}` : "")
      }
      setComposeOpen(true)
    }
  }, [searchParams])

  // Derived state
  const selectedThread = threads.find(t => t.id === selectedThreadId)
  
  // Filter threads based on folder
  const getFilteredThreads = () => {
    let filtered = threads.filter(t => !t.isArchived)
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.subject.toLowerCase().includes(query) ||
        t.rfpTitle.toLowerCase().includes(query) ||
        t.lastSender.toLowerCase().includes(query)
      )
    }

    // Apply RFP filter
    if (rfpFilter) {
      filtered = filtered.filter(t => t.rfpId === rfpFilter)
    }

    // Apply visibility filter
    if (visibilityFilter) {
      filtered = filtered.filter(t => t.visibility === visibilityFilter)
    }

    // Apply folder filter
    switch (selectedFolder) {
      case "inbox":
        return filtered.filter(t => !t.isArchived)
      case "starred":
        return filtered.filter(t => t.isStarred)
      case "awaiting":
        return filtered.filter(t => t.status === "awaiting")
      case "action":
        return filtered.filter(t => t.status === "action")
      case "sent":
        return filtered.filter(t => t.lastSenderType === "buyer")
      case "all":
        return threads.filter(t => !t.isArchived)
      case "archived":
        return threads.filter(t => t.isArchived)
      default:
        return filtered
    }
  }
  
  const filteredThreads = getFilteredThreads()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  
  // Counts for folders
  const unreadCount = threads.filter(t => !t.isRead && !t.isArchived).length
  const starredCount = threads.filter(t => t.isStarred && !t.isArchived).length
  const awaitingCount = threads.filter(t => t.status === "awaiting" && !t.isArchived).length
  const actionCount = threads.filter(t => t.status === "action" && !t.isArchived).length

  const getFolderCount = (key: string) => {
    switch (key) {
      case "inbox": return unreadCount
      case "starred": return starredCount
      case "awaiting": return awaitingCount
      case "action": return actionCount
      default: return 0
    }
  }

  // Helpers
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    if (diffDays < 7) return date.toLocaleDateString("en-GB", { weekday: "short" })
    if (date.getFullYear() === now.getFullYear()) return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })
  }

  const handleSelectThread = (id: string) => {
    setSelectedThreadId(id)
    // Mark as read
    setThreads(prev => prev.map(t => t.id === id ? { ...t, isRead: true } : t))
  }

  const toggleThreadSelection = (id: string) => {
    setSelectedThreadIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedThreadIds.size === filteredThreads.length) {
      setSelectedThreadIds(new Set())
    } else {
      setSelectedThreadIds(new Set(filteredThreads.map(t => t.id)))
    }
  }

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setThreads(prev => prev.map(t => t.id === id ? { ...t, isStarred: !t.isStarred } : t))
  }

  const markSelectedAsRead = (read: boolean) => {
    setThreads(prev => prev.map(t => selectedThreadIds.has(t.id) ? { ...t, isRead: read } : t))
    setSelectedThreadIds(new Set())
  }

  const archiveSelected = () => {
    setThreads(prev => prev.map(t => selectedThreadIds.has(t.id) ? { ...t, isArchived: true } : t))
    setSelectedThreadIds(new Set())
    if (selectedThreadId && selectedThreadIds.has(selectedThreadId)) {
      setSelectedThreadId(null)
    }
  }

  const updateThreadStatus = (id: string, status: string) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  const handleMakePublic = (id: string) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, visibility: "all" as const } : t))
  }

  const handleSendMessage = () => {
    if (!composeRfp || !composeSubject.trim() || !composeMessage.trim()) return
    const rfp = rfpsData.find(r => r.id === composeRfp)
    const newThread = {
      id: `t${Date.now()}`,
      rfpId: composeRfp,
      rfpTitle: rfp?.title || "",
      subject: composeSubject,
      visibility: composeVisibility,
      status: "open",
      isRead: true,
      isStarred: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSender: "Sarah Chen",
      lastSenderType: "buyer" as const,
      participants: composeRecipients,
      messages: [{
        id: `m${Date.now()}`,
        senderId: "buyer",
        senderName: "Sarah Chen",
        senderType: "buyer" as const,
        content: composeMessage,
        attachments: composeAttachments.map(a => ({ ...a, url: "#" })),
        timestamp: new Date().toISOString(),
      }],
    }
    setThreads(prev => [newThread, ...prev])
    setComposeOpen(false)
    setComposeRfp("")
    setComposeSubject("")
    setComposeMessage("")
    setComposeRecipients([])
    setComposeTo(null)
    setComposeVisibility("private")
    setComposeAttachments([])
    setSelectedThreadId(newThread.id)
  }

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedThreadId) return
    setThreads(prev => prev.map(thread => {
      if (thread.id !== selectedThreadId) return thread
      return {
        ...thread,
        updatedAt: new Date().toISOString(),
        lastSender: "Sarah Chen",
        lastSenderType: "buyer" as const,
        status: thread.status === "action" ? "awaiting" : thread.status,
        messages: [...thread.messages, {
          id: `m${Date.now()}`,
          senderId: "buyer",
          senderName: "Sarah Chen",
          senderType: "buyer" as const,
          content: replyMessage,
          attachments: replyAttachments.map(a => ({ ...a, url: "#" })),
          timestamp: new Date().toISOString(),
        }],
      }
    }))
    setReplyMessage("")
    setReplyAttachments([])
  }

  const exportToCSV = (threadsToExport: typeof threads, filename: string) => {
    const headers = ["Subject", "RFP", "Status", "Visibility", "Last Sender", "Last Updated", "Messages"]
    const rows = threadsToExport.map(t => [
      t.subject,
      t.rfpTitle,
      threadStatuses.find(s => s.key === t.status)?.label || t.status,
      t.visibility === "all" ? "All Suppliers" : "Private",
      t.lastSender,
      new Date(t.updatedAt).toLocaleDateString("en-GB"),
      t.messages.length.toString(),
    ])
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Top Bar - Search + Filters + Compose */}
        <div className="px-4 py-3 border-b border-[#E5E7EB] bg-white space-y-2">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF]" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-[#F3F4F6] border-0 focus-visible:bg-white focus-visible:ring-1"
              />
            </div>
            <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white shadow-sm">
                <Plus className="size-4 mr-2" />
                Compose
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* RFP Selection */}
                <div className="space-y-2">
                  <Label>Select RFP</Label>
                  <Select value={composeRfp} onValueChange={setComposeRfp}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an RFP..." />
                    </SelectTrigger>
                    <SelectContent>
                      {rfpsData.filter(r => r.status !== "closed").map(rfp => (
                        <SelectItem key={rfp.id} value={rfp.id}>{rfp.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pre-filled To recipient from contact modal */}
                {composeTo && (
                  <div className="space-y-2">
                    <Label>To</Label>
                    <div className="flex items-center justify-between px-3 py-2 rounded-md border border-[#16A34A]/50 bg-[#F0FDF4] text-sm">
                      <span className="font-medium text-[#16A34A]">{composeTo.name}</span>
                      <button
                        type="button"
                        onClick={() => setComposeTo(null)}
                        className="text-text-secondary hover:text-text-primary ml-2"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter message subject..."
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                  />
                </div>

                {/* Visibility */}
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-blue-50 border border-blue-200 w-fit">
                    <button
                      type="button"
                      onClick={() => setComposeVisibility("private")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        composeVisibility === "private"
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      <Lock className="size-3.5" />
                      Private Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBroadcastConfirm(true)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        composeVisibility === "all"
                          ? "bg-orange-600 text-white shadow-md"
                          : "text-orange-700 hover:bg-orange-100"
                      }`}
                    >
                      <Globe className="size-3.5" />
                      Broadcast All
                    </button>
                  </div>

                  {composeVisibility === "private" && (
                    <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-800">
                      <Lock className="size-4 shrink-0 mt-0.5 text-blue-600" />
                      <div className="text-xs leading-relaxed">
                        <span className="font-semibold">Private message:</span> Only selected suppliers will see this message and your responses to their individual replies.
                      </div>
                    </div>
                  )}

                  {composeVisibility === "all" && (
                    <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-800">
                      <Globe className="size-4 shrink-0 mt-0.5 text-orange-600" />
                      <div className="text-xs leading-relaxed">
                        <span className="font-semibold">Broadcast to all {suppliersData.length} suppliers:</span> All recipients will see this message publicly. Use for announcements, deadline changes, or clarifications intended for all participants. Your replies will also be visible to all.
                      </div>
                    </div>
                  )}
                </div>

                {/* Recipients (only for private) */}
                {composeVisibility === "private" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Recipients</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-[#16A34A] hover:text-[#15803D]"
                        onClick={() => setShowGlobalSuppliers(!showGlobalSuppliers)}
                      >
                        <Globe className="size-3 mr-1" />
                        {showGlobalSuppliers ? "Show registered" : "Add from global"}
                      </Button>
                    </div>
                    <div className="border border-[#E5E7EB] rounded-lg max-h-40 overflow-y-auto">
                      {!showGlobalSuppliers ? (
                        suppliersData.map(supplier => (
                          <label
                            key={supplier.id}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-[#F9FAFB] cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
                          >
                            <Checkbox
                              checked={composeRecipients.includes(supplier.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setComposeRecipients(prev => [...prev, supplier.id])
                                } else {
                                  setComposeRecipients(prev => prev.filter(id => id !== supplier.id))
                                }
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#111827] truncate">{supplier.name}</p>
                              <p className="text-xs text-[#6B7280] truncate">{supplier.contact}</p>
                            </div>
                          </label>
                        ))
                      ) : (
                        globalSuppliersData.map(supplier => (
                          <label
                            key={supplier.id}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-[#F9FAFB] cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
                          >
                            <Checkbox
                              checked={composeRecipients.includes(supplier.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setComposeRecipients(prev => [...prev, supplier.id])
                                } else {
                                  setComposeRecipients(prev => prev.filter(id => id !== supplier.id))
                                }
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#111827] truncate">{supplier.name}</p>
                              <p className="text-xs text-[#6B7280] truncate">{supplier.contact}</p>
                            </div>
                            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 shrink-0">
                              Global
                            </Badge>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message..."
                    value={composeMessage}
                    onChange={(e) => setComposeMessage(e.target.value)}
                    rows={5}
                  />
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div className="flex flex-wrap gap-2">
                    {composeAttachments.map((file, idx) => (
                      <Badge key={idx} variant="outline" className="bg-[#F3F4F6] text-[#6B7280] pr-1">
                        <Paperclip className="size-3 mr-1" />
                        {file.name}
                        <button
                          type="button"
                          className="ml-1 hover:text-red-600"
                          onClick={() => setComposeAttachments(prev => prev.filter((_, i) => i !== idx))}
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setComposeAttachments(prev => [...prev, { name: `Document_${prev.length + 1}.pdf`, size: "256 KB" }])}
                    >
                      <Paperclip className="size-3 mr-1" />
                      Add file
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setComposeOpen(false)}>Cancel</Button>
                <Button
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white"
                  onClick={handleSendMessage}
                  disabled={!composeRfp || !composeSubject.trim() || !composeMessage.trim() || (composeVisibility === "private" && composeRecipients.length === 0)}
                >
                  <Send className="size-4 mr-1" />
                  Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Broadcast Confirmation Modal */}
          <Dialog open={showBroadcastConfirm} onOpenChange={setShowBroadcastConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Broadcast to All Suppliers?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-orange-200 bg-orange-50">
                  <Globe className="size-5 text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-800">
                    <p className="font-semibold mb-1">This will send your message to ALL {suppliersData.length} suppliers</p>
                    <p className="text-xs">All suppliers will see this message and your responses to their questions. This action is visible in the audit log.</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-gray-900">Use broadcast for:</p>
                  <ul className="text-xs text-gray-600 space-y-1 ml-3">
                    <li>• Deadline extensions or changes</li>
                    <li>• Clarifications to RFP terms</li>
                    <li>• Announcements relevant to all participants</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBroadcastConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => {
                    setComposeVisibility("all")
                    setComposeRecipients(suppliersData.map(s => s.id))
                    setShowBroadcastConfirm(false)
                  }}
                >
                  <Globe className="size-4 mr-1" />
                  Broadcast Message
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={rfpFilter || "all"} onValueChange={(v) => setRfpFilter(v === "all" ? null : v)}>
              <SelectTrigger className="h-8 text-xs w-auto min-w-[140px] border-[#E5E7EB] bg-white">
                <SelectValue placeholder="All RFPs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All RFPs</SelectItem>
                {rfpsData.map(rfp => (
                  <SelectItem key={rfp.id} value={rfp.id}>{rfp.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-md p-0.5">
              {[
                { key: null, label: "All" },
                { key: "all", label: "Public" },
                { key: "private", label: "Private" },
              ].map(opt => (
                <button
                  key={String(opt.key)}
                  onClick={() => setVisibilityFilter(opt.key as typeof visibilityFilter)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    visibilityFilter === opt.key
                      ? "bg-white text-[#111827] shadow-sm"
                      : "text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {(rfpFilter || visibilityFilter) && (
              <button
                onClick={() => { setRfpFilter(null); setVisibilityFilter(null) }}
                className="text-xs text-[#6B7280] hover:text-[#111827] flex items-center gap-1"
              >
                <X className="size-3" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Main Content - 3 Column Layout */}
        <div className="flex flex-1 min-h-0">
          {/* Left Sidebar - Folders */}
          <div className={`${isFolderSidebarCollapsed ? "w-14" : "w-56"} border-r border-[#E5E7EB] bg-[#FAFAFA] shrink-0 flex flex-col transition-all duration-200`}>
            {/* Sidebar header with toggle */}
            <div className={`flex h-10 items-center border-b border-[#E5E7EB] px-2 ${isFolderSidebarCollapsed ? "justify-center" : "justify-end"}`}>
              <button
                onClick={() => setIsFolderSidebarCollapsed(!isFolderSidebarCollapsed)}
                className="text-[#9CA3AF] hover:text-[#4B5563] p-1 rounded transition-colors"
                aria-label={isFolderSidebarCollapsed ? "Expand folders" : "Collapse folders"}
              >
                {isFolderSidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
              </button>
            </div>

            <nav className="space-y-1 p-2 flex-1">
              {folders.map(folder => {
                const count = getFolderCount(folder.key)
                const isActive = selectedFolder === folder.key
                const Icon = folder.icon
                return (
                  <button
                    key={folder.key}
                    onClick={() => {
                      setSelectedFolder(folder.key)
                      setSelectedThreadId(null)
                      setSelectedThreadIds(new Set())
                    }}
                    title={isFolderSidebarCollapsed ? folder.label : undefined}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-[#16A34A]/10 text-[#16A34A] font-medium"
                        : "text-[#4B5563] hover:bg-[#F3F4F6]"
                    } ${isFolderSidebarCollapsed ? "justify-center" : ""}`}
                  >
                    <Icon className={`size-4 shrink-0 ${isActive ? "text-[#16A34A]" : "text-[#9CA3AF]"}`} />
                    {!isFolderSidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{folder.label}</span>
                        {count > 0 && (
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                            isActive ? "bg-[#16A34A] text-white" : "bg-[#E5E7EB] text-[#6B7280]"
                          }`}>
                            {count}
                          </span>
                        )}
                      </>
                    )}
                    {isFolderSidebarCollapsed && count > 0 && (
                      <span className="absolute -top-1 -right-1 size-2 rounded-full bg-[#16A34A]" />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Export section */}
            {!isFolderSidebarCollapsed && (
              <div className="mt-auto pt-4 border-t border-[#E5E7EB] p-2">
                <p className="text-xs font-medium text-[#9CA3AF] px-3 mb-2">EXPORT</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-[#6B7280] hover:text-[#111827]"
                  onClick={() => exportToCSV(filteredThreads, "messages.csv")}
                >
                  <Download className="size-4 mr-2" />
                  Download All
                </Button>
                {selectedThreadIds.size > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-[#6B7280] hover:text-[#111827]"
                    onClick={() => {
                      const selected = threads.filter(t => selectedThreadIds.has(t.id))
                      exportToCSV(selected, "messages_selection.csv")
                    }}
                  >
                    <Download className="size-4 mr-2" />
                    Download Selected ({selectedThreadIds.size})
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Middle - Thread List */}
          <div className="w-96 border-r border-[#E5E7EB] bg-white flex flex-col shrink-0">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[#E5E7EB] bg-[#FAFAFA]">
              <Checkbox
                checked={filteredThreads.length > 0 && selectedThreadIds.size === filteredThreads.length}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
              <Button variant="ghost" size="icon" className="size-8" onClick={() => window.location.reload()}>
                <RefreshCw className="size-4 text-[#6B7280]" />
              </Button>
              {selectedThreadIds.size > 0 && (
                <>
                  <div className="w-px h-4 bg-[#E5E7EB]" />
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => archiveSelected()}>
                    <Archive className="size-4 text-[#6B7280]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => markSelectedAsRead(true)}>
                    <MailOpen className="size-4 text-[#6B7280]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => markSelectedAsRead(false)}>
                    <Mail className="size-4 text-[#6B7280]" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <Tag className="size-4 text-[#6B7280]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {threadStatuses.map(status => (
                        <DropdownMenuItem key={status.key} onClick={() => {
                          setThreads(prev => prev.map(t => selectedThreadIds.has(t.id) ? { ...t, status: status.key } : t))
                          setSelectedThreadIds(new Set())
                        }}>
                          <status.icon className="size-4 mr-2" />
                          {status.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              <div className="flex-1" />
              <span className="text-xs text-[#9CA3AF]">
                {filteredThreads.length} message{filteredThreads.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Thread List */}
            <div className="flex-1 overflow-y-auto">
              {filteredThreads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[#9CA3AF]">
                  <Mail className="size-12 mb-3 opacity-30" />
                  <p className="font-medium">No messages</p>
                  <p className="text-sm">Messages will appear here</p>
                </div>
              ) : (
                filteredThreads.map(thread => {
                  const isSelected = selectedThreadId === thread.id
                  const statusInfo = threadStatuses.find(s => s.key === thread.status)
                  return (
                    <div
                      key={thread.id}
                      className={`flex items-start gap-2 px-3 py-2.5 border-b border-[#F3F4F6] cursor-pointer transition-colors ${
                        isSelected ? "bg-[#EBF5FF]" : "hover:bg-[#F9FAFB]"
                      } ${!thread.isRead ? "bg-white" : "bg-[#FAFAFA]"}`}
                      onClick={() => handleSelectThread(thread.id)}
                    >
                      <Checkbox
                        checked={selectedThreadIds.has(thread.id)}
                        onCheckedChange={() => toggleThreadSelection(thread.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                      />
                      <button
                        onClick={(e) => toggleStar(thread.id, e)}
                        className={`mt-0.5 ${thread.isStarred ? "text-amber-400" : "text-[#D1D5DB] hover:text-amber-400"}`}
                      >
                        <Star className={`size-4 ${thread.isStarred ? "fill-current" : ""}`} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-sm truncate ${!thread.isRead ? "font-semibold text-[#111827]" : "text-[#4B5563]"}`}>
                            {thread.lastSenderType === "supplier" ? thread.lastSender : "Me"}
                          </span>
                          {thread.visibility === "all" && (
                            <Globe className="size-3 text-blue-500 shrink-0" />
                          )}
                          {thread.visibility === "private" && (
                            <Lock className="size-3 text-[#9CA3AF] shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-sm truncate ${!thread.isRead ? "font-medium text-[#111827]" : "text-[#4B5563]"}`}>
                            {thread.subject}
                          </span>
                          {thread.messages.some(m => m.attachments.length > 0) && (
                            <Paperclip className="size-3 text-[#9CA3AF] shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#9CA3AF] truncate">{thread.rfpTitle}</span>
                          <Badge className={`text-[10px] px-1.5 py-0 h-4 ${statusInfo?.color} border-0`}>
                            {statusInfo?.label}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-[#9CA3AF] shrink-0 mt-0.5">
                        {formatDate(thread.updatedAt)}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right - Thread Detail */}
          <div className="flex-1 bg-white flex flex-col min-w-0">
            {selectedThread ? (
              <>
                {/* Thread Header */}
                <div className="px-6 py-4 border-b border-[#E5E7EB]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-[#111827] truncate">{selectedThread.subject}</h2>
                      <p className="text-sm text-[#6B7280] mt-0.5">{selectedThread.rfpTitle}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge className={`text-xs ${threadStatuses.find(s => s.key === selectedThread.status)?.color} border-0`}>
                          {(() => {
                            const StatusIcon = threadStatuses.find(s => s.key === selectedThread.status)?.icon || Circle
                            return <StatusIcon className="size-3 mr-1" />
                          })()}
                          {threadStatuses.find(s => s.key === selectedThread.status)?.label}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${selectedThread.visibility === "all" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                          {selectedThread.visibility === "all" ? (
                            <><Globe className="size-3 mr-1" />All Suppliers</>
                          ) : (
                            <><Lock className="size-3 mr-1" />Private</>
                          )}
                        </Badge>
                        <span className="text-xs text-[#9CA3AF]">{selectedThread.messages.length} message{selectedThread.messages.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Status <ChevronDown className="size-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {threadStatuses.map(status => (
                            <DropdownMenuItem key={status.key} onClick={() => updateThreadStatus(selectedThread.id, status.key)}>
                              <status.icon className="size-4 mr-2" />
                              {status.label}
                              {selectedThread.status === status.key && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {selectedThread.visibility === "private" && (
                        <Button variant="outline" size="sm" onClick={() => handleMakePublic(selectedThread.id)}>
                          <Globe className="size-4 mr-1" />
                          Make Public
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleStar(selectedThread.id, {} as React.MouseEvent)}>
                            <Star className={`size-4 mr-2 ${selectedThread.isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
                            {selectedThread.isStarred ? "Unstar" : "Star"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setThreads(prev => prev.map(t => t.id === selectedThread.id ? { ...t, isArchived: true } : t))
                            setSelectedThreadId(null)
                          }}>
                            <Archive className="size-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => exportToCSV([selectedThread], `thread_${selectedThread.id}.csv`)}>
                            <Download className="size-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {selectedThread.messages.map((message, idx) => (
                    <div key={message.id} className="flex gap-4">
                      <Avatar className="size-10 shrink-0">
                        <AvatarFallback className={`text-sm ${message.senderType === "buyer" ? "bg-[#16A34A] text-white" : "bg-[#E5E7EB] text-[#4B5563]"}`}>
                          {message.senderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[#111827]">{message.senderName}</span>
                          {message.senderType === "supplier" && message.senderCompany && (
                            <span className="text-sm text-[#6B7280]">{message.senderCompany}</span>
                          )}
                          <span className="text-xs text-[#9CA3AF]">
                            {new Date(message.timestamp).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className="text-sm text-[#374151] whitespace-pre-wrap">{message.content}</div>
                        {message.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.attachments.map((att, i) => (
                              <a
                                key={i}
                                href={att.url}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] text-sm"
                              >
                                <Paperclip className="size-4 text-[#6B7280]" />
                                <span className="text-[#111827]">{att.name}</span>
                                <span className="text-xs text-[#9CA3AF]">{att.size}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Composer */}
                <div className="border-t border-[#E5E7EB] p-4 bg-[#FAFAFA]">
                  <div className="bg-white rounded-lg border border-[#E5E7EB] p-3">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={3}
                      className="border-0 p-0 resize-none focus-visible:ring-0 text-sm"
                    />
                    {replyAttachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-[#E5E7EB]">
                        {replyAttachments.map((file, idx) => (
                          <Badge key={idx} variant="outline" className="bg-[#F3F4F6] text-[#6B7280] pr-1">
                            <Paperclip className="size-3 mr-1" />
                            {file.name}
                            <button
                              type="button"
                              className="ml-1 hover:text-red-600"
                              onClick={() => setReplyAttachments(prev => prev.filter((_, i) => i !== idx))}
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E7EB]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyAttachments(prev => [...prev, { name: `Attachment_${prev.length + 1}.pdf`, size: "128 KB" }])}
                      >
                        <Paperclip className="size-4 mr-1" />
                        Attach
                      </Button>
                      <Button
                        className="bg-[#16A34A] hover:bg-[#15803D] text-white"
                        size="sm"
                        onClick={handleSendReply}
                        disabled={!replyMessage.trim()}
                      >
                        <Send className="size-4 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#9CA3AF]">
                <div className="text-center">
                  <Mail className="size-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium text-[#6B7280]">Select a message</p>
                  <p className="text-sm mt-1">Choose a conversation from the list to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  )
}
