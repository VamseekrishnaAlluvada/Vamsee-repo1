# BrowserStack++ — API Automation Control Plane

An ultra-modern, real-time dashboard for the Playwright API automation framework
(Planner / Generator / Healer). It consumes the framework's raw outputs
(`test-results.json`, `planner-output/topology.json`, `healing-report.md`) and
renders them as a live, glassmorphic control plane.

![stack](https://img.shields.io/badge/React-18-06B6D4) ![stack](https://img.shields.io/badge/Vite-5-7C3AED) ![stack](https://img.shields.io/badge/Tailwind-3-3B82F6)

## Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript + **Vite** |
| Styling | **Tailwind CSS v3** (custom cosmic theme in `tailwind.config.js`) |
| UI primitives | **Radix UI** (shadcn-style: `dialog`, `tabs`, `tooltip`) |
| Charts | **Recharts** (KPIs, gauge, trends) |
| Graph | **D3** force simulation (`d3-force`) for the dependency DAG |
| State | **Zustand** (`src/store/useStore.ts`) |
| Real-time | **Socket.io** client ⇆ Express server watching the filesystem |
| Data grid | **TanStack React Table v8** |
| Syntax highlight | **Prism.js** |
| Export | **html2canvas + jsPDF** |

## Layout (Atomic Design)

```
dashboard/
├── server/
│   ├── index.ts               # Express + Socket.io + chokidar file-watcher (wiring only)
│   └── agents/                # industrial-standard agent pipeline
│       ├── logger.ts          # structured JSON logging shared by every agent
│       ├── validator.agent.ts # structural + reachability checkpoint
│       ├── planner.agent.ts   # endpoint/auth/assertion plan
│       ├── generator.agent.ts # synthesises the Playwright spec (status-only assert)
│       ├── runner.agent.ts    # runs Playwright + parses results into test cases
│       ├── healer.agent.ts    # invokes the self-healing engine on failure
│       ├── reporter.agent.ts  # assembles + persists the structured run report
│       ├── import.agent.ts    # multi-format importer (see below)
│       └── orchestrator.ts    # composes the agents, streams phases + report
├── src/
│   ├── types.ts               # shared data contract (client + server)
│   ├── lib/                    # api, socket, utils
│   ├── store/useStore.ts       # Zustand global state
│   ├── components/
│   │   ├── atoms/              # GlowCard, Badge, StatusDot, Sparkline, CodeBlock
│   │   ├── molecules/          # KpiCard, HealthGauge, ActivityFeed, EnvSwitcher
│   │   ├── organisms/          # Sidebar, TopBar, TestGrid, TopologyGraph, HealerDiff, Aurora
│   │   ├── ui/                 # Radix-based dialog/tabs/tooltip (shadcn-style)
│   │   └── templates/          # DashboardLayout
│   └── pages/                  # MissionControl, Execution, ApiRunner, Results, HealerLog
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Pages

- **Mission Control** — KPI cards (Total, Pass %, p95, Flakiness) each with a 7-run sparkline, a Red→Yellow→Green health gauge, status distribution donut, and run-trend chart.
- **Execution** — TanStack data grid (sortable, click-to-inspect with Prism-highlighted JSON), instant search + status/tag/`>1000ms` filters, and a live vertical activity timeline.
- **API Runner** — add an API by hand **or `Import APIs`** from a file/paste, then `Run Automation` to drive the full agent pipeline live (Validator → Planner → Generator → Runner → Healer).
- **Results** — structured record of every automation run: roll-up tiles (test cases / scripts / passed / failed / assertions / total time), a run list, per-run **phase timing (time taken per agent)**, and tabs for **Test Cases / Scripts / Passed / Failed** — each test case listing its **assertions added** and duration.
- **Healer's Log** — side-by-side broken-response vs. expected-schema diff, the exact patch + files touched, and the full `healing-report.md` rendered as markdown in a modal.

## Importing APIs (any format)

`API Runner → Import APIs` accepts an uploaded file or pasted text; the format is
auto-detected and every field (name, method, base URL, path, headers, query,
body, auth, expected status) is picked up automatically. Review the parsed
preview, tick the ones you want, and import. Supported:

| Format | Extensions | Notes |
|---|---|---|
| OpenAPI / Swagger | `.json` `.yaml` `.yml` | one API per path × method; auth from security schemes |
| Postman collection | `.json` | v2.x, folders walked recursively |
| cURL | `.txt` `.sh` / paste | `-X`, `-H`, `-d`, `-u`, bearer headers |
| HAR | `.har` `.json` | request entries → APIs |
| Excel / CSV | `.xlsx` `.xls` `.csv` | columns: name, method, baseUrl, path, auth, expectedStatus, headers, query, body |
| Word | `.docx` | text extracted, then cURL/JSON/line heuristics |
| PDF | `.pdf` | text extracted, then cURL/JSON/line heuristics |

Backend: `POST /api/import/parse` (multipart `file` **or** JSON `{ text }`) →
`{ format, apis[], warnings[] }`; `POST /api/custom-apis/bulk` saves the selected set.

## Run it

From `dashboard/`:

```bash
npm install
npm run dev:all
```

- UI (Vite): http://localhost:5173
- API + WebSocket (Express): http://localhost:4000
- Vite proxies `/api` and `/socket.io` to :4000, so open **:5173**.

Run separately if you prefer:

```bash
npm run server   # backend only
npm run dev       # frontend only
```

### Production

```bash
npm run build     # tsc + vite build -> dist/
npm start         # Express serves dist/ + API + WS on :4000
```

## How live updates work

The Express server watches the sibling framework directory (`../`) with
`chokidar`. When you **re-run the Playwright suite** (e.g. `npm test` in the
framework root) and its `test-results.json` changes, the server re-parses,
re-aggregates, and pushes `results:update` / `topology:update` / `healer:update`
over Socket.io. It also **replays the run as a staggered activity feed**, so the
Execution timeline animates on every run — no page refresh.

## Environment switcher

`Dev` reflects the **real** parsed results. `Staging` and `Prod` are
**deterministic overlays** of the same run (slightly higher latency / lower pass
rate) so the switcher is demonstrable without separate result directories. Point
the server at real per-env result folders to make all three live.

## Notes / honest scope

- The grid renders rows directly (the current suite is small). For thousands of
  rows, drop in `@tanstack/react-virtual` around the `<tbody>` — the table model
  is already virtualization-ready.
- Sparklines seed 6 synthetic prior points on first load so trends have context;
  real points accumulate as you re-run the suite.
