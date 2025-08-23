'use client'

import { ManageGoalsAndDirection } from '../components'
import { useQueries } from '@tanstack/react-query'
import { getPreferencesOptions } from '@/features/dashboard'
import { queryConfig } from '@/lib/react-query'

export const DashboardPageTemplate = () => {
  const [preferencesQuery] = useQueries({
    queries: [
      {
        ...getPreferencesOptions,
        ...queryConfig,
      },
    ],
  })

  return (
    <div
      className="relative mx-auto flex w-full max-w-3xl flex-col space-y-12 overflow-hidden p-6 md:p-10"
      style={{
        overscrollBehavior: 'contain',
        scrollbarGutter: 'stable',
      }}
    >
      <h1 className="mb-6 text-2xl font-medium">Goals & Direction</h1>
      {preferencesQuery.isLoading ? (
        <div>Loading...</div>
      ) : (
        <ManageGoalsAndDirection
          preference={
            preferencesQuery.data
              ? {
                  ...preferencesQuery.data,
                }
              : {
                  goals: [],
                  themes: [],
                }
          }
        />
      )}
    </div>
  )
}
