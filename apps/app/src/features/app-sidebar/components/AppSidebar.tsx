'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@internal/design-system/components/ui/sidebar'
import type { ComponentProps } from 'react'
import Link from 'next/link'
import { LayoutDashboardIcon } from 'lucide-react'

interface Props extends ComponentProps<typeof Sidebar> {
  //
}

export const AppSidebar = (props: Props) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>{/* Placeholder */}</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/">
                  <SidebarMenuButton>
                    <LayoutDashboardIcon />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/*  */}</SidebarFooter>
    </Sidebar>
  )
}
