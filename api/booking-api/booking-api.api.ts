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
  async verifyPOSTBookingCreatesABookingAndReturns(vars: Vars = {}): Promise<APIResponse> {
    return this.send("POST", fill("https://restful-booker.herokuapp.com/booking", vars), {
      headers: fillHeaders({"Content-Type":"application/json","Accept":"application/json"}, vars),
      data: fill("{\"firstname\":\"{{firstname}}\",\"lastname\":\"Tester\",\"totalprice\":{{totalprice}},\"depositpaid\":true,\"bookingdates\":{\"checkin\":\"2026-10-01\",\"checkout\":\"2026-10-05\"},\"additionalneeds\":\"Breakfast\"}", vars),
    });
  }

  /** POST https://restful-booker.herokuapp.com/booking */
  async rejectPOSTBookingWithANon2xxStatusWhenThe(vars: Vars = {}): Promise<APIResponse> {
    return this.send("POST", fill("https://restful-booker.herokuapp.com/booking", vars), {
      headers: fillHeaders({"Content-Type":"application/json","Accept":"application/json"}, vars),
      data: fill("{\"lastname\":\"Tester\",\"totalprice\":{{totalprice}},\"depositpaid\":true,\"bookingdates\":{\"checkin\":\"2026-10-01\",\"checkout\":\"2026-10-05\"},\"additionalneeds\":\"Breakfast\"}", vars),
    });
  }

  /** POST https://restful-booker.herokuapp.com/booking */
  async rejectPOSTBookingWithANon2xxStatusWhenThe2(vars: Vars = {}): Promise<APIResponse> {
    return this.send("POST", fill("https://restful-booker.herokuapp.com/booking", vars), {
      headers: fillHeaders({"Content-Type":"application/json","Accept":"application/json"}, vars),
      data: fill("{\"firstname\":\"{{firstname}}\",\"lastname\":\"Tester\",\"totalprice\":,}", vars),
    });
  }

  /** POST https://restful-booker.herokuapp.com/booking */
  async rejectPOSTBookingWithANon2xxStatusWhen(vars: Vars = {}): Promise<APIResponse> {
    return this.send("POST", fill("https://restful-booker.herokuapp.com/booking", vars), {
      headers: fillHeaders({"Content-Type":"application/json","Accept":"application/json"}, vars),
      data: fill("{\"firstname\":\"{{firstname}}\",\"lastname\":\"Tester\",\"totalprice\":\"not-a-number\",\"depositpaid\":true,\"bookingdates\":{\"checkin\":\"2026-10-01\",\"checkout\":\"2026-10-05\"},\"additionalneeds\":\"Breakfast\"}", vars),
    });
  }

  /** POST https://restful-booker.herokuapp.com/booking */
  async rejectPOSTBookingWithANon2xxStatusWhenAn(): Promise<APIResponse> {
    return this.send("POST", "https://restful-booker.herokuapp.com/booking", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{}",
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking/ */
  async verifyGETBookingReturns200WithANonEmptyJSON(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking/99999999 */
  async return404ForGETBooking99999999WhenTheBooking(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking/?bogusparam=abc123 */
  async confirmGETBookingIgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking/?bogusparam=abc123", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking/?firstname=John */
  async verifyGETBookingFilteredByFirstnameReturns(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking/?firstname=John", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking?lastname=Tester */
  async verifyGETBookingLastnameTesterReturns200With(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking?lastname=Tester", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking?lastname=NoSuchPersonXYZ99999 */
  async verifyGETBookingWithANonMatchingLastname(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking?lastname=NoSuchPersonXYZ99999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://restful-booker.herokuapp.com/booking?lastname=Tester&bogusParam=abc123 */
  async confirmGETBookingIgnoresAnUnknownQuery2(): Promise<APIResponse> {
    return this.send("GET", "https://restful-booker.herokuapp.com/booking?lastname=Tester&bogusParam=abc123", {
      headers: {"Accept":"application/json"},
    });
  }

  /** PUT https://restful-booker.herokuapp.com/booking?lastname=Tester */
  async rejectPUTAgainstTheBookingListURLWithANon2xx(): Promise<APIResponse> {
    return this.send("PUT", "https://restful-booker.herokuapp.com/booking?lastname=Tester", {
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

  /** PUT https://restful-booker.herokuapp.com/booking/99999999 */
  async returnA4xxForPUTBooking99999999WhenUpdatingA(): Promise<APIResponse> {
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

  /** PUT https://restful-booker.herokuapp.com/booking/ */
  async rejectPUTBookingWithA4xxWhenTheRequired(): Promise<APIResponse> {
    return this.send("PUT", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Content-Type":"application/json","Accept":"application/json","Cookie":"token="},
      data: "{\"lastname\":\"Tester\",\"totalprice\":500,\"depositpaid\":false,\"bookingdates\":{\"checkin\":\"2026-11-01\",\"checkout\":\"2026-11-03\"},\"additionalneeds\":\"Lunch\"}",
    });
  }

  /** PUT https://restful-booker.herokuapp.com/booking/ */
  async return400ForPUTBookingWhenTheRequestBodyIs(): Promise<APIResponse> {
    return this.send("PUT", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Content-Type":"application/json","Accept":"application/json","Cookie":"token="},
      data: "{\"firstname\":\"Updated\",\"lastname\":\"Tester\",",
    });
  }

  /** PUT https://restful-booker.herokuapp.com/booking/ */
  async rejectPUTBookingWithA4xxWhenTotalpriceIsSent(): Promise<APIResponse> {
    return this.send("PUT", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Content-Type":"application/json","Accept":"application/json","Cookie":"token="},
      data: "{\"firstname\":\"Updated\",\"lastname\":\"Tester\",\"totalprice\":\"five hundred\",\"depositpaid\":false,\"bookingdates\":{\"checkin\":\"2026-11-01\",\"checkout\":\"2026-11-03\"},\"additionalneeds\":\"Lunch\"}",
    });
  }

  /** PATCH https://restful-booker.herokuapp.com/booking/ */
  async verifyPATCHBookingWithAValidTotalprice(): Promise<APIResponse> {
    return this.send("PATCH", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"totalprice\": 999}",
    });
  }

  /** PATCH https://restful-booker.herokuapp.com/booking/ */
  async rejectPATCHBookingWithA4xxWhenTheRequestBody(): Promise<APIResponse> {
    return this.send("PATCH", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"totalprice\": 999",
    });
  }

  /** PATCH https://restful-booker.herokuapp.com/booking/ */
  async rejectPATCHBookingWithA4xxWhenTheRequestBody2(): Promise<APIResponse> {
    return this.send("PATCH", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{}",
    });
  }

  /** PATCH https://restful-booker.herokuapp.com/booking/99999999 */
  async return404ForPATCHBooking99999999WhenThe(): Promise<APIResponse> {
    return this.send("PATCH", "https://restful-booker.herokuapp.com/booking/99999999", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"totalprice\": 999}",
    });
  }

  /** PATCH https://restful-booker.herokuapp.com/booking/not-a-number */
  async rejectPATCHBookingNotANumberWithA4xxWhenANon(): Promise<APIResponse> {
    return this.send("PATCH", "https://restful-booker.herokuapp.com/booking/not-a-number", {
      headers: {"Content-Type":"application/json","Accept":"application/json"},
      data: "{\"totalprice\": 999}",
    });
  }

  /** DELETE https://restful-booker.herokuapp.com/booking/ */
  async verifyDELETEBookingWithAValidTokenCookie(): Promise<APIResponse> {
    return this.send("DELETE", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Cookie":"token=","Accept":"application/json"},
    });
  }

  /** DELETE https://restful-booker.herokuapp.com/booking/ */
  async rejectDELETEBookingWithAMalformedBogusToken(): Promise<APIResponse> {
    return this.send("DELETE", "https://restful-booker.herokuapp.com/booking/", {
      headers: {"Cookie":"token=invalid-token-000","Accept":"application/json"},
    });
  }

  /** DELETE https://restful-booker.herokuapp.com/booking/99999999 */
  async return404405ForDELETEBooking99999999WhenThe(): Promise<APIResponse> {
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
