"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface ProgressPhase {
  key: string
  label: string
  icon: LucideIcon
}

interface RFPProgressBarProps {
  phases: ProgressPhase[]
  currentIndex: number
}

export function RFPProgressBar({ phases, currentIndex }: RFPProgressBarProps) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center w-full">
          {phases.map((phase, index) => {
            const isActive = index === currentIndex
            const isCompleted = index < currentIndex
            const Icon = phase.icon

            return (
              <div key={phase.key} className="flex items-center flex-1 last:flex-none">
                {/* Phase step */}
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-green text-white"
                        : isCompleted
                        ? "bg-brand-green-light text-brand-green"
                        : "bg-surface-hover text-text-muted"
                    )}
                  >
                    {isCompleted ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:block",
                      isActive ? "text-text-primary" : "text-text-muted"
                    )}
                  >
                    {phase.label}
                  </span>
                </div>

                {/* Connector line — stretches to fill space between phases */}
                {index < phases.length - 1 && (
                  <div className="flex-1 mx-3">
                    <div
                      className={cn(
                        "h-px w-full",
                        isCompleted ? "bg-brand-green" : "bg-border"
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
