# Test Execution Report

- **Run ID**: `861A25CC-07B0-4F84-8D93-4C09A094DF15`
- **Generated**: 2026-09-23T19:32:44.013Z
- **Result**: 89/90 passed (99%) — 1 failed
- **Duration**: 6.9s

| # | Test | Status | Duration |
|---|------|--------|----------|
| 1 | TC-001 — Verify GET https://postman-echo.com/ returns 200 on the happy path | ✅ passed | 1.8s |
| 2 | TC-002 — Verify GET https://postman-echo.com/ responds within 5000ms on the happy path | ✅ passed | 1.6s |
| 3 | TC-008 — Confirm DELETE https://postman-echo.com/ does not return a 5xx when using an unexpected method on the root | ✅ passed | 0.5s |
| 4 | TC-007 — Return a 4xx for GET https://postman-echo.com/not-a-real-id with a non-numeric resource id | ✅ passed | 0.5s |
| 5 | TC-010 — Confirm GET https://postman-echo.com/ returns the same status when called twice (idempotency) | ✅ passed | 1.7s |
| 6 | TC-009 — Confirm GET https://postman-echo.com (no trailing slash) does not return a 5xx | ✅ passed | 1.7s |
| 7 | TC-011 — Confirm GET https://postman-echo.com/?q=<script>alert(1)</script> returns a clean status without a 5xx | ✅ passed | 1.7s |
| 8 | TC-012 — Confirm HEAD https://postman-echo.com/ returns a 2xx with no server error | ✅ passed | 1.6s |
| 9 | TC-013 — Verify GET / on postman-echo returns 200 with a non-empty response body | ✅ passed | 1.6s |
| 10 | TC-014 — Verify GET / responds within 5000ms on the happy path | ✅ passed | 1.6s |
| 11 | TC-015 — Confirm GET / returns a Content-Type header on the successful response | ✅ passed | 1.4s |
| 12 | TC-016 — Return 404 for GET /99999999 when the requested resource id does not exist | ✅ passed | 0.3s |
| 13 | TC-017 — Return 404 for GET /nonexistent-resource-xyz when a non-numeric unknown path is requested | ✅ passed | 0.3s |
| 14 | TC-018 — Reject PUT / with a 4xx/405 since PUT is not a supported method on the root resource | ✅ passed | 0.3s |
| 15 | TC-019 — Confirm GET /?debug=true ignores an unknown query parameter and still returns 200 | ✅ passed | 1.4s |
| 16 | TC-020 — Confirm GET / with multiple unknown query parameters still returns 200 without a server error | ✅ passed | 1.4s |
| 17 | TC-021 — Confirm GET / with Accept: application/xml still returns 200 rather than a 5xx | ✅ passed | 1.4s |
| 18 | TC-022 — Verify HEAD / returns 200 with headers and no body on the root resource | ✅ passed | 1.4s |
| 19 | TC-023 — Confirm two consecutive GET / requests return the same 200 status (idempotency) | ✅ passed | 1.4s |
| 20 | TC-024 — Verify GET https://postman-echo.com?foo=bar returns 200 for the documented request | ✅ passed | 1.4s |
| 21 | TC-025 — Confirm GET https://postman-echo.com?foo=bar returns a present, non-empty response body | ✅ passed | 1.5s |
| 22 | TC-026 — Verify GET https://postman-echo.com?foo=bar responds within 5000ms on the happy path | ✅ passed | 1.4s |
| 23 | TC-027 — Confirm content-type header is returned on the GET https://postman-echo.com?foo=bar happy path | ✅ passed | 1.4s |
| 24 | TC-028 — Return 404 for GET https://postman-echo.com/99999999 when the resource id does not exist | ✅ passed | 0.4s |
| 25 | TC-029 — Return a 4xx for GET https://postman-echo.com/not-a-number when a non-numeric id is supplied | ✅ passed | 0.3s |
| 26 | TC-030 — Reject PUT https://postman-echo.com?foo=bar with a 4xx as the method is not supported on the root resource | ✅ passed | 0.3s |
| 27 | TC-031 — Confirm GET https://postman-echo.com?foo=bar&unknownParam=xyz ignores an unknown query parameter and still returns 200 | ✅ passed | 1.4s |
| 28 | TC-032 — Confirm GET https://postman-echo.com?foo= handles an empty query value without a 500 error | ✅ passed | 1.4s |
| 29 | TC-033 — Verify HEAD https://postman-echo.com?foo=bar returns 200 with headers and no body | ✅ passed | 1.3s |
| 30 | TC-034 — Confirm repeating GET https://postman-echo.com?foo=bar twice returns the same 200 status (idempotency) | ✅ passed | 1.5s |
| 31 | TC-035 — Verify GET /99999999 returns exactly 404 for a non-existent resource | ✅ passed | 0.3s |
| 32 | TC-036 — Confirm GET /99999999 returns a non-empty body describing the missing resource | ✅ passed | 0.3s |
| 33 | TC-037 — Verify GET /99999999 responds within 5000ms even for a 404 | ✅ passed | 0.3s |
| 34 | TC-038 — Reject GET /not-a-number with 404 when the id segment is non-numeric | ✅ passed | 0.3s |
| 35 | TC-039 — Reject GET /99999999 with a 4xx client error and never a server 5xx | ✅ passed | 0.4s |
| 36 | TC-040 — Return a non-2xx status for POST /99999999 using the wrong HTTP method | ✅ passed | 0.4s |
| 37 | TC-041 — Confirm GET /99999999?debug=true ignores an unknown query parameter and still returns 404 | ✅ passed | 0.3s |
| 38 | TC-042 — Confirm GET /99999999/ with a trailing slash does not trigger a 500 | ✅ passed | 0.3s |
| 39 | TC-043 — Verify GET /99999999 with Accept application/xml still returns a 404 | ✅ passed | 0.4s |
| 40 | TC-044 — Confirm GET /99999999 sets a content-type header on the 404 response | ✅ passed | 0.4s |
| 41 | TC-046 — Return a clean 4xx for GET /99999999 with a SQL-injection-shaped query value without echoing the payload | ✅ passed | 0.3s |
| 42 | TC-045 — Verify GET /99999999 is idempotent by returning 404 on two consecutive calls | ✅ passed | 0.3s |
| 43 | TC-047 — Verify GET /this-resource-does-not-exist returns exactly 404 for the documented request | ✅ passed | 0.3s |
| 44 | TC-048 — Confirm GET /this-resource-does-not-exist returns a non-empty response body describing the 404 | ✅ passed | 0.3s |
| 45 | TC-049 — Confirm GET /this-resource-does-not-exist responds within 5000ms even for a 404 | ✅ passed | 0.3s |
| 46 | TC-050 — Confirm GET /this-resource-does-not-exist returns a content-type header on the 404 response | ✅ passed | 0.3s |
| 47 | TC-051 — Verify GET /this-resource-does-not-exist/99999999 for a deep unknown sub-path still returns 404 | ✅ passed | 0.3s |
| 48 | TC-052 — Verify GET /this-resource-does-not-exist with a non-numeric segment returns 404 without a server error | ✅ passed | 0.3s |
| 49 | TC-053 — Verify POST to /this-resource-does-not-exist is rejected with a 4xx rather than succeeding | ✅ passed | 0.3s |
| 50 | TC-054 — Verify DELETE against /this-resource-does-not-exist does not return a 2xx | ✅ passed | 0.3s |
| 51 | TC-055 — Verify GET /this-resource-does-not-exist with an unknown query parameter still returns 404 | ✅ passed | 0.3s |
| 52 | TC-056 — Verify GET /this-resource-does-not-exist/ with a trailing slash does not trigger a 500 | ✅ passed | 0.3s |
| 53 | TC-057 — Verify GET /THIS-RESOURCE-DOES-NOT-EXIST with an uppercased path does not return a 5xx | ✅ passed | 0.9s |
| 54 | TC-058 — Verify GET /this-resource-does-not-exist ignores an Accept: application/xml header and still returns 404 | ✅ passed | 0.3s |
| 55 | TC-059 — Verify GET /this-resource-does-not-exist returns a stable 404 on a repeated identical request | ✅ passed | 0.3s |
| 56 | TC-060 — Verify GET /this-resource-does-not-exist with a SQL-injection-shaped path segment returns a clean 4xx and does not echo the payload | ✅ passed | 0.3s |
| 57 | TC-061 — Verify POST https://postman-echo.com returns 405 Method Not Allowed on the root resource | ✅ passed | 0.3s |
| 58 | TC-062 — Confirm POST https://postman-echo.com responds under 5000ms on the 405 happy path | ✅ passed | 0.3s |
| 59 | TC-063 — Verify POST https://postman-echo.com returns a non-2xx status confirming the write is rejected | ✅ passed | 0.3s |
| 60 | TC-064 — Reject POST https://postman-echo.com with 405 even when a JSON body is supplied | ✅ passed | 0.3s |
| 61 | TC-065 — Reject POST https://postman-echo.com with a 4xx when the body is malformed JSON | ✅ passed | 0.3s |
| 62 | TC-066 — Reject POST https://postman-echo.com with 405 when an empty JSON object body is sent | ✅ passed | 0.3s |
| 63 | TC-067 — Confirm POST https://postman-echo.com does not 500 when an unknown query parameter is added | ✅ passed | 0.3s |
| 64 | TC-068 — Confirm POST https://postman-echo.com/ with a trailing slash does not 500 and stays a 4xx | ✅ passed | 0.3s |
| 65 | TC-069 — Return 404 for POST https://postman-echo.com/99999999 against a non-existent id | ✅ passed | 0.3s |
| 66 | TC-070 — Confirm POST https://postman-echo.com/not-a-number does not 500 on a non-numeric id | ✅ passed | 0.3s |
| 67 | TC-071 — Verify POST https://postman-echo.com returns a clean 4xx and does not echo a script-shaped body value | ✅ passed | 0.3s |
| 68 | TC-072 — Confirm POST https://postman-echo.com returns the same 405 status on two identical requests | ✅ passed | 0.3s |
| 69 | TC-073 — Verify DELETE / on postman-echo returns 405 Method Not Allowed within 5s | ✅ passed | 0.3s |
| 70 | TC-074 — Confirm the 405 response to DELETE / carries a well-formed content-type header | ✅ passed | 0.3s |
| 71 | TC-075 — Confirm DELETE / with an Accept: application/json header still returns 405 | ✅ passed | 0.3s |
| 72 | TC-076 — Reject DELETE /99999999 for a non-existent id with a 404 or 405 (never 2xx) | ✅ passed | 0.3s |
| 73 | TC-078 — Confirm DELETE /?debug=true ignores an unknown query parameter and still returns 405 | ✅ passed | 0.3s |
| 74 | TC-077 — Reject DELETE /not-a-number for a malformed non-numeric id with a 4xx status | ✅ passed | 0.3s |
| 75 | TC-079 — Confirm DELETE / with a trailing-slash path variant does not return a 500 | ✅ passed | 0.3s |
| 76 | TC-080 — Confirm DELETE / with an unexpected request body is still rejected with 405 | ✅ passed | 0.3s |
| 77 | TC-081 — Confirm GET / on the same root URL succeeds (2xx), proving the 405 is DELETE-specific | ✅ passed | 1.4s |
| 78 | TC-082 — Confirm DELETE / rejects an unauthenticated request the same way (405), since the API uses no auth | ✅ passed | 0.3s |
| 79 | TC-083 — Ensure DELETE / with a SQL-injection-shaped query value returns a clean 4xx without echoing the payload | ✅ passed | 0.3s |
| 80 | TC-084 — Verify HEAD / returns 200 with a content-type header on the postman-echo root | ✅ passed | 1.4s |
| 81 | TC-085 — Confirm HEAD / responds within 5000ms on the happy path | ✅ passed | 1.3s |
| 82 | TC-086 — Confirm HEAD / is a 2xx success and never returns a 5xx | ✅ passed | 1.4s |
| 83 | TC-087 — Return 4xx for HEAD /99999999 when the id cannot exist | ✅ passed | 0.3s |
| 84 | TC-088 — Return 4xx for HEAD /not-a-real-path when the path segment is non-numeric | ✅ passed | 0.3s |
| 85 | TC-089 — Confirm HEAD /?debug=true ignores an unknown query parameter and still returns 200 | ✅ passed | 1.4s |
| 86 | TC-090 — Confirm HEAD / with Accept: application/xml still returns a non-5xx response | ✅ passed | 1.4s |
| 87 | TC-091 — Confirm HEAD / tolerates an arbitrary custom request header and returns 200 | ✅ passed | 1.4s |
| 88 | TC-092 — Confirm HEAD /99999999?foo=bar keeps returning 4xx when a query is appended to an unknown id | ✅ passed | 0.3s |
| 89 | TC-093 — Confirm case-variant path HEAD /NoSuchResource does not return a 500 | ✅ passed | 0.4s |
| 90 | TC-094 — Verify root lifecycle error handling: create rejected (405) → read missing (404) | ❌ failed | 0.4s |

_Generated by JBS IntelliQE. The full interactive Allure/Playwright reports are available from the IntelliQE Reports page._