import { useMemo } from 'react';
import {DailyState} from '../store/daily.store'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getWeekRange = (offset = 0) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() - offset * 7);
  start.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toLocaleDateString();
  });
};

export default function WeeklyComparisonChart({ dailyData }: { dailyData: DailyState['dailyData'] }) {

  const { chartData } = useMemo(() => {
    const thisWeekDays = getWeekRange(0);
    const lastWeekDays = getWeekRange(1);

    const findCount = (dateStr: string) =>
      dailyData.find((d) => d.date === dateStr)?.completedTasks ?? 0;

    const chartData = thisWeekDays.map((dateStr, i) => ({
      day: DAY_LABELS[new Date(dateStr).getDay()],
      'This week': findCount(dateStr),
      'Last week': findCount(lastWeekDays[i]),
    }));

    const thisWeekTotal = chartData.reduce((sum, d) => sum + d['This week'], 0);
    const lastWeekTotal = chartData.reduce((sum, d) => sum + d['Last week'], 0);

    return { chartData, thisWeekTotal, lastWeekTotal };
  }, [dailyData]);

  const maxValue = Math.max(
    ...chartData.flatMap((d) => [d['This week'], d['Last week']])
  );

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="mb-6">
        <h2 className="text-foreground text-lg font-semibold mb-1">This week vs last week</h2>
        <p className="text-muted-foreground text-sm">Daily comparison</p>
      </div>

      <div className="mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" vertical={true} />
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              domain={[0, Math.max(maxValue + 2, 8)]}
              allowDecimals={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
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
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '16px' }} iconType="square" />
            <Bar dataKey="This week" fill="#5b8dd9" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Last week" fill="#c0c0c0" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}