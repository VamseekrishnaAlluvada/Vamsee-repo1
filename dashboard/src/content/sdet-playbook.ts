/**
 * Static content for the SDET Playbook tab — architecture diagram + code samples.
 * Kept in one module so the page component stays presentational.
 *
 * NOTE: `\${...}` sequences are escaped on purpose so the literal `${...}` reaches
 * the rendered code (GitHub Actions `${{ }}` and shell `${VAR}`), instead of being
 * interpreted as a JS template interpolation.
 */

export const ARCH_DIAGRAM = `                         ┌───────────────────────────────────────────────┐
                         │                  DEVELOPERS                    │
                         │      commit ─▶ Pull Request ─▶ merge/main      │
                         └───────────────────────┬───────────────────────┘
                                                 │
                    ┌────────────────────────────▼────────────────────────────┐
                    │                    CI/CD (GitHub Actions)                 │
                    │   US runner        EU runner        APAC runner          │
                    │   ci-us-*          ci-eu-*          ci-apac-*            │
                    └───┬───────────────────┬───────────────────┬─────────────┘
                        │                   │                   │
             ┌──────────▼─────────┐  ┌──────▼───────┐   ┌───────▼──────────┐
             │  Requestly API     │  │  Selenium/    │   │  Appium          │
             │  Client + CLI      │  │  Playwright   │   │  (mobile)        │
             │  (contract tests)  │  │  (web UI)     │   │                  │
             └──────────┬─────────┘  └──────┬───────┘   └───────┬──────────┘
                        │                   │                   │
                        │            ┌──────▼───────────────────▼──────┐
                        │            │       BrowserStack Local         │
                        │            │  tunnels (per shard, regional)   │
                        │            │  localIdentifier = ci-<r>-<s>    │
                        │            └──────┬───────────────────┬───────┘
                        │                   │                   │
                        │            ┌──────▼───────┐   ┌───────▼──────────┐
                        │            │  Automate    │   │  App Automate    │
                        │            │  (10 // )    │   │  (real devices)  │
                        │            └──────┬───────┘   └───────┬──────────┘
                        │                   │                   │
   private nets ◀───────┴───────────────────┴───────────────────┘  (Local tunnel)
   (staging VPN, DB proxy, prod read-only allowlist)
                                            │
                        ┌───────────────────▼────────────────────┐
                        │   Test Management + Reporting/Analytics │
                        │   runs · results · flaky · trends       │
                        └───────────────────┬────────────────────┘
                                            │
                        ┌───────────────────▼────────────────────┐
                        │   Quality-Gate engine ─▶ PR status      │
                        │   Grafana/Datadog dashboards + alerts   │
                        └─────────────────────────────────────────┘`;

export const PY_BROWSERSTACK = `"""BrowserStack Automate session manager — production-grade."""
import os, time, random, json, requests
from selenium import webdriver

HUB = "https://hub-cloud.browserstack.com/wd/hub"
API = "https://api.browserstack.com/automate"


class BrowserStackSession:
    def __init__(self, build, local_identifier=None):
        self.user = os.environ["BROWSERSTACK_USERNAME"]
        self.key = os.environ["BROWSERSTACK_ACCESS_KEY"]
        self.build = build
        self.local_identifier = local_identifier
        self.driver = None
        self.auth = (self.user, self.key)

    # ---- capabilities -------------------------------------------------
    def _caps(self, name, browser="chrome", os_name="Windows", os_version="11"):
        opts = {
            "userName": self.user, "accessKey": self.key,
            "buildName": self.build, "sessionName": name,
            "os": os_name, "osVersion": os_version,
            "seleniumVersion": "4.20.0",
            "local": bool(self.local_identifier),
            "idleTimeout": 120,
            "video": os.environ.get("BS_VIDEO", "false") == "true",
            "maskBasicAuth": True,
            "debug": True, "networkLogs": True,
        }
        if self.local_identifier:
            opts["localIdentifier"] = self.local_identifier
        caps = webdriver.ChromeOptions()
        caps.set_capability("browserName", browser)
        caps.set_capability("bstack:options", opts)
        return caps

    # ---- lifecycle ----------------------------------------------------
    def start(self, name, **kw):
        self.driver = self._retry(
            lambda: webdriver.Remote(command_executor=HUB, options=self._caps(name, **kw))
        )
        return self.driver

    def report(self, passed, reason=""):
        """Dual status: in-session executor + REST API (belt and braces)."""
        status = "passed" if passed else "failed"
        payload = {"action": "setSessionStatus",
                   "arguments": {"status": status, "reason": reason[:255]}}
        self.driver.execute_script(
            'browserstack_executor: ' + json.dumps(payload))
        sid = self.driver.session_id
        self._retry(lambda: requests.put(
            f"{API}/sessions/{sid}.json",
            json={"status": status, "reason": reason[:255]},
            auth=self.auth, timeout=30))

    def artifacts(self):
        sid = self.driver.session_id
        r = self._retry(lambda: requests.get(
            f"{API}/sessions/{sid}.json", auth=self.auth, timeout=30)).json()
        d = r["automation_session"]
        return {"video": d.get("video_url"),
                "logs": d.get("browser_url"),
                "public": d.get("public_url")}

    def stop(self):
        if self.driver:
            try:
                self.driver.quit()
            finally:
                self.driver = None

    # ---- resilience: exponential backoff w/ jitter --------------------
    def _retry(self, fn, tries=5, base=1.0, cap=30.0):
        for i in range(tries):
            try:
                resp = fn()
                if hasattr(resp, "status_code") and resp.status_code == 429:
                    raise requests.HTTPError("429")
                return resp
            except Exception as e:
                if i == tries - 1:
                    raise
                sleep = min(cap, base * 2 ** i) + random.uniform(0, base)
                time.sleep(sleep)


# ---- usage ------------------------------------------------------------
if __name__ == "__main__":
    s = BrowserStackSession(build="ecom-" + os.environ.get("GIT_SHA", "local"),
                            local_identifier=os.environ.get("LOCAL_IDENTIFIER"))
    ok, why = False, ""
    try:
        d = s.start("checkout smoke")
        d.get("http://bs-local.com:3000/checkout")
        ok = "Order confirmed" in d.page_source
        why = "" if ok else "confirmation text missing"
    except Exception as e:
        ok, why = False, str(e)
    finally:
        if s.driver:
            s.report(ok, why)
            print(json.dumps(s.artifacts()))
        s.stop()
`;

