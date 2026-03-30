'use client'

import { useRef } from 'react'
import { useStore } from '@/store'
import type { TaskModel } from '@/lib/generated/prisma/models/Task'

interface StoreInitializerProps {
  tasks: TaskModel[]
  streak: { currentStreak: number; longestStreak: number } | null
}

export function StoreInitializer({ tasks, streak }: StoreInitializerProps) {
  const initialized = useRef(false)
  const reorderTasks = useStore(state => state.reorderTasks)
  const setStreak = useStore(state => state.setStreak)

  if (!initialized.current) {
    reorderTasks(tasks)
    setStreak(streak?.currentStreak ?? 0, streak?.longestStreak ?? 0)
    initialized.current = true
  }

  return null
}
