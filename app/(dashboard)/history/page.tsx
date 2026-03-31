"use client"
import { useStore } from '@/store'
import { History, CheckCircle2, Calendar, Clock } from 'lucide-react'

interface HistoryEntry {
  id: number
  title: string
  completedAt: string
  duration: string
  date: string
}


const groupByDate = (entries: HistoryEntry[]) => {
  return entries.reduce<Record<string, HistoryEntry[]>>((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = []
    acc[entry.date].push(entry)
    return acc
  }, {})
}
const formatDuration = (createdAt: Date | string, updatedAt: Date | string) => {
  const diffMs = new Date(updatedAt).getTime() - new Date(createdAt).getTime();
  if (diffMs <= 0) return '—';
  
  const totalMinutes = Math.floor(diffMs / 1000 / 60);
  
  if (totalMinutes < 1) return '< 1m';
  if (totalMinutes < 60) return `${totalMinutes}m`;
  
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export default function HistoryPage() {
  const historyData = useStore((state) => state.tasks)
  const grouped = groupByDate(historyData.filter((t) => t.status === 'done').map((t) => ({
    id: typeof t.id === 'string' ? Number(t.id) : t.id,
    title: t.title,
    completedAt: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: formatDuration(t.createdAt, t.updatedAt), // Calculate actual duration in minutes
    date: new Date(t.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
  })))

  return (
    <div className="min-h-screen px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-600/30">
            <History className="w-5 h-5 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Geçmiş</h1>
        </div>
        <p className="text-muted-foreground text-sm ml-13">
          Tamamlanan görevlerin kaydı
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="p-2.5 bg-green-600/20 rounded-lg border border-green-600/30">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">Toplam tamamlanan</p>
            <p className="text-foreground text-2xl font-bold">{historyData.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="p-2.5 bg-blue-600/20 rounded-lg border border-blue-600/30">
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">Bugün tamamlanan</p>
            <p className="text-foreground text-2xl font-bold">
              {grouped['Bugün']?.length ?? 0}
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="p-2.5 bg-orange-600/20 rounded-lg border border-orange-600/30">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-0.5">Ort. süre</p>
            <p className="text-foreground text-2xl font-bold">1s 15dk</p>
          </div>
        </div>
      </div>

      {/* Grouped History List */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-semibold text-foreground">{date}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {entries.length} görev
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-4"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <p className="text-foreground text-sm flex-1 line-through decoration-muted-foreground/40">
                    {entry.title}
                  </p>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.duration}
                    </span>
                    <span className="text-muted-foreground text-xs">{entry.completedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

