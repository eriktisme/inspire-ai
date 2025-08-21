import type { ReactNode } from 'react'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@internal/design-system/components/ui/sidebar'
import { AppSidebar } from '@/features/app-sidebar'
import { HotKeys } from '@/features/hot-keys'

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="pointer-events-auto flex flex-1 flex-col place-items-stretch overflow-auto">
            <div className="block px-3 py-2 md:hidden">
              <SidebarTrigger />
            </div>
            <div className="relative flex flex-1 flex-col items-stretch gap-4 overflow-hidden px-4 lg:p-4">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <HotKeys />
    </>
  )
}
