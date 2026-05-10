'use client';

import { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Standardized filter bar component for consistent search and filter patterns.
 * 
 * Usage:
 * <FilterBar
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   searchPlaceholder="Search..."
 * >
 *   <Select>...</Select>
 *   <Button>Filter</Button>
 * </FilterBar>
 */
export function FilterBar({ 
  searchValue, 
  onSearchChange, 
  searchPlaceholder = 'Search...', 
  children,
  className 
}: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-4 p-4 bg-surface rounded-lg border border-border', className)}>
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background border-border"
        />
      </div>
      {children}
    </div>
  );
}
