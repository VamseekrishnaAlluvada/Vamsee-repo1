# Test Execution Report

- **Run ID**: `3933BE71-AA06-45AF-9D86-C94EAD414D68`
- **Generated**: 2026-09-24T16:07:31.856Z
- **Result**: 145/170 passed (85%) — 25 failed
- **Duration**: 17.5s

| # | Test | Status | Duration |
|---|------|--------|----------|
| 1 | TC-169 — Verify GET /posts returns 200 with a non-empty JSON array of posts | ✅ passed | 0.8s |
| 2 | TC-172 — Reject GET /posts/abc with a 4xx when a non-numeric id is supplied | ✅ passed | 0.5s |
| 3 | TC-175 — Return 404 for GET /posts/99999999 when the post id does not exist | ✅ passed | 0.5s |
| 4 | TC-171 — Return 404 for GET /posts/99999999 when the post id does not exist | ✅ passed | 0.4s |
| 5 | TC-176 — Reject GET /posts/not-a-number with a 4xx when the id is non-numeric | ✅ passed | 0.7s |
| 6 | TC-177 — Reject DELETE-less write via POST /posts/1 with a 4xx as the read path rejects unsupported methods | ✅ passed | 1.2s |
| 7 | TC-178 — Verify GET /comments?postId=1 returns 200 with a non-empty JSON array of comments | ✅ passed | 0.7s |
| 8 | TC-170 — Confirm GET /posts returns list items each exposing a numeric id field | ✅ passed | 0.6s |
| 9 | TC-174 — Confirm GET /posts/1 returns id as a number matching the requested path id 1 | ✅ passed | 0.5s |
| 10 | TC-173 — Verify GET /posts/1 returns 200 with a non-empty JSON post object | ✅ passed | 0.5s |
| 11 | TC-179 — Confirm GET /comments?postId=1 returns each element carrying a numeric id and string email | ✅ passed | 0.2s |
| 12 | TC-180 — Return an empty array with 200 for GET /comments?postId=99999999 when no comments match | ✅ passed | 0.2s |
| 13 | TC-181 — Ensure GET /comments?postId=abc with a non-numeric filter does not fault with 5xx | ✅ passed | 0.2s |
| 14 | TC-182 — Confirm GET /comments?postId=1&unknownParam=foo ignores an unknown query parameter and still returns 200 | ✅ passed | 0.2s |
| 15 | TC-183 — Verify POST /posts with the documented body returns 200 and a JSON content-type | ❌ failed | 0.5s |
| 16 | TC-185 — Reject POST /posts request that omits the required title field without a 500 server error | ✅ passed | 0.8s |
| 17 | TC-184 — Confirm POST /posts returns a body echoing the submitted userId as 1 and a generated id | ✅ passed | 0.9s |
| 18 | TC-186 — Reject POST /posts with a 4xx when the request body is syntactically malformed JSON | ❌ failed | 0.5s |
| 19 | TC-187 — Reject DELETE against POST-only collection URL /posts with a non-2xx status | ✅ passed | 0.4s |
| 20 | TC-188 — Verify PUT /posts/1 with the full documented body returns 200 and a JSON content-type | ✅ passed | 0.8s |
| 21 | TC-189 — Confirm PUT /posts/1 returns id as a number and title as a string in the updated resource | ✅ passed | 0.9s |
| 22 | TC-190 — Reject PUT /posts/1 with a 4xx when the body omits the required title field | ✅ passed | 0.9s |
| 23 | TC-191 — Reject PUT /posts/1 with a 4xx when the request body is malformed JSON | ❌ failed | 0.9s |
| 24 | TC-193 — Reject PUT /posts/not-a-number with a 4xx when the path id is non-numeric | ✅ passed | 0.9s |
| 25 | TC-194 — Verify PATCH /posts/1 returns 200 with a JSON body when updating the title field | ✅ passed | 0.5s |
| 26 | TC-196 — Reject PATCH /posts/1 with a 4xx when the request body is malformed JSON | ❌ failed | 0.5s |
| 27 | TC-197 — Verify PATCH /posts/99999999 for a non-existent post does not return a 5xx error | ✅ passed | 1.0s |
| 28 | TC-198 — Reject PATCH /posts/abc with a 4xx when a non-numeric id is supplied in the path | ✅ passed | 0.4s |
| 29 | TC-199 — Verify DELETE /posts/1 returns 200 confirming the post is deleted | ✅ passed | 0.9s |
| 30 | TC-200 — Confirm DELETE /posts/1 responds within 5000ms on the happy path | ✅ passed | 0.4s |
| 31 | TC-201 — Confirm DELETE /posts/99999999 does not return a 5xx for a non-existent post id | ✅ passed | 0.4s |
| 32 | TC-204 — Verify GET /posts/9999 returns 200 with a non-empty JSON post object | ❌ failed | 0.3s |
| 33 | TC-205 — Confirm GET /posts/9999 returns id as a number on the happy path | ❌ failed | 0.3s |
| 34 | TC-206 — Return 404 for GET /posts/99999999 when the post id cannot exist | ✅ passed | 0.2s |
| 35 | TC-207 — Reject GET /posts/not-a-number with a 4xx when a non-numeric id is supplied | ✅ passed | 0.2s |
| 36 | TC-209 — Confirm GET /ping responds under 5000ms on the happy path | ✅ passed | 1.1s |
| 37 | TC-211 — Reject POST /ping against the read-only health-check with a 4xx/405 error | ✅ passed | 1.0s |
| 38 | TC-212 — Return 404 for GET /ping/99999999 when an unknown sub-path is requested | ✅ passed | 1.1s |
| 39 | TC-213 — Verify POST /auth with valid admin credentials returns 200 and issues a token | ✅ passed | 1.1s |
| 40 | TC-192 — Return 404 for PUT /posts/99999999 targeting a post id that does not exist | ✅ passed | 1.2s |
| 41 | TC-195 — Confirm PATCH /posts/1 echoes id as a number and the patched title as a string | ✅ passed | 0.9s |
| 42 | TC-214 — Confirm POST /auth returns the issued token as a string in the 200 response body | ✅ passed | 0.3s |
| 43 | TC-215 — Reject POST /auth with a 4xx when the required password field is missing | ✅ passed | 0.3s |
| 44 | TC-202 — Reject DELETE /posts/not-a-number with a 4xx for a non-numeric id path | ✅ passed | 0.8s |
| 45 | TC-216 — Return 400 for POST /auth when the request body is malformed JSON | ✅ passed | 0.4s |
| 46 | TC-217 — Reject POST /auth with a 4xx when submitting invalid credentials | ✅ passed | 0.4s |
| 47 | TC-218 — Verify POST /booking creates a booking and returns 200 with a JSON body | ❌ failed | 0.1s |
| 48 | TC-219 — Confirm POST /booking returns a bookingid and a booking object echoing the submitted data | ❌ failed | 0.1s |
| 49 | TC-203 — Return a 4xx for an unsupported HTTP TRACE method against /posts/1 | ✅ passed | 0.4s |
| 50 | TC-221 — Reject POST /booking with a non-2xx status when the request body is malformed JSON | ❌ failed | 0.1s |
| 51 | TC-223 — Reject POST /booking with a non-2xx status when an empty JSON object is sent | ✅ passed | 0.4s |
| 52 | TC-224 — Verify GET /booking/ returns 200 with a non-empty JSON array of bookings | ✅ passed | 0.8s |
| 53 | TC-226 — Verify GET /booking/ responds within 5000ms on the happy path | ✅ passed | 1.6s |
| 54 | TC-210 — Confirm GET /ping ignores an unknown query parameter and still returns 200 without a 500 | ❌ failed | 1.4s |
| 55 | TC-208 — Verify GET /ping returns 200 confirming the service health-check endpoint is up | ❌ failed | 1.4s |
| 56 | TC-227 — Return 404 for GET /booking/99999999 when the booking id does not exist | ✅ passed | 1.2s |
| 57 | TC-228 — Confirm GET /booking/ ignores an unknown query parameter and still returns 200 | ✅ passed | 0.9s |
| 58 | TC-229 — Verify GET /booking/ filtered by firstname returns 200 with a JSON array | ✅ passed | 1.3s |
| 59 | TC-230 — Verify GET /booking?lastname=Tester returns 200 with a JSON array of bookings | ✅ passed | 0.4s |
| 60 | TC-231 — Confirm GET /booking?lastname=Tester responds within 5000ms on the happy path | ✅ passed | 0.5s |
| 61 | TC-232 — Verify GET /booking with a non-matching lastname filter returns 200 and an empty-capable JSON array | ✅ passed | 0.5s |
| 62 | TC-233 — Confirm GET /booking ignores an unknown query parameter and still returns 200 with a JSON array | ✅ passed | 0.4s |
| 63 | TC-236 — Return a 4xx for PUT /booking/99999999 when updating a booking id that does not exist | ✅ passed | 0.4s |
| 64 | TC-237 — Reject PUT /booking/abc with a 4xx when a non-numeric booking id is supplied in the path | ✅ passed | 0.4s |
| 65 | TC-238 — Reject PUT /booking/ with a 4xx when the required firstname field is missing from the payload | ✅ passed | 0.4s |
| 66 | TC-239 — Return 400 for PUT /booking/ when the request body is malformed JSON | ✅ passed | 0.4s |
| 67 | TC-240 — Reject PUT /booking/ with a 4xx when totalprice is sent as a string instead of a number | ✅ passed | 0.3s |
| 68 | TC-222 — Reject POST /booking with a non-2xx status when totalprice is a string instead of a number | ❌ failed | 0.2s |
| 69 | TC-220 — Reject POST /booking with a non-2xx status when the required firstname field is missing | ❌ failed | 0.2s |
| 70 | TC-241 — Verify PATCH /booking/ with a valid totalprice returns 200 and a JSON body | ❌ failed | 0.5s |
| 71 | TC-242 — Reject PATCH /booking/ with a 4xx when the request body is malformed JSON | ✅ passed | 0.4s |
| 72 | TC-225 — Confirm GET /booking/ returns each list item with a numeric bookingid field | ✅ passed | 1.7s |
| 73 | TC-244 — Return 404 for PATCH /booking/99999999 when the target booking id cannot exist | ✅ passed | 0.4s |
| 74 | TC-245 — Reject PATCH /booking/not-a-number with a 4xx when a non-numeric id is supplied | ✅ passed | 0.4s |
| 75 | TC-247 — Return 401/403 for DELETE /booking/ when no token credential is supplied | ✅ passed | 0.4s |
| 76 | TC-248 — Reject DELETE /booking/ with a malformed bogus token cookie by returning 401/403 | ✅ passed | 0.3s |
| 77 | TC-250 — Reject DELETE /booking/not-a-number with a 4xx when a non-numeric booking id is supplied | ✅ passed | 0.4s |
| 78 | TC-251 — Verify POST /auth/login with valid credentials returns 200 and a JSON body | ✅ passed | 0.9s |
| 79 | TC-252 — Confirm POST /auth/login echoes the authenticated username as 'emilys' on success | ✅ passed | 1.1s |
| 80 | TC-253 — Reject POST /auth/login with a 4xx when the password field is missing | ✅ passed | 1.4s |
| 81 | TC-254 — Reject POST /auth/login with 400 when the request body is malformed JSON | ✅ passed | 0.6s |
| 82 | TC-235 — Verify PUT /booking/ with a complete valid booking payload returns 200 with a JSON response body | ❌ failed | 1.1s |
| 83 | TC-234 — Reject PUT against the /booking list URL with a non-2xx status (405 or 404) | ✅ passed | 1.1s |
| 84 | TC-255 — Reject POST /auth/login with a 4xx when the password is incorrect | ✅ passed | 1.2s |
| 85 | TC-256 — Reject POST /auth/login with a 4xx when an empty JSON object is submitted | ✅ passed | 0.8s |
| 86 | TC-257 — Verify GET /auth/me returns 200 with a non-empty JSON body | ❌ failed | 0.6s |
| 87 | TC-258 — Confirm GET /auth/me returns the current user with id typed as a number | ❌ failed | 0.8s |
| 88 | TC-243 — Reject PATCH /booking/ with a 4xx when the request body is empty and carries no fields | ✅ passed | 1.1s |
| 89 | TC-246 — Verify DELETE /booking/ with a valid token cookie returns 200 confirming the booking is removed | ❌ failed | 1.2s |
| 90 | TC-249 — Return 404/405 for DELETE /booking/99999999 when the booking id does not exist | ✅ passed | 1.1s |
| 91 | TC-259 — Confirm GET /auth/me ignores an unknown query parameter and still returns 200 | ✅ passed | 0.4s |
| 92 | TC-260 — Reject POST /auth/me with a non-2xx status because only GET is supported | ✅ passed | 0.4s |
| 93 | TC-262 — Confirm GET /products honours select=title,price by returning title as a string and price as a number on the first item | ✅ passed | 0.6s |
| 94 | TC-264 — Verify GET /products with a non-numeric limit does not crash the server and stays below 500 | ✅ passed | 0.4s |
| 95 | TC-266 — Verify GET /products ignores an unknown query parameter and still returns 200 with a product list | ✅ passed | 0.5s |
| 96 | TC-267 — Verify GET /products/search?q=phone returns 200 with a JSON body containing the products list | ✅ passed | 0.5s |
| 97 | TC-268 — Confirm GET /products/search?q=phone returns products as an array and total as a number | ✅ passed | 1.3s |
| 98 | TC-270 — Confirm GET /products/search ignores an unknown query parameter and still returns 200 | ✅ passed | 0.5s |
| 99 | TC-271 — Reject POST /products/search with a non-2xx status because the search endpoint only supports GET | ✅ passed | 0.5s |
| 100 | TC-272 — Verify POST /carts/add returns 200 with a JSON cart body when a valid userId and products array are supplied | ❌ failed | 0.6s |
| 101 | TC-273 — Confirm POST /carts/add echoes userId 1 and returns a products array in the created cart | ❌ failed | 0.6s |
| 102 | TC-274 — Reject POST /carts/add with a 4xx when the required products field is missing from the body | ✅ passed | 0.8s |
| 103 | TC-275 — Return 400 for POST /carts/add when the request body is syntactically malformed JSON | ✅ passed | 0.5s |
| 104 | TC-276 — Reject POST /carts/add with a 4xx when userId is sent as a string instead of a number | ✅ passed | 0.5s |
| 105 | TC-261 — Verify GET /products with limit=10&skip=10&select=title,price returns 200 with a JSON body | ✅ passed | 1.8s |
| 106 | TC-263 — Confirm GET /products echoes the requested limit=10 and skip=10 pagination values in the response envelope | ✅ passed | 1.4s |
| 107 | TC-279 — Reject GET /v1/forecast with 400 when latitude is a non-numeric value | ✅ passed | 0.8s |
| 108 | TC-280 — Reject GET /v1/forecast with 400 when the required latitude parameter is omitted | ✅ passed | 0.7s |
| 109 | TC-281 — Confirm GET /v1/forecast ignores an unknown query parameter and still returns 200 | ✅ passed | 0.7s |
| 110 | TC-282 — Verify GET /v1/forecast returns 200 with a non-empty JSON forecast body for Bangalore coordinates | ✅ passed | 0.7s |
| 111 | TC-265 — Reject POST /products against the list URL with a non-2xx status since only GET is supported for listing | ✅ passed | 0.7s |
| 112 | TC-269 — Verify GET /products/search with a no-match query returns 200 and an empty products array | ✅ passed | 0.7s |
| 113 | TC-283 — Confirm GET /v1/forecast echoes latitude/longitude as numbers and returns a daily object in the response | ✅ passed | 0.3s |
| 114 | TC-284 — Reject GET /v1/forecast with 4xx when latitude is out of the valid -90..90 range | ✅ passed | 0.2s |
| 115 | TC-285 — Reject GET /v1/forecast with 400 when the required latitude parameter is missing | ✅ passed | 0.2s |
| 116 | TC-286 — Reject GET /v1/forecast with 4xx when latitude is a non-numeric value | ✅ passed | 0.7s |
| 117 | TC-287 — Confirm GET /v1/forecast ignores an unknown query parameter and still returns 200 | ✅ passed | 0.3s |
| 118 | TC-288 — Verify GET /simple/price for bitcoin,ethereum in usd,inr returns 200 with a JSON body | ✅ passed | 0.6s |
| 119 | TC-289 — Confirm GET /simple/price returns bitcoin.usd and ethereum.inr as numeric quote values | ✅ passed | 0.6s |
| 120 | TC-290 — Verify GET /simple/price happy path responds within 5000 ms | ✅ passed | 0.6s |
| 121 | TC-291 — Reject GET /simple/price with 4xx when the required vs_currencies parameter is missing | ✅ passed | 0.5s |
| 122 | TC-292 — Reject POST /simple/price with 4xx/405 since only GET is supported on the price endpoint | ✅ passed | 0.4s |
| 123 | TC-277 — Verify GET /v1/forecast returns 200 with a non-empty JSON body for the Mumbai coordinates | ✅ passed | 0.8s |
| 124 | TC-278 — Confirm GET /v1/forecast echoes numeric latitude/longitude and returns the requested current block | ✅ passed | 0.7s |
| 125 | TC-293 — Verify GET /v3.1/name/india?fullText=true returns 200 with a non-empty country array | ✅ passed | 1.2s |
| 126 | TC-294 — Confirm GET /v3.1/name/india returns the requested fields with name as object, population as number and region as string | ✅ passed | 1.0s |
| 127 | TC-295 — Return 404 for GET /v3.1/name/zzzznotacountry when the country name cannot be matched | ✅ passed | 1.0s |
| 128 | TC-296 — Return 404 for GET /v3.1/name/india?fullText=true when the full-text flag excludes the partial match set | ✅ passed | 1.3s |
| 129 | TC-297 — Confirm GET /v3.1/name/india ignores an unknown query parameter and still returns 200 | ✅ passed | 1.1s |
| 130 | TC-298 — Verify GET /api/v2/pokemon/pikachu returns 200 with a non-empty JSON body | ✅ passed | 0.5s |
| 131 | TC-299 — Confirm GET /api/v2/pokemon/pikachu returns id as a number and name equal to "pikachu" | ✅ passed | 0.5s |
| 132 | TC-300 — Return 404 for GET /api/v2/pokemon/99999999 when the numeric id does not exist | ✅ passed | 0.4s |
| 133 | TC-301 — Return 404 for GET /api/v2/pokemon/not-a-real-pokemon when the identifier is unrecognised | ✅ passed | 0.3s |
| 134 | TC-302 — Verify GET /v2/pet/findByStatus?status=available returns 200 with a non-empty JSON array | ✅ passed | 1.0s |
| 135 | TC-303 — Confirm GET /v2/pet/findByStatus?status=available returns pet objects whose status field equals 'available' | ✅ passed | 1.0s |
| 136 | TC-304 — Reject GET /v2/pet/findByStatus with 400 when the status value is invalid | ✅ passed | 1.0s |
| 137 | TC-305 — Reject GET /v2/pet/findByStatus with 400 when the required status query parameter is omitted | ✅ passed | 1.0s |
| 138 | TC-306 — Confirm GET /v2/pet/findByStatus?status=available ignores an unknown query parameter and still returns 200 | ✅ passed | 1.0s |
| 139 | TC-307 — Reject POST /v2/pet/findByStatus?status=available with 405 because only GET is allowed | ✅ passed | 1.0s |
| 140 | TC-308 — Verify POST /v2/pet creates a pet and returns 200 with a JSON body | ✅ passed | 1.0s |
| 141 | TC-309 — Confirm POST /v2/pet echoes id as a number and name and status as strings matching the request | ✅ passed | 1.0s |
| 142 | TC-310 — Reject POST /v2/pet with 400 when the request body is malformed JSON | ❌ failed | 1.0s |
| 143 | TC-311 — Reject POST /v2/pet with a 4xx when the id field is a string instead of a number | ✅ passed | 0.9s |
| 144 | TC-312 — Reject GET /v2/pet with 405 because the create endpoint only accepts POST | ✅ passed | 0.3s |
| 145 | TC-313 — Verify GET /v2/store/inventory returns 200 with a JSON inventory object | ✅ passed | 0.3s |
| 146 | TC-314 — Confirm GET /v2/store/inventory returns 200 within 5000ms on the happy path | ✅ passed | 0.3s |
| 147 | TC-315 — Confirm GET /v2/store/inventory ignores an unknown query parameter and still returns 200 | ✅ passed | 0.3s |
| 148 | TC-316 — Reject POST /v2/store/inventory with a 4xx/405 since the endpoint only supports GET | ✅ passed | 0.3s |
| 149 | TC-317 — Confirm GET /v2/store/inventory returns identical 200 status on two consecutive calls (idempotency) | ✅ passed | 0.3s |
| 150 | TC-318 — Verify GET /headers returns 200 with a JSON content-type on the documented request | ✅ passed | 1.0s |
| 151 | TC-319 — Confirm GET /headers returns the headers property as a JSON object echoing the request headers | ✅ passed | 1.0s |
| 152 | TC-320 — Verify GET /headers responds within 5000ms on the happy path | ✅ passed | 0.9s |
| 153 | TC-321 — Reject POST /headers with 405 because only GET is supported on the headers resource | ✅ passed | 1.0s |
| 154 | TC-322 — Verify GET /headers ignores an unknown query parameter and still returns 200 | ✅ passed | 1.0s |
| 155 | TC-323 — Verify GET /basic-auth/qauser/qapass returns 200 with a JSON body when valid credentials are supplied | ✅ passed | 1.0s |
| 156 | TC-324 — Confirm GET /basic-auth/qauser/qapass returns authenticated as a boolean and user as a string on success | ✅ passed | 1.1s |
| 157 | TC-325 — Return 401 for GET /basic-auth/qauser/qapass when no credentials are supplied | ✅ passed | 1.0s |
| 158 | TC-327 — Reject POST /basic-auth/qauser/qapass with a 4xx/405 since only GET is supported on this resource | ✅ passed | 1.0s |
| 159 | TC-328 — Verify GET /status/500 returns the configured 200 status on the documented request | ❌ failed | 0.5s |
| 160 | TC-329 — Confirm GET /status/500 responds successfully and includes a content-type header on the happy path | ❌ failed | 0.5s |
| 161 | TC-330 — Reject GET /status/abc with a 4xx when a non-numeric status id is supplied | ✅ passed | 0.4s |
| 162 | TC-331 — Return a non-2xx for GET /status/99999999 when an out-of-range status id cannot resolve | ✅ passed | 0.3s |
| 163 | TC-332 — Verify GET https://httpbin.org/delay/2 returns 200 with a JSON body after the delay | ✅ passed | 2.3s |
| 164 | TC-333 — Confirm GET https://httpbin.org/delay/2 returns the echoed url as a string and a headers object | ✅ passed | 2.3s |
| 165 | TC-334 — Verify GET https://httpbin.org/delay/2 completes under 8000ms as a response-time guard | ✅ passed | 2.3s |
| 166 | TC-335 — Confirm GET https://httpbin.org/delay/2 ignores an unknown query parameter and still returns 200 | ✅ passed | 2.3s |
| 167 | TC-326 — Return 401 for GET /basic-auth/qauser/wrongpass when the password segment does not match the required credential | ✅ passed | 1.1s |
| 168 | TC-336 — Reject POST https://httpbin.org/delay/2 with a 405 when using the wrong HTTP method | ✅ passed | 2.3s |
| 169 | TC-337 — Reject GET https://httpbin.org/delay/abc with a 4xx when the delay value is non-numeric | ❌ failed | 0.4s |
| 170 | TC-338 — Verify the full posts lifecycle: create → read → update → verify → delete → confirm gone | ❌ failed | 0.7s |

_Generated by JBS IntelliQE. The full interactive Allure/Playwright reports are available from the IntelliQE Reports page._