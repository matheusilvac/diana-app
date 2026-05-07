import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-2xl bg-secondary/5",
        className
      )}
    >
      <div className="p-4 bg-primary/10 rounded-full mb-4">
        <Icon className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[250px] mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-primary hover:bg-primary/90 text-white">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
