'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Sparkles, ChevronRight, ChevronLeft, X, ShieldCheck } from 'lucide-react'
import type { TutorialStep } from './tutorial-steps'

interface TutorialTooltipProps {
  step: TutorialStep
  targetElement: HTMLElement | null
  currentStepIndex: number
  totalSteps: number
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}

export function TutorialTooltip({
  step,
  targetElement,
  currentStepIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
}: TutorialTooltipProps) {
  const [position, setPosition] = useState<{ top: number; left: number; placement: 'top' | 'bottom' | 'left' | 'right' }>({
    top: 100,
    left: 100,
    placement: 'bottom',
  })

  const calculatePosition = useCallback(() => {
    if (typeof window === 'undefined') return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const tooltipWidth = Math.min(vw - 24, 380)
    const tooltipHeight = 220
    const margin = 14

    // Fallback centered position if target not present
    if (!targetElement) {
      setPosition({
        top: Math.max(12, (vh - tooltipHeight) / 2),
        left: Math.max(12, (vw - tooltipWidth) / 2),
        placement: 'bottom',
      })
      return
    }

    const rect = targetElement.getBoundingClientRect()

    // Determine space in all 4 directions
    const spaceBelow = vh - rect.bottom
    const spaceAbove = rect.top
    const spaceRight = vw - rect.right
    const spaceLeft = rect.left

    let placement: 'top' | 'bottom' | 'left' | 'right' = step.preferredPosition || 'bottom'

    // Determine placement based on fit
    if (placement === 'bottom' && spaceBelow < tooltipHeight + margin) {
      placement = spaceAbove >= tooltipHeight + margin ? 'top' : spaceRight >= tooltipWidth + margin ? 'right' : 'bottom'
    } else if (placement === 'top' && spaceAbove < tooltipHeight + margin) {
      placement = spaceBelow >= tooltipHeight + margin ? 'bottom' : 'top'
    } else if (placement === 'right' && spaceRight < tooltipWidth + margin) {
      placement = spaceLeft >= tooltipWidth + margin ? 'left' : 'bottom'
    } else if (placement === 'left' && spaceLeft < tooltipWidth + margin) {
      placement = spaceRight >= tooltipWidth + margin ? 'right' : 'bottom'
    }

    let top = 0
    let left = 0

    if (vw < 640) {
      // Mobile positioning: position neatly at bottom or top with safe margins
      left = Math.max(12, (vw - tooltipWidth) / 2)
      if (rect.bottom + tooltipHeight + margin < vh) {
        top = rect.bottom + margin
      } else if (rect.top - tooltipHeight - margin > 0) {
        top = rect.top - tooltipHeight - margin
      } else {
        top = Math.max(12, vh - tooltipHeight - 20)
      }
    } else {
      // Desktop positioning
      if (placement === 'bottom') {
        top = rect.bottom + margin
        left = rect.left + rect.width / 2 - tooltipWidth / 2
      } else if (placement === 'top') {
        top = rect.top - tooltipHeight - margin
        left = rect.left + rect.width / 2 - tooltipWidth / 2
      } else if (placement === 'right') {
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.right + margin
      } else if (placement === 'left') {
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.left - tooltipWidth - margin
      }

      // Clamp within viewport padding (12px min edge)
      left = Math.max(12, Math.min(vw - tooltipWidth - 12, left))
      top = Math.max(12, Math.min(vh - tooltipHeight - 12, top))
    }

    setPosition({ top, left, placement })
  }, [targetElement, step.preferredPosition])

  useEffect(() => {
    calculatePosition()
    window.addEventListener('resize', calculatePosition, { passive: true })
    window.addEventListener('scroll', calculatePosition, { passive: true })

    return () => {
      window.removeEventListener('resize', calculatePosition)
      window.removeEventListener('scroll', calculatePosition)
    }
  }, [calculatePosition])

  return (
    <div
      className="fixed z-[9999] w-[calc(100vw-24px)] max-w-[380px] rounded-xl border border-accent/40 bg-card p-5 sm:p-6 shadow-2xl space-y-4 transition-all duration-300 ease-out backdrop-blur-md"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Top Header Badge & Close Button */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-semibold flex items-center gap-1.5">
            <Sparkles size={11} /> {step.badgeText || `STEP ${currentStepIndex + 1} OF ${totalSteps}`}
          </span>
        </div>

        <button
          onClick={onSkip}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted/30"
          title="Exit Walkthrough"
          aria-label="Exit Walkthrough"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
          {step.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Progress Dots & Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-border/70">
        <button
          onClick={onPrev}
          disabled={currentStepIndex === 0}
          className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={13} /> PREV
        </button>

        {/* Step Dots */}
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                currentStepIndex === idx ? 'w-4 bg-accent' : 'w-1.5 bg-muted'
              }`}
            />
          ))}
        </div>

        {currentStepIndex < totalSteps - 1 ? (
          <button
            onClick={onNext}
            className="btn-hover-lift flex items-center gap-1 rounded bg-accent px-3 py-1.5 font-mono text-xs font-bold text-accent-foreground hover:bg-accent/90 transition-all"
          >
            NEXT <ChevronRight size={13} />
          </button>
        ) : (
          <button
            onClick={onSkip}
            className="btn-hover-lift flex items-center gap-1 rounded bg-accent px-3 py-1.5 font-mono text-xs font-bold text-accent-foreground hover:bg-accent/90 transition-all"
          >
            DONE <ShieldCheck size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
