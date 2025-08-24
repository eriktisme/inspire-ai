import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'

export const PreferencesSchema = z.object({
  goals: z.array(z.string()),
  themes: z.array(z.string()),
  frequency: z.enum(['daily', 'paused']),
})

export type Preferences = z.infer<typeof PreferencesSchema>

export const getPreferencesOptions = queryOptions<Preferences>({
  queryKey: ['preferences'],
  queryFn: () => fetch('/api/common/preferences').then((res) => res.json()),
})
