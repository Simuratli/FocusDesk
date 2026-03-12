'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface MetricsCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: string
  color: string
}

export function MetricsCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: MetricsCardProps) {
  const isPercentage = typeof value === 'string' && value.includes('%')

  return (
    <Card
      className={`border-border dark:bg-card/50 dark:border-sidebar-border/30 overflow-hidden border bg-white transition-all hover:shadow-md dark:hover:shadow-lg ${color}`}
    >
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground dark:text-muted-foreground text-sm font-medium">
              {title}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-foreground text-4xl font-bold dark:text-white">
                {value}
              </span>
            </div>
          </div>
          <span className="text-4xl">{icon}</span>
        </div>

        {isPercentage && (
          <div className="space-y-2">
            <Progress
              value={parseInt(String(value))}
              className="bg-muted dark:bg-sidebar-accent h-2"
            />
          </div>
        )}

        <p className="text-muted-foreground dark:text-muted-foreground text-xs">
          {subtitle}
        </p>
      </div>
    </Card>
  )
}
