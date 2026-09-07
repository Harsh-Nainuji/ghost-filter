'use client'

import { useEffect, useState, useCallback } from 'react'

interface TutorialOverlayProps {
  targetElement: HTMLElement | null
  padding?: number
}

export function TutorialOverlay({ targetElement, padding = 8 }: TutorialOverlayProps) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  const updatePosition = useCallback(() => {
    if (typeof window === 'undefined') return
    setViewport({ width: window.innerWidth, height: window.innerHeight })

    if (targetElement) {
      const r = targetElement.getBoundingClientRect()
      setRect(r)
    } else {
      setRect(null)
    }
  }, [targetElement])

  useEffect(() => {
    updatePosition()

    window.addEventListener('resize', updatePosition, { passive: true })
    window.addEventListener('scroll', updatePosition, { passive: true })

    let resizeObserver: ResizeObserver | null = null
    if (targetElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updatePosition())
      resizeObserver.observe(targetElement)
    }

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [targetElement, updatePosition])

  if (!rect || viewport.width === 0) return null

  // Ensure cutout stays within bounds
  const top = Math.max(0, rect.top - padding)
  const left = Math.max(0, rect.left - padding)
  const width = Math.min(viewport.width - left, rect.width + padding * 2)
  const height = Math.min(viewport.height - top, rect.height + padding * 2)

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
      {/* SVG Backdrop with Hole Cutout */}
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <mask id="tutorial-spotlight-mask">
            {/* White background means visible backdrop */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black rectangle creates the transparent hole */}
            <rect
              x={left}
              y={top}
              width={width}
              height={height}
              rx={8}
              ry={8}
              fill="black"
            />
          </mask>
        </defs>

        {/* Dimmed Backdrop overlay */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(5, 10, 15, 0.78)"
          mask="url(#tutorial-spotlight-mask)"
        />
      </svg>

      {/* Animated Glowing Spotlight Focus Ring */}
      <div
        className="absolute rounded-lg border-2 border-accent transition-all duration-300 ease-out shadow-[0_0_20px_rgba(20,184,166,0.6),_inset_0_0_15px_rgba(20,184,166,0.2)] animate-pulse"
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  )
}
