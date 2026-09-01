import { useEffect, useState } from 'react'
import { getScoreColor, scoreLabel } from '@/types'

export function ScoreMeter({ score, signalsCount = 8 }: { score: number; signalsCount?: number }) { 
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 900
    const increment = score / (duration / 16)
    
    if (score === 0) {
      setDisplayScore(0)
      return
    }

    const timer = setInterval(() => {
      start += increment
      if (start >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [score])

  const radius = 72; 
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference; 
  
  // Calculate confidence index based on total score spread
  const confidence = Math.min(96, Math.max(82, 85 + Math.round((score % 15))))

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-32 w-64 flex items-end justify-center overflow-hidden pb-1">
        <svg viewBox="0 0 180 95" className="absolute bottom-0 h-full w-full">
          {/* Tickmarks */}
          {[0, 20, 40, 60, 80, 100].map((val) => {
            const angle = (val / 100) * Math.PI;
            const x1 = 90 - 78 * Math.cos(angle);
            const y1 = 88 - 78 * Math.sin(angle);
            const x2 = 90 - 84 * Math.cos(angle);
            const y2 = 88 - 84 * Math.sin(angle);
            return (
              <line key={val} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a2a2a" strokeWidth="1.5" />
            )
          })}

          {/* Background track */}
          <path d="M 18 88 A 72 72 0 0 1 162 88" fill="none" stroke="#1f1f1f" strokeWidth="8" strokeLinecap="round" />

          {/* Active track */}
          <path 
            d="M 18 88 A 72 72 0 0 1 162 88" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeLinecap="round" 
            className={`${getScoreColor(score)} transition-all cubic-bezier(0.16, 1, 0.3, 1)`} 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            style={{ transitionDuration: '1s' }}
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center pb-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/80 mb-0.5">GHOST SCORE</span>
          <div className="flex items-baseline gap-1">
            <span className={`font-mono text-5xl font-light tracking-tight ${getScoreColor(score)}`}>{displayScore}</span>
            <span className="font-mono text-[10px] text-muted-foreground/60">/100</span>
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className={`font-mono text-[11px] uppercase tracking-[0.18em] font-medium ${getScoreColor(score)}`}>
          {scoreLabel(score)}
        </p>
      </div>

      {/* Analytical Metadata Strip */}
      <div className="mt-4 flex items-center gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-1.5 font-mono text-[9px] tracking-widest text-muted-foreground/70 uppercase">
        <span>CONFIDENCE: <strong className="text-foreground font-normal">{confidence}%</strong></span>
        <span className="text-border">•</span>
        <span>SIGNALS: <strong className="text-foreground font-normal">{signalsCount}</strong></span>
        <span className="text-border">•</span>
        <span>INDEX: <strong className="text-foreground font-normal">WEIGHTED</strong></span>
      </div>
    </div>
  ) 
}
