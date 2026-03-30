'use client'

import { useState } from 'react'
import { Plus, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DetailedAddTaskDialog } from '@/components/detailed-add-task-dialog'
import { useStore } from '@/store'
import { createQuickTask } from '@/app/actions/tasks'

type Priority = 'high' | 'normal' | 'low'

interface QuickTask {
  id: number
  title: string
  priority: Priority
}

const priorityConfig: Record<Priority, { label: string; color: string; dot: string }> = {
  high:   { label: 'Yüksek', color: 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30',   dot: 'bg-red-400' },
  normal: { label: 'Normal', color: 'bg-orange-400/20 text-orange-300 border border-orange-400/40 hover:bg-orange-400/30', dot: 'bg-orange-400' },
  low:    { label: 'Düşük',  color: 'bg-zinc-600/40 text-zinc-300 border border-zinc-500/40 hover:bg-zinc-600/50',   dot: 'bg-zinc-400' },
}

interface QuickAddTaskDialogProps {
  onAddTask: (title: string, priority: Priority) => void
}

export function QuickAddTaskDialog({ onAddTask }: QuickAddTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [detailedOpen, setDetailedOpen] = useState(false)
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const tasksState = useStore(state => state.tasks)
  const addTask = useStore(state => state.addTask)
  const handleAdd = async () => {
    if (!input.trim()) return
    const task = await createQuickTask(input.trim(), priority)
    addTask(task)
    onAddTask(input.trim(), priority)
    setInput('')
  }

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Hızlı görev ekle
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-700 text-white p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
            Hızlı Görev Ekle
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 pt-4 pb-2 space-y-4">
          {/* Input Row */}
          <div className="flex gap-2">
            <Input
              autoFocus
              placeholder="Ne yapacaksın? Enter'a bas..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
              className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
            <Button
              onClick={handleAdd}
              className="bg-zinc-700 hover:bg-zinc-600 text-white border border-zinc-600 shrink-0"
            >
              Ekle
            </Button>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-sm">Öncelik:</span>
            {(['high', 'normal', 'low'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${priorityConfig[p].color} ${
                  priority === p ? 'ring-2 ring-offset-1 ring-offset-zinc-900 ring-zinc-500' : ''
                }`}
              >
                {priorityConfig[p].label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 mx-5 my-3" />

        {/* Today's tasks */}
        <div className="px-5 pb-2">
          <p className="text-zinc-400 text-xs mb-3">Bugün eklenenler</p>
          <div className="space-y-1">
            {tasksState.map((task) => (
              <div key={task.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-800/50">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${priorityConfig[task.priority.toLowerCase() as Priority].dot}`} />
                  <span className="text-white text-sm font-medium">{task.title}</span>
                </div>
                <span className="text-zinc-400 text-xs">{priorityConfig[task.priority.toLowerCase() as Priority].label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 mx-5 my-3" />
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2.5">
            <Info className="w-4 h-4 text-zinc-500 shrink-0" />
            <p className="text-zinc-400 text-xs">
              Detaylı eklemek için{' '}
              <button
                onClick={() => { setOpen(false); setDetailedOpen(true) }}
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                Detaylı ekle
              </button>
              &apos;ye geç
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <DetailedAddTaskDialog
      open={detailedOpen}
      onOpenChange={setDetailedOpen}
      onAddTask={(task) => onAddTask(task.title, task.priority.toUpperCase() as Priority)}
    />
    </>
  )
}
