import { useQuery } from '@tanstack/react-query'
import { fetchFunnelMetrics } from '../../lib/api-graphql'
import { queryKeys } from '../../lib/query-keys'

export function useMetricsQuery() {
  return useQuery({
    queryKey: queryKeys.funnelMetrics,
    queryFn: fetchFunnelMetrics,
  })
}
