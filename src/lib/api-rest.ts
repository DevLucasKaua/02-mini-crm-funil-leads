import type { Lead } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch(`${API_URL}/leads`);
  if (!response.ok) {
    throw new ApiError('Falha ao carregar leads', response.status);
  }
  return response.json() as Promise<Lead[]>;
}

export async function patchLead(id: string, patch: Partial<Lead>): Promise<Lead> {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!response.ok) {
    throw new ApiError('Falha ao atualizar o lead', response.status);
  }
  return response.json() as Promise<Lead>;
}
