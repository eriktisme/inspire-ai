'use client'

import {
  ManageFrequency,
  ManageGoalsAndDirection,
  PreviewMessage,
} from '../components'
import { useQueries } from '@tanstack/react-query'
import { getPreferencesOptions, getPreviewOptions } from '../api'
import { queryConfig } from '@/lib/react-query'

const defaultGoals = ['Run a marathon', 'Build a startup']
const defaultThemes = ['Fitness & Health', 'Career Growth']

export const DashboardPageTemplate = () => {
  const [preferencesQuery, previewQuery] = useQueries({
    queries: [
      {
        ...getPreferencesOptions,
        ...queryConfig,
      },
      {
        ...getPreviewOptions,
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
      <h1 className="mb-6 text-2xl font-medium">Daily Motivation</h1>
      {preferencesQuery.isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ManageGoalsAndDirection
            preference={
              preferencesQuery.data
                ? {
                    goals:
                      preferencesQuery.data.goals.length > 0
                        ? preferencesQuery.data.goals
                        : defaultGoals,
                    themes:
                      preferencesQuery.data.themes.length > 0
                        ? preferencesQuery.data.themes
                        : defaultThemes,
                  }
                : {
                    goals: defaultGoals,
                    themes: defaultThemes,
                  }
            }
          />
          {previewQuery.isLoading ? null : (
            <PreviewMessage
              preview={{
                message: previewQuery.data?.message ?? 'No preview available.',
              }}
            />
          )}
          <ManageFrequency
            preference={{
              frequency: preferencesQuery.data?.frequency ?? 'daily',
            }}
          />
        </>
      )}
    </div>
  )
}
