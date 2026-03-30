import {StateCreator} from 'zustand';
import type { TaskModel } from '@/lib/generated/prisma/models/Task';
import { AppState } from '.';

export type TaskState = {
    tasks: TaskModel[];
    addTask: (task: TaskModel) => void;
    updateTask: (updatedTask: TaskModel) => void;
    deleteTask: (taskId: string) => void;
    reorderTasks: (tasks: TaskModel[]) => void;
}


export const createTaskSlice: StateCreator<AppState, [], [],TaskState> = (set) => ({
    tasks: [],
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (updatedTask) => set((state) => ({
        tasks: state.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
        )
    })),
    deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId)
    })),
    reorderTasks: (tasks) => set({ tasks }),
});