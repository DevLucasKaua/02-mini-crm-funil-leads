import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30_000 },
    // retry: 0 para o rollback do optimistic update ser imediato na demo
    mutations: { retry: 0 },
  },
});
