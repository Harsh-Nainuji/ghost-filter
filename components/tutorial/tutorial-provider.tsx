'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { TUTORIAL_STEPS, TutorialStep } from './tutorial-steps'
import { TutorialOverlay } from './tutorial-overlay'
import { TutorialTooltip } from './tutorial-tooltip'

interface TutorialContextType {
  isActive: boolean
  currentStepIndex: number
  currentStep: TutorialStep | null
  totalSteps: number
  startTutorial: () => void
  stopTutorial: () => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (index: number) => void
}

const TutorialContext = createContext<TutorialContextType | null>(null)

export function useTutorial() {
  const context = useContext(TutorialContext)
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider')
  }
  return context
}

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const currentStep = TUTORIAL_STEPS[currentStepIndex] || null

  // Auto-start on first visit
  useEffect(() => {
    if (typeof window === 'undefined') return
    const seen = localStorage.getItem('ghostfilter_tutorial_seen')
    if (!seen) {
      const timer = setTimeout(() => {
        setIsActive(true)
        setCurrentStepIndex(0)
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [])

  // Find target element & scroll into view smoothly
  const locateTarget = useCallback(() => {
    if (!isActive || !currentStep) {
      setTargetElement(null)
      return
    }

    // Check if route matches current step
    if (currentStep.route && pathname !== currentStep.route) {
      router.push(currentStep.route)
      return
    }

    const el = document.querySelector(currentStep.targetSelector) as HTMLElement | null

    if (el) {
      setTargetElement(el)
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    } else {
      // Fallback if target not yet rendered in DOM
      setTargetElement(null)
    }
  }, [isActive, currentStep, pathname, router])

  useEffect(() => {
    if (isActive) {
      locateTarget()

      // Retry after DOM render or route transition
      const timer = setTimeout(locateTarget, 300)
      return () => clearTimeout(timer)
    }
  }, [isActive, currentStepIndex, pathname, locateTarget])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return
      if (e.key === 'Escape') stopTutorial()
      if (e.key === 'ArrowRight' && currentStepIndex < TUTORIAL_STEPS.length - 1) nextStep()
      if (e.key === 'ArrowLeft' && currentStepIndex > 0) prevStep()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, currentStepIndex])

  const startTutorial = () => {
    setIsActive(true)
    setCurrentStepIndex(0)
  }

  const stopTutorial = () => {
    setIsActive(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ghostfilter_tutorial_seen', 'true')
    }
  }

  const nextStep = () => {
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      stopTutorial()
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }

  const goToStep = (index: number) => {
    if (index >= 0 && index < TUTORIAL_STEPS.length) {
      setCurrentStepIndex(index)
    }
  }

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        totalSteps: TUTORIAL_STEPS.length,
        startTutorial,
        stopTutorial,
        nextStep,
        prevStep,
        goToStep,
      }}
    >
      {children}

      {/* Render Active Dynamic Spotlight System */}
      {isActive && currentStep && (
        <>
          <TutorialOverlay targetElement={targetElement} />
          <TutorialTooltip
            step={currentStep}
            targetElement={targetElement}
            currentStepIndex={currentStepIndex}
            totalSteps={TUTORIAL_STEPS.length}
            onNext={nextStep}
            onPrev={prevStep}
            onSkip={stopTutorial}
          />
        </>
      )}
    </TutorialContext.Provider>
  )
}
