import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../utils/apiAndDatabase';
import { getNameInOtherLanguage, getPrincipalSpriteFrontPokemon } from '../../utils/transform';
import styles from './PodeId.module.css';
import { UseMainContext } from '../../context/MainContext.jsx';
import PokeLoader from '../UI/PokeLoader.js';

import Habitat from './Habitat.js';
import Ability from './Ability.js';
import Stats from './Stats.js';
import Varieties from './Varieties.js';
import Image from '../UI/Image.js';
import PokemonHeader from './PokemonHeader.tsx';
import PokemonProfile from './PokemonProfile.tsx';
import {
  flavor_text_entrie,
  PokeType,
  sprite
} from '../../../type-pokemons.ts';
import SvgMal from './SvgMal.tsx';
import SvgFemale from './SvgFemale.tsx';
import Evolutions from './Evolutions.tsx';



export default function PokeId() {
  const {
    setmainInformationPokemonSelected,
    handleChooseShiny,
    genre,
    setGenre,
    isShinny,
    color
  } = UseMainContext();

  const {id} = useParams();
  const [pokemon, setpokemon] = useState<PokeType | undefined>()
  console.log('🚀🐱 😻 --///** ~ file: PokeId.tsx:9 ~ PokeId ~ pokemon:', pokemon)
  const [elementDescription, setelementDescription] = useState<[flavor_text_entrie | []]>([]);


  const [officialArtWork, setofficialArtWork] = useState<sprite['other']['official-artwork'] | undefined>(undefined);
  const [isLoading, setisLoading] = useState(true);
  function getFavoriteText (poke: PokeType | any, idLanguage: string){
    const txtFav = poke.flavor_text_entries.filter((txt:flavor_text_entrie )=> txt.language.name === idLanguage);
    return txtFav.filter((x:flavor_text_entrie )=> x.version.name === "sword");
  }
 
  useEffect(()=>{
    axios.get(baseUrl+`pokemon-species/${id}`)
    .then(res =>{
      const poke = res.data
      axios.get(baseUrl+`pokemon/${poke.id}`)
      .then(x => {
       return{
        ...poke,
        ...x.data
       }
      }).then(
        elementPoke => {
          elementPoke.friendlyName = getNameInOtherLanguage(elementPoke,'fr')
          setisLoading(false);
          setpokemon(elementPoke);
          setmainInformationPokemonSelected(elementPoke);
        setelementDescription(getFavoriteText(elementPoke, 'fr'))
        setofficialArtWork(getPrincipalSpriteFrontPokemon(elementPoke));
        }
      )
    })
    .catch(err => {
        console.error(err);
        setisLoading(false);
    })
},[id,setpokemon,setisLoading,setmainInformationPokemonSelected]);


useEffect(()=> {
  if(pokemon){
    if(!pokemon.has_gender_differences){
      if(genre === 'female'){
        setGenre('normal')
      }
    }
  }
},[genre, pokemon,setGenre])



  return (
    <div>
       {isLoading && <PokeLoader />}

        <PokemonHeader pokemon={pokemon} flavorText={elementDescription} />
    {!isLoading && pokemon && (
      <PokemonProfile
        pokemon={pokemon}
        officialArtWork={officialArtWork}
        isShinny={isShinny}
        genre={genre}
        handleChooseShiny={handleChooseShiny}
        setGenre={setGenre}
        color={color}
        hasGenderDifferences={pokemon.has_gender_differences}
      />
    )}
    {pokemon && pokemon?.abilities?.length > 0 && (
         <section className={styles.element}>
        <div className={styles.element_container}>
         <h3>Talents</h3>
          {pokemon?.abilities.map((ability, i) => {
          return <Ability key={i} url={ability.ability.url} /> })}
        </div>
        </section>
    )}
    {pokemon && (
      <div>
        {pokemon?.varieties.filter(v => !v.is_default).map(variety => <Varieties key={variety.pokemon.name} variety={variety}></Varieties>)
        }
        <Evolutions url={pokemon.evolution_chain.url} pokemon={pokemon}/>
      </div>
    )}
      </div>
  )
}
