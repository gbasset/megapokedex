const DEFAULT_POKEMON_QUERY = 'pokemon';

export function buildPokemonMediaQuery(searchTerm: string): string {
  const normalizedTerm = searchTerm.trim().replace(/\s+/g, ' ');

  return normalizedTerm.length > 0
    ? `${DEFAULT_POKEMON_QUERY} ${normalizedTerm}`
    : DEFAULT_POKEMON_QUERY;
}
