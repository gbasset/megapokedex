import { useCallback, useEffect, useMemo, type CSSProperties } from 'react';
import styles from './Header.module.css';
import { Link, NavLink } from 'react-router-dom';
import { UseMainContext, type MainContextValue } from '../../context/MainContext.jsx';
import { colorByPokemonTypes } from '../../utils/apiAndDatabase';
import { ButtonLink } from '../UI/Button';
import AppNav from '../Navigation/AppNav';
import Breadcrumbs from '../Navigation/Breadcrumbs';
import { useAppNavigation } from '../Navigation/logic/useAppNavigation';

function buildComparisonUrl(firstPokemonId: number | null, comparisonPokemonIds: number[]): string {
  if (firstPokemonId) {
    const params = new URLSearchParams({ first: String(firstPokemonId) });
    const secondPokemonId = comparisonPokemonIds.find((id) => id !== firstPokemonId);

    if (secondPokemonId) {
      params.set('second', String(secondPokemonId));
    }

    return `/comparison?${params.toString()}`;
  }

  if (comparisonPokemonIds.length >= 2) {
    return `/comparison?first=${comparisonPokemonIds[0]}&second=${comparisonPokemonIds[1]}`;
  }

  if (comparisonPokemonIds.length === 1) {
    return `/comparison?first=${comparisonPokemonIds[0]}`;
  }

  return '/comparison';
}

function getPrimaryTypeName(pokemon: MainContextValue['mainInformationPokemonSelected']): string | undefined {
  const firstType = pokemon?.types[0];

  if (!firstType || typeof firstType !== 'object' || !('type' in firstType)) {
    return undefined;
  }

  const typeSlot = firstType as { type?: { name?: unknown } };

  return typeof typeSlot.type?.name === 'string' ? typeSlot.type.name : undefined;
}

export default function Header() {
  const {
    searchTerm,
    setSearchTerm,
    handleChange,
    mainInformationPokemonSelected,
    color,
    setcolor,
    setmainInformationPokemonSelected,
    comparisonPokemonIds,
    setComparisonFirstPokemon,
  } = UseMainContext() as MainContextValue;

  const navigation = useAppNavigation();
  const {
    isHome,
    section,
    depth,
    backTo,
    backLabel,
    breadcrumbs,
    showBreadcrumbs,
    currentPokeId,
  } = navigation;

  useEffect(() => {
    if (mainInformationPokemonSelected) {
      const primaryTypeName = getPrimaryTypeName(mainInformationPokemonSelected);
      const colorByPoke = colorByPokemonTypes.find((x) => x.type === primaryTypeName);
      if (colorByPoke) {
        setcolor(colorByPoke.color);
      } else {
        setcolor('#DBD8B7');
      }
    } else {
      setcolor('#DBD8B7');
    }
  }, [mainInformationPokemonSelected, setcolor]);

  const comparisonUrl = useMemo(
    () => buildComparisonUrl(currentPokeId, comparisonPokemonIds),
    [comparisonPokemonIds, currentPokeId],
  );

  const handleCompareClick = useCallback(() => {
    if (currentPokeId) {
      setComparisonFirstPokemon(currentPokeId);
    }
  }, [currentPokeId, setComparisonFirstPokemon]);

  const handleBackClick = useCallback(() => {
    setmainInformationPokemonSelected();
  }, [setmainInformationPokemonSelected]);

  const showCompareAction = currentPokeId !== null;

  return (
    <header
      className={styles.header_contour}
      style={{ '--poke-type-color': color } as CSSProperties}
    >
      <div className={`${styles.header_inner} ${!isHome ? styles.header_innerStacked : ''}`}>
        <div className={styles.header_topRow}>
          <div className={styles.header_left}>
            {isHome ? (
              <div className={styles.search_container}>
                <div className={styles.search_wrapper}>
                  <svg
                    className={styles.search_icon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Rechercher un Pokémon..."
                    value={searchTerm}
                    onChange={handleChange}
                    className={styles.search_input}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className={styles.clear_button}
                      onClick={() => setSearchTerm('')}
                      aria-label="Effacer la recherche"
                    >
                      <svg
                        className={styles.clear_icon}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.header_navGroup}>
                {backTo && (
                  <Link
                    className={styles.back_button}
                    onClick={handleBackClick}
                    to={backTo}
                    aria-label={backLabel ? `Retour à ${backLabel}` : 'Retour'}
                  >
                    <svg
                      className={styles.back_arrow_svg}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                  </Link>
                )}
                {showBreadcrumbs && depth > 0 && (
                  <div className={styles.header_breadcrumbsDesktop}>
                    <Breadcrumbs items={breadcrumbs} />
                  </div>
                )}
              </div>
            )}
          </div>

          {isHome && (
            <div className={styles.header_center}>
              <NavLink
                to="/"
                onClick={() => setmainInformationPokemonSelected()}
                className={styles.logo_link}
              >
                <h1 className={styles.header_title}>Poke Project</h1>
              </NavLink>
            </div>
          )}

          <div className={styles.header_right}>
            <div className={styles.header_actions}>
              <AppNav activeSection={section} />
              {showCompareAction && (
                <ButtonLink
                  to={comparisonUrl}
                  variant="primary"
                  size="medium"
                  onClick={handleCompareClick}
                  aria-label="Ouvrir l'outil de comparaison"
                >
                  Comparer
                </ButtonLink>
              )}
            </div>
          </div>
        </div>

        {!isHome && showBreadcrumbs && (
          <div className={styles.header_bottomRow}>
            <Breadcrumbs items={breadcrumbs} compact />
          </div>
        )}
      </div>
    </header>
  );
}
