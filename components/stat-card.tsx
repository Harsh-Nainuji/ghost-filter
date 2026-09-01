export function StatCard({ title, value, subtitle }: { title: string, value: string | number, subtitle?: string }) {
    <div className="rounded-lg border border-border bg-card p-8 shadow-sm flex flex-col justify-center text-left">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
      <p className="mt-3 font-mono text-3xl font-normal">{value}</p>
      {subtitle && <p className="mt-2 font-mono text-[10px] tracking-widest text-muted-foreground">{subtitle}</p>}
    </div>
}
