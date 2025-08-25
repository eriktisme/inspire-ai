'use client'

import { GalleryVerticalEnd } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@internal/design-system/components/ui/button'
import { SignedIn, SignedOut, useAuth } from '@clerk/nextjs'
import { env } from '@/env'

export const Header = () => {
  const { signOut } = useAuth()

  return (
    <header className="sticky top-4 z-50 mt-4 flex items-center justify-between px-2 md:px-4">
      <div>
        <Link
          aria-label="Home"
          href="/"
          className="flex shrink-0 items-center gap-2.5"
        >
          <GalleryVerticalEnd className="size-4" />
          <span>Inspire</span>
        </Link>
      </div>
      <nav className="flex items-center gap-2.5">
        <SignedIn>
          <Button
            onClick={() =>
              signOut?.({
                redirectUrl: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
              })
            }
            variant="ghost"
          >
            Sign out
          </Button>
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </SignedIn>
        <SignedOut>
          <Link href="/auth/sign-in">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button>Get Started</Button>
          </Link>
        </SignedOut>
      </nav>
    </header>
  )
}
