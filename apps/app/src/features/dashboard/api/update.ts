import type { MutationConfig } from '@/lib/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { revalidateTag } from 'next/cache'

export const UpdatePreferenceBodySchema = z
  .object({
    goals: z.array(z.string()).min(1),
    themes: z.array(z.string()).min(1),
    frequency: z.enum(['daily', 'paused']),
  })
  .partial()

export type UpdatePreferenceBody = z.infer<typeof UpdatePreferenceBodySchema>

type UseUpdatePreferencesOptions = {
  mutationConfig?: MutationConfig<
    (
      body: UpdatePreferenceBody
    ) => Promise<{ error?: string; success: boolean }>
  >
}

export const useUpdatePreferences = ({
  mutationConfig,
}: UseUpdatePreferencesOptions) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: ['preferences'] })

      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: async (body: UpdatePreferenceBody) => {
      const response = await fetch('/api/common/preferences', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        return {
          error: 'Failed to update preferences',
          success: false,
        }
      }

      return {
        success: true,
      }
    },
  })
}
