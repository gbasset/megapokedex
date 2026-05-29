/* eslint-disable no-inner-declarations */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import Box from '../UI/Box';
import { Button, ButtonLink } from '../UI/Button';
import {UseMainContext} from '../../context/MainContext.jsx';
import PokeLoader from '../UI/PokeLoader.js';
import { PokeType } from '../../../type-pokemons.js';
import { getNameInOtherLanguage } from '../../utils/transform.js';
import styles from './HomeContainer.module.css';

interface MainContextValue {
  isLoading: boolean;
  searchResults: PokeType[];
  homeScrollPositionRef: React.MutableRefObject<number>;
  pokemonsDetails: PokeType[];
  comparisonPokemonIds: number[];
  toggleComparisonPokemon: (pokemonId: number) => void;
  clearComparisonPokemons: () => void;
}

interface HomeContainerProps {
  isActive?: boolean;
}

export default function HomeContainer({ isActive = true }: HomeContainerProps) {
    const {				
    isLoading,
    searchResults,
    homeScrollPositionRef,
    pokemonsDetails,
    comparisonPokemonIds,
    toggleComparisonPokemon,
    clearComparisonPokemons
    } = UseMainContext() as MainContextValue;
    const [isListRendering, setIsListRendering] = useState(false);
    const hasRenderedListRef = useRef(false);

    useLayoutEffect(() => {
      if (!isActive || isLoading || searchResults.length === 0) {
        setIsListRendering(false);
        return;
      }

      if (hasRenderedListRef.current) {
        return;
      }

      setIsListRendering(true);
      const frameId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          hasRenderedListRef.current = true;
          setIsListRendering(false);
        });
      });

      return () => {
        cancelAnimationFrame(frameId);
      };
    }, [isActive, isLoading, searchResults.length]);

    const selectedPokemons = comparisonPokemonIds
      .map(id => pokemonsDetails.find((pokemon) => pokemon.id === id))
      .filter((pokemon): pokemon is PokeType => Boolean(pokemon));

    const comparisonUrl = comparisonPokemonIds.length === 2
      ? `/comparison?first=${comparisonPokemonIds[0]}&second=${comparisonPokemonIds[1]}`
      : '/comparison';

    useEffect(() => {
      if (!isActive || isLoading) {
        return;
      }

      const savedPosition = homeScrollPositionRef.current;
      if (savedPosition <= 0) {
        return;
      }

      requestAnimationFrame(() => {
        window.scrollTo({ top: savedPosition, behavior: 'instant' });
      });
    }, [isActive, isLoading, homeScrollPositionRef]);

    const showLoader = isActive && (isLoading || isListRendering);
  return (
    <>
      <div className={styles.compareTray} aria-live="polite">
        <div>
          <strong>Comparaison</strong>
          <span>
            {selectedPokemons.length > 0
              ? selectedPokemons.map((pokemon) => getNameInOtherLanguage(pokemon, 'fr') || pokemon.name).join(' vs ')
              : 'Sélectionne deux Pokémon'}
          </span>
        </div>
        <div className={styles.compareTrayActions}>
          {comparisonPokemonIds.length > 0 && (
            <Button variant="secondary" size="large" onClick={clearComparisonPokemons}>
              Réinitialiser
            </Button>
          )}
          <ButtonLink
            to={comparisonUrl}
            variant="primary"
            size="large"
            disabled={comparisonPokemonIds.length !== 2}
          >
            Comparer
          </ButtonLink>
        </div>
      </div>
      <div className={styles.pokedexContainer} >
        {showLoader && <PokeLoader />}
          {!showLoader && searchResults.map((pokemon:PokeType) => {
            const isSelected = comparisonPokemonIds.includes(pokemon.id);

            return (
              <Box key={pokemon.id} pokemon={pokemon}>
                <Button
                  variant={isSelected ? 'success' : 'ghost'}
                  shape="circle"
                  size="medium"
                  onClick={() => toggleComparisonPokemon(pokemon.id)}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? 'Retirer' : 'Ajouter'} ${getNameInOtherLanguage(pokemon, 'fr') || pokemon.name} de la comparaison`}
                >
                  {isSelected ? '✓' : 'Vs'}
                </Button>
              </Box>
            );
          })}
      </div>
    </>
  )
}
