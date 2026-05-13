"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type BarChartPoint = {
  label: string
  value: number
}

export function BarChart({
  data,
  height = 160,
  valueFormatter,
  className,
}: {
  data: BarChartPoint[]
  height?: number
  valueFormatter?: (value: number) => string
  className?: string
}) {
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, idx) => {
          const h = Math.round((d.value / max) * 100)
          const title = valueFormatter ? `${d.label}: ${valueFormatter(d.value)}` : `${d.label}: ${d.value}`
          return (
            <div key={`${d.label}-${idx}`} className="flex-1 flex flex-col items-center gap-2 min-w-0">
              <div className="w-full flex items-end justify-center">
                <div
                  title={title}
                  className="w-full max-w-[18px] rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
                  style={{ height: `${Math.max(4, h)}%` }}
                >
                  <div
                    className="h-full w-full rounded-full bg-primary"
                    style={{ opacity: 0.9 }}
                  />
                </div>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">{d.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
