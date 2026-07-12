import { toast } from 'sonner';
import { Badge, Button, Drawer, type BadgeColor } from '../../components/ui';
import { formatBRL, formatRelativeTime, whatsappUrl } from '../../lib/format';
import { AREA_LABELS, SOURCE_LABELS, STAGE_LABELS, type Area, type Lead, type Stage } from '../../lib/types';
import { LeadTimeline } from './LeadTimeline';

interface LeadDrawerProps {
  lead: Lead | null;
  onClose: () => void;
}

const AREA_COLORS: Record<Area, BadgeColor> = {
  trabalhista: 'amber',
  familia: 'rose',
  consumidor: 'sky',
};

const STAGE_COLORS: Record<Stage, BadgeColor> = {
  novo: 'slate',
  qualificado: 'blue',
  reuniao: 'violet',
  fechado: 'emerald',
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

async function copyWhatsappLink(phone: string) {
  try {
    await navigator.clipboard.writeText(whatsappUrl(phone));
    toast.success('Link do WhatsApp copiado');
  } catch {
    toast.error('Não foi possível copiar o link do WhatsApp');
  }
}

export function LeadDrawer({ lead, onClose }: LeadDrawerProps) {
  return (
    <Drawer open={!!lead} onClose={onClose} title={lead?.name ?? 'Detalhes do lead'}>
      {lead && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color={AREA_COLORS[lead.area]}>{AREA_LABELS[lead.area]}</Badge>
            <Badge color={STAGE_COLORS[lead.stage]}>{STAGE_LABELS[lead.stage]}</Badge>
            <Badge color="gray">{SOURCE_LABELS[lead.source]}</Badge>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Valor estimado</dt>
              <dd className="font-medium text-slate-900">{formatBRL(lead.estimatedValue)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Telefone</dt>
              <dd className="font-medium text-slate-900">{lead.phone}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Origem</dt>
              <dd className="font-medium text-slate-900">{SOURCE_LABELS[lead.source]}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Criado</dt>
              <dd className="text-right font-medium text-slate-900">
                {formatRelativeTime(lead.createdAt)}
                <span className="block text-xs font-normal text-slate-400">
                  {dateFormatter.format(new Date(lead.createdAt))}
                </span>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Última mudança de etapa</dt>
              <dd className="text-right font-medium text-slate-900">
                {formatRelativeTime(lead.stageChangedAt)}
                <span className="block text-xs font-normal text-slate-400">
                  {dateFormatter.format(new Date(lead.stageChangedAt))}
                </span>
              </dd>
            </div>
          </dl>

          {lead.notes && (
            <div className="rounded-lg bg-slate-50 p-3">
              <h3 className="mb-1 text-sm font-semibold text-slate-700">Observações</h3>
              <p className="text-sm text-slate-600">{lead.notes}</p>
            </div>
          )}

          <LeadTimeline lead={lead} />

          <Button
            variant="primary"
            className="w-full"
            onClick={() => void copyWhatsappLink(lead.phone)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38a9.94 9.94 0 0 0 4.79 1.22h.01c5.52 0 10-4.48 10-10s-4.48-10-10.01-10Zm5.85 14.24c-.25.7-1.24 1.28-2.03 1.45-.54.11-1.24.2-3.6-.77-3.02-1.25-4.96-4.31-5.11-4.51-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.05-2.49.25-.27.68-.39 1.09-.39.13 0 .25.01.36.01.32.01.48.03.69.53.25.62.86 2.15.93 2.31.08.16.13.34.03.54-.1.2-.15.32-.29.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12.99 2.05 1.31 2.35 1.45.23.11.5.09.68-.09.23-.24.51-.63.8-1.02.2-.27.46-.31.75-.2.29.11 1.83.86 2.14 1.02.31.15.51.23.59.36.08.13.08.75-.17 1.45Z" />
            </svg>
            Copiar WhatsApp
          </Button>
        </div>
      )}
    </Drawer>
  );
}
