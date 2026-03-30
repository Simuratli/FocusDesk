import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {createTaskSlice, TaskState} from './tasks'
import {type DailyState,createDailySlice} from './daily.store'
import {createStreakSlice, StreakState} from './streak'


export type AppState = TaskState & StreakState & DailyState


export const useStore = create<AppState>()(
    persist(
        (...a) => ({
            ...createTaskSlice(...a),
            ...createStreakSlice(...a),
            ...createDailySlice(...a),
        }),
        {
            name: 'focusdesk',
        }
    )
)