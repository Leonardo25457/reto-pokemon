export { STORAGE_KEYS } from "./storage/keys";
export { readJSON, writeJSON } from "./storage/jsonStorage";

export { normalizePokemonName, extractPokemonIdFromUrl } from "./pokemon/normalize";

export { historyService } from "./history/historyService";
export type { HistoryItem, LastVisited } from "./history/historyService";

export { EVENTS, emitVisited } from "./events/bus";
export type { VisitedDetail } from "./events/bus";

export { pokeApi, HttpError } from "./pokeapi/client";
export type {
  PokemonListResponse,
  PokemonResponse,
  TypeResponse,
  NamedAPIResource,
} from "./pokeapi/types";
