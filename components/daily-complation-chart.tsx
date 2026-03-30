'use client';

import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { DailyState } from '../store/daily.store';

type TimeRange = '7d' | '14d' | '30d';

export function DailyCompletionChart({ dailyData }: { dailyData: DailyState['dailyData'] }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

 const filteredData = useMemo(() => {
  const now = new Date();

  const getDaysAgo = (days: number) => {
    const d = new Date(now);
    d.setDate(now.getDate() - days);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const rangeMap: Record<TimeRange, Date> = {
    '7d': getDaysAgo(7),
    '14d': getDaysAgo(14),
    '30d': getDaysAgo(30),
  };

  const since = rangeMap[timeRange];

  return [...dailyData]
    .filter((d) => new Date(d.date) >= since) // ✅ Takvim bazlı filtre
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
      completedTasks: d.completedTasks,
    }));
}, [dailyData, timeRange]);

  const maxValue = Math.max(...filteredData.map((d) => d.completedTasks), 0);

  return (
    <div className="w-full bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-foreground text-lg font-semibold mb-1">Daily completion</h3>
          <p className="text-muted-foreground text-sm">Number of completed tasks</p>
        </div>

        {/* Time Range Buttons */}
        <div className="flex gap-2">
          {(['7d', '14d', '30d'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              onClick={() => setTimeRange(range)}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              className={
                timeRange === range
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }
            >
              {range === '7d' ? '7 days' : range === '14d' ? '14 days' : '30 days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filteredData.length === 0 ? (
        <div className="h-75 flex items-center justify-center text-muted-foreground text-sm">
          No data for the selected period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              domain={[0, Math.max(maxValue + 2, 8)]} // ✅ Dinamik domain
              allowDecimals={false}
              style={{ fontSize: '12px' }}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              width={20}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: '8px',
                color: '#09090b',
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              labelStyle={{ color: '#09090b', fontWeight: 600 }}
              itemStyle={{ color: '#3b82f6' }}
              cursor={{ stroke: '#e4e4e7' }}
            />
            <Line
              type="monotone"
              dataKey="completedTasks"
              name="Completed tasks"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}