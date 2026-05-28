/* eslint-disable no-inner-declarations */
import { useEffect } from 'react'

import Box from '../UI/Box';
import {UseMainContext} from '../../context/MainContext.jsx';
import PokeLoader from '../UI/PokeLoader.js';
import { PokeType } from '../../../type-pokemons.js';
import styles from './HomeContainer.module.css';

interface MainContextValue {
  isLoading: boolean;
  searchResults: PokeType[];
  scrollPosition: number;
}

export default function HomeContainer() {
    const {				
    isLoading,
    searchResults,
    scrollPosition
    } = UseMainContext() as MainContextValue;

    useEffect(()=>{
      if(scrollPosition){
        window.scrollTo(0, scrollPosition);
      }
    },[scrollPosition]);
  return (
    <div className={styles.pokedexContainer} >
      {isLoading && <PokeLoader />}
        {searchResults.map((pokemon:PokeType) => <Box key={pokemon.id} pokemon={pokemon} />)}
    </div>
  )
}
