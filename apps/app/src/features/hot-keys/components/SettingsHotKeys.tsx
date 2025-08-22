'use client'

import { useHotkeys } from 'react-hotkeys-hook'
import { useRouter } from 'next/navigation'

export const SettingsHotKeys = () => {
  const router = useRouter()

  useHotkeys('cmd+esc', (evt) => {
    evt.preventDefault()

    router.push('/')
  })

  return null
}
