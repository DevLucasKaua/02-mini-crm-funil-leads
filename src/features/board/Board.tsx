import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type Announcements,
  type DragCancelEvent,
  type DragEndEvent,
  type DragStartEvent,
  type ScreenReaderInstructions,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { STAGES, STAGE_LABELS, type Lead, type Stage } from '../../lib/types';
import { useLeadsQuery } from './useLeadsQuery';
import { useMoveLeadMutation } from './useMoveLeadMutation';
import { boardKeyboardCoordinates } from './keyboard-coordinates';
import { Column } from './Column';
import { LeadCard } from './LeadCard';
import { ColumnSkeleton } from './ColumnSkeleton';
import { BoardError } from './BoardError';

interface BoardProps {
  onSelectLead: (lead: Lead) => void;
}

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable:
    'Para mover um lead, pressione Espaço ou Enter, use as setas esquerda e direita para escolher a coluna e pressione Espaço ou Enter novamente para soltar. Pressione Esc para cancelar.',
};

export function Board({ onSelectLead }: BoardProps) {
  const { data: leads, isPending, isError, refetch } = useLeadsQuery();
  const moveLead = useMoveLeadMutation();
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: boardKeyboardCoordinates }),
  );

  const leadsByStage = useMemo(() => {
    const groups: Record<Stage, Lead[]> = {
      novo: [],
      qualificado: [],
      reuniao: [],
      fechado: [],
    };
    for (const lead of leads ?? []) {
      groups[lead.stage].push(lead);
    }
    return groups;
  }, [leads]);

  const findLead = (id: UniqueIdentifier | undefined) =>
    id == null ? undefined : (leads ?? []).find((lead) => lead.id === id);

  const stageLabelOf = (id: UniqueIdentifier | undefined) =>
    id != null && STAGES.includes(id as Stage) ? STAGE_LABELS[id as Stage] : undefined;

  const announcements: Announcements = {
    onDragStart({ active }) {
      const lead = findLead(active.id);
      if (!lead) return;
      return `Você começou a mover o lead ${lead.name}, atualmente na etapa ${STAGE_LABELS[lead.stage]}.`;
    },
    onDragOver({ active, over }) {
      const lead = findLead(active.id);
      const stageLabel = stageLabelOf(over?.id);
      if (!lead) return;
      if (stageLabel) {
        return `O lead ${lead.name} está sobre a etapa ${stageLabel}.`;
      }
      return `O lead ${lead.name} não está sobre nenhuma etapa.`;
    },
    onDragEnd({ active, over }) {
      const lead = findLead(active.id);
      const stageLabel = stageLabelOf(over?.id);
      if (!lead) return;
      if (stageLabel) {
        return `O lead ${lead.name} foi movido para a etapa ${stageLabel}.`;
      }
      return `O lead ${lead.name} foi solto fora de uma etapa. Nenhuma mudança foi feita.`;
    },
    onDragCancel({ active }) {
      const lead = findLead(active.id);
      if (!lead) return;
      return `A movimentação do lead ${lead.name} foi cancelada.`;
    },
  };

  function handleDragStart(event: DragStartEvent) {
    setActiveLead(findLead(event.active.id) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;
    const lead = findLead(active.id);
    const toStage = over.id as Stage;
    if (lead && lead.stage !== toStage) {
      moveLead.mutate({ leadId: lead.id, toStage });
    }
  }

  function handleDragCancel(_event: DragCancelEvent) {
    setActiveLead(null);
  }

  if (isPending) {
    return (
      <div className="grid gap-4 py-4 md:grid-cols-4">
        {STAGES.map((stage) => (
          <ColumnSkeleton key={stage} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <BoardError onRetry={() => void refetch()} />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      accessibility={{ announcements, screenReaderInstructions }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto py-4 md:grid md:grid-cols-4 md:overflow-visible">
        {STAGES.map((stage) => (
          <Column
            key={stage}
            stage={stage}
            leads={leadsByStage[stage]}
            onSelectLead={onSelectLead}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? <LeadCard lead={activeLead} onSelectLead={onSelectLead} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
