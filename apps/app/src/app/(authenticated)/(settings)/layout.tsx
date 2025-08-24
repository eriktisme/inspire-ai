import type { PropsWithChildren } from 'react'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@internal/design-system/components/ui/sidebar'
import { HotKeys, SettingsHotKeys } from '@/features/hot-keys'
import { SettingsSidebar } from '@/features/settings-sidebar'

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <>
      <SidebarProvider>
        <SettingsSidebar />
        <SidebarInset>
          <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
            <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
              <SidebarTrigger className="-ml-2 size-8 md:hidden" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <HotKeys />
      <SettingsHotKeys />
    </>
  )
}
