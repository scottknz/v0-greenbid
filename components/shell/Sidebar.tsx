"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, ClipboardList, Users, UsersRound, Library, BookOpen,
  MessageSquare, Bell, Shield, Settings, Mail, Upload,
  FolderOpen, Star, PanelLeftClose, PanelLeftOpen, MoreHorizontal, Plus,
} from 'lucide-react';
import { buyerNav, supplierNav, NavItem } from '@/config/nav';
import { useShell } from './ShellContext';
import { cn } from '@/lib/utils';
import { NotificationBell } from './NotificationBell';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, FileText, ClipboardList, Users, UsersRound, Library, BookOpen,
  MessageSquare, Bell, Shield, Settings, Mail, Upload,
  FolderOpen, Star,
};

interface SidebarProps {
  variant: 'buyer' | 'supplier';
}

export function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, toggleChatPanel, isSettingsOpen, setIsSettingsOpen } = useShell();

  const navItems = variant === 'buyer' ? buyerNav : supplierNav;
  const mainItems = navItems.filter((item) => item.section === 'main');
  const secondaryItems = navItems.filter((item) => item.section === 'secondary');

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const Icon = iconMap[item.icon] || FileText;
      const isActive = pathname === item.href;
      
      const content = (
        <>
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {!isSidebarCollapsed && (
            <span className="ml-3 truncate text-[13px] font-medium leading-5">
              {item.label}
            </span>
          )}
          {item.badgeCount && item.badgeCount > 0 && !isSidebarCollapsed && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#16A34A] px-1.5 text-xs font-medium text-white" aria-hidden="true">
              {item.badgeCount}
            </span>
          )}
          {item.badge && !item.badgeCount && !isSidebarCollapsed && (
            <span className="ml-auto flex h-2 w-2 rounded-full bg-[#16A34A]" aria-hidden="true" />
          )}
        </>
      );

      const className = cn(
        'group flex items-center px-3 py-2 text-sm font-medium transition-colors',
        isSidebarCollapsed ? 'justify-center' : 'justify-start rounded-md',
        isActive
          ? 'bg-[#F0FDF4] text-[#16A34A] border-l-[3px] border-[#16A34A] -ml-[3px] rounded-l-none'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
      );

      if (item.isChatTrigger) {
        return (
          <button
            key={item.label}
            onClick={toggleChatPanel}
            className={cn('w-full', className)}
            aria-label={item.label}
          >
            {content}
          </button>
        );
      }

      return (
        <Link
          key={item.label}
          href={item.href}
          className={className}
          aria-label={isSidebarCollapsed ? item.label : undefined}
        >
          {content}
        </Link>
      );
    });
  };

  return (
    <div
      className={cn(
        'flex flex-col border-r border-border bg-surface transition-all duration-300 ease-in-out',
        isSidebarCollapsed ? 'w-[56px]' : 'w-[220px]'
      )}
    >
      <div className={cn(
        'flex h-14 items-center border-b border-border px-4',
        isSidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!isSidebarCollapsed && (
          <Link href="/" className="flex items-center overflow-hidden hover:opacity-80 transition-opacity">
            <Image src="/greenbid-logo-green.png" alt="Greenbid" width={100} height={28} className="h-7 w-auto" />
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="text-text-secondary hover:text-text-primary"
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Company Section */}
      {!isSidebarCollapsed && (
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <img 
              src="/thistle-logo.png" 
              alt="Thistle Company" 
              className="h-8 w-8 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">
                Thistle Company
              </p>
              <p className="text-xs text-text-muted truncate">
                Sustainability
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto space-y-1 px-2 py-4">
        {renderNavItems(mainItems)}
      </nav>

      {/* Only show "+ New RFP" button for buyers */}
      {variant === 'buyer' && (
        <div className="px-2 py-3 border-t border-border">
          <Link
            href="/buyer/rfp/create"
            className={cn(
              'group flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'bg-[#16A34A] text-white hover:bg-[#15803D]',
              isSidebarCollapsed ? 'justify-center' : 'justify-start'
            )}
            aria-label="Create RFP"
          >
            <Plus className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>New RFP</span>}
          </Link>
        </div>
      )}

      <div className="px-2 py-4 border-t border-border">
        <nav className="space-y-1">
          {renderNavItems(secondaryItems)}
        </nav>
        
        {/* Notification Bell */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="px-1 py-2 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <span className="text-xs font-medium text-text-muted px-2">Quick Actions</span>
            )}
            <NotificationBell />
          </div>
        </div>
      </div>

      <div className="border-t border-border p-2">
        <div className={cn(
          'flex items-center gap-2 rounded-md p-2',
          isSidebarCollapsed ? 'justify-center' : 'justify-between'
        )}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0FDF4] text-xs font-semibold text-[#16A34A]">
              JD
            </div>
            {!isSidebarCollapsed && (
              <p className="text-sm font-medium text-text-primary truncate">John Doe</p>
            )}
          </div>
          {!isSidebarCollapsed && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
