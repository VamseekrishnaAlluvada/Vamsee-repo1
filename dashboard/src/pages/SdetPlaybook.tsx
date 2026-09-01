import { GlowCard } from '@/components/atoms/GlowCard';
import { CodeBlock } from '@/components/atoms/CodeBlock';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Boxes,
  Code2,
  FileText,
  GitBranch,
  Layers,
  Rocket,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
  PY_BROWSERSTACK,
  YAML_WORKFLOW,
  PY_RATELIMIT,
  PY_QUALITY_GATE,
  SQL_DASHBOARD,
  ARCH_DIAGRAM,
  PY_CROSSLAYER,
} from '@/content/sdet-playbook';

// -------------------------------------------------------------------------
// Building blocks
// -------------------------------------------------------------------------
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="heading text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Pill({ children, tone = 'violet' }: { children: ReactNode; tone?: 'violet' | 'cyan' | 'ok' | 'warn' | 'fail' }) {
  const tones = {
    violet: 'bg-violet/10 text-violet ring-violet/20',
    cyan: 'bg-cyan/10 text-cyan ring-cyan/20',
    ok: 'bg-ok/10 text-ok ring-ok/20',
    warn: 'bg-warn/10 text-warn ring-warn/20',
    fail: 'bg-fail/10 text-fail ring-fail/20',
  } as const;
  return <span className={cn('rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1', tones[tone])}>{children}</span>;
}

