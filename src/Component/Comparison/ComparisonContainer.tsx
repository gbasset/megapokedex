import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PokeType } from '../../../type-pokemons';
import { Button } from '../UI/Button';
import PokeLoader from '../UI/PokeLoader';
import { UseMainContext } from '../../context/MainContext';
import { fetchComparisonPokemon, fetchDamageProfile } from './api/comparisonApi';
import ComparisonView from './ComparisonView';
import { useComparisonDashboard } from './logic/useComparisonDashboard';
import PokemonSelector from './PokemonSelector';
import { ComparisonService } from './types/comparison.types';
import styles from './Comparison.module.css';

interface MainContextValue {
  pokemonsDetails: PokeType[];
  comparisonPokemonIds: number[];
  isLoading: boolean;
}

function parsePokemonId(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const pokemonId = Number(value);

  return Number.isInteger(pokemonId) && pokemonId > 0 ? pokemonId : null;
}

export default function ComparisonContainer() {
  const { pokemonsDetails, comparisonPokemonIds, isLoading } = UseMainContext() as MainContextValue;
  const [searchParams, setSearchParams] = useSearchParams();
  const fallbackFirstPokemonId = comparisonPokemonIds[0] ?? null;
  const fallbackSecondPokemonId = comparisonPokemonIds[1] ?? null;
  const firstPokemonId = parsePokemonId(searchParams.get('first')) ?? fallbackFirstPokemonId;
  const secondPokemonId = parsePokemonId(searchParams.get('second')) ?? fallbackSecondPokemonId;
  const comparisonService = useMemo<ComparisonService>(() => ({
    getPokemon: fetchComparisonPokemon,
    getDamageProfile: fetchDamageProfile,
  }), []);
  const { dashboard, isInitialLoad, loading, error, reload } = useComparisonDashboard({
    firstPokemonId,
    secondPokemonId,
    comparisonService,
  });

  const updatePokemonIds = useCallback((nextFirstPokemonId: number | null, nextSecondPokemonId: number | null) => {
    const nextParams = new URLSearchParams();

    if (nextFirstPokemonId) {
      nextParams.set('first', String(nextFirstPokemonId));
    }

    if (nextSecondPokemonId) {
      nextParams.set('second', String(nextSecondPokemonId));
    }

    setSearchParams(nextParams);
  }, [setSearchParams]);

  const handleChangeFirstPokemon = useCallback((pokemonId: number) => {
    updatePokemonIds(pokemonId, secondPokemonId);
  }, [secondPokemonId, updatePokemonIds]);

  const handleChangeSecondPokemon = useCallback((pokemonId: number) => {
    updatePokemonIds(firstPokemonId, pokemonId);
  }, [firstPokemonId, updatePokemonIds]);

  return (
    <main className={styles.comparisonPage}>
      <PokemonSelector
        pokemons={pokemonsDetails}
        firstPokemonId={firstPokemonId}
        secondPokemonId={secondPokemonId}
        onChangeFirstPokemon={handleChangeFirstPokemon}
        onChangeSecondPokemon={handleChangeSecondPokemon}
      />

      {(isLoading || (loading && isInitialLoad)) && <PokeLoader />}

      {error && (
        <div className={styles.errorCard} role="alert">
          <p>{error}</p>
          <Button variant="primary" onClick={reload}>Réessayer</Button>
        </div>
      )}

      {!firstPokemonId || !secondPokemonId ? (
        <div className={styles.emptyState}>
          Sélectionne deux Pokémon depuis l'accueil ou via les listes ci-dessus pour lancer l'analyse.
        </div>
      ) : null}

      {dashboard && <ComparisonView dashboard={dashboard} />}
    </main>
  );
}
