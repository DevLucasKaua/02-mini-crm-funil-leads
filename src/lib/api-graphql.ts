import { GraphQLClient, gql } from 'graphql-request';
import type { Source, Stage } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export const graphqlClient = new GraphQLClient(`${API_URL}/graphql`);

export interface StageCount {
  stage: Stage;
  count: number;
}

export interface SourceCount {
  source: Source;
  count: number;
}

export interface FunnelMetrics {
  totalLeads: number;
  stageCounts: StageCount[];
  conversionRate: number;
  valueInNegotiation: number;
  leadsBySource: SourceCount[];
  avgDaysToClose: number | null;
}

interface FunnelMetricsResponse {
  funnelMetrics: FunnelMetrics;
}

const FUNNEL_METRICS_QUERY = gql`
  {
    funnelMetrics {
      totalLeads
      stageCounts {
        stage
        count
      }
      conversionRate
      valueInNegotiation
      leadsBySource {
        source
        count
      }
      avgDaysToClose
    }
  }
`;

export async function fetchFunnelMetrics(): Promise<FunnelMetrics> {
  const data = await graphqlClient.request<FunnelMetricsResponse>(FUNNEL_METRICS_QUERY);
  return data.funnelMetrics;
}
