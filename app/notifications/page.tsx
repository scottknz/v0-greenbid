"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Check,
  Trash2,
  ArrowLeft,
  FileText,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"
import { fullNotifications, type PageNotification } from "@/lib/mock-notifications"

// Use the PageNotification type from the mock data file
type Notification = PageNotification

// Data imported from lib/mock-notifications.ts
const mockNotifications = fullNotifications

const typeIcons: Record<Notification["type"], React.ReactNode> = {
  qa: <MessageSquare className="h-4 w-4" />,
  approval: <CheckCircle className="h-4 w-4" />,
  response: <FileText className="h-4 w-4" />,
  deadline: <Clock className="h-4 w-4" />,
  team: <Users className="h-4 w-4" />,
}

const typeColors: Record<Notification["type"], string> = {
  qa: "bg-blue-100 text-blue-600",
  approval: "bg-amber-100 text-amber-600",
  response: "bg-green-100 text-green-600",
  deadline: "bg-red-100 text-red-600",
  team: "bg-purple-100 text-purple-600",
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Notifications
              </h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notifications List */}
        <Card>
          <CardContent className="p-0">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  {filter === "unread" ? "No unread notifications" : "No notifications"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors",
                      !notification.read && "bg-muted/30"
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                      typeColors[notification.type]
                    )}>
                      {typeIcons[notification.type]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={notification.href || "#"} 
                        onClick={() => markAsRead(notification.id)}
                        className="block"
                      >
                        <p className={cn(
                          "text-sm",
                          !notification.read ? "font-semibold text-foreground" : "text-foreground"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.timestamp}
                        </p>
                      </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
