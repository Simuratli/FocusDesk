'use client'

import { MetricsCard } from '@/components/metrics-card'
import { TasksList } from '@/components/tasks-list'
import { QuickAddTaskDialog } from '@/components/quick-add-task-dialog'
import { useStore } from '@/store'
import { updateQuickTask } from '@/app/actions/tasks'
import { updateStreak } from '@/app/actions/streak'

export function DashboardContent() {
  const tasks = useStore(state => state.tasks)
  const updateTask = useStore(state => state.updateTask)
  const reorderTasks = useStore(state => state.reorderTasks)
  const currentStreak = useStore(state => state.currentStreak)
  const longestStreak = useStore(state => state.longestStreak)
  const setStreak = useStore(state => state.setStreak)

  const completedCount = tasks.filter((t) => t.status === 'done').length
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  const handleStatusChange = async (
    id: string,
    newStatus: 'todo' | 'in-progress' | 'done'
  ) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    const updated = { ...task, status: newStatus }
    updateTask(updated)
    await updateQuickTask(id, updated)
    if (newStatus === 'done') {
      const streak = await updateStreak()
      if (streak) setStreak(streak.currentStreak, streak.longestStreak)
    }
  }

  const handleReorderTasks = (newTasks: typeof tasks) => {
    reorderTasks(newTasks)
  }

  const handleQuickAddTask = (_title: string, _priority: 'high' | 'normal' | 'low') => {
    // Task is added via server action in QuickAddTaskDialog
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
          subtitle={`${completedCount} of ${tasks.length}`}
          icon="✅"
          color="bg-accent/10 dark:bg-accent/20"
        />
        <MetricsCard
          title="Current Streak"
          value={`${currentStreak} days`}
          subtitle={`Longest: ${longestStreak} days`}
          icon="🔥"
          color="bg-orange-500/10 dark:bg-orange-500/20"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground text-xl font-semibold dark:text-white">
            Tasks
          </h2>
          <QuickAddTaskDialog onAddTask={handleQuickAddTask} />
        </div>
        <TasksList
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onReorderTasks={handleReorderTasks}
        />
      </div>
    </div>
  )
}
