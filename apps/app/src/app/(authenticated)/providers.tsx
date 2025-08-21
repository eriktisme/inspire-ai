'use client'

import { type PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryConfig } from '@/lib/react-query'

export const Providers = (props: PropsWithChildren) => {
  return (
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: queryConfig,
        })
      }
    >
      {props.children}
    </QueryClientProvider>
  )
}
