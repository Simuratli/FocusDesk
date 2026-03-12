'use client'

import { MetricsCard } from '@/components/metrics-card'
import { TasksList } from '@/components/tasks-list'
import { useState } from 'react'

interface Task {
  id: number
  title: string
  status: 'todo' | 'in-progress' | 'done'
  dueDate: string
}

export function DashboardContent() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Complete project proposal',
      status: 'done',
      dueDate: 'Today',
    },
    {
      id: 2,
      title: 'Review team feedback',
      status: 'in-progress',
      dueDate: 'Today',
    },
    {
      id: 3,
      title: 'Update documentation',
      status: 'in-progress',
      dueDate: 'Today',
    },
    {
      id: 4,
      title: 'Schedule meeting with stakeholders',
      status: 'todo',
      dueDate: 'Today',
    },
    {
      id: 5,
      title: 'Prepare presentation slides',
      status: 'todo',
      dueDate: 'Today',
    },
    {
      id: 6,
      title: 'Fix critical bug in production',
      status: 'todo',
      dueDate: 'Today',
    },
  ])

  const completedCount = tasks.filter((t) => t.status === 'done').length
  const completionPercentage = Math.round((completedCount / tasks.length) * 100)
  const streak = 12

  const handleStatusChange = (
    id: number,
    newStatus: 'todo' | 'in-progress' | 'done'
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    )
  }

  const handleReorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        <MetricsCard
          title="Completion Rate"
          value={`${completionPercentage}%`}
          subtitle={completionPercentage > 50 ? '+5%' : '-2%'}
          icon="📊"
          color="bg-primary/10 dark:bg-primary/20"
        />
        <MetricsCard
          title="Tasks Completed"
          value={completedCount}
          subtitle={`of ${tasks.length}`}
          icon="✅"
          color="bg-accent/10 dark:bg-accent/20"
        />
        <MetricsCard
          title="Current Streak"
          value={`${streak} days`}
          subtitle="+2 days"
          icon="🔥"
          color="bg-orange-500/10 dark:bg-orange-500/20"
        />
      </div>

      <div>
        <h2 className="text-foreground mb-4 text-xl font-semibold dark:text-white">
          Tasks
        </h2>
        <TasksList
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onReorderTasks={handleReorderTasks}
        />
      </div>
    </div>
  )
}
