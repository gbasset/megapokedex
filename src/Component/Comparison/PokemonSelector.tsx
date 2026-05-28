import { useCallback, type ChangeEvent } from 'react';
import { PokeType } from '../../../type-pokemons';
import { getNameInOtherLanguage } from '../../utils/transform';
import styles from './Comparison.module.css';

interface PokemonSelectorProps {
  pokemons: PokeType[];
  firstPokemonId: number | null;
  secondPokemonId: number | null;
  onChangeFirstPokemon: (pokemonId: number) => void;
  onChangeSecondPokemon: (pokemonId: number) => void;
}

export default function PokemonSelector({
  pokemons,
  firstPokemonId,
  secondPokemonId,
  onChangeFirstPokemon,
  onChangeSecondPokemon,
}: PokemonSelectorProps) {
  const handleFirstChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    onChangeFirstPokemon(Number(event.target.value));
  }, [onChangeFirstPokemon]);

  const handleSecondChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    onChangeSecondPokemon(Number(event.target.value));
  }, [onChangeSecondPokemon]);

  return (
    <div className={styles.selectorCard}>
      <div className={styles.sectionTitleBlock}>
        <span>Dashboard analytique</span>
        <h1>Comparaison Pokémon</h1>
        <p>Choisis deux Pokémon pour comparer stats, types, talents, capacités et profil défensif.</p>
      </div>
      <div className={styles.selectors}>
        <label>
          Pokémon A
          <select value={firstPokemonId ?? ''} onChange={handleFirstChange}>
            <option value="" disabled>Choisir un Pokémon</option>
            {pokemons.map((pokemon) => (
              <option key={pokemon.id} value={pokemon.id}>
                #{pokemon.id.toString().padStart(3, '0')} {getNameInOtherLanguage(pokemon, 'fr') || pokemon.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Pokémon B
          <select value={secondPokemonId ?? ''} onChange={handleSecondChange}>
            <option value="" disabled>Choisir un Pokémon</option>
            {pokemons.map((pokemon) => (
              <option key={pokemon.id} value={pokemon.id}>
                #{pokemon.id.toString().padStart(3, '0')} {getNameInOtherLanguage(pokemon, 'fr') || pokemon.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
