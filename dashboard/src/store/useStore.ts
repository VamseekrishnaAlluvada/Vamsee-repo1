import { create } from 'zustand';
import type {
  ActivityEvent,
  CustomApi,
  EnvName,
  HealerReport,
  HistoryPoint,
  PhaseStatus,
  PipelinePhaseId,
  PipelinePhaseUpdate,
  PipelineResult,
  PipelineRunReport,
  RunSummary,
  TestStatus,
  Topology,
} from '@/types';

export type PageId = 'mission' | 'execution' | 'runner' | 'results' | 'playbook';

export interface PipelineState {
  runId?: string;
  apiId?: string;
  running: boolean;
  phases: Partial<Record<PipelinePhaseId, { status: PhaseStatus; detail?: string }>>;
  result?: PipelineResult;
}

interface Filters {
  search: string;
  status: TestStatus | 'all';
  tag: string | 'all';
  slowOnly: boolean;
}

interface DashboardState {
  // navigation & chrome
  activePage: PageId;
  sidebarCollapsed: boolean;
  aurora: boolean;
  connected: boolean;
  // data
  env: EnvName;
  runsByEnv: Partial<Record<EnvName, RunSummary>>;
  historyByEnv: Partial<Record<EnvName, HistoryPoint[]>>;
  topology?: Topology;
  healer?: HealerReport;
  activity: ActivityEvent[];
  // manual APIs + pipeline
  customApis: CustomApi[];
  pipeline: PipelineState;
  pipelineRuns: PipelineRunReport[];
  // filters
  filters: Filters;
  // actions
  setPage: (p: PageId) => void;
  toggleSidebar: () => void;
  toggleAurora: () => void;
  setConnected: (c: boolean) => void;
  setEnv: (e: EnvName) => void;
  ingestResults: (env: EnvName, run: RunSummary, history: HistoryPoint[]) => void;
  setTopology: (t: Topology) => void;
  setHealer: (h: HealerReport) => void;
  pushActivity: (e: ActivityEvent) => void;
  clearActivity: () => void;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setCustomApis: (list: CustomApi[]) => void;
  startPipeline: (runId: string, apiId: string) => void;
  applyPhase: (u: PipelinePhaseUpdate) => void;
  applyPipelineResult: (r: PipelineResult) => void;
  setPipelineRuns: (runs: PipelineRunReport[]) => void;
  applyPipelineReport: (report: PipelineRunReport) => void;
}

export const useStore = create<DashboardState>((set) => ({
  activePage: 'mission',
  sidebarCollapsed: false,
  aurora: true,
  connected: false,
  env: 'staging',
  runsByEnv: {},
  historyByEnv: {},
  activity: [],
  customApis: [],
  pipeline: { running: false, phases: {} },
  pipelineRuns: [],
  filters: { search: '', status: 'all', tag: 'all', slowOnly: false },

  setPage: (p) => set({ activePage: p }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleAurora: () => set((s) => ({ aurora: !s.aurora })),
  setConnected: (c) => set({ connected: c }),
  setEnv: (e) => set({ env: e }),
  ingestResults: (env, run, history) =>
    set((s) => ({
      runsByEnv: { ...s.runsByEnv, [env]: run },
      historyByEnv: { ...s.historyByEnv, [env]: history },
    })),
  setTopology: (t) => set({ topology: t }),
  setHealer: (h) => set({ healer: h }),
  pushActivity: (e) => set((s) => ({ activity: [e, ...s.activity].slice(0, 120) })),
  clearActivity: () => set({ activity: [] }),
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  setCustomApis: (list) => set({ customApis: list }),
  startPipeline: (runId, apiId) =>
    set({ pipeline: { runId, apiId, running: true, phases: {}, result: undefined } }),
  applyPhase: (u) =>
    set((s) => {
      // A new runId resets the phase board.
      const base =
        s.pipeline.runId === u.runId
          ? s.pipeline
          : { runId: u.runId, apiId: u.apiId, running: true, phases: {}, result: undefined };
      return {
        pipeline: {
          ...base,
          running: true,
          phases: { ...base.phases, [u.phase]: { status: u.status, detail: u.detail } },
        },
      };
    }),
  applyPipelineResult: (r) =>
    set((s) => ({
      pipeline:
        s.pipeline.runId === r.runId
          ? { ...s.pipeline, running: false, result: r }
          : { runId: r.runId, apiId: r.apiId, running: false, phases: s.pipeline.phases, result: r },
    })),
  setPipelineRuns: (runs) => set({ pipelineRuns: runs }),
  applyPipelineReport: (report) =>
    set((s) => ({
      pipelineRuns: [report, ...s.pipelineRuns.filter((r) => r.runId !== report.runId)].slice(0, 100),
    })),
}));

// Selector helpers. NOTE: selectors must return a STABLE reference when empty,
// otherwise useSyncExternalStore sees a new snapshot every render (infinite loop).
const EMPTY_HISTORY: HistoryPoint[] = [];
export const useActiveRun = (): RunSummary | undefined =>
  useStore((s) => s.runsByEnv[s.env]);
export const useActiveHistory = (): HistoryPoint[] =>
  useStore((s) => s.historyByEnv[s.env] ?? EMPTY_HISTORY);
