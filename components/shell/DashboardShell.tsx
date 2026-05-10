"use client";

import React from 'react';
import { ShellProvider, useShell } from './ShellContext';
import { Sidebar } from './Sidebar';
import { ChatPanel } from './ChatPanel';
import { SettingsModal } from '@/components/settings/SettingsModal';

interface DashboardShellProps {
  children: React.ReactNode;
  variant?: 'buyer' | 'supplier';
}

function DashboardShellContent({ children, variant = 'buyer' }: DashboardShellProps) {
  const { isSettingsOpen, setIsSettingsOpen } = useShell();

  return (
    <>
      <div className="flex h-screen w-full overflow-hidden bg-background text-text-primary">
        <Sidebar variant={variant} />
        <ChatPanel />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}

export function DashboardShell({ children, variant = 'buyer' }: DashboardShellProps) {
  return (
    <ShellProvider>
      <DashboardShellContent variant={variant}>{children}</DashboardShellContent>
    </ShellProvider>
  );
}
