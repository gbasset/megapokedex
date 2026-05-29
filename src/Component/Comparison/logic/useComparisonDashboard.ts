import { useCallback, useEffect, useState } from 'react';
import {
  ComparisonDashboard,
  ComparisonService,
} from '../types/comparison.types';
import { buildComparisonDashboard } from '../utils/comparison-calculations';

export interface UseComparisonDashboardReturn {
  dashboard: ComparisonDashboard | null;
  isInitialLoad: boolean;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

interface UseComparisonDashboardParams {
  firstPokemonId: number | null;
  secondPokemonId: number | null;
  comparisonService: ComparisonService;
}

export function useComparisonDashboard({
  firstPokemonId,
  secondPokemonId,
  comparisonService,
}: UseComparisonDashboardParams): UseComparisonDashboardReturn {
  const [dashboard, setDashboard] = useState<ComparisonDashboard | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((currentKey) => currentKey + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!firstPokemonId || !secondPokemonId) {
      setDashboard(null);
      setIsInitialLoad(false);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setLoading(true);
    setError(null);

    Promise.all([
      comparisonService.getPokemon(firstPokemonId),
      comparisonService.getPokemon(secondPokemonId),
    ])
      .then(([firstPokemon, secondPokemon]) => Promise.all([
        comparisonService.getDamageProfile(firstPokemon),
        comparisonService.getDamageProfile(secondPokemon),
      ]).then(([firstDamageProfile, secondDamageProfile]) => ({
        firstPokemon,
        secondPokemon,
        firstDamageProfile,
        secondDamageProfile,
      })))
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setDashboard(buildComparisonDashboard(
          data.firstPokemon,
          data.secondPokemon,
          data.firstDamageProfile,
          data.secondDamageProfile,
        ));
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setError('Impossible de charger la comparaison pour le moment.');
        setDashboard(null);
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setLoading(false);
        setIsInitialLoad(false);
      });

    return () => {
      isMounted = false;
    };
  }, [comparisonService, firstPokemonId, reloadKey, secondPokemonId]);

  return {
    dashboard,
    isInitialLoad,
    loading,
    error,
    reload,
  };
}
