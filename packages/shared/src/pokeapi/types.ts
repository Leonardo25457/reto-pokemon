export type NamedAPIResource = { name: string; url: string };

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
};

export type TypeResponse = {
  name: string;
  pokemon: { pokemon: NamedAPIResource; slot: number }[];
};

export type PokemonStat = { base_stat: number; effort: number; stat: NamedAPIResource };

export type PokemonType = { slot: number; type: NamedAPIResource };

export type PokemonSprites = {
  front_default?: string | null;
  other?: {
    dream_world?: { front_default?: string | null };
    ["official-artwork"]?: { front_default?: string | null };
  };
};

export type PokemonResponse = {
  id: number;
  name: string;
  types: PokemonType[];
  stats: PokemonStat[];
  sprites: PokemonSprites;
};
