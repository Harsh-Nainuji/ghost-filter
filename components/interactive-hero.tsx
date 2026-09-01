'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ShieldCheck, Activity, Cpu, Sparkles } from 'lucide-react'

interface InteractiveHeroProps {
  totalChecks?: number
}

export function InteractiveHero({ totalChecks = 0 }: InteractiveHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const animFrameRef = useRef<number | null>(null)

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    // Normalize coordinates from -1 to 1 relative to center
    const normX = ((x / rect.width) - 0.5) * 2
    const normY = ((y / rect.height) - 0.5) * 2

    // Target rotations (degrees)
    const targetRotateX = -normY * 18
    const targetRotateY = normX * 18

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
    }

    animFrameRef.current = requestAnimationFrame(() => {
      setRotate({ x: targetRotateX, y: targetRotateY })
      setGlowPos({
        x: Math.max(0, Math.min(100, (x / rect.width) * 100)),
        y: Math.max(0, Math.min(100, (y / rect.height) * 100)),
      })
    })
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true)
    handlePointerMove(e.clientX, e.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      setIsHovered(true)
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  const handlePointerLeave = () => {
    setIsHovered(false)
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
    }
    setRotate({ x: 0, y: 0 })
    setGlowPos({ x: 50, y: 50 })
  }

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handlePointerLeave}
      className="relative w-full max-w-[540px] mx-auto select-none group focus:outline-none flex flex-col items-center justify-center py-4"
      style={{ perspective: '1200px' }}
      tabIndex={0}
      aria-label="Interactive GhostFilter Mascot"
    >
      {/* Dynamic Cyan Energy Aura Backdrop */}
      <div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-accent/25 blur-3xl transition-opacity duration-500 opacity-60 group-hover:opacity-90 pointer-events-none z-0 animate-pulse"
        style={{
          transform: `translate(${rotate.y * 1.8}px, ${rotate.x * 1.8}px)`,
        }}
      />

      {/* Freestanding 3D Interactive Mascot Container */}
      <div
        className="relative z-10 w-full flex flex-col items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.04 : 1}, ${isHovered ? 1.04 : 1}, 1)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Light Sheen Spotlight Overlay behind mascot */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(600px circle at ${glowPos.x}% ${glowPos.y}%, rgba(20, 184, 166, 0.2), transparent 50%)`,
          }}
        />

        {/* Large Ghost Mascot Image */}
        <div 
          className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px] lg:w-[480px] lg:h-[480px] transition-all duration-300 ease-out filter drop-shadow-[0_16px_36px_rgba(20,184,166,0.35)] group-hover:drop-shadow-[0_24px_48px_rgba(20,184,166,0.55)]"
          style={{ transform: 'translateZ(40px)' }}
        >
          <Image
            src="/hero.png"
            alt="GhostFilter Analysis Mascot"
            fill
            className="object-contain transform transition-transform duration-500 ease-out group-hover:scale-105"
            priority
          />
        </div>

        {/* Floating Minimalist HUD Status Badges (No Box Container) */}
        <div 
          className="relative z-20 -mt-4 sm:-mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-mono text-[10px] sm:text-[11px]"
          style={{ transform: 'translateZ(60px)' }}
        >
          <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-card/80 backdrop-blur-md px-3.5 py-1.5 shadow-lg text-muted-foreground">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span>SYSTEM: <strong className="text-foreground">OPERATIONAL</strong></span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border/80 bg-card/80 backdrop-blur-md px-3.5 py-1.5 shadow-lg text-muted-foreground">
            <Cpu size={12} className="text-accent" />
            <span>ANALYSES: <strong className="text-foreground">{totalChecks > 0 ? totalChecks.toLocaleString() : '1,200+'}</strong></span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border/80 bg-card/80 backdrop-blur-md px-3.5 py-1.5 shadow-lg text-muted-foreground">
            <Activity size={12} className="text-accent" />
            <span>CONFIDENCE: <strong className="text-foreground">85%</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}
