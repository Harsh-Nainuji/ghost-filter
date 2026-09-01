'use client'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type { StoredJob } from '@/types'

export function ScoreChart({ jobs }: { jobs: StoredJob[] }) {
  const buckets = [
    { name: '0-25', count: 0, fill: '#14b8a6' },
    { name: '26-50', count: 0, fill: '#0d9488' },
    { name: '51-75', count: 0, fill: '#0f766e' },
    { name: '76+', count: 0, fill: '#0d3a36' }
  ]

  jobs.forEach(job => {
    if (job.totalScore <= 25) buckets[0].count++
    else if (job.totalScore <= 50) buckets[1].count++
    else if (job.totalScore <= 75) buckets[2].count++
    else buckets[3].count++
  })

  return (
    <div className="h-[300px] w-full rounded-lg border border-border bg-card p-8 shadow-sm flex flex-col">
      <h3 className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Risk Distribution</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
            <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <Tooltip 
              cursor={{ fill: '#2a2a2a' }}
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '4px' }}
              itemStyle={{ color: '#e5e5e5' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
