"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Filter,
  Globe,
  Lock,
  Paperclip,
  Send,
  X,
  CheckCircle,
  Download,
  ArrowUpDown,
  Calendar,
  MailOpen,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
} from "lucide-react"

// Mock RFPs data
const rfpsData = [
  { id: "rfp1", title: "Sustainable Office Supplies 2026", status: "open" },
  { id: "rfp2", title: "IT Infrastructure Renewal", status: "open" },
  { id: "rfp3", title: "Catering Services Contract", status: "closed" },
  { id: "rfp4", title: "Fleet Management Services", status: "evaluation" },
]

// Mock buyers/team members
const buyersData = [
  { id: "b1", name: "Sarah Chen", role: "Procurement Lead" },
  { id: "b2", name: "David Thompson", role: "Category Manager" },
  { id: "b3", name: "Emily Watson", role: "Sustainability Officer" },
]

// Mock suppliers
const suppliersData = [
  { id: "s1", name: "EcoSupply Co.", contact: "John Smith" },
  { id: "s2", name: "GreenOffice Ltd", contact: "Emma Davis" },
  { id: "s3", name: "Sustainable Solutions Inc", contact: "Michael Brown" },
  { id: "s4", name: "EnviroTech Partners", contact: "Lisa Johnson" },
  { id: "s5", name: "CleanSource Materials", contact: "Robert Williams" },
]

// Global supplier database
const globalSuppliersData = [
  { id: "g1", name: "RecycleFirst Corp", contact: "Alex Turner", email: "alex@recyclefirst.com" },
  { id: "g2", name: "EcoMaterials Global", contact: "Nina Patel", email: "nina@ecomaterials.com" },
  { id: "g3", name: "GreenPrint Solutions", contact: "Tom Wilson", email: "tom@greenprint.com" },
]

