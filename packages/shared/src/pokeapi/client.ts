import type { PokemonListResponse, PokemonResponse, TypeResponse } from "./types";

const BASE = "https://pokeapi.co/api/v2";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new HttpError(res.status, `HTTP ${res.status} - ${url}`);
  }
  return (await res.json()) as T;
}

export const pokeApi = {
  listPokemon(limit: number, offset: number) {
    return fetchJSON<PokemonListResponse>(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);
  },

  getPokemon(nameOrId: string | number) {
    return fetchJSON<PokemonResponse>(`${BASE}/pokemon/${nameOrId}`);
  },

  getType(typeName: string) {
    return fetchJSON<TypeResponse>(`${BASE}/type/${typeName}`);
  },
};
