'use client'

import { usePathname } from 'next/navigation'
import { Zap, CheckSquare, BarChart3, Settings, LogOut, History } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
interface User {
  email?: string
  user_metadata?: {
    full_name?: string
  }
}

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: BarChart3,
  },
  {
    title: 'Tasks',
    url: '/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'History',
    url: '/history',
    icon: History,
  },
]

const settingsItems = [
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
]

export function AppSidebar({ user }: { user?: User }) {
  const { state } = useSidebar()
  const isExpanded = state === 'expanded'
  const { isLoggingOut, handleLogout } = useAuth()
  const pathname = usePathname()

  const userEmail = user?.email || 'Guest'
  const userName = user?.user_metadata?.full_name || userEmail

  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar className="border-sidebar-border bg-sidebar dark:from-sidebar dark:to-sidebar/95 border-r dark:bg-linear-to-b">
      <SidebarHeader className="border-sidebar-border/50 border-b px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="from-primary to-accent flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br">
            <Zap className="text-sidebar-primary-foreground h-5 w-5" />
          </div>
          {isExpanded && (
            <div className="flex flex-col">
              <span className="text-sidebar-foreground text-base font-bold">
                FocusDesk
              </span>
              <span className="text-sidebar-accent-foreground text-xs">
                Productivity
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.url
            return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={`${isActive ? 'bg-sidebar-primary/10 text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}
              >
                <a href={item.url} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        <div className="border-sidebar-border/50 my-4 border-t" />
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border/50 border-t p-4">
        {isExpanded && user && (
          <div className="bg-sidebar-accent/50 mb-3 flex items-center gap-3 rounded-lg p-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/30 text-xs font-semibold">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground truncate text-xs font-medium">
                {userName}
              </p>
              <p className="text-sidebar-accent-foreground truncate text-xs">
                {userEmail}
              </p>
            </div>
          </div>
        )}
        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="ghost"
          size="sm"
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isExpanded && (
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          )}
        </Button>
        <SidebarMenu>
          {settingsItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <a href={item.url}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
