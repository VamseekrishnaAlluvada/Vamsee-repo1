import { io, Socket } from 'socket.io-client';
import { useStore } from '@/store/useStore';
import type {
  ActivityEvent,
  CustomApi,
  EnvName,
  HealerReport,
  HistoryPoint,
  PipelinePhaseUpdate,
  PipelineResult,
  PipelineRunReport,
  RunSummary,
  Topology,
} from '@/types';

let socket: Socket | undefined;

export function connectSocket(): Socket {
  if (socket) return socket;
  socket = io({ path: '/socket.io', transports: ['websocket', 'polling'] });
  const s = useStore.getState();

  socket.on('connect', () => useStore.getState().setConnected(true));
  socket.on('disconnect', () => useStore.getState().setConnected(false));

  socket.on('results:update', (p: { env: EnvName; run: RunSummary; history: HistoryPoint[] }) => {
    useStore.getState().ingestResults(p.env, p.run, p.history);
  });
  socket.on('topology:update', (t: Topology) => useStore.getState().setTopology(t));
  socket.on('healer:update', (h: HealerReport) => useStore.getState().setHealer(h));
  socket.on('activity', (e: ActivityEvent) => useStore.getState().pushActivity(e));
  socket.on('custom:apis', (list: CustomApi[]) => useStore.getState().setCustomApis(list));
  socket.on('pipeline:phase', (u: PipelinePhaseUpdate) => useStore.getState().applyPhase(u));
  socket.on('pipeline:result', (r: PipelineResult) => useStore.getState().applyPipelineResult(r));
  socket.on('pipeline:report', (rep: PipelineRunReport) => useStore.getState().applyPipelineReport(rep));
  socket.on('pipeline:runs', (runs: PipelineRunReport[]) => useStore.getState().setPipelineRuns(runs));

  // touch s to keep import meaningful in strict builds
  void s;
  return socket;
}
