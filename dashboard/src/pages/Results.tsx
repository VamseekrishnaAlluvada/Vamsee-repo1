import { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { GlowCard } from '@/components/atoms/GlowCard';
import { StatusBadge, MethodBadge } from '@/components/atoms/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn, formatMs, formatTime } from '@/lib/utils';
import {
  Check,
  CheckCircle2,
  Clock,
  Code2,
  FileCode2,
  FlaskConical,
  ListChecks,
  Timer,
  X,
  XCircle,
} from 'lucide-react';
import type {
  GeneratedAssertion,
  GeneratedTestCase,
  PipelineRunReport,
} from '@/types';

// -------------------------------------------------------------------------
// Small structural building blocks
// -------------------------------------------------------------------------
function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Check;
  label: string;
  value: string | number;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-base/40 p-3">
      <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', tone)}>
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-semibold leading-tight text-slate-800">{value}</p>
        <p className="truncate text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function AssertionRow({ a }: { a: GeneratedAssertion }) {
  const ok = a.passed !== false;
  return (
    <li className="flex items-center gap-2 text-xs">
      {a.passed === undefined ? (
        <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-slate-400" />
      ) : ok ? (
        <Check size={14} className="shrink-0 text-ok" />
      ) : (
        <X size={14} className="shrink-0 text-fail" />
      )}
      <span className="font-mono text-slate-700">{a.label}</span>
      <span className="rounded bg-black/5 px-1.5 py-0.5 text-[10px] uppercase text-slate-500">{a.kind}</span>
    </li>
  );
}

function TestCaseCard({ tc }: { tc: GeneratedTestCase }) {
  return (
    <div className="rounded-xl border border-black/10 bg-base/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <MethodBadge method={tc.method} />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{tc.name}</span>
        <StatusBadge status={tc.status} />
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Clock size={12} /> {formatMs(tc.durationMs)}
        </span>
        <span>{tc.endpoint}</span>
        {tc.retryCount > 0 && <span className="text-healed">· {tc.retryCount} retr{tc.retryCount === 1 ? 'y' : 'ies'}</span>}
      </div>
      {tc.assertions.length > 0 && (
        <div className="mt-2">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
            Assertions added ({tc.assertions.length})
          </p>
          <ul className="space-y-1">
            {tc.assertions.map((a, i) => (
              <AssertionRow key={i} a={a} />
            ))}
          </ul>
        </div>
      )}
      {tc.error && (
        <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-fail/5 p-2 text-[11px] text-fail ring-1 ring-fail/20">
          {tc.error}
        </pre>
      )}
    </div>
  );
}