export const YAML_WORKFLOW = `name: e2e-quality-gate
on: [pull_request]

concurrency:
  group: e2e-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      max-parallel: 5            # stay under the 10-session cap
      matrix:
        shard: [1, 2, 3, 4, 5]
    env:
      BROWSERSTACK_USERNAME: \${{ secrets.BROWSERSTACK_USERNAME }}
      BROWSERSTACK_ACCESS_KEY: \${{ secrets.BROWSERSTACK_ACCESS_KEY }}
      LOCAL_IDENTIFIER: ci-\${{ github.run_id }}-\${{ matrix.shard }}
      GIT_SHA: \${{ github.sha }}
    steps:
      - uses: actions/checkout@v4

      - name: Start BrowserStack Local
        uses: browserstack/github-actions/setup-local@master
        with:
          local-testing: start
          local-identifier: \${{ env.LOCAL_IDENTIFIER }}

      - name: API contract tests (Requestly CLI)
        run: |
          npx requestly-cli run collections/*.json \\
            --env staging --reporter junit --out reports/contract.xml

      - name: UI automation (BrowserStack)
        run: |
          pytest tests/ui --shard \${{ matrix.shard }}/5 \\
            --junitxml=reports/ui-\${{ matrix.shard }}.xml

      - name: Upload results to Test Management
        if: always()
        run: python ci/upload_results.py reports/*.xml

      - name: Stop BrowserStack Local
        if: always()
        uses: browserstack/github-actions/setup-local@master
        with:
          local-testing: stop
          local-identifier: \${{ env.LOCAL_IDENTIFIER }}

  gate:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Poll quality gate
        id: gate
        run: python ci/quality_gate.py --build ecom-\${{ github.sha }}
      - name: Set PR status
        uses: actions/github-script@v7
        with:
          script: |
            core.setOutput('url', process.env.DASH_URL)
            const state = '\${{ steps.gate.outputs.decision }}'
            await github.rest.repos.createCommitStatus({
              owner: context.repo.owner, repo: context.repo.repo,
              sha: context.sha, state,
              context: 'browserstack/quality-gate',
              target_url: process.env.DASH_URL,
              description: 'BrowserStack quality gate'
            })
`;

export const PY_RATELIMIT = `"""Rate-limit-aware request wrapper for 50 parallel CI jobs."""
import time, random, requests, redis

r = redis.from_url(os.environ["REDIS_URL"])
MAX_RPS = 20            # aggregate cap across ALL jobs, below account limit


def _acquire(key="bs:tokens"):
    """Distributed token bucket: block until a token is free."""
    while True:
        window = int(time.time())
        used = r.incr(f"{key}:{window}")
        if used == 1:
            r.expire(f"{key}:{window}", 2)
        if used <= MAX_RPS:
            return
        time.sleep(0.05 + random.uniform(0, 0.05))


def bs_request(method, url, *, tries=6, **kw):
    """Retry 429/5xx with Retry-After + decorrelated jitter; 4xx surfaces."""
    backoff = 1.0
    for attempt in range(tries):
        _acquire()
        resp = requests.request(method, url, timeout=30, **kw)
        if resp.status_code == 429:
            wait = float(resp.headers.get("Retry-After", backoff))
            time.sleep(wait + random.uniform(0, 0.5))
            backoff = min(30.0, backoff * 3)
            continue
        if 500 <= resp.status_code < 600:
            time.sleep(backoff + random.uniform(0, 0.5))
            backoff = min(30.0, backoff * 3)
            continue
        resp.raise_for_status()      # 4xx -> raise immediately
        return resp
    raise RuntimeError(f"exhausted retries: {method} {url}")
`;

