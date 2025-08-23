import { UserNav } from './UserNav'

export const AppHeader = () => {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div></div>
        <div className="flex shrink-0 items-center gap-px">
          <UserNav />
        </div>
      </div>
    </header>
  )
}
