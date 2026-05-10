'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TableWrapperProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderCellProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Standardized table components for consistent styling across all pages.
 */
export function TableWrapper({ children, className }: TableWrapperProps) {
  return (
    <div className={cn('bg-background rounded-lg border border-border overflow-hidden', className)}>
      <table className="w-full">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <thead className={cn('bg-surface border-b border-border', className)}>
      {children}
    </thead>
  );
}

export function TableHeaderCell({ children, className, align = 'left' }: TableHeaderCellProps) {
  return (
    <th 
      className={cn(
        'px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <tbody className={cn('divide-y divide-border', className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, onClick }: TableRowProps) {
  return (
    <tr 
      className={cn(
        'hover:bg-surface-hover transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className, align = 'left' }: TableCellProps) {
  return (
    <td 
      className={cn(
        'px-4 py-3 text-sm text-text-primary',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      {children}
    </td>
  );
}

export function TableEmptyState({ 
  message = 'No data found', 
  colSpan = 1 
}: { 
  message?: string; 
  colSpan?: number;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        <p className="text-sm text-text-muted">{message}</p>
      </td>
    </tr>
  );
}
