'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  SUPPLIER_PHASE_CONFIG, 
  type SupplierRFPPhase 
} from '@/lib/mock-supplier-rfps'

interface SupplierPhaseBadgeProps {
  phase: SupplierRFPPhase
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showIcon?: boolean
}

/**
 * A reusable badge component for displaying supplier RFP phases
 * with consistent styling across the application.
 */
export function SupplierPhaseBadge({ 
  phase, 
  size = 'md', 
  className,
  showIcon = false 
}: SupplierPhaseBadgeProps) {
  const config = SUPPLIER_PHASE_CONFIG[phase]
  
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1',
  }

  return (
    <Badge 
      className={cn(
        config.color,
        sizeClasses[size],
        'font-medium border-0',
        className
      )}
    >
      {config.label}
    </Badge>
  )
}

/**
 * Utility component to display a phase progress indicator
 * showing current phase position in the workflow.
 */
interface PhaseProgressProps {
  currentPhase: SupplierRFPPhase
  phases?: SupplierRFPPhase[]
  className?: string
}

export function SupplierPhaseProgress({ 
  currentPhase, 
  phases = ['new_rfp', 'in_progress', 'under_final_review', 'submitted', 'client_reviewing', 'awarded'],
  className 
}: PhaseProgressProps) {
  const currentIndex = phases.indexOf(currentPhase)
  const isTerminal = ['awarded', 'rejected', 'declined'].includes(currentPhase)
  
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {phases.map((phase, idx) => {
        const isCompleted = idx < currentIndex
        const isCurrent = idx === currentIndex
        const config = SUPPLIER_PHASE_CONFIG[phase]
        
        return (
          <div key={phase} className="flex items-center">
            <div
              className={cn(
                'h-2 w-2 rounded-full transition-colors',
                isCompleted || isCurrent
                  ? isTerminal && isCurrent
                    ? currentPhase === 'awarded' 
                      ? 'bg-green-500' 
                      : currentPhase === 'rejected' 
                        ? 'bg-red-500' 
                        : 'bg-gray-400'
                    : 'bg-[#16A34A]'
                  : 'bg-gray-200'
              )}
              title={config.label}
            />
            {idx < phases.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-4 transition-colors',
                  isCompleted ? 'bg-[#16A34A]' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export { SUPPLIER_PHASE_CONFIG, type SupplierRFPPhase }
