import type { MutationConfig } from '@/lib/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

export const UpdateProfileBodySchema = z.object({
  phoneNumber: z.string().min(10).max(15).optional(),
})

export type UpdateProfileBody = z.infer<typeof UpdateProfileBodySchema>

type UseUpdateProfileOptions = {
  mutationConfig?: MutationConfig<
    (body: UpdateProfileBody) => Promise<{ error?: string; success: boolean }>
  >
}

export const useUpdateProfile = ({
  mutationConfig,
}: UseUpdateProfileOptions) => {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] })

      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: async (body: UpdateProfileBody) => {
      const response = await fetch('/api/common/profile', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        return {
          error: 'Failed to update profile',
          success: false,
        }
      }

      return {
        success: true,
      }
    },
  })
}
