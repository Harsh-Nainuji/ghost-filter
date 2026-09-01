export function StatCard({ title, value, subtitle }: { title: string, value: string | number, subtitle?: string }) {
  return (
    <div className="interactive-card rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col justify-center text-left">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
      <p className="mt-2.5 font-mono text-2xl font-normal text-foreground">{value}</p>
      {subtitle && <p className="mt-1.5 font-mono text-[10px] tracking-widest text-muted-foreground/80">{subtitle}</p>}
    </div>
  )
}

