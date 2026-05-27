import React, { useEffect } from 'react';
import styles from './Header.module.css';
import { NavLink, useLocation } from "react-router-dom";
import { UseMainContext } from '../../context/MainContext.jsx';
import { colorByPokemonTypes } from '../../utils/apiAndDatabase';

export default function Header() {
  const location = useLocation();
  const {
    searchTerm,
    setSearchTerm,
    handleChange,
    mainInformationPokemonSelected,
    color,
    setcolor,
    setmainInformationPokemonSelected
  }: any = UseMainContext();

  useEffect(() => {
    if (mainInformationPokemonSelected) {
      const colorByPoke = colorByPokemonTypes.find(x => x.type === mainInformationPokemonSelected.types[0].type.name);
      if (colorByPoke) {
        setcolor(colorByPoke.color);
      } else {
        setcolor('#DBD8B7');
      }
    } else {
      setcolor('#DBD8B7');
    }
  }, [mainInformationPokemonSelected, setcolor]);

  const isHome = location.pathname === '/';

  return (
    <header 
      className={styles.header_contour} 
      style={{ '--poke-type-color': color } as React.CSSProperties}
    >
      <div className={styles.header_inner}>
        {/* Left Section: Back Button OR Search Bar */}
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
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
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
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <NavLink
              className={styles.back_button}
              onClick={() => setmainInformationPokemonSelected()}
              to="/"
              aria-label="Retour à l'accueil"
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
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </NavLink>
          )}
        </div>

        {/* Center Section: Logo / Brand Title */}
        <div className={styles.header_center}>
          <NavLink 
            to="/" 
            onClick={() => setmainInformationPokemonSelected()} 
            className={styles.logo_link}
          >
            <h1 className={styles.header_title}>Poke Project</h1>
          </NavLink>
        </div>

        {/* Right Section: Balanced spacing element */}
        <div className={styles.header_right}>
          {/* Symmetrical balance spacer */}
        </div>
      </div>
    </header>
  );
}

