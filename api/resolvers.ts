export type LeadArea = 'trabalhista' | 'familia' | 'consumidor';
export type LeadSource = 'landing-page' | 'instagram' | 'google-ads';
export type LeadStage = 'novo' | 'qualificado' | 'reuniao' | 'fechado';

export interface Lead {
  id: string;
  name: string;
  area: LeadArea;
  source: LeadSource;
  stage: LeadStage;
  estimatedValue: number;
  phone: string;
  createdAt: string;
  stageChangedAt: string;
  notes?: string;
}

const STAGE_ORDER: LeadStage[] = ['novo', 'qualificado', 'reuniao', 'fechado'];
const SOURCE_ORDER: LeadSource[] = ['landing-page', 'instagram', 'google-ads'];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function createResolvers(getLeads: () => Lead[]) {
  return {
    Query: {
      funnelMetrics: () => {
        const leads = getLeads();
        const totalLeads = leads.length;

        const stageCounts = STAGE_ORDER.map((stage) => ({
          stage,
          count: leads.filter((lead) => lead.stage === stage).length,
        }));

        const fechadoCount = stageCounts.find((s) => s.stage === 'fechado')?.count ?? 0;
        const conversionRate = totalLeads === 0 ? 0 : fechadoCount / totalLeads;

        const valueInNegotiation = leads
          .filter((lead) => lead.stage === 'qualificado' || lead.stage === 'reuniao')
          .reduce((sum, lead) => sum + lead.estimatedValue, 0);

        const leadsBySource = SOURCE_ORDER.map((source) => ({
          source,
          count: leads.filter((lead) => lead.source === source).length,
        }));

        const closedLeads = leads.filter((lead) => lead.stage === 'fechado');
        const avgDaysToClose =
          closedLeads.length === 0
            ? null
            : closedLeads.reduce((sum, lead) => {
                const created = new Date(lead.createdAt).getTime();
                const changed = new Date(lead.stageChangedAt).getTime();
                return sum + (changed - created) / MS_PER_DAY;
              }, 0) / closedLeads.length;

        return {
          totalLeads,
          stageCounts,
          conversionRate,
          valueInNegotiation,
          leadsBySource,
          avgDaysToClose,
        };
      },
      lead: (_parent: unknown, args: { id: string }) => {
        const leads = getLeads();
        return leads.find((lead) => lead.id === args.id) ?? null;
      },
    },
  };
}
