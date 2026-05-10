"use client";

import React, { useState } from 'react';
import { Bell, MessageSquare, CheckCircle, AlertCircle, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'qa' | 'approval' | 'response' | 'deadline';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  href?: string;
}

interface NotificationBellProps {
  collapsed?: boolean;
}

export function NotificationBell({ collapsed = false }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'qa',
      title: 'Pending Q&A',
      description: 'Sustainable Office Furniture: 3 unanswered questions',
      timestamp: '2 hours ago',
      read: false,
      href: '/buyer/tenders/1/manage?tab=q-a',
    },
    {
      id: '2',
      type: 'approval',
      title: 'Approval Needed',
      description: 'Green Energy Consulting proposal awaiting approval',
      timestamp: '5 hours ago',
      read: false,
      href: '/buyer/tenders/2/manage?tab=approvals',
    },
    {
      id: '3',
      type: 'response',
      title: 'New Response',
      description: 'Electric Vehicle Fleet: Response from EcoTransit Solutions',
      timestamp: '1 day ago',
      read: true,
      href: '/buyer/tenders/3/manage?tab=responses',
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingQA = notifications.filter(n => n.type === 'qa').length;
  const pendingApprovals = notifications.filter(n => n.type === 'approval').length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'qa':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'approval':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'response':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className={cn(
            'group flex w-full items-center px-3 py-2 text-sm font-medium transition-colors text-text-secondary hover:bg-surface-hover hover:text-text-primary',
            collapsed ? 'justify-center' : 'justify-start rounded-md'
          )}
        >
          <div className="relative shrink-0">
            <Bell className="h-4 w-4" />
          </div>
          {!collapsed && (
            <>
              <span className="ml-3 truncate text-[13px] font-medium leading-5">Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <h2 className="font-semibold text-sm text-text-primary">Notifications</h2>
            <p className="text-xs text-text-muted">
              {pendingQA > 0 && `${pendingQA} pending Q&A`}
              {pendingQA > 0 && pendingApprovals > 0 && ' • '}
              {pendingApprovals > 0 && `${pendingApprovals} pending approval${pendingApprovals > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-text-muted mb-2" />
              <p className="text-sm font-medium text-text-primary">No notifications</p>
              <p className="text-xs text-text-muted">You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-3 p-2 rounded-lg transition-colors',
                    notification.read
                      ? 'bg-surface hover:bg-surface-hover'
                      : 'bg-blue-50 hover:bg-blue-100'
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-text-secondary line-clamp-2 mt-0.5">
                      {notification.description}
                    </p>
                    <p className="text-[11px] text-text-muted mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDismiss(notification.id)}
                    className="mt-0.5 shrink-0 text-text-muted hover:text-text-primary"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border px-4 py-2 text-center">
          <a
            href="/notifications"
            className="text-xs font-medium text-[#16A34A] hover:underline"
          >
            View all notifications
          </a>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
