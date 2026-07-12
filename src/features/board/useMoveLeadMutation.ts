import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { patchLead } from '../../lib/api-rest';
import { queryKeys } from '../../lib/query-keys';
import { STAGE_LABELS, type Lead, type Stage } from '../../lib/types';

type MoveLeadVariables = { leadId: string; toStage: Stage };
type MoveLeadContext = { previousLeads: Lead[] | undefined };

export function useMoveLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation<Lead, Error, MoveLeadVariables, MoveLeadContext>({
    mutationFn: ({ leadId, toStage }) =>
      patchLead(leadId, { stage: toStage, stageChangedAt: new Date().toISOString() }),

    onMutate: async ({ leadId, toStage }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.leads });

      const previousLeads = queryClient.getQueryData<Lead[]>(queryKeys.leads);

      queryClient.setQueryData<Lead[]>(queryKeys.leads, (current) =>
        current?.map((lead) =>
          lead.id === leadId
            ? { ...lead, stage: toStage, stageChangedAt: new Date().toISOString() }
            : lead,
        ),
      );

      return { previousLeads };
    },

    onError: (_error, { toStage }, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(queryKeys.leads, context.previousLeads);
      }
      toast.error('Não foi possível mover o lead', {
        description: `A mudança para "${STAGE_LABELS[toStage]}" foi desfeita. Tente novamente.`,
      });
    },

    onSuccess: (_data, { toStage }) => {
      toast.success(`Lead movido para ${STAGE_LABELS[toStage]}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      queryClient.invalidateQueries({ queryKey: queryKeys.funnelMetrics });
    },
  });
}
