import type { PropsWithChildren } from 'react'
import {
  SidebarInset,
  SidebarProvider,
} from '@internal/design-system/components/ui/sidebar'
import { HotKeys, WorkspaceSettingsHotKeys } from '@/features/hot-keys'
import { SettingsSidebar } from '@/features/settings-sidebar'

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <>
      <SidebarProvider>
        <SettingsSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <HotKeys />
      <WorkspaceSettingsHotKeys />
    </>
  )
}
