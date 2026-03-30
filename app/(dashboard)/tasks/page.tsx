'use client'

import { useState } from 'react'
import { CheckSquare, Plus } from 'lucide-react'
import { TasksList } from '@/components/tasks-list'
import { Button } from '@/components/ui/button'
import { DetailedAddTaskDialog } from '@/components/detailed-add-task-dialog'
import { useStore } from '@/store'
import { TaskModel } from '@/lib/generated/prisma/models'
import { createTask } from '@/app/actions/tasks'


export default function TasksPage() {
  const [detailedOpen, setDetailedOpen] = useState(false)
  const tasks = useStore(state => state.tasks)
  const updateTask = useStore(state => state.updateTask)
  const reorderTasks = useStore(state => state.reorderTasks)
  const addTask = useStore(state => state.addTask)

  const completedCount = tasks.filter((t) => t.status === 'done').length

  const handleStatusChange = (id: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    updateTask({ ...task, status: newStatus })
  }

  const handleReorderTasks = (newTasks: TaskModel[]) => {
    reorderTasks(newTasks)
  }

  const handleDetailedAdd = (task: TaskModel) => {
    console.log('Adding task:', task)
    createTask(task).then((createdTask) => {
      console.log('Created task:', createdTask)
      addTask(createdTask)
    })
  }

  return (
    <div className="min-h-screen px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-600/30">
              <CheckSquare className="w-5 h-5 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          </div>
          <p className="text-muted-foreground text-sm ml-13">
            {completedCount} / {tasks.length} tamamlandı
          </p>
        </div>

        <Button
          onClick={() => setDetailedOpen(true)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Yeni görev
        </Button>
      </div>

      <DetailedAddTaskDialog
        open={detailedOpen}
        onOpenChange={setDetailedOpen}
        onAddTask={handleDetailedAdd}
      />

      {/* Progress Bar */}
      <div className="mb-6 bg-card border border-border rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Tamamlanma oranı</span>
          <span className="text-foreground font-medium">
            {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: tasks.length > 0 ? `${(completedCount / tasks.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Task List */}
      <TasksList
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onReorderTasks={handleReorderTasks}
      />
    </div>
  )
}
