import { useQuery } from '@tanstack/react-query'
import { fetchApps } from '@/mocks/data'

export function useApps() {
  return useQuery({
    queryKey: ['apps'],
    queryFn: fetchApps,
    staleTime: 1000 * 60 * 5,
  })
}
