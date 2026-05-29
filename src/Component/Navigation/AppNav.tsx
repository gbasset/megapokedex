import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { UseMainContext, type MainContextValue } from '../../context/MainContext.jsx';
import styles from './AppNav.module.css';

interface AppNavProps {
  activeSection: 'pokedex' | 'media';
  onNavigateHome?: () => void;
}

export default function AppNav({ activeSection, onNavigateHome }: AppNavProps) {
  const { setmainInformationPokemonSelected } = UseMainContext() as MainContextValue;

  const handlePokedexClick = useCallback(() => {
    setmainInformationPokemonSelected();
    onNavigateHome?.();
  }, [onNavigateHome, setmainInformationPokemonSelected]);

  return (
    <nav className={styles.appNav} aria-label="Sections principales">
      <div className={styles.segmented} role="tablist" aria-label="Navigation principale">
        <NavLink
          to="/"
          role="tab"
          aria-label="Pokedex"
          aria-current={activeSection === 'pokedex' ? 'page' : undefined}
          className={[
            styles.segment,
            activeSection === 'pokedex' ? styles.segmentActive : '',
          ].filter(Boolean).join(' ')}
          onClick={handlePokedexClick}
        >
          <svg
            className={styles.segmentIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span className={styles.segmentLabel}>Pokedex</span>
        </NavLink>
        <NavLink
          to="/poke-media"
          role="tab"
          aria-label="Poke Media"
          aria-current={activeSection === 'media' ? 'page' : undefined}
          className={[
            styles.segment,
            activeSection === 'media' ? styles.segmentActive : '',
          ].filter(Boolean).join(' ')}
        >
          <svg
            className={styles.segmentIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
            <line x1="7" y1="2" x2="7" y2="22" />
            <line x1="17" y1="2" x2="17" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7" x2="7" y2="7" />
            <line x1="2" y1="17" x2="7" y2="17" />
            <line x1="17" y1="17" x2="22" y2="17" />
            <line x1="17" y1="7" x2="22" y2="7" />
          </svg>
          <span className={styles.segmentLabel}>Media</span>
        </NavLink>
      </div>
    </nav>
  );
}
