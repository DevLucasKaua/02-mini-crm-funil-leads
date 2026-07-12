export const AREAS = ['trabalhista', 'familia', 'consumidor'] as const;
export type Area = (typeof AREAS)[number];

export const SOURCES = ['landing-page', 'instagram', 'google-ads'] as const;
export type Source = (typeof SOURCES)[number];

export const STAGES = ['novo', 'qualificado', 'reuniao', 'fechado'] as const;
export type Stage = (typeof STAGES)[number];

export interface Lead {
  id: string;
  name: string;
  area: Area;
  source: Source;
  stage: Stage;
  estimatedValue: number;
  phone: string;
  createdAt: string;
  stageChangedAt: string;
  notes?: string;
}

export const AREA_LABELS: Record<Area, string> = {
  trabalhista: 'Trabalhista',
  familia: 'Família',
  consumidor: 'Consumidor',
};

export const SOURCE_LABELS: Record<Source, string> = {
  'landing-page': 'Landing Page',
  instagram: 'Instagram',
  'google-ads': 'Google Ads',
};

export const STAGE_LABELS: Record<Stage, string> = {
  novo: 'Novo',
  qualificado: 'Qualificado',
  reuniao: 'Reunião',
  fechado: 'Fechado',
};
