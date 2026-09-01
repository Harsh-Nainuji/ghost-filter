import { ReactNode } from 'react'

export function EmptyState({ icon, title, description, action }: { icon: ReactNode, title: string, description: string, action?: ReactNode }) {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-lg border border-dashed border-border/80 p-8 text-center bg-card/30">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border/80 bg-muted/20 text-muted-foreground">
        {icon}
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">{title}</p>
      <p className="mt-2 max-w-sm text-xs sm:text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
