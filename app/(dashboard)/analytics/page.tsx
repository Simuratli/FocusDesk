'use client'
import { DailyCompletionChart } from '@/components/daily-complation-chart'
import WeeklyComparisonChart from '@/components/weekly-comparison-chart'
import { useStore } from '@/store'
import { BarChart2, TrendingUp, Calendar } from 'lucide-react'
import { useEffect } from 'react'

const page = () => {
  const dailyData = useStore((state) => state.dailyData)
  const weeklyData = useStore((state) => state.weeklyData)
  const convertToDailyAndWeeklyData = useStore(
    (state) => state.convertToDailyAndWeeklyData
  )
  const tasks = useStore((state) => state.tasks)

  useEffect(() => {
    convertToDailyAndWeeklyData()
  }, [])

  // Bu haftanın başlangıcı
  const getWeekStart = (offset = 0) => {
    const d = new Date()
    d.setDate(d.getDate() - d.getDay() - offset * 7)
    d.setHours(0, 0, 0, 0)
    return d.toLocaleDateString()
  }

  const thisWeekKey = getWeekStart(0)
  const lastWeekKey = getWeekStart(1)

  const thisWeekTotal =
    weeklyData.find((w) => w.week === thisWeekKey)?.completedTasks ?? 0
  const lastWeekTotal =
    weeklyData.find((w) => w.week === lastWeekKey)?.completedTasks ?? 0

  const weeklyIncrease =
    lastWeekTotal === 0
      ? null
      : Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100)

  console.log(dailyData, 'dailyData', weeklyData)
  return (
    <div className="min-h-screen px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg border border-blue-600/30 bg-blue-600/20 p-2">
            <BarChart2 className="h-5 w-5 text-blue-500" />
          </div>
          <h1 className="text-foreground text-2xl font-bold">Analytics</h1>
        </div>
        <p className="text-muted-foreground ml-13 text-sm">
          Track task completion statistics and weekly performance
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-card border-border flex items-center gap-4 rounded-xl border p-5">
          <div className="rounded-lg border border-blue-600/30 bg-blue-600/20 p-2.5">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5 text-xs">
              Total this week
            </p>
            <p className="text-foreground text-2xl font-bold">{thisWeekTotal}</p>
          </div>
        </div>
        <div className="bg-card border-border flex items-center gap-4 rounded-xl border p-5">
          <div className="bg-muted border-border rounded-lg border p-2.5">
            <Calendar className="text-muted-foreground h-5 w-5" />
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5 text-xs">
              Total last week
            </p>
            <p className="text-foreground text-2xl font-bold">{lastWeekTotal}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-800/50 dark:bg-green-950">
          <div className="rounded-lg border border-green-600/30 bg-green-600/20 p-2.5">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="mb-0.5 text-xs text-green-600 dark:text-green-400">
              Weekly Increase
            </p>
             <p className={`text-2xl font-bold ${
              weeklyIncrease === null
                ? 'text-foreground'
                : weeklyIncrease >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
            }`}>
              {weeklyIncrease !== null ? `${weeklyIncrease > 0 ? '+' : ''}${weeklyIncrease}%` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="bg-card border-border overflow-hidden rounded-xl border">
          <DailyCompletionChart dailyData={dailyData} />
        </div>
        <div className="bg-card border-border overflow-hidden rounded-xl border">
          <WeeklyComparisonChart dailyData={dailyData} />
        </div>
      </div>
    </div>
  )
}

export default page
