'use client'

import { Clock, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex flex-col gap-1">
        <div className="text-muted-foreground dark:text-muted-foreground flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>{today}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-foreground hover:bg-muted dark:text-foreground dark:hover:bg-sidebar-accent"
      >
        <Bell className="h-5 w-5" />
      </Button>
    </div>
  )
}
