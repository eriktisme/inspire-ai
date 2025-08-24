import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'

export const ProfileSchema = z.object({
  phoneNumber: z.string().nullable(),
})

export type Profile = z.infer<typeof ProfileSchema>

export const getProfileOptions = queryOptions<Profile>({
  queryKey: ['profile'],
  queryFn: () => fetch('/api/common/profile').then((res) => res.json()),
})
