import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'

export const PreviewSchema = z.object({
  message: z.string(),
})

export type Preview = z.infer<typeof PreviewSchema>

export const getPreviewOptions = queryOptions<Preview>({
  queryKey: ['preview'],
  queryFn: () =>
    fetch('/api/common/preview', {
      next: { revalidate: 3600, tags: ['preview'] },
    }).then((res) => res.json()),
})
