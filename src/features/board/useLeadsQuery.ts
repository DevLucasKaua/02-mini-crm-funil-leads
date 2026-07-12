import { useQuery } from '@tanstack/react-query';
import { fetchLeads } from '../../lib/api-rest';
import { queryKeys } from '../../lib/query-keys';

export function useLeadsQuery() {
  return useQuery({
    queryKey: queryKeys.leads,
    queryFn: fetchLeads,
  });
}
