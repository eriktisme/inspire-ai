'use client'

import { useHotkeys } from 'react-hotkeys-hook'
import { useClerk } from '@clerk/nextjs'
import { env } from '@/env'
import { useRouter } from 'next/navigation'

export const HotKeys = () => {
  const { signOut } = useClerk()

  const router = useRouter()

  useHotkeys('ctrl+q', (evt) => {
    evt.preventDefault()

    void signOut({
      redirectUrl: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    })
  })

  useHotkeys('g+s', (evt) => {
    evt.preventDefault()

    router.push('/settings/account/preferences')
  })

  return null
}