export const PY_QUALITY_GATE = `"""Auto-create a test run, link results, decide pass/fail."""
import sys, os, requests

TM = "https://test-management.browserstack.com/api/v2"
AUTH = (os.environ["BROWSERSTACK_USERNAME"], os.environ["BROWSERSTACK_ACCESS_KEY"])


def create_run(project, name):
    r = requests.post(f"{TM}/projects/{project}/test-runs",
                      json={"name": name}, auth=AUTH, timeout=30)
    r.raise_for_status()
    return r.json()["identifier"]


def link_results(project, run_id, results):
    requests.post(f"{TM}/projects/{project}/test-runs/{run_id}/results",
                  json={"results": results}, auth=AUTH, timeout=30).raise_for_status()


def analytics(build):
    r = requests.get(f"https://api.browserstack.com/automate/builds",
                     params={"name": build}, auth=AUTH, timeout=30)
    return r.json()


def decide(build, *, min_pass=0.98, allow_flaky=True):
    """Gate: block on real failures; ignore known-flaky."""
    stats = analytics(build)[0]["automation_build"]
    total = stats["tests"]; failed = stats["failed"]
    flaky = stats.get("flaky", 0)
    real_failures = failed - (flaky if allow_flaky else 0)
    pass_rate = 1 - (real_failures / max(total, 1))
    decision = "success" if pass_rate >= min_pass else "failure"
    print(f"pass_rate={pass_rate:.3f} real_failures={real_failures} -> {decision}")
    return decision


if __name__ == "__main__":
    build = sys.argv[sys.argv.index("--build") + 1]
    d = decide(build)
    # expose for the GitHub Actions step
    with open(os.environ["GITHUB_OUTPUT"], "a") as fh:
        fh.write(f"decision={d}\\n")
    sys.exit(0 if d == "success" else 1)
`;

export const SQL_DASHBOARD = `-- Test health warehouse query (fed by the Test Analytics API export).
-- 1) Pass/fail by service
SELECT service,
       COUNT(*)                                        AS total,
       SUM(status = 'passed')                          AS passed,
       ROUND(100.0 * SUM(status='passed') / COUNT(*), 1) AS pass_rate
FROM   test_results
WHERE  run_date >= NOW() - INTERVAL 7 DAY
GROUP  BY service
ORDER  BY pass_rate ASC;

-- 2) Flaky detection: tests whose outcome flips across recent runs
SELECT test_id, service,
       COUNT(DISTINCT status) AS distinct_outcomes,
       COUNT(*)               AS runs
FROM   test_results
WHERE  run_date >= NOW() - INTERVAL 30 DAY
GROUP  BY test_id, service
HAVING distinct_outcomes > 1
ORDER  BY runs DESC
LIMIT  10;

-- 3) Performance degradation trend (p95 duration, 14 days)
SELECT suite, run_date::date AS day,
       PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms) AS p95_ms
FROM   test_results
WHERE  run_date >= NOW() - INTERVAL 14 DAY
GROUP  BY suite, day
ORDER  BY suite, day;

-- 4) Parallel execution efficiency
SELECT build_id,
       SUM(duration_ms) / 1000.0                                  AS busy_session_s,
       (max_parallel * wall_clock_s)                              AS capacity_s,
       ROUND(100.0 * SUM(duration_ms)/1000.0
             / NULLIF(max_parallel * wall_clock_s, 0), 1)         AS efficiency_pct
FROM   builds JOIN test_results USING (build_id)
GROUP  BY build_id, max_parallel, wall_clock_s
ORDER  BY efficiency_pct ASC;`;

export const PY_CROSSLAYER = `"""Cross-layer E2E: API contract + UI + DB in one correlated flow."""
import uuid, requests, psycopg2
from browserstack_session import BrowserStackSession

def test_place_order_cross_layer():
    corr = str(uuid.uuid4())

    # 1) API layer — create the order, assert contract
    r = bs_request("POST", "https://api.staging.shop/orders",
                   headers={"X-Correlation-Id": corr, "Authorization": token()},
                   json={"sku": "SKU-42", "qty": 2})
    assert r.status_code == 201
    order = r.json()
    assert order["total"] == order["unitPrice"] * 2      # business rule
    order_id = order["id"]

    # 2) UI layer — the order appears for the user (via BrowserStack + Local)
    s = BrowserStackSession(build="xlayer", local_identifier="ci-xlayer-1")
    try:
        d = s.start("order visible in UI")
        d.get(f"http://bs-local.com:3000/orders/{order_id}")
        ui_ok = order_id in d.page_source and "Confirmed" in d.page_source
        s.report(ui_ok)
        assert ui_ok
    finally:
        s.stop()

    # 3) DB layer — persisted state is consistent (through the Local DB proxy)
    with psycopg2.connect(DSN) as cx, cx.cursor() as cur:
        cur.execute("SELECT status, correlation_id FROM orders WHERE id = %s",
                    (order_id,))
        status, db_corr = cur.fetchone()
    assert status == "CONFIRMED"
    assert db_corr == corr        # same journey end-to-end
`;
