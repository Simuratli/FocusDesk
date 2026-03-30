'use server'

import { createClient } from "@/utils/supabase/server"
import { prisma } from '@/lib/prisma'

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

const isYesterday = (date: Date, today: Date) => {
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    return isSameDay(date, yesterday)
}

export async function updateStreak() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const today = new Date()
    const existing = await prisma.streak.findUnique({
        where: { userId: user.id }
    })

    // İlk kez — streak kaydı yok
    if (!existing) {
        return prisma.streak.create({
            data: {
                userId: user.id,
                currentStreak: 1,
                longestStreak: 1,
                lastActiveDate: today,
            }
        })
    }

    const last = new Date(existing.lastActiveDate)

    // Bugün zaten sayıldı
    if (isSameDay(last, today)) {
        return existing
    }

    // Dün aktifti → streak devam ediyor
    if (isYesterday(last, today)) {
        const newCurrent = existing.currentStreak + 1
        return prisma.streak.update({
            where: { userId: user.id },
            data: {
                currentStreak: newCurrent,
                longestStreak: Math.max(newCurrent, existing.longestStreak),
                lastActiveDate: today,
            }
        })
    }

    // 2+ gün önce → streak sıfırla
    return prisma.streak.update({
        where: { userId: user.id },
        data: {
            currentStreak: 1,
            lastActiveDate: today,
        }
    })
}

export async function getStreak() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    return prisma.streak.findUnique({
        where: { userId: user.id }
    })
}
