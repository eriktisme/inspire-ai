'use client'

import { useUser } from '@clerk/nextjs'
import { ChangePhoneNumber, Name } from '../components'
import { useQueries } from '@tanstack/react-query'
import { queryConfig } from '@/lib/react-query'
import { getProfileOptions } from '../api'

export const AccountProfilePageTemplate = () => {
  const { isLoaded, user } = useUser()

  const [profileQuery] = useQueries({
    queries: [
      {
        ...getProfileOptions,
        ...queryConfig,
      },
    ],
  })

  if (!isLoaded || profileQuery.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div
      className="relative mx-auto flex w-full max-w-2xl flex-col space-y-12 overflow-hidden p-6 md:p-10"
      style={{
        overscrollBehavior: 'contain',
        scrollbarGutter: 'stable',
      }}
    >
      <h1 className="mb-6 text-2xl font-medium">Profile</h1>
      <Name
        defaultValues={{
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
        }}
      />

      <ChangePhoneNumber
        defaultCountry="ES"
        defaultValues={{
          phoneNumber: profileQuery.data?.phoneNumber ?? '',
        }}
      />
    </div>
  )
}
