import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * PokemonApi — service object for the "pokemon-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class PokemonApi extends BaseApi {
  /** GET https://pokeapi.co/api/v2/pokemon/pikachu */
  async verifyGETApiV2PokemonPikachuReturns200WithA(): Promise<APIResponse> {
    return this.send("GET", "https://pokeapi.co/api/v2/pokemon/pikachu", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://pokeapi.co/api/v2/pokemon/99999999 */
  async return404ForGETApiV2Pokemon99999999WhenThe(): Promise<APIResponse> {
    return this.send("GET", "https://pokeapi.co/api/v2/pokemon/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://pokeapi.co/api/v2/pokemon/not-a-real-pokemon */
  async return404ForGETApiV2PokemonNotARealPokemon(): Promise<APIResponse> {
    return this.send("GET", "https://pokeapi.co/api/v2/pokemon/not-a-real-pokemon", {
      headers: {"Accept":"application/json"},
    });
  }
}
