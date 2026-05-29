import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigationContext } from '../context/NavigationContext';
import type { NavigationState } from '../types/navigation.types';
import { buildRouteNavigation } from '../utils/route-navigation';

export function useAppNavigation(): NavigationState {
  const location = useLocation();
  const { pageTitle, pageCategoryLabel } = useNavigationContext();

  const routeConfig = useMemo(
    () => buildRouteNavigation({
      pathname: location.pathname,
      pageTitle,
      pageCategoryLabel,
    }),
    [location.pathname, pageCategoryLabel, pageTitle],
  );

  const currentPokeId = useMemo(() => {
    const pokeRouteMatch = location.pathname.match(/^\/poke\/(\d+)$/);

    return pokeRouteMatch ? Number(pokeRouteMatch[1]) : null;
  }, [location.pathname]);

  return useMemo<NavigationState>(() => ({
    ...routeConfig,
    isHome: location.pathname === '/',
    currentPokeId,
  }), [currentPokeId, location.pathname, routeConfig]);
}
