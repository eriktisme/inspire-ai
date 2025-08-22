'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@internal/design-system/components/ui/sidebar'
import type { ComponentProps } from 'react'
import { ChevronLeftIcon, Settings2Icon, UserCog2Icon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@internal/design-system/components/ui/tooltip'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const accountRoutes = [
  {
    key: 'profile',
    label: 'Profile',
    icon: <UserCog2Icon />,
  },
  {
    key: 'preferences',
    label: 'Preferences',
    icon: <Settings2Icon />,
  },
]

interface Props extends ComponentProps<typeof Sidebar> {
  //
}

export const SettingsSidebar = (props: Props) => {
  const pathname = usePathname()

  return (
    <Sidebar {...props} className="w-60">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/">
                  <SidebarMenuButton>
                    <ChevronLeftIcon />
                    <span>Back to app</span>
                  </SidebarMenuButton>
                </Link>
              </TooltipTrigger>
              <TooltipContent align="start">
                <div className="space-x-3">
                  <span>Back to app</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountRoutes.map((route) => {
                const currentPath = `/settings/account/${route.key}`

                return (
                  <SidebarMenuItem key={`route-${route.key}`}>
                    <Link href={currentPath}>
                      <SidebarMenuButton isActive={currentPath === pathname}>
                        {route.icon}
                        <span>{route.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