function PhaseTimeline({ report }: { report: PipelineRunReport }) {
  return (
    <div className="flex flex-wrap gap-2">
      {report.phases.map((p) => (
        <div
          key={p.id}
          className={cn(
            'flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs',
            p.status === 'passed'
              ? 'border-ok/30 bg-ok/5 text-ok'
              : p.status === 'failed'
                ? 'border-fail/30 bg-fail/5 text-fail'
                : p.status === 'skipped'
                  ? 'border-black/10 bg-base/40 text-slate-500'
                  : 'border-cyan/30 bg-cyan/5 text-cyan',
          )}
        >
          <span className="font-medium capitalize">{p.id}</span>
          <span className="font-mono opacity-70">{formatMs(p.durationMs)}</span>
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------------------------
// Page
// -------------------------------------------------------------------------
export function Results() {
  const runs = useStore((s) => s.pipelineRuns);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo<PipelineRunReport | undefined>(
    () => runs.find((r) => r.runId === selectedId) ?? runs[0],
    [runs, selectedId],
  );

  // Aggregate roll-up across all runs.
  const agg = useMemo(() => {
    return runs.reduce(
      (a, r) => ({
        testCases: a.testCases + r.counts.testCasesGenerated,
        scripts: a.scripts + r.counts.scriptsGenerated,
        passed: a.passed + r.counts.passed + r.counts.healed,
        failed: a.failed + r.counts.failed,
        assertions: a.assertions + r.counts.assertions,
        totalMs: a.totalMs + r.durationMs,
      }),
      { testCases: 0, scripts: 0, passed: 0, failed: 0, assertions: 0, totalMs: 0 },
    );
  }, [runs]);

  if (runs.length === 0) {
    return (
      <GlowCard glow="none" className="py-16 text-center">
        <FlaskConical size={30} className="mx-auto mb-3 text-slate-400" />
        <h3 className="heading text-sm">No automation results yet</h3>
        <p className="mt-1 text-sm text-slate-500">
          Go to <span className="font-medium text-violet">API Runner</span>, add or import an API and press{' '}
          <span className="font-medium">Run Automation</span>. Results appear here automatically.
        </p>
      </GlowCard>
    );
  }

  const passedCases = selected?.testCases.filter((t) => t.status === 'passed' || t.status === 'healed') ?? [];
  const failedCases = selected?.testCases.filter((t) => t.status === 'failed') ?? [];

  return (
    <div className="space-y-5">
      {/* ---- Aggregate roll-up ---- */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatTile icon={ListChecks} label="Test cases" value={agg.testCases} tone="bg-violet/15 text-violet" />
        <StatTile icon={FileCode2} label="Scripts" value={agg.scripts} tone="bg-cyan/15 text-cyan" />
        <StatTile icon={CheckCircle2} label="Passed" value={agg.passed} tone="bg-ok/15 text-ok" />
        <StatTile icon={XCircle} label="Failed" value={agg.failed} tone="bg-fail/15 text-fail" />
        <StatTile icon={Check} label="Assertions" value={agg.assertions} tone="bg-blue/15 text-blue" />
        <StatTile icon={Timer} label="Total time" value={formatMs(agg.totalMs)} tone="bg-warn/15 text-warn" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* ---- Run list ---- */}
        <GlowCard glow="none" className="h-fit">
          <h3 className="heading mb-3 text-sm">Automation Runs ({runs.length})</h3>
          <div className="space-y-2">
            {runs.map((r) => {
              const active = (selected?.runId ?? '') === r.runId;
              return (
                <button
                  key={r.runId}
                  onClick={() => setSelectedId(r.runId)}
                  className={cn(
                    'w-full rounded-xl border p-3 text-left transition-colors',
                    active ? 'border-violet/40 bg-violet/5' : 'border-black/10 bg-base/40 hover:border-black/20',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MethodBadge method={r.method} />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{r.apiName}</span>
                    <StatusBadge status={r.passed ? (r.healed ? 'healed' : 'passed') : 'failed'} />
                  </div>
                  <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-slate-500">
                    <span>{formatTime(r.ts)}</span>
                    <span>{formatMs(r.durationMs)}</span>
                  </div>
                  <div className="mt-1 flex gap-2 text-[11px] text-slate-500">
                    <span>{r.counts.testCasesGenerated} tc</span>
                    <span className="text-ok">{r.counts.passed + r.counts.healed} pass</span>
                    <span className="text-fail">{r.counts.failed} fail</span>
                  </div>
                </button>
              );
            })}
          </div>
        </GlowCard>

        {/* ---- Selected run detail ---- */}
        {selected && (
          <GlowCard className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <MethodBadge method={selected.method} />
                  <h3 className="heading truncate text-sm">{selected.apiName}</h3>
                  <StatusBadge status={selected.passed ? (selected.healed ? 'healed' : 'passed') : 'failed'} />
                </div>
                <p className="mt-1 truncate font-mono text-xs text-slate-500">
                  {selected.baseUrl.replace(/^https?:\/\//, '')}
                  {selected.endpoint} · {selected.summary}
                </p>
              </div>
              <div className="text-right">
                <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
                  <Timer size={14} /> {formatMs(selected.durationMs)}
                </p>
                <p className="text-[11px] text-slate-500">{formatTime(selected.ts)}</p>
              </div>
            </div>

            {/* Phase timeline (time taken per agent) */}
            <div>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-500">Pipeline phase timing</p>
              <PhaseTimeline report={selected} />
            </div>

            {/* Structured categories */}
            <Tabs defaultValue="testcases" className="w-full">
              <TabsList>
                <TabsTrigger value="testcases">Test Cases ({selected.testCases.length})</TabsTrigger>
                <TabsTrigger value="scripts">Scripts ({selected.scriptsGenerated.length})</TabsTrigger>
                <TabsTrigger value="passed">Passed ({passedCases.length})</TabsTrigger>
                <TabsTrigger value="failed">Failed ({failedCases.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="testcases" className="space-y-2">
                {selected.testCases.map((tc) => (
                  <TestCaseCard key={tc.id} tc={tc} />
                ))}
              </TabsContent>

              <TabsContent value="scripts" className="space-y-2">
                {selected.scriptsGenerated.map((s) => (
                  <div key={s.file} className="flex items-center gap-3 rounded-xl border border-black/10 bg-base/40 p-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan/15 text-cyan">
                      <Code2 size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs text-slate-800">{s.file}</p>
                      <p className="text-[11px] text-slate-500">
                        {s.language} · {s.lines} lines · {(s.bytes / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ))}
                {selected.scriptsGenerated.length === 0 && (
                  <p className="py-6 text-center text-sm text-slate-400">No scripts generated for this run.</p>
                )}
              </TabsContent>

              <TabsContent value="passed" className="space-y-2">
                {passedCases.map((tc) => (
                  <TestCaseCard key={tc.id} tc={tc} />
                ))}
                {passedCases.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No passing scripts.</p>}
              </TabsContent>

              <TabsContent value="failed" className="space-y-2">
                {failedCases.map((tc) => (
                  <TestCaseCard key={tc.id} tc={tc} />
                ))}
                {failedCases.length === 0 && (
                  <p className="py-6 text-center text-sm text-ok">No failed scripts — everything is green.</p>
                )}
              </TabsContent>
            </Tabs>
          </GlowCard>
        )}
      </div>
    </div>
  );
}
