import { StateCreator } from "zustand";
import { AppState } from ".";

export type DailyState = {
    dailyData: {
        date: string;
        completedTasks: number;
    }[];
    weeklyData: {
        week: string;
        completedTasks: number;
    }[];
    setDailyData: (data: DailyState['dailyData']) => void;
    convertToDailyAndWeeklyData: () => void; // ✅ Renamed
}

export const createDailySlice: StateCreator<AppState, [], [], DailyState> = (set, get) => ({
    dailyData: [],
    weeklyData: [],
    setDailyData: (data) => set({ dailyData: data }),
    convertToDailyAndWeeklyData: () => {
        const tasks = get().tasks;
        const dailyData: DailyState['dailyData'] = [];
        const weeklyData: DailyState['weeklyData'] = [];

        tasks.forEach((task) => {
            const taskDate = new Date(task.createdAt);

            // Daily
            const date = taskDate.toLocaleDateString();
            const existingDaily = dailyData.find((entry) => entry.date === date);
            if (existingDaily) {
                existingDaily.completedTasks += 1;
            } else {
                dailyData.push({ date, completedTasks: 1 });
            }

            // Weekly
            const startOfWeek = new Date(taskDate);
            startOfWeek.setDate(taskDate.getDate() - taskDate.getDay()); // Haftanın başı (Pazar)
            const week = startOfWeek.toLocaleDateString();
            const existingWeekly = weeklyData.find((entry) => entry.week === week);
            if (existingWeekly) {
                existingWeekly.completedTasks += 1;
            } else {
                weeklyData.push({ week, completedTasks: 1 });
            }
        });

        set({ dailyData, weeklyData });
    }
});