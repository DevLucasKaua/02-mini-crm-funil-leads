import { formatRelativeTime } from '../../lib/format';
import { SOURCE_LABELS, STAGE_LABELS, type Lead } from '../../lib/types';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

interface TimelineEvent {
  id: string;
  title: string;
  iso: string;
}

interface LeadTimelineProps {
  lead: Lead;
}

export function LeadTimeline({ lead }: LeadTimelineProps) {
  const events: TimelineEvent[] = [
    {
      id: 'created',
      title: `Lead criado via ${SOURCE_LABELS[lead.source]}`,
      iso: lead.createdAt,
    },
  ];

  if (lead.stage !== 'novo' && lead.stageChangedAt !== lead.createdAt) {
    events.push({
      id: 'stage-changed',
      title: `Movido para ${STAGE_LABELS[lead.stage]}`,
      iso: lead.stageChangedAt,
    });
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-700">Histórico</h3>
      <ol className="space-y-4">
        {events.map((event, index) => (
          <li key={event.id} className="relative flex gap-3 pl-1">
            <div className="flex flex-col items-center">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
              {index < events.length - 1 && (
                <span className="mt-1 w-px flex-1 border-l border-slate-200" aria-hidden="true" />
              )}
            </div>
            <div className="pb-2">
              <p className="text-sm font-medium text-slate-800">{event.title}</p>
              <p className="text-xs text-slate-400">
                {formatRelativeTime(event.iso)} · {dateFormatter.format(new Date(event.iso))}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
