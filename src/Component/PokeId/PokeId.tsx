import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../utils/apiAndDatabase';
import { getNameInOtherLanguage } from '../../utils/transform';
import styles from './PodeId.module.css';
import { UseMainContext } from '../../context/MainContext.jsx';
import PokeLoader from '../UI/PokeLoader.js';

import Ability from './Ability.js';
import Varieties from './Varieties.js';
import PokemonHeader from './PokemonHeader.tsx';
import PokemonProfile from './PokemonProfile.tsx';
import {
  flavor_text_entrie,
  PokeType,
} from '../../../type-pokemons.ts';
import Evolutions from './Evolutions.tsx';
import DecorativeCard from '../UI/DecorativeCard.tsx';



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
  const [elementDescription, setelementDescription] = useState<flavor_text_entrie[]>([]);


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
        isShinny={isShinny}
        genre={genre}
        handleChooseShiny={handleChooseShiny}
        setGenre={setGenre}
        color={color}
        hasGenderDifferences={pokemon.has_gender_differences}
      />
    )}
    {pokemon && pokemon?.abilities?.length > 0 && (
      <DecorativeCard
        color={color}
        contentClassName={styles.abilitiesContainer}
        pattern="pokeball"
      >
          <div className={styles.abilitiesHeader}>
            <span className={styles.abilitiesEyebrow}>Capacités spéciales</span>
            <h3>Talents</h3>
          </div>
          <div className={styles.abilitiesGrid}>
            {pokemon?.abilities.map((ability, i) => {
              return <Ability key={i} url={ability.ability.url} /> })}
          </div>
      </DecorativeCard>
    )}
    {pokemon && (
      <>
        {pokemon.varieties.filter(v => !v.is_default).length > 0 && (
          <DecorativeCard
            color={color}
            contentClassName={styles.varietiesContainer}
            pattern="cornerCircle"
          >
            <div className={styles.varietiesHeader}>
              <span className={styles.varietiesEyebrow}>Formes alternatives</span>
              <h3>Variétés</h3>
            </div>
            <div className={styles.varietiesGrid}>
              {pokemon.varieties.filter(v => !v.is_default).map(variety => (
                <Varieties key={variety.pokemon.name} variety={variety}></Varieties>
              ))}
            </div>
          </DecorativeCard>
        )}
        <Evolutions url={pokemon.evolution_chain.url} pokemon={pokemon} color={color}/>
      </>
    )}
      </div>
  )
}
