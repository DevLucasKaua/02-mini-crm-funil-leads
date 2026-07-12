import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Badge, type BadgeColor } from '../../components/ui';
import { formatBRL, formatRelativeTime } from '../../lib/format';
import { AREA_LABELS, SOURCE_LABELS, type Area, type Lead } from '../../lib/types';

const AREA_COLORS: Record<Area, BadgeColor> = {
  trabalhista: 'amber',
  familia: 'rose',
  consumidor: 'sky',
};

interface LeadCardProps {
  lead: Lead;
  onSelectLead: (lead: Lead) => void;
  /** When true the card is rendered inside the DragOverlay (no drag listeners, no fade). */
  overlay?: boolean;
}

export function LeadCard({ lead, onSelectLead, overlay = false }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={style}
      className={[
        'group rounded-lg border border-slate-200 bg-white p-3 shadow-sm',
        'cursor-grab touch-none select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-1',
        overlay ? 'cursor-grabbing shadow-lg ring-2 ring-slate-300' : '',
        !overlay && isDragging ? 'opacity-40' : '',
      ].join(' ')}
      {...(overlay ? {} : listeners)}
      {...(overlay ? {} : attributes)}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-slate-900">{lead.name}</p>
        {!overlay && (
          <button
            type="button"
            aria-label={`Ver detalhes de ${lead.name}`}
            className="shrink-0 rounded px-1.5 py-0.5 text-xs text-slate-500 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 group-hover:opacity-100"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLead(lead);
            }}
          >
            Detalhes
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Badge color={AREA_COLORS[lead.area]}>{AREA_LABELS[lead.area]}</Badge>
        <span className="text-xs text-slate-400">{SOURCE_LABELS[lead.source]}</span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{formatBRL(lead.estimatedValue)}</span>
        <span className="text-slate-400">{formatRelativeTime(lead.createdAt)}</span>
      </div>
    </div>
  );
}
