import { useDroppable } from '@dnd-kit/core';
import { STAGE_LABELS, type Lead, type Stage } from '../../lib/types';
import { LeadCard } from './LeadCard';
import { EmptyColumn } from './EmptyColumn';

const STAGE_ACCENTS: Record<Stage, string> = {
  novo: 'bg-slate-400',
  qualificado: 'bg-blue-500',
  reuniao: 'bg-violet-500',
  fechado: 'bg-emerald-500',
};

interface ColumnProps {
  stage: Stage;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export function Column({ stage, leads, onSelectLead }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={[
        'flex snap-center w-[85vw] max-w-80 flex-col gap-3 rounded-xl bg-slate-50 p-3 transition-shadow md:w-auto md:max-w-none',
        isOver ? 'ring-2 ring-slate-400 ring-inset' : '',
      ].join(' ')}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${STAGE_ACCENTS[stage]}`} aria-hidden="true" />
        <h2 className="text-sm font-semibold text-slate-700">{STAGE_LABELS[stage]}</h2>
        <span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
          {leads.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {leads.length === 0 ? (
          <EmptyColumn />
        ) : (
          leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onSelectLead={onSelectLead} />
          ))
        )}
      </div>
    </div>
  );
}
