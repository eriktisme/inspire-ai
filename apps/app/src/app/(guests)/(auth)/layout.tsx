'use client'

import type { PropsWithChildren } from 'react'
import { Suspense } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

const IsLoggedIn = (props: Readonly<PropsWithChildren>) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url')
  const { isLoaded, isSignedIn, sessionId } = useAuth()

  const redirectToRedirectUrl = useCallback(async () => {
    router.push(`${redirectUrl}`)
  }, [redirectUrl, router])

  /**
   * Whenever a user is signed in, redirect to the given redirect url (mobile app)
   * or when there is no redirect url, do nothing.
   */
  useEffect(() => {
    if (!redirectUrl) {
      return
    }

    if (isSignedIn) {
      void redirectToRedirectUrl()
    }
  }, [isSignedIn, redirectToRedirectUrl, redirectUrl, router, sessionId])

  if (!isLoaded) {
    return null
  }

  return <>{props.children}</>
}

export default function Layout(props: Readonly<PropsWithChildren>) {
  return (
    <Suspense>
      <IsLoggedIn>
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-50 p-6 md:p-10">
          {props.children}
        </div>
      </IsLoggedIn>
    </Suspense>
  )
}
