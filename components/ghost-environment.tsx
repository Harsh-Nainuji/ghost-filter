'use client'

export function GhostEnvironment() {
  return (
    <div 
      aria-hidden="true" 
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0a0c0c] select-none"
    >
      {/* Layer 1: Strong Top Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(20,184,166,0.16),rgba(10,12,12,0.95))]" />

      {/* Layer 2: Animated Atmospheric Blobs */}
      <div className="atmosphere-layer-1 absolute -top-[15%] -left-[10%] h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.12)_0%,rgba(10,12,12,0)_70%)] blur-[100px]" />
      <div className="atmosphere-layer-2 absolute top-[35%] -right-[10%] h-[750px] w-[750px] rounded-full bg-[radial-gradient(circle,rgba(15,143,135,0.14)_0%,rgba(10,12,12,0)_70%)] blur-[120px]" />
      <div className="atmosphere-layer-1 absolute -bottom-[20%] left-[25%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(11,61,58,0.2)_0%,rgba(10,12,12,0)_70%)] blur-[110px]" />

      {/* Layer 3: Distinct Technical Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07]" 
        style={{
          backgroundImage: `linear-gradient(to right, #14b8a6 1.5px, transparent 1.5px), linear-gradient(to bottom, #14b8a6 1.5px, transparent 1.5px)`,
          backgroundSize: '56px 56px'
        }}
      />

      {/* Layer 4: Slow Radar Scan Beam */}
      <div className="animate-scanline absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent opacity-40" />

      {/* Layer 5: Soft Peripheral Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(10,12,12,0.6)_100%)]" />
    </div>
  )
}
