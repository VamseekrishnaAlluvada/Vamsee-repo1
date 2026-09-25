import type { APIResponse } from '@playwright/test';
import { BaseApi, fill, fillHeaders, type Vars } from '../base.api';

/**
 * BookingApi — service object for the "booking-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class BookingApi extends BaseApi {
  /** POST https://restful-booker.herokuapp.com/booking */
  async verifyPOSTBookingReturns200AndAJSONBodyWhenA(vars: Vars = {}): Promise<APIResponse> {
    return this.send("POST", fill("https://restful-booker.herokuapp.com/booking", vars), {
      headers: fillHeaders({"Content-Type":"application/json","Accept":"application/json"}, vars),
      data: fill("{\"firstname\": \"{{firstname}}\", \"lastname\": \"Tester\", \"totalprice\": {{totalprice}}, \"depositpaid\": true, \"bookingdates\": {\"checkin\": \"2026-10-01\", \"checkout\": \"2026-10-05\"}, \"additionalneeds\": \"Breakfast\"}", vars),
    });
  }

  /** POST https://restful-booker.herokuapp.com/booking */
  async rejectPOSTBookingWithANon2xxStatusWhenThe(): Promise<APIResponse> {
    return this.send("POST", "https://restful-booker.herokuapp.com/booking", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"lastname\": \"Tester\", \"totalprice\": 150, \"depositpaid\": true, \"bookingdates\": {\"checkin\": \"2026-10-01\", \"checkout\": \"2026-10-05\"}, \"additionalneeds\": \"Breakfast\"}",
    });
  }

  /** POST https://restful-booker.herokuapp.com/booking */
  async rejectPOSTBookingWithA4xx5xxStatusWhenThe(): Promise<APIResponse> {
    return this.send("POST", "https://restful-booker.herokuapp.com/booking", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"firstname\": \"Jim\", \"lastname\": \"Tester\", \"totalprice\": 150,",
    });
  }

  /** POST https://restful-booker.herokuapp.com/booking */
  async rejectPOSTBookingWithANon2xxStatusWhen(): Promise<APIResponse> {
    return this.send("POST", "https://restful-booker.herokuapp.com/booking", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"firstname\": \"Jim\", \"lastname\": \"Tester\", \"totalprice\": \"not-a-number\", \"depositpaid\": true, \"bookingdates\": {\"checkin\": \"2026-10-01\", \"checkout\": \"2026-10-05\"}, \"additionalneeds\": \"Breakfast\"}",
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking/ */
  async verifyGETBookingReturns200WithANonEmptyJSON(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking/?firstname=Sally */
  async verifyGETBookingWithAFirstnameFilterReturns(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking/?firstname=Sally", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking/?bogusparam=xyz123 */
  async confirmGETBookingIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking/?bogusparam=xyz123", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://restful-booker.herokuapp.com/booking/ */
  async rejectDELETEAgainstTheBookingCollectionWithA(): Promise<APIResponse> {
    return this.send("DELETE", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking?lastname=Tester */
  async verifyGETBookingLastnameTesterReturns200With(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking?lastname=Tester", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking?lastname=ZzNoSuchLastname9999 */
  async verifyGETBookingWithAnUnmatchedLastname(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking?lastname=ZzNoSuchLastname9999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking?lastname=Tester&bogusparam=42 */
  async confirmGETBookingIgnoresAnUnknownQuery2(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking?lastname=Tester&bogusparam=42", {
      headers: {"Accept":"application/json"},
    });
  }

  /** DELETE https://restful-booker.herokuapp.com/booking */
  async rejectDELETEBookingCollectionWithANon2xx(): Promise<APIResponse> {
    return this.send("DELETE", "https://restful-booker.herokuapp.com/booking", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking?lastname=Tester%27%20OR%20%271%27%3D%271 */
  async ensureGETBookingWithASQLInjectionShaped(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking?lastname=Tester%27%20OR%20%271%27%3D%271", {
      headers: {"Accept":"application/json"},
    });
  }

  /** PUT https://restful-booker.herokuapp.com/booking/ */
  async verifyPUTBookingWithACompleteValidBooking(): Promise<APIResponse> {
    return this.send("PUT", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Content-Type":"application/json","Accept":"application/json","Cookie":"token="},
      data: "{\"firstname\":\"Updated\",\"lastname\":\"Tester\",\"totalprice\":500,\"depositpaid\":false,\"bookingdates\":{\"checkin\":\"2026-11-01\",\"checkout\":\"2026-11-03\"},\"additionalneeds\":\"Lunch\"}",
    });
  }

  /** PUT https://restful-booker.herokuapp.com/booking/ */
  async rejectPUTBookingWithA4xxWhenTheRequired(): Promise<APIResponse> {
    return this.send("PUT", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Content-Type":"application/json","Accept":"application/json","Cookie":"token="},
      data: "{\"lastname\":\"Tester\",\"totalprice\":500,\"depositpaid\":false,\"bookingdates\":{\"checkin\":\"2026-11-01\",\"checkout\":\"2026-11-03\"},\"additionalneeds\":\"Lunch\"}",
    });
  }

  /** PUT https://restful-booker.herokuapp.com/booking/ */
  async rejectPUTBookingWithA400WhenTheRequestBodyIs(): Promise<APIResponse> {
    return this.send("PUT", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Content-Type":"application/json","Accept":"application/json","Cookie":"token="},
      data: "{\"firstname\":\"Updated\",\"lastname\":\"Tester\",\"totalprice\":500,",
    });
  }

  /** PUT https://restful-booker.herokuapp.com/booking/99999999 */
  async return404ForPUTBooking99999999WhenUpdatingA(): Promise<APIResponse> {
    return this.send("PUT", "https://restful-booker.herokuapp.com/booking/99999999", {
      headers: {"Content-Type":"application/json","Accept":"application/json","Cookie":"token="},
      data: "{\"firstname\":\"Updated\",\"lastname\":\"Tester\",\"totalprice\":500,\"depositpaid\":false,\"bookingdates\":{\"checkin\":\"2026-11-01\",\"checkout\":\"2026-11-03\"},\"additionalneeds\":\"Lunch\"}",
    });
  }

  /** PUT https://restful-booker.herokuapp.com/booking/abc */
  async rejectPUTBookingAbcWithA4xxWhenANonNumeric(): Promise<APIResponse> {
    return this.send("PUT", "https://restful-booker.herokuapp.com/booking/abc", {
      headers: {"Content-Type":"application/json","Accept":"application/json","Cookie":"token="},
      data: "{\"firstname\":\"Updated\",\"lastname\":\"Tester\",\"totalprice\":500,\"depositpaid\":false,\"bookingdates\":{\"checkin\":\"2026-11-01\",\"checkout\":\"2026-11-03\"},\"additionalneeds\":\"Lunch\"}",
    });
  }

  /** PATCH https://restful-booker.herokuapp.com/booking/ */
  async verifyPATCHBookingWithAValidTotalprice(): Promise<APIResponse> {
    return this.send("PATCH", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"totalprice\": 999}",
    });
  }

  /** PATCH https://restful-booker.herokuapp.com/booking/99999999 */
  async rejectPATCHBooking99999999WithANon2xxStatus(): Promise<APIResponse> {
    return this.send("PATCH", "https://restful-booker.herokuapp.com/booking/99999999", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"totalprice\": 999}",
    });
  }

  /** PATCH https://restful-booker.herokuapp.com/booking/not-a-number */
  async rejectPATCHBookingNotANumberWithA4xxWhenThe(): Promise<APIResponse> {
    return this.send("PATCH", "https://restful-booker.herokuapp.com/booking/not-a-number", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"totalprice\": 999}",
    });
  }

  /** PATCH https://restful-booker.herokuapp.com/booking/ */
  async rejectPATCHBookingWithA4xxWhenTheRequestBody(): Promise<APIResponse> {
    return this.send("PATCH", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{}",
    });
  }

  /** PATCH https://restful-booker.herokuapp.com/booking/ */
  async rejectPATCHBookingWithA4xxWhenTheJSONBodyIs(): Promise<APIResponse> {
    return this.send("PATCH", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"totalprice\": 999",
    });
  }

  /** DELETE https://restful-booker.herokuapp.com/booking/1 */
  async verifyDELETEBooking1WithAValidTokenCookie(): Promise<APIResponse> {
    return this.send("DELETE", "https://restful-booker.herokuapp.com/booking/1", {
      headers: {"Cookie":"token=","Accept":"application/json"},
    });
  }

  /** DELETE https://restful-booker.herokuapp.com/booking/99999999 */
  async rejectDELETEBooking99999999ForANonExistent(): Promise<APIResponse> {
    return this.send("DELETE", "https://restful-booker.herokuapp.com/booking/99999999", {
      headers: {"Cookie":"token=","Accept":"application/json"},
    });
  }

  /** DELETE https://restful-booker.herokuapp.com/booking/not-a-number */
  async rejectDELETEBookingNotANumberWithA4xxWhenA(): Promise<APIResponse> {
    return this.send("DELETE", "https://restful-booker.herokuapp.com/booking/not-a-number", {
      headers: {"Cookie":"token=","Accept":"application/json"},
    });
  }
}
