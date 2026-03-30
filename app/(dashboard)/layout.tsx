import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getAllTasks } from '@/app/actions/tasks'
import { getStreak } from '@/app/actions/streak'
import { StoreInitializer } from '@/components/store-initializer'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const tasks = await getAllTasks()
  const streak = await getStreak()

  return (
    <SidebarProvider>
      <StoreInitializer tasks={tasks} streak={streak} />
      <div className="bg-background dark:from-background dark:to-card flex min-h-screen w-full dark:bg-linear-to-br">
        <AppSidebar user={user} />
        <div className="flex flex-1 flex-col">
          <header className="border-border bg-background/80 dark:bg-card/40 dark:border-sidebar-border sticky top-0 z-10 border-b backdrop-blur-sm">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger className="lg:hidden" />
              <DashboardHeader />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
