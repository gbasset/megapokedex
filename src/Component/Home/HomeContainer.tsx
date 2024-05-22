/* eslint-disable no-inner-declarations */
import React, { useEffect } from 'react'

import Box from '../UI/Box';
import {UseMainContext} from '../../context/MainContext.jsx';
import PokeLoader from '../UI/PokeLoader.js';
import { PokeType } from '../../../type-pokemons.js';
export default function HomeContainer() {
    const {				
    isLoading,
    searchResults,
    scrollPosition
    } =UseMainContext();
    
    useEffect(()=>{
      if(scrollPosition){
        window.scrollTo(0, scrollPosition);
      }
    },[]);
  return (
    <div className='pokedex_container' >
      {isLoading && <PokeLoader />}
        {searchResults.map((pokemon:PokeType) => <Box key={pokemon.id} pokemon={pokemon} > </Box>)}
    </div>
  )
}
