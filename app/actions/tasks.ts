'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { Priority } from '@/lib/generated/prisma/enums'
import { TaskModel } from '@/lib/generated/prisma/models'
import { updateStreak } from './streak'

export async function createQuickTask(title: string, priority: 'high' | 'normal' | 'low') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const priorityMap: Record<'high' | 'normal' | 'low', Priority> = {
    high: Priority.HIGH,
    normal: Priority.NORMAL,
    low: Priority.LOW,
  }

  const task = await prisma.task.create({
    data: {
      userId: user.id,
      title,
      description: '',
      priority: priorityMap[priority],
    },
  })

  return task
}


export async function updateQuickTask(id:string,task:TaskModel) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      ...task
    },
  })

  // Görev done yapıldıysa streak güncelle
  if (task.status === 'done') {
    await updateStreak()
  }

  return updatedTask
}

export async function getAllTasks(){
    const supabase = await createClient();
    const {data:{user}} = await supabase.auth.getUser();

    if(!user) throw new Error("Unauthorized");

    const allTasks = await prisma.task.findMany({
        where:{userId:user.id}
    })

    return allTasks
}

export async function deleteTask(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    await prisma.task.delete({
        where: { id, userId: user.id }
    })
}

export async function createTask(task:TaskModel){
    const supabase = await createClient();
    const {data:{user}} = await supabase.auth.getUser();

    if(!user) throw new Error("Unauthorized");

    const newTask = await prisma.task.create({
        data: {
            ...task,
            userId: user.id
        }
    })

    return newTask
}