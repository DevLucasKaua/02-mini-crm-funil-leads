import { Button, SearchInput, Select, type SelectOption } from '../../components/ui';
import { AREAS, AREA_LABELS, SOURCES, SOURCE_LABELS, type Area, type Source } from '../../lib/types';
import { useLeadFilters } from './useLeadFilters';

const AREA_OPTIONS: SelectOption[] = [
  { value: '', label: 'Todas as áreas' },
  ...AREAS.map((area) => ({ value: area, label: AREA_LABELS[area] })),
];

const SOURCE_OPTIONS: SelectOption[] = [
  { value: '', label: 'Todas as origens' },
  ...SOURCES.map((source) => ({ value: source, label: SOURCE_LABELS[source] })),
];

export function BoardFilters() {
  const { q, setQ, area, setArea, source, setSource, hasActiveFilters, clearFilters } =
    useLeadFilters();

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-3 md:px-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full min-w-[200px] sm:w-64">
          <SearchInput
            value={q}
            onChange={(value) => void setQ(value || null)}
            placeholder="Buscar por nome…"
            label="Buscar por nome"
          />
        </div>

        <div className="w-40">
          <Select
            label="Área"
            value={area ?? ''}
            onChange={(value) => void setArea(value === '' ? null : (value as Area))}
            options={AREA_OPTIONS}
          />
        </div>

        <div className="w-40">
          <Select
            label="Origem"
            value={source ?? ''}
            onChange={(value) => void setSource(value === '' ? null : (value as Source))}
            options={SOURCE_OPTIONS}
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="mb-0.5">
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
