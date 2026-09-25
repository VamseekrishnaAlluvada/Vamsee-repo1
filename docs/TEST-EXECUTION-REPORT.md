# Test Execution Report

- **Run ID**: `334C69F7-8DE1-48BF-A43E-52A840713785`
- **Generated**: 2026-09-25T13:29:43.588Z
- **Result**: 134/166 passed (81%) — 32 failed
- **Duration**: 16.9s

| # | Test | Status | Duration |
|---|------|--------|----------|
| 1 | TC-003 — Return 404 for GET /posts/99999999 when the requested post id does not exist | ✅ passed | 0.6s |
| 2 | TC-006 — Verify GET /posts/1 returns 200 with a non-empty JSON post object | ✅ passed | 0.7s |
| 3 | TC-001 — Verify GET /posts returns 200 with a non-empty JSON array of posts | ✅ passed | 0.6s |
| 4 | TC-004 — Reject GET /posts/abc with a 4xx when a non-numeric id is supplied where a number is required | ✅ passed | 1.3s |
| 5 | TC-007 — Confirm GET /posts/1 returns id as a number within a 5s response-time budget | ✅ passed | 0.6s |
| 6 | TC-008 — Return 404 for GET /posts/99999999 when the post id does not exist | ✅ passed | 0.6s |
| 7 | TC-005 — Confirm GET /posts ignores an unknown query parameter and still returns 200 with a JSON array | ✅ passed | 0.6s |
| 8 | TC-002 — Confirm the first element of GET /posts exposes a numeric id and string title | ✅ passed | 0.6s |
| 9 | TC-010 — Confirm GET /posts/1 ignores an unknown query parameter and still returns 200 | ✅ passed | 0.8s |
| 10 | TC-009 — Reject GET /posts/not-a-number with a 4xx when a non-numeric id is supplied | ✅ passed | 0.6s |
| 11 | TC-011 — Verify GET /comments?postId=1 returns 200 with a non-empty JSON array of comments | ✅ passed | 0.2s |
| 12 | TC-012 — Confirm GET /comments?postId=1 returns comments whose postId equals 1 and carry a numeric id | ✅ passed | 0.2s |
| 13 | TC-013 — Verify GET /comments?postId=99999999 returns 200 with an empty array for a postId that matches no comments | ✅ passed | 0.1s |
| 14 | TC-014 — Verify GET /comments?postId=abc handles a non-numeric postId cleanly without a 5xx error | ✅ passed | 0.1s |
| 15 | TC-015 — Confirm GET /comments?postId=1 ignores an unknown query parameter and still returns 200 | ✅ passed | 0.2s |
| 16 | TC-016 — Verify POST /posts creates a resource and returns 200 with a JSON body | ❌ failed | 0.9s |
| 17 | TC-017 — Confirm POST /posts returns a generated id property on the created resource | ❌ failed | 0.9s |
| 18 | TC-018 — Reject POST /posts with a 4xx when the required title field is missing | ❌ failed | 0.4s |
| 19 | TC-019 — Return 400 for POST /posts when the request body is malformed JSON | ❌ failed | 0.9s |
| 20 | TC-020 — Reject POST /posts with a 4xx when userId is a string instead of a number | ❌ failed | 0.4s |
| 21 | TC-021 — Verify PUT /posts/1 returns 200 with a JSON body when updating the post with the documented payload | ✅ passed | 0.4s |
| 22 | TC-022 — Confirm PUT /posts/1 echoes id as a number and title as a string after a successful update | ✅ passed | 0.5s |
| 23 | TC-023 — Reject PUT /posts/1 with a 4xx when the request body is syntactically malformed JSON | ❌ failed | 0.5s |
| 24 | TC-024 — Reject PUT /posts/1 with a 4xx when a non-numeric id path segment is used | ❌ failed | 0.6s |
| 25 | TC-027 — Confirm PATCH /posts/1 echoes id as a number and the updated title as a string | ✅ passed | 0.5s |
| 26 | TC-028 — Reject PATCH /posts/1 with 400 when the request body is malformed JSON | ✅ passed | 0.3s |
| 27 | TC-029 — Return 404 for PATCH /posts/99999999 when the target post does not exist | ✅ passed | 0.4s |
| 28 | TC-035 — Verify GET /posts/9999 returns 200 with a JSON content-type and a non-empty body | ❌ failed | 0.3s |
| 29 | TC-036 — Confirm GET /posts/9999 returns id as a number in the response object | ❌ failed | 0.1s |
| 30 | TC-037 — Return 404 for GET /posts/99999999 when the post id does not exist | ✅ passed | 0.1s |
| 31 | TC-039 — Confirm GET /posts/9999 ignores an unknown query parameter and still returns 200 | ❌ failed | 0.2s |
| 32 | TC-026 — Verify PATCH /posts/1 with a valid title returns 200 and a JSON body | ✅ passed | 0.9s |
| 33 | TC-025 — Return 404 for PUT /posts/99999999 when updating a post id that does not exist | ❌ failed | 1.4s |
| 34 | TC-030 — Reject PATCH /posts/not-a-number with a 4xx when the id is non-numeric | ✅ passed | 1.1s |
| 35 | TC-032 — Confirm DELETE /posts/1 returns a present JSON object body after deletion | ✅ passed | 1.3s |
| 36 | TC-033 — Return a non-2xx status for DELETE /posts/99999999 when the post id does not exist | ✅ passed | 0.9s |
| 37 | TC-031 — Verify DELETE /posts/1 returns 200 and a JSON content-type on the documented happy path | ✅ passed | 0.8s |
| 38 | TC-034 — Reject DELETE /posts/not-a-number with a 4xx when a non-numeric id is supplied | ❌ failed | 1.4s |
| 39 | TC-038 — Reject GET /posts/not-a-number with a 4xx when a non-numeric id is supplied | ✅ passed | 0.6s |
| 40 | TC-041 — Confirm GET /ping responds within 5000ms so the health-check is fast enough for monitoring | ✅ passed | 1.1s |
| 41 | TC-040 — Verify GET /ping returns 200 confirming the service health-check endpoint is up | ❌ failed | 1.1s |
| 42 | TC-042 — Confirm GET /ping returns a non-empty body indicating the service reported its status | ❌ failed | 1.0s |
| 43 | TC-043 — Confirm GET /ping ignores an unknown query parameter and still returns 200 rather than erroring | ❌ failed | 1.0s |
| 44 | TC-044 — Reject POST /ping with a 4xx/405 because the health-check endpoint only supports GET | ✅ passed | 0.9s |
| 45 | TC-045 — Verify POST /auth with valid admin credentials returns 200 and a token in the body | ✅ passed | 0.9s |
| 46 | TC-046 — Confirm POST /auth with an invalid password returns 200 and a 'Bad credentials' reason instead of a token | ✅ passed | 1.0s |
| 47 | TC-048 — Confirm POST /auth with the password field omitted does not issue a token and returns a 'Bad credentials' reason | ✅ passed | 0.9s |
| 48 | TC-049 — Reject a GET request against POST-only /auth with a 404 or 405 status | ✅ passed | 0.3s |
| 49 | TC-053 — Reject POST /booking with a 4xx/5xx status when the request body is syntactically malformed JSON | ✅ passed | 0.3s |
| 50 | TC-054 — Reject POST /booking with a non-2xx status when totalprice is sent as a string instead of a number | ✅ passed | 0.3s |
| 51 | TC-056 — Confirm each element of GET /booking exposes a numeric bookingid property | ✅ passed | 0.5s |
| 52 | TC-057 — Verify GET /booking with a firstname filter returns 200 with a JSON array | ✅ passed | 0.3s |
| 53 | TC-058 — Confirm GET /booking ignores an unknown query parameter and still returns 200 | ✅ passed | 0.5s |
| 54 | TC-059 — Reject DELETE against the /booking collection with a non-2xx status | ✅ passed | 0.3s |
| 55 | TC-047 — Reject POST /auth with a malformed JSON body by returning a 4xx client error | ✅ passed | 1.0s |
| 56 | TC-060 — Verify GET /booking?lastname=Tester returns 200 with a JSON array body | ✅ passed | 0.3s |
| 57 | TC-061 — Verify GET /booking with an unmatched lastname filter returns 200 and a JSON array | ✅ passed | 0.3s |
| 58 | TC-050 — Verify POST /booking returns 200 and a JSON body when a complete valid booking is submitted | ❌ failed | 0.1s |
| 59 | TC-051 — Confirm POST /booking response exposes a bookingid and the echoed booking object after a successful create | ❌ failed | 0.1s |
| 60 | TC-062 — Confirm GET /booking ignores an unknown query parameter and still returns 200 | ✅ passed | 0.3s |
| 61 | TC-052 — Reject POST /booking with a non-2xx status when the required firstname field is missing from the payload | ✅ passed | 1.0s |
| 62 | TC-064 — Ensure GET /booking with a SQL-injection-shaped lastname returns a clean non-5xx status without echoing the payload | ✅ passed | 0.3s |
| 63 | TC-066 — Reject PUT /booking/ with a 4xx when the required firstname field is missing from the payload | ✅ passed | 0.3s |
| 64 | TC-067 — Reject PUT /booking/ with a 400 when the request body is malformed JSON | ✅ passed | 0.3s |
| 65 | TC-068 — Return 404 for PUT /booking/99999999 when updating a booking id that does not exist | ✅ passed | 0.3s |
| 66 | TC-055 — Verify GET /booking returns 200 with a non-empty JSON array of booking ids | ✅ passed | 1.2s |
| 67 | TC-069 — Reject PUT /booking/abc with a 4xx when a non-numeric booking id is supplied in the path | ✅ passed | 0.3s |
| 68 | TC-070 — Verify PATCH /booking/ with a valid totalprice returns 200 and a JSON body | ❌ failed | 0.3s |
| 69 | TC-071 — Reject PATCH /booking/99999999 with a non-2xx status for a booking id that cannot exist | ✅ passed | 0.3s |
| 70 | TC-072 — Reject PATCH /booking/not-a-number with a 4xx when the booking id is non-numeric | ✅ passed | 0.3s |
| 71 | TC-073 — Reject PATCH /booking/ with a 4xx when the request body is empty | ✅ passed | 0.3s |
| 72 | TC-074 — Reject PATCH /booking/ with a 4xx when the JSON body is malformed | ✅ passed | 0.3s |
| 73 | TC-063 — Reject DELETE /booking (collection) with a non-2xx status since only GET and POST are supported | ✅ passed | 0.9s |
| 74 | TC-065 — Verify PUT /booking/ with a complete valid booking payload returns 200 and a JSON body | ❌ failed | 1.0s |
| 75 | TC-076 — Return 403 for DELETE /booking/1 when no auth token cookie is supplied | ✅ passed | 0.4s |
| 76 | TC-077 — Reject DELETE /booking/99999999 for a non-existent booking id with a 4xx (not 500) | ✅ passed | 0.3s |
| 77 | TC-078 — Reject DELETE /booking/not-a-number with a 4xx when a numeric id is required | ✅ passed | 0.4s |
| 78 | TC-079 — Verify POST /auth/login with valid credentials returns 200 and a JSON session body | ✅ passed | 0.8s |
| 79 | TC-080 — Reject POST /auth/login with 400 when the password is incorrect | ✅ passed | 0.9s |
| 80 | TC-081 — Reject POST /auth/login with 400 when the required password field is missing | ✅ passed | 0.5s |
| 81 | TC-082 — Reject POST /auth/login with 400 when the request body is malformed JSON | ✅ passed | 0.6s |
| 82 | TC-083 — Reject POST /auth/login with a client error when an empty JSON object is submitted | ✅ passed | 0.6s |
| 83 | TC-084 — Reject GET /auth/login with a 4xx/405 because the login endpoint only supports POST | ✅ passed | 0.5s |
| 84 | TC-075 — Verify DELETE /booking/1 with a valid token cookie returns 200 and removes the booking | ❌ failed | 1.0s |
| 85 | TC-085 — Verify GET /auth/me returns 200 with a JSON content-type on the documented request | ❌ failed | 0.5s |
| 86 | TC-086 — Confirm GET /auth/me returns a non-empty JSON body within 5000ms on the happy path | ❌ failed | 0.4s |
| 87 | TC-087 — Reject POST /auth/me with a 4xx because the me resource only supports GET | ✅ passed | 0.4s |
| 88 | TC-088 — Confirm GET /auth/me ignores an unknown query parameter and still returns 200 | ❌ failed | 1.3s |
| 89 | TC-089 — Confirm GET /auth/me/ with a trailing slash does not return a 500 server error | ✅ passed | 1.6s |
| 90 | TC-091 — Confirm GET /products list returns a non-empty products array with a numeric limit reflecting the paging request | ✅ passed | 0.4s |
| 91 | TC-092 — Reject GET /products with a 4xx when the limit parameter is non-numeric (limit=abc) | ✅ passed | 0.4s |
| 92 | TC-093 — Reject GET /products with a 4xx when limit is negative (limit=-5) | ✅ passed | 0.4s |
| 93 | TC-096 — Confirm GET /products/search?q=phone returns products as an array and pagination fields (total, skip, limit) as numbers | ✅ passed | 0.5s |
| 94 | TC-097 — Verify GET /products/search with a no-match query returns 200 and an empty products array | ✅ passed | 0.4s |
| 95 | TC-098 — Verify GET /products/search?q=phone&limit=5 honours the pagination boundary and returns 200 | ✅ passed | 0.5s |
| 96 | TC-099 — Verify GET /products/search?q=phone&limit=abc with a non-numeric limit does not return a 5xx server error | ✅ passed | 0.4s |
| 97 | TC-090 — Verify GET /products?limit=10&skip=10&select=title,price returns 200 with a JSON body | ✅ passed | 0.6s |
| 98 | TC-101 — Confirm POST /carts/add echoes userId as 1 and returns products as an array on the created cart | ❌ failed | 0.6s |
| 99 | TC-102 — Reject POST /carts/add with a 4xx when the required products field is missing from the body | ✅ passed | 0.4s |
| 100 | TC-103 — Return 400 for POST /carts/add when the request body is syntactically malformed JSON | ✅ passed | 0.4s |
| 101 | TC-104 — Reject POST /carts/add with a 4xx when userId is a string instead of the expected number | ✅ passed | 0.5s |
| 102 | TC-094 — Return 404 for GET /products/99999999 when the product id cannot exist | ✅ passed | 0.7s |
| 103 | TC-095 — Verify GET /products/search?q=phone returns 200 with a JSON body containing the products list | ✅ passed | 0.5s |
| 104 | TC-106 — Confirm GET /v1/forecast echoes latitude as a number and returns a current object holding requested variables | ✅ passed | 0.7s |
| 105 | TC-107 — Reject GET /v1/forecast with a 4xx when latitude is non-numeric (latitude=abc) | ✅ passed | 0.7s |
| 106 | TC-108 — Reject GET /v1/forecast with a 4xx when the required latitude parameter is omitted | ✅ passed | 0.7s |
| 107 | TC-109 — Confirm GET /v1/forecast still returns 200 when an unknown query parameter is supplied | ✅ passed | 0.8s |
| 108 | TC-111 — Confirm GET /v1/forecast returns latitude as a number and daily as an object for the requested coordinates | ✅ passed | 0.7s |
| 109 | TC-100 — Verify POST /carts/add returns 200 with a non-empty JSON body when a valid cart payload is submitted | ❌ failed | 0.7s |
| 110 | TC-112 — Reject GET /v1/forecast with 4xx when latitude is a non-numeric value | ✅ passed | 0.7s |
| 111 | TC-113 — Reject GET /v1/forecast with 400 when the required latitude parameter is missing | ✅ passed | 0.6s |
| 112 | TC-105 — Verify GET /v1/forecast for Mumbai returns 200 with a non-empty JSON forecast body | ✅ passed | 0.7s |
| 113 | TC-114 — Reject GET /v1/forecast with 4xx when latitude 200 is outside the valid -90..90 range | ✅ passed | 0.2s |
| 114 | TC-115 — Verify GET /simple/price with ids=bitcoin,ethereum and vs_currencies=usd,inr returns 200 with a JSON content-type | ✅ passed | 0.8s |
| 115 | TC-110 — Verify GET /v1/forecast returns 200 with a non-empty JSON body for the documented Bangalore daily query | ✅ passed | 0.7s |
| 116 | TC-116 — Confirm GET /simple/price returns bitcoin.usd and ethereum.inr as numeric price fields for the requested coins and currencies | ✅ passed | 0.7s |
| 117 | TC-117 — Reject GET /simple/price with a 4xx when the required vs_currencies parameter is omitted | ✅ passed | 0.4s |
| 118 | TC-118 — Reject GET /simple/price with a 4xx when the required ids parameter is omitted | ✅ passed | 0.4s |
| 119 | TC-119 — Confirm GET /simple/price returns 200 and ignores an unknown query parameter without erroring | ✅ passed | 0.4s |
| 120 | TC-121 — Verify GET /v3.1/name/india with fullText=true returns 200 and a non-empty JSON array of matching countries | ✅ passed | 0.9s |
| 121 | TC-122 — Confirm GET /v3.1/name/india returns each requested field with the correct type (name object, population number, region string) | ✅ passed | 0.9s |
| 122 | TC-123 — Return 404 for GET /v3.1/name with a non-existent country name so unknown resources are not matched | ✅ passed | 1.1s |
| 123 | TC-124 — Return 404 for GET /v3.1/name/india?fullText=true when a numeric path segment cannot match any country name | ✅ passed | 1.1s |
| 124 | TC-125 — Reject GET /v3.1/name/india with a 4xx when the fields query parameter lists an invalid field | ✅ passed | 0.9s |
| 125 | TC-126 — Verify GET /api/v2/pokemon/pikachu returns 200 with a non-empty JSON body | ✅ passed | 0.4s |
| 126 | TC-127 — Confirm GET /api/v2/pokemon/pikachu returns id as a number and name as the string pikachu | ✅ passed | 0.3s |
| 127 | TC-128 — Verify GET /api/v2/pokemon/pikachu responds within 5000ms on the happy path | ✅ passed | 0.4s |
| 128 | TC-129 — Return 404 for GET /api/v2/pokemon/99999999 when the pokemon id does not exist | ✅ passed | 0.4s |
| 129 | TC-120 — Reject POST /simple/price with a 4xx because only GET is supported on the price endpoint | ✅ passed | 0.2s |
| 130 | TC-130 — Return 404 for GET /api/v2/pokemon/not-a-real-pokemon when the name identifier is unknown | ✅ passed | 0.2s |
| 131 | TC-131 — Verify GET /v2/pet/findByStatus?status=available returns 200 with a JSON array body | ✅ passed | 1.0s |
| 132 | TC-132 — Confirm GET /v2/pet/findByStatus?status=available returns array elements shaped as pet objects | ✅ passed | 1.7s |
| 133 | TC-133 — Reject POST against /v2/pet/findByStatus with a 405 Method Not Allowed | ✅ passed | 1.7s |
| 134 | TC-134 — Confirm GET /v2/pet/findByStatus ignores an unknown query parameter and still returns 200 | ✅ passed | 1.7s |
| 135 | TC-136 — Verify POST /v2/pet creates a pet and returns 200 with a JSON body | ✅ passed | 1.2s |
| 136 | TC-135 — Verify GET /v2/pet/findByStatus with an invalid status value does not return a 5xx error | ✅ passed | 1.6s |
| 137 | TC-137 — Confirm POST /v2/pet echoes back the created pet with id as a number and name/status as strings | ✅ passed | 1.7s |
| 138 | TC-138 — Reject POST /v2/pet with a 4xx when the request body is syntactically malformed JSON | ❌ failed | 1.5s |
| 139 | TC-139 — Reject POST /v2/pet with a 4xx when the id field carries a string instead of a number | ✅ passed | 1.3s |
| 140 | TC-140 — Return 405 for GET against POST-only /v2/pet create endpoint | ✅ passed | 1.3s |
| 141 | TC-141 — Verify GET /v2/store/inventory returns 200 with a JSON content-type | ✅ passed | 0.4s |
| 142 | TC-142 — Confirm GET /v2/store/inventory returns a non-empty JSON object body | ✅ passed | 0.2s |
| 143 | TC-143 — Verify GET /v2/store/inventory responds within 5000 ms on the happy path | ✅ passed | 0.5s |
| 144 | TC-144 — Ignore an unknown query parameter on GET /v2/store/inventory and still return 200 | ✅ passed | 0.3s |
| 145 | TC-145 — Reject POST /v2/store/inventory with a 405 because only GET is supported | ✅ passed | 0.4s |
| 146 | TC-146 — Verify GET /headers returns 200 with a JSON content-type on the documented request | ✅ passed | 1.3s |
| 147 | TC-148 — Verify GET /headers responds within 5000ms on the happy path | ✅ passed | 1.3s |
| 148 | TC-147 — Confirm GET /headers echoes the X-QA-Team request header back in the response body | ✅ passed | 1.2s |
| 149 | TC-149 — Confirm GET /headers ignores an unknown query parameter and still returns 200 | ✅ passed | 1.2s |
| 150 | TC-152 — Confirm GET /basic-auth/qauser/qapass returns authenticated=true and user=qauser in the response body | ✅ passed | 1.1s |
| 151 | TC-150 — Reject POST /headers with 405 because the endpoint only supports GET | ✅ passed | 1.1s |
| 152 | TC-151 — Verify GET /basic-auth/qauser/qapass returns 200 with a non-empty JSON body when valid credentials are supplied | ❌ failed | 1.6s |
| 153 | TC-154 — Return 401 for GET /basic-auth/qauser/wrongpass when the supplied password does not match the protected credential | ✅ passed | 1.3s |
| 154 | TC-155 — Reject POST /basic-auth/qauser/qapass with a 4xx/405 because the endpoint only supports GET | ✅ passed | 1.2s |
| 155 | TC-153 — Return 401 for GET /basic-auth/qauser/qapass when no credentials are supplied | ✅ passed | 1.1s |
| 156 | TC-156 — Confirm GET /basic-auth/qauser/qapass ignores an unknown query parameter and still returns 200 | ❌ failed | 0.8s |
| 157 | TC-157 — Verify GET /status/500 returns 200 as the configured expected status code | ❌ failed | 0.8s |
| 158 | TC-161 — Verify GET /delay/2 returns 200 with a JSON content-type and a non-empty body | ✅ passed | 2.5s |
| 159 | TC-159 — Reject GET /status/99999999 with a non-2xx status for an unknown status code id | ✅ passed | 0.5s |
| 160 | TC-160 — Reject GET /status/abc with a 4xx when the status code id is non-numeric | ✅ passed | 0.6s |
| 161 | TC-158 — Confirm GET /status/500 returns a content-type header on the happy path | ❌ failed | 1.0s |
| 162 | TC-162 — Confirm GET /delay/2 returns the request url as a string and echoes the headers object | ✅ passed | 3.6s |
| 163 | TC-163 — Verify GET /delay/2 responds within 5000ms despite the built-in 2-second delay | ✅ passed | 3.3s |
| 164 | TC-165 — Confirm GET /delay/2 ignores an unknown query parameter and still returns 200 | ✅ passed | 3.4s |
| 165 | TC-166 — Verify the full posts lifecycle: create → read → update → verify → delete → confirm 404 | ❌ failed | 2.7s |
| 166 | TC-164 — Reject GET /delay/abc with a 404 when the delay segment is non-numeric | ❌ failed | 2.1s |

_Generated by JBS IntelliQE. The full interactive Allure/Playwright reports are available from the IntelliQE Reports page._