'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Clock, GripVertical, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { TaskModel } from '@/lib/generated/prisma/models'
import { updateQuickTask, deleteTask } from '@/app/actions/tasks'
import { UpdateTaskDialog } from '@/components/update-task-dialog'

interface TasksListProps {
  tasks: TaskModel[]
  onStatusChange: (
    id: string,
    newStatus: 'todo' | 'in-progress' | 'done'
  ) => void
  onReorderTasks: (newTasks: TaskModel[]) => void
}

const statusConfig = {
  todo: {
    label: 'To Do',
    color: 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300',
    icon: Circle,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary',
    icon: Clock,
  },
  done: {
    label: 'Done',
    color:
      'bg-accent/20 dark:bg-accent/30 text-accent-foreground dark:text-accent',
    icon: CheckCircle2,
  },
}

interface TaskCardProps {
  task: TaskModel
  expandedTaskId: string | null
  setExpandedTaskId: (id: string | null) => void
  onStatusChange: (
    id: string,
    newStatus: 'todo' | 'in-progress' | 'done'
  ) => void
  isDragging: boolean
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: TaskModel) => void
  onDragEnd?: () => void
  onEditTask: (task: TaskModel) => void
  onDeleteTask: (id: string) => void
}

function TaskCard({
  task,
  expandedTaskId,
  setExpandedTaskId,
  onStatusChange,
  isDragging,
  onDragStart,
  onDragEnd,
  onEditTask,
  onDeleteTask,
}: TaskCardProps) {
  const config = statusConfig[task.status.toLocaleLowerCase() as keyof typeof statusConfig]
  const IconComponent = config.icon

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      className={`border-border dark:border-sidebar-border/30 dark:bg-card/50 group cursor-grab overflow-hidden border bg-white transition-all hover:shadow-md active:cursor-grabbing dark:hover:shadow-lg ${
        isDragging ? 'opacity-50 shadow-lg dark:shadow-2xl' : ''
      }`}
      onClick={() => onEditTask(task)}
    >
      <div className="space-y-3 p-4">
        <div className="flex items-start gap-4">
          <div className="text-muted-foreground dark:text-muted-foreground mt-0.5">
            <GripVertical className="h-5 w-5" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground dark:text-muted-foreground h-6 w-6 dark:hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <IconComponent className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onStatusChange(task.id, 'todo')}>
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(task.id, 'in-progress')}
              >
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, 'done')}>
                Done
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="min-w-0 flex-1">
            <p
              className={`text-foreground font-medium transition-all dark:text-white ${
                task.status === 'done'
                  ? 'text-muted-foreground dark:text-muted-foreground line-through'
                  : ''
              }`}
            >
              {task.title}
            </p>
          </div>

          <Badge className={`${config.color} text-xs font-medium`}>
            {config.label}
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all"
            onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id) }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-muted-foreground dark:text-muted-foreground flex items-center gap-2 pl-9 text-xs">
          <Clock className="h-3 w-3" />
          <span>{new Date(task.date).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  )
}

export function TasksList({
  tasks,
  onStatusChange,
  onReorderTasks,
}: TasksListProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [draggedTask, setDraggedTask] = useState<TaskModel | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null)
  const [draggedTaskHeight, setDraggedTaskHeight] = useState<number>(0)

  const groupedTasks = {
    todo: tasks.filter((t) => t.status === 'todo'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    done: tasks.filter((t) => t.status === 'done'),
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: TaskModel) => {
    setDraggedTask(task)
    // Get the Card element height for placeholder
    const card = (e.target as HTMLDivElement).closest(
      '[draggable="true"]'
    ) as HTMLDivElement
    const height = card?.offsetHeight || 120 // Default fallback height
    setDraggedTaskHeight(height)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDraggedTaskHeight(0)
    setDragOverStatus(null)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (status: string) => {
    setDragOverStatus(status)
  }

  const handleDragLeave = () => {
    setDragOverStatus(null)
  }

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    status: 'todo' | 'in-progress' | 'done'
  ) => {
    e.preventDefault()
    setDragOverStatus(null)
    setDraggedTaskHeight(0)

    if (!draggedTask) return

    if (draggedTask.status !== status) {
      onStatusChange(draggedTask.id, status)
      const updated = tasks.map((t) =>
        t.id === draggedTask.id ? { ...t, status } : t
      )
      onReorderTasks(updated)
    }

    draggedTask.status = status
    updateQuickTask(draggedTask.id, draggedTask)

    setDraggedTask(null)
  }

  const renderTaskSection = (
    status: 'todo' | 'in-progress' | 'done',
    title: string
  ) => {
    const sectionTasks = groupedTasks[status]

    return (
      <div key={status} className="space-y-3">
        <div className="flex items-center gap-3 px-1">
          <h3 className="text-muted-foreground dark:text-muted-foreground text-sm font-semibold">
            {title}
          </h3>
          <span className="bg-muted dark:bg-sidebar-accent text-foreground inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium dark:text-white">
            {sectionTasks.length}
          </span>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragEnter={() => handleDragEnter(status)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, status)}
          className={`min-h-12 space-y-2 overflow-hidden rounded-lg p-3 transition-colors ${
            dragOverStatus === status
              ? 'bg-primary/10 dark:bg-primary/20 border-primary/50 dark:border-primary/40 border-2'
              : 'hover:bg-muted/30 dark:hover:bg-sidebar-accent/10'
          }`}
        >
          {sectionTasks.length === 0 ? (
            <p className="text-muted-foreground dark:text-muted-foreground py-4 text-center text-xs">
              No tasks yet
            </p>
          ) : (
            <>
              {sectionTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  expandedTaskId={expandedTaskId}
                  setExpandedTaskId={setExpandedTaskId}
                  onStatusChange={onStatusChange}
                  isDragging={draggedTask?.id === task.id}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onEditTask={(t) => { setSelectedTask(t); setUpdateDialogOpen(true) }}
                  onDeleteTask={async (id) => {
                    await deleteTask(id)
                    onReorderTasks(tasks.filter((t) => t.id !== id))
                  }}
                />
              ))}
              {dragOverStatus === status &&
                draggedTask &&
                draggedTask.status !== status && (
                  <div
                    style={{ height: `${draggedTaskHeight}px` }}
                    className="bg-primary/20 dark:bg-primary/30 border-primary/40 dark:border-primary/30 rounded-md border-2 border-dashed transition-all"
                  />
                )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {renderTaskSection('todo', 'To Do')}
        {renderTaskSection('in-progress', 'In Progress')}
        {renderTaskSection('done', 'Done')}
      </div>
      <UpdateTaskDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        task={selectedTask}
        onUpdated={(updated) => {
          onReorderTasks(tasks.map((t) => (t.id === updated.id ? updated : t)))
          setUpdateDialogOpen(false)
        }}
      />
    </>
  )
}