// Thread statuses
const threadStatuses = [
  { key: "awaiting", label: "Awaiting Response", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  { key: "action", label: "Action Required", color: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
  { key: "open", label: "Open", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Circle },
  { key: "resolved", label: "Resolved", color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
]

// Mock threads data - aggregated from all RFPs
const allThreadsData = [
  {
    id: "t1",
    rfpId: "rfp1",
    rfpTitle: "Sustainable Office Supplies 2026",
    subject: "Clarification on recycled content requirements",
    visibility: "all" as const,
    status: "resolved" as const,
    isRead: true,
    createdAt: "2026-03-10T09:30:00Z",
    updatedAt: "2026-03-12T14:20:00Z",
    participants: ["s1", "s2", "s3"],
    lastSenderType: "buyer" as const,
    messages: [
      {
        id: "m1",
        senderId: "b1",
        senderName: "Sarah Chen",
        senderType: "buyer" as const,
        content: "Please note that all paper products must contain a minimum of 80% post-consumer recycled content.",
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
        timestamp: "2026-03-10T14:15:00Z",
      },
      {
        id: "m3",
        senderId: "b1",
        senderName: "Sarah Chen",
        senderType: "buyer" as const,
        content: "The 80% requirement applies specifically to copy paper and printer paper. Specialty items should contain at least 50%.",
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
    status: "awaiting" as const,
    isRead: false,
    createdAt: "2026-03-11T10:00:00Z",
    updatedAt: "2026-03-11T16:45:00Z",
    participants: ["s2"],
    lastSenderType: "supplier" as const,
    messages: [
      {
        id: "m4",
        senderId: "s2",
        senderName: "Emma Davis",
        senderCompany: "GreenOffice Ltd",
        senderType: "supplier" as const,
        content: "We wanted to discuss the delivery schedule privately. Our logistics partner has capacity constraints in June.",
        attachments: [{ name: "Delivery_Capacity_Analysis.xlsx", size: "128 KB", url: "#" }],
        timestamp: "2026-03-11T10:00:00Z",
      },
      {
        id: "m5",
        senderId: "b2",
        senderName: "David Thompson",
        senderType: "buyer" as const,
        content: "Thank you for flagging this early. We have some flexibility on timing.",
        attachments: [],
        timestamp: "2026-03-11T16:45:00Z",
      },
    ],
  },
  {
    id: "t3",
    rfpId: "rfp2",
    rfpTitle: "IT Infrastructure Renewal",
    subject: "Server specifications clarification",
    visibility: "all" as const,
    status: "action" as const,
    isRead: false,
    createdAt: "2026-03-14T08:00:00Z",
    updatedAt: "2026-03-15T09:30:00Z",
    participants: ["s3", "s4"],
    lastSenderType: "supplier" as const,
    messages: [
      {
        id: "m6",
        senderId: "b1",
        senderName: "Sarah Chen",
        senderType: "buyer" as const,
        content: "All server hardware must meet Energy Star 3.0 certification requirements.",
        attachments: [{ name: "IT_Specs.pdf", size: "512 KB", url: "#" }],
        timestamp: "2026-03-14T08:00:00Z",
      },
      {
        id: "m7",
        senderId: "s3",
        senderName: "Michael Brown",
        senderCompany: "Sustainable Solutions Inc",
        senderType: "supplier" as const,
        content: "Does this apply to refurbished equipment as well? Some older models may not have the latest certification.",
        attachments: [],
        timestamp: "2026-03-15T09:30:00Z",
      },
    ],
  },
  {
    id: "t4",
    rfpId: "rfp4",
    rfpTitle: "Fleet Management Services",
    subject: "EV charging infrastructure requirements",
    visibility: "all" as const,
    status: "open" as const,
    isRead: true,
    createdAt: "2026-03-16T11:00:00Z",
    updatedAt: "2026-03-16T11:00:00Z",
    participants: ["s1", "s2", "s3", "s4", "s5"],
    lastSenderType: "buyer" as const,
    messages: [
      {
        id: "m8",
        senderId: "b3",
        senderName: "Emily Watson",
        senderType: "buyer" as const,
        content: "We are seeking proposals that include provisions for EV charging infrastructure at our main facilities.",
        attachments: [],
        timestamp: "2026-03-16T11:00:00Z",
      },
    ],
  },
  {
    id: "t5",
    rfpId: "rfp3",
    rfpTitle: "Catering Services Contract",
    subject: "Local sourcing requirements",
    visibility: "private" as const,
    status: "resolved" as const,
    isRead: true,
    createdAt: "2026-02-20T14:00:00Z",
    updatedAt: "2026-02-25T10:30:00Z",
    participants: ["s5"],
    lastSenderType: "buyer" as const,
    messages: [
      {
        id: "m9",
        senderId: "s5",
        senderName: "Robert Williams",
        senderCompany: "CleanSource Materials",
        senderType: "supplier" as const,
        content: "What percentage of ingredients need to be locally sourced?",
        attachments: [],
        timestamp: "2026-02-20T14:00:00Z",
      },
      {
        id: "m10",
        senderId: "b2",
        senderName: "David Thompson",
        senderType: "buyer" as const,
        content: "We require at least 60% of fresh produce to be sourced within 100 miles of our facilities.",
        attachments: [{ name: "Local_Sourcing_Policy.pdf", size: "89 KB", url: "#" }],
        timestamp: "2026-02-25T10:30:00Z",
      },
    ],
  },
]

export default function MessagesPage() {
  // Thread data state
  const [threads, setThreads] = useState(allThreadsData)
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [selectedThreadIds, setSelectedThreadIds] = useState<Set<string>>(new Set())

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [rfpFilter, setRfpFilter] = useState<string | null>(null)
  const [buyerFilter, setBuyerFilter] = useState<string | null>(null)
  const [supplierFilter, setSupplierFilter] = useState<string | null>(null)
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "private" | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [hasAttachmentFilter, setHasAttachmentFilter] = useState<boolean | null>(null)
  const [readFilter, setReadFilter] = useState<"read" | "unread" | null>(null)
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "all">("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rfp" | "supplier">("newest")

  // Compose modal state
  const [composeOpen, setComposeOpen] = useState(false)
  const [composeRfp, setComposeRfp] = useState("")
  const [composeSubject, setComposeSubject] = useState("")
  const [composeMessage, setComposeMessage] = useState("")
  const [composeRecipients, setComposeRecipients] = useState<string[]>([])
  const [composeVisibility, setComposeVisibility] = useState<"all" | "private">("private")
  const [composeAttachments, setComposeAttachments] = useState<{ name: string; size: string }[]>([])
  const [showGlobalSuppliers, setShowGlobalSuppliers] = useState(false)

  // Reply state
  const [replyMessage, setReplyMessage] = useState("")
  const [replyAttachments, setReplyAttachments] = useState<{ name: string; size: string }[]>([])

  // Selected thread
  const selectedThread = threads.find(t => t.id === selectedThreadId)

  // Filter logic
  const filteredThreads = threads
    .filter(thread => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSubject = thread.subject.toLowerCase().includes(query)
        const matchesContent = thread.messages.some(m => m.content.toLowerCase().includes(query))
        if (!matchesSubject && !matchesContent) return false
      }
      // RFP filter
      if (rfpFilter && thread.rfpId !== rfpFilter) return false
      // Buyer filter
      if (buyerFilter && !thread.messages.some(m => m.senderType === "buyer" && m.senderId === buyerFilter)) return false
      // Supplier filter
      if (supplierFilter && !thread.participants.includes(supplierFilter)) return false
      // Visibility filter
      if (visibilityFilter === "all" && thread.visibility !== "all") return false
      if (visibilityFilter === "private" && thread.visibility !== "private") return false
      // Status filter
      if (statusFilter && thread.status !== statusFilter) return false
      // Attachment filter
      if (hasAttachmentFilter === true && !thread.messages.some(m => m.attachments.length > 0)) return false
      if (hasAttachmentFilter === false && thread.messages.some(m => m.attachments.length > 0)) return false
      // Read filter
      if (readFilter === "read" && !thread.isRead) return false
      if (readFilter === "unread" && thread.isRead) return false
      // Date filter
      if (dateFilter !== "all") {
        const threadDate = new Date(thread.updatedAt)
        const now = new Date()
        if (dateFilter === "today") {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          if (threadDate < today) return false
        } else if (dateFilter === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          if (threadDate < weekAgo) return false
        } else if (dateFilter === "month") {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          if (threadDate < monthAgo) return false
        }
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      if (sortBy === "oldest") return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      if (sortBy === "rfp") return a.rfpTitle.localeCompare(b.rfpTitle)
      if (sortBy === "supplier") {
        const aSupplier = suppliersData.find(s => a.participants.includes(s.id))?.name || ""
        const bSupplier = suppliersData.find(s => b.participants.includes(s.id))?.name || ""
        return aSupplier.localeCompare(bSupplier)
      }
      return 0
    })

  // Count unread
  const unreadCount = threads.filter(t => !t.isRead).length

  // Has active filters
  const hasActiveFilters = searchQuery || rfpFilter || buyerFilter || supplierFilter || visibilityFilter || statusFilter || hasAttachmentFilter !== null || readFilter || dateFilter !== "all"

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setRfpFilter(null)
    setBuyerFilter(null)
    setSupplierFilter(null)
    setVisibilityFilter(null)
    setStatusFilter(null)
    setHasAttachmentFilter(null)
    setReadFilter(null)
    setDateFilter("all")
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return date.toLocaleDateString("en-GB", { weekday: "short" })
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  }

  // Toggle thread selection
  const toggleThreadSelection = (threadId: string) => {
    setSelectedThreadIds(prev => {
      const next = new Set(prev)
      next.has(threadId) ? next.delete(threadId) : next.add(threadId)
      return next
    })
  }

  // Toggle all threads
  const toggleAllThreads = () => {
    if (selectedThreadIds.size === filteredThreads.length) {
      setSelectedThreadIds(new Set())
    } else {
      setSelectedThreadIds(new Set(filteredThreads.map(t => t.id)))
    }
  }

  // Mark selected as read/unread
  const markSelectedAsRead = (read: boolean) => {
    setThreads(prev => prev.map(t => 
      selectedThreadIds.has(t.id) ? { ...t, isRead: read } : t
    ))
    setSelectedThreadIds(new Set())
  }

  // Export to CSV
  const exportToCSV = (threadsToExport: typeof threads, filename: string) => {
    const headers = ["RFP", "Subject", "Visibility", "Status", "Last Updated", "Messages", "Has Attachments"]
    const rows = threadsToExport.map(t => {
      const hasAttachments = t.messages.some(m => m.attachments.length > 0)
      return [
        t.rfpTitle,
        t.subject,
        t.visibility === "all" ? "All Suppliers" : "Private",
        threadStatuses.find(s => s.key === t.status)?.label || t.status,
        new Date(t.updatedAt).toLocaleDateString("en-GB"),
        t.messages.length.toString(),
        hasAttachments ? "Yes" : "No",
      ]
    })
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

  // Send new message
  const handleSendMessage = () => {
    if (!composeRfp || !composeSubject.trim() || !composeMessage.trim()) return
    const rfp = rfpsData.find(r => r.id === composeRfp)
    if (!rfp) return
    const newThread = {
      id: `t${Date.now()}`,
      rfpId: composeRfp,
      rfpTitle: rfp.title,
      subject: composeSubject,
      visibility: composeVisibility,
      status: "open" as const,
      isRead: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participants: composeRecipients,
      lastSenderType: "buyer" as const,
      messages: [{
        id: `m${Date.now()}`,
        senderId: "b1",
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
    setComposeVisibility("private")
    setComposeAttachments([])
    setSelectedThreadId(newThread.id)
  }

  // Send reply
  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedThreadId) return
    setThreads(prev => prev.map(thread => {
      if (thread.id !== selectedThreadId) return thread
      return {
        ...thread,
        updatedAt: new Date().toISOString(),
        lastSenderType: "buyer" as const,
        status: "open" as const,
        messages: [...thread.messages, {
          id: `m${Date.now()}`,
          senderId: "b1",
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

  // Mark thread as read when selected
  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId)
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, isRead: true } : t))
  }

  // Update thread status
  const updateThreadStatus = (threadId: string, status: string) => {
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, status: status as typeof t.status } : t))
  }

  // Make thread public
  const handleMakePublic = (threadId: string) => {
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, visibility: "all" as const } : t))
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Messages</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            All communications across your RFPs
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-[#16A34A] text-white">{unreadCount} unread</Badge>
            )}
          </p>
        </div>
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white">
              <Plus className="size-4 mr-2" />
              New Message
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
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={composeVisibility === "all" ? "default" : "outline"}
                    size="sm"
                    className={composeVisibility === "all" ? "bg-[#16A34A] hover:bg-[#15803D]" : ""}
                    onClick={() => {
                      setComposeVisibility("all")
                      setComposeRecipients(suppliersData.map(s => s.id))
                    }}
                  >
                    <Globe className="size-4 mr-1" />
                    All Suppliers
                  </Button>
                  <Button
                    type="button"
                    variant={composeVisibility === "private" ? "default" : "outline"}
                    size="sm"
                    className={composeVisibility === "private" ? "bg-[#16A34A] hover:bg-[#15803D]" : ""}
                    onClick={() => setComposeVisibility("private")}
                  >
                    <Lock className="size-4 mr-1" />
                    Private
                  </Button>
                </div>
              </div>

              {/* Recipients */}
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
                      {showGlobalSuppliers ? "Show registered" : "Add from global database"}
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
                            <p className="text-xs text-[#6B7280] truncate">{supplier.contact} · {supplier.email}</p>
                          </div>
                          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 shrink-0">
                            Global
                          </Badge>
                        </label>
                      ))
                    )}
                  </div>
                  {composeRecipients.length > 0 && (
                    <p className="text-xs text-[#6B7280]">{composeRecipients.length} recipient{composeRecipients.length !== 1 ? "s" : ""} selected</p>
                  )}
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
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Bar */}
      <Card className="border-[#E5E7EB] bg-white">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF]" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* RFP Filter */}
            <Select value={rfpFilter || ""} onValueChange={(v) => setRfpFilter(v || null)}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="All RFPs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All RFPs</SelectItem>
                {rfpsData.map(rfp => (
                  <SelectItem key={rfp.id} value={rfp.id}>{rfp.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter || ""} onValueChange={(v) => setStatusFilter(v || null)}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {threadStatuses.map(status => (
                  <SelectItem key={status.key} value={status.key}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* More Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 border-[#E5E7EB]">
                  <Filter className="size-4 mr-2" />
                  More Filters
                  {(buyerFilter || supplierFilter || visibilityFilter || hasAttachmentFilter !== null || readFilter) && (
                    <Badge className="ml-2 bg-[#16A34A] text-white text-xs px-1.5">
                      {[buyerFilter, supplierFilter, visibilityFilter, hasAttachmentFilter !== null, readFilter].filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <div className="px-2 py-1.5 text-xs font-medium text-[#6B7280]">Visibility</div>
                <DropdownMenuItem onClick={() => setVisibilityFilter(null)}>
                  All {visibilityFilter === null && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVisibilityFilter("all")}>
                  <Globe className="size-4 mr-2" /> Public {visibilityFilter === "all" && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVisibilityFilter("private")}>
                  <Lock className="size-4 mr-2" /> Private {visibilityFilter === "private" && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-medium text-[#6B7280]">Read Status</div>
                <DropdownMenuItem onClick={() => setReadFilter(null)}>
                  All {readFilter === null && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setReadFilter("unread")}>
                  <Mail className="size-4 mr-2" /> Unread Only {readFilter === "unread" && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setReadFilter("read")}>
                  <MailOpen className="size-4 mr-2" /> Read Only {readFilter === "read" && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-medium text-[#6B7280]">Attachments</div>
                <DropdownMenuItem onClick={() => setHasAttachmentFilter(null)}>
                  All {hasAttachmentFilter === null && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHasAttachmentFilter(true)}>
                  <Paperclip className="size-4 mr-2" /> Has Attachments {hasAttachmentFilter === true && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHasAttachmentFilter(false)}>
                  No Attachments {hasAttachmentFilter === false && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 border-[#E5E7EB]">
                  <Calendar className="size-4 mr-2" />
                  {dateFilter === "all" ? "All Time" : dateFilter === "today" ? "Today" : dateFilter === "week" ? "Last 7 Days" : "Last 30 Days"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setDateFilter("all")}>
                  All Time {dateFilter === "all" && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter("today")}>
                  Today {dateFilter === "today" && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter("week")}>
                  Last 7 Days {dateFilter === "week" && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter("month")}>
                  Last 30 Days {dateFilter === "month" && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9">
                  <ArrowUpDown className="size-4 mr-2" />
                  {sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : sortBy === "rfp" ? "By RFP" : "By Supplier"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  Newest First {sortBy === "newest" && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  Oldest First {sortBy === "oldest" && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rfp")}>
                  By RFP {sortBy === "rfp" && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("supplier")}>
                  By Supplier {sortBy === "supplier" && <CheckCircle className="size-4 ml-auto text-[#16A34A]" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="h-9 text-[#6B7280] hover:text-red-600" onClick={clearFilters}>
                <X className="size-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedThreadIds.size > 0 && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#E5E7EB]">
              <span className="text-sm text-[#6B7280]">{selectedThreadIds.size} selected</span>
              <Button variant="outline" size="sm" className="h-8" onClick={() => markSelectedAsRead(true)}>
                <MailOpen className="size-4 mr-1" />
                Mark Read
              </Button>
              <Button variant="outline" size="sm" className="h-8" onClick={() => markSelectedAsRead(false)}>
                <Mail className="size-4 mr-1" />
                Mark Unread
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                  const selected = threads.filter(t => selectedThreadIds.has(t.id))
                  exportToCSV(selected, "messages_selection.csv")
                }}
              >
                <Download className="size-4 mr-1" />
                Export Selection
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-[#6B7280]" onClick={() => setSelectedThreadIds(new Set())}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-[#6B7280]">
        <span>Showing {filteredThreads.length} of {threads.length} conversations</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => exportToCSV(threads, "all_messages.csv")}
          >
            <Download className="size-4 mr-1" />
            Download All
          </Button>
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div className="flex gap-4 h-[calc(100vh-380px)] min-h-[500px]">
        {/* Thread List */}
        <Card className="border-[#E5E7EB] bg-white w-[420px] flex flex-col shrink-0 overflow-hidden pt-0">
          <CardHeader className="pb-3 border-b border-[#E5E7EB] flex flex-row items-center gap-3">
            <Checkbox
              checked={filteredThreads.length > 0 && selectedThreadIds.size === filteredThreads.length}
              onCheckedChange={toggleAllThreads}
              aria-label="Select all"
            />
            <CardTitle className="text-sm font-medium text-[#6B7280]">
              {filteredThreads.length} conversation{filteredThreads.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="p-6 text-center text-[#6B7280]">
                <Mail className="size-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No messages found</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E5E7EB]">
                {filteredThreads.map(thread => {
                  const lastMessage = thread.messages[thread.messages.length - 1]
                  const isSelected = selectedThreadId === thread.id
                  const statusInfo = threadStatuses.find(s => s.key === thread.status)
                  const StatusIcon = statusInfo?.icon || Circle
                  return (
                    <div
                      key={thread.id}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors cursor-pointer ${isSelected ? "bg-[#F0FDF4] border-l-2 border-l-[#16A34A]" : ""}`}
                    >
                      <Checkbox
                        checked={selectedThreadIds.has(thread.id)}
                        onCheckedChange={() => toggleThreadSelection(thread.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select ${thread.subject}`}
                        className="mt-1"
                      />
                      <button
                        className="flex-1 text-left min-w-0"
                        onClick={() => handleSelectThread(thread.id)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            {!thread.isRead && (
                              <span className="size-2 rounded-full bg-[#16A34A] shrink-0" />
                            )}
                            <p className={`text-sm line-clamp-1 ${!thread.isRead ? "font-semibold text-[#111827]" : "font-medium text-[#111827]"} ${isSelected ? "text-[#16A34A]" : ""}`}>
                              {thread.subject}
                            </p>
                          </div>
                          <span className="text-xs text-[#9CA3AF] shrink-0">{formatDate(thread.updatedAt)}</span>
                        </div>
                        <p className="text-xs text-[#6B7280] line-clamp-1 mb-1.5">{thread.rfpTitle}</p>
                        <p className="text-xs text-[#9CA3AF] line-clamp-1 mb-2">{lastMessage.content}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={`text-xs ${statusInfo?.color}`}>
                            <StatusIcon className="size-3 mr-1" />
                            {statusInfo?.label}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${thread.visibility === "all" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                          >
                            {thread.visibility === "all" ? (
                              <><Globe className="size-3 mr-1" />All</>
                            ) : (
                              <><Lock className="size-3 mr-1" />Private</>
                            )}
                          </Badge>
                          {thread.messages.some(m => m.attachments.length > 0) && (
                            <Paperclip className="size-3 text-[#9CA3AF]" />
                          )}
                          <span className="text-xs text-[#9CA3AF]">{thread.messages.length}</span>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Thread Detail */}
        <Card className="border-[#E5E7EB] bg-white flex-1 flex flex-col min-w-0 overflow-hidden pt-0">
          {selectedThread ? (
            <>
              <CardHeader className="pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">{selectedThread.subject}</CardTitle>
                    <p className="text-xs text-[#6B7280] mt-0.5">{selectedThread.rfpTitle}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-xs ${threadStatuses.find(s => s.key === selectedThread.status)?.color}`}
                      >
                        {(() => {
                          const StatusIcon = threadStatuses.find(s => s.key === selectedThread.status)?.icon || Circle
                          return <StatusIcon className="size-3 mr-1" />
                        })()}
                        {threadStatuses.find(s => s.key === selectedThread.status)?.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${selectedThread.visibility === "all" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                      >
                        {selectedThread.visibility === "all" ? (
                          <><Globe className="size-3 mr-1" />All Suppliers</>
                        ) : (
                          <><Lock className="size-3 mr-1" />Private</>
                        )}
                      </Badge>
                      <span className="text-xs text-[#9CA3AF]">
                        Started {new Date(selectedThread.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Status
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
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedThread.messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.senderType === "buyer" ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className={`text-xs ${message.senderType === "buyer" ? "bg-[#16A34A] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                        {message.senderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 max-w-[75%] ${message.senderType === "buyer" ? "text-right" : ""}`}>
                      <div className={`inline-block text-left rounded-lg px-4 py-2.5 ${message.senderType === "buyer" ? "bg-[#16A34A] text-white" : "bg-[#F3F4F6] text-[#111827]"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium ${message.senderType === "buyer" ? "text-green-100" : "text-[#6B7280]"}`}>
                            {message.senderName}
                            {message.senderType === "supplier" && message.senderCompany && ` · ${message.senderCompany}`}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {message.attachments.map((att, idx) => (
                              <a
                                key={idx}
                                href={att.url}
                                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${message.senderType === "buyer" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#6B7280]"}`}
                              >
                                <Paperclip className="size-3" />
                                {att.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className={`text-xs text-[#9CA3AF] mt-1 ${message.senderType === "buyer" ? "text-right" : ""}`}>
                        {new Date(message.timestamp).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              {/* Reply Composer */}
              <div className="border-t border-[#E5E7EB] p-4">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={2}
                      className="resize-none"
                    />
                    {replyAttachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
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
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setReplyAttachments(prev => [...prev, { name: `Attachment_${prev.length + 1}.pdf`, size: "128 KB" }])}
                    >
                      <Paperclip className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-9 w-9 bg-[#16A34A] hover:bg-[#15803D] text-white"
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim()}
                    >
                      <Send className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#6B7280]">
              <div className="text-center">
                <Mail className="size-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Select a conversation</p>
                <p className="text-sm text-[#9CA3AF] mt-1">Choose a thread from the list to view messages</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
