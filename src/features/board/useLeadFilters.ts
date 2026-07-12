import { useCallback } from 'react';
import { parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { AREAS, SOURCES, type Area, type Lead, type Source } from '../../lib/types';

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

export function useLeadFilters() {
  const [q, setQ] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ throttleMs: 300 }),
  );
  const [area, setArea] = useQueryState('area', parseAsStringLiteral(AREAS));
  const [source, setSource] = useQueryState('origem', parseAsStringLiteral(SOURCES));

  const hasActiveFilters = q.trim() !== '' || area !== null || source !== null;

  const clearFilters = useCallback(() => {
    void setQ(null);
    void setArea(null);
    void setSource(null);
  }, [setQ, setArea, setSource]);

  const applyFilters = useCallback(
    (leads: Lead[]): Lead[] => {
      const normalizedQuery = normalize(q);
      return leads.filter((lead) => {
        if (normalizedQuery && !normalize(lead.name).includes(normalizedQuery)) {
          return false;
        }
        if (area && lead.area !== area) {
          return false;
        }
        if (source && lead.source !== source) {
          return false;
        }
        return true;
      });
    },
    [q, area, source],
  );

  return {
    q,
    setQ,
    area: area as Area | null,
    setArea,
    source: source as Source | null,
    setSource,
    hasActiveFilters,
    clearFilters,
    applyFilters,
  };
}