function DataTable({ head, rows }: { head: string[]; rows: (string | ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/10">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-base/60 text-left">
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-3 py-2 font-semibold uppercase tracking-wide text-slate-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-black/5">
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2 align-top text-slate-700">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-1.5 text-sm text-slate-700">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet/60" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

// -------------------------------------------------------------------------
// Page
// -------------------------------------------------------------------------
export function SdetPlaybook() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <GlowCard className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-grad-mixed p-1.5 text-white shadow-glow-violet">
            <Rocket size={16} />
          </span>
          <h2 className="heading text-base">BrowserStack API Automation Mastery — SDET Playbook</h2>
        </div>
        <p className="text-sm text-slate-600">
          A reference architecture and implementation blueprint for a microservices e-commerce platform: 15 services,
          3 web apps, 2 mobile apps, 200+ suites/day. Runs as a standalone tab, independent of the live pipeline.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Pill>15 microservices</Pill>
          <Pill tone="cyan">3 web + 2 mobile</Pill>
          <Pill tone="ok">10 parallel sessions</Pill>
          <Pill tone="warn">429-aware</Pill>
          <Pill tone="fail">10-min incident lane</Pill>
        </div>
      </GlowCard>

      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="flex-wrap">
          <TabsTrigger value="architecture"><span className="flex items-center gap-1.5"><Boxes size={14} /> Architecture</span></TabsTrigger>
          <TabsTrigger value="strategy"><span className="flex items-center gap-1.5"><Layers size={14} /> Strategy</span></TabsTrigger>
          <TabsTrigger value="code"><span className="flex items-center gap-1.5"><Code2 size={14} /> Code</span></TabsTrigger>
          <TabsTrigger value="ops"><span className="flex items-center gap-1.5"><Timer size={14} /> Ops & Tuning</span></TabsTrigger>
          <TabsTrigger value="scenarios"><span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Scenarios</span></TabsTrigger>
          <TabsTrigger value="docs"><span className="flex items-center gap-1.5"><FileText size={14} /> Docs</span></TabsTrigger>
        </TabsList>

        {/* ============================ ARCHITECTURE ============================ */}
        <TabsContent value="architecture" className="space-y-5">
          <GlowCard glow="cyan">
            <Section title="End-to-end test architecture" subtitle="BrowserStack ecosystem: Automate · App Automate · Local · Requestly · Test Management & Analytics">
              <CodeBlock language="text" code={ARCH_DIAGRAM} className="text-[11px]" />
            </Section>
          </GlowCard>

          <GlowCard>
            <Section title="Layer ownership" subtitle="Who validates what, and where it runs">
              <DataTable
                head={['Layer', 'Tooling', 'BrowserStack API', 'Runs at']}
                rows={[
                  ['API contract', 'Requestly API Client + CLI', 'Requestly, Test Management', 'commit + PR'],
                  ['Service integration', 'PyTest + requests', 'Test Analytics', 'PR + nightly'],
                  ['Web UI', 'Selenium / Playwright', 'Automate + Local', 'PR (smoke) + nightly (full)'],
                  ['Mobile', 'Appium', 'App Automate + Local', 'nightly + release'],
                  ['E2E cross-layer', 'Orchestrator', 'Automate + Analytics', 'nightly + pre-release'],
                ]}
              />
            </Section>
          </GlowCard>
        </TabsContent>

        {/* ============================ STRATEGY ============================ */}
        <TabsContent value="strategy" className="space-y-5">
          <GlowCard>
            <Section title="1 · Multi-layer testing strategy" subtitle="Test pyramid mapped to CI/CD stages">
              <Bullets
                items={[
                  <>Distribution follows a <b>70/20/10 pyramid</b>: 70% API/contract (fast, cheap), 20% UI, 10% mobile/E2E. Only API + a UI smoke run on every commit; the full UI matrix and mobile run nightly.</>,
                  <>Parallelism math: with a <b>10 parallel session</b> cap and ~90s median UI test, 500 UI tests ≈ <code>500 × 90s / 10 ≈ 75 min</code> serial-per-lane → sharded to <b>~15 min</b> with even distribution (see Ops tab).</>,
                  <>Flaky handling: the <b>Test Reporting &amp; Analytics API</b> tags a test <code>flaky</code> when pass/fail alternates over the last N runs; the quality gate ignores known-flaky failures but files a ticket and quarantines after 3 confirmations.</>,
                ]}
              />
            </Section>
          </GlowCard>

          <GlowCard glow="none">
            <Section title="2 · BrowserStack Local tunnel architecture" subtitle="Secure access to private environments across regions">
              <DataTable
                head={['Environment', 'Tunnel mode', 'localIdentifier', 'Notes']}
                rows={[
                  ['Local dev', 'Per-developer', 'dev-<user>', 'Ephemeral, force-local'],
                  ['CI (US/EU/APAC)', 'Per-job, regional', 'ci-<region>-<runId>-<shard>', 'One binary per runner; unique id per shard'],
                  ['Staging (VPN)', 'Dedicated host', 'stg-tunnel', 'proxyHost/proxyPort + --local-proxy behind VPN'],
                  ['Prod smoke', 'Read-only allowlist', 'prod-smoke', '--only <hosts>, no mutating routes'],
                ]}
              />
              <Bullets
                items={[
                  <><b>localIdentifier</b> is unique per parallel pipeline so tunnels never cross-talk; the same id is passed in Selenium caps (<code>bstack:options.localIdentifier</code>).</>,
                  <><b>Rotation &amp; health</b>: tunnels rotate every 6h or per pipeline; a sidecar polls <code>GET /automate/builds</code> + the tunnel's <code>--daemon status</code> and recreates on unhealthy.</>,
                ]}
              />
            </Section>
          </GlowCard>

          <GlowCard glow="none">
            <Section title="3 · API contract & integration testing (Requestly)" subtitle="Collections, environments, OAuth2, assertions, mocking">
              <Bullets
                items={[
                  <><b>Collection structure</b>: one collection per microservice, folders for <code>happy / negative / contract</code>; a top-level <i>Journeys</i> collection chains services (cart → order → payment) using response-variable capture.</>,
                  <><b>Environments</b>: <code>dev / staging / prod</code> environment sets hold <code>baseUrl</code>, <code>clientId</code>, token cache; secrets come from the CI vault, never committed.</>,
                  <><b>Pre-request scripts</b> perform the OAuth2/OIDC client-credentials (or auth-code+PKCE) exchange once, cache the token with expiry, and inject <code>Authorization</code> for dependent requests.</>,
                  <><b>Post-response assertions</b>: JSON-schema validation (AJV), status/latency budgets, and business-logic checks (e.g. <code>order.total == sum(items)</code>).</>,
                  <><b>Mocking</b>: payment gateways and 3rd-party deps are stubbed via Requestly mock server / redirect rules in dev + PR; contract tests hit the real sandbox nightly.</>,
                ]}
              />
            </Section>
          </GlowCard>
        </TabsContent>

        {/* ============================ CODE ============================ */}
        <TabsContent value="code" className="space-y-5">
          <GlowCard glow="cyan">
            <Section
              title="REST API integration — BrowserStack session manager (Python)"
              subtitle="Auth · caps · Local coordination · dual status reporting · exponential backoff · cleanup & artifacts"
            >
              <CodeBlock language="python" code={PY_BROWSERSTACK} />
            </Section>
          </GlowCard>

          <GlowCard>
            <Section title="CI/CD — GitHub Actions workflow" subtitle="Local → contract tests → UI automation → quality gate → Test Management → PR status">
              <CodeBlock language="yaml" code={YAML_WORKFLOW} />
            </Section>
          </GlowCard>

          <GlowCard>
            <Section title="Test management & quality-gate decision engine (Python)" subtitle="Auto-create runs, link results, decide pass/fail">
              <CodeBlock language="python" code={PY_QUALITY_GATE} />
            </Section>
          </GlowCard>

          <GlowCard glow="none">
            <Section title="Custom dashboard query" subtitle="Pass/fail by service · flaky detection · perf trend · parallel efficiency">
              <CodeBlock language="text" code={SQL_DASHBOARD} />
            </Section>
          </GlowCard>
        </TabsContent>

        {/* ============================ OPS ============================ */}
        <TabsContent value="ops" className="space-y-5">
          <GlowCard>
            <Section title="1 · Performance: 45 min → 15 min" subtitle="Same 10-session cap, 3× faster">
              <Bullets
                items={[
                  <><b>Timing-based sharding</b>: distribute by historical duration (LPT bin-packing), not test count, so shards finish within ~5% of each other.</>,
                  <><b>Kill the long tail</b>: move the slowest 5% (heavy E2E) out of the PR lane into nightly; run them once, not per-PR.</>,
                  <><b>Reuse auth &amp; data</b>: session-scoped tokens and seeded fixtures cut ~20% wall-clock; disable video for green runs (<code>video: false</code>) — it's the biggest per-session overhead.</>,
                  <><b>Fail fast</b>: <code>--exitfirst</code> on contract lane, retry only confirmed-flaky at the end.</>,
                  <>Result: 500 tests, timing-balanced across 10 sessions, avg 90s → <code>≈13–15 min</code> wall-clock.</>,
                ]}
              />
              <DataTable
                head={['Strategy', 'Before', 'After']}
                rows={[
                  ['Sharding', 'by count', 'by historical duration (LPT)'],
                  ['E2E long tail', 'every PR', 'nightly only'],
                  ['Video capture', 'always', 'on failure only'],
                  ['Wall-clock', '45 min', '~15 min'],
                ]}
              />
            </Section>
          </GlowCard>

          <GlowCard glow="none">
            <Section title="2 · Production incident lane (< 10 min)" subtitle="Prioritised critical-path validation across a curated matrix">
              <Bullets
                items={[
                  <>A dedicated <code>incident</code> workflow runs only tests tagged <code>@critical</code> (login, search, cart, checkout, payment) — ~40 tests.</>,
                  <>Curated matrix: top-3 desktop browsers + top-3 real mobile devices (by prod traffic), not the full grid.</>,
                  <>Provision the full 10-session pool immediately; the analytics API ranks tests by <b>failure-impact score</b> so the most business-critical run first.</>,
                  <>Posts a red/green summary + BrowserStack dashboard deep-link to the incident Slack channel within 10 minutes.</>,
                ]}
              />
            </Section>
          </GlowCard>

          <GlowCard glow="none">
            <Section title="3 · Rate-limit management (50 parallel CI jobs → no 429s)" subtitle="Client-side token bucket + Retry-After-aware backoff">
              <Bullets
                items={[
                  <>A shared <b>token-bucket limiter</b> (Redis-backed) caps aggregate API req/s below the account limit across all 50 jobs.</>,
                  <>Per-request wrapper honours <code>Retry-After</code>, adds decorrelated jitter, and caps total retry time; 429/5xx retried, 4xx surfaced immediately.</>,
                  <>Idempotency keys on writes so a retried create never double-provisions.</>,
                ]}
              />
              <CodeBlock language="python" code={PY_RATELIMIT} />
            </Section>
          </GlowCard>
        </TabsContent>

        {/* ============================ SCENARIOS ============================ */}
        <TabsContent value="scenarios" className="space-y-5">
          <GlowCard glow="cyan">
            <Section title="Chosen scenario — Hybrid cross-layer E2E" subtitle="Validate API contract + UI + DB state in one flow">
              <Bullets
                items={[
                  <>An orchestrator drives one business journey and asserts at every layer: API response contract → UI reflects it → DB row is consistent.</>,
                  <>State is correlated by a single <code>correlationId</code> propagated through the API call, the UI session, and the DB query.</>,
                  <>Runs on BrowserStack Automate for the UI leg (with Local to reach the private DB proxy) and reports one merged verdict to Test Management.</>,
                ]}
              />
              <CodeBlock language="python" code={PY_CROSSLAYER} />
            </Section>
          </GlowCard>

          <GlowCard glow="none">
            <Section title="Also covered (design notes)" subtitle="The other two scenarios, in brief">
              <DataTable
                head={['Scenario', 'Key BrowserStack APIs', 'Approach']}
                rows={[
                  ['Mobile 100 device/OS × 5 flows', 'App Automate: upload, sessions, devices', 'Upload once → app_url; matrix = traffic-weighted top-100; shard flows across devices; prioritise by market share'],
                  ['Compliance / security', 'Automate + maskBasicAuth', 'OWASP ZAP proxy in front of UI runs; maskBasicAuth + masked capabilities; credentials rotated per-run from vault, never logged'],
                ]}
              />
            </Section>
          </GlowCard>
        </TabsContent>

        {/* ============================ DOCS ============================ */}
        <TabsContent value="docs" className="space-y-5">
          <GlowCard>
            <Section title="Pipeline decision matrix" subtitle="Which tests run when">
              <DataTable
                head={['Stage', 'Contract', 'UI smoke', 'UI full', 'Mobile', 'E2E', 'Gate']}
                rows={[
                  ['Commit', '✅', '—', '—', '—', '—', 'contract only'],
                  ['Pull request', '✅', '✅ (3 browsers)', '—', '—', '—', 'block on fail'],
                  ['Merge → main', '✅', '✅', '✅ (sharded)', '—', '—', 'block on fail'],
                  ['Nightly', '✅', '✅', '✅ (full grid)', '✅', '✅', 'report + trend'],
                  ['Release', '✅', '✅', '✅', '✅', '✅', 'manual sign-off'],
                  ['Incident', '@critical', '@critical', '—', '@critical', '@critical', '< 10 min'],
                ]}
              />
            </Section>
          </GlowCard>

          <GlowCard glow="none">
            <Section title="Troubleshooting guide — 10 most common issues">
              <DataTable
                head={['#', 'Symptom', 'Cause', 'Fix']}
                rows={[
                  ['1', '429 Too Many Requests', 'Aggregate req/s over limit', 'Token-bucket limiter + Retry-After backoff'],
                  ['2', 'Tunnel not connecting in CI', 'Duplicate localIdentifier', 'Unique id per shard: ci-<region>-<run>-<shard>'],
                  ['3', 'Local test can reach some hosts only', '--only / --force-local scope', 'Add hosts to allowlist; verify proxy settings'],
                  ['4', 'Session stuck / timeout', 'No idleTimeout + no cleanup', 'Set idleTimeout, always quit() in finally'],
                  ['5', 'Auth 401 mid-run', 'Token expired', 'Cache token with expiry, refresh pre-request'],
                  ['6', 'Flaky UI on one browser', 'Race / animation timing', 'Explicit waits; quarantine after 3 flaky confirmations'],
                  ['7', 'Credentials leaked in logs', 'Plain basic-auth in URL', 'maskBasicAuth + masked capabilities'],
                  ['8', 'Build slower over time', 'Uneven shards', 'Re-balance by historical duration (LPT)'],
                  ['9', 'App upload fails (App Automate)', 'Re-uploading each run', 'Upload once, reuse app_url; cache per version'],
                  ['10', 'Quality gate flip-flops', 'Counting flaky as fail', 'Exclude known-flaky from gate; alert separately'],
                ]}
              />
            </Section>
          </GlowCard>

          <GlowCard glow="none">
            <Section title="Metrics dashboard (Grafana / Datadog)" subtitle="Panels + data sources for test health">
              <DataTable
                head={['Panel', 'Metric', 'Source']}
                rows={[
                  ['Pass rate by service', 'passed / total, grouped by service', 'Test Analytics API'],
                  ['Flaky top-10', 'flip-rate over last 30 runs', 'Test Analytics API'],
                  ['Perf trend', 'p50/p95 duration per suite, 14-day', 'Analytics + CI timing'],
                  ['Parallel efficiency', 'busy-session-time / (sessions × wall-clock)', 'Automate builds API'],
                  ['Session cost', 'session-minutes per pipeline', 'Automate builds API'],
                  ['Gate outcomes', 'block/allow over time', 'Quality-gate engine'],
                ]}
              />
              <p className="text-xs text-slate-500">
                Alerting: page on pass-rate &lt; 95% (main), parallel efficiency &lt; 60%, or any p95 regression &gt; 30% week-over-week.
              </p>
            </Section>
          </GlowCard>

          <GlowCard glow="none">
            <Section title="Environment configuration (excerpt)">
              <CodeBlock
                language="yaml"
                code={`# .browserstack.env  (values injected from CI vault)
BROWSERSTACK_USERNAME: <vault:bs_user>
BROWSERSTACK_ACCESS_KEY: <vault:bs_key>
BROWSERSTACK_LOCAL: "true"
BUILD_NAME: "ecom-\${GIT_SHA}"
PARALLEL_SESSIONS: "10"
LOCAL_IDENTIFIER: "ci-\${REGION}-\${RUN_ID}-\${SHARD}"`}
              />
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <GitBranch size={13} /> Full configs for dev / staging / prod / incident live in <code>config/browserstack/*.yaml</code>.
              </p>
            </Section>
          </GlowCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
