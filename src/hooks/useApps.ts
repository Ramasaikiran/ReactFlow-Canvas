import { useQuery } from '@tanstack/react-query'
import type { App } from '@/types'

async function fetchApps(): Promise<App[]> {
  const res = await fetch('/api/apps')
  if (!res.ok) throw new Error('Failed to fetch apps')
  return res.json() as Promise<App[]>
}

export function useApps() {
  return useQuery({
    queryKey: ['apps'],
    queryFn: fetchApps,
    staleTime: 1000 * 60 * 5,
  })
}
