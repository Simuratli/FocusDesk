import { StateCreator } from 'zustand'

export type StreakState = {
    currentStreak: number
    longestStreak: number
    setStreak: (current: number, longest: number) => void
}

export const createStreakSlice: StateCreator<StreakState> = (set) => ({
    currentStreak: 0,
    longestStreak: 0,
    setStreak: (current, longest) => set({ currentStreak: current, longestStreak: longest }),
})
