import type { ReactNode } from 'react'
import {
  SidebarInset,
  SidebarProvider,
} from '@internal/design-system/components/ui/sidebar'
import { HotKeys } from '@/features/hot-keys'
import { AppHeader } from '@/features/app-header'

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <>
      <SidebarProvider>
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <HotKeys />
    </>
  )
}
