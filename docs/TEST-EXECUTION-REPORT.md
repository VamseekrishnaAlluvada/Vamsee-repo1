# Test Execution Report

- **Run ID**: `33FF5638-09AB-4892-9C32-92FDDCCCC4E3`
- **Generated**: 2026-09-23T18:19:30.449Z
- **Result**: 92/93 passed (99%) — 1 failed
- **Duration**: 9.6s

| # | Test | Status | Duration |
|---|------|--------|----------|
| 1 | TC-001 — Verify GET / on postman-echo returns 200 with a content-type header | ✅ passed | 1.8s |
| 2 | TC-004 — Return 404 for GET /99999999 when the resource id cannot exist | ✅ passed | 0.5s |
| 3 | TC-006 — Reject PUT / on postman-echo with a non-2xx status for an unsupported method | ✅ passed | 0.4s |
| 4 | TC-008 — Verify GET /?debug=true is safely ignored and still returns 200 | ✅ passed | 1.7s |
| 5 | TC-003 — Verify GET / on postman-echo responds within 5000ms on the happy path | ✅ passed | 1.6s |
| 6 | TC-009 — Verify GET / with multiple unknown query parameters still returns 200 | ✅ passed | 1.6s |
| 7 | TC-010 — Verify GET / with a custom unknown request header returns 200 and is unaffected | ✅ passed | 1.7s |
| 8 | TC-002 — Confirm GET / on postman-echo returns a non-empty response body | ✅ passed | 1.6s |
| 9 | TC-007 — Reject PATCH / on postman-echo with a non-2xx status for an unsupported method | ✅ passed | 0.5s |
| 10 | TC-005 — Return 404 for GET /nonexistent-resource-xyz on an unknown path segment | ✅ passed | 0.7s |
| 11 | TC-011 — Verify GET / with an injection-shaped query value returns no 5xx server error | ✅ passed | 3.5s |
| 12 | TC-012 — Confirm GET / on postman-echo exposes a content-type header on the happy path | ✅ passed | 1.5s |
| 13 | TC-013 — Verify GET / on postman-echo returns 200 with a content-type header on the happy path | ✅ passed | 1.6s |
| 14 | TC-014 — Confirm GET / returns a non-empty response body on the happy path | ✅ passed | 1.5s |
| 15 | TC-015 — Verify GET / responds within 5000ms on the happy path | ✅ passed | 1.5s |
| 16 | TC-016 — Confirm GET / with a trailing-path segment /index does not return a 500 server error | ✅ passed | 0.4s |
| 17 | TC-017 — Return a non-2xx status for GET /99999999 against a resource id that cannot exist | ✅ passed | 0.5s |
| 18 | TC-018 — Return a non-2xx status for GET /not-a-real-path with a malformed non-existent path | ✅ passed | 0.5s |
| 19 | TC-019 — Confirm GET / ignores an unknown query parameter and still returns 200 | ✅ passed | 1.4s |
| 20 | TC-020 — Confirm DELETE / against the root URL does not return a 500 server error | ✅ passed | 0.4s |
| 21 | TC-021 — Confirm GET / with Accept application/xml still returns a response below 500 | ✅ passed | 1.8s |
| 22 | TC-022 — Confirm GET / returns the same 200 status on two consecutive identical requests (idempotency) | ✅ passed | 1.7s |
| 23 | TC-023 — Confirm GET / with an injection-shaped query value returns a clean status below 500 | ✅ passed | 1.6s |
| 24 | TC-024 — Verify HEAD / against the root URL returns a 2xx status with no body error | ✅ passed | 1.6s |
| 25 | TC-025 — Verify GET https://postman-echo.com?foo=bar returns 200 with a content-type header on the happy path | ✅ passed | 1.6s |
| 26 | TC-026 — Confirm GET https://postman-echo.com?foo=bar returns a present, non-empty response body | ✅ passed | 1.7s |
| 27 | TC-027 — Ensure GET https://postman-echo.com?foo=bar responds within 5000ms on the happy path | ✅ passed | 1.6s |
| 28 | TC-028 — Return 404 for GET https://postman-echo.com/99999999 when the resource id cannot exist | ✅ passed | 0.7s |
| 29 | TC-029 — Reject GET https://postman-echo.com/not-a-number with a non-2xx status for a malformed id path | ✅ passed | 0.6s |
| 30 | TC-030 — Reject PUT https://postman-echo.com?foo=bar with a non-2xx status for an undocumented method on the root URL | ✅ passed | 0.4s |
| 31 | TC-031 — Reject PATCH https://postman-echo.com?foo=bar with a non-2xx status for an undocumented method on the root URL | ✅ passed | 0.3s |
| 32 | TC-032 — Confirm GET https://postman-echo.com?foo=bar&unknownParam=xyz ignores an unknown query parameter and still returns 200 | ✅ passed | 1.7s |
| 33 | TC-033 — Confirm GET https://postman-echo.com with no query parameters still returns 200 | ✅ passed | 2.0s |
| 34 | TC-034 — Ensure GET https://postman-echo.com?foo=%3Cscript%3E does not return a 500 for a script-shaped query value | ✅ passed | 1.8s |
| 35 | TC-035 — Verify HEAD https://postman-echo.com?foo=bar returns 200 for the documented sibling head operation | ✅ passed | 1.7s |
| 36 | TC-036 — Verify GET https://postman-echo.com/99999999 returns 404 for a non-existent path | ✅ passed | 1.7s |
| 37 | TC-037 — Confirm GET /99999999 404 response carries a content-type header | ✅ passed | 0.4s |
| 38 | TC-038 — Confirm GET /99999999 returns a non-2xx result and never a 5xx server error | ✅ passed | 0.4s |
| 39 | TC-039 — Verify GET /99999999 404 response returns within 5000ms | ✅ passed | 0.5s |
| 40 | TC-040 — Verify GET /99999999 returns a non-empty body describing the 404 error | ✅ passed | 0.4s |
| 41 | TC-041 — Verify GET /99999999 with a non-numeric id segment returns 404 | ✅ passed | 0.3s |
| 42 | TC-043 — Verify GET /99999999/ with a trailing slash does not return a 5xx error | ✅ passed | 0.4s |
| 43 | TC-042 — Confirm GET /99999999 ignores an unknown query parameter and still returns 404 | ✅ passed | 0.4s |
| 44 | TC-044 — Confirm POST to /99999999 against the read URL is rejected with a client error | ✅ passed | 0.4s |
| 45 | TC-045 — Confirm HEAD /99999999 mirrors the GET 404 without a body | ✅ passed | 0.4s |
| 46 | TC-046 — Confirm GET /99999999 with Accept application/xml still returns 404 without a 5xx | ✅ passed | 0.4s |
| 47 | TC-047 — Confirm GET /99999999 returns 404 identically on two consecutive requests (idempotency) | ✅ passed | 0.4s |
| 48 | TC-048 — Confirm GET /99999999 with a SQL-injection-shaped id returns a clean client error and does not echo the payload | ✅ passed | 0.6s |
| 49 | TC-049 — Verify GET /this-resource-does-not-exist returns exactly 404 for the documented request | ✅ passed | 0.6s |
| 50 | TC-051 — Confirm GET /this-resource-does-not-exist responds within 5000ms on the happy path | ✅ passed | 0.6s |
| 51 | TC-050 — Confirm GET /this-resource-does-not-exist returns a non-empty response body with the 404 | ✅ passed | 0.6s |
| 52 | TC-052 — Confirm GET /this-resource-does-not-exist sets a content-type header on the 404 response | ✅ passed | 0.6s |
| 53 | TC-053 — Return 404 for GET /this-resource-does-not-exist/99999999 when a non-existent sub-resource id is requested | ✅ passed | 0.4s |
| 54 | TC-054 — Return 404 for GET /this-resource-does-not-exist/abc when a non-numeric id segment is supplied | ✅ passed | 0.4s |
| 55 | TC-055 — Return a documented 4xx for POST /this-resource-does-not-exist when using an unsupported HTTP method | ✅ passed | 0.6s |
| 56 | TC-056 — Confirm GET /this-resource-does-not-exist?foo=bar still returns 404 when an unknown query parameter is supplied | ✅ passed | 0.4s |
| 57 | TC-057 — Confirm GET /this-resource-does-not-exist/ with a trailing slash does not return a 5xx | ✅ passed | 0.4s |
| 58 | TC-058 — Confirm GET /This-Resource-Does-Not-Exist with altered path casing does not return a 5xx | ✅ passed | 0.7s |
| 59 | TC-060 — Confirm GET /this-resource-does-not-exist does not reflect an injected script query value in the 404 body | ✅ passed | 0.8s |
| 60 | TC-059 — Confirm GET /this-resource-does-not-exist with Accept application/xml still returns 404 without a 5xx | ✅ passed | 0.4s |
| 61 | TC-061 — Confirm GET /this-resource-does-not-exist returns the same 404 status on two consecutive identical requests | ✅ passed | 0.3s |
| 62 | TC-062 — Verify POST / returns 405 Method Not Allowed on the root resource | ✅ passed | 0.7s |
| 63 | TC-063 — Confirm the 405 response for POST / carries a content-type header and a non-empty body | ✅ passed | 0.6s |
| 64 | TC-064 — Verify POST / responds within 5000ms while returning 405 | ✅ passed | 0.5s |
| 65 | TC-065 — Reject POST /99999999 for a non-existent id with a 4xx (404 or 405) | ✅ passed | 0.6s |
| 66 | TC-066 — Reject POST /not-a-number for a non-numeric id path with a 4xx | ✅ passed | 0.5s |
| 67 | TC-067 — Reject PUT / on the root resource with a 4xx as an unsupported method | ✅ passed | 0.6s |
| 68 | TC-068 — Reject PATCH / on the root resource with a 4xx as an unsupported method | ✅ passed | 0.6s |
| 69 | TC-069 — Confirm POST /?debug=true ignores an unknown query parameter and still returns 405 | ✅ passed | 0.5s |
| 70 | TC-070 — Confirm POST / with an empty JSON body {} is still rejected with 405 | ✅ passed | 0.3s |
| 71 | TC-071 — Confirm POST / with a malformed JSON body is rejected with a 4xx | ✅ passed | 0.4s |
| 72 | TC-073 — Verify POST / returns the same 405 status on two consecutive calls | ✅ passed | 0.4s |
| 73 | TC-072 — Confirm POST / with a SQL-injection-shaped query value returns a clean 405 without echoing the payload | ✅ passed | 0.4s |
| 74 | TC-074 — Verify DELETE / returns 405 Method Not Allowed on the root resource | ✅ passed | 0.4s |
| 75 | TC-075 — Confirm DELETE / responds with a content-type header on the 405 response | ✅ passed | 0.4s |
| 76 | TC-076 — Verify DELETE /99999999 for a non-existent id returns a non-2xx status | ✅ passed | 0.4s |
| 77 | TC-077 — Verify DELETE /not-a-number with a non-numeric id returns a non-2xx status | ✅ passed | 0.3s |
| 78 | TC-078 — Verify DELETE /?debug=true ignores an unknown query parameter and still returns 405 | ✅ passed | 0.3s |
| 79 | TC-079 — Verify DELETE / with a request body is rejected with 405 and the body is not honoured | ✅ passed | 0.4s |
| 80 | TC-080 — Confirm GET / on the same root resource returns 200 to prove only the delete verb is blocked | ✅ passed | 2.4s |
| 81 | TC-081 — Verify DELETE / with Accept application/xml still returns 405 without a 500 | ✅ passed | 0.3s |
| 82 | TC-083 — Verify DELETE /?id=1%27%20OR%20%271%27%3D%271 returns a clean 4xx and does not echo the injection payload | ✅ passed | 0.3s |
| 83 | TC-082 — Verify DELETE / issued twice is idempotent and returns 405 on both attempts | ✅ passed | 0.4s |
| 84 | TC-084 — Verify HEAD / returns 200 with response headers and no body | ✅ passed | 2.3s |
| 85 | TC-085 — Confirm HEAD / responds within 5000ms on the happy path | ✅ passed | 2.2s |
| 86 | TC-086 — Confirm HEAD / advertises a text/html content-type header | ✅ passed | 2.2s |
| 87 | TC-087 — Return 404 for HEAD /99999999 when the resource id cannot exist | ✅ passed | 0.4s |
| 88 | TC-088 — Reject HEAD /not-a-number with a 4xx for a non-numeric resource id | ✅ passed | 0.4s |
| 89 | TC-089 — Reject PATCH / against the root URL as an unsupported HTTP method | ✅ passed | 0.4s |
| 90 | TC-090 — Confirm HEAD /?foo=bar ignores an unknown query parameter and returns 200 | ✅ passed | 2.1s |
| 91 | TC-091 — Confirm HEAD / with Accept: application/xml still returns 200 | ✅ passed | 2.0s |
| 92 | TC-092 — Confirm HEAD with trailing-slash root path does not return 5xx | ✅ passed | 2.1s |
| 93 | TC-093 — Verify root lifecycle: POST base rejected (405) then GET missing id returns 404 | ❌ failed | 1.0s |

_Generated by JBS IntelliQE. The full interactive Allure/Playwright reports are available from the IntelliQE Reports page._