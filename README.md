# API Automation Framework — Playwright + TypeScript

Zero-flake, self-healing API automation framework built with the **Planner → Generator → Healer** pattern. Target service: [restful-booker](https://restful-booker.herokuapp.com) (verified live).

## Highlights

- **Page Object Model (Service Objects)** — every REST resource has a service class in [`lib/services/`](lib/services) (`PingService`, `AuthService`, `BookingService`, all extending [`BaseService`](lib/services/base.service.ts)). Tests call intention-revealing methods (`bookingService.create(...)`, `.update(id, ...)`) and never touch raw paths/verbs. Services are injected as fixtures; the whole suite is refactored onto this layer.
- **Fixtures over globals** — all shared state (`apiClient`, `authProvider`, `testDataContext`, the service objects) is injected via typed Playwright fixtures. No `beforeAll` cross-test state.
- **Strict typing** — full DTOs in [`lib/types.ts`](lib/types.ts). `any` is forbidden (`noImplicitAny`).
- **Contract validation** — every 2xx response is validated with AJV against the OpenAPI component schemas *before* functional assertions ([`lib/schema-validator.ts`](lib/schema-validator.ts)).
- **Auth + retry** — automatic token refresh and a single retry on `401`/`403` ([`lib/api-client.ts`](lib/api-client.ts)). restful-booker uses `403` for missing auth — handled.
- **Dynamic data** — all payloads from `@faker-js/faker` ([`data/booking.factory.ts`](data/booking.factory.ts)). No hardcoded data.
- **Logging** — every `request.fetch()` wrapped in `test.step`, logged via Winston, attached to Allure on failure, with credentials **redacted** ([`lib/redact.ts`](lib/redact.ts)).
- **Parallel & isolated** — every test seeds and cleans up its own resources (reverse-order/LIFO), safe across **8 CI shards**.
- **Throttling** — per-worker rate limiting via `REQUEST_MIN_INTERVAL_MS`.
- **Env switching** — `dev` / `staging` / `prod` via a singleton config loader ([`config/env.ts`](config/env.ts)).

## Project tree

```
├── config/                 # singleton env loader + environment topology
├── spec/openapi.json       # normalized OpenAPI 3.0 spec (Planner input)
├── planner-output/         # topology.json (DAG) + plan-manifest.json  (Phase 1)
├── lib/                    # api-client, auth, schema-validator, logger, redact, types
│   └── services/           # Page Object Model — one service class per REST resource
├── dashboard/              # React + Express control plane (agents, import, results tab)
├── fixtures/index.ts       # custom Playwright fixtures                (Phase 2)
├── data/                   # Faker factories
├── tests/api/              # positive/negative/boundary/contract/data-driven specs
├── healer/                 # self-healing engine + report              (Phase 3)
├── scripts/                # pipeline hook + plan printer
├── .github/workflows/      # 8-shard CI + heal + allure jobs
└── playwright.config.ts
```

## Quick start

```bash
npm install
npx playwright install   # not strictly needed for API-only, but pulls PW deps
cp .env.example .env      # set BOOKER_USERNAME / BOOKER_PASSWORD (defaults work)
npm test
```

### Useful commands

| Command | Purpose |
|---|---|
| `npm test` | Run all suites |
| `npm run test:parallel` | Run with 8 workers |
| `SHARD=3 npm run test:shard` | Run shard 3 of 8 |
| `npm run test:ci` | Run with json + allure reporters |
| `npm run pipeline` | Run suite; auto-trigger healer on failure |
| `npm run heal` | Run the healer against the last report |
| `npm run plan` | Print the Planner DAG + suite matrix |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run allure:generate && npm run allure:open` | Build + view Allure report |

## The three phases

### Phase 1 — Planner
Parses `spec/openapi.json` and emits:
- [`planner-output/topology.json`](planner-output/topology.json) — the execution DAG (`ping → auth → create → read → update → patch → delete`) with data dependencies and the reverse-order cleanup strategy.
- [`planner-output/plan-manifest.json`](planner-output/plan-manifest.json) — suites, priorities, categories, required fixtures, secrets.

### Phase 2 — Generator
Produced the runnable framework: `lib/api-client.ts`, `fixtures/index.ts`, typed DTOs, all `tests/api/**/*.spec.ts`, `playwright.config.ts`, `package.json`.

### Phase 3 — Healer
Reads `test-results/test-results.json`, classifies each failure, applies a bounded patch (max 2 attempts), re-runs, and writes `healing-report.md`:

| Failure | Action |
|---|---|
| Schema drift (type mismatch) | Widen offending component schema type in `spec/openapi.json` |
| `404` versioning | Bump `apiVersionPrefix` (`v1 → v2`) in `config/environments.ts` |
| Missing seed data (`400`) | Re-run (tests self-seed fresh Faker data) |
| Flaky timeout / network | Raise `timeout` + `retries` in `playwright.config.ts` |

## Security notes

- Secrets come **only** from `process.env` (CI vault); `.env` is for local use and git-ignored.
- All credentials/tokens are redacted from logs and Allure attachments.
- The framework never enters credentials into third-party services.

## Known service quirks (verified live)

- `POST /auth` returns **200** for both success and bad credentials (bad creds → `{ "reason": "Bad credentials" }`).
- Protected verbs (`PUT`/`PATCH`/`DELETE`) return **403** (not 401) without auth.
- `DELETE` returns **201** on success.
- Malformed `POST /booking` returns **500**.
