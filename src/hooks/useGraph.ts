import { useQuery } from '@tanstack/react-query'
import { fetchGraph } from '@/mocks/data'

export function useGraph(appId: string) {
  return useQuery({
    queryKey: ['graph', appId],
    queryFn: () => fetchGraph(appId),
    staleTime: 1000 * 60 * 2,
    enabled: !!appId,
  })
}
