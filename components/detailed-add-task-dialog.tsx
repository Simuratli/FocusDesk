'use client'

import { useState } from 'react'
import { Briefcase, Heart, BookOpen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TaskModel } from '@/lib/generated/prisma/models'

type Priority = TaskModel['priority']
type Category = 'work' | 'personal' | 'learning'
type Duration = '30dk' | '1sa' | '2sa' | '3+sa'

interface DetailedTask {
  title: string
  description: string
  priority: Priority
  category: Category
  date: string
  duration: Duration
}

interface DetailedAddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: TaskModel) => void
}

const priorityOptions: { value: Priority; label: string; dot: string; bg: string; border: string; text: string }[] = [
  { value: 'HIGH',   label: 'Yüksek', dot: 'bg-red-400',    bg: 'bg-red-900/40',    border: 'border-red-700',    text: 'text-red-300' },
  { value: 'NORMAL', label: 'Normal',  dot: 'bg-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700', text: 'text-yellow-300' },
  { value: 'LOW',    label: 'Düşük',   dot: 'bg-zinc-400',   bg: 'bg-zinc-800/60',   border: 'border-zinc-600',   text: 'text-zinc-300' },
]

const categoryOptions: { value: Category; label: string; icon: React.ReactNode }[] = [
  { value: 'work',     label: 'İş',       icon: <Briefcase className="w-4 h-4" /> },
  { value: 'personal', label: 'Kişisel',  icon: <Heart className="w-4 h-4" /> },
  { value: 'learning', label: 'Öğrenme',  icon: <BookOpen className="w-4 h-4" /> },
]

const durationOptions: Duration[] = ['30dk', '1sa', '2sa', '3+sa']

export function DetailedAddTaskDialog({ open, onOpenChange, onAddTask }: DetailedAddTaskDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('NORMAL')
  const [category, setCategory] = useState<Category>('work')
  const [date, setDate] = useState('')
  const [duration, setDuration] = useState<Duration>('1sa')

  const reset = () => {
    setTitle('')
    setDescription('')
    setPriority('NORMAL')
    setCategory('work')
    setDate('')
    setDuration('1sa')
  }

  const handleAdd = () => {
    if (!title.trim()) return
    const durationMap: Record<Duration, number> = { '30dk': 30, '1sa': 60, '2sa': 120, '3+sa': 180 }
    onAddTask({ title: title.trim(), description, priority, tag: category, date: date ? new Date(date) : new Date(), estimatedMinutes: durationMap[duration] } as TaskModel)
    reset()
    onOpenChange(false)
  }

  const handleDraft = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset() }}>
      <DialogContent className="sm:max-w-lg bg-zinc-900 border-zinc-700 text-white p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
            Detaylı Görev Ekle
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pt-5 pb-4 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm text-zinc-300 font-medium">
              Başlık <span className="text-red-400">*</span>
            </label>
            <Input
              autoFocus
              placeholder="Görevi açıkça tanımla..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm text-zinc-300 font-medium">Açıklama / not</label>
            <Textarea
              placeholder="Ek notlar, bağlantılar, detaylar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500 resize-none"
            />
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-300 font-medium">Öncelik</label>
              <div className="space-y-2">
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPriority(opt.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${opt.bg} ${opt.border}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                      <span className={`text-sm ${opt.text}`}>{opt.label}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      priority === opt.value ? `${opt.border} border-opacity-100` : 'border-zinc-600'
                    }`}>
                      {priority === opt.value && (
                        <div className={`w-2 h-2 rounded-full ${opt.dot}`} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-300 font-medium">Kategori</label>
              <div className="space-y-2">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCategory(opt.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                      category === opt.value
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                        : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {opt.icon}
                      <span className="text-sm">{opt.label}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      category === opt.value ? 'border-blue-400' : 'border-zinc-600'
                    }`}>
                      {category === opt.value && (
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Tarih</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-800/60 border border-zinc-700 text-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 scheme-dark"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Tahmini süre</label>
              <div className="flex gap-1.5">
                {durationOptions.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2 rounded-md text-xs font-medium border transition-all ${
                      duration === d
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => { onOpenChange(false); reset() }}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            İptal
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDraft}
              className="border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Taslak kaydet
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40"
            >
              Görevi ekle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
