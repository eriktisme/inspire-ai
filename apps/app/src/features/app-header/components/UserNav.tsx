'use client'

import { LogOutIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@internal/design-system/components/ui/dropdown-menu'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@internal/design-system/components/ui/avatar'
import { useAuth, useUser } from '@clerk/nextjs'
import { env } from '@/env'
import Link from 'next/link'

export const UserNav = () => {
  const { user } = useUser()

  const { signOut } = useAuth()

  const displayName =
    user?.fullName ?? user?.emailAddresses?.at(0)?.emailAddress

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-7 rounded-full hover:cursor-pointer">
          <AvatarImage src={user?.imageUrl} alt={`Avatar ${user?.username}`} />
          <AvatarFallback>{displayName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuGroup>
          <Link href="/settings/account">
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            signOut?.({
              redirectUrl: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
            })
          }
        >
          <LogOutIcon />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
