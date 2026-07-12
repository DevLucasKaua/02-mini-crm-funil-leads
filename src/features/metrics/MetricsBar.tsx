import { Badge, Button, StatTile } from '../../components/ui'
import { formatBRL } from '../../lib/format'
import { SOURCE_LABELS } from '../../lib/types'
import { useMetricsQuery } from './useMetricsQuery'

const integerFormatter = new Intl.NumberFormat('pt-BR')

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const daysFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

function formatDaysToClose(avgDaysToClose: number | null): string {
  if (avgDaysToClose === null) return '—'
  return `${daysFormatter.format(avgDaysToClose)} dias`
}

export function MetricsBar() {
  const { data, isLoading, isError, refetch, isFetching } = useMetricsQuery()

  if (isError) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-6">
        <p className="text-sm text-slate-500">Não foi possível carregar as métricas</p>
        <Button variant="ghost" onClick={() => refetch()} disabled={isFetching}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-4 md:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile
            label="Total de leads"
            value={data ? integerFormatter.format(data.totalLeads) : ''}
            loading={isLoading}
          />
          <StatTile
            label="Conversão do funil"
            value={data ? percentFormatter.format(data.conversionRate) : ''}
            hint="novo → fechado"
            loading={isLoading}
          />
          <StatTile
            label="Em negociação"
            value={data ? formatBRL(data.valueInNegotiation) : ''}
            hint="qualificado + reunião"
            loading={isLoading}
          />
          <StatTile
            label="Tempo médio até fechar"
            value={data ? formatDaysToClose(data.avgDaysToClose) : ''}
            loading={isLoading}
          />
        </div>
        {data && (
          <div className="hidden shrink-0 flex-col justify-center gap-1.5 lg:flex">
            <p className="text-xs font-medium text-slate-400">Leads por origem</p>
            <div className="flex flex-wrap gap-1.5">
              {data.leadsBySource.map((entry) => (
                <Badge key={entry.source} color="slate">
                  {SOURCE_LABELS[entry.source]}: {integerFormatter.format(entry.count)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
