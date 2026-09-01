import type {
  CustomApi,
  EnvName,
  HealerReport,
  HistoryPoint,
  PipelineRunReport,
  RunSummary,
  Topology,
  ValidationResult,
} from '@/types';

export interface ImportResult {
  format: string;
  apis: CustomApi[];
  warnings: string[];
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return (await res.json()) as T;
}

async function send<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error((detail as { error?: string }).error ?? `${url} -> ${res.status}`);
  }
  return (await res.json()) as T;
}

export const api = {
  latest: (env: EnvName) => get<RunSummary>(`/api/results/latest?env=${env}`),
  history: (env: EnvName) => get<HistoryPoint[]>(`/api/history?env=${env}`),
  topology: () => get<Topology>('/api/topology'),
  healer: () => get<HealerReport>('/api/healer'),
  health: () => get<{ ok: boolean; hasData: boolean }>('/api/health'),
  // Manual APIs + pipeline
  listCustomApis: () => get<CustomApi[]>('/api/custom-apis'),
  saveCustomApi: (payload: Partial<CustomApi>) => send<CustomApi>('/api/custom-apis', 'POST', payload),
  deleteCustomApi: (id: string) => send<{ ok: boolean }>(`/api/custom-apis/${id}`, 'DELETE'),
  runPipeline: (id: string) => send<{ accepted: boolean; runId: string }>('/api/pipeline/run', 'POST', { id }),
  validateApi: (payload: Partial<CustomApi>) => send<ValidationResult>('/api/pipeline/validate', 'POST', payload),
  // Structured run reports (Results tab)
  pipelineRuns: () => get<PipelineRunReport[]>('/api/pipeline/runs'),
  // Import + bulk save
  importFile: async (file: File): Promise<ImportResult> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/import/parse', { method: 'POST', body: fd });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      throw new Error((detail as { error?: string }).error ?? `import -> ${res.status}`);
    }
    return (await res.json()) as ImportResult;
  },
  importText: (text: string) => send<ImportResult>('/api/import/parse', 'POST', { text }),
  bulkSave: (apis: CustomApi[]) =>
    send<{ saved: number; apis: CustomApi[] }>('/api/custom-apis/bulk', 'POST', { apis }),
};
